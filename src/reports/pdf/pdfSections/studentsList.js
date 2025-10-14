/**
 * ✅ Sección: Listado de Estudiantes
 */

import { drawSectionHeader } from '../pdfCore.js';
import { drawTable } from '../pdfHelpers.js';

export const generateStudentsList = (doc, analysis, sectionNumber, options = {}) => {
  const { excludePIAR = true } = options;
  
  let y = 20;
  
  // Encabezado de sección
  y = drawSectionHeader(doc, 'Listado de Estudiantes', sectionNumber, y);
  y += 5;
  
  // Obtener datos
  const data = excludePIAR
    ? analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
    : analysis.processedData;
  
  // Ordenar por puntaje global descendente
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  
  // Preparar datos para la tabla
  const columns = ['#', 'Nombre', 'Apellido', 'Grado', 'Global'];
  const rows = sortedData.map((student, index) => [
    String(index + 1),
    student.Nombre,
    student.Apellido,
    student.Grupo,
    student.Global ? student.Global.toFixed(1) : 'N/A'
  ]);
  
  // Dibujar tabla
  y = drawTable(doc, columns, rows, y, {
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' }
    }
  });
  
  return y;
};
