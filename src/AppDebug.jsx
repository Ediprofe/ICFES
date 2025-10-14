/**
 * ✅ App Debug - Versión simplificada para debugging
 */

import { useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';
import { DataPreview } from './components/DataPreview.jsx';
import { ComparisonYearUploader } from './components/ComparisonYearUploader.jsx';
import { ExportButtons } from './components/ExportButtons.jsx';
import { useAnalysisStore } from './stores/analysisStore.js';

function AppDebug() {
  // Limpiar localStorage corrupto al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem('icfes-analysis-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Si el formato es viejo o corrupto, limpiar
        if (!parsed.state || !parsed.state.multiYearAnalysis) {
          console.log('🧹 Limpiando localStorage corrupto...');
          localStorage.removeItem('icfes-analysis-storage');
          window.location.reload();
        }
      }
    } catch {
      console.log('🧹 Error en localStorage, limpiando...');
      localStorage.removeItem('icfes-analysis-storage');
      window.location.reload();
    }
  }, []);
  
  const hasData = useAnalysisStore((state) => state.hasData());
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  const availableYears = useAnalysisStore((state) => state.getAvailableYears());
  const activeAnalysis = useAnalysisStore((state) => state.getActiveAnalysis());
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ICFES Analyzer - Debug Mode
        </h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-lg text-gray-700">
            ✅ React funciona | ✅ FileUploaderNew funciona
          </p>
          <p className="text-sm text-gray-600 mt-2">
            🔄 Paso 3: Probando flujo completo con todos los componentes...
          </p>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>hasData: <strong>{hasData ? 'true' : 'false'}</strong></p>
            <p>comparisonMode: <strong>{comparisonMode ? 'true' : 'false'}</strong></p>
            <p>availableYears: <strong>{JSON.stringify(availableYears)}</strong></p>
            <p>activeAnalysis: <strong>{activeAnalysis ? `Year ${activeAnalysis.year}` : 'null'}</strong></p>
          </div>
        </div>
        
        {!hasData ? (
          <FileUploaderNew />
        ) : (
          <>
            <DataPreview />
            
            {comparisonMode && (
              <ComparisonYearUploader />
            )}
            
            <ExportButtons />
          </>
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
