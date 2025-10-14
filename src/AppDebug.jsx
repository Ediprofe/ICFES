/**
 * ✅ App Debug - Versión simplificada para debugging
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';

function AppDebug() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ICFES Analyzer - Debug Mode
        </h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-lg text-gray-700">
            ✅ React funciona correctamente.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            🔄 Paso 2: Probando FileUploaderNew...
          </p>
        </div>
        
        {/* Probar FileUploaderNew */}
        <FileUploaderNew />
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
