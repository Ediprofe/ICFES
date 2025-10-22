/**
 * ✅ Generador de Reportes HTML - Orquestador Principal
 * Coordina la generación de todas las secciones del HTML interactivo
 */

import { generateHTMLTemplate } from './htmlCore.js';
import { generateInteractivityScript } from './htmlInteractivity.js';
import { generateCoverSection } from './htmlSections/coverSection.js';
import { generateInteractiveChartsSection } from './htmlSections/interactiveCharts.js';
import { generateStudentsTableSection } from './htmlSections/studentsTable.js';
import { generateGlobalStatisticsSection } from './htmlSections/globalStatistics.js';
import { generatePercentileAnalysisSection } from './htmlSections/percentileAnalysis.js';
import { generateTopPerformersSection } from './htmlSections/topPerformers.js';
import { generateOutliersSection } from './htmlSections/outliers.js';
import { 
  generateCombinedMetricsSection,
  generateGaussianCurvesSection,
  generateGlobalComparisonSection,
  generateAreaComparisonSection,
  generateAllStudentsTableSection,
  generateTrendChartSection
} from './htmlSections/multiYearComparison.js';
import { prepareAreaChartData, prepareGradeChartData, prepareComparisonChartData } from '../charts/chartDataPreparation.js';

/**
 * Genera un HTML completo con todas las secciones
 */
export const generateHTML = (analysis, options = {}) => {
  const {
    isMultiYear = false,
    comparisonAnalyses = [],
    excludePIAR = true,
    fileName = null
  } = options;
  
  // 1. Generar template base
  let html = generateHTMLTemplate(
    `Análisis ICFES ${analysis.year}${isMultiYear ? ' - Comparativo' : ''}`,
    analysis.year
  );
  
  // 2. Preparar datos para gráficos
  const areaChartData = prepareAreaChartData(analysis, true);
  const gradeChartData = prepareGradeChartData(analysis, true);
  
  let comparisonChartData = null;
  if (isMultiYear && comparisonAnalyses.length > 0) {
    comparisonChartData = prepareComparisonChartData(
      [analysis, ...comparisonAnalyses],
      'promedio'
    );
  }
  
  // 3. Generar contenido de secciones
  let sectionNumber = 1;
  
  let sections = [];
  
  // Preparar allAnalyses si es multi-año
  const allAnalyses = isMultiYear && comparisonAnalyses.length > 0 
    ? [analysis, ...comparisonAnalyses] 
    : [];
  
  // Portada
  sections.push(generateCoverSection(
    analysis, 
    isMultiYear, 
    comparisonAnalyses.map(a => a.year),
    allAnalyses
  ));
  
  // Si es multi-año, usar secciones de comparación
  if (isMultiYear && comparisonAnalyses.length > 0) {
    
    sections.push(generateTrendChartSection(allAnalyses, sectionNumber++));
    sections.push(generateAllStudentsTableSection(allAnalyses, sectionNumber++));
    sections.push(generateCombinedMetricsSection(allAnalyses, sectionNumber++));
    sections.push(generateGaussianCurvesSection(allAnalyses, sectionNumber++));
    sections.push(generateGlobalComparisonSection(allAnalyses, sectionNumber++));
    sections.push(generateAreaComparisonSection(allAnalyses, sectionNumber++));
    
  } else {
    // Modo de un solo año
    sections.push(generateStudentsTableSection(analysis, sectionNumber++, excludePIAR));
    sections.push(generateGlobalStatisticsSection(analysis, sectionNumber++));
    sections.push(generateTopPerformersSection(analysis, sectionNumber++));
    sections.push(generateInteractiveChartsSection(sectionNumber++));
    sections.push(generatePercentileAnalysisSection(analysis, sectionNumber++));
    sections.push(generateOutliersSection(analysis, sectionNumber++));
  }
  
  const content = sections.join('\n');
  
  // 4. Inyectar datos y contenido en template
  html = html.replace('<!-- CONTENIDO SE INYECTA AQUÍ -->', content);
  
  // 5. Inyectar datos JSON
  const dataJSON = JSON.stringify({
    areaChartData,
    gradeChartData
  }, null, 2);
  
  const comparisonJSON = comparisonChartData 
    ? JSON.stringify(comparisonChartData, null, 2)
    : 'null';
  
  html = html.replace('{DATA_PLACEHOLDER}', dataJSON);
  html = html.replace('{COMPARISON_PLACEHOLDER}', comparisonJSON);
  
  // 6. Inyectar script de interactividad
  html = html.replace('{INTERACTIVITY_SCRIPT}', generateInteractivityScript());
  
  // 7. Generar nombre de archivo
  const defaultFileName = `analisis-icfes-${analysis.year}${isMultiYear ? '-comparativo' : ''}-${new Date().toISOString().split('T')[0]}.html`;
  const finalFileName = fileName || defaultFileName;
  
  // 8. Descargar archivo
  downloadHTML(html, finalFileName);
  
  return {
    success: true,
    fileName: finalFileName
  };
};

/**
 * Descarga el HTML como archivo
 */
const downloadHTML = (htmlContent, fileName) => {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Genera HTML y lo retorna como string (para preview)
 */
export const generateHTMLString = (analysis, options = {}) => {
  const {
    isMultiYear = false,
    comparisonAnalyses = []
  } = options;
  
  let html = generateHTMLTemplate(
    `Análisis ICFES ${analysis.year}`,
    analysis.year,
    isMultiYear
  );
  
  const areaChartData = prepareAreaChartData(analysis, true);
  const gradeChartData = prepareGradeChartData(analysis, true);
  
  let comparisonChartData = null;
  if (isMultiYear && comparisonAnalyses.length > 0) {
    comparisonChartData = prepareComparisonChartData(
      [analysis, ...comparisonAnalyses],
      'promedio'
    );
  }
  
  let sectionNumber = 1;
  const sections = [
    generateCoverSection(analysis, isMultiYear, comparisonAnalyses.map(a => a.year)),
    generateInteractiveChartsSection(sectionNumber++),
    generateStudentsTableSection(analysis, sectionNumber++, true)
  ];
  
  const content = sections.join('\n');
  html = html.replace('<!-- CONTENIDO SE INYECTA AQUÍ -->', content);
  
  const dataJSON = JSON.stringify({ areaChartData, gradeChartData }, null, 2);
  const comparisonJSON = comparisonChartData ? JSON.stringify(comparisonChartData, null, 2) : 'null';
  
  html = html.replace('{DATA_PLACEHOLDER}', dataJSON);
  html = html.replace('{COMPARISON_PLACEHOLDER}', comparisonJSON);
  html = html.replace('{INTERACTIVITY_SCRIPT}', generateInteractivityScript());
  
  return html;
};
