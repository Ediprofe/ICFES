/**
 * ✅ App.jsx Refactorizado - Usa Zustand Store
 * Versión simplificada y modular
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';
import { ComparisonYearUploader } from './components/ComparisonYearUploader.jsx';
import { DataPreview } from './components/DataPreview.jsx';
import { ExportButtons } from './components/ExportButtons.jsx';
import { useAnalysisStore } from './stores/analysisStore.js';
import { Youtube, Music2, Globe } from 'lucide-react';
import { BRANDING } from './config/visualConfig.js';

function AppContent() {
  const hasData = useAnalysisStore((state) => state.hasData());
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                Análisis ICFES
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Sistema de Análisis de Resultados Académicos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Desarrollado por</p>
              <a 
                href={BRANDING.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-blue-600 hover:text-blue-700"
              >
                {BRANDING.name}
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {!hasData ? (
          // Vista de carga de archivo
          <div className="max-w-2xl mx-auto">
            <FileUploaderNew />
          </div>
        ) : (
          // Vista con datos cargados
          <>
            <DataPreview />
            
            {comparisonMode && (
              <ComparisonYearUploader />
            )}
            
            <ExportButtons />
            
            {/* TODO: Agregar más componentes aquí */}
            {/* - ChartsPanel */}
            {/* - MetricsPanel */}
            {/* - StudentsTable */}
            {/* - FilterControls */}
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © 2025 {BRANDING.name}. Todos los derechos reservados.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a
                href={BRANDING.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Youtube size={20} />
                <span className="text-sm">YouTube</span>
              </a>
              
              <a
                href={BRANDING.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Music2 size={20} />
                <span className="text-sm">TikTok</span>
              </a>
              
              <a
                href={BRANDING.social.web}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Globe size={20} />
                <span className="text-sm">Web</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
