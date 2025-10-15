/**
 * ✅ Sección: Portada del PDF
 */

import { getPageDimensions, drawWrappedText } from '../pdfCore.js';
import { BRANDING } from '../../../config/visualConfig.js';

export const generateCoverPage = (doc, analysis, options = {}) => {
  const { isMultiYear = false, comparisonYears = [], allAnalyses = [] } = options;
  const { width, height } = getPageDimensions(doc);
  
  // Fondo degradado azul superior (más alto para comparativo)
  const headerHeight = isMultiYear ? 100 : 80;
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, width, headerHeight, 'F');
  
  // Título principal
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Análisis ICFES', width / 2, 30, { align: 'center' });
  
  // Subtítulo
  doc.setFontSize(18);
  doc.setFont(undefined, 'normal');
  const subtitle = isMultiYear 
    ? 'Análisis Comparativo Multi-Año'
    : `Año ${analysis.year}`;
  doc.text(subtitle, width / 2, 50, { align: 'center' });
  
  // Si es multi-año, mostrar años en el header
  if (isMultiYear) {
    doc.setFontSize(14);
    const years = [analysis.year, ...comparisonYears].sort((a, b) => b - a);
    doc.text(`Años: ${years.join(' • ')}`, width / 2, 70, { align: 'center' });
  }
  
  // Información del análisis
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  
  let y = isMultiYear ? 115 : 100;
  
  if (isMultiYear && allAnalyses.length > 0) {
    // Mostrar información detallada de cada año en cajas
    const sortedAnalyses = allAnalyses.sort((a, b) => b.year - a.year);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('Resumen por Año', width / 2, y, { align: 'center' });
    y += 12;
    
    sortedAnalyses.forEach((yearAnalysis, index) => {
      // Caja para cada año
      const boxY = y;
      const boxHeight = 35;
      
      // Fondo alternado
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251); // gray-50
        doc.rect(25, boxY - 5, width - 50, boxHeight, 'F');
      }
      
      // Año (grande y destacado)
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(String(yearAnalysis.year), 35, boxY + 3);
      
      // Información en columnas
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Columna 1: Total estudiantes
      doc.setFont(undefined, 'bold');
      doc.text('Total:', 70, boxY);
      doc.setFont(undefined, 'normal');
      doc.text(String(yearAnalysis.metadata.totalStudents), 70, boxY + 6);
      
      // Columna 2: Sin PIAR
      doc.setFont(undefined, 'bold');
      doc.setTextColor(22, 163, 74); // green-600
      doc.text('Sin PIAR:', 100, boxY);
      doc.setFont(undefined, 'normal');
      doc.text(String(yearAnalysis.metadata.studentsWithoutPIAR), 100, boxY + 6);
      
      // Columna 3: Con PIAR
      doc.setFont(undefined, 'bold');
      doc.setTextColor(107, 114, 128); // gray-500
      doc.text('Con PIAR:', 135, boxY);
      doc.setFont(undefined, 'normal');
      doc.text(String(yearAnalysis.metadata.studentsWithPIAR), 135, boxY + 6);
      
      // Columna 4: Grados
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Grados:', 35, boxY + 15);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text(yearAnalysis.metadata.grades.join(', '), 35, boxY + 21);
      
      y += boxHeight + 3;
    });
    
    y += 5;
  } else {
    // Modo de un solo año (original)
    doc.text('Año:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(analysis.year), 50, y);
    y += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Total de estudiantes:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(analysis.metadata.totalStudents), 80, y);
    y += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Estudiantes con PIAR:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(analysis.metadata.studentsWithPIAR), 80, y);
    y += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Estudiantes sin PIAR:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(analysis.metadata.studentsWithoutPIAR), 80, y);
    y += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Grados:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(analysis.metadata.grades.join(', '), 50, y);
    y += 20;
  }
  
  // Descripción del informe
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // gray-500
  
  const description = isMultiYear
    ? 'Este informe presenta un análisis comparativo de los resultados de las pruebas ICFES ' +
      'a lo largo de múltiples años, permitiendo identificar tendencias y evolución del desempeño académico.'
    : 'Este informe presenta un análisis detallado de los resultados de las pruebas ICFES, ' +
      'incluyendo métricas estadísticas, gráficos comparativos y análisis por área y grado.';
  
  drawWrappedText(doc, description, 30, y, width - 60, {
    fontSize: 10,
    lineHeight: 5
  });
  
  // Branding en la parte inferior
  y = height - 60;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Desarrollado por:', width / 2, y, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(BRANDING.name, width / 2, y + 8, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont(undefined, 'normal');
  doc.text(BRANDING.url, width / 2, y + 15, { align: 'center' });
  
  // Redes sociales
  doc.setFontSize(8);
  y += 22;
  doc.text('YouTube: @ProfeEdi', width / 2 - 30, y);
  doc.text('TikTok: @ediprofe', width / 2 + 10, y);
  
  // Fecha de generación
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  const fecha = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Generado el ${fecha}`, width / 2, height - 20, { align: 'center' });
  
  // Resetear colores
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
};
