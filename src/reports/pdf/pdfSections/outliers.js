/**
 * ✅ Sección: Valores Atípicos (Outliers)
 */

import { drawSectionHeader, drawWrappedText } from '../pdfCore.js';
import { drawTable } from '../pdfHelpers.js';
import { zScore } from '../../../utils/calculations/index.js';

export const generateOutliers = (doc, analysis, sectionNumber) => {
  let y = 20;
  
  // Encabezado de sección
  y = drawSectionHeader(doc, 'Valores Atípicos', sectionNumber, y);
  y += 5;
  
  // Descripción
  const description = 'Los valores atípicos son estudiantes cuyos puntajes se encuentran significativamente ' +
    'alejados del promedio (±3 desviaciones estándar). Estos casos requieren atención especial.';
  
  y = drawWrappedText(doc, description, 20, y, 170, {
    fontSize: 9,
    lineHeight: 4
  });
  
  y += 5;
  
  // Obtener outliers
  const globalMetrics = analysis.getGlobalMetrics(false); // Sin PIAR
  const outliers = globalMetrics.outliers || [];
  
  if (outliers.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // green-500
    doc.text('✓ No se encontraron valores atípicos en este análisis.', 20, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
  } else {
    // Calcular métricas para z-scores
    const dataSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
    const globals = dataSinPIAR.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
    const avg = globals.reduce((a, b) => a + b, 0) / globals.length;
    const variance = globals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (globals.length - 1);
    const sd = Math.sqrt(variance);
    
    // Preparar datos para la tabla
    const columns = ['Nombre', 'Apellido', 'Grado', 'Global', 'Z-Score', 'Tipo'];
    const rows = outliers.map(student => {
      const z = zScore(student.Global, avg, sd);
      const tipo = z > 0 ? 'Superior' : 'Inferior';
      
      return [
        student.Nombre,
        student.Apellido,
        student.Grupo,
        student.Global.toFixed(1),
        z.toFixed(2),
        tipo
      ];
    });
    
    // Dibujar tabla
    y = drawTable(doc, columns, rows, y, {
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 35 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' }
      }
    });
  }
  
  return y;
};
