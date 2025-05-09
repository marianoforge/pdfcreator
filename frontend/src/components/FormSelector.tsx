import { useState } from "react";
import { Link } from "react-router-dom";

export function FormSelector() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Generador de Documentos
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Crea informes y documentos PDF personalizados de manera rápida y
            sencilla.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
            <Link to="/form/plan-prevencion" className="block p-6">
              <div className="flex items-center">
                <div className="rounded-lg p-3 bg-indigo-100 text-indigo-700 ring-indigo-600/20">
                  <span className="text-2xl" role="img" aria-label="Plan">
                    📋
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Plan de Prevención (Dinámico)
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Formulario dinámico basado en JSON para generar un plan
                  </p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex-1 bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
            <Link to="/legacy-form" className="block p-6">
              <div className="flex items-center">
                <div className="rounded-lg p-3 bg-green-100 text-green-700 ring-green-600/20">
                  <span className="text-2xl" role="img" aria-label="ReactPDF">
                    📄
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Valoración del Hogar{" "}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Formulario para generar un plan de prevención
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
