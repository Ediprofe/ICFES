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
  
  // Preparar datos para la tabla con mejor formato
  const columns = ['Área Académica', 'Prom. Sin PIAR', 'Desv. Est.', 'Sin Outliers', 'Prom. Con PIAR'];
  
  const rows = chartData.promedios.map((item, index) => {
    const desv = chartData.desviacion[index];
    return [
      item.areaCompleta,
      item.sinPIAR.toFixed(2),
      desv.sinPIAR.toFixed(2),
      item.sinOutliers.toFixed(2),
      item.conPIAR.toFixed(2)
    ];
  });
  
  // Dibujar tabla con mejor distribución
  y = drawTable(doc, columns, rows, y, {
    columnStyles: {
      0: { halign: 'left', cellWidth: 50, fontStyle: 'bold' },
      1: { halign: 'center', cellWidth: 30, fontStyle: 'bold', textColor: [22, 163, 74] },
      2: { halign: 'center', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 30, textColor: [59, 130, 246] },
      4: { halign: 'center', cellWidth: 30, textColor: [107, 114, 128] }
    }
  });
  
  return y;
};
