/**
 * ✅ App Debug - Versión simplificada para debugging
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';

function AppDebug() {
  // Limpiar localStorage al iniciar
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('icfes-analysis-storage');
      console.log('✅ localStorage limpiado');
    } catch (e) {
      console.error('Error limpiando localStorage:', e);
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ✅ ICFES Analyzer Funcionando
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg text-gray-700 mb-4">
            Si ves este mensaje, React está funcionando correctamente.
          </p>
          <p className="text-sm text-gray-600">
            localStorage ha sido limpiado. Recarga la página para continuar.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Recargar Página
          </button>
        </div>
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
