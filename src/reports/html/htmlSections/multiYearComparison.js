/**
 * ✅ Sección HTML: Comparación Multi-Año
 * Compara métricas entre diferentes años
 */

import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';
import { prepareAreaChartData } from '../../charts/chartDataPreparation.js';

/**
 * Genera la sección de tabla de métricas combinadas con selector de años
 */
export const generateCombinedMetricsSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  const years = sortedAnalyses.map(a => a.year);
  
  // Preparar datos de métricas para cada año (solo global sin PIAR)
  const metricsData = sortedAnalyses.map(analysis => {
    const globalSinPIAR = analysis.getGlobalMetrics(true, false);
    
    return {
      year: analysis.year,
      promedio: globalSinPIAR.promedio,
      desviacion: globalSinPIAR.desviacion
    };
  });
  
  return `
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-4 mb-6">
      <h2 class="text-2xl font-bold">${sectionNumber}. Tabla de métricas combinadas</h2>
      <p class="text-purple-100 text-sm mt-1">Selecciona los años que deseas combinar</p>
    </div>
    
    <!-- Selector de años -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4">📅 Seleccionar años a promediar</h3>
      <div class="flex flex-wrap gap-3 mb-4">
        ${years.map(year => `
          <label class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors border-2 border-transparent hover:border-purple-500">
            <input 
              type="checkbox" 
              class="year-selector w-5 h-5 text-purple-600 rounded focus:ring-purple-500" 
              value="${year}"
              checked
              onchange="updateCombinedMetricsTable()"
            >
            <span class="font-semibold text-gray-800">${year}</span>
          </label>
        `).join('')}
      </div>
      <button 
        onclick="selectAllYears(true)" 
        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm mr-2"
      >
        ✓ Seleccionar todos
      </button>
      <button 
        onclick="selectAllYears(false)" 
        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
      >
        ✗ Deseleccionar todos
      </button>
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

/**
 * Genera la sección de curvas de Gauss superpuestas
 */
export const generateGaussianCurvesSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  const years = sortedAnalyses.map(a => a.year);
  
  // Preparar datos de métricas para cada año (global)
  const gaussianData = sortedAnalyses.map(analysis => {
    const globalSinPIAR = analysis.getGlobalMetrics(true, false);
    
    return {
      year: analysis.year,
      promedio: globalSinPIAR.promedio,
      desviacion: globalSinPIAR.desviacion,
      data: analysis.processedData // Incluir datos de estudiantes para cálculo de outliers
    };
  });
  
  // Preparar datos por área para cada año
  const areasComparisonData = ACADEMIC_AREAS.map(area => {
    return {
      areaId: area.id,
      areaName: area.name,
      color: area.color,
      data: sortedAnalyses.map(analysis => {
        const chartData = prepareAreaChartData(analysis, true);
        const areaData = chartData.promedios.find(item => item.areaId === area.id);
        const areaDesv = chartData.desviacion.find(item => item.areaId === area.id);
        return {
          year: analysis.year,
          sinPIAR: areaData ? areaData.sinPIAR : null,
          conPIAR: areaData ? areaData.conPIAR : null,
          sinOutliers: areaData ? areaData.sinOutliers : null,
          desvSinPIAR: areaDesv ? areaDesv.sinPIAR : null,
          desvConPIAR: areaDesv ? areaDesv.conPIAR : null,
          desvSinOutliers: areaDesv ? areaDesv.sinOutliers : null
        };
      })
    };
  });
  
  // Colores para cada año
  const yearColors = [
    { border: 'rgba(59, 130, 246, 1)', background: 'rgba(59, 130, 246, 0.1)' },   // Azul
    { border: 'rgba(16, 185, 129, 1)', background: 'rgba(16, 185, 129, 0.1)' },   // Verde
    { border: 'rgba(239, 68, 68, 1)', background: 'rgba(239, 68, 68, 0.1)' },     // Rojo
    { border: 'rgba(245, 158, 11, 1)', background: 'rgba(245, 158, 11, 0.1)' },   // Naranja
    { border: 'rgba(139, 92, 246, 1)', background: 'rgba(139, 92, 246, 0.1)' },   // Púrpura
    { border: 'rgba(236, 72, 153, 1)', background: 'rgba(236, 72, 153, 0.1)' },   // Rosa
  ];
  
  return `
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg p-4 mb-6">
      <h2 class="text-2xl font-bold">${sectionNumber}. Curvas de distribución normal (Campana de Gauss)</h2>
      <p class="text-indigo-100 text-sm mt-1">Visualiza la distribución de promedios globales sin PIAR por año</p>
    </div>
    
    <!-- Selector de años para curvas -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Seleccionar años para visualizar</h3>
      <div class="flex flex-wrap gap-3 mb-4">
        ${years.map((year, index) => {
          const color = yearColors[index % yearColors.length];
          return `
            <label class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors border-2 border-transparent hover:border-indigo-500">
              <input 
                type="checkbox" 
                class="gaussian-year-selector w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
                value="${year}"
                data-color-border="${color.border}"
                data-color-bg="${color.background}"
                checked
                onchange="updateGaussianChart()"
              >
              <span class="font-semibold text-gray-800">${year}</span>
              <span class="w-6 h-6 rounded-full" style="background-color: ${color.border}"></span>
            </label>
          `;
        }).join('')}
      </div>
      <button 
        onclick="selectAllGaussianYears(true)" 
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm mr-2"
      >
        ✓ Seleccionar todos
      </button>
      <button 
        onclick="selectAllGaussianYears(false)" 
        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
      >
        ✗ Deseleccionar todos
      </button>
    </div>
    
    <!-- Gráfico de curvas de Gauss -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div style="height: 500px; position: relative;">
        <canvas id="gaussianCurvesChart"></canvas>
      </div>
      
      <!-- Leyenda de zonas de percentiles -->
      <div class="mt-4 grid grid-cols-4 gap-3">
        <div class="flex items-center gap-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
          <div class="w-4 h-4 bg-red-500 rounded"></div>
          <div>
            <p class="text-xs font-bold text-red-800">Zona Roja</p>
            <p class="text-xs text-red-600">0-25% (Necesita apoyo)</p>
          </div>
        </div>
        <div class="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
          <div class="w-4 h-4 bg-yellow-500 rounded"></div>
          <div>
            <p class="text-xs font-bold text-yellow-800">Zona Amarilla</p>
            <p class="text-xs text-yellow-600">25-50% (En desarrollo)</p>
          </div>
        </div>
        <div class="flex items-center gap-2 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
          <div class="w-4 h-4 bg-green-500 rounded"></div>
          <div>
            <p class="text-xs font-bold text-green-800">Zona Verde</p>
            <p class="text-xs text-green-600">50-75% (Satisfactorio)</p>
          </div>
        </div>
        <div class="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div class="w-4 h-4 bg-blue-500 rounded"></div>
          <div>
            <p class="text-xs font-bold text-blue-800">Zona Azul</p>
            <p class="text-xs text-blue-600">75-100% (Sobresaliente)</p>
          </div>
        </div>
      </div>
      
      <!-- Insights automáticos -->
      <div id="gaussianInsights" class="mt-6">
        <!-- Se llenará dinámicamente con JavaScript -->
      </div>
    </div>
    
    <!-- Comparación de Grupos de Cohortes -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6 mt-6">
      <div class="border-b-2 border-purple-500 pb-3 mb-6">
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span class="text-2xl">📊</span>
          <span>Comparación de Grupos de Cohortes</span>
        </h3>
        <p class="text-sm text-gray-600 mt-1">Selecciona dos grupos de años para comparar sus estadísticas</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Grupo A -->
        <div class="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
          <h4 class="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">A</span>
            <span>Grupo A</span>
          </h4>
          <div class="space-y-2">
            ${years.map(year => `
              <label class="flex items-center gap-2 px-3 py-2 bg-white hover:bg-blue-100 rounded-lg cursor-pointer transition-colors border border-blue-200">
                <input 
                  type="checkbox" 
                  class="cohort-group-a w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                  value="${year}"
                  onchange="updateCohortComparison()"
                >
                <span class="font-semibold text-gray-800">${year}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Grupo B -->
        <div class="border-2 border-green-300 rounded-lg p-4 bg-green-50">
          <h4 class="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
            <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">B</span>
            <span>Grupo B</span>
          </h4>
          <div class="space-y-2">
            ${years.map(year => `
              <label class="flex items-center gap-2 px-3 py-2 bg-white hover:bg-green-100 rounded-lg cursor-pointer transition-colors border border-green-200">
                <input 
                  type="checkbox" 
                  class="cohort-group-b w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                  value="${year}"
                  onchange="updateCohortComparison()"
                >
                <span class="font-semibold text-gray-800">${year}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
      
      <!-- Resultados de la comparación -->
      <div id="cohortComparisonResults" class="mt-6">
        <div class="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <p class="text-gray-600">
            <span class="text-3xl mb-2 block">🎯</span>
            Selecciona años en ambos grupos para ver la comparación
          </p>
        </div>
      </div>
    </div>
    
    <script>
      // Datos para curvas de Gauss
      const gaussianData = ${JSON.stringify(gaussianData)};
      const areasComparisonData = ${JSON.stringify(areasComparisonData)};
      const yearColors = ${JSON.stringify(yearColors)};
      
      // Función para calcular la distribución normal (campana de Gauss)
      function normalDistribution(x, mean, stdDev) {
        const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
        const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
        return coefficient * Math.exp(exponent);
      }
      
      // Generar puntos para la curva de Gauss
      function generateGaussianCurve(mean, stdDev, numPoints = 200) {
        const points = [];
        const range = 4 * stdDev; // 4 desviaciones estándar a cada lado
        const start = mean - range;
        const end = mean + range;
        const step = (end - start) / numPoints;
        
        for (let x = start; x <= end; x += step) {
          points.push({
            x: x,
            y: normalDistribution(x, mean, stdDev)
          });
        }
        
        return points;
      }
      
      // Calcular percentiles basados en distribución normal
      function calculatePercentile(value, mean, stdDev) {
        const z = (value - mean) / stdDev;
        // Aproximación de la función de distribución acumulativa (CDF)
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp(-z * z / 2);
        const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return z > 0 ? (1 - probability) * 100 : probability * 100;
      }
      
      // Calcular zona de rendimiento
      function getPerformanceZone(percentile) {
        if (percentile < 25) return { name: 'Roja', color: '#ef4444', label: 'Necesita apoyo' };
        if (percentile < 50) return { name: 'Amarilla', color: '#f59e0b', label: 'En desarrollo' };
        if (percentile < 75) return { name: 'Verde', color: '#10b981', label: 'Satisfactorio' };
        return { name: 'Azul', color: '#3b82f6', label: 'Sobresaliente' };
      }
      
      // Generar insights automáticos
      function generateInsights(selectedData) {
        if (selectedData.length < 2) {
          return '<div class="p-4 bg-gray-50 rounded-lg"><p class="text-sm text-gray-600">Selecciona al menos 2 años para ver insights comparativos.</p></div>';
        }
        
        // Ordenar por año
        const sortedData = [...selectedData].sort((a, b) => a.year - b.year);
        const oldest = sortedData[0];
        const newest = sortedData[sortedData.length - 1];
        
        // Calcular cambios
        const promedioChange = newest.promedio - oldest.promedio;
        const desviacionChange = newest.desviacion - oldest.desviacion;
        const desviacionChangePercent = ((desviacionChange / oldest.desviacion) * 100).toFixed(1);
        
        // Determinar tendencias
        const promedioTrend = promedioChange > 0 ? 'mejoró' : 'disminuyó';
        const promedioIcon = promedioChange > 0 ? '📈' : '📉';
        const consistenciaTrend = desviacionChange < 0 ? 'más homogéneo' : 'más disperso';
        const consistenciaIcon = desviacionChange < 0 ? '✅' : '⚠️';
        
        // Calcular percentiles de los promedios
        const oldestPercentile = calculatePercentile(oldest.promedio, oldest.promedio, oldest.desviacion);
        const newestPercentile = calculatePercentile(newest.promedio, newest.promedio, newest.desviacion);
        
        let html = \`
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
            <h4 class="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <span class="text-2xl">💡</span>
              <span>INSIGHTS CLAVE: \${oldest.year} → \${newest.year}</span>
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Cambio en promedio -->
              <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 \${promedioChange > 0 ? 'border-green-500' : 'border-red-500'}">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">\${promedioIcon}</span>
                  <p class="text-sm font-bold text-gray-700">Cambio en Promedio</p>
                </div>
                <p class="text-3xl font-extrabold \${promedioChange > 0 ? 'text-green-600' : 'text-red-600'}">
                  \${promedioChange > 0 ? '+' : ''}\${promedioChange.toFixed(2)}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  El promedio \${promedioTrend} \${Math.abs(promedioChange).toFixed(2)} puntos
                </p>
              </div>
              
              <!-- Cambio en consistencia -->
              <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 \${desviacionChange < 0 ? 'border-green-500' : 'border-orange-500'}">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">\${consistenciaIcon}</span>
                  <p class="text-sm font-bold text-gray-700">Consistencia</p>
                </div>
                <p class="text-3xl font-extrabold \${desviacionChange < 0 ? 'text-green-600' : 'text-orange-600'}">
                  \${desviacionChange > 0 ? '+' : ''}\${desviacionChangePercent}%
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  El grupo es \${consistenciaTrend}
                </p>
              </div>
              
              <!-- Desplazamiento de curva -->
              <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">🎯</span>
                  <p class="text-sm font-bold text-gray-700">Desplazamiento</p>
                </div>
                <p class="text-3xl font-extrabold text-purple-600">
                  \${promedioChange > 0 ? '→' : '←'} \${Math.abs(promedioChange).toFixed(1)} pts
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  La curva se movió a la \${promedioChange > 0 ? 'derecha' : 'izquierda'}
                </p>
              </div>
            </div>
            
            <!-- Análisis detallado -->
            <div class="mt-4 p-4 bg-white rounded-lg">
              <p class="text-sm text-gray-800 leading-relaxed">
                <strong class="text-purple-900">📊 Análisis:</strong>
                Entre \${oldest.year} y \${newest.year}, el promedio global 
                <strong class="\${promedioChange > 0 ? 'text-green-600' : 'text-red-600'}">\${promedioTrend} \${Math.abs(promedioChange).toFixed(2)} puntos</strong>
                (de \${oldest.promedio.toFixed(2)} a \${newest.promedio.toFixed(2)}). 
                La desviación estándar 
                <strong class="\${desviacionChange < 0 ? 'text-green-600' : 'text-orange-600'}">\${desviacionChange < 0 ? 'disminuyó' : 'aumentó'} \${Math.abs(desviacionChangePercent)}%</strong>
                (de \${oldest.desviacion.toFixed(2)} a \${newest.desviacion.toFixed(2)}), 
                lo que indica que el grupo es ahora <strong>\${consistenciaTrend}</strong>.
                \${promedioChange > 0 && desviacionChange < 0 ? 
                  ' <span class="text-green-600 font-bold">¡Excelente! Mejoraron el promedio Y la consistencia.</span>' : 
                  promedioChange > 0 ? 
                    ' <span class="text-blue-600 font-bold">Hay mejora en el promedio, pero la dispersión aumentó.</span>' :
                    ' <span class="text-orange-600 font-bold">Se requiere atención para mejorar el rendimiento general.</span>'
                }
              </p>
            </div>
          </div>
        \`;
        
        return html;
      }
      
      let gaussianChart = null;
      
      function selectAllGaussianYears(select) {
        document.querySelectorAll('.gaussian-year-selector').forEach(checkbox => {
          checkbox.checked = select;
        });
        updateGaussianChart();
      }
      
      function updateGaussianChart() {
        const selectedCheckboxes = Array.from(document.querySelectorAll('.gaussian-year-selector:checked'));
        
        // Obtener datos seleccionados
        const selectedData = selectedCheckboxes.map(checkbox => {
          const year = parseInt(checkbox.value);
          return gaussianData.find(d => d.year === year);
        }).filter(d => d !== null);
        
        // Generar insights
        document.getElementById('gaussianInsights').innerHTML = generateInsights(selectedData);
        
        // Preparar datasets para el gráfico
        const datasets = selectedCheckboxes.map((checkbox, index) => {
          const year = parseInt(checkbox.value);
          const yearData = gaussianData.find(d => d.year === year);
          const colorBorder = checkbox.dataset.colorBorder;
          const colorBg = checkbox.dataset.colorBg;
          
          if (!yearData) return null;
          
          const curvePoints = generateGaussianCurve(yearData.promedio, yearData.desviacion);
          
          return {
            label: \`\${year} (μ=\${yearData.promedio.toFixed(2)}, σ=\${yearData.desviacion.toFixed(2)})\`,
            data: curvePoints,
            borderColor: colorBorder,
            backgroundColor: colorBg,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5
          };
        }).filter(d => d !== null);
        
        if (gaussianChart) {
          gaussianChart.destroy();
        }
        
        const ctx = document.getElementById('gaussianCurvesChart').getContext('2d');
        
        // Plugin para dibujar zonas de fondo (percentiles)
        const backgroundZonesPlugin = {
          id: 'backgroundZones',
          beforeDraw: (chart) => {
            if (selectedData.length === 0) return;
            
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            const xScale = chart.scales.x;
            const yScale = chart.scales.y;
            
            // Usar el primer año seleccionado como referencia para las zonas
            const referenceData = selectedData[0];
            const mean = referenceData.promedio;
            const stdDev = referenceData.desviacion;
            
            // Calcular límites de percentiles (usando z-scores)
            const p25 = mean - 0.674 * stdDev;  // Percentil 25
            const p50 = mean;                    // Percentil 50 (mediana)
            const p75 = mean + 0.674 * stdDev;  // Percentil 75
            
            // Dibujar zonas
            const zones = [
              { start: xScale.min, end: p25, color: 'rgba(239, 68, 68, 0.08)' },    // Roja
              { start: p25, end: p50, color: 'rgba(245, 158, 11, 0.08)' },          // Amarilla
              { start: p50, end: p75, color: 'rgba(16, 185, 129, 0.08)' },          // Verde
              { start: p75, end: xScale.max, color: 'rgba(59, 130, 246, 0.08)' }    // Azul
            ];
            
            zones.forEach(zone => {
              const xStart = xScale.getPixelForValue(zone.start);
              const xEnd = xScale.getPixelForValue(zone.end);
              
              ctx.fillStyle = zone.color;
              ctx.fillRect(
                xStart,
                chartArea.top,
                xEnd - xStart,
                chartArea.bottom - chartArea.top
              );
            });
            
            // Dibujar líneas de percentiles
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            
            [p25, p50, p75].forEach(percentile => {
              const x = xScale.getPixelForValue(percentile);
              ctx.beginPath();
              ctx.moveTo(x, chartArea.top);
              ctx.lineTo(x, chartArea.bottom);
              ctx.stroke();
            });
            
            ctx.setLineDash([]);
          }
        };
        
        gaussianChart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Distribución Normal de Promedios Globales (sin PIAR)',
                font: {
                  size: 18,
                  weight: 'bold'
                }
              },
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  usePointStyle: true,
                  padding: 15
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return \`\${context.dataset.label}: Densidad = \${context.parsed.y.toFixed(4)}\`;
                  }
                }
              }
            },
            scales: {
              x: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Promedio Global',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Densidad de Probabilidad',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            }
          },
          plugins: [backgroundZonesPlugin]
        });
      }
      
      // Inicializar gráfico al cargar
      window.addEventListener('DOMContentLoaded', () => {
        updateGaussianChart();
      });
      
      // Función para actualizar la comparación de grupos de cohortes
      function updateCohortComparison() {
        const groupACheckboxes = Array.from(document.querySelectorAll('.cohort-group-a:checked'));
        const groupBCheckboxes = Array.from(document.querySelectorAll('.cohort-group-b:checked'));
        
        const groupAYears = groupACheckboxes.map(cb => parseInt(cb.value));
        const groupBYears = groupBCheckboxes.map(cb => parseInt(cb.value));
        
        const resultsDiv = document.getElementById('cohortComparisonResults');
        
        // Validar que ambos grupos tengan al menos un año seleccionado
        if (groupAYears.length === 0 || groupBYears.length === 0) {
          resultsDiv.innerHTML = \`
            <div class="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <p class="text-gray-600">
                <span class="text-3xl mb-2 block">🎯</span>
                Selecciona años en ambos grupos para ver la comparación
              </p>
            </div>
          \`;
          return;
        }
        
        // Obtener datos de cada grupo
        const groupAData = groupAYears.map(year => 
          gaussianData.find(d => d.year === year)
        ).filter(d => d !== undefined);
        
        const groupBData = groupBYears.map(year => 
          gaussianData.find(d => d.year === year)
        ).filter(d => d !== undefined);
        
        // Calcular estadísticas del Grupo A
        const groupAPromedio = groupAData.reduce((sum, d) => sum + d.promedio, 0) / groupAData.length;
        const groupADesviacion = groupAData.reduce((sum, d) => sum + d.desviacion, 0) / groupAData.length;
        
        // Calcular estadísticas del Grupo B
        const groupBPromedio = groupBData.reduce((sum, d) => sum + d.promedio, 0) / groupBData.length;
        const groupBDesviacion = groupBData.reduce((sum, d) => sum + d.desviacion, 0) / groupBData.length;
        
        // Calcular diferencias
        const difPromedio = groupBPromedio - groupAPromedio;
        const difDesviacion = groupBDesviacion - groupADesviacion;
        const difPromedioPercent = ((difPromedio / groupAPromedio) * 100);
        const difDesviacionPercent = ((difDesviacion / groupADesviacion) * 100);
        
        // Determinar tendencias
        const promedioTrend = difPromedio > 0 ? 'superior' : difPromedio < 0 ? 'inferior' : 'igual';
        const promedioIcon = difPromedio > 0 ? '📈' : difPromedio < 0 ? '📉' : '➡️';
        const promedioColor = difPromedio > 0 ? 'text-green-600' : difPromedio < 0 ? 'text-red-600' : 'text-gray-600';
        
        const consistenciaTrend = difDesviacion < 0 ? 'más homogéneo' : difDesviacion > 0 ? 'más disperso' : 'similar';
        const consistenciaIcon = difDesviacion < 0 ? '✅' : difDesviacion > 0 ? '⚠️' : '➡️';
        const consistenciaColor = difDesviacion < 0 ? 'text-green-600' : difDesviacion > 0 ? 'text-orange-600' : 'text-gray-600';
        
        // Generar HTML de resultados
        resultsDiv.innerHTML = \`
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
            <h4 class="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <span class="text-2xl">📊</span>
              <span>RESULTADOS DE LA COMPARACIÓN</span>
            </h4>
            
            <!-- Resumen de grupos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <div class="flex items-center gap-2 mb-2">
                  <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">A</span>
                  <p class="text-sm font-bold text-gray-700">Grupo A</p>
                </div>
                <p class="text-xs text-gray-600 mb-2">Cohortes: \${groupAYears.join(', ')}</p>
                <div class="space-y-1">
                  <p class="text-sm"><span class="font-semibold">Promedio:</span> <span class="text-blue-600 font-bold text-lg">\${groupAPromedio.toFixed(2)}</span></p>
                  <p class="text-sm"><span class="font-semibold">Desv. Est.:</span> <span class="text-gray-700 font-bold">\${groupADesviacion.toFixed(2)}</span></p>
                </div>
              </div>
              
              <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <div class="flex items-center gap-2 mb-2">
                  <span class="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">B</span>
                  <p class="text-sm font-bold text-gray-700">Grupo B</p>
                </div>
                <p class="text-xs text-gray-600 mb-2">Cohortes: \${groupBYears.join(', ')}</p>
                <div class="space-y-1">
                  <p class="text-sm"><span class="font-semibold">Promedio:</span> <span class="text-green-600 font-bold text-lg">\${groupBPromedio.toFixed(2)}</span></p>
                  <p class="text-sm"><span class="font-semibold">Desv. Est.:</span> <span class="text-gray-700 font-bold">\${groupBDesviacion.toFixed(2)}</span></p>
                </div>
              </div>
            </div>
            
            <!-- Gráficos de comparación -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- Gráfico de Promedios -->
              <div class="bg-white rounded-lg p-4 shadow-sm">
                <h5 class="text-sm font-bold text-gray-800 mb-3 text-center">Comparación de Promedios</h5>
                <div style="height: 250px; position: relative;">
                  <canvas id="cohortComparisonPromedioChart"></canvas>
                </div>
              </div>
              
              <!-- Gráfico de Desviaciones -->
              <div class="bg-white rounded-lg p-4 shadow-sm">
                <h5 class="text-sm font-bold text-gray-800 mb-3 text-center">Comparación de Desviaciones Estándar</h5>
                <div style="height: 250px; position: relative;">
                  <canvas id="cohortComparisonDesviacionChart"></canvas>
                </div>
              </div>
            </div>
            
            <!-- Diferencias -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 \${difPromedio >= 0 ? 'border-green-500' : 'border-red-500'}">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">\${promedioIcon}</span>
                  <p class="text-sm font-bold text-gray-700">Diferencia en Promedio</p>
                </div>
                <p class="text-3xl font-extrabold \${promedioColor}">
                  \${difPromedio > 0 ? '+' : ''}\${difPromedio.toFixed(2)}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  \${Math.abs(difPromedioPercent).toFixed(2)}% \${difPromedio >= 0 ? 'mayor' : 'menor'}
                </p>
              </div>
              
              <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 \${difDesviacion <= 0 ? 'border-green-500' : 'border-orange-500'}">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">\${consistenciaIcon}</span>
                  <p class="text-sm font-bold text-gray-700">Diferencia en Desv. Est.</p>
                </div>
                <p class="text-3xl font-extrabold \${consistenciaColor}">
                  \${difDesviacion > 0 ? '+' : ''}\${difDesviacion.toFixed(2)}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  \${Math.abs(difDesviacionPercent).toFixed(2)}% \${difDesviacion >= 0 ? 'mayor' : 'menor'}
                </p>
              </div>
            </div>
            
            <!-- Análisis interpretativo -->
            <div class="mt-4 p-4 bg-white rounded-lg border border-purple-200">
              <p class="text-sm text-gray-800 leading-relaxed">
                <strong class="text-purple-900">📝 Interpretación:</strong>
                El <strong>Grupo B</strong> tiene un promedio global 
                <strong class="\${promedioColor}">\${promedioTrend}</strong> 
                al <strong>Grupo A</strong> por <strong>\${Math.abs(difPromedio).toFixed(2)} puntos</strong> 
                (\${Math.abs(difPromedioPercent).toFixed(2)}%).
                En cuanto a la consistencia, el Grupo B es 
                <strong class="\${consistenciaColor}">\${consistenciaTrend}</strong>
                (diferencia de \${Math.abs(difDesviacion).toFixed(2)} en desviación estándar).
                \${difPromedio > 0 && difDesviacion < 0 ? 
                  '<span class="text-green-600 font-bold"> ✨ El Grupo B muestra mejor rendimiento Y mayor homogeneidad.</span>' : 
                  difPromedio > 0 ? 
                    '<span class="text-blue-600 font-bold"> ⚡ El Grupo B tiene mejor promedio, pero mayor dispersión.</span>' :
                    difPromedio < 0 && difDesviacion < 0 ?
                      '<span class="text-orange-600 font-bold"> ⚖️ El Grupo B tiene menor promedio pero es más homogéneo.</span>' :
                      '<span class="text-red-600 font-bold"> ⚠️ El Grupo A muestra mejores resultados en ambas métricas.</span>'
                }
              </p>
            </div>
          </div>
          
          <!-- Tabla de Estudiantes Fuera del Lote por Cohorte y Área -->
          <div class="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 overflow-hidden">
            <div class="px-6 py-4 bg-blue-100 border-b-2 border-blue-200">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📊</span>
                <h4 class="text-lg font-bold text-blue-900">Estudiantes fuera del lote por cohorte y área</h4>
              </div>
            </div>
            <div id="atypicalContent" class="px-6 pb-6">
              <p class="text-sm text-gray-700 mb-4">
                Estudiantes que se encuentran a más de 2 desviaciones estándar (±2σ) del promedio. 
                Estos estudiantes están <strong>fuera del comportamiento típico del lote</strong> (incluyendo PIAR) de las cohortes seleccionadas.
                <strong>Nota:</strong> Un estudiante puede estar fuera del lote en el promedio global pero no en áreas específicas, y viceversa.
              </p>
              <div id="atypicalTableContainer" class="overflow-x-auto">
                <!-- Se llenará dinámicamente -->
              </div>
            </div>
          </div>
          
          <!-- Comparación por Áreas Académicas -->
          <div class="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
            <h4 class="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <span class="text-2xl">📚</span>
              <span>COMPARACIÓN POR ÁREAS ACADÉMICAS</span>
            </h4>
            
            <!-- Controles interactivos -->
            <div class="mb-4 bg-white rounded-lg p-4 border border-indigo-200">
              <div class="flex items-center gap-4 mb-2">
                <span class="text-sm font-bold text-gray-700">Modo de visualización:</span>
                <div class="flex gap-2">
                  <button 
                    onclick="setAreaComparisonMode('sinPIAR')" 
                    id="btnAreaSinPIAR"
                    class="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Sin PIAR
                  </button>
                  <button 
                    onclick="setAreaComparisonMode('conPIAR')" 
                    id="btnAreaConPIAR"
                    class="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Con PIAR
                  </button>
                  <button 
                    onclick="setAreaComparisonMode('sinOutliers')" 
                    id="btnAreaSinOutliers"
                    class="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Rendimiento típico (lote)
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-600 italic">
                <span id="areaComparisonModeLabel">Mostrando datos sin PIAR (métricas principales)</span>
              </p>
            </div>
            
            <!-- Gráficos por área -->
            <div id="areaComparisonCharts" class="grid grid-cols-1 gap-6">
              <!-- Se llenarán dinámicamente -->
            </div>
          </div>
        \`;
        
        // Crear gráficos de comparación
        createComparisonCharts(groupAPromedio, groupBPromedio, groupADesviacion, groupBDesviacion, groupAYears, groupBYears);
        
        // Crear tabla de estudiantes fuera del lote
        updateAtypicalTable(groupAYears, groupBYears);
        
        // Crear gráficos de comparación por áreas
        updateAreaComparisonCharts(groupAYears, groupBYears);
      }
      
      // Función para crear los gráficos de comparación
      let promedioComparisonChart = null;
      let desviacionComparisonChart = null;
      
      function createComparisonCharts(groupAPromedio, groupBPromedio, groupADesviacion, groupBDesviacion, groupAYears, groupBYears) {
        // Destruir gráficos anteriores si existen
        if (promedioComparisonChart) {
          promedioComparisonChart.destroy();
        }
        if (desviacionComparisonChart) {
          desviacionComparisonChart.destroy();
        }
        
        // Gráfico de Promedios
        const ctxPromedio = document.getElementById('cohortComparisonPromedioChart');
        if (ctxPromedio) {
          promedioComparisonChart = new Chart(ctxPromedio, {
            type: 'bar',
            data: {
              labels: ['Grupo A', 'Grupo B'],
              datasets: [{
                label: 'Promedio Global',
                data: [groupAPromedio, groupBPromedio],
                backgroundColor: [
                  'rgba(37, 99, 235, 0.8)',  // Azul para Grupo A
                  'rgba(34, 197, 94, 0.8)'   // Verde para Grupo B
                ],
                borderColor: [
                  'rgba(37, 99, 235, 1)',
                  'rgba(34, 197, 94, 1)'
                ],
                borderWidth: 2
              }]
            },
            plugins: [ChartDataLabels],
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: false
                },
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  formatter: (value) => value.toFixed(2),
                  font: {
                    weight: 'bold',
                    size: 14
                  },
                  color: '#1f2937'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label;
                      const value = context.parsed.y;
                      const years = label === 'Grupo A' ? groupAYears.join(', ') : groupBYears.join(', ');
                      return [
                        \`Promedio: \${value.toFixed(2)}\`,
                        \`Cohortes: \${years}\`
                      ];
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  min: Math.min(groupAPromedio, groupBPromedio) - 10,
                  max: Math.max(groupAPromedio, groupBPromedio) + 10,
                  title: {
                    display: true,
                    text: 'Promedio Global',
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    callback: function(value) {
                      return value.toFixed(0);
                    }
                  }
                },
                x: {
                  ticks: {
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  }
                }
              }
            }
          });
        }
        
        // Gráfico de Desviaciones Estándar
        const ctxDesviacion = document.getElementById('cohortComparisonDesviacionChart');
        if (ctxDesviacion) {
          desviacionComparisonChart = new Chart(ctxDesviacion, {
            type: 'bar',
            data: {
              labels: ['Grupo A', 'Grupo B'],
              datasets: [{
                label: 'Desviación Estándar',
                data: [groupADesviacion, groupBDesviacion],
                backgroundColor: [
                  'rgba(37, 99, 235, 0.8)',  // Azul para Grupo A
                  'rgba(34, 197, 94, 0.8)'   // Verde para Grupo B
                ],
                borderColor: [
                  'rgba(37, 99, 235, 1)',
                  'rgba(34, 197, 94, 1)'
                ],
                borderWidth: 2
              }]
            },
            plugins: [ChartDataLabels],
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: false
                },
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  formatter: (value) => value.toFixed(2),
                  font: {
                    weight: 'bold',
                    size: 14
                  },
                  color: '#1f2937'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label;
                      const value = context.parsed.y;
                      const years = label === 'Grupo A' ? groupAYears.join(', ') : groupBYears.join(', ');
                      return [
                        \`Desv. Est.: \${value.toFixed(2)}\`,
                        \`Cohortes: \${years}\`
                      ];
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Desviación Estándar',
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    callback: function(value) {
                      return value.toFixed(0);
                    }
                  }
                },
                x: {
                  ticks: {
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  }
                }
              }
            }
          });
        }
      }
      
      // Función para actualizar tabla de estudiantes fuera del lote
      function updateAtypicalTable(groupAYears, groupBYears) {
        const container = document.getElementById('atypicalTableContainer');
        
        if (!container || (groupAYears.length === 0 && groupBYears.length === 0)) {
          container.innerHTML = '<p class="text-gray-600 text-center py-4">Selecciona cohortes para ver los estudiantes fuera del lote</p>';
          return;
        }
        
        const allYears = [...new Set([...groupAYears, ...groupBYears])].sort();
        
        // Función auxiliar para calcular estudiantes fuera del lote por área (±2σ)
        function findAtypicalByArea(data, areaField) {
          const validStudents = data.filter(s => 
            s[areaField] !== null && 
            s[areaField] !== undefined && 
            !isNaN(s[areaField])
          );
          
          if (validStudents.length === 0) return [];
          
          const values = validStudents.map(s => s[areaField]);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
          const sd = Math.sqrt(variance);
          
          const threshold = 2; // ±2σ (comportamiento típico del lote)
          
          return validStudents.filter(student => {
            const z = Math.abs((student[areaField] - avg) / sd);
            return z >= threshold;
          });
        }
        
        // Función auxiliar para calcular estudiantes fuera del lote globales (±2σ)
        function findGlobalAtypical(data) {
          const validStudents = data.filter(s => 
            s.Global !== null && 
            s.Global !== undefined && 
            !isNaN(s.Global)
          );
          
          if (validStudents.length === 0) return [];
          
          const globals = validStudents.map(s => s.Global);
          const avg = globals.reduce((a, b) => a + b, 0) / globals.length;
          const variance = globals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / globals.length;
          const sd = Math.sqrt(variance);
          
          const threshold = 2; // ±2σ (comportamiento típico del lote)
          
          return validStudents.filter(student => {
            const z = Math.abs((student.Global - avg) / sd);
            return z >= threshold;
          });
        }
        
        // Recopilar datos de todas las cohortes seleccionadas
        const allData = [];
        allYears.forEach(year => {
          const analysis = gaussianData.find(d => d.year === year);
          if (analysis && analysis.data) {
            analysis.data.forEach(student => {
              allData.push({ ...student, year });
            });
          }
        });
        
        if (allData.length === 0) {
          container.innerHTML = '<p class="text-gray-600 text-center py-4">No hay datos disponibles</p>';
          return;
        }
        
        // Calcular outliers por área
        const areas = [
          { name: 'Global', field: 'Global', color: '#6366f1' },
          { name: 'Lectura crítica', field: 'Lectura crítica', color: '#ef4444' },
          { name: 'Matemáticas', field: 'Matemáticas', color: '#3b82f6' },
          { name: 'Sociales', field: 'Sociales', color: '#f97316' },
          { name: 'Naturales', field: 'Naturales', color: '#10b981' },
          { name: 'Inglés', field: 'Inglés', color: '#8b5cf6' }
        ];
        
        let html = '<table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">';
        html += '<thead class="bg-blue-600 text-white">';
        html += '<tr>';
        html += '<th class="px-4 py-3 text-left text-sm font-semibold">Cohorte</th>';
        areas.forEach(area => {
          html += \`<th class="px-4 py-3 text-center text-sm font-semibold" style="color: white;">\${area.name}</th>\`;
        });
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        
        allYears.forEach((year, index) => {
          const yearData = allData.filter(s => s.year === year);
          
          html += \`<tr class="\${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">\`;
          html += \`<td class="px-4 py-3 text-left font-bold text-lg">\${year}</td>\`;
          
          areas.forEach(area => {
            const atypical = area.field === 'Global' 
              ? findGlobalAtypical(yearData)
              : findAtypicalByArea(yearData, area.field);
            
            const count = atypical.length;
            const percentage = yearData.length > 0 ? ((count / yearData.length) * 100).toFixed(1) : '0.0';
            
            html += \`<td class="px-4 py-3 text-center">\`;
            if (count > 0) {
              html += \`<div class="flex flex-col items-center">\`;
              html += \`<span class="text-lg font-bold" style="color: \${area.color}">\${count}</span>\`;
              html += \`<span class="text-xs text-gray-600">(\${percentage}%)</span>\`;
              html += \`</div>\`;
            } else {
              html += \`<span class="text-gray-400">-</span>\`;
            }
            html += \`</td>\`;
          });
          
          html += '</tr>';
        });
        
        html += '</tbody>';
        html += '</table>';
        
        // Agregar leyenda actualizada
        html += '<div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">';
        html += '<p class="text-xs text-gray-700"><strong>Interpretación:</strong> Los números indican la cantidad de estudiantes que están <strong>fuera del comportamiento típico del lote</strong> (±2σ) en cada área. ';
        html += 'El porcentaje muestra qué proporción del total de estudiantes de esa cohorte están fuera del lote. ';
        html += 'Estos estudiantes pueden tener rendimiento excepcional (por encima) o requerir apoyo adicional (por debajo). ';
        html += '<strong>Nota:</strong> El criterio de ±2σ captura aproximadamente el 95% del comportamiento típico del grupo.</p>';
        html += '</div>';
        
        container.innerHTML = html;
      }
      
      // Variables para comparación por áreas
      let areaComparisonMode = 'sinPIAR';
      let areaComparisonCharts = {};
      
      // Función para cambiar el modo de visualización
      function setAreaComparisonMode(mode) {
        areaComparisonMode = mode;
        
        // Actualizar botones
        document.getElementById('btnAreaSinPIAR').className = mode === 'sinPIAR' 
          ? 'px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors'
          : 'px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors';
        
        document.getElementById('btnAreaConPIAR').className = mode === 'conPIAR' 
          ? 'px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors'
          : 'px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors';
        
        document.getElementById('btnAreaSinOutliers').className = mode === 'sinOutliers' 
          ? 'px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors'
          : 'px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors';
        
        // Actualizar etiqueta
        const labels = {
          sinPIAR: 'Mostrando datos sin PIAR (métricas principales)',
          conPIAR: 'Mostrando datos con PIAR (todos los estudiantes)',
          sinOutliers: 'Mostrando rendimiento típico del lote (±2σ, excluye estudiantes atípicos)'
        };
        document.getElementById('areaComparisonModeLabel').textContent = labels[mode];
        
        // Actualizar gráficos
        const groupACheckboxes = Array.from(document.querySelectorAll('.cohort-group-a:checked'));
        const groupBCheckboxes = Array.from(document.querySelectorAll('.cohort-group-b:checked'));
        const groupAYears = groupACheckboxes.map(cb => parseInt(cb.value));
        const groupBYears = groupBCheckboxes.map(cb => parseInt(cb.value));
        
        if (groupAYears.length > 0 && groupBYears.length > 0) {
          updateAreaComparisonCharts(groupAYears, groupBYears);
        }
      }
      
      // Función para actualizar gráficos de comparación por áreas
      function updateAreaComparisonCharts(groupAYears, groupBYears) {
        const container = document.getElementById('areaComparisonCharts');
        
        if (!container || groupAYears.length === 0 || groupBYears.length === 0) {
          return;
        }
        
        // Destruir gráficos anteriores
        Object.values(areaComparisonCharts).forEach(chart => {
          if (chart) chart.destroy();
        });
        areaComparisonCharts = {};
        
        // Generar HTML para cada área
        let html = '';
        
        areasComparisonData.forEach((area, areaIndex) => {
          // Calcular promedios y desviaciones para cada grupo
          const groupAData = area.data.filter(d => groupAYears.includes(d.year));
          const groupBData = area.data.filter(d => groupBYears.includes(d.year));
          
          // Seleccionar datos según el modo
          const getPromedioValue = (d) => {
            if (areaComparisonMode === 'sinPIAR') return d.sinPIAR;
            if (areaComparisonMode === 'conPIAR') return d.conPIAR;
            return d.sinOutliers;
          };
          
          const getDesvValue = (d) => {
            if (areaComparisonMode === 'sinPIAR') return d.desvSinPIAR;
            if (areaComparisonMode === 'conPIAR') return d.desvConPIAR;
            return d.desvSinOutliers;
          };
          
          const groupAPromedios = groupAData.map(getPromedioValue).filter(v => v !== null);
          const groupBPromedios = groupBData.map(getPromedioValue).filter(v => v !== null);
          const groupADesviaciones = groupAData.map(getDesvValue).filter(v => v !== null);
          const groupBDesviaciones = groupBData.map(getDesvValue).filter(v => v !== null);
          
          if (groupAPromedios.length === 0 || groupBPromedios.length === 0) {
            return;
          }
          
          const groupAPromedio = groupAPromedios.reduce((a, b) => a + b, 0) / groupAPromedios.length;
          const groupBPromedio = groupBPromedios.reduce((a, b) => a + b, 0) / groupBPromedios.length;
          const groupADesviacion = groupADesviaciones.reduce((a, b) => a + b, 0) / groupADesviaciones.length;
          const groupBDesviacion = groupBDesviaciones.reduce((a, b) => a + b, 0) / groupBDesviaciones.length;
          
          const difPromedio = groupBPromedio - groupAPromedio;
          const difDesviacion = groupBDesviacion - groupADesviacion;
          
          html += \`
            <div class="bg-white rounded-lg p-4 shadow-md border-l-4" style="border-color: \${area.color}">
              <h5 class="text-md font-bold mb-3" style="color: \${area.color}">\${area.areaName}</h5>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Resumen de grupos -->
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">A</span>
                    <p class="text-xs font-bold text-gray-700">Grupo A</p>
                  </div>
                  <p class="text-xs text-gray-600 mb-1">Promedio: <span class="font-bold text-blue-600">\${isNaN(groupAPromedio) ? 'N/A' : groupAPromedio.toFixed(2)}</span></p>
                  <p class="text-xs text-gray-600">Desv. Est.: <span class="font-bold">\${isNaN(groupADesviacion) ? 'N/A' : groupADesviacion.toFixed(2)}</span></p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">B</span>
                    <p class="text-xs font-bold text-gray-700">Grupo B</p>
                  </div>
                  <p class="text-xs text-gray-600 mb-1">Promedio: <span class="font-bold text-green-600">\${isNaN(groupBPromedio) ? 'N/A' : groupBPromedio.toFixed(2)}</span></p>
                  <p class="text-xs text-gray-600">Desv. Est.: <span class="font-bold">\${isNaN(groupBDesviacion) ? 'N/A' : groupBDesviacion.toFixed(2)}</span></p>
                </div>
              </div>
              
              <!-- Gráficos -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-semibold text-gray-700 mb-2 text-center">Comparación de Promedios</p>
                  <div style="height: 200px; position: relative;">
                    <canvas id="areaPromedioChart\${areaIndex}"></canvas>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-700 mb-2 text-center">Comparación de Desviaciones</p>
                  <div style="height: 200px; position: relative;">
                    <canvas id="areaDesviacionChart\${areaIndex}"></canvas>
                  </div>
                </div>
              </div>
              
              <!-- Diferencias -->
              <div class="mt-3 grid grid-cols-2 gap-2">
                <div class="bg-gray-50 rounded p-2">
                  <p class="text-xs text-gray-600">Dif. Promedio:</p>
                  <p class="text-sm font-bold \${difPromedio >= 0 ? 'text-green-600' : 'text-red-600'}">
                    \${isNaN(difPromedio) ? 'N/A' : (difPromedio > 0 ? '+' : '') + difPromedio.toFixed(2)}
                  </p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <p class="text-xs text-gray-600">Dif. Desv. Est.:</p>
                  <p class="text-sm font-bold \${difDesviacion <= 0 ? 'text-green-600' : 'text-orange-600'}">
                    \${isNaN(difDesviacion) ? 'N/A' : (difDesviacion > 0 ? '+' : '') + difDesviacion.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          \`;
          
          // Crear gráficos después de insertar el HTML
          setTimeout(() => {
            // Gráfico de promedios
            const ctxPromedio = document.getElementById('areaPromedioChart' + areaIndex);
            if (ctxPromedio && !isNaN(groupAPromedio) && !isNaN(groupBPromedio)) {
              const minPromedio = Math.min(groupAPromedio, groupBPromedio);
              const maxPromedio = Math.max(groupAPromedio, groupBPromedio);
              const rangePromedio = maxPromedio - minPromedio;
              const paddingPromedio = rangePromedio > 0 ? rangePromedio * 0.2 : 5;
              
              areaComparisonCharts['promedio' + areaIndex] = new Chart(ctxPromedio, {
                type: 'bar',
                data: {
                  labels: ['Grupo A', 'Grupo B'],
                  datasets: [{
                    label: 'Promedio',
                    data: [groupAPromedio, groupBPromedio],
                    backgroundColor: [
                      'rgba(37, 99, 235, 0.8)',
                      'rgba(34, 197, 94, 0.8)'
                    ],
                    borderColor: [
                      'rgba(37, 99, 235, 1)',
                      'rgba(34, 197, 94, 1)'
                    ],
                    borderWidth: 2
                  }]
                },
                plugins: [ChartDataLabels],
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    datalabels: {
                      anchor: 'end',
                      align: 'top',
                      formatter: (value) => value.toFixed(1),
                      font: { weight: 'bold', size: 11 },
                      color: '#1f2937'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: Math.max(0, minPromedio - paddingPromedio),
                      max: maxPromedio + paddingPromedio,
                      ticks: {
                        font: { size: 10 }
                      }
                    },
                    x: {
                      ticks: {
                        font: { size: 10, weight: 'bold' }
                      }
                    }
                  }
                }
              });
            }
            
            // Gráfico de desviaciones
            const ctxDesv = document.getElementById('areaDesviacionChart' + areaIndex);
            if (ctxDesv && !isNaN(groupADesviacion) && !isNaN(groupBDesviacion)) {
              const maxDesviacion = Math.max(groupADesviacion, groupBDesviacion);
              const paddingDesviacion = maxDesviacion * 0.2;
              
              areaComparisonCharts['desviacion' + areaIndex] = new Chart(ctxDesv, {
                type: 'bar',
                data: {
                  labels: ['Grupo A', 'Grupo B'],
                  datasets: [{
                    label: 'Desviación Estándar',
                    data: [groupADesviacion, groupBDesviacion],
                    backgroundColor: [
                      'rgba(37, 99, 235, 0.8)',
                      'rgba(34, 197, 94, 0.8)'
                    ],
                    borderColor: [
                      'rgba(37, 99, 235, 1)',
                      'rgba(34, 197, 94, 1)'
                    ],
                    borderWidth: 2
                  }]
                },
                plugins: [ChartDataLabels],
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    datalabels: {
                      anchor: 'end',
                      align: 'top',
                      formatter: (value) => isNaN(value) ? 'N/A' : value.toFixed(1),
                      font: { weight: 'bold', size: 11 },
                      color: '#1f2937'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: maxDesviacion + paddingDesviacion,
                      ticks: {
                        font: { size: 10 }
                      }
                    },
                    x: {
                      ticks: {
                        font: { size: 10, weight: 'bold' }
                      }
                    }
                  }
                }
              });
            }
          }, 100);
        });
        
        container.innerHTML = html;
      }
    </script>
  `;
};

/**
 * Genera la sección de comparación de métricas globales
 */
export const generateGlobalComparisonSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Preparar datos para gráficos de evolución
  const evolutionData = sortedAnalyses.map(analysis => {
    const metricsSinPIAR = analysis.getGlobalMetrics(true, false);
    const metricsConPIAR = analysis.getGlobalMetrics(false, false);
    
    return {
      year: analysis.year,
      promedioSinPIAR: metricsSinPIAR.promedio,
      promedioConPIAR: metricsConPIAR.promedio,
      desviacionSinPIAR: metricsSinPIAR.desviacion,
      desviacionConPIAR: metricsConPIAR.desviacion
    };
  });
  
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6">
      <h2 class="text-2xl font-bold">${sectionNumber}. Comparación de métricas globales</h2>
    </div>
    
    <!-- Gráficos de Evolución (uno debajo del otro) -->
    <div class="space-y-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div style="height: 350px; position: relative;">
          <canvas id="chartEvolucionPromedio"></canvas>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <div style="height: 350px; position: relative;">
          <canvas id="chartEvolucionDesviacion"></canvas>
        </div>
      </div>
    </div>
    
    <script>
      // Datos para gráficos de evolución
      const evolutionData = ${JSON.stringify(evolutionData)};
      
      // Gráfico de Evolución del Promedio Global
      new Chart(document.getElementById('chartEvolucionPromedio'), {
        type: 'bar',
        data: {
          labels: evolutionData.map(d => d.year),
          datasets: [
            {
              label: 'Sin PIAR',
              data: evolutionData.map(d => d.promedioSinPIAR),
              backgroundColor: 'rgba(22, 163, 74, 0.8)',
              borderColor: 'rgba(22, 163, 74, 1)',
              borderWidth: 1
            },
            {
              label: 'Con PIAR',
              data: evolutionData.map(d => d.promedioConPIAR),
              backgroundColor: 'rgba(107, 114, 128, 0.8)',
              borderColor: 'rgba(107, 114, 128, 1)',
              borderWidth: 1
            }
          ]
        },
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Evolución del Promedio Global por Cohorte',
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              display: true,
              position: 'top'
            },
            datalabels: {
              display: true,
              anchor: 'end',
              align: 'top',
              formatter: (value) => value ? value.toFixed(1) : '',
              font: { weight: 'bold', size: 11 },
              color: '#1f2937'
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 280,
              max: 320,
              ticks: {
                callback: function(value) {
                  return value.toFixed(0);
                }
              }
            }
          }
        }
      });
      
      // Gráfico de Evolución de la Desviación Estándar
      new Chart(document.getElementById('chartEvolucionDesviacion'), {
        type: 'bar',
        data: {
          labels: evolutionData.map(d => d.year),
          datasets: [
            {
              label: 'Sin PIAR',
              data: evolutionData.map(d => d.desviacionSinPIAR),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            },
            {
              label: 'Con PIAR',
              data: evolutionData.map(d => d.desviacionConPIAR),
              backgroundColor: 'rgba(107, 114, 128, 0.8)',
              borderColor: 'rgba(107, 114, 128, 1)',
              borderWidth: 1
            }
          ]
        },
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Evolución de la Desviación Estándar por Cohorte',
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              display: true,
              position: 'top'
            },
            datalabels: {
              display: true,
              anchor: 'end',
              align: 'top',
              formatter: (value) => value ? value.toFixed(1) : '',
              font: { weight: 'bold', size: 11 },
              color: '#1f2937'
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value.toFixed(0);
                }
              }
            }
          }
        }
      });
    </script>
    
    <!-- Métricas Sin PIAR (Principales) -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-green-600 mb-3 uppercase">Sin PIAR (Metricas Principales)</h3>
      <div class="overflow-x-auto shadow-md rounded-lg">
        <table class="min-w-full bg-white">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th class="px-4 py-3 text-center text-sm font-semibold">Cohorte</th>
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
              <th class="px-4 py-3 text-center text-sm font-semibold">Cohorte</th>
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
  
  // Preparar datos de evolución por área
  const areasEvolutionData = ACADEMIC_AREAS.map(area => {
    return {
      areaId: area.id,
      areaName: area.name,
      color: area.color,
      data: sortedAnalyses.map(analysis => {
        const chartData = prepareAreaChartData(analysis, true);
        const areaData = chartData.promedios.find(item => item.areaId === area.id);
        const areaDesv = chartData.desviacion.find(item => item.areaId === area.id);
        return {
          year: analysis.year,
          sinPIAR: areaData ? areaData.sinPIAR : null,
          conPIAR: areaData ? areaData.conPIAR : null,
          desvSinPIAR: areaDesv ? areaDesv.sinPIAR : null,
          desvConPIAR: areaDesv ? areaDesv.conPIAR : null
        };
      })
    };
  });
  
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6 mt-8">
      <h2 class="text-2xl font-bold">${sectionNumber}. Comparación por áreas académicas</h2>
    </div>
    
    ${ACADEMIC_AREAS.map((area, areaIndex) => `
      <div class="mb-8">
        <h3 class="text-lg font-bold mb-3 uppercase" style="color: ${area.color}">${area.name}</h3>
        
        <!-- Tabla del área -->
        <div class="overflow-x-auto shadow-md rounded-lg mb-6">
          <table class="min-w-full bg-white">
            <thead class="bg-blue-600 text-white">
              <tr>
                <th class="px-4 py-3 text-center text-sm font-semibold">Cohorte</th>
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
        
        <!-- Gráfico de evolución del área -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <h4 class="text-md font-semibold text-gray-700 mb-2">Gráfico de Evolución - ${area.name}</h4>
          <div style="height: 300px; position: relative;">
            <canvas id="chartAreaEvolution${areaIndex}"></canvas>
          </div>
        </div>
        
        <!-- Gráfico de evolución de desviación estándar del área -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <h4 class="text-md font-semibold text-gray-700 mb-2">Evolución de Desviación Estándar - ${area.name}</h4>
          <div style="height: 300px; position: relative;">
            <canvas id="chartAreaStdDevEvolution${areaIndex}"></canvas>
          </div>
        </div>
      </div>
    `).join('')}
    
    <script>
      // Datos de evolución por área
      const areasEvolutionData = ${JSON.stringify(areasEvolutionData)};
      
      // Crear gráficos de evolución por área
      areasEvolutionData.forEach((areaEvolution, index) => {
        // Gráfico de promedio
        new Chart(document.getElementById('chartAreaEvolution' + index), {
          type: 'bar',
          data: {
            labels: areaEvolution.data.map(d => d.year),
            datasets: [
              {
                label: 'Sin PIAR',
                data: areaEvolution.data.map(d => d.sinPIAR),
                backgroundColor: areaEvolution.color + 'CC',
                borderColor: areaEvolution.color,
                borderWidth: 1
              },
              {
                label: 'Con PIAR',
                data: areaEvolution.data.map(d => d.conPIAR),
                backgroundColor: 'rgba(107, 114, 128, 0.8)',
                borderColor: 'rgba(107, 114, 128, 1)',
                borderWidth: 1
              }
            ]
          },
          plugins: [ChartDataLabels],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: false
              },
              legend: {
                display: true,
                position: 'top'
              },
              datalabels: {
                display: true,
                anchor: 'end',
                align: 'top',
                formatter: (value) => value ? value.toFixed(1) : '',
                font: { weight: 'bold', size: 10 },
                color: '#1f2937'
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                ticks: {
                  callback: function(value) {
                    return value.toFixed(0);
                  }
                }
              }
            }
          }
        });
        
        // Gráfico de desviación estándar
        new Chart(document.getElementById('chartAreaStdDevEvolution' + index), {
          type: 'bar',
          data: {
            labels: areaEvolution.data.map(d => d.year),
            datasets: [
              {
                label: 'Sin PIAR',
                data: areaEvolution.data.map(d => d.desvSinPIAR),
                backgroundColor: areaEvolution.color + 'CC',
                borderColor: areaEvolution.color,
                borderWidth: 1
              },
              {
                label: 'Con PIAR',
                data: areaEvolution.data.map(d => d.desvConPIAR),
                backgroundColor: 'rgba(107, 114, 128, 0.8)',
                borderColor: 'rgba(107, 114, 128, 1)',
                borderWidth: 1
              }
            ]
          },
          plugins: [ChartDataLabels],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: false
              },
              legend: {
                display: true,
                position: 'top'
              },
              datalabels: {
                display: true,
                anchor: 'end',
                align: 'top',
                formatter: (value) => value ? value.toFixed(1) : '',
                font: { weight: 'bold', size: 10 },
                color: '#1f2937'
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Desviación Estándar',
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                },
                ticks: {
                  callback: function(value) {
                    return value.toFixed(0);
                  }
                }
              }
            }
          }
        });
      });
    </script>
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
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6 mt-8 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">${sectionNumber}. Listado completo de estudiantes</h2>
        <p class="text-blue-100 text-sm mt-1">Todos los años con filtros avanzados</p>
      </div>
      <button 
        onclick="toggleStudentsTableMulti()" 
        id="toggleStudentsButtonMulti"
        class="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <svg id="toggleIconMulti" class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
        <span id="toggleTextMulti">Ocultar tabla</span>
      </button>
    </div>
    
    <div id="studentsTableContainerMulti" class="transition-all duration-500 ease-in-out overflow-hidden" style="max-height: 10000px;">
    
    <!-- Toggle PIAR Moderno y Filtros -->
    <div class="mb-6 no-print">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-700">Mostrar PIAR:</span>
          <button 
            id="togglePiarBtn" 
            onclick="togglePiarVisibility()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            <span id="piarStatus">Sí</span>
          </button>
        </div>
        <div id="piarCount" class="text-sm text-gray-600"></div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Puntaje mínimo</label>
          <input 
            type="number" 
            id="minScoreFilterAll" 
            placeholder="Ej: 300" 
            class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onkeyup="filterAllStudentsTable()"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Puntaje máximo</label>
          <input 
            type="number" 
            id="maxScoreFilterAll" 
            placeholder="Ej: 400" 
            class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onkeyup="filterAllStudentsTable()"
          >
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
        <div id="matchCounterAll" class="text-lg font-bold text-blue-600">
          ${allStudents.length} estudiante${allStudents.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
    
    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table id="allStudentsTable" class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(0)">Cohorte ⬍</th>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(1)">Nombre</th>
            <th class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(2)">Apellido</th>
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(3)">Grado</th>
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(4)">PIAR</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(5)">Global ⬍</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(6)">Lectura</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(7)">Matemát.</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(8)">Sociales</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(9)">Naturales</th>
            <th class="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(10)">Inglés</th>
          </tr>
        </thead>
        <tbody id="allStudentsTableBody">
          <!-- Se llenará dinámicamente con JavaScript -->
        </tbody>
      </table>
    </div>
    
    <!-- Controles de paginación -->
    <div class="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700">Filas por página:</label>
        <select 
          id="rowsPerPage" 
          onchange="changeRowsPerPage()"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="25">25</option>
          <option value="50" selected>50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="all">Todos</option>
        </select>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          id="prevPageBtn"
          onclick="changePage(-1)" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          ← Anterior
        </button>
        <span id="pageInfo" class="text-sm font-medium text-gray-700 px-4">Página 1 de 1</span>
        <button 
          id="nextPageBtn"
          onclick="changePage(1)" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Siguiente →
        </button>
      </div>
      
      <p class="text-sm text-gray-600">
        Mostrando <strong id="visibleCountAll">0</strong> de <strong id="totalCountAll">${allStudents.length}</strong> estudiantes
      </p>
    </div>
    
    </div> <!-- Fin del contenedor colapsable -->
    
    <script>
      // Datos de todos los estudiantes
      const allStudentsData = ${JSON.stringify(allStudents)};
      
      // Estado de paginación
      let currentPage = 1;
      let rowsPerPage = 50;
      let filteredStudents = [...allStudentsData];
      let piarVisible = true;
      
      // Estado del toggle de la tabla multi-año
      let studentsTableVisibleMulti = true;
      
      function toggleStudentsTableMulti() {
        const container = document.getElementById('studentsTableContainerMulti');
        const icon = document.getElementById('toggleIconMulti');
        const text = document.getElementById('toggleTextMulti');
        
        studentsTableVisibleMulti = !studentsTableVisibleMulti;
        
        if (studentsTableVisibleMulti) {
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
      
      // Función para renderizar una fila de estudiante
      function renderStudentRow(student) {
        const yearColor = student.year === 2025 ? 'bg-blue-50' : student.year === 2024 ? 'bg-gray-50' : 'bg-green-50';
        const yearBadge = student.year === 2025 ? 'bg-blue-600' : student.year === 2024 ? 'bg-gray-600' : 'bg-green-600';
        const piarHighlight = student.piar ? 'bg-yellow-100 border-l-4 border-yellow-500' : '';
        const rowClass = student.piar ? 'piar-row' : 'no-piar-row';
        
        return \`
          <tr class="border-b border-gray-200 hover:opacity-75 transition-opacity \${yearColor} \${piarHighlight} \${rowClass}" 
              data-year="\${student.year}" 
              data-grade="\${student.grado}" 
              data-global="\${student.global}"
              data-piar="\${student.piar ? 'si' : 'no'}">
            <td class="px-4 py-3 text-center">
              <span class="px-3 py-1 \${yearBadge} text-white rounded-full text-sm font-bold">\${student.year}</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 font-medium">\${student.nombre}</td>
            <td class="px-4 py-3 text-sm text-gray-900 font-medium">\${student.apellido}</td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">\${student.grado}</span>
            </td>
            <td class="px-4 py-3 text-center">
              \${student.piar ? '<span class="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">SÍ</span>' : '<span class="px-2 py-1 bg-gray-300 text-gray-700 rounded-full text-xs">NO</span>'}
            </td>
            <td class="px-4 py-3 text-right font-bold text-lg \${student.global >= 300 ? 'text-green-600' : 'text-gray-700'}">
              \${student.global != null ? student.global.toFixed(1) : 'N/A'}
            </td>
            <td class="px-4 py-3 text-right text-sm text-gray-700">\${student.lectura != null ? student.lectura.toFixed(1) : 'N/A'}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-700">\${student.matematicas != null ? student.matematicas.toFixed(1) : 'N/A'}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-700">\${student.sociales != null ? student.sociales.toFixed(1) : 'N/A'}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-700">\${student.naturales != null ? student.naturales.toFixed(1) : 'N/A'}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-700">\${student.ingles != null ? student.ingles.toFixed(1) : 'N/A'}</td>
          </tr>
        \`;
      }
      
      // Función para renderizar la tabla
      function renderTable() {
        const tbody = document.getElementById('allStudentsTableBody');
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = rowsPerPage === 'all' ? filteredStudents.length : startIndex + rowsPerPage;
        const pageStudents = filteredStudents.slice(startIndex, endIndex);
        
        tbody.innerHTML = pageStudents.map(student => renderStudentRow(student)).join('');
        
        // Actualizar controles de paginación
        updatePaginationControls();
        updateVisibleCount();
      }
      
      // Función para actualizar controles de paginación
      function updatePaginationControls() {
        const totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(filteredStudents.length / rowsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        pageInfo.textContent = \`Página \${currentPage} de \${totalPages}\`;
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= totalPages;
        
        if (prevBtn.disabled) {
          prevBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
          prevBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        } else {
          prevBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
          prevBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
        
        if (nextBtn.disabled) {
          nextBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
          nextBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        } else {
          nextBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
          nextBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
      }
      
      // Función para cambiar de página
      function changePage(direction) {
        const totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(filteredStudents.length / rowsPerPage);
        currentPage = Math.max(1, Math.min(currentPage + direction, totalPages));
        renderTable();
      }
      
      // Función para cambiar filas por página
      function changeRowsPerPage() {
        const select = document.getElementById('rowsPerPage');
        rowsPerPage = select.value === 'all' ? 'all' : parseInt(select.value);
        currentPage = 1;
        renderTable();
      }
      
      // Función para aplicar filtros
      function applyFilters() {
        const searchValue = document.getElementById('searchAllStudents').value.toLowerCase();
        const yearValue = document.getElementById('yearFilter').value;
        const gradeValue = document.getElementById('gradeFilterAll').value;
        const minScore = parseFloat(document.getElementById('minScoreFilterAll').value) || 0;
        const maxScore = parseFloat(document.getElementById('maxScoreFilterAll').value) || Infinity;
        
        filteredStudents = allStudentsData.filter(student => {
          const matchesSearch = student.nombre.toLowerCase().includes(searchValue) || 
                               student.apellido.toLowerCase().includes(searchValue);
          const matchesYear = !yearValue || student.year.toString() === yearValue;
          const matchesGrade = !gradeValue || student.grado === gradeValue;
          const matchesMinScore = student.global >= minScore;
          const matchesMaxScore = student.global <= maxScore;
          const matchesPiar = piarVisible || !student.piar;
          
          return matchesSearch && matchesYear && matchesGrade && matchesMinScore && matchesMaxScore && matchesPiar;
        });
        
        currentPage = 1;
        renderTable();
        updateMatchCounter();
      }
      
      function togglePiarVisibility() {
        piarVisible = !piarVisible;
        
        // Actualizar texto del botón
        const statusSpan = document.getElementById('piarStatus');
        if (statusSpan) {
          statusSpan.textContent = piarVisible ? 'Sí' : 'No';
        }
        
        // Re-aplicar filtros
        applyFilters();
        updatePiarCountMulti();
      }
      
      function updatePiarCountMulti() {
        const piarStudents = allStudentsData.filter(s => s.piar);
        const visiblePiarStudents = filteredStudents.filter(s => s.piar);
        const countDiv = document.getElementById('piarCount');
        if (countDiv) {
          countDiv.textContent = \`Estudiantes con PIAR: \${visiblePiarStudents.length} de \${piarStudents.length}\`;
        }
      }
      
      function updateVisibleCount() {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = rowsPerPage === 'all' ? filteredStudents.length : startIndex + rowsPerPage;
        const showing = Math.min(endIndex - startIndex, filteredStudents.length - startIndex);
        
        document.getElementById('visibleCountAll').textContent = showing;
        document.getElementById('totalCountAll').textContent = filteredStudents.length;
      }
      
      function updateMatchCounter() {
        const matchCounter = document.getElementById('matchCounterAll');
        if (matchCounter) {
          matchCounter.textContent = \`\${filteredStudents.length} estudiante\${filteredStudents.length !== 1 ? 's' : ''}\`;
        }
      }
      
      function filterAllStudentsTable() {
        applyFilters();
      }
      
      let sortDirectionAll = {};
      let sortColumnIndex = null;
      
      function sortAllStudentsTable(columnIndex) {
        sortDirectionAll[columnIndex] = !sortDirectionAll[columnIndex];
        const direction = sortDirectionAll[columnIndex] ? 1 : -1;
        sortColumnIndex = columnIndex;
        
        const columnMap = {
          0: 'year',
          1: 'nombre',
          2: 'apellido',
          3: 'grado',
          4: 'piar',
          5: 'global',
          6: 'lectura',
          7: 'matematicas',
          8: 'sociales',
          9: 'naturales',
          10: 'ingles'
        };
        
        const field = columnMap[columnIndex];
        
        filteredStudents.sort((a, b) => {
          let aValue = a[field];
          let bValue = b[field];
          
          // Manejar valores booleanos (PIAR)
          if (typeof aValue === 'boolean') {
            return direction * ((aValue ? 1 : 0) - (bValue ? 1 : 0));
          }
          
          // Manejar valores numéricos
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction * (aValue - bValue);
          }
          
          // Manejar valores de texto
          return direction * String(aValue).localeCompare(String(bValue));
        });
        
        renderTable();
      }
      
      // Inicializar tabla al cargar
      window.addEventListener('DOMContentLoaded', () => {
        renderTable();
        updatePiarCountMulti();
      });
      
      // Detectar cuando se va a imprimir y mostrar TODA la tabla
      window.addEventListener('beforeprint', () => {
        const tbody = document.getElementById('allStudentsTableBody');
        const container = document.getElementById('studentsTableContainerMulti');
        
        // Si la tabla está visible (no colapsada)
        if (container && container.style.maxHeight !== '0') {
          // Renderizar TODOS los estudiantes filtrados
          tbody.innerHTML = filteredStudents.map(student => renderStudentRow(student)).join('');
          
          // Ocultar controles de paginación en impresión
          const paginationControls = container.querySelector('.mt-6.flex');
          if (paginationControls) {
            paginationControls.classList.add('no-print');
          }
        }
      });
      
      // Restaurar paginación después de imprimir
      window.addEventListener('afterprint', () => {
        renderTable();
        
        // Restaurar controles de paginación
        const container = document.getElementById('studentsTableContainerMulti');
        if (container) {
          const paginationControls = container.querySelector('.mt-6.flex');
          if (paginationControls) {
            paginationControls.classList.remove('no-print');
          }
        }
      });
    </script>
  `;
};

/**
 * Genera la sección de tendencia de promedios globales con efecto WOW
 * Gráfico de barras con línea de tendencia punteada
 */
export const generateTrendChartSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => {
    // Ordenar por año (convertir a número si es posible)
    const yearA = typeof a.year === 'string' ? parseInt(a.year) || a.year : a.year;
    const yearB = typeof b.year === 'string' ? parseInt(b.year) || b.year : b.year;
    
    if (typeof yearA === 'number' && typeof yearB === 'number') {
      return yearA - yearB;
    }
    return String(yearA).localeCompare(String(yearB));
  });
  
  // Preparar datos de tendencia
  const trendData = sortedAnalyses.map(analysis => {
    const metricsSinPIAR = analysis.getGlobalMetrics(true, false);
    const metricsConPIAR = analysis.getGlobalMetrics(false, false);
    
    return {
      year: analysis.year,
      sinPIAR: metricsSinPIAR.promedio,
      conPIAR: metricsConPIAR.promedio
    };
  });
  
  return `
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg p-6 mb-6 shadow-2xl">
      <h2 class="text-3xl font-extrabold mb-2">🚀 ${sectionNumber}. Tendencia de Promedios Globales</h2>
      <p class="text-purple-100 text-lg">Evolución del rendimiento académico entre cohortes</p>
    </div>
    
    <div class="bg-white rounded-lg shadow-2xl p-8 mb-8">
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">📈 Evolución del Promedio Global</h3>
        <p class="text-gray-600">Visualiza la tendencia del rendimiento académico a través de las cohortes</p>
      </div>
      
      <!-- Selector de modo PIAR -->
      <div class="mb-6 flex items-center justify-center gap-4">
        <button 
          id="btnSinPIAR" 
          onclick="togglePIARMode('sinPIAR')"
          class="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          ✓ Sin PIAR
        </button>
        <button 
          id="btnConPIAR" 
          onclick="togglePIARMode('conPIAR')"
          class="px-8 py-4 bg-gray-300 text-gray-600 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Con PIAR
        </button>
      </div>
      
      <!-- Gráfico de tendencia -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-inner">
        <div style="height: 500px; position: relative;">
          <canvas id="chartTendenciaGlobal"></canvas>
        </div>
      </div>
      
      <!-- Tabla de datos -->
      <div class="mt-8 overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <thead class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-bold uppercase">Cohorte</th>
              <th class="px-6 py-4 text-center text-sm font-bold uppercase">Promedio Sin PIAR</th>
              <th class="px-6 py-4 text-center text-sm font-bold uppercase">Promedio Con PIAR</th>
              <th class="px-6 py-4 text-center text-sm font-bold uppercase">Diferencia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${trendData.map((data, index) => {
              const diff = data.sinPIAR - data.conPIAR;
              const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
              
              return `
                <tr class="${bgClass} hover:bg-indigo-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-gray-800">${data.year}</td>
                  <td class="px-6 py-4 text-center">
                    <span class="inline-block px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg">
                      ${data.sinPIAR.toFixed(2)}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="inline-block px-4 py-2 bg-blue-100 text-blue-800 font-bold rounded-lg">
                      ${data.conPIAR.toFixed(2)}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="inline-block px-4 py-2 ${diff > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'} font-bold rounded-lg">
                      ${diff > 0 ? '+' : ''}${diff.toFixed(2)}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    <script>
      // Datos de tendencia
      const trendData = ${JSON.stringify(trendData)};
      
      // Variable global para el gráfico
      let trendChart = null;
      let currentMode = 'sinPIAR';
      
      // Función para crear/actualizar el gráfico
      function createTrendChart(mode) {
        const ctx = document.getElementById('chartTendenciaGlobal');
        
        // Destruir gráfico anterior si existe
        if (trendChart) {
          trendChart.destroy();
        }
        
        // Configurar datos según el modo
        const isSinPIAR = mode === 'sinPIAR';
        const data = trendData.map(d => isSinPIAR ? d.sinPIAR : d.conPIAR);
        const color = isSinPIAR 
          ? { main: 'rgba(34, 197, 94, 0.9)', border: 'rgba(34, 197, 94, 1)', line: 'rgba(34, 197, 94, 1)' }
          : { main: 'rgba(59, 130, 246, 0.9)', border: 'rgba(59, 130, 246, 1)', line: 'rgba(59, 130, 246, 1)' };
        const label = isSinPIAR ? 'Sin PIAR' : 'Con PIAR';
        
        trendChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: trendData.map(d => String(d.year)),
            datasets: [
              {
                type: 'line',
                label: 'Tendencia',
                data: data,
                borderColor: color.line,
                backgroundColor: 'transparent',
                borderWidth: 3,
                borderDash: [10, 5],
                pointRadius: 0,
                pointHoverRadius: 0,
                tension: 0.4,
                fill: false,
                order: 0,
                datalabels: {
                  display: false
                }
              },
              {
                type: 'bar',
                label: label,
                data: data,
                backgroundColor: color.main,
                borderColor: color.border,
                borderWidth: 2,
                borderRadius: 10,
                order: 1
              }
            ]
          },
          plugins: [ChartDataLabels],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1500,
              easing: 'easeInOutQuart'
            },
            interaction: {
              mode: 'index',
              intersect: false
            },
            plugins: {
              title: {
                display: true,
                text: 'Evolución del Promedio Global por Cohorte (' + label + ')',
                font: { 
                  size: 22, 
                  weight: 'bold',
                  family: 'system-ui, -apple-system, sans-serif'
                },
                color: '#1f2937',
                padding: 20
              },
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: { size: 14, weight: '600' },
                  padding: 15,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              datalabels: {
                display: function(context) {
                  return context.dataset.type === 'bar';
                },
                anchor: 'end',
                align: 'top',
                offset: 6,
                formatter: (value) => value ? value.toFixed(1) : '',
                font: { 
                  weight: 'bold', 
                  size: 15,
                  family: 'system-ui, -apple-system, sans-serif'
                },
                color: '#1f2937',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 6,
                padding: {
                  top: 6,
                  bottom: 6,
                  left: 8,
                  right: 8
                },
                borderColor: color.border,
                borderWidth: 2
              },
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleFont: { size: 15, weight: 'bold' },
                bodyFont: { size: 14 },
                padding: 14,
                cornerRadius: 8,
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    return label + ': ' + value.toFixed(2);
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: { 
                    size: 15, 
                    weight: 'bold',
                    family: 'system-ui, -apple-system, sans-serif'
                  },
                  color: '#374151'
                }
              },
              y: {
                beginAtZero: false,
                grid: {
                  color: 'rgba(0, 0, 0, 0.06)',
                  drawBorder: false
                },
                ticks: {
                  font: { 
                    size: 13,
                    family: 'system-ui, -apple-system, sans-serif'
                  },
                  color: '#6b7280',
                  callback: function(value) {
                    return value.toFixed(0);
                  }
                }
              }
            }
          }
        });
      }
      
      // Función para alternar entre modos
      function togglePIARMode(mode) {
        currentMode = mode;
        
        // Actualizar estilos de botones
        const btnSinPIAR = document.getElementById('btnSinPIAR');
        const btnConPIAR = document.getElementById('btnConPIAR');
        
        if (mode === 'sinPIAR') {
          btnSinPIAR.className = 'px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300';
          btnConPIAR.className = 'px-8 py-4 bg-gray-300 text-gray-600 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300';
        } else {
          btnSinPIAR.className = 'px-8 py-4 bg-gray-300 text-gray-600 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300';
          btnConPIAR.className = 'px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300';
        }
        
        // Recrear gráfico
        createTrendChart(mode);
      }
      
      // Inicializar gráfico con modo "Sin PIAR"
      createTrendChart('sinPIAR');
    </script>
  `;
};
