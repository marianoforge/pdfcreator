import requests
from decouple import config
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

def build_pdf_payload(form_data: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
 
    logger.info(f"Construyendo payload para PDFMonkey. Datos del formulario: {form_data}")
    
 
    payload = {}
    
    payload["patient_name"] = form_data.get("patient_name", "")
    payload["date"] = form_data.get("date", "")
    payload["orientation_name"] = form_data.get("orientation_name", "")
    payload["recommendation"] = form_data.get("recommendation", "")
    payload["additional_info"] = form_data.get("additional_info", "")
    
    logger.info(f"Payload final para PDFMonkey: {payload}")
    return payload


def send_to_pdfmonkey(template_id: str, payload: Dict[str, Any]) -> requests.Response:

    final_payload = {
        "document": {
            "document_template_id": template_id,
            "payload": payload
        }
    }

    logger.info(f"Enviando a PDFMonkey con template_id={template_id}")
    logger.info(f"Payload completo: {final_payload}")
    
    response = requests.post(
        "https://api.pdfmonkey.io/api/v1/documents",
        json=final_payload,
        headers={
            "Authorization": f"Bearer {config('PDFMONKEY_API_KEY')}",
            "Content-Type": "application/json"
        }
    )
    
    logger.info(f"Respuesta de PDFMonkey: status_code={response.status_code}")
    logger.info(f"Respuesta detallada: {response.text[:1000]}")
    
    return response