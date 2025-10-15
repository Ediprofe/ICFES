/**
 * ✅ App Debug - Versión completa para testing
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';
import { DataPreview } from './components/DataPreview.jsx';
import { ComparisonYearUploader } from './components/ComparisonYearUploader.jsx';
import { ExportButtons } from './components/ExportButtons.jsx';
import { useAnalysisStore } from './stores/analysisStore.js';
import { RefreshCw, Plus } from 'lucide-react';

function AppDebug() {
  // Acceder directamente al estado sin llamar funciones
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  // eslint-disable-next-line no-unused-vars
  const version = useAnalysisStore((state) => state.version); // Para forzar re-renders cuando cambia
  const reset = useAnalysisStore((state) => state.reset);
  const enableComparisonMode = useAnalysisStore((state) => state.enableComparisonMode);
  
  const handleNewAnalysis = () => {
    if (confirm('¿Estás seguro de que deseas iniciar un nuevo análisis? Se perderán los datos actuales.')) {
      reset();
    }
  };
  
  const handleAddMoreYears = () => {
    enableComparisonMode();
  };
  
  // Calcular hasData directamente
  const hasData = multiYearAnalysis && 
    multiYearAnalysis.analyses && 
    (Array.isArray(multiYearAnalysis.analyses) 
      ? multiYearAnalysis.analyses.length > 0 
      : (multiYearAnalysis.analyses instanceof Map 
          ? multiYearAnalysis.analyses.size > 0
          : Object.keys(multiYearAnalysis.analyses).length > 0));
  
  // Obtener años disponibles directamente
  const availableYears = multiYearAnalysis?.analyses 
    ? (Array.isArray(multiYearAnalysis.analyses)
        ? multiYearAnalysis.analyses.map(a => a.year)
        : (multiYearAnalysis.analyses instanceof Map
            ? Array.from(multiYearAnalysis.analyses.keys())
            : Object.keys(multiYearAnalysis.analyses).map(Number)))
    : [];
  
  const activeYear = multiYearAnalysis?.baseYear || (availableYears.length > 0 ? availableYears[0] : null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">
                📊 Analizador ICFES
              </h1>
              <p className="text-blue-100 text-lg">
                Sistema de análisis de resultados académicos
              </p>
            </div>
            <div className="flex items-center gap-4">
              {hasData && (
                <>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                    <p className="text-sm text-blue-100 mb-1">Cohorte activa</p>
                    <p className="text-3xl font-bold">{activeYear}</p>
                    {availableYears.length > 1 && (
                      <p className="text-xs text-blue-200 mt-1">
                        +{availableYears.length - 1} cohorte{availableYears.length > 2 ? 's' : ''} más
                      </p>
                    )}
                  </div>
                  
                  {/* Botón para agregar más cohortes */}
                  <button
                    onClick={handleAddMoreYears}
                    className="flex items-center gap-2 px-5 py-3 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    title="Cargar más cohortes para análisis comparativo"
                  >
                    <Plus size={20} />
                    <span>Cargar más cohortes</span>
                  </button>
                  
                  <button
                    onClick={handleNewAnalysis}
                    className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  >
                    <RefreshCw size={20} />
                    <span>Nuevo análisis</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Componentes principales */}
        {!hasData && <FileUploaderNew />}
        
        {hasData && (
          <>
            <DataPreview />
            {comparisonMode && <ComparisonYearUploader />}
          </>
        )}
        
        {/* SIEMPRE mostrar botones de exportación (desde el inicio, deshabilitados si no hay datos) */}
        <ExportButtons />
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppDebug />
    </ErrorBoundary>
  );
}

export default App;
