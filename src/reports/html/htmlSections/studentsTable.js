/**
 * ✅ Sección HTML: Tabla de Estudiantes con Filtros y Promedios
 */

import { generateSectionHeader } from '../htmlCore.js';
import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';

export const generateStudentsTableSection = (analysis, sectionNumber, excludePIAR = true) => {
  const data = excludePIAR
    ? analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
    : analysis.processedData;
  
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  
  // Obtener grados únicos para el filtro
  const grades = [...new Set(sortedData.map(s => s.Grupo))].sort();
  
  return `
    ${generateSectionHeader('Listado de Estudiantes', sectionNumber, '📋')}
    
    <!-- Filtros -->
    <div class="mb-6 no-print grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Buscar estudiante</label>
        <input 
          type="text" 
          id="searchStudents" 
          placeholder="Nombre o apellido..." 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onkeyup="filterStudentsTable()"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por grado</label>
        <select 
          id="gradeFilter" 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onchange="filterStudentsTable()"
        >
          <option value="">Todos los grados</option>
          ${grades.map(grade => `<option value="${grade}">${grade}</option>`).join('')}
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Puntaje mínimo</label>
        <input 
          type="number" 
          id="minScoreFilter" 
          placeholder="Ej: 300" 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onkeyup="filterStudentsTable()"
        >
      </div>
    </div>
    
    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table id="studentsTable" class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(0)">#</th>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(1)">Nombre</th>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(2)">Apellido</th>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(3)">Grado</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(4)">Global ⬍</th>
            ${ACADEMIC_AREAS.map(area => 
              `<th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(${5 + ACADEMIC_AREAS.indexOf(area)})">${area.shortName}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${sortedData.map((student, index) => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors" data-grade="${student.Grupo}" data-global="${student.Global}">
              <td class="px-4 py-3 text-sm text-gray-700">${index + 1}</td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.Nombre}</td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.Apellido}</td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">${student.Grupo}</span>
              </td>
              <td class="px-4 py-3 text-sm text-right font-bold ${student.Global >= 300 ? 'text-green-600' : 'text-gray-700'}">
                ${student.Global ? student.Global.toFixed(1) : 'N/A'}
              </td>
              ${ACADEMIC_AREAS.map(area => {
                const score = student[area.columnName];
                return `<td class="px-4 py-3 text-sm text-right text-gray-700">${score ? score.toFixed(1) : 'N/A'}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <p class="text-sm text-gray-600 mt-4">
      Mostrando <strong id="visibleCount">${sortedData.length}</strong> de <strong>${sortedData.length}</strong> estudiantes
    </p>
    
    <script>
      function filterStudentsTable() {
        const searchValue = document.getElementById('searchStudents').value.toLowerCase();
        const gradeValue = document.getElementById('gradeFilter').value;
        const minScore = parseFloat(document.getElementById('minScoreFilter').value) || 0;
        
        const table = document.getElementById('studentsTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let visibleCount = 0;
        
        for (let row of rows) {
          const nombre = row.cells[1].textContent.toLowerCase();
          const apellido = row.cells[2].textContent.toLowerCase();
          const grade = row.getAttribute('data-grade');
          const global = parseFloat(row.getAttribute('data-global'));
          
          const matchesSearch = nombre.includes(searchValue) || apellido.includes(searchValue);
          const matchesGrade = !gradeValue || grade === gradeValue;
          const matchesScore = global >= minScore;
          
          if (matchesSearch && matchesGrade && matchesScore) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        }
        
        document.getElementById('visibleCount').textContent = visibleCount;
      }
      
      let sortDirection = {};
      function sortStudentsTable(columnIndex) {
        const table = document.getElementById('studentsTable');
        const tbody = table.getElementsByTagName('tbody')[0];
        const rows = Array.from(tbody.getElementsByTagName('tr'));
        
        sortDirection[columnIndex] = !sortDirection[columnIndex];
        const direction = sortDirection[columnIndex] ? 1 : -1;
        
        rows.sort((a, b) => {
          let aValue = a.cells[columnIndex].textContent.trim();
          let bValue = b.cells[columnIndex].textContent.trim();
          
          // Si es numérico
          if (!isNaN(aValue) && !isNaN(bValue)) {
            return direction * (parseFloat(aValue) - parseFloat(bValue));
          }
          
          // Si es texto
          return direction * aValue.localeCompare(bValue);
        });
        
        rows.forEach(row => tbody.appendChild(row));
      }
    </script>
  `;
};
