/**
 * ✅ Componente: Botones de Exportación
 * Botones para exportar a PDF y HTML
 */

import { Download, FileText } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';
import { generatePDF } from '../reports/pdf/PDFReportGenerator.js';
import { generateHTML } from '../reports/html/HTMLReportGenerator.js';

export const ExportButtons = () => {
  const activeAnalysis = useAnalysisStore((state) => state.getActiveAnalysis());
  const comparisonMode = useAnalysisStore((state) => state.comparisonMode);
  const comparisonAnalyses = useAnalysisStore((state) => state.getComparisonAnalyses());
  
  if (!activeAnalysis) return null;
  
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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Exportar Informe</h3>
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
