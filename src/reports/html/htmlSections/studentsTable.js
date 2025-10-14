/**
 * ✅ Sección HTML: Tabla de Estudiantes
 */

import { generateSectionHeader, generateTable } from '../htmlCore.js';

export const generateStudentsTableSection = (analysis, sectionNumber, excludePIAR = true) => {
  const data = excludePIAR
    ? analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
    : analysis.processedData;
  
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  
  const columns = ['#', 'Nombre', 'Apellido', 'Grado', 'Global'];
  const rows = sortedData.map((student, index) => [
    index + 1,
    student.Nombre,
    student.Apellido,
    student.Grupo,
    student.Global ? student.Global.toFixed(1) : 'N/A'
  ]);
  
  return `
    ${generateSectionHeader('Listado de Estudiantes', sectionNumber, '📋')}
    
    <div class="mb-4 no-print">
      <input 
        type="text" 
        id="searchStudents" 
        placeholder="Buscar estudiante..." 
        class="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-96"
        onkeyup="filterTable('studentsTable', this.value)"
      >
    </div>
    
    <div id="studentsTableContainer">
      ${generateTable(columns, rows, { striped: true, hover: true })}
    </div>
    
    <p class="text-sm text-gray-600 mt-4">
      Total de estudiantes: <strong>${sortedData.length}</strong>
    </p>
  `;
};
