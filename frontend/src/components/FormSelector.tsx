import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Template {
  id: string;
  name: string;
  description: string;
}

export function FormSelector() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8001/api/templates/", {
          params: { list: "true" }
        });
        
        if (response.data && response.data.templates) {
          setTemplates(response.data.templates);
          if (response.data.templates.length === 1) {
            setSelectedTemplate(response.data.templates[0].id);
          }
        } else {
          setError("No se encontraron plantillas disponibles");
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Error al cargar las plantillas. Por favor, inténtelo de nuevo.");
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTemplate) {
      navigate(`/form/${selectedTemplate}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Cargando plantillas...</p>
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
            onClick={() => window.location.reload()}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-600 py-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Generador de Documentos
            </h1>
            <p className="text-blue-400">
              Seleccione el tipo de documento que desea generar
            </p>
          </div>
          
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Seleccione un tipo de documento</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedTemplate && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {templates.find(t => t.id === selectedTemplate)?.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedTemplate}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 