/**
 * ✅ Generador de Reportes PDF - Orquestador Principal
 * Coordina la generación de todas las secciones del PDF
 */

import { initPDF, addNewPage, drawFooter, getCurrentPageNumber, setPDFMetadata } from './pdfCore.js';
import { generateCoverPage } from './pdfSections/coverPage.js';
import { generateStudentsList } from './pdfSections/studentsList.js';
import { generateAreaMetrics } from './pdfSections/areaMetrics.js';
import { generateCharts } from './pdfSections/charts.js';
import { generateTopPerformers } from './pdfSections/topPerformers.js';
import { generateOutliers } from './pdfSections/outliers.js';

/**
 * Genera un PDF completo con todas las secciones
 */
export const generatePDF = (analysis, options = {}) => {
  const {
    isMultiYear = false,
    comparisonAnalyses = [],
    excludePIAR = true,
    fileName = null
  } = options;
  
  // Inicializar PDF
  const doc = initPDF();
  
  // Establecer metadatos
  setPDFMetadata(doc, {
    title: `Análisis ICFES ${analysis.year}${isMultiYear ? ' - Comparativo' : ''}`,
    subject: 'Análisis de Resultados Académicos ICFES',
    keywords: `ICFES, análisis, ${analysis.year}, educación`
  });
  
  let sectionNumber = 1;
  
  // 1. Portada
  generateCoverPage(doc, analysis, {
    isMultiYear,
    comparisonYears: comparisonAnalyses.map(a => a.year)
  });
  
  // 2. Listado de Estudiantes
  addNewPage(doc);
  generateStudentsList(doc, analysis, sectionNumber++, { excludePIAR });
  
  // 3. Métricas por Área
  addNewPage(doc);
  generateAreaMetrics(doc, analysis, sectionNumber++);
  
  // 4. Gráficos
  addNewPage(doc);
  generateCharts(doc, analysis, sectionNumber++);
  
  // 5. Top Performers
  addNewPage(doc);
  generateTopPerformers(doc, analysis, sectionNumber++);
  
  // 6. Outliers
  addNewPage(doc);
  generateOutliers(doc, analysis, sectionNumber++);
  
  // TODO: 7. Comparación Multi-Año (si aplica)
  // if (isMultiYear && comparisonAnalyses.length > 0) {
  //   addNewPage(doc);
  //   generateComparison(doc, analysis, comparisonAnalyses, sectionNumber++);
  // }
  
  // Agregar pies de página a todas las páginas
  const totalPages = getCurrentPageNumber(doc);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) { // No agregar pie de página en la portada
      drawFooter(doc, i, `Análisis ICFES ${analysis.year}`);
    }
  }
  
  // Generar nombre de archivo
  const defaultFileName = `informe-icfes-${analysis.year}${isMultiYear ? '-comparativo' : ''}-${new Date().toISOString().split('T')[0]}.pdf`;
  const finalFileName = fileName || defaultFileName;
  
  // Guardar PDF
  doc.save(finalFileName);
  
  return {
    success: true,
    fileName: finalFileName,
    totalPages
  };
};

// TODO: Implementar funciones de preview
// export const generatePDFBlob = (analysis) => { ... };
// export const generatePDFDataURI = (analysis) => { ... };
