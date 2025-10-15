/**
 * ✅ Componente: Cargador de Años para Comparación
 * Permite cargar archivos adicionales para análisis multi-año
 */

import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, X } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';

export const ComparisonYearUploader = () => {
  const [dragActive, setDragActive] = useState(false);
  const [showYearDialog, setShowYearDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [yearLabel, setYearLabel] = useState('');
  
  const loading = useAnalysisStore((state) => state.loading);
  const error = useAnalysisStore((state) => state.error);
  const loadComparisonYear = useAnalysisStore((state) => state.loadComparisonYear);
  const clearError = useAnalysisStore((state) => state.clearError);
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  
  // Obtener años disponibles directamente del Map
  const availableYears = multiYearAnalysis?.analyses 
    ? (multiYearAnalysis.analyses instanceof Map
        ? Array.from(multiYearAnalysis.analyses.keys())
        : (Array.isArray(multiYearAnalysis.analyses)
            ? multiYearAnalysis.analyses.map(a => a.year)
            : Object.keys(multiYearAnalysis.analyses).map(Number)))
    : [];
  
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
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
      return;
    }
    
    setPendingFile(file);
    
    // Intentar extraer año del nombre del archivo
    const yearMatch = file.name.match(/(\d{4})/);
    if (yearMatch) {
      setYearLabel(yearMatch[1]);
    } else {
      setYearLabel('');
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
    
    // Verificar que no esté ya cargado
    if (availableYears.includes(year)) {
      alert(`El año ${year} ya está cargado. Por favor, selecciona otro año.`);
      return;
    }
    
    setShowYearDialog(false);
    clearError();
    
    const result = await loadComparisonYear(pendingFile, year);
    
    if (result.success) {
      setPendingFile(null);
      setYearLabel('');
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando año adicional..." />;
  }
  
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Cargar Año Adicional para Comparación
        </h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
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
            htmlFor="comparison-file-upload"
            className={`
              relative flex flex-col items-center justify-center
              w-full h-48 border-2 border-dashed rounded-lg
              cursor-pointer transition-all
              ${dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {dragActive ? (
                <Upload className="w-12 h-12 text-blue-500 mb-3" />
              ) : (
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-3" />
              )}
              
              <p className="mb-2 text-base font-semibold text-gray-700">
                {dragActive ? 'Suelta el archivo aquí' : 'Cargar otro año'}
              </p>
              <p className="text-sm text-gray-500">
                Archivo Excel (.xlsx o .xls)
              </p>
            </div>
            <input
              id="comparison-file-upload"
              type="file"
              className="hidden"
              accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleChange}
            />
          </label>
        </form>
        
        <p className="mt-4 text-sm text-gray-600">
          📊 Años cargados: <strong>{availableYears.join(', ')}</strong>
        </p>
      </div>
      
      {/* Diálogo de etiqueta de año */}
      {showYearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                📅 Etiqueta de Año
              </h3>
              <button
                onClick={() => {
                  setShowYearDialog(false);
                  setPendingFile(null);
                  setYearLabel('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Ingresa el año correspondiente a estos datos:
            </p>
            
            <input
              type="number"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
              placeholder="Ej: 2023"
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
            
            <p className="text-xs text-gray-500 mt-2">
              Años ya cargados: {availableYears.join(', ')}
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
    </>
  );
};
