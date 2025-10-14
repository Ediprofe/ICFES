/**
 * ✅ Sección: Top Performers (por área y por grado)
 */

import { drawSectionHeader, checkAndAddPage, drawSubsectionTitle } from '../pdfCore.js';
import { drawTable } from '../pdfHelpers.js';
import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';
import { METRIC_LIMITS } from '../../../config/metricsConfig.js';

export const generateTopPerformers = (doc, analysis, sectionNumber) => {
  let y = 20;
  
  // Encabezado de sección
  y = drawSectionHeader(doc, 'Mejores Desempeños', sectionNumber, y);
  y += 5;
  
  // Top 5 por Área
  y = drawSubsectionTitle(doc, `Top ${METRIC_LIMITS.TOP_PERFORMERS_BY_AREA} por Área Académica`, y);
  
  ACADEMIC_AREAS.forEach(area => {
    y = checkAndAddPage(doc, y, 40);
    
    const topStudents = analysis.getTopByArea(area.columnName, METRIC_LIMITS.TOP_PERFORMERS_BY_AREA);
    
    if (topStudents.length > 0) {
      // Título del área
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text(area.name, 20, y);
      y += 5;
      
      // Tabla
      const columns = ['#', 'Nombre', 'Apellido', 'Puntaje'];
      const rows = topStudents.map((student, index) => [
        String(index + 1),
        student.nombre,
        student.apellido,
        student.puntaje.toFixed(1)
      ]);
      
      y = drawTable(doc, columns, rows, y, {
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 20, halign: 'center' }
        }
      });
      
      y += 3;
    }
  });
  
  // Nueva página para Top por Grado
  y = checkAndAddPage(doc, y, 100);
  y = drawSubsectionTitle(doc, `Top ${METRIC_LIMITS.TOP_PERFORMERS_BY_GRADE} por Grado`, y);
  
  const topByGrade = analysis.getTopByGrade(METRIC_LIMITS.TOP_PERFORMERS_BY_GRADE);
  
  topByGrade.forEach(gradeData => {
    y = checkAndAddPage(doc, y, 40);
    
    if (gradeData.top.length > 0) {
      // Título del grado
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text(gradeData.grado, 20, y);
      y += 5;
      
      // Tabla
      const columns = ['#', 'Nombre', 'Apellido', 'Global'];
      const rows = gradeData.top.map((student, index) => [
        String(index + 1),
        student.nombre,
        student.apellido,
        student.global.toFixed(1)
      ]);
      
      y = drawTable(doc, columns, rows, y, {
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 20, halign: 'center' }
        }
      });
      
      y += 3;
    }
  });
  
  return y;
};
