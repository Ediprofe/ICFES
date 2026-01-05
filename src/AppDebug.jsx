/**
 * ✅ App Debug - Versión completa para testing
 */

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { FileUploaderNew } from './components/FileUploaderNew.jsx';
import { DataPreview } from './components/DataPreview.jsx';
import { ComparisonYearUploader } from './components/ComparisonYearUploader.jsx';
import { ExportButtons } from './components/ExportButtons.jsx';
import { AnalysisModeSelector } from './components/AnalysisModeSelector.jsx';
import { LongitudinalUploader } from './components/longitudinal/LongitudinalUploader.jsx';
import { LongitudinalDashboard } from './components/longitudinal/LongitudinalDashboard.jsx';
import { useAnalysisStore } from './stores/analysisStore.js';
import { RefreshCw, Plus, ArrowLeft } from 'lucide-react';
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

  const handleAddMoreYears = () => {
    enableComparisonMode();
  };

  const handleModeSelect = (mode) => {
    setAnalysisMode(mode);
    // Para modo comparativo, habilitar inmediatamente
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

  // Nombres de modos para mostrar
  const modeNames = {
    single: 'Análisis de Prueba',
    comparative: 'Comparativo de Cohortes',
    longitudinal: 'Evolución Longitudinal'
  };

  // Si no hay modo seleccionado, mostrar selector
  if (!analysisMode) {
    return <AnalysisModeSelector onSelectMode={handleModeSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Contenedor principal - Full width para longitudinal, limitado para otros modos */}
      <div className={analysisMode === 'longitudinal' ? 'w-full' : 'max-w-4xl mx-auto'}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={handleBackToModeSelector}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Volver a selección de modo"
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {modeNames[analysisMode]}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold mb-2">
                📊 Análisis de pruebas tipo ICFES
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

                  {/* Botón para agregar más cohortes (solo en modo comparativo) */}
                  {analysisMode === 'comparative' && (
                    <button
                      onClick={handleAddMoreYears}
                      className="flex items-center gap-2 px-5 py-3 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                      title="Cargar más cohortes para análisis comparativo"
                    >
                      <Plus size={20} />
                      <span>Cargar más cohortes</span>
                    </button>
                  )}

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

        {/* Componentes según modo */}
        {analysisMode === 'longitudinal' ? (
          // Modo longitudinal
          <>
            {!longitudinalData && (
              <LongitudinalUploader onDataLoaded={handleLongitudinalDataLoaded} />
            )}
            {longitudinalData && (
              <LongitudinalDashboard analysis={longitudinalData} />
            )}
          </>
        ) : (
          // Modos single y comparative
          <>
            {!hasData && <FileUploaderNew />}
            {hasData && (
              <>
                <DataPreview />
                {comparisonMode && <ComparisonYearUploader />}
              </>
            )}
          </>
        )}

        {/* Botones de exportación - Solo para modos no longitudinales */}
        {analysisMode !== 'longitudinal' && hasData && <ExportButtons />}
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

