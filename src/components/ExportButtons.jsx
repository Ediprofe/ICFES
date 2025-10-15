/**
 * ✅ Componente: Botones de Exportación
 * Botones para exportar a PDF y HTML, y resetear análisis
 */

import { Download, FileText, RefreshCw } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';
import { generatePDF } from '../reports/pdf/PDFReportGenerator.js';
import { generateHTML } from '../reports/html/HTMLReportGenerator.js';

export const ExportButtons = () => {
  const multiYearAnalysis = useAnalysisStore((state) => state.multiYearAnalysis);
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  const reset = useAnalysisStore((state) => state.reset);
  
  if (!multiYearAnalysis) return null;
  
  // Obtener análisis activo directamente del Map
  const baseYear = multiYearAnalysis.baseYear;
  const activeAnalysis = multiYearAnalysis.analyses instanceof Map 
    ? multiYearAnalysis.analyses.get(baseYear)
    : null;
  
  if (!activeAnalysis) return null;
  
  // Obtener análisis de comparación
  const comparisonAnalyses = multiYearAnalysis.comparisonYears
    ?.map(year => multiYearAnalysis.analyses instanceof Map ? multiYearAnalysis.analyses.get(year) : null)
    .filter(a => a !== null) || [];
  
  const handleNewAnalysis = () => {
    if (confirm('¿Estás seguro de que deseas iniciar un nuevo análisis? Se perderán los datos actuales.')) {
      reset();
    }
  };
  
  const handleExportPDF = () => {
    try {
      generatePDF(activeAnalysis, {
        isMultiYear: comparisonMode,
        comparisonAnalyses,
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
        isMultiYear: comparisonMode,
        comparisonAnalyses,
        excludePIAR: true
      });
    } catch (error) {
      console.error('Error al generar HTML:', error);
      alert('Error al generar el HTML. Por favor, intenta nuevamente.');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Exportar Informe</h3>
        <button
          onClick={handleNewAnalysis}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
        >
          <RefreshCw size={18} />
          <span>Nuevo Análisis</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
        >
          <FileText size={20} />
          <span>Exportar PDF</span>
        </button>
        
        <button
          onClick={handleExportHTML}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Download size={20} />
          <span>Exportar HTML</span>
        </button>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        {comparisonMode 
          ? `📊 Exportando análisis comparativo de ${comparisonAnalyses.length + 1} años`
          : `📄 Exportando análisis del año ${activeAnalysis.year}`
        }
      </p>
    </div>
  );
};
