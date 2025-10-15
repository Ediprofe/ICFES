/**
 * ✅ Sección HTML: Tabla de Estudiantes con Filtros y Promedios
 */

import { generateSectionHeader } from '../htmlCore.js';
import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';

export const generateStudentsTableSection = (analysis, sectionNumber, excludePIAR = false) => {
  // Incluir todos los estudiantes por defecto
  const data = analysis.processedData;
  
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  
  // Obtener grados únicos para el filtro
  const grades = [...new Set(sortedData.map(s => s.Grupo))].sort();
  
  return `
    ${generateSectionHeader('Listado de Estudiantes', sectionNumber, '📋')}
    
    <!-- Botón Toggle PIAR -->
    <div class="mb-6 no-print">
      <div class="mb-4">
        <button 
          id="togglePiarBtnSingle" 
          onclick="togglePiarVisibilitySingle()"
          class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          👁️ Mostrar/Ocultar Estudiantes con PIAR
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(4)">PIAR</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(5)">Global ⬍</th>
            ${ACADEMIC_AREAS.map(area => 
              `<th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(${6 + ACADEMIC_AREAS.indexOf(area)})">${area.shortName}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${sortedData.map((student, index) => {
            const isPiar = student['¿PIAR?'] === 'Sí';
            const piarHighlight = isPiar ? 'bg-yellow-100 border-l-4 border-yellow-500' : '';
            const rowClass = isPiar ? 'piar-row-single' : 'no-piar-row-single';
            
            return `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors ${piarHighlight} ${rowClass}" data-grade="${student.Grupo}" data-global="${student.Global}" data-piar="${isPiar ? 'si' : 'no'}">
              <td class="px-4 py-3 text-sm text-gray-700">${index + 1}</td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.Nombre}</td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.Apellido}</td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">${student.Grupo}</span>
              </td>
              <td class="px-4 py-3 text-center">
                ${isPiar ? '<span class="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">SÍ</span>' : '<span class="px-2 py-1 bg-gray-300 text-gray-700 rounded-full text-xs">NO</span>'}
              </td>
              <td class="px-4 py-3 text-sm text-right font-bold ${student.Global >= 300 ? 'text-green-600' : 'text-gray-700'}">
                ${student.Global ? student.Global.toFixed(1) : 'N/A'}
              </td>
              ${ACADEMIC_AREAS.map(area => {
                const score = student[area.columnName];
                return `<td class="px-4 py-3 text-sm text-right text-gray-700">${score ? score.toFixed(1) : 'N/A'}</td>`;
              }).join('')}
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    <p class="text-sm text-gray-600 mt-4">
      Mostrando <strong id="visibleCount">${sortedData.length}</strong> de <strong>${sortedData.length}</strong> estudiantes
    </p>
    
    <script>
      let piarVisibleSingle = true; // Estado inicial: PIAR visible
      
      function togglePiarVisibilitySingle() {
        piarVisibleSingle = !piarVisibleSingle;
        const piarRows = document.querySelectorAll('.piar-row-single');
        
        piarRows.forEach(row => {
          if (piarVisibleSingle) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
        
        // Actualizar contador
        updateVisibleCountSingle();
      }
      
      function updateVisibleCountSingle() {
        const table = document.getElementById('studentsTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let visibleCount = 0;
        
        for (let row of rows) {
          if (row.style.display !== 'none') {
            visibleCount++;
          }
        }
        
        document.getElementById('visibleCount').textContent = visibleCount;
      }
      
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
          
          // Aplicar filtros normales
          if (matchesSearch && matchesGrade && matchesScore) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
        
        // Aplicar toggle de PIAR después de los filtros
        if (!piarVisibleSingle) {
          const piarRows = document.querySelectorAll('.piar-row-single');
          piarRows.forEach(row => {
            row.style.display = 'none';
          });
        }
        
        updateVisibleCountSingle();
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
