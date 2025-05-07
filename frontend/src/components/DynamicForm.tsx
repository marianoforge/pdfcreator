import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

// Template interfaces
interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder: string;
  rows?: number;
}

interface FormSection {
  step: number;
  section: string;
  fields: FormField[];
  infoText?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  template_id: string;
  fields: FormSection[];
  defaults?: Record<string, string>;
}

interface PDFResponse {
  document: {
    download_url: string | null;
    preview_url: string | null;
    id: string;
    status: string;
  };
}

export function DynamicForm() {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch template on component mount
  useEffect(() => {
    async function fetchTemplate() {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8001/api/templates/`, {
          params: { id: templateId }
        });
        
        if (response.data && response.data.template) {
          setTemplate(response.data.template);
          
          // Initialize form data with default values if available
          if (response.data.template.defaults) {
            setFormData(response.data.template.defaults);
          } else {
            // Initialize with empty strings for each field
            const initialData: Record<string, string> = {};
            response.data.template.fields.forEach((section: FormSection) => {
              section.fields.forEach((field: FormField) => {
                initialData[field.id] = "";
              });
            });
            setFormData(initialData);
          }
        } else {
          setError("No se encontró la plantilla solicitada");
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        setError("Error al cargar la plantilla. Por favor, inténtelo de nuevo.");
      } finally {
        setLoading(false);
      }
    }

    if (templateId) {
      fetchTemplate();
    } else {
      setError("No se especificó un ID de plantilla");
      setLoading(false);
    }
  }, [templateId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMaxStep = (): number => {
    if (!template) return 1;
    const steps = template.fields.map(section => section.step);
    return Math.max(...steps);
  };

  const goToNextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => Math.min(prev + 1, getMaxStep()));
  };

  const goToPreviousStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const isCurrentStepValid = (): boolean => {
    if (!template) return false;
    
    // Get all required fields for current step
    const requiredFields: string[] = [];
    
    template.fields
      .filter(section => section.step === currentStep)
      .forEach(section => {
        section.fields
          .filter(field => field.required)
          .forEach(field => {
            requiredFields.push(field.id);
          });
      });
    
    // Check if all required fields have values
    return requiredFields.every(fieldId => !!formData[fieldId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < getMaxStep()) {
      goToNextStep();
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      console.log("Enviando petición al backend...");
      const response = await axios.post<PDFResponse>("http://localhost:8001/api/pdf/", {
        template_id: template?.template_id,
        formData: formData,
      });
      
      console.log("Respuesta recibida:", response.data);
      
      if (!response.data || !response.data.document) {
        setError("La respuesta no tiene el formato esperado");
        return;
      }
      
      const pdfUrl = response.data.document.download_url || response.data.document.preview_url;
      
      console.log("URL del PDF:", pdfUrl);
      
      if (pdfUrl) {
        try {
          new URL(pdfUrl);
          
          navigate('/view-pdf', { 
            state: { 
              pdfUrl,
              documentId: response.data.document.id,
              status: response.data.document.status
            } 
          });
        } catch (urlError) {
          setError(`La URL del PDF no es válida: ${pdfUrl}`);
        }
      } else {
        setError("No se pudo obtener una URL válida del PDF generado");
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error al generar PDF:", error);
      
      if (error.response) {
        setError(`Error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        setError("No se recibió respuesta del servidor. Verifica la conexión.");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Error</h2>
          <p className="text-gray-700 text-center">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="text-yellow-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Plantilla no encontrada</h2>
          <p className="text-gray-700 text-center">No se pudo cargar la plantilla solicitada.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const maxStep = getMaxStep();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 py-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {template.name}
            </h1>
            <p className="text-blue-400">
              {template.description}
            </p>
            
            {/* Progress Steps */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center">
                {Array.from({ length: maxStep }, (_, i) => i + 1).map((step) => (
                  <>
                    <div 
                      key={`step-${step}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
                        ${currentStep === step ? "bg-white text-primary-600" : 
                          (currentStep > step ? "bg-blue-200 text-primary-700" : "bg-blue-200 text-primary-700")}`}
                    >
                      {step}
                    </div>
                    {step < maxStep && (
                      <div 
                        key={`connector-${step}`}
                        className={`w-16 h-1 ${currentStep > step ? "bg-white" : "bg-blue-200"}`}
                      ></div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
          
          {/* Body */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dynamic form sections for current step */}
              {template.fields
                .filter(section => section.step === currentStep)
                .map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">{section.section}</h3>
                    <div className="space-y-5">
                      {section.fields.map((field) => (
                        <div key={field.id}>
                          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {field.name} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          
                          {field.type === 'textarea' ? (
                            <textarea
                              id={field.id}
                              name={field.id}
                              value={formData[field.id] || ''}
                              onChange={handleInputChange}
                              rows={field.rows || 4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder={field.placeholder}
                              required={field.required}
                            ></textarea>
                          ) : field.type === 'select' ? (
                            <select
                              id={field.id}
                              name={field.id}
                              value={formData[field.id] || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              required={field.required}
                            >
                              <option value="">{field.placeholder}</option>
                              {/* If options were included in the field definition, they would be mapped here */}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              id={field.id}
                              name={field.id}
                              value={formData[field.id] || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder={field.placeholder}
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}
                      
                      {section.infoText && (
                        <div className="flex items-center mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2">
                            Info
                          </span>
                          <span className="text-sm text-blue-700">
                            {section.infoText}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {sectionIndex < template.fields.filter(s => s.step === currentStep).length - 1 && (
                      <div className="h-px bg-gray-200 my-6"></div>
                    )}
                  </div>
                ))}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button
                  type="submit"
                  disabled={!isCurrentStepValid() || submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      Generando...
                    </>
                  ) : currentStep < maxStep ? (
                    <>
                      Siguiente
                      <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  ) : (
                    'Generar PDF'
                  )}
                </button>
              </div>
              
              {/* Error message if any */}
              {error && (
                <div className="bg-red-50 p-4 rounded-md border border-red-200 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}