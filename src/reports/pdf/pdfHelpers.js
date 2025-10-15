/**
 * ✅ Funciones helper para dibujar elementos complejos en PDF
 * Tablas, gráficos, etc.
 */

import autoTable from 'jspdf-autotable';
import { ACADEMIC_AREAS } from '../../config/columnConfig.js';
import { TABLE_CONFIG, COLORS } from '../../config/visualConfig.js';

/**
 * Convierte color hex a RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Dibuja una tabla usando autoTable con diseño mejorado
 */
export const drawTable = (doc, columns, rows, startY, options = {}) => {
  const {
    columnStyles = {},
    margin = { left: 20, right: 20 }
  } = options;
  
  autoTable(doc, {
    startY,
    head: [columns],
    body: rows,
    theme: 'plain',
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8, // Reducido de 10 a 8 para evitar desbordamiento
      halign: 'center',
      valign: 'middle',
      cellPadding: 4,
      lineWidth: 0,
      minCellHeight: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [31, 41, 55], // gray-800
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: [229, 231, 235], // gray-200
      valign: 'middle',
      minCellHeight: 10
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251] // gray-50
    },
    columnStyles,
    margin,
    tableWidth: 'auto', // Usar ancho automático inteligente
    styles: {
      overflow: 'linebreak',
      cellWidth: 'auto', // Ancho automático en lugar de wrap
      font: 'helvetica',
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
      halign: 'left' // Alineación por defecto
    },
    didParseCell: function(data) {
      // Mejorar primera fila del body
      if (data.section === 'body' && data.row.index === 0) {
        data.cell.styles.fillColor = [239, 246, 255]; // blue-50
      }
    }
  });
  
  return doc.lastAutoTable.finalY + 10;
};

/**
 * Dibuja un gráfico de barras
 */
export const drawBarChart = (doc, data, x, y, width, height, title, options = {}) => {
  const {
    maxValue = 100,
    showComparison = true,
    useDynamicScale = false,
    showLabels = true
  } = options;
  
  const barWidth = width / (data.length * (showComparison ? 2.5 : 1.5));
  const chartHeight = height - 35;
  const barSpacing = barWidth * 0.3;
  
  // Calcular escala
  let scaleMin = 0;
  let scaleMax = maxValue;
  
  if (useDynamicScale) {
    const allValues = data.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v !== undefined && v > 0);
    if (allValues.length > 0) {
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const padding = (maxValue - minValue) * 0.15;
      scaleMin = Math.max(0, Math.floor(minValue - padding));
      scaleMax = Math.ceil(maxValue + padding);
    }
  }
  
  // Título
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, x + width / 2, y, { align: 'center' });
  y += 10;
  
  // Eje Y con líneas de referencia
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  
  for (let i = 0; i <= 5; i++) {
    const yLine = y + chartHeight - (i * chartHeight / 5);
    doc.line(x, yLine, x + width, yLine);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    const label = (scaleMin + ((scaleMax - scaleMin) / 5) * i).toFixed(0);
    doc.text(label, x - 5, yLine + 1, { align: 'right' });
  }
  
  doc.setTextColor(0);
  
  // Dibujar barras
  data.forEach((item, index) => {
    // Obtener color del área
    const area = ACADEMIC_AREAS.find(a => a.shortName === item.area || a.name === item.area);
    const colorRgb = area ? hexToRgb(area.color) : { r: 37, g: 99, b: 235 };
    const color = [colorRgb.r, colorRgb.g, colorRgb.b];
    
    const xPos = x + (index * (barWidth * (showComparison ? 2.5 : 1.5)));
    
    // Barra con PIAR (si aplica)
    if (showComparison && item.conPIAR !== undefined) {
      const normalizedConPIAR = (item.conPIAR - scaleMin) / (scaleMax - scaleMin);
      const barHeightConPIAR = normalizedConPIAR * chartHeight;
      
      doc.setFillColor(156, 163, 175); // gray-400
      doc.setDrawColor(107, 114, 128);
      doc.setLineWidth(0.5);
      doc.rect(xPos, y + chartHeight - barHeightConPIAR, barWidth - barSpacing, barHeightConPIAR, 'FD');
      
      if (showLabels) {
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.setFont(undefined, 'bold');
        doc.text(item.conPIAR.toFixed(1), xPos + (barWidth - barSpacing) / 2, y + chartHeight - barHeightConPIAR - 2, { align: 'center' });
      }
    }
    
    // Barra sin PIAR
    const xPosSinPIAR = showComparison ? xPos + barWidth : xPos;
    const normalizedSinPIAR = (item.sinPIAR - scaleMin) / (scaleMax - scaleMin);
    const barHeightSinPIAR = normalizedSinPIAR * chartHeight;
    
    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8);
    doc.setLineWidth(0.5);
    doc.rect(xPosSinPIAR, y + chartHeight - barHeightSinPIAR, barWidth - barSpacing, barHeightSinPIAR, 'FD');
    
    if (showLabels) {
      doc.setFontSize(8);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFont(undefined, 'bold');
      doc.text(item.sinPIAR.toFixed(1), xPosSinPIAR + (barWidth - barSpacing) / 2, y + chartHeight - barHeightSinPIAR - 2, { align: 'center' });
    }
    
    // Etiqueta del área
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(7);
    const labelText = item.area.length > 8 ? item.area.substring(0, 7) + '.' : item.area;
    doc.text(labelText, xPos + barWidth, y + chartHeight + 5, { align: 'center', angle: 0 });
  });
  
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  return y + height + 10;
};

/**
 * Dibuja un gráfico de líneas (para tendencias multi-año)
 */
export const drawLineChart = (doc, series, x, y, width, height, title, options = {}) => {
  const {
    showPoints = true,
    showLabels = true,
    showLegend = true
  } = options;
  
  const chartHeight = height - 40;
  const chartWidth = width - 20;
  
  // Título
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, x + width / 2, y, { align: 'center' });
  y += 15;
  
  // Encontrar rangos
  const allYears = [...new Set(series.flatMap(s => s.data.map(d => d.year)))].sort();
  const allValues = series.flatMap(s => s.data.map(d => d.value));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;
  const scaleMin = Math.max(0, minValue - padding);
  const scaleMax = maxValue + padding;
  
  // Eje Y
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  
  for (let i = 0; i <= 5; i++) {
    const yLine = y + chartHeight - (i * chartHeight / 5);
    doc.line(x, yLine, x + chartWidth, yLine);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    const label = (scaleMin + ((scaleMax - scaleMin) / 5) * i).toFixed(0);
    doc.text(label, x - 5, yLine + 1, { align: 'right' });
  }
  
  // Eje X (años)
  allYears.forEach((year, index) => {
    const xPos = x + (index * chartWidth / (allYears.length - 1));
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(String(year), xPos, y + chartHeight + 8, { align: 'center' });
  });
  
  doc.setTextColor(0);
  
  // Dibujar líneas para cada serie
  series.forEach((serie) => {
    const area = ACADEMIC_AREAS.find(a => a.id === serie.areaId);
    const colorRgb = area ? hexToRgb(area.color) : hexToRgb(COLORS.primary);
    const color = [colorRgb.r, colorRgb.g, colorRgb.b];
    
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(1);
    
    // Dibujar línea
    serie.data.forEach((point, index) => {
      if (index < serie.data.length - 1) {
        const nextPoint = serie.data[index + 1];
        
        const x1 = x + (allYears.indexOf(point.year) * chartWidth / (allYears.length - 1));
        const y1 = y + chartHeight - ((point.value - scaleMin) / (scaleMax - scaleMin)) * chartHeight;
        const x2 = x + (allYears.indexOf(nextPoint.year) * chartWidth / (allYears.length - 1));
        const y2 = y + chartHeight - ((nextPoint.value - scaleMin) / (scaleMax - scaleMin)) * chartHeight;
        
        doc.line(x1, y1, x2, y2);
      }
    });
    
    // Dibujar puntos
    if (showPoints) {
      serie.data.forEach(point => {
        const xPos = x + (allYears.indexOf(point.year) * chartWidth / (allYears.length - 1));
        const yPos = y + chartHeight - ((point.value - scaleMin) / (scaleMax - scaleMin)) * chartHeight;
        
        doc.setFillColor(color[0], color[1], color[2]);
        doc.circle(xPos, yPos, 1.5, 'F');
        
        if (showLabels) {
          doc.setFontSize(7);
          doc.setTextColor(color[0], color[1], color[2]);
          doc.text(point.value.toFixed(1), xPos, yPos - 3, { align: 'center' });
        }
      });
    }
  });
  
  // Leyenda
  if (showLegend && series.length > 1) {
    let legendY = y + chartHeight + 15;
    const legendX = x;
    
    series.forEach((serie, index) => {
      const area = ACADEMIC_AREAS.find(a => a.id === serie.areaId);
      const colorRgb = area ? hexToRgb(area.color) : hexToRgb(COLORS.primary);
      const color = [colorRgb.r, colorRgb.g, colorRgb.b];
      
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(legendX + (index * 35), legendY, 3, 3, 'F');
      
      doc.setFontSize(7);
      doc.setTextColor(0);
      doc.text(serie.shortName || serie.area, legendX + (index * 35) + 5, legendY + 2);
    });
  }
  
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  return y + height + (showLegend && series.length > 1 ? 20 : 10);
};

/**
 * Dibuja un badge/etiqueta
 */
export const drawBadge = (doc, text, x, y, color = [37, 99, 235]) => {
  const padding = 2;
  const textWidth = doc.getTextWidth(text);
  const badgeWidth = textWidth + (padding * 2);
  const badgeHeight = 5;
  
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, badgeWidth, badgeHeight, 1, 1, 'F');
  
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(text, x + padding, y + 3.5);
  
  doc.setTextColor(0);
  
  return x + badgeWidth + 3;
};
