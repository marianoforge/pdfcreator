import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlanPDFViewer } from './PlanPDF';
import { BlobProvider } from '@react-pdf/renderer';
import { PlanPDF } from './PlanPDF';

interface FormData {
  patient_name: string;
  date: string;
  orientation_name: string;
  recommendation: string;
  additional_info: string;
}

export function ReactPDFViewer() {
  const location = useLocation();
  const [zoom, setZoom] = useState<number>(100);
  const iframeRef = useRef<HTMLDivElement>(null);
  
  // Extraer formData y templateName de location.state de forma segura
  const formData = location.state?.formData as FormData | undefined;
  const templateName = location.state?.templateName as string | undefined;

  // Funciones para manejar el zoom
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 20, 60));
  };

  const handleFullScreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  // Redirigir al formulario si se intenta acceder directamente sin datos
  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-600 py-6 px-6 text-center">
            <h2 className="text-xl font-bold text-white">Visualizador de PDF</h2>
            <p className="text-blue-100 text-sm mt-1">Plan de Prevención y Reducción de Riesgos</p>
          </div>
          
          <div className="p-8">
            <div className="p-5 mb-5 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-700 mb-1">Error al cargar el PDF</h3>
                  <p className="text-sm text-red-700">No se recibieron datos para generar el PDF. Debes completar el formulario primero.</p>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-gray-200 my-5"></div>
            
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio
              </Link>
              
              <Link
                to="/legacy-form"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ir al formulario simple
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Título del documento que se mostrará en el encabezado
  const documentTitle = templateName 
    ? templateName 
    : "Plan de Prevención";

  // Nombre del archivo para la descarga
  const downloadFileName = templateName 
    ? `${templateName}-${formData.patient_name}.pdf` 
    : `Plan-${formData.patient_name}.pdf`;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-800 mr-3">{documentTitle}</h2>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
            Generado con React-PDF
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-md overflow-hidden shadow-sm">
            <button 
              onClick={handleZoomOut}
              className="px-2 py-1.5 text-gray-700 hover:bg-gray-200 focus:outline-none"
              aria-label="Reducir zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-gray-900">{zoom}%</span>
            <button 
              onClick={handleZoomIn}
              className="px-2 py-1.5 text-gray-700 hover:bg-gray-200 focus:outline-none"
              aria-label="Aumentar zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <button 
            onClick={handleFullScreen}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            Pantalla completa
          </button>
          
          <BlobProvider document={<PlanPDF formData={formData} templateTitle={templateName} />}>
            {({ blob, url }) => (
              url && blob ? (
                <a
                  href={url}
                  download={downloadFileName}
                  className="inline-flex items-center px-3 py-1.5 border border-green-500 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar PDF
                </a>
              ) : (
                <button 
                  disabled
                  className="inline-flex items-center px-3 py-1.5 border border-green-500 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 opacity-50"
                >
                  Preparando PDF...
                </button>
              )
            )}
          </BlobProvider>
          
          <Link
            to="/"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </Link>
        </div>
      </div>
      <div className="flex-grow overflow-auto p-6 bg-gray-50">
        <div 
          ref={iframeRef}
          className="mx-auto bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300"
          style={{ 
            width: `${zoom}%`, 
            maxWidth: '100%',
            height: 'calc(100vh - 6rem)',
            minHeight: '300px'
          }}
        >
          <PlanPDFViewer formData={formData} templateTitle={templateName} />
        </div>
      </div>
    </div>
  );
} 