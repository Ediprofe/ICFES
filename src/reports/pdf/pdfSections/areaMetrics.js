/**
 * ✅ Sección: Métricas por Área
 */

import { drawSectionHeader } from '../pdfCore.js';
import { drawTable } from '../pdfHelpers.js';
import { prepareAreaChartData } from '../../charts/chartDataPreparation.js';

export const generateAreaMetrics = (doc, analysis, sectionNumber) => {
  let y = 20;
  
  // Encabezado de sección
  y = drawSectionHeader(doc, 'Análisis por Área Académica', sectionNumber, y);
  y += 5;
  
  // Obtener datos preparados
  const chartData = prepareAreaChartData(analysis, true);
  
  // Preparar datos para la tabla
  const columns = ['Área', 'Promedio\nCon PIAR', 'Promedio\nSin PIAR', 'Desv. Est.\nCon PIAR', 'Desv. Est.\nSin PIAR'];
  
  const rows = chartData.promedios.map((item, index) => {
    const desv = chartData.desviacion[index];
    return [
      item.areaCompleta,
      item.conPIAR.toFixed(2),
      item.sinPIAR.toFixed(2),
      desv.conPIAR.toFixed(2),
      desv.sinPIAR.toFixed(2)
    ];
  });
  
  // Dibujar tabla
  y = drawTable(doc, columns, rows, y, {
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' }
    }
  });
  
  return y;
};
