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
  
  // Preparar datos para la tabla con todas las áreas
  const columns = ['Año', 'Nombre', 'Apellido', 'Grado', 'Global', 'Lect.', 'Mat.', 'Soc.', 'Nat.', 'Ing.'];
  const rows = sortedData.map((student) => [
    analysis.year.toString(),
    student.Nombre,
    student.Apellido,
    student.Grupo,
    student.Global ? student.Global.toFixed(1) : 'N/A',
    student['Lectura crítica'] ? student['Lectura crítica'].toFixed(1) : 'N/A',
    student.Matemáticas ? student.Matemáticas.toFixed(1) : 'N/A',
    student.Sociales ? student.Sociales.toFixed(1) : 'N/A',
    student.Naturales ? student.Naturales.toFixed(1) : 'N/A',
    student.Inglés ? student.Inglés.toFixed(1) : 'N/A'
  ]);
  
  // Dibujar tabla con mejor distribución
  y = drawTable(doc, columns, rows, y, {
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 15 },
      1: { halign: 'left', cellWidth: 25 },
      2: { halign: 'left', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 15 },
      6: { halign: 'center', cellWidth: 15 },
      7: { halign: 'center', cellWidth: 15 },
      8: { halign: 'center', cellWidth: 15 },
      9: { halign: 'center', cellWidth: 15 }
    }
  });
  
  return y;
};
