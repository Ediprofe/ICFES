/**
 * ✅ App Debug - Versión simplificada para debugging
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';
import { DataPreview } from './components/DataPreview.jsx';
import { ComparisonYearUploader } from './components/ComparisonYearUploader.jsx';
import { ExportButtons } from './components/ExportButtons.jsx';
import { useAnalysisStore } from './stores/analysisStore.js';

function AppDebug() {
  const hasData = useAnalysisStore((state) => state.hasData());
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  
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
          <p className="text-xs text-gray-500 mt-2">
            hasData: {hasData ? 'true' : 'false'} | comparisonMode: {comparisonMode ? 'true' : 'false'}
          </p>
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
