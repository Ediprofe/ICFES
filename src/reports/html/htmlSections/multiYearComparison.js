/**
 * ✅ Sección HTML: Comparación Multi-Año
 * Compara métricas entre diferentes años
 */

import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';
import { prepareAreaChartData } from '../../charts/chartDataPreparation.js';

/**
 * Genera la sección de comparación de métricas globales
 */
export const generateGlobalComparisonSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6">
      <h2 class="text-2xl font-bold">${sectionNumber}. COMPARACION DE METRICAS GLOBALES</h2>
    </div>
    
    <!-- Métricas Sin PIAR (Principales) -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-green-600 mb-3 uppercase">Sin PIAR (Metricas Principales)</h3>
      <div class="overflow-x-auto shadow-md rounded-lg">
        <table class="min-w-full bg-white">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th class="px-4 py-3 text-center text-sm font-semibold">Año</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Estudiantes</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Promedio</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Desv. Est.</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Mínimo</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Máximo</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Sin Outliers</th>
            </tr>
          </thead>
          <tbody>
            ${sortedAnalyses.map((analysis, index) => {
              const metrics = analysis.getGlobalMetrics(true, false); // excludePIAR = true, excludeOutliers = false
              const metricsNoOutliers = analysis.getGlobalMetrics(true, true); // excludePIAR = true, excludeOutliers = true
              
              const formatValue = (val) => typeof val === 'number' ? val.toFixed(2) : (val || 'N/A');
              
              return `
                <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition-colors">
                  <td class="px-4 py-3 text-center font-bold text-lg">${analysis.year}</td>
                  <td class="px-4 py-3 text-center">${analysis.metadata.studentsWithoutPIAR}</td>
                  <td class="px-4 py-3 text-center font-bold text-green-600 text-lg">${formatValue(metrics.promedio)}</td>
                  <td class="px-4 py-3 text-center">${formatValue(metrics.desviacion)}</td>
                  <td class="px-4 py-3 text-center">${formatValue(metrics.minimo)}</td>
                  <td class="px-4 py-3 text-center">${formatValue(metrics.maximo)}</td>
                  <td class="px-4 py-3 text-center text-blue-600 font-semibold">${formatValue(metricsNoOutliers.promedio)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Métricas Con PIAR -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-gray-600 mb-3 uppercase">Con PIAR (Todos los Estudiantes)</h3>
      <div class="overflow-x-auto shadow-md rounded-lg">
        <table class="min-w-full bg-white">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th class="px-4 py-3 text-center text-sm font-semibold">Año</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Estudiantes</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Promedio</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Desv. Est.</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Mínimo</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Máximo</th>
            </tr>
          </thead>
          <tbody>
            ${sortedAnalyses.map((analysis, index) => {
              const metricsPIAR = analysis.getGlobalMetrics(false, false); // excludePIAR = false (incluye todos), excludeOutliers = false
              
              const formatValue = (val) => typeof val === 'number' ? val.toFixed(2) : (val || 'N/A');
              
              return `
                <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors">
                  <td class="px-4 py-3 text-center font-bold text-lg">${analysis.year}</td>
                  <td class="px-4 py-3 text-center">${analysis.metadata.totalStudents}</td>
                  <td class="px-4 py-3 text-center font-bold">${formatValue(metricsPIAR.promedio)}</td>
                  <td class="px-4 py-3 text-center">${formatValue(metricsPIAR.desviacion)}</td>
                  <td class="px-4 py-3 text-center">${formatValue(metricsPIAR.minimo)}</td>
                  <td class="px-4 py-3 text-center">${formatValue(metricsPIAR.maximo)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

/**
 * Genera la sección de comparación por áreas académicas
 */
export const generateAreaComparisonSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6 mt-8">
      <h2 class="text-2xl font-bold">${sectionNumber}. COMPARACION POR AREAS ACADEMICAS</h2>
    </div>
    
    ${ACADEMIC_AREAS.map(area => `
      <div class="mb-8">
        <h3 class="text-lg font-bold mb-3 uppercase" style="color: ${area.color}">${area.name}</h3>
        <div class="overflow-x-auto shadow-md rounded-lg">
          <table class="min-w-full bg-white">
            <thead class="bg-blue-600 text-white">
              <tr>
                <th class="px-4 py-3 text-center text-sm font-semibold">Año</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Promedio Sin PIAR</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Desv. Est.</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Sin Outliers</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Promedio Con PIAR</th>
              </tr>
            </thead>
            <tbody>
              ${sortedAnalyses.map((analysis, index) => {
                // Usar la misma lógica que funciona en análisis de un solo año
                const chartData = prepareAreaChartData(analysis, true);
                
                // Buscar datos de esta área específica
                const areaData = chartData.promedios.find(item => item.areaId === area.id);
                const areaDesv = chartData.desviacion.find(item => item.areaId === area.id);
                
                if (!areaData || !areaDesv) {
                  return `
                    <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                      <td class="px-4 py-3 text-center font-bold text-lg">${analysis.year}</td>
                      <td class="px-4 py-3 text-center" colspan="4">N/A</td>
                    </tr>
                  `;
                }
                
                return `
                  <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors">
                    <td class="px-4 py-3 text-center font-bold text-lg">${analysis.year}</td>
                    <td class="px-4 py-3 text-center font-bold text-green-600 text-lg">${areaData.sinPIAR.toFixed(2)}</td>
                    <td class="px-4 py-3 text-center">${areaDesv.sinPIAR.toFixed(2)}</td>
                    <td class="px-4 py-3 text-center text-blue-600 font-semibold">${areaData.sinOutliers.toFixed(2)}</td>
                    <td class="px-4 py-3 text-center text-gray-600">${areaData.conPIAR.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('')}
  `;
};

/**
 * Genera tabla completa de estudiantes de todos los años con filtros
 */
export const generateAllStudentsTableSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Recopilar todos los estudiantes (INCLUYE PIAR)
  const allStudents = [];
  sortedAnalyses.forEach(analysis => {
    const students = analysis.processedData; // No filtrar PIAR
    students.forEach(student => {
      allStudents.push({
        year: analysis.year,
        nombre: student.Nombre,
        apellido: student.Apellido,
        grado: student.Grupo,
        global: student.Global,
        lectura: student['Lectura crítica'],
        matematicas: student.Matemáticas,
        sociales: student.Sociales,
        naturales: student.Naturales,
        ingles: student.Inglés,
        piar: student['¿PIAR?'] === 'Sí'
      });
    });
  });
  
  // Ordenar por año y luego por puntaje global
  allStudents.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return b.global - a.global;
  });
  
  // Obtener años únicos y grados únicos para filtros
  const years = [...new Set(allStudents.map(s => s.year))].sort();
  const grades = [...new Set(allStudents.map(s => s.grado))].sort();
  
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6 mt-8">
      <h2 class="text-2xl font-bold">${sectionNumber}. LISTADO COMPLETO DE ESTUDIANTES</h2>
    </div>
    
    <!-- Filtros -->
    <div class="mb-6 no-print grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Buscar estudiante</label>
        <input 
          type="text" 
          id="searchAllStudents" 
          placeholder="Nombre o apellido..." 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onkeyup="filterAllStudentsTable()"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por año</label>
        <select 
          id="yearFilter" 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onchange="filterAllStudentsTable()"
        >
          <option value="">Todos los años</option>
          ${years.map(year => `<option value="${year}">${year}</option>`).join('')}
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por grado</label>
        <select 
          id="gradeFilterAll" 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onchange="filterAllStudentsTable()"
        >
          <option value="">Todos los grados</option>
          ${grades.map(grade => `<option value="${grade}">${grade}</option>`).join('')}
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">PIAR</label>
        <select 
          id="piarFilterAll" 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onchange="filterAllStudentsTable()"
        >
          <option value="">Todos</option>
          <option value="no">Sin PIAR</option>
          <option value="si">Con PIAR</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Puntaje mínimo</label>
        <input 
          type="number" 
          id="minScoreFilterAll" 
          placeholder="Ej: 300" 
          class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onkeyup="filterAllStudentsTable()"
        >
      </div>
    </div>
    
    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table id="allStudentsTable" class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(0)">Año ⬍</th>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(1)">Nombre</th>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(2)">Apellido</th>
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(3)">Grado</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(4)">Global ⬍</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(5)">Lectura</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(6)">Matemát.</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(7)">Sociales</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(8)">Naturales</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(9)">Inglés</th>
          </tr>
        </thead>
        <tbody>
          ${allStudents.map((student) => {
            // Color por año: 2025 = azul, 2024 = gris, otros = verde
            const yearColor = student.year === 2025 ? 'bg-blue-50' : student.year === 2024 ? 'bg-gray-50' : 'bg-green-50';
            const yearBadge = student.year === 2025 ? 'bg-blue-600' : student.year === 2024 ? 'bg-gray-600' : 'bg-green-600';
            
            return `
            <tr class="border-b border-gray-200 hover:opacity-75 transition-opacity ${yearColor}" 
                data-year="${student.year}" 
                data-grade="${student.grado}" 
                data-global="${student.global}"
                data-piar="${student.piar ? 'si' : 'no'}">
              <td class="px-4 py-3 text-center">
                <span class="px-3 py-1 ${yearBadge} text-white rounded-full text-sm font-bold">${student.year}</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.nombre}</td>
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">${student.apellido}</td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">${student.grado}</span>
              </td>
              <td class="px-4 py-3 text-right font-bold text-lg ${student.global >= 300 ? 'text-green-600' : 'text-gray-700'}">
                ${student.global.toFixed(1)}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.lectura.toFixed(1)}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.matematicas.toFixed(1)}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.sociales.toFixed(1)}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.naturales.toFixed(1)}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.ingles.toFixed(1)}</td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    <p class="text-sm text-gray-600 mt-4">
      Mostrando <strong id="visibleCountAll">${allStudents.length}</strong> de <strong>${allStudents.length}</strong> estudiantes
    </p>
    
    <script>
      function filterAllStudentsTable() {
        const searchValue = document.getElementById('searchAllStudents').value.toLowerCase();
        const yearValue = document.getElementById('yearFilter').value;
        const gradeValue = document.getElementById('gradeFilterAll').value;
        const piarValue = document.getElementById('piarFilterAll').value;
        const minScore = parseFloat(document.getElementById('minScoreFilterAll').value) || 0;
        
        const table = document.getElementById('allStudentsTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let visibleCount = 0;
        
        for (let row of rows) {
          const nombre = row.cells[1].textContent.toLowerCase();
          const apellido = row.cells[2].textContent.toLowerCase();
          const year = row.getAttribute('data-year');
          const grade = row.getAttribute('data-grade');
          const piar = row.getAttribute('data-piar');
          const global = parseFloat(row.getAttribute('data-global'));
          
          const matchesSearch = nombre.includes(searchValue) || apellido.includes(searchValue);
          const matchesYear = !yearValue || year === yearValue;
          const matchesGrade = !gradeValue || grade === gradeValue;
          const matchesPiar = !piarValue || piar === piarValue;
          const matchesScore = global >= minScore;
          
          if (matchesSearch && matchesYear && matchesGrade && matchesPiar && matchesScore) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        }
        
        document.getElementById('visibleCountAll').textContent = visibleCount;
      }
      
      let sortDirectionAll = {};
      function sortAllStudentsTable(columnIndex) {
        const table = document.getElementById('allStudentsTable');
        const tbody = table.getElementsByTagName('tbody')[0];
        const rows = Array.from(tbody.getElementsByTagName('tr'));
        
        sortDirectionAll[columnIndex] = !sortDirectionAll[columnIndex];
        const direction = sortDirectionAll[columnIndex] ? 1 : -1;
        
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
