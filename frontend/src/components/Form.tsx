import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  patient_name: string;
  date: string;
  orientation_name: string;
  recommendation: string;
  additional_info: string;
}

export function Form() {
  const [formData, setFormData] = useState<FormData>({
    patient_name: "Marta Modificación Cita",
    date: "marzo de 2025",
    orientation_name: "Marta Gimenez",
    recommendation: "Mantener una dieta equilibrada y realizar actividad física regular.",
    additional_info: ""
  });
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const goToNextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(2);
  };

  const goToPreviousStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      goToNextStep();
      return;
    }
    
    setLoading(true);

    try {
      // En lugar de enviar al backend, vamos a usar ReactPDF
      console.log("Generando PDF con ReactPDF...");
      
      // Navegamos a la ruta de visualización de PDF con los datos del formulario
      navigate('/react-pdf', { 
        state: { 
          formData
        } 
      });
    } catch (err) {
      console.error("Error al generar PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-600 py-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Plan de Prevención y Reducción de Riesgos
            </h1>
            <p className="text-blue-400">
              Genera un plan personalizado para fomentar el envejecimiento saludable
            </p>
            <div className="flex justify-center mt-4">
              <div className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
                    ${currentStep === 1 ? "bg-white text-primary-600" : "bg-blue-200 text-primary-700"}`}
                >
                  1
                </div>
                <div className={`w-16 h-1 ${currentStep === 1 ? "bg-blue-200" : "bg-white"}`}></div>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
                    ${currentStep === 2 ? "bg-white text-primary-600" : "bg-blue-200 text-primary-700"}`}
                >
                  2
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {currentStep === 1 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Información del Paciente</h3>
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Paciente
                          </label>
                          <input
                            type="text"
                            id="patient_name"
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nombre completo"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha
                          </label>
                          <input
                            type="text"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Mes de año"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Información del Orientador</h3>
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="orientation_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Orientador
                          </label>
                          <input
                            type="text"
                            id="orientation_name"
                            name="orientation_name"
                            value={formData.orientation_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nombre del profesional"
                            required
                          />
                        </div>
                        
                        <div className="flex items-center mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2">
                            Info
                          </span>
                          <span className="text-sm text-blue-700">
                            El plan será personalizado con los datos proporcionados
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-6"></div>
                    <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Recomendaciones</h3>
                    <div>
                      <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700 mb-1">
                        Recomendación Personalizada
                      </label>
                      <textarea
                        id="recommendation"
                        name="recommendation"
                        value={formData.recommendation}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Escriba aquí la recomendación personalizada para el paciente..."
                        required
                      ></textarea>
                    </div>
                  </div>
                  
              
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                /* Paso 2: Información adicional */
                <>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Información Adicional</h3>
                    <div>
                      <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-1">
                        Más información para agregar
                      </label>
                      <textarea
                        id="additional_info"
                        name="additional_info"
                        value={formData.additional_info}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ingrese cualquier información adicional que desee incluir en el plan..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex flex-col sm:flex-row-reverse gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-1/2 py-3 px-4 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generando Plan de Prevención...</span>
                        </div>
                      ) : "Generar Plan de Prevención"}
                    </button>
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="w-full sm:w-1/2 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      Volver
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
