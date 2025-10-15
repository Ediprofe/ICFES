/**
 * ✅ Componente: Botones de Exportación
 * Botones para exportar a PDF y HTML, y resetear análisis
 */

import { useState, useEffect } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';
import { generatePDF } from '../reports/pdf/PDFReportGenerator.js';
import { generateHTML } from '../reports/html/HTMLReportGenerator.js';

export const ExportButtons = () => {
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  const reset = useAnalysisStore((state) => state.reset);
  const [, forceUpdate] = useState({});
  
  // Forzar actualización cuando cambie multiYearAnalysis
  useEffect(() => {
    forceUpdate({});
  }, [multiYearAnalysis]);
  
  if (!multiYearAnalysis) return null;
  
  // Obtener análisis activo directamente del Map
  const baseYear = multiYearAnalysis.baseYear;
  
  // Verificar si analyses es un Map
  if (!(multiYearAnalysis.analyses instanceof Map)) {
    return null;
  }
  
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
  
  const handleNewAnalysis = () => {
    if (confirm('¿Estás seguro de que deseas iniciar un nuevo análisis? Se perderán los datos actuales.')) {
      reset();
    }
  };
  
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full p-3 shadow-lg">
            <Download size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">📥 Exportar informe</h3>
            <p className="text-sm text-gray-600">Descarga tus análisis en PDF o HTML</p>
          </div>
        </div>
        <button
          onClick={handleNewAnalysis}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RefreshCw size={20} />
          <span>Nuevo análisis</span>
        </button>
      </div>
      
      {/* Exportación de año individual */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          📄 Análisis individual - Año {activeAnalysis.year}
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FileText size={20} />
            <span>PDF {activeAnalysis.year}</span>
          </button>
          
          <button
            onClick={handleExportHTML}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download size={20} />
            <span>HTML {activeAnalysis.year}</span>
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
          ℹ️ Solo datos del año {activeAnalysis.year} ({activeAnalysis.metadata.studentsWithoutPIAR} estudiantes sin PIAR)
        </p>
      </div>
      
      {/* Exportación comparativa (solo si hay múltiples años) */}
      {isComparisonMode && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
          <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Análisis comparativo multi-año
            <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
              {availableYears.length} años
            </span>
          </h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportComparativePDF}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FileText size={20} />
              <span>PDF Comparativo</span>
            </button>
            
            <button
              onClick={handleExportComparativeHTML}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download size={20} />
              <span>HTML Comparativo</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
            ℹ️ Compara {availableYears.length} años: <strong>{availableYears.sort().join(', ')}</strong> • Incluye todas las métricas y estudiantes de todos los años
          </p>
        </div>
      )}
    </div>
  );
};
