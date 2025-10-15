/**
 * ✅ Componente: Botones de Exportación
 * Botones para exportar a PDF y HTML, y resetear análisis
 */

import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';
import { generatePDF } from '../reports/pdf/PDFReportGenerator.js';
import { generateHTML } from '../reports/html/HTMLReportGenerator.js';

export const ExportButtons = () => {
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  const waitingForMoreYears = useAnalysisStore((state) => state.waitingForMoreYears);
  const finishLoadingYears = useAnalysisStore((state) => state.finishLoadingYears);
  const version = useAnalysisStore((state) => state.version); // Para forzar re-renders
  const [, forceUpdate] = useState({});
  
  // Forzar actualización cuando cambie la versión
  useEffect(() => {
    forceUpdate({});
  }, [version]);
  
  // Verificar si hay datos cargados
  const hasData = multiYearAnalysis && 
    multiYearAnalysis.analyses && 
    multiYearAnalysis.analyses instanceof Map &&
    multiYearAnalysis.analyses.size > 0;
  
  // Si no hay datos, mostrar botones deshabilitados
  if (!hasData) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-6 mb-6 border-2 border-gray-200 opacity-60">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-full p-3 shadow-lg">
            <Download size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-600">📥 Exportar informe</h3>
            <p className="text-sm text-gray-500">Carga archivos para habilitar la exportación</p>
          </div>
        </div>
        
        {/* Exportación de año individual - DESHABILITADO */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300">
          <h4 className="text-base font-bold text-gray-600 mb-4 flex items-center gap-2">
            📄 Análisis individual de cohorte
          </h4>
          <div className="flex flex-wrap gap-3">
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-bold shadow-lg"
            >
              <FileText size={20} />
              <span>PDF Anual</span>
            </button>
            
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-bold shadow-lg"
            >
              <Download size={20} />
              <span>HTML Anual</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500 bg-white/50 p-2 rounded-lg">
            ℹ️ Carga un archivo Excel para habilitar la exportación de informe de cohorte
          </p>
        </div>
        
        {/* Exportación comparativa - DESHABILITADO */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300">
          <h4 className="text-base font-bold text-gray-600 mb-4 flex items-center gap-2">
            📊 Análisis comparativo multi-cohorte
          </h4>
          <div className="flex flex-wrap gap-3">
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-bold shadow-lg"
            >
              <FileText size={20} />
              <span>PDF Comparativo</span>
            </button>
            
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-bold shadow-lg"
            >
              <Download size={20} />
              <span>HTML Comparativo</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500 bg-white/50 p-2 rounded-lg">
            ℹ️ Carga múltiples archivos Excel (diferentes cohortes) para habilitar la exportación comparativa
          </p>
        </div>
      </div>
    );
  }
  
  // Obtener análisis activo directamente del Map
  const baseYear = multiYearAnalysis.baseYear;
  const activeAnalysis = multiYearAnalysis.analyses.get(baseYear);
  
  if (!activeAnalysis) return null;
  
  // Obtener todos los años disponibles
  const availableYears = multiYearAnalysis.analyses instanceof Map
    ? Array.from(multiYearAnalysis.analyses.keys())
    : [];
  
  // Determinar si es modo comparativo (más de 1 año cargado)
  const isComparisonMode = availableYears.length > 1;
  
  // Obtener análisis de comparación (todos excepto el año base)
  const comparisonAnalyses = availableYears
    .filter(year => year !== baseYear)
    .map(year => multiYearAnalysis.analyses.get(year))
    .filter(a => a !== null);
  
  const handleExportPDF = () => {
    try {
      generatePDF(activeAnalysis, {
        isMultiYear: false, // Exportar solo el año activo
        comparisonAnalyses: [],
        excludePIAR: true
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    }
  };
  
  const handleExportHTML = () => {
    try {
      generateHTML(activeAnalysis, {
        isMultiYear: false, // Exportar solo el año activo
        comparisonAnalyses: [],
        excludePIAR: true
      });
    } catch (error) {
      console.error('Error al generar HTML:', error);
      alert('Error al generar el HTML. Por favor, intenta nuevamente.');
    }
  };
  
  const handleExportComparativePDF = () => {
    try {
      generatePDF(activeAnalysis, {
        isMultiYear: true, // Modo comparativo
        comparisonAnalyses,
        excludePIAR: true
      });
    } catch (error) {
      console.error('Error al generar PDF comparativo:', error);
      alert('Error al generar el PDF comparativo. Por favor, intenta nuevamente.');
    }
  };
  
  const handleExportComparativeHTML = () => {
    try {
      generateHTML(activeAnalysis, {
        isMultiYear: true, // Modo comparativo
        comparisonAnalyses,
        excludePIAR: true
      });
    } catch (error) {
      console.error('Error al generar HTML comparativo:', error);
      alert('Error al generar el HTML comparativo. Por favor, intenta nuevamente.');
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-6 mb-6 border-2 border-gray-200">
      {/* Mensaje de advertencia si está esperando más años */}
      {waitingForMoreYears && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⏳</div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-gray-800 mb-2">
                Cargando más años...
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                Los botones están deshabilitados mientras cargas más archivos. Haz clic en "Finalizar carga" cuando termines.
              </p>
              <button
                onClick={() => finishLoadingYears()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105"
              >
                ✅ Finalizar carga y habilitar botones
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full p-3 shadow-lg">
          <Download size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">📥 Exportar informe</h3>
          <p className="text-sm text-gray-600">
            {waitingForMoreYears ? 'Finaliza la carga para habilitar' : 'Descarga tus análisis en PDF o HTML'}
          </p>
        </div>
      </div>
      
      {/* Exportación de año individual */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          📄 Análisis individual - Cohorte {activeAnalysis.year}
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportPDF}
            disabled={waitingForMoreYears}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg ${
              waitingForMoreYears
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <FileText size={20} />
            <span>PDF {activeAnalysis.year}</span>
          </button>
          
          <button
            onClick={handleExportHTML}
            disabled={waitingForMoreYears}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg ${
              waitingForMoreYears
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <Download size={20} />
            <span>HTML {activeAnalysis.year}</span>
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
          ℹ️ Solo datos de la cohorte {activeAnalysis.year} ({activeAnalysis.metadata.studentsWithoutPIAR} estudiantes sin PIAR)
        </p>
      </div>
      
      {/* Exportación comparativa (solo si hay múltiples años) */}
      {isComparisonMode && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
          <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Análisis comparativo multi-cohorte
            <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
              {availableYears.length} cohortes
            </span>
          </h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportComparativePDF}
              disabled={waitingForMoreYears}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg ${
                waitingForMoreYears
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <FileText size={20} />
              <span>PDF Comparativo</span>
            </button>
            
            <button
              onClick={handleExportComparativeHTML}
              disabled={waitingForMoreYears}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg ${
                waitingForMoreYears
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <Download size={20} />
              <span>HTML Comparativo</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
            ℹ️ Compara {availableYears.length} cohortes: <strong>{availableYears.sort().join(', ')}</strong> • Incluye todas las métricas y estudiantes de todas las cohortes
          </p>
        </div>
      )}
    </div>
  );
};
