/**
 * ✅ Sección HTML: Análisis de Percentiles y Niveles de Desempeño
 * Gráficos de barras para promedios de percentiles y diagramas circulares para niveles
 */

import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';

/**
 * Calcula el promedio de percentiles por área académica
 */
const calculatePercentileAverages = (data, excludePIAR = false) => {
  const filteredData = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;

  const percentileColumns = {
    'Lectura crítica': '% LC',
    'Matemáticas': '% MAT',
    'Sociales': '% SOC',
    'Naturales': '% NAT',
    'Inglés': '% ING'
  };

  const averages = {};
  const stdDevs = {};

  for (const [area, column] of Object.entries(percentileColumns)) {
    const values = filteredData
      .map(s => s[column])
      .filter(v => v !== null && v !== undefined && !isNaN(v) && v !== '');

    if (values.length > 0) {
      const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
      const avg = sum / values.length;
      averages[area] = avg;

      // Calcular desviación estándar
      const variance = values.reduce((acc, val) => {
        return acc + Math.pow(parseFloat(val) - avg, 2);
      }, 0) / values.length;
      stdDevs[area] = Math.sqrt(variance);
    } else {
      averages[area] = 0;
      stdDevs[area] = 0;
    }
  }

  return { averages, stdDevs };
};

/**
 * Calcula la distribución de niveles de desempeño por área
 */
const calculatePerformanceLevels = (data, excludePIAR = false) => {
  const filteredData = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;

  const levelColumns = {
    'Lectura crítica': 'Nivel LC',
    'Matemáticas': 'Nivel MAT',
    'Sociales': 'Nivel SOC',
    'Naturales': 'Nivel NAT',
    'Inglés': 'Nivel ING'
  };

  const levelDistribution = {};

  for (const [area, column] of Object.entries(levelColumns)) {
    const levels = filteredData
      .map(s => s[column])
      .filter(v => v !== null && v !== undefined && v !== '');

    const distribution = {};
    levels.forEach(level => {
      const levelStr = String(level);
      distribution[levelStr] = (distribution[levelStr] || 0) + 1;
    });

    // Convertir a porcentajes
    const total = levels.length;
    const percentages = {};
    Object.keys(distribution).forEach(level => {
      percentages[level] = total > 0 ? (distribution[level] / total) * 100 : 0;
    });

    levelDistribution[area] = {
      counts: distribution,
      percentages: percentages,
      total: total
    };
  }

  return levelDistribution;
};

/**
 * Genera la sección de análisis de percentiles y niveles
 */
export const generatePercentileAnalysisSection = (analysis, sectionNumber) => {
  const data = analysis.processedData;
  
  // Calcular métricas con y sin PIAR
  const metricsSinPIAR = calculatePercentileAverages(data, true);
  const metricsConPIAR = calculatePercentileAverages(data, false);
  
  const levelsSinPIAR = calculatePerformanceLevels(data, true);
  const levelsConPIAR = calculatePerformanceLevels(data, false);

  // Obtener áreas disponibles
  const availableAreas = ACADEMIC_AREAS.filter(area => {
    const hasData = data.some(s => {
      const percentileCol = area.columnName === 'Lectura crítica' ? '% LC' :
                           area.columnName === 'Matemáticas' ? '% MAT' :
                           area.columnName === 'Sociales' ? '% SOC' :
                           area.columnName === 'Naturales' ? '% NAT' :
                           '% ING';
      return s[percentileCol] !== null && s[percentileCol] !== undefined && s[percentileCol] !== '';
    });
    return hasData;
  });

  return `
    <div class="mt-8 mb-8">
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-4 mb-6">
        <h2 class="text-2xl font-bold">${sectionNumber}. 📊 Percentiles y niveles de desempeño</h2>
        <p class="text-purple-100 text-sm mt-1">Promedios de percentiles y distribución de niveles por área académica</p>
      </div>
      
      <!-- Controles de visualización -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center gap-4 flex-wrap">
          <span class="text-sm font-semibold text-gray-700">Mostrar:</span>
          <button 
            id="btnPercentileSinPIAR" 
            onclick="togglePercentileDataset('sinPIAR')"
            class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700"
          >
            Sin PIAR
          </button>
          <button 
            id="btnPercentileConPIAR" 
            onclick="togglePercentileDataset('conPIAR')"
            class="px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400"
          >
            Con PIAR
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-3 italic">
          Haz clic en los botones para mostrar/ocultar cada conjunto de datos.
        </p>
      </div>
      
      <!-- Gráfico de barras: Promedio de Percentiles -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h4 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
          Promedio de percentiles por área académica
        </h4>
        <div style="height: 450px; position: relative;">
          <canvas id="percentileAverageChart"></canvas>
        </div>
      </div>

      <!-- Gráficos circulares: Niveles de Desempeño -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h4 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
          Niveles de desempeño por área académica
        </h4>
        
        <!-- Toggle para niveles de desempeño -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6 border-2 border-purple-200">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-sm font-semibold text-gray-700">Mostrar datos:</span>
            <button 
              id="btnLevelSinPIAR" 
              onclick="toggleLevelDataset('sinPIAR')"
              class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700"
            >
              Sin PIAR
            </button>
            <button 
              id="btnLevelConPIAR" 
              onclick="toggleLevelDataset('conPIAR')"
              class="px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400"
            >
              Con PIAR
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2 italic">
            Selecciona qué conjunto de datos visualizar en los gráficos circulares.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${availableAreas.map((area, index) => `
            <div class="bg-gray-50 rounded-lg p-4">
              <h5 class="font-bold text-gray-800 text-center mb-3 flex items-center justify-center gap-2">
                <span class="text-2xl">${area.icon}</span>
                ${area.shortName}
              </h5>
              <div style="height: 250px; position: relative;">
                <canvas id="levelChart${index}"></canvas>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <script>
      // Datos de percentiles
      const percentileData = {
        sinPIAR: {
          averages: ${JSON.stringify(metricsSinPIAR.averages)},
          stdDevs: ${JSON.stringify(metricsSinPIAR.stdDevs)}
        },
        conPIAR: {
          averages: ${JSON.stringify(metricsConPIAR.averages)},
          stdDevs: ${JSON.stringify(metricsConPIAR.stdDevs)}
        }
      };

      // Datos de niveles
      const levelData = {
        sinPIAR: ${JSON.stringify(levelsSinPIAR)},
        conPIAR: ${JSON.stringify(levelsConPIAR)}
      };

      // Configuración de áreas
      const areas = ${JSON.stringify(availableAreas.map(a => ({
        id: a.id,
        name: a.columnName,
        shortName: a.shortName,
        color: a.color,
        icon: a.icon
      })))};

      // Estado de visibilidad
      let percentileVisibility = {
        sinPIAR: true,
        conPIAR: false
      };

      let levelVisibility = {
        sinPIAR: true,
        conPIAR: false
      };

      let percentileChart = null;
      let levelCharts = [];

      function togglePercentileDataset(dataset) {
        percentileVisibility[dataset] = !percentileVisibility[dataset];
        updatePercentileButtonStyles();
        updatePercentileChart();
      }

      function toggleLevelDataset(dataset) {
        // Solo permitir uno activo a la vez
        levelVisibility.sinPIAR = dataset === 'sinPIAR';
        levelVisibility.conPIAR = dataset === 'conPIAR';
        updateLevelButtonStyles();
        updateLevelCharts();
      }

      function updatePercentileButtonStyles() {
        const btnSinPIAR = document.getElementById('btnPercentileSinPIAR');
        const btnConPIAR = document.getElementById('btnPercentileConPIAR');
        
        if (percentileVisibility.sinPIAR) {
          btnSinPIAR.className = 'px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700';
        } else {
          btnSinPIAR.className = 'px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400';
        }
        
        if (percentileVisibility.conPIAR) {
          btnConPIAR.className = 'px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-700';
        } else {
          btnConPIAR.className = 'px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400';
        }
      }

      function updateLevelButtonStyles() {
        const btnLevelSinPIAR = document.getElementById('btnLevelSinPIAR');
        const btnLevelConPIAR = document.getElementById('btnLevelConPIAR');
        
        if (levelVisibility.sinPIAR) {
          btnLevelSinPIAR.className = 'px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700';
        } else {
          btnLevelSinPIAR.className = 'px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400';
        }
        
        if (levelVisibility.conPIAR) {
          btnLevelConPIAR.className = 'px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-700';
        } else {
          btnLevelConPIAR.className = 'px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-gray-400';
        }
      }

      function updatePercentileChart() {
        if (!percentileChart) return;
        
        percentileChart.data.datasets.forEach((dataset, index) => {
          if (index === 0) {
            dataset.hidden = !percentileVisibility.sinPIAR;
          } else if (index === 1) {
            dataset.hidden = !percentileVisibility.conPIAR;
          }
        });
        
        percentileChart.update('active');
      }

      function updateLevelCharts() {
        levelCharts.forEach((chart, index) => {
          if (!chart) return;
          
          const area = areas[index];
          const dataToShow = levelVisibility.sinPIAR 
            ? levelData.sinPIAR[area.name]
            : levelData.conPIAR[area.name];

          // Ordenar niveles correctamente
          const levels = Object.keys(dataToShow.percentages).sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }
            return a.localeCompare(b);
          });
          
          const percentages = levels.map(level => dataToShow.percentages[level]);
          
          // Recalcular colores para los niveles actuales
          const getColorForLevel = (level, areaId) => {
            const levelStr = String(level);
            if (areaId === 'ingles') {
              const englishLevelColors = {
                'A-': '#ef4444', 'A+': '#ef4444', 'A1': '#f97316', 'A2': '#eab308',
                'B+': '#84cc16', 'B1': '#22c55e', 'B2': '#10b981'
              };
              return englishLevelColors[levelStr] || '#6b7280';
            } else {
              const standardLevelColors = {
                '1': '#ef4444', '2': '#f97316', '3': '#eab308', '4': '#22c55e'
              };
              return standardLevelColors[levelStr] || '#6b7280';
            }
          };
          
          const colors = levels.map(level => getColorForLevel(level, area.id));

          chart.data.labels = levels.map(l => \`Nivel \${l}\`);
          chart.data.datasets[0].data = percentages;
          chart.data.datasets[0].backgroundColor = colors;
          chart.update('active');
        });
      }

      // Inicializar gráficos
      window.addEventListener('DOMContentLoaded', () => {
        // Gráfico de barras de percentiles
        const ctxPercentile = document.getElementById('percentileAverageChart');
        if (ctxPercentile) {
          const areaNames = areas.map(a => a.shortName);
          const colors = areas.map(a => a.color);

          percentileChart = new Chart(ctxPercentile, {
            type: 'bar',
            data: {
              labels: areaNames,
              datasets: [
                {
                  label: 'Sin PIAR',
                  data: areas.map(a => percentileData.sinPIAR.averages[a.name] || 0),
                  backgroundColor: colors.map(c => c + 'CC'),
                  borderColor: colors,
                  borderWidth: 2,
                  borderRadius: 8,
                  hidden: false
                },
                {
                  label: 'Con PIAR',
                  data: areas.map(a => percentileData.conPIAR.averages[a.name] || 0),
                  backgroundColor: colors.map(c => c + '80'),
                  borderColor: colors.map(c => c + 'AA'),
                  borderWidth: 2,
                  borderRadius: 8,
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
                    font: { size: 14, weight: 'bold' },
                    padding: 20,
                    usePointStyle: true
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  callbacks: {
                    label: function(context) {
                      return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                    }
                  }
                },
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  offset: 4,
                  font: { size: 12, weight: 'bold' },
                  color: '#374151',
                  formatter: function(value, context) {
                    return context.dataset.hidden ? '' : value.toFixed(1) + '%';
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: { color: 'rgba(0, 0, 0, 0.05)' },
                  ticks: {
                    font: { size: 12 },
                    color: '#6B7280',
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    font: { size: 13, weight: 'bold' },
                    color: '#374151'
                  }
                }
              },
              layout: {
                padding: { top: 35, right: 20, bottom: 10, left: 10 }
              }
            },
            plugins: [ChartDataLabels]
          });
        }

        // Gráficos circulares de niveles
        areas.forEach((area, index) => {
          const ctx = document.getElementById(\`levelChart\${index}\`);
          if (ctx) {
            const dataToShow = levelData.sinPIAR[area.name];
            
            // Ordenar niveles correctamente (numérico para 1,2,3,4 o alfabético para A+, A1, etc.)
            const levels = Object.keys(dataToShow.percentages).sort((a, b) => {
              // Intentar convertir a número
              const numA = parseFloat(a);
              const numB = parseFloat(b);
              
              // Si ambos son números, ordenar numéricamente
              if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
              }
              
              // Si no son números, ordenar alfabéticamente
              return a.localeCompare(b);
            });
            
            // Mapear niveles a sus colores correspondientes
            const getColorForLevel = (level, areaId) => {
              // Convertir level a string para asegurar coincidencia
              const levelStr = String(level);
              
              if (areaId === 'ingles') {
                // Para Inglés: mapeo específico por nombre de nivel
                const englishLevelColors = {
                  'A-': '#ef4444',  // rojo - Nivel más bajo
                  'A+': '#ef4444',  // rojo
                  'A1': '#f97316',  // naranja
                  'A2': '#eab308',  // amarillo
                  'B+': '#84cc16',  // lima
                  'B1': '#22c55e',  // verde
                  'B2': '#10b981'   // verde esmeralda
                };
                return englishLevelColors[levelStr] || '#6b7280'; // gris por defecto
              } else {
                // Para otras áreas: mapeo por número de nivel (1, 2, 3, 4)
                const standardLevelColors = {
                  '1': '#ef4444',  // rojo - Nivel 1
                  '2': '#f97316',  // naranja - Nivel 2
                  '3': '#eab308',  // amarillo - Nivel 3
                  '4': '#22c55e'   // verde - Nivel 4
                };
                return standardLevelColors[levelStr] || '#6b7280'; // gris por defecto
              }
            };
            
            const percentages = levels.map(level => dataToShow.percentages[level]);
            const colors = levels.map(level => getColorForLevel(level, area.id));

            const chart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: levels.map(l => \`Nivel \${l}\`),
                datasets: [{
                  data: percentages,
                  backgroundColor: colors,
                  borderColor: '#ffffff',
                  borderWidth: 2
                }]
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
                    position: 'bottom',
                    labels: {
                      font: { size: 11 },
                      padding: 10,
                      usePointStyle: true
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 10,
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const count = dataToShow.counts[levels[context.dataIndex]];
                        return \`\${label}: \${value.toFixed(1)}% (\${count} estudiantes)\`;
                      }
                    }
                  },
                  datalabels: {
                    color: '#ffffff',
                    font: { size: 13, weight: 'bold' },
                    formatter: function(value, context) {
                      return value > 5 ? value.toFixed(1) + '%' : '';
                    }
                  }
                },
                cutout: '50%'
              },
              plugins: [ChartDataLabels]
            });

            levelCharts.push(chart);
          }
        });

        // Inicializar estilos
        updatePercentileButtonStyles();
        updateLevelButtonStyles();
      });
    </script>
  `;
};
