import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Form } from "./components/Form";
import { PDFViewer } from "./components/PDFViewer";
import { FormSelector } from "./components/FormSelector";
import { DynamicForm } from "./components/DynamicForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center text-xl font-bold text-gray-800">
                  Generador de PDF
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<FormSelector />} />
          <Route path="/form/:templateId" element={<DynamicForm />} />
          <Route path="/legacy-form" element={<Form />} />
          <Route path="/view-pdf" element={<PDFViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
