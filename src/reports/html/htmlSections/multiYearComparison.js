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
              <th class="px-8 py-4 text-left text-sm font-bold text-white uppercase">Año</th>
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
  
  // Preparar datos de métricas para cada año
  const gaussianData = sortedAnalyses.map(analysis => {
    const globalSinPIAR = analysis.getGlobalMetrics(true, false);
    
    return {
      year: analysis.year,
      promedio: globalSinPIAR.promedio,
      desviacion: globalSinPIAR.desviacion
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
    
    <script>
      // Datos para curvas de Gauss
      const gaussianData = ${JSON.stringify(gaussianData)};
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
              text: 'Evolución del Promedio Global por Año',
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
              text: 'Evolución de la Desviación Estándar por Año',
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
        
        <!-- Gráfico de evolución del área -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <h4 class="text-md font-semibold text-gray-700 mb-2">Gráfico de Evolución - ${area.name}</h4>
          <div style="height: 300px; position: relative;">
            <canvas id="chartAreaEvolution${areaIndex}"></canvas>
          </div>
        </div>
      </div>
    `).join('')}
    
    <script>
      // Datos de evolución por área
      const areasEvolutionData = ${JSON.stringify(areasEvolutionData)};
      
      // Crear gráficos de evolución por área
      areasEvolutionData.forEach((areaEvolution, index) => {
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
            <th class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700" onclick="sortAllStudentsTable(0)">Año ⬍</th>
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
        <tbody>
          ${allStudents.map((student) => {
            // Color por año: 2025 = azul, 2024 = gris, otros = verde
            const yearColor = student.year === 2025 ? 'bg-blue-50' : student.year === 2024 ? 'bg-gray-50' : 'bg-green-50';
            const yearBadge = student.year === 2025 ? 'bg-blue-600' : student.year === 2024 ? 'bg-gray-600' : 'bg-green-600';
            // Resaltado para PIAR
            const piarHighlight = student.piar ? 'bg-yellow-100 border-l-4 border-yellow-500' : '';
            const rowClass = student.piar ? 'piar-row' : 'no-piar-row';
            
            return `
            <tr class="border-b border-gray-200 hover:opacity-75 transition-opacity ${yearColor} ${piarHighlight} ${rowClass}" 
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
              <td class="px-4 py-3 text-center">
                ${student.piar ? '<span class="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">SÍ</span>' : '<span class="px-2 py-1 bg-gray-300 text-gray-700 rounded-full text-xs">NO</span>'}
              </td>
              <td class="px-4 py-3 text-right font-bold text-lg ${student.global >= 300 ? 'text-green-600' : 'text-gray-700'}">
                ${student.global != null ? student.global.toFixed(1) : 'N/A'}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.lectura != null ? student.lectura.toFixed(1) : 'N/A'}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.matematicas != null ? student.matematicas.toFixed(1) : 'N/A'}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.sociales != null ? student.sociales.toFixed(1) : 'N/A'}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.naturales != null ? student.naturales.toFixed(1) : 'N/A'}</td>
              <td class="px-4 py-3 text-right text-sm text-gray-700">${student.ingles != null ? student.ingles.toFixed(1) : 'N/A'}</td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    <p class="text-sm text-gray-600 mt-4">
      Mostrando <strong id="visibleCountAll">${allStudents.length}</strong> de <strong>${allStudents.length}</strong> estudiantes
    </p>
    
    </div> <!-- Fin del contenedor colapsable -->
    
    <script>
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
      
      let piarVisible = true; // Estado inicial: PIAR visible
      
      function togglePiarVisibility() {
        piarVisible = !piarVisible;
        const piarRows = document.querySelectorAll('.piar-row');
        
        piarRows.forEach(row => {
          if (piarVisible) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
        
        // Actualizar texto del botón
        const statusSpan = document.getElementById('piarStatus');
        if (statusSpan) {
          statusSpan.textContent = piarVisible ? 'Sí' : 'No';
        }
        
        // Actualizar contador
        updateVisibleCount();
        updatePiarCountMulti();
      }
      
      function updatePiarCountMulti() {
        const piarRows = document.querySelectorAll('.piar-row');
        const visiblePiarRows = Array.from(piarRows).filter(row => row.style.display !== 'none');
        const countDiv = document.getElementById('piarCount');
        if (countDiv) {
          countDiv.textContent = \`Estudiantes con PIAR: \${visiblePiarRows.length} de \${piarRows.length}\`;
        }
      }
      
      // Inicializar contador al cargar
      window.addEventListener('DOMContentLoaded', () => {
        updatePiarCountMulti();
      });
      
      function updateVisibleCount() {
        const table = document.getElementById('allStudentsTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let visibleCount = 0;
        
        for (let row of rows) {
          if (row.style.display !== 'none') {
            visibleCount++;
          }
        }
        
        document.getElementById('visibleCountAll').textContent = visibleCount;
      }
      
      function filterAllStudentsTable() {
        const searchValue = document.getElementById('searchAllStudents').value.toLowerCase();
        const yearValue = document.getElementById('yearFilter').value;
        const gradeValue = document.getElementById('gradeFilterAll').value;
        const minScore = parseFloat(document.getElementById('minScoreFilterAll').value) || 0;
        const maxScore = parseFloat(document.getElementById('maxScoreFilterAll').value) || Infinity;
        
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
          const matchesMinScore = global >= minScore;
          const matchesMaxScore = global <= maxScore;
          
          // Aplicar filtros normales
          if (matchesSearch && matchesYear && matchesGrade && matchesMinScore && matchesMaxScore) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        }
        
        // Aplicar toggle de PIAR después de los filtros
        if (!piarVisible) {
          const piarRows = document.querySelectorAll('.piar-row');
          piarRows.forEach(row => {
            if (row.style.display !== 'none') {
              row.style.display = 'none';
              visibleCount--;
            }
          });
        }
        
        // Actualizar contador de coincidencias
        const matchCounter = document.getElementById('matchCounterAll');
        if (matchCounter) {
          matchCounter.textContent = \`\${visibleCount} estudiante\${visibleCount !== 1 ? 's' : ''}\`;
        }
        
        updateVisibleCount();
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
