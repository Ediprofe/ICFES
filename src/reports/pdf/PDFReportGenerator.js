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
import { 
  generateGlobalComparisonSection, 
  generateYearComparisonChart,
  generateAreaComparisonSection,
  generateAllStudentsTable 
} from './pdfSections/multiYearComparison.js';

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
    comparisonYears: comparisonAnalyses.map(a => a.year),
    allAnalyses: isMultiYear ? [analysis, ...comparisonAnalyses] : []
  });
  
  // Si es multi-año, generar secciones de comparación
  if (isMultiYear && comparisonAnalyses.length > 0) {
    const allAnalyses = [analysis, ...comparisonAnalyses];
    
    // 2. Tabla Completa de Estudiantes (primero)
    addNewPage(doc);
    generateAllStudentsTable(doc, allAnalyses, 20);
    
    // 3. Comparación de Métricas Globales
    addNewPage(doc);
    let currentY = 20;
    currentY = generateGlobalComparisonSection(doc, allAnalyses, currentY);
    
    // 4. Gráfico de Evolución
    generateYearComparisonChart(doc, allAnalyses, currentY);
    
    // 5. Comparación por Áreas
    addNewPage(doc);
    generateAreaComparisonSection(doc, allAnalyses, 20);
    
  } else {
    // Modo de un solo año - secciones tradicionales
    
    // 2. Métricas por Área
    addNewPage(doc);
    generateAreaMetrics(doc, analysis, sectionNumber++);
    
    // 3. Gráficos
    addNewPage(doc);
    generateCharts(doc, analysis, sectionNumber++);
    
    // 4. Listado de Estudiantes
    addNewPage(doc);
    generateStudentsList(doc, analysis, sectionNumber++, { excludePIAR });
    
    // 5. Top Performers
    addNewPage(doc);
    generateTopPerformers(doc, analysis, sectionNumber++);
    
    // 6. Outliers
    addNewPage(doc);
    generateOutliers(doc, analysis, sectionNumber++);
  }
  
  // Agregar pies de página a todas las páginas
  const totalPages = getCurrentPageNumber(doc);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) { // No agregar pie de página en la portada
      drawFooter(doc, i, `Análisis ICFES ${analysis.year}`);
    }
  }
  
  // Agregar página final con disclaimer
  addNewPage(doc);
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const centerX = pageWidth / 2;
  
  // Título
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246); // Azul
  doc.text('Aviso Legal y Responsabilidad', centerX, 40, { align: 'center' });
  
  // Contenido del disclaimer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const disclaimerText = [
    'Este informe ha sido generado mediante la plataforma web desarrollada por ediprofe.com,',
    'diseñada específicamente para facilitar el análisis de resultados de pruebas ICFES en',
    'instituciones educativas.',
    '',
    'RESPONSABILIDAD DEL USO DE DATOS:',
    '',
    'ediprofe.com proporciona únicamente la herramienta tecnológica para el procesamiento y',
    'visualización de datos. La institución educativa y/o los docentes que utilizan esta plataforma',
    'son los únicos responsables de:',
    '',
    '  • La veracidad, exactitud y actualización de los datos ingresados al sistema',
    '  • El uso adecuado de la información generada en los informes',
    '  • El cumplimiento de las normativas de protección de datos personales vigentes',
    '  • Las decisiones pedagógicas, administrativas o de cualquier índole tomadas con base',
    '    en los análisis presentados',
    '  • La confidencialidad y privacidad de la información de los estudiantes',
    '',
    'ediprofe.com no asume responsabilidad alguna por el uso indebido de los datos, las',
    'interpretaciones realizadas, ni las acciones derivadas del análisis de los resultados.',
    '',
    'Para más información sobre términos de uso y políticas de privacidad, visite:',
    'www.ediprofe.com'
  ];
  
  let yPos = 60;
  disclaimerText.forEach(line => {
    if (line === '') {
      yPos += 4;
    } else if (line.includes('RESPONSABILIDAD')) {
      doc.setFont('helvetica', 'bold');
      doc.text(line, 14, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
    } else {
      doc.text(line, 14, yPos);
      yPos += 5;
    }
  });
  
  // Línea decorativa
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(14, pageHeight - 30, pageWidth - 14, pageHeight - 30);
  
  // Pie de página final
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('© ' + new Date().getFullYear() + ' ediprofe.com - Herramientas educativas para instituciones', centerX, pageHeight - 20, { align: 'center' });
  doc.text('Documento generado el ' + new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), centerX, pageHeight - 15, { align: 'center' });
  
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
