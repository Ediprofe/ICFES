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
  const hasData = useAnalysisStore((state) => {
    try {
      return state.hasData();
    } catch {
      return false;
    }
  });
  
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode || false);
  
  const availableYears = useAnalysisStore((state) => {
    try {
      return state.getAvailableYears ? state.getAvailableYears() : [];
    } catch {
      return [];
    }
  });
  
  const activeAnalysis = useAnalysisStore((state) => {
    try {
      return state.getActiveAnalysis ? state.getActiveAnalysis() : null;
    } catch {
      return null;
    }
  });
  
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
            <p>activeAnalysis: <strong>{activeAnalysis ? `Year ${activeAnalysis.year}` : 'null'}</strong></p>
          </div>
        </div>
        
        {/* Componentes principales */}
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
