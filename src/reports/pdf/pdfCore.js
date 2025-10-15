/**
 * ✅ Funciones core de jsPDF
 * Funciones básicas para inicializar y manipular documentos PDF
 */

import { jsPDF } from 'jspdf';
import { BRANDING, LAYOUT_CONFIG } from '../../config/visualConfig.js';

/**
 * Inicializa un nuevo documento PDF
 */
export const initPDF = () => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
};

/**
 * Obtiene las dimensiones de la página
 */
export const getPageDimensions = (doc) => {
  return {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight()
  };
};

/**
 * Agrega una nueva página
 */
export const addNewPage = (doc) => {
  doc.addPage();
  return LAYOUT_CONFIG.margins.pdf.top;
};

/**
 * Dibuja el encabezado de una sección
 */
export const drawSectionHeader = (doc, title, sectionNumber, y) => {
  const { width } = getPageDimensions(doc);
  const margins = LAYOUT_CONFIG.margins.pdf;
  
  // Rectángulo de fondo más compacto
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(margins.left, y, width - margins.left - margins.right, 9, 'F');
  
  // Texto del título más pequeño
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${sectionNumber}. ${title.toUpperCase()}`, margins.left + 5, y + 6.5);
  
  // Resetear color
  doc.setTextColor(0, 0, 0);
  
  return y + 15; // Retornar nueva posición Y
};

/**
 * Dibuja el pie de página
 */
export const drawFooter = (doc, pageNumber, additionalInfo = '') => {
  const { width, height } = getPageDimensions(doc);
  const margins = LAYOUT_CONFIG.margins.pdf;
  
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128); // gray-500
  
  // Número de página
  doc.text(
    `Página ${pageNumber}`,
    width / 2,
    height - 10,
    { align: 'center' }
  );
  
  // Información adicional (izquierda)
  if (additionalInfo) {
    doc.text(
      additionalInfo,
      margins.left,
      height - 10
    );
  }
  
  // Branding (derecha)
  doc.text(
    BRANDING.name,
    width - margins.right,
    height - 10,
    { align: 'right' }
  );
  
  doc.setTextColor(0, 0, 0);
};

/**
 * Verifica si hay espacio suficiente en la página actual
 * Si no hay espacio, agrega una nueva página
 */
export const checkAndAddPage = (doc, currentY, requiredSpace) => {
  const { height } = getPageDimensions(doc);
  const margins = LAYOUT_CONFIG.margins.pdf;
  
  if (currentY + requiredSpace > height - margins.bottom - 15) {
    return addNewPage(doc);
  }
  
  return currentY;
};

/**
 * Dibuja texto con word wrap
 */
export const drawWrappedText = (doc, text, x, y, maxWidth, options = {}) => {
  const {
    fontSize = 10,
    fontStyle = 'normal',
    lineHeight = 5,
    align = 'left'
  } = options;
  
  doc.setFontSize(fontSize);
  doc.setFont(undefined, fontStyle);
  
  const lines = doc.splitTextToSize(text, maxWidth);
  
  lines.forEach((line, index) => {
    doc.text(line, x, y + (index * lineHeight), { align });
  });
  
  return y + (lines.length * lineHeight);
};

/**
 * Dibuja un título de subsección
 */
export const drawSubsectionTitle = (doc, title, y) => {
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(title, LAYOUT_CONFIG.margins.pdf.left, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  
  return y + 7;
};

/**
 * Dibuja una línea horizontal
 */
export const drawHorizontalLine = (doc, y, color = [200, 200, 200]) => {
  const { width } = getPageDimensions(doc);
  const margins = LAYOUT_CONFIG.margins.pdf;
  
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.3);
  doc.line(margins.left, y, width - margins.right, y);
  doc.setDrawColor(0, 0, 0);
  
  return y + 5;
};

/**
 * Dibuja un card de métrica
 */
export const drawMetricCard = (doc, title, value, x, y, width, color = [37, 99, 235]) => {
  const height = 20;
  
  // Borde del card
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, width, height, 2, 2, 'S');
  
  // Título
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text(title, x + width / 2, y + 7, { align: 'center' });
  
  // Valor
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(String(value), x + width / 2, y + 15, { align: 'center' });
  
  // Resetear
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  
  return y + height + 5;
};

/**
 * Obtiene el número de página actual
 */
export const getCurrentPageNumber = (doc) => {
  return doc.internal.getCurrentPageInfo().pageNumber;
};

/**
 * Establece metadatos del PDF
 */
export const setPDFMetadata = (doc, metadata = {}) => {
  const {
    title = 'Análisis ICFES',
    subject = 'Análisis de Resultados Académicos',
    author = BRANDING.name,
    keywords = 'ICFES, análisis, educación',
    creator = BRANDING.name
  } = metadata;
  
  doc.setProperties({
    title,
    subject,
    author,
    keywords,
    creator
  });
};
