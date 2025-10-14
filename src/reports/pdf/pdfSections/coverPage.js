/**
 * ✅ Sección: Portada del PDF
 */

import { getPageDimensions, drawWrappedText } from '../pdfCore.js';
import { BRANDING } from '../../../config/visualConfig.js';

export const generateCoverPage = (doc, analysis, options = {}) => {
  const { isMultiYear = false, comparisonYears = [] } = options;
  const { width, height } = getPageDimensions(doc);
  
  // Fondo azul superior
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, width, 80, 'F');
  
  // Título principal
  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Análisis ICFES', width / 2, 35, { align: 'center' });
  
  // Subtítulo
  doc.setFontSize(16);
  doc.setFont(undefined, 'normal');
  const subtitle = isMultiYear 
    ? 'Análisis Comparativo Multi-Año'
    : `Año ${analysis.year}`;
  doc.text(subtitle, width / 2, 50, { align: 'center' });
  
  // Información del análisis
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  
  let y = 100;
  
  // Año(s)
  if (isMultiYear) {
    doc.text('Años analizados:', 30, y);
    doc.setFont(undefined, 'normal');
    const years = [analysis.year, ...comparisonYears].sort((a, b) => b - a);
    doc.text(years.join(', '), 80, y);
    y += 10;
  } else {
    doc.text('Año:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(analysis.year), 50, y);
    y += 10;
  }
  
  // Total de estudiantes
  doc.setFont(undefined, 'bold');
  doc.text('Total de estudiantes:', 30, y);
  doc.setFont(undefined, 'normal');
  doc.text(String(analysis.metadata.totalStudents), 80, y);
  y += 10;
  
  // Estudiantes con PIAR
  doc.setFont(undefined, 'bold');
  doc.text('Estudiantes con PIAR:', 30, y);
  doc.setFont(undefined, 'normal');
  doc.text(String(analysis.metadata.studentsWithPIAR), 80, y);
  y += 10;
  
  // Estudiantes sin PIAR
  doc.setFont(undefined, 'bold');
  doc.text('Estudiantes sin PIAR:', 30, y);
  doc.setFont(undefined, 'normal');
  doc.text(String(analysis.metadata.studentsWithoutPIAR), 80, y);
  y += 10;
  
  // Grados
  doc.setFont(undefined, 'bold');
  doc.text('Grados:', 30, y);
  doc.setFont(undefined, 'normal');
  doc.text(analysis.metadata.grades.join(', '), 50, y);
  y += 20;
  
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
