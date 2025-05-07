from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.pdfmonkey import build_pdf_payload, send_to_pdfmonkey
import requests
from decouple import config
import logging
import time
import json
import os
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

TEMPLATES = {
    "Plan de Prevención": {
        "name": "Plan de Prevención",
        "template_id": config('PDFMONKEY_PREVENTION_TEMPLATE_ID', default="tu-id-de-template-pdfmonkey"),
    }
}

class GeneratePDFView(APIView):

    def post(self, request) -> Response:
        form_data = request.data.get("formData", {})
        template_name = request.data.get("template_id", "")
        
        logger.info(f"Generando PDF para template: {template_name} con datos: {form_data}")
        
        pdfmonkey_api_key = config('PDFMONKEY_API_KEY', default=None)
        if not pdfmonkey_api_key:
            logger.error("No se encontró API key de PDFMonkey")
            return Response({"error": "Falta configuración de PDFMonkey"}, status=500)

        try:
            template = TEMPLATES.get(template_name, {})
            template_id = template.get("template_id") if template else None
            
            if not template_id:
                template_id = config('PDFMONKEY_PREVENTION_TEMPLATE_ID', default=None)
                if not template_id:
                    logger.error(f"No se pudo encontrar el ID del template: {template_name}")
                    return Response({
                        "error": f"No se encontró el ID para el template '{template_name}'."
                    }, status=400)
            
            logger.info(f"Usando template_id: {template_id}")
            
            payload = build_pdf_payload(form_data, template)
            
            pdfmonkey_response = send_to_pdfmonkey(template_id, payload)
            
            if pdfmonkey_response.status_code == 201:
                response_data = pdfmonkey_response.json()
                document_id = response_data.get('document', {}).get('id')
                logger.info(f"PDF generado correctamente. ID: {document_id}")
                
                document = response_data.get('document', {})
                status_doc = document.get('status')
                logger.info(f"Estado del documento: {status_doc}")
                
                if status_doc == 'draft' and document_id:
                    logger.info(f"Documento en estado 'draft'. Esperando para consultar estado...")
                    
                    time.sleep(2)
                    
                    check_url = f"https://api.pdfmonkey.io/api/v1/documents/{document_id}"
                    check_response = requests.get(
                        check_url,
                        headers={
                            "Authorization": f"Bearer {pdfmonkey_api_key}",
                            "Content-Type": "application/json"
                        }
                    )
                    
                    if check_response.status_code == 200:
                        updated_data = check_response.json()
                        logger.info(f"Estado actualizado del documento: {updated_data.get('document', {}).get('status')}")
                        
                        response_data = updated_data
                
                return Response(response_data, status=201)
            else:
                logger.error(f"Error al generar PDF: {pdfmonkey_response.status_code} - {pdfmonkey_response.text}")
                return Response({
                    "error": "PDF creation failed", 
                    "details": pdfmonkey_response.text,
                    "status_code": pdfmonkey_response.status_code
                }, status=400)
                
        except Exception as e:
            logger.exception(f"Error inesperado al generar PDF: {str(e)}")
            return Response({
                "error": str(e),
                "message": "Error en el proceso de generación de PDF"
            }, status=500)

class CheckDocumentStatusView(APIView):

    def get(self, request, document_id) -> Response:
        try:
            pdfmonkey_api_key = config('PDFMONKEY_API_KEY', default=None)
            if not pdfmonkey_api_key:
                logger.error("No se encontró API key de PDFMonkey")
                return Response({"error": "Falta configuración de PDFMonkey"}, status=500)
                
            check_url = f"https://api.pdfmonkey.io/api/v1/documents/{document_id}"
            response = requests.get(
                check_url,
                headers={
                    "Authorization": f"Bearer {pdfmonkey_api_key}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code == 200:
                response_data = response.json()
                logger.info(f"Estado del documento {document_id}: {response_data.get('document', {}).get('status')}")
                return Response(response_data, status=200)
            else:
                logger.error(f"Error al verificar estado del documento: {response.status_code} - {response.text}")
                return Response({
                    "error": "Status check failed",
                    "details": response.text,
                    "status_code": response.status_code
                }, status=400)
                
        except Exception as e:
            logger.exception(f"Error inesperado al verificar estado: {str(e)}")
            return Response({
                "error": str(e),
                "message": "Error verificando el estado del documento"
            }, status=500)

class FormTemplatesView(APIView):
    
    def get(self, request) -> Response:
        try:
            json_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                         'pdf', 'data', 'form_templates.json')
            
            if not os.path.exists(json_file_path):
                logger.error(f"No se encontró el archivo de templates: {json_file_path}")
                return Response({
                    "error": "No se encontró el archivo de configuración de formularios"
                }, status=404)
            
            with open(json_file_path, 'r', encoding='utf-8') as file:
                templates_data = json.load(file)
            
            if request.query_params.get('list') == 'true':
                template_list = [
                    {
                        "id": template["id"],
                        "name": template["name"],
                        "description": template.get("description", "")
                    } 
                    for template in templates_data.get("templates", [])
                ]
                return Response({"templates": template_list}, status=200)
            
            template_id = request.query_params.get('id')
            if template_id:
                template = next((t for t in templates_data.get("templates", []) if t["id"] == template_id), None)
                if template:
                    return Response({"template": template}, status=200)
                else:
                    return Response({"error": f"No se encontró el template con ID: {template_id}"}, status=404)
            
            return Response(templates_data, status=200)
            
        except json.JSONDecodeError as e:
            logger.exception(f"Error al decodificar el archivo JSON: {str(e)}")
            return Response({
                "error": "Error al procesar el archivo de configuración",
                "message": str(e)
            }, status=500)
            
        except Exception as e:
            logger.exception(f"Error inesperado al obtener templates: {str(e)}")
            return Response({
                "error": str(e),
                "message": "Error al obtener la configuración de los formularios"
            }, status=500)