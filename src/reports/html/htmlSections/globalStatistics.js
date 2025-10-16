/**
 * ✅ Sección HTML: Estadísticas Globales con Interactividad PIAR
 * Gráfico de barras interactivo con toggle para mostrar Con PIAR, Sin PIAR o ambos
 */

import { calculateGlobalMetrics } from '../../../utils/calculations/metrics.js';

/**
 * Genera la sección de estadísticas globales (promedio y desviación estándar con/sin PIAR)
 * Con sistema de botones toggle para elegir qué datos mostrar
 */
export const generateGlobalStatisticsSection = (analysis, sectionNumber) => {
  const data = analysis.processedData;
  
  // Calcular métricas con y sin PIAR
  const metricsConPIAR = calculateGlobalMetrics(data, false);
  const metricsSinPIAR = calculateGlobalMetrics(data, true);
  
  return `
    <div class="mt-8 mb-8">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 mb-6">
        <h2 class="text-2xl font-bold">${sectionNumber}. 📊 Estadísticas Globales</h2>
        <p class="text-blue-100 text-sm mt-1">Promedio y desviación estándar con interactividad PIAR</p>
      </div>
      
      <!-- Controles de visualización -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center gap-4 flex-wrap">
          <span class="text-sm font-semibold text-gray-700">Mostrar:</span>
          <button 
            id="btnSinPIAR" 
            onclick="toggleDataset('sinPIAR')"
            class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700"
          >
            Sin PIAR
          </button>
          <button 
            id="btnConPIAR" 
            onclick="toggleDataset('conPIAR')"
            class="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-700"
          >
            Con PIAR
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-3 italic">
          Haz clic en los botones para mostrar/ocultar cada conjunto de datos. Puedes ver uno, dos o los tres al mismo tiempo.
        </p>
      </div>
      
      <!-- Gráfico de barras -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h4 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
          Comparación de promedio y desviación estándar
        </h4>
        <div style="height: 450px; position: relative;">
          <canvas id="globalStatsChart"></canvas>
        </div>
      </div>
    </div>
    
    <script>
      // Datos de métricas
      const globalStatsData = {
        sinPIAR: {
          promedio: ${metricsSinPIAR.promedio.toFixed(2)},
          desviacion: ${metricsSinPIAR.desviacion.toFixed(2)},
          total: ${metricsSinPIAR.totalEstudiantes}
        },
        conPIAR: {
          promedio: ${metricsConPIAR.promedio.toFixed(2)},
          desviacion: ${metricsConPIAR.desviacion.toFixed(2)},
          total: ${metricsConPIAR.totalEstudiantes}
        }
      };
      
      // Estado de visibilidad de datasets
      let datasetVisibility = {
        sinPIAR: true,
        conPIAR: false
      };
      
      let globalStatsChart = null;
      
      function toggleDataset(dataset) {
        datasetVisibility[dataset] = !datasetVisibility[dataset];
        updateButtonStyles();
        updateChart();
      }
      
      function updateButtonStyles() {
        const btnSinPIAR = document.getElementById('btnSinPIAR');
        const btnConPIAR = document.getElementById('btnConPIAR');
        
        // Sin PIAR - Verde cuando activo, gris cuando inactivo
        if (datasetVisibility.sinPIAR) {
          btnSinPIAR.className = 'px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700';
        } else {
          btnSinPIAR.className = 'px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400';
        }
        
        // Con PIAR - Gris oscuro cuando activo, gris claro cuando inactivo
        if (datasetVisibility.conPIAR) {
          btnConPIAR.className = 'px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-700';
        } else {
          btnConPIAR.className = 'px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400';
        }
      }
      
      function updateChart() {
        if (!globalStatsChart) return;
        
        // Actualizar visibilidad de datasets
        globalStatsChart.data.datasets.forEach((dataset, index) => {
          if (index === 0) { // Sin PIAR
            dataset.hidden = !datasetVisibility.sinPIAR;
          } else if (index === 1) { // Con PIAR
            dataset.hidden = !datasetVisibility.conPIAR;
          }
        });
        
        // Calcular nuevo máximo para la escala Y
        let maxValue = 0;
        if (datasetVisibility.sinPIAR) {
          maxValue = Math.max(maxValue, globalStatsData.sinPIAR.promedio, globalStatsData.sinPIAR.desviacion);
        }
        if (datasetVisibility.conPIAR) {
          maxValue = Math.max(maxValue, globalStatsData.conPIAR.promedio, globalStatsData.conPIAR.desviacion);
        }
        
        globalStatsChart.options.scales.y.suggestedMax = maxValue * 1.15;
        globalStatsChart.update('active');
      }
      
      // Inicializar gráfico
      window.addEventListener('DOMContentLoaded', () => {
        const ctx = document.getElementById('globalStatsChart');
        if (ctx) {
          globalStatsChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Promedio', 'Desviación Estándar'],
              datasets: [
                {
                  label: 'Sin PIAR',
                  data: [globalStatsData.sinPIAR.promedio, globalStatsData.sinPIAR.desviacion],
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  borderColor: 'rgba(34, 197, 94, 1)',
                  borderWidth: 2,
                  borderRadius: 8,
                  barThickness: 70,
                  hidden: false
                },
                {
                  label: 'Con PIAR',
                  data: [globalStatsData.conPIAR.promedio, globalStatsData.conPIAR.desviacion],
                  backgroundColor: 'rgba(107, 114, 128, 0.8)',
                  borderColor: 'rgba(107, 114, 128, 1)',
                  borderWidth: 2,
                  borderRadius: 8,
                  barThickness: 70,
                  hidden: true
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 750,
                easing: 'easeInOutQuart'
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    generateLabels: function(chart) {
                      const datasets = chart.data.datasets;
                      return datasets.map((dataset, i) => ({
                        text: dataset.label + ' (' + (i === 0 ? globalStatsData.sinPIAR.total : globalStatsData.conPIAR.total) + ' estudiantes)',
                        fillStyle: dataset.backgroundColor,
                        strokeStyle: dataset.borderColor,
                        lineWidth: 2,
                        hidden: dataset.hidden,
                        index: i
                      }));
                    }
                  },
                  onClick: function(e, legendItem, legend) {
                    const index = legendItem.index;
                    const datasetKey = index === 0 ? 'sinPIAR' : 'conPIAR';
                    toggleDataset(datasetKey);
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: {
                    size: 14,
                    weight: 'bold'
                  },
                  bodyFont: {
                    size: 13
                  },
                  callbacks: {
                    label: function(context) {
                      return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                    }
                  }
                },
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  offset: 4,
                  font: {
                    size: 13,
                    weight: 'bold'
                  },
                  color: function(context) {
                    return context.dataset.hidden ? 'transparent' : '#374151';
                  },
                  formatter: function(value, context) {
                    return context.dataset.hidden ? '' : value.toFixed(2);
                  },
                  clip: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                  },
                  ticks: {
                    font: {
                      size: 12
                    },
                    color: '#6B7280',
                    padding: 8
                  },
                  suggestedMax: Math.max(
                    globalStatsData.sinPIAR.promedio,
                    globalStatsData.sinPIAR.desviacion,
                    globalStatsData.conPIAR.promedio,
                    globalStatsData.conPIAR.desviacion
                  ) * 1.15
                },
                x: {
                  grid: {
                    display: false,
                    drawBorder: false
                  },
                  ticks: {
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    color: '#374151',
                    padding: 8
                  }
                }
              },
              layout: {
                padding: {
                  top: 35,
                  right: 20,
                  bottom: 10,
                  left: 10
                }
              },
              interaction: {
                mode: 'index',
                intersect: false
              }
            },
            plugins: [ChartDataLabels]
          });
          
          // Inicializar estilos de botones
          updateButtonStyles();
        }
      });
    </script>
  `;
};
