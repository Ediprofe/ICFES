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
  const [showYearDialog, setShowYearDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [yearLabel, setYearLabel] = useState('');
  
  const loading = useAnalysisStore((state) => state.loading);
  const error = useAnalysisStore((state) => state.error);
  const loadBaseYear = useAnalysisStore((state) => state.loadBaseYear);
  const enableComparisonMode = useAnalysisStore((state) => state.enableComparisonMode);
  const disableComparisonMode = useAnalysisStore((state) => state.disableComparisonMode);
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
  
  const handleFile = (file) => {
    // Validar tipo de archivo
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
      return;
    }
    
    // Guardar archivo y mostrar diálogo para etiqueta de año
    setPendingFile(file);
    
    // Intentar extraer año del nombre del archivo (ej: SJ2024.xlsx -> 2024)
    const yearMatch = file.name.match(/(\d{4})/);
    if (yearMatch) {
      setYearLabel(yearMatch[1]);
    } else {
      setYearLabel(new Date().getFullYear().toString());
    }
    
    setShowYearDialog(true);
  };
  
  const handleConfirmYear = async () => {
    if (!yearLabel || yearLabel.trim() === '') {
      alert('Por favor, ingresa un año válido');
      return;
    }
    
    const year = parseInt(yearLabel);
    if (isNaN(year) || year < 1900 || year > 2100) {
      alert('Por favor, ingresa un año válido (entre 1900 y 2100)');
      return;
    }
    
    setShowYearDialog(false);
    clearError();
    
    const result = await loadBaseYear(pendingFile, year);
    
    if (result.success) {
      setPendingFile(null);
      setYearLabel('');
      // Mostrar diálogo para preguntar si quiere análisis comparativo
      setShowComparisonDialog(true);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Procesando archivo Excel..." />;
  }
  
  return (
    <>
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 border-2 border-blue-200">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full p-4 mb-4 shadow-lg">
            <FileSpreadsheet size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
            📊 Cargar datos ICFES
          </h2>
          <p className="text-lg text-gray-600">
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
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <label
              htmlFor="file-upload"
              className={`
                relative flex flex-col items-center justify-center
                w-full h-72 border-3 border-dashed rounded-2xl
                cursor-pointer transition-all duration-300 shadow-lg
                ${dragActive 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105' 
                  : 'border-blue-400 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className={`rounded-full p-6 mb-6 shadow-xl transition-all duration-300 ${
                  dragActive 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 scale-110' 
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-110'
                }`}>
                  {dragActive ? (
                    <Upload className="w-16 h-16 text-white" />
                  ) : (
                    <FileSpreadsheet className="w-16 h-16 text-white" />
                  )}
                </div>
                
                <p className="mb-3 text-2xl font-bold text-gray-800">
                  {dragActive ? '🎯 Suelta el archivo aquí' : '📂 Haz clic o arrastra el archivo'}
                </p>
                <p className="text-base text-gray-600 font-medium">
                  Archivo Excel (.xlsx o .xls)
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Tamaño máximo: 10MB
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
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📋 Formato requerido:</strong> El archivo debe contener las columnas:
            ¿PIAR?, Grupo, Nombre, Apellido, Lectura crítica, Matemáticas, Sociales, Naturales, Inglés, Global
          </p>
          <p className="text-sm text-blue-700 mt-2">
            💡 <strong>Nota:</strong> Se te pedirá que etiquetes el año del archivo al cargarlo (ej: 2024, 2025).
          </p>
        </div>
      </div>
      
      {/* Diálogo de etiqueta de año */}
      {showYearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📅 Etiqueta de Año
            </h3>
            <p className="text-gray-600 mb-4">
              Por favor, ingresa el año correspondiente a estos datos:
            </p>
            <input
              type="number"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
              placeholder="Ej: 2024"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-center"
              min="1900"
              max="2100"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmYear();
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Archivo: <strong>{pendingFile?.name}</strong>
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleConfirmYear}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setShowYearDialog(false);
                  setPendingFile(null);
                  setYearLabel('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
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
                onClick={() => {
                  disableComparisonMode();
                  setShowComparisonDialog(false);
                }}
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
