import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface PDFViewerState {
  pdfUrl: string;
  documentId?: string;
  status?: string;
}

export function PDFViewer() {
  const location = useLocation();
  const state = location.state as PDFViewerState | undefined;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [pdfUrl, setPdfUrl] = useState<string | null>(state?.pdfUrl || null);
  const [documentStatus, setDocumentStatus] = useState<string | undefined>(state?.status);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const documentId = state?.documentId;
  
  useEffect(() => {
    console.log("Estado recibido en PDFViewer:", state);
    console.log("URL del PDF:", pdfUrl);
    
    const checkDocumentStatus = async () => {
      if (!documentId) return;
      
      if (documentStatus === 'draft') {
        try {
          setCheckingStatus(true);
          const response = await axios.get(`http://localhost:8001/api/pdf/status/${documentId}/`);
          console.log("Estado actualizado del documento:", response.data);
          
          const document = response.data.document;
          setDocumentStatus(document.status);
          
          if (document.status === 'success') {
            const newUrl = document.download_url || document.preview_url;
            if (newUrl) {
              console.log("Nueva URL del PDF:", newUrl);
              setPdfUrl(newUrl);
            }
          }
        } catch (error) {
          console.error("Error al verificar estado del documento:", error);
        } finally {
          setCheckingStatus(false);
        }
      }
    };
    
    checkDocumentStatus();
    
    const intervalId = setInterval(() => {
      if (documentStatus === 'draft') {
        checkDocumentStatus();
      } else {
        clearInterval(intervalId);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [documentId, documentStatus]);
  
  useEffect(() => {
    if (pdfUrl) {
      try {
        new URL(pdfUrl);
        setIsLoading(false);
      } catch (e) {
        setError(`URL no válida: ${pdfUrl}`);
        setIsLoading(false);
      }
    } else {
      setError("No se recibió ninguna URL para mostrar el PDF");
      setIsLoading(false);
    }
  }, [pdfUrl]);

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

  const handleCheckStatus = () => {
    if (documentId) {
      setCheckingStatus(true);
      axios.get(`http://localhost:8001/api/pdf/status/${documentId}/`)
        .then(response => {
          const document = response.data.document;
          setDocumentStatus(document.status);
          
          if (document.status === 'success') {
            const newUrl = document.download_url || document.preview_url;
            if (newUrl) {
              setPdfUrl(newUrl);
            }
          }
        })
        .catch(error => {
          console.error("Error al verificar estado:", error);
        })
        .finally(() => {
          setCheckingStatus(false);
        });
    }
  };

  if (!pdfUrl || error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-600 py-6 px-6 text-center">
            <h2 className="text-xl font-bold text-white">Visualizador de PDF</h2>
            <p className="text-blue-100 text-sm mt-1">Plan de Prevención y Reducción de Riesgos</p>
          </div>
          
          <div className="p-8">
            {error ? (
              <div className="p-5 mb-5 bg-red-50 border-l-4 border-red-500 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-700 mb-1">Error al cargar el PDF</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 mb-5 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">No hay PDF disponible para mostrar</p>
                </div>
              </div>
            )}
            
            {documentStatus === 'draft' && (
              <div className="p-5 mb-5 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-700 mb-1">Documento en proceso</h3>
                    <p className="text-sm text-yellow-700">El PDF está siendo generado. Estado: 
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ml-2">
                        {documentStatus}
                      </span>
                    </p>
                    <button 
                      onClick={handleCheckStatus}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-yellow-300 text-xs font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      disabled={checkingStatus}
                    >
                      {checkingStatus ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Verificando...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Verificar estado</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {documentId && (
              <div className="p-5 mb-6 bg-blue-50 border border-blue-100 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información del documento
                </h3>
                <div className="text-sm text-blue-700 space-y-3">
                  <div className="flex items-center">
                    <span className="w-32 text-blue-600">ID:</span>
                    <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">{documentId}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-blue-600">Estado:</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                      ${documentStatus === 'success' ? "bg-green-100 text-green-800" : 
                        documentStatus === 'draft' ? "bg-yellow-100 text-yellow-800" : 
                        "bg-gray-100 text-gray-800"}`
                    }>
                      {documentStatus || 'Desconocido'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="h-px bg-gray-200 my-5"></div>
            
            <Link
              to="/"
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al formulario
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Cargando documento PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-800 mr-3">Plan de Prevención</h2>
          {documentStatus && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
              ${documentStatus === 'success' ? "bg-green-100 text-green-800" : 
                documentStatus === 'draft' ? "bg-yellow-100 text-yellow-800" : 
                "bg-gray-100 text-gray-800"}`
            }>
              {documentStatus}
            </span>
          )}
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
          className="mx-auto bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300"
          style={{ 
            width: `${zoom}%`, 
            maxWidth: '100%',
            height: 'calc(100vh - 6rem)',
            minHeight: '300px'
          }}
        >
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}