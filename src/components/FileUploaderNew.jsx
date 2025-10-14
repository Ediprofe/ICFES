/**
 * ✅ Componente: File Uploader (Nuevo - Simplificado)
 * Carga de archivos Excel con Zustand
 */

import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';

export const FileUploaderNew = () => {
  const [dragActive, setDragActive] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  
  const loading = useAnalysisStore((state) => state.loading);
  const error = useAnalysisStore((state) => state.error);
  const loadBaseYear = useAnalysisStore((state) => state.loadBaseYear);
  const enableComparisonMode = useAnalysisStore((state) => state.enableComparisonMode);
  const clearError = useAnalysisStore((state) => state.clearError);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = async (file) => {
    // Validar tipo de archivo
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
      return;
    }
    
    clearError();
    const result = await loadBaseYear(file);
    
    if (result.success) {
      // Mostrar diálogo para preguntar si quiere análisis comparativo
      setShowComparisonDialog(true);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Procesando archivo Excel..." />;
  }
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cargar Datos ICFES
          </h2>
          <p className="text-gray-600">
            Arrastra tu archivo Excel o haz clic para seleccionarlo
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error al cargar el archivo</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
        
        <form
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onSubmit={(e) => e.preventDefault()}
        >
          <label
            htmlFor="file-upload"
            className={`
              relative flex flex-col items-center justify-center
              w-full h-64 border-2 border-dashed rounded-lg
              cursor-pointer transition-all
              ${dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {dragActive ? (
                <Upload className="w-16 h-16 text-blue-500 mb-4" />
              ) : (
                <FileSpreadsheet className="w-16 h-16 text-gray-400 mb-4" />
              )}
              
              <p className="mb-2 text-lg font-semibold text-gray-700">
                {dragActive ? 'Suelta el archivo aquí' : 'Haz clic o arrastra el archivo'}
              </p>
              <p className="text-sm text-gray-500">
                Archivo Excel (.xlsx o .xls)
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleChange}
            />
          </label>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📋 Formato requerido:</strong> El archivo debe contener las columnas:
            Año, ¿PIAR?, Grupo, Nombre, Apellido, Lectura crítica, Matemáticas, Sociales, Naturales, Inglés, Global
          </p>
        </div>
      </div>
      
      {/* Diálogo de análisis comparativo */}
      {showComparisonDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ¿Análisis Comparativo?
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Deseas cargar datos de años anteriores para realizar un análisis comparativo multi-año?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  enableComparisonMode();
                  setShowComparisonDialog(false);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sí, cargar más años
              </button>
              <button
                onClick={() => setShowComparisonDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                No, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
