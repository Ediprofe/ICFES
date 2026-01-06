/**
 * ✅ App Debug - Versión simplificada con interfaces limpias
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';
import { ComparisonYearUploader } from './components/ComparisonYearUploader.jsx';
import { ExportButtons } from './components/ExportButtons.jsx';
import { AnalysisModeSelector } from './components/AnalysisModeSelector.jsx';
import { LongitudinalUploader } from './components/longitudinal/LongitudinalUploader.jsx';
import { LongitudinalDashboard } from './components/longitudinal/LongitudinalDashboard.jsx';
import { useAnalysisStore } from './stores/analysisStore.js';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { LongitudinalAnalysis } from './models/LongitudinalAnalysis.js';

function AppDebug() {
  // Estado del modo de análisis
  const analysisMode = useAnalysisStore((state) => state.analysisMode);
  const setAnalysisMode = useAnalysisStore((state) => state.setAnalysisMode);

  // Estado local para análisis longitudinal
  const [longitudinalData, setLongitudinalData] = useState(null);

  // Otros estados
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  // eslint-disable-next-line no-unused-vars
  const version = useAnalysisStore((state) => state.version);
  const reset = useAnalysisStore((state) => state.reset);
  const enableComparisonMode = useAnalysisStore((state) => state.enableComparisonMode);

  const handleNewAnalysis = () => {
    if (confirm('¿Estás seguro de que deseas iniciar un nuevo análisis? Se perderán los datos actuales.')) {
      reset();
      setLongitudinalData(null);
    }
  };

  const handleModeSelect = (mode) => {
    setAnalysisMode(mode);
    if (mode === 'comparative') {
      enableComparisonMode();
    }
  };

  const handleBackToModeSelector = () => {
    reset();
    setLongitudinalData(null);
  };

  const handleLongitudinalDataLoaded = (data) => {
    const analysis = new LongitudinalAnalysis(data);
    setLongitudinalData(analysis);
  };

  // Calcular hasData
  const hasData = multiYearAnalysis &&
    multiYearAnalysis.analyses &&
    (Array.isArray(multiYearAnalysis.analyses)
      ? multiYearAnalysis.analyses.length > 0
      : (multiYearAnalysis.analyses instanceof Map
        ? multiYearAnalysis.analyses.size > 0
        : Object.keys(multiYearAnalysis.analyses).length > 0));

  // Obtener años disponibles
  const availableYears = multiYearAnalysis?.analyses
    ? (Array.isArray(multiYearAnalysis.analyses)
      ? multiYearAnalysis.analyses.map(a => a.year)
      : (multiYearAnalysis.analyses instanceof Map
        ? Array.from(multiYearAnalysis.analyses.keys())
        : Object.keys(multiYearAnalysis.analyses).map(Number)))
    : [];

  // Nombres de modos
  const modeInfo = {
    single: { name: 'Análisis de Prueba', icon: '📊', color: 'from-blue-600 to-indigo-600' },
    comparative: { name: 'Comparativo Multi-Cohorte', icon: '📈', color: 'from-purple-600 to-pink-600' },
    longitudinal: { name: 'Análisis Longitudinal', icon: '📉', color: 'from-green-600 to-teal-600' }
  };

  // Si no hay modo seleccionado, mostrar selector
  if (!analysisMode) {
    return <AnalysisModeSelector onSelectMode={handleModeSelect} />;
  }

  const currentMode = modeInfo[analysisMode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header simplificado - mismo estilo para todos los modos */}
        <div className={`bg-gradient-to-r ${currentMode.color} rounded-2xl shadow-2xl p-6 mb-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToModeSelector}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Volver a selección de modo"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{currentMode.icon}</span>
                  <h1 className="text-2xl font-bold">{currentMode.name}</h1>
                </div>
                <p className="text-sm opacity-80">ICFES Analyzer</p>
              </div>
            </div>

            {/* Botón nuevo análisis - solo si hay datos */}
            {(hasData || longitudinalData) && (
              <button
                onClick={handleNewAnalysis}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
              >
                <RefreshCw size={16} />
                <span>Nuevo análisis</span>
              </button>
            )}
          </div>

          {/* Info de cohortes cargadas */}
          {hasData && availableYears.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-xs opacity-80">Cohortes cargadas</p>
                <p className="font-bold">{availableYears.sort().join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Contenido según modo */}
        {analysisMode === 'longitudinal' ? (
          // MODO LONGITUDINAL
          <>
            {!longitudinalData && (
              <LongitudinalUploader onDataLoaded={handleLongitudinalDataLoaded} />
            )}
            {longitudinalData && (
              <LongitudinalDashboard analysis={longitudinalData} />
            )}
          </>
        ) : (
          // MODO SINGLE Y COMPARATIVE
          <>
            {!hasData && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📁 Cargar archivo Excel
                </h2>
                <p className="text-gray-600 mb-6">
                  {analysisMode === 'single'
                    ? 'Selecciona un archivo Excel con los resultados de una prueba.'
                    : 'Selecciona archivos Excel para comparar múltiples cohortes.'}
                </p>
                <FileUploaderNew />
              </div>
            )}

            {hasData && (
              <>
                {/* Para modo comparativo, permitir agregar más cohortes */}
                {analysisMode === 'comparative' && comparisonMode && (
                  <ComparisonYearUploader />
                )}

                <ExportButtons />
              </>
            )}
          </>
        )}

        {/* Footer con privacidad */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>🔒 Todos los datos se procesan localmente en tu navegador</p>
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
