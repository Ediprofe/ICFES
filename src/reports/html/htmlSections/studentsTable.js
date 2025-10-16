/**
 * ✅ Sección HTML: Tabla de Estudiantes con Filtros y Promedios
 */

import { generateSectionHeader } from '../htmlCore.js';
import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';
import { calculateGlobalMetrics } from '../../../utils/calculations/metrics.js';

export const generateStudentsTableSection = (analysis, sectionNumber, excludePIAR = false) => {
  // Incluir todos los estudiantes por defecto
  const data = analysis.processedData;
  
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  
  // Obtener grados únicos para el filtro
  const grades = [...new Set(sortedData.map(s => s.Grupo))].sort();
  
  // Calcular métricas para clasificación de desempeño (sin PIAR)
  const metricsSinPIAR = calculateGlobalMetrics(data, true);
  const promedio = metricsSinPIAR.promedio;
  const desviacion = metricsSinPIAR.desviacion;
  
  // Función para clasificar desempeño basado en desviación estándar
  const clasificarDesempeno = (puntaje) => {
    if (puntaje < promedio - desviacion) return 'bajo';
    if (puntaje < promedio) return 'medio-bajo';
    if (puntaje <= promedio + desviacion) return 'medio-alto';
    return 'alto';
  };
  
  // Agregar clasificación a cada estudiante
  sortedData.forEach(student => {
    student.desempeno = clasificarDesempeno(student.Global);
  });
  
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">${sectionNumber}. 📋 Listado de estudiantes</h2>
        <p class="text-blue-100 text-sm mt-1">Tabla completa con filtros y ordenamiento</p>
      </div>
      <button 
        onclick="toggleStudentsTableSingle()" 
        id="toggleStudentsButtonSingle"
        class="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <svg id="toggleIconSingle" class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
        <span id="toggleTextSingle">Ocultar tabla</span>
      </button>
    </div>
    
    <div id="studentsTableContainerSingle" class="transition-all duration-500 ease-in-out overflow-hidden" style="max-height: 10000px;">
    
    <!-- Toggle PIAR Moderno -->
    <div class="mb-6 no-print flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700">Mostrar PIAR:</span>
        <button 
          id="togglePiarBtnSingle" 
          onclick="togglePiarVisibilitySingle()"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          <span id="piarStatusSingle">Sí</span>
        </button>
      </div>
      <div id="piarCountSingle" class="text-sm text-gray-600"></div>
    </div>
    
    <!-- Filtros -->
    <div class="mb-6 no-print">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Desempeño</label>
          <select 
            id="performanceFilter" 
            class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onchange="filterStudentsTable()"
          >
            <option value="">Todos los niveles</option>
            <option value="bajo">🟥 Bajo (< μ - 1σ)</option>
            <option value="medio-bajo">🟨 Medio-bajo (μ - 1σ a μ)</option>
            <option value="medio-alto">🟩 Medio-alto (μ a μ + 1σ)</option>
            <option value="alto">🟦 Alto (> μ + 1σ)</option>
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
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Puntaje máximo</label>
          <input 
            type="number" 
            id="maxScoreFilter" 
            placeholder="Ej: 400" 
            class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onkeyup="filterStudentsTable()"
          >
        </div>
      </div>
      
      <!-- Leyenda de desempeño -->
      <div class="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
        <div class="text-xs font-semibold text-gray-700 mb-2">📊 Clasificación de desempeño (basada en μ = ${promedio.toFixed(2)}, σ = ${desviacion.toFixed(2)}):</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-red-500 rounded-full"></span>
            <span class="text-gray-600"><strong>Bajo:</strong> < ${(promedio - desviacion).toFixed(1)} (~16%)</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span class="text-gray-600"><strong>Medio-bajo:</strong> ${(promedio - desviacion).toFixed(1)} - ${promedio.toFixed(1)} (~34%)</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
            <span class="text-gray-600"><strong>Medio-alto:</strong> ${promedio.toFixed(1)} - ${(promedio + desviacion).toFixed(1)} (~34%)</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span class="text-gray-600"><strong>Alto:</strong> > ${(promedio + desviacion).toFixed(1)} (~16%)</span>
          </div>
        </div>
      </div>
      
      <!-- Contador de coincidencias -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
          <span class="text-sm font-semibold text-gray-700">Resultados:</span>
        </div>
        <div id="matchCounter" class="text-lg font-bold text-blue-600">
          ${sortedData.length} estudiante${sortedData.length !== 1 ? 's' : ''}
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
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(5)">Desempeño</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(6)">Global ⬍</th>
            ${ACADEMIC_AREAS.map(area => 
              `<th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortStudentsTable(${7 + ACADEMIC_AREAS.indexOf(area)})">${area.shortName}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${sortedData.map((student, index) => {
            const isPiar = student['¿PIAR?'] === 'Sí';
            const piarHighlight = isPiar ? 'bg-yellow-100 border-l-4 border-yellow-500' : '';
            const rowClass = isPiar ? 'piar-row-single' : 'no-piar-row-single';
            
            // Badge de desempeño
            const desempenoBadges = {
              'bajo': '<span class="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">🟥 Bajo</span>',
              'medio-bajo': '<span class="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">🟨 M-Bajo</span>',
              'medio-alto': '<span class="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold">🟩 M-Alto</span>',
              'alto': '<span class="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">🟦 Alto</span>'
            };
            
            return `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors ${piarHighlight} ${rowClass}" data-grade="${student.Grupo}" data-global="${student.Global}" data-piar="${isPiar ? 'si' : 'no'}" data-performance="${student.desempeno}">
              <td class="px-4 py-3 text-sm text-gray-700">${index + 1}</td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.Nombre}</td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.Apellido}</td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">${student.Grupo}</span>
              </td>
              <td class="px-4 py-3 text-center">
                ${isPiar ? '<span class="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">SÍ</span>' : '<span class="px-2 py-1 bg-gray-300 text-gray-700 rounded-full text-xs">NO</span>'}
              </td>
              <td class="px-4 py-3 text-center">
                ${desempenoBadges[student.desempeno]}
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
    
    </div> <!-- Fin del contenedor colapsable -->
    
    <script>
      // Estado del toggle de la tabla
      let studentsTableVisibleSingle = true;
      
      function toggleStudentsTableSingle() {
        const container = document.getElementById('studentsTableContainerSingle');
        const icon = document.getElementById('toggleIconSingle');
        const text = document.getElementById('toggleTextSingle');
        
        studentsTableVisibleSingle = !studentsTableVisibleSingle;
        
        if (studentsTableVisibleSingle) {
          // Mostrar tabla
          container.style.maxHeight = '10000px';
          container.style.opacity = '1';
          icon.style.transform = 'rotate(0deg)';
          text.textContent = 'Ocultar tabla';
        } else {
          // Ocultar tabla
          container.style.maxHeight = '0';
          container.style.opacity = '0';
          icon.style.transform = 'rotate(-90deg)';
          text.textContent = 'Mostrar tabla';
        }
      }
      
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
        
        // Actualizar texto del botón
        const statusSpan = document.getElementById('piarStatusSingle');
        if (statusSpan) {
          statusSpan.textContent = piarVisibleSingle ? 'Sí' : 'No';
        }
        
        // Actualizar contador
        updateVisibleCountSingle();
        updatePiarCount();
      }
      
      function updatePiarCount() {
        const piarRows = document.querySelectorAll('.piar-row-single');
        const visiblePiarRows = Array.from(piarRows).filter(row => row.style.display !== 'none');
        const countDiv = document.getElementById('piarCountSingle');
        if (countDiv) {
          countDiv.textContent = \`Estudiantes con PIAR: \${visiblePiarRows.length} de \${piarRows.length}\`;
        }
      }
      
      // Inicializar contador al cargar
      window.addEventListener('DOMContentLoaded', () => {
        updatePiarCount();
      });
      
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
        const performanceValue = document.getElementById('performanceFilter').value;
        const minScore = parseFloat(document.getElementById('minScoreFilter').value) || 0;
        const maxScore = parseFloat(document.getElementById('maxScoreFilter').value) || Infinity;
        
        const table = document.getElementById('studentsTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let visibleCount = 0;
        
        for (let row of rows) {
          const nombre = row.cells[1].textContent.toLowerCase();
          const apellido = row.cells[2].textContent.toLowerCase();
          const grade = row.getAttribute('data-grade');
          const performance = row.getAttribute('data-performance');
          const global = parseFloat(row.getAttribute('data-global'));
          
          const matchesSearch = nombre.includes(searchValue) || apellido.includes(searchValue);
          const matchesGrade = !gradeValue || grade === gradeValue;
          const matchesPerformance = !performanceValue || performance === performanceValue;
          const matchesMinScore = global >= minScore;
          const matchesMaxScore = global <= maxScore;
          
          // Aplicar filtros normales
          if (matchesSearch && matchesGrade && matchesPerformance && matchesMinScore && matchesMaxScore) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        }
        
        // Aplicar toggle de PIAR después de los filtros
        if (!piarVisibleSingle) {
          const piarRows = document.querySelectorAll('.piar-row-single');
          piarRows.forEach(row => {
            if (row.style.display !== 'none') {
              row.style.display = 'none';
              visibleCount--;
            }
          });
        }
        
        // Actualizar contador de coincidencias
        const matchCounter = document.getElementById('matchCounter');
        if (matchCounter) {
          matchCounter.textContent = \`\${visibleCount} estudiante\${visibleCount !== 1 ? 's' : ''}\`;
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
