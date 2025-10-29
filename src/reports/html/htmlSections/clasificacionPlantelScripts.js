/**
 * ✅ Scripts JavaScript: Clasificación de Plantel
 * Funciones de visualización y actualización dinámica
 */

/**
 * Genera el script completo de JavaScript para la sección
 */
export function generateClasificacionScripts() {
  return `
    <script>
      // Variables globales para los gráficos
      let clasificacionGlobalChart = null;
      let clasificacionAreasChart = null;
      
      /**
       * Función principal de actualización
       */
      function updateClasificacionComparison() {
        const groupACheckboxes = Array.from(document.querySelectorAll('.clasificacion-group-a:checked'));
        const groupBCheckboxes = Array.from(document.querySelectorAll('.clasificacion-group-b:checked'));
        const groupAYears = groupACheckboxes.map(cb => parseInt(cb.value));
        const groupBYears = groupBCheckboxes.map(cb => parseInt(cb.value));
        const resultsDiv = document.getElementById('clasificacionResults');
        
        // Validar que ambos grupos tengan al menos un año
        if (groupAYears.length === 0 || groupBYears.length === 0) {
          resultsDiv.innerHTML = \`
            <div class="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <p class="text-gray-600">
                <span class="text-4xl mb-3 block">🎯</span>
                <span class="text-lg font-semibold">Selecciona años en ambos grupos para ver la comparación</span>
              </p>
            </div>
          \`;
          return;
        }
        
        // Calcular índices para ambos grupos
        const groupAData = calculateGroupIndices(clasificacionAnalyses, groupAYears);
        const groupBData = calculateGroupIndices(clasificacionAnalyses, groupBYears);
        
        if (!groupAData || !groupBData) {
          resultsDiv.innerHTML = \`
            <div class="p-6 bg-red-50 rounded-lg border-2 border-red-200 text-center">
              <p class="text-red-600">
                <span class="text-3xl mb-2 block">⚠️</span>
                No hay suficientes datos para calcular los índices
              </p>
            </div>
          \`;
          return;
        }
        
        // Generar HTML de resultados
        resultsDiv.innerHTML = generateComparisonHTML(groupAData, groupBData, groupAYears, groupBYears);
        
        // Crear gráficos
        createClasificacionCharts(groupAData, groupBData);
      }
      
      /**
       * Genera el HTML de comparación entre grupos
       */
      function generateComparisonHTML(groupAData, groupBData, groupAYears, groupBYears) {
        const difGlobalIndex = groupBData.globalIndex - groupAData.globalIndex;
        const difPercent = ((difGlobalIndex / groupAData.globalIndex) * 100);
        
        return \`
          <!-- Tarjetas de resumen de grupos -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            \${generateGroupCard(groupAData, groupAYears, 'A', 'emerald')}
            \${generateGroupCard(groupBData, groupBYears, 'B', 'teal')}
          </div>
          
          <!-- Análisis comparativo -->
          \${generateAnalysisSection(groupAData, groupBData, difGlobalIndex, difPercent)}
          
          <!-- Tabla de índices por área -->
          \${generateAreaIndicesTable(groupAData, groupBData)}
          
          <!-- Gráficos -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h4 class="text-center font-bold text-gray-800 mb-4">Comparación de índice global</h4>
              <canvas id="clasificacionGlobalChart"></canvas>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h4 class="text-center font-bold text-gray-800 mb-4">Índices por área académica</h4>
              <canvas id="clasificacionAreasChart"></canvas>
            </div>
          </div>
        \`;
      }
      
      /**
       * Genera la tarjeta de un grupo
       */
      function generateGroupCard(data, years, label, color) {
        return \`
          <div class="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-\${color}-300">
            <div class="bg-\${color}-600 px-6 py-4">
              <div class="flex items-center gap-2">
                <span class="bg-white text-\${color}-600 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">\${label}</span>
                <div>
                  <h4 class="text-xl font-bold text-white">Grupo \${label}</h4>
                  <p class="text-\${color}-100 text-sm">Cohortes: \${years.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <!-- Clasificación -->
              <div class="text-center mb-6 p-6 rounded-lg" style="background-color: \${data.classification.bgColor}; border: 3px solid \${data.classification.color};">
                <p class="text-sm font-semibold text-gray-600 mb-2">CLASIFICACIÓN</p>
                <p class="text-6xl font-extrabold mb-2" style="color: \${data.classification.color};">\${data.classification.categoria}</p>
                <p class="text-lg font-semibold" style="color: \${data.classification.color};">\${data.classification.descripcion}</p>
              </div>
              
              <!-- Índice global -->
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <p class="text-sm font-semibold text-gray-600 mb-1">Índice global</p>
                <p class="text-3xl font-extrabold text-\${color}-600">\${data.globalIndex.toFixed(4)}</p>
              </div>
              
              <!-- Estudiantes -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm font-semibold text-gray-600 mb-1">Estudiantes sin PIAR</p>
                <p class="text-2xl font-bold text-gray-800">\${data.totalStudents}</p>
              </div>
            </div>
          </div>
        \`;
      }
      
      /**
       * Genera la sección de análisis comparativo
       */
      function generateAnalysisSection(groupAData, groupBData, difGlobalIndex, difPercent) {
        const categoriaComparison = groupAData.classification.categoria === groupBData.classification.categoria ? 
          'Sin cambio de categoría' : 
          groupBData.classification.categoria > groupAData.classification.categoria ? 
            '⬆️ Mejoró de categoría' : 
            '⬇️ Bajó de categoría';
        
        return \`
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
            <h4 class="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <span class="text-2xl">📊</span>
              <span>ANÁLISIS COMPARATIVO</span>
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Diferencia en índice global -->
              <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 \${difGlobalIndex >= 0 ? 'border-green-500' : 'border-red-500'}">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">\${difGlobalIndex >= 0 ? '📈' : '📉'}</span>
                  <p class="text-sm font-bold text-gray-700">Diferencia en índice global</p>
                </div>
                <p class="text-3xl font-extrabold \${difGlobalIndex >= 0 ? 'text-green-600' : 'text-red-600'}">
                  \${difGlobalIndex > 0 ? '+' : ''}\${difGlobalIndex.toFixed(4)}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  \${Math.abs(difPercent).toFixed(2)}% \${difGlobalIndex >= 0 ? 'mayor' : 'menor'}
                </p>
              </div>
              
              <!-- Cambio de clasificación -->
              <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">🏆</span>
                  <p class="text-sm font-bold text-gray-700">Cambio de clasificación</p>
                </div>
                <p class="text-2xl font-extrabold text-purple-600">
                  \${groupAData.classification.categoria} → \${groupBData.classification.categoria}
                </p>
                <p class="text-xs text-gray-600 mt-1">\${categoriaComparison}</p>
              </div>
            </div>
            
            <!-- Interpretación -->
            <div class="mt-4 p-4 bg-white rounded-lg border border-purple-200">
              <p class="text-sm text-gray-800 leading-relaxed">
                <strong class="text-purple-900">📝 Interpretación:</strong>
                El <strong>Grupo B</strong> obtuvo un índice global de <strong>\${groupBData.globalIndex.toFixed(4)}</strong>
                (\${difGlobalIndex >= 0 ? 'superior' : 'inferior'} al Grupo A por \${Math.abs(difGlobalIndex).toFixed(4)} puntos).
                La clasificación cambió de <strong>\${groupAData.classification.categoria}</strong> a <strong>\${groupBData.classification.categoria}</strong>.
              </p>
            </div>
          </div>
        \`;
      }
      
      /**
       * Genera la tabla de índices por área
       */
      function generateAreaIndicesTable(groupAData, groupBData) {
        let html = \`
          <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h3 class="text-xl font-bold text-white">📚 Índices por área académica</h3>
              <p class="text-indigo-100 text-sm mt-1">Comparación detallada de índices calculados para cada área</p>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-bold text-white">Área</th>
                    <th class="px-6 py-3 text-center text-sm font-bold text-white">Grupo A</th>
                    <th class="px-6 py-3 text-center text-sm font-bold text-white">Grupo B</th>
                    <th class="px-6 py-3 text-center text-sm font-bold text-white">Diferencia</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
        \`;
        
        groupAData.areaIndices.forEach((areaA, index) => {
          const areaB = groupBData.areaIndices.find(a => a.areaName === areaA.areaName);
          const dif = areaB ? areaB.indice - areaA.indice : 0;
          const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
          
          html += \`
            <tr class="\${rowBg} hover:bg-indigo-50 transition-colors">
              <td class="px-6 py-4 font-bold" style="color: \${areaA.color}">\${areaA.areaName}</td>
              <td class="px-6 py-4 text-center font-semibold text-emerald-600">\${areaA.indice.toFixed(4)}</td>
              <td class="px-6 py-4 text-center font-semibold text-teal-600">\${areaB ? areaB.indice.toFixed(4) : 'N/A'}</td>
              <td class="px-6 py-4 text-center font-bold \${dif >= 0 ? 'text-green-600' : 'text-red-600'}">
                \${dif > 0 ? '+' : ''}\${dif.toFixed(4)}
              </td>
            </tr>
          \`;
        });
        
        html += \`
                </tbody>
              </table>
            </div>
          </div>
        \`;
        
        return html;
      }
      
      /**
       * Crea los gráficos de comparación
       */
      function createClasificacionCharts(groupAData, groupBData) {
        // Destruir gráficos anteriores si existen
        if (clasificacionGlobalChart) {
          clasificacionGlobalChart.destroy();
        }
        if (clasificacionAreasChart) {
          clasificacionAreasChart.destroy();
        }
        
        // Gráfico de índice global
        const ctxGlobal = document.getElementById('clasificacionGlobalChart');
        if (ctxGlobal) {
          clasificacionGlobalChart = new Chart(ctxGlobal, {
            type: 'bar',
            data: {
              labels: ['Grupo A', 'Grupo B'],
              datasets: [{
                label: 'Índice Global',
                data: [groupAData.globalIndex, groupBData.globalIndex],
                backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)'],
                borderColor: ['rgba(34, 197, 94, 1)', 'rgba(59, 130, 246, 1)'],
                borderWidth: 2
              }]
            },
            plugins: [ChartDataLabels],
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { display: false },
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  formatter: (value) => value.toFixed(4),
                  font: { weight: 'bold', size: 14 },
                  color: '#1f2937'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: 0,
                  max: 1,
                  title: {
                    display: true,
                    text: 'Índice Global',
                    font: { size: 12, weight: 'bold' }
                  },
                  ticks: {
                    callback: function(value) {
                      return value.toFixed(2);
                    }
                  }
                }
              }
            }
          });
        }
        
        // Gráfico radar de áreas
        const ctxAreas = document.getElementById('clasificacionAreasChart');
        if (ctxAreas) {
          const areaLabels = groupAData.areaIndices.map(a => a.areaName);
          
          clasificacionAreasChart = new Chart(ctxAreas, {
            type: 'radar',
            data: {
              labels: areaLabels,
              datasets: [
                {
                  label: 'Grupo A',
                  data: groupAData.areaIndices.map(a => a.indice),
                  borderColor: 'rgba(34, 197, 94, 1)',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  borderWidth: 3,
                  pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(34, 197, 94, 1)',
                  pointRadius: 5,
                  pointHoverRadius: 7
                },
                {
                  label: 'Grupo B',
                  data: groupBData.areaIndices.map(a => a.indice),
                  borderColor: 'rgba(59, 130, 246, 1)',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderWidth: 3,
                  pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
                  pointRadius: 5,
                  pointHoverRadius: 7
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    font: { size: 12, weight: 'bold' }
                  }
                }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  min: 0,
                  max: 1,
                  ticks: {
                    stepSize: 0.1,
                    callback: function(value) {
                      return value.toFixed(1);
                    }
                  }
                }
              }
            }
          });
        }
      }
    </script>
  `;
}
