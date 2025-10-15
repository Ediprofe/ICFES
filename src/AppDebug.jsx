/**
 * ✅ App Debug - Versión completa para testing
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';
import { DataPreview } from './components/DataPreview.jsx';
import { ComparisonYearUploader } from './components/ComparisonYearUploader.jsx';
import { ExportButtons } from './components/ExportButtons.jsx';
import { useAnalysisStore } from './stores/analysisStore.js';

function AppDebug() {
  // Acceder directamente al estado sin llamar funciones
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  
  // Calcular hasData directamente
  const hasData = multiYearAnalysis && 
    multiYearAnalysis.analyses && 
    (Array.isArray(multiYearAnalysis.analyses) 
      ? multiYearAnalysis.analyses.length > 0 
      : multiYearAnalysis.analyses.size > 0);
  
  // Obtener años disponibles directamente
  const availableYears = multiYearAnalysis?.analyses 
    ? (Array.isArray(multiYearAnalysis.analyses)
        ? multiYearAnalysis.analyses.map(a => a.year)
        : Array.from(multiYearAnalysis.analyses.keys()))
    : [];
  
  const activeYear = multiYearAnalysis?.baseYear || (availableYears.length > 0 ? availableYears[0] : null);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ICFES Analyzer - Testing Mode
        </h1>
        
        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <p className="text-sm font-semibold mb-2">Debug Info:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>hasData: <strong>{hasData ? 'true' : 'false'}</strong></p>
            <p>comparisonMode: <strong>{comparisonMode ? 'true' : 'false'}</strong></p>
            <p>availableYears: <strong>{JSON.stringify(availableYears)}</strong></p>
            <p>activeYear: <strong>{activeYear || 'null'}</strong></p>
          </div>
        </div>
        
        {/* Componentes principales */}
        {!hasData ? (
          <FileUploaderNew />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ Datos Cargados Exitosamente
            </h2>
            <p className="text-gray-700">
              Años disponibles: <strong>{availableYears.join(', ')}</strong>
            </p>
            <p className="text-gray-700 mt-2">
              Año activo: <strong>{activeYear}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Los componentes DataPreview y ExportButtons están temporalmente deshabilitados para debugging.
            </p>
          </div>
        )}
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
