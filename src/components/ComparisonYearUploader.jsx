/**
 * ✅ Componente: Cargador de Cohortes para Comparación
 * Permite cargar archivos adicionales para análisis multi-cohorte
 */

import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, X, CheckCircle } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';

export const ComparisonYearUploader = () => {
  const [dragActive, setDragActive] = useState(false);
  const [showYearDialog, setShowYearDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [yearLabel, setYearLabel] = useState('');
  
  const loading = useAnalysisStore((state) => state.loading);
  const error = useAnalysisStore((state) => state.error);
  const waitingForMoreYears = useAnalysisStore((state) => state.waitingForMoreYears);
  const loadComparisonYear = useAnalysisStore((state) => state.loadComparisonYear);
  const finishLoadingYears = useAnalysisStore((state) => state.finishLoadingYears);
  const clearError = useAnalysisStore((state) => state.clearError);
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  
  // Obtener cohortes disponibles directamente del Map
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
    
    // Intentar extraer cohorte del nombre del archivo
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
      alert('Por favor, ingresa una cohorte válida');
      return;
    }
    
    // Limpiar espacios
    const cohort = yearLabel.trim();
    
    // Validar formato: permitir números, letras, guiones y algunos caracteres especiales
    const validFormat = /^[a-zA-Z0-9\-_.]+$/;
    if (!validFormat.test(cohort)) {
      alert('Por favor, usa solo letras, números, guiones (-), guiones bajos (_) o puntos (.)');
      return;
    }
    
    // Validar longitud razonable
    if (cohort.length > 20) {
      alert('La cohorte debe tener máximo 20 caracteres');
      return;
    }
    
    // Verificar que no esté ya cargado
    if (availableYears.includes(cohort)) {
      alert(`La cohorte ${cohort} ya está cargada. Por favor, selecciona otra cohorte.`);
      return;
    }
    
    setShowYearDialog(false);
    clearError();
    
    const result = await loadComparisonYear(pendingFile, cohort);
    
    if (result.success) {
      setPendingFile(null);
      setYearLabel('');
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando cohorte adicional..." />;
  }
  
  return (
    <>
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-6 mb-6 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full p-3 shadow-lg">
            <FileSpreadsheet className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              📅 Cargar cohorte adicional para comparación
            </h3>
            <p className="text-sm text-gray-600">Agrega más cohortes para análisis comparativo multi-cohorte</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3 shadow-md animate-shake">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <p className="text-red-800 font-bold text-lg">⚠️ Error al cargar el archivo</p>
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
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <label
              htmlFor="comparison-file-upload"
              className={`
                relative flex flex-col items-center justify-center
                w-full h-56 border-3 border-dashed rounded-2xl
                cursor-pointer transition-all duration-300 shadow-lg
                ${dragActive 
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-teal-50 scale-105' 
                  : 'border-green-400 bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-teal-50'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className={`rounded-full p-6 mb-4 shadow-xl transition-all duration-300 ${
                  dragActive 
                    ? 'bg-gradient-to-br from-green-600 to-teal-700 scale-110' 
                    : 'bg-gradient-to-br from-green-500 to-teal-600 group-hover:scale-110'
                }`}>
                  {dragActive ? (
                    <Upload className="w-12 h-12 text-white" />
                  ) : (
                    <FileSpreadsheet className="w-12 h-12 text-white" />
                  )}
                </div>
                
                <p className="mb-2 text-xl font-bold text-gray-800">
                  {dragActive ? '🎯 Suelta el archivo aquí' : '📄 Cargar otra cohorte'}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Archivo Excel (.xlsx o .xls)
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Arrastra y suelta o haz clic para seleccionar
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
          </div>
        </form>
        
        {availableYears.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {availableYears.length}
                </div>
                <p className="text-sm font-bold text-gray-800">
                  Cohortes cargadas:
                </p>
              </div>
              {waitingForMoreYears && (
                <button
                  onClick={() => finishLoadingYears()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <CheckCircle size={18} />
                  <span>Finalizar carga</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableYears.sort((a, b) => b - a).map(year => (
                <span key={year} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold shadow-md">
                  {year}
                </span>
              ))}
            </div>
            {waitingForMoreYears && (
              <p className="text-xs text-blue-600 mt-3 font-medium">
                💡 Puedes cargar más cohortes o hacer clic en "Finalizar carga" para ver los botones de exportación
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Diálogo de etiqueta de cohorte */}
      {showYearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                📅 Etiqueta de cohorte
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
              Ingresa la cohorte correspondiente a estos datos:
            </p>
            
            <input
              type="text"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
              placeholder="Ej: 2023, 2024-1A, 2025-1, Cohorte-2..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-center"
              maxLength="20"
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
              Cohortes ya cargadas: {availableYears.join(', ')}
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
