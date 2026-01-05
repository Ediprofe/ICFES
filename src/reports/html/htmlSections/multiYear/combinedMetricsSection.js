/**
 * Sección: Tabla de métricas combinadas con selector de años
 * @module multiYear/combinedMetricsSection
 */

import {
    sortAnalysesByYear,
    extractYears,
    prepareGlobalMetricsData,
    generateYearSelector,
    generateSelectAllButtons,
    generateSectionHeader
} from './utils.js';

/**
 * Genera la sección de tabla de métricas combinadas con selector de años
 * @param {Array} analyses - Array de objetos Analysis
 * @param {number} sectionNumber - Número de sección en el informe
 * @returns {string} HTML de la sección
 */
export const generateCombinedMetricsSection = (analyses, sectionNumber) => {
    const sortedAnalyses = sortAnalysesByYear(analyses);
    const years = extractYears(sortedAnalyses);
    const metricsData = prepareGlobalMetricsData(sortedAnalyses);

    return `
    ${generateSectionHeader(sectionNumber, 'Tabla de métricas combinadas', 'Selecciona los años que deseas combinar')}
    
    <!-- Selector de años -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4">📅 Seleccionar años a promediar</h3>
      <div class="flex flex-wrap gap-3 mb-4">
        ${generateYearSelector(years, 'year-selector', 'updateCombinedMetricsTable')}
      </div>
      ${generateSelectAllButtons('selectAllYears', 'purple')}
    </div>
    
    <!-- Tabla de métricas globales (solo sin PIAR) -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h3 class="text-xl font-bold text-white">📊 Métricas globales (sin PIAR)</h3>
        <p class="text-blue-100 text-sm mt-1">Promedio y desviación estándar de los años seleccionados</p>
      </div>
      <div class="overflow-x-auto">
        <table id="combinedGlobalTable" class="min-w-full">
          <thead class="bg-gradient-to-r from-gray-700 to-gray-800">
            <tr>
              <th class="px-8 py-4 text-left text-sm font-bold text-white uppercase">Cohorte</th>
              <th class="px-8 py-4 text-center text-sm font-bold text-white uppercase">Promedio global</th>
              <th class="px-8 py-4 text-center text-sm font-bold text-white uppercase">Desviación estándar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Se llenará dinámicamente -->
          </tbody>
        </table>
      </div>
    </div>
    
    <script>
      // Datos de métricas (solo global sin PIAR)
      const metricsData = ${JSON.stringify(metricsData)};
      
      function selectAllYears(select) {
        document.querySelectorAll('.year-selector').forEach(checkbox => {
          checkbox.checked = select;
        });
        updateCombinedMetricsTable();
      }
      
      function updateCombinedMetricsTable() {
        const selectedYears = Array.from(document.querySelectorAll('.year-selector:checked'))
          .map(cb => parseInt(cb.value));
        
        const filteredData = metricsData.filter(data => selectedYears.includes(data.year));
        
        // Calcular promedio combinado (promedio de promedios)
        const promedioCombinado = filteredData.length > 0
          ? filteredData.reduce((sum, data) => sum + data.promedio, 0) / filteredData.length
          : 0;
        
        // Calcular desviación estándar combinada (promedio de desviaciones)
        const desviacionCombinada = filteredData.length > 0
          ? filteredData.reduce((sum, data) => sum + data.desviacion, 0) / filteredData.length
          : 0;
        
        // Actualizar tabla global
        const globalTableBody = document.querySelector('#combinedGlobalTable tbody');
        
        // Filas de años individuales
        const rowsHTML = filteredData.map((data, index) => {
          const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
          return \`
            <tr class="\${rowBg} hover:bg-blue-50 transition-colors">
              <td class="px-8 py-5 text-base font-bold text-gray-900">\${data.year}</td>
              <td class="px-8 py-5 text-center text-lg font-bold text-blue-600">\${data.promedio.toFixed(2)}</td>
              <td class="px-8 py-5 text-center text-base font-semibold text-gray-700">\${data.desviacion.toFixed(2)}</td>
            </tr>
          \`;
        }).join('');
        
        // Fila de promedio combinado
        const combinedRowHTML = filteredData.length > 0 ? \`
          <tr class="bg-gradient-to-r from-purple-100 to-pink-100 border-t-4 border-purple-500">
            <td class="px-8 py-5 text-base font-extrabold text-purple-900 uppercase">
              📊 Combinado
            </td>
            <td class="px-8 py-5 text-center text-xl font-extrabold text-purple-700">
              \${promedioCombinado.toFixed(2)}
            </td>
            <td class="px-8 py-5 text-center text-lg font-extrabold text-purple-700">
              \${desviacionCombinada.toFixed(2)}
            </td>
          </tr>
        \` : '';
        
        globalTableBody.innerHTML = rowsHTML + combinedRowHTML;
      }
      
      // Inicializar tabla al cargar
      window.addEventListener('DOMContentLoaded', () => {
        updateCombinedMetricsTable();
      });
    </script>
  `;
};
