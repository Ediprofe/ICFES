/**
 * ✅ JavaScript para interactividad del HTML
 * Genera el código que se ejecutará en el navegador
 */

/**
 * Genera el script de interactividad completo
 */
export const generateInteractivityScript = () => {
  return `
    // Estado global
    let showPIAR = true;
    let charts = {};
    
    // Función para toggle PIAR
    function togglePIARComparison() {
      showPIAR = !showPIAR;
      updateAllCharts();
      
      // Actualizar texto del botón
      const btn = document.getElementById('togglePIAR');
      if (btn) {
        btn.textContent = showPIAR ? '🔄 Ocultar comparación PIAR' : '🔄 Mostrar comparación PIAR';
      }
    }
    
    // Función para crear gráfico de barras
    function createBarChart(canvasId, data, title, options = {}) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;
      
      const { showComparison = true, useDynamicScale = true } = options;
      
      const datasets = [];
      
      if (showComparison && showPIAR) {
        datasets.push({
          label: 'Con PIAR',
          data: data.map(d => d.conPIAR),
          backgroundColor: 'rgba(156, 163, 175, 0.8)',
          borderColor: 'rgba(107, 114, 128, 1)',
          borderWidth: 1
        });
      }
      
      datasets.push({
        label: 'Sin PIAR',
        data: data.map(d => d.sinPIAR),
        backgroundColor: data.map(d => d.color || 'rgba(37, 99, 235, 0.8)'),
        borderColor: data.map(d => d.color || 'rgba(37, 99, 235, 1)'),
        borderWidth: 1
      });
      
      // Calcular el valor máximo dinámicamente con margen del 20%
      let maxValue = 100; // Valor por defecto
      if (useDynamicScale) {
        const allValues = [];
        if (showComparison && showPIAR) {
          allValues.push(...data.map(d => d.conPIAR || 0));
        }
        allValues.push(...data.map(d => d.sinPIAR || 0));
        const dataMax = Math.max(...allValues);
        maxValue = Math.ceil(dataMax * 1.2); // 20% de margen superior
      }
      
      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.area || d.grado),
          datasets: datasets
        },
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1500,
            easing: 'easeInOutQuart',
            onComplete: function() {
              // Animación completada
            }
          },
          plugins: {
            title: {
              display: true,
              text: title,
              font: { size: 18, weight: 'bold' },
              color: '#1f2937',
              padding: { top: 10, bottom: 20 }
            },
            legend: {
              display: showComparison && showPIAR,
              position: 'top',
              labels: {
                font: { size: 13, weight: '600' },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            datalabels: {
              display: true,
              anchor: 'end',
              align: 'top',
              formatter: (value) => value ? value.toFixed(1) : '',
              font: {
                weight: 'bold',
                size: 12
              },
              color: '#1f2937',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 4,
              padding: { top: 2, bottom: 2, left: 6, right: 6 }
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
              max: maxValue,
              ticks: {
                callback: function(value) {
                  return value.toFixed(0);
                }
              }
            }
          }
        }
      });
    }
    
    // Función para crear gráfico de líneas
    function createLineChart(canvasId, series, title) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;
      
      const datasets = series.map(serie => ({
        label: serie.shortName || serie.area,
        data: serie.data.map(d => ({ x: d.year, y: d.value })),
        borderColor: serie.color || 'rgba(37, 99, 235, 1)',
        backgroundColor: serie.color || 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        fill: false
      }));
      
      return new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: title,
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            x: {
              type: 'linear',
              title: {
                display: true,
                text: 'Cohorte'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Puntaje'
              }
            }
          }
        }
      });
    }
    
    // Función para crear gráfico de barras para una sola asignatura
    function createSingleSubjectBarChart(canvasId, areaData, metricType) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;
      
      // Obtener grados
      const grados = areaData.data.map(d => d.grado);
      
      // Crear datasets
      const datasets = [];
      
      // Dataset Sin PIAR
      datasets.push({
        label: 'Sin PIAR',
        data: areaData.data.map(d => d.sinPIAR),
        backgroundColor: areaData.color + 'CC', // Opacidad CC para Sin PIAR
        borderColor: areaData.color,
        borderWidth: 2,
        borderRadius: 8,
        hidden: false
      });
      
      // Dataset Con PIAR (solo si showPIAR está activo)
      if (showPIAR) {
        datasets.push({
          label: 'Con PIAR',
          data: areaData.data.map(d => d.conPIAR),
          backgroundColor: areaData.color + '80', // Opacidad 80 para Con PIAR
          borderColor: areaData.color + 'AA',
          borderWidth: 2,
          borderRadius: 8,
          hidden: false
        });
      }
      
      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: grados,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: { size: 13, weight: 'bold' },
                padding: 15,
                usePointStyle: true
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
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
              font: { size: 12, weight: 'bold' },
              color: '#374151',
              formatter: function(value, context) {
                return value > 0 ? value.toFixed(1) : '';
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: {
                font: { size: 12 },
                color: '#6B7280',
                callback: function(value) {
                  return value.toFixed(0);
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
            padding: { top: 30, right: 10, bottom: 10, left: 10 }
          }
        },
        plugins: [ChartDataLabels]
      });
    }
    
    // Función para inicializar todos los gráficos
    function initCharts() {
      if (!analysisData || !analysisData.areaChartData) return;
      
      const { areaChartData, gradeChartData, gradeSubjectChartData } = analysisData;
      
      // Gráfico de promedios por área
      if (areaChartData && areaChartData.promedios) {
        charts.areaPromedios = createBarChart(
          'chartAreaPromedios',
          areaChartData.promedios,
          'Promedios por área académica',
          { showComparison: true, useDynamicScale: true }
        );
      }
      
      // Gráfico de desviación por área
      if (areaChartData && areaChartData.desviacion) {
        charts.areaDesviacion = createBarChart(
          'chartAreaDesviacion',
          areaChartData.desviacion,
          'Desviación estándar por área',
          { showComparison: true, useDynamicScale: true }
        );
      }
      
      // Gráfico de promedios por grado
      if (gradeChartData && gradeChartData.promedios) {
        charts.gradePromedios = createBarChart(
          'chartGradePromedios',
          gradeChartData.promedios,
          'Promedios globales por grado',
          { showComparison: true, useDynamicScale: true }
        );
      }
      
      // Gráfico de desviación estándar por grado
      if (gradeChartData && gradeChartData.desviacion) {
        charts.gradeDesviacion = createBarChart(
          'chartGradeDesviacion',
          gradeChartData.desviacion,
          'Desviación estándar por grado',
          { showComparison: true, useDynamicScale: true }
        );
      }
      
      // Gráficos por grado y asignatura (uno por cada asignatura)
      if (gradeSubjectChartData) {
        // Promedios por asignatura
        if (gradeSubjectChartData.promedios) {
          gradeSubjectChartData.promedios.forEach(areaData => {
            const canvasId = \`chartGradeSubjectPromedios\${areaData.areaId.toUpperCase()}\`;
            charts[\`gradeSubjectPromedios\${areaData.areaId}\`] = createSingleSubjectBarChart(
              canvasId,
              areaData,
              'promedios'
            );
          });
        }
        
        // Desviación estándar por asignatura
        if (gradeSubjectChartData.desviacion) {
          gradeSubjectChartData.desviacion.forEach(areaData => {
            const canvasId = \`chartGradeSubjectDesviacion\${areaData.areaId.toUpperCase()}\`;
            charts[\`gradeSubjectDesviacion\${areaData.areaId}\`] = createSingleSubjectBarChart(
              canvasId,
              areaData,
              'desviacion'
            );
          });
        }
      }
      
      // Gráfico comparativo multi-año (si existe)
      if (comparisonData && comparisonData.areas) {
        charts.comparison = createLineChart(
          'chartComparison',
          comparisonData.areas,
          'Evolución de Promedios por Área'
        );
      }
    }
    
    // Función para actualizar todos los gráficos
    function updateAllCharts() {
      // Destruir gráficos existentes
      Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
      });
      
      // Recrear gráficos
      charts = {};
      initCharts();
    }
    
    // Función para imprimir
    function printReport() {
      window.print();
    }
    
    // Función para filtrar tabla
    function filterTable(tableId, searchTerm) {
      const table = document.getElementById(tableId);
      if (!table) return;
      
      const rows = table.getElementsByTagName('tr');
      const term = searchTerm.toLowerCase();
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      }
    }
    
    // Función para ordenar tabla
    function sortTable(tableId, columnIndex, ascending = true) {
      const table = document.getElementById(tableId);
      if (!table) return;
      
      const tbody = table.getElementsByTagName('tbody')[0];
      const rows = Array.from(tbody.getElementsByTagName('tr'));
      
      rows.sort((a, b) => {
        const aVal = a.getElementsByTagName('td')[columnIndex].textContent;
        const bVal = b.getElementsByTagName('td')[columnIndex].textContent;
        
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return ascending ? aNum - bNum : bNum - aNum;
        }
        
        return ascending 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      });
      
      rows.forEach(row => tbody.appendChild(row));
    }
    
    // Función para exportar tabla a CSV
    function exportTableToCSV(tableId, filename) {
      const table = document.getElementById(tableId);
      if (!table) return;
      
      let csv = [];
      const rows = table.getElementsByTagName('tr');
      
      for (let row of rows) {
        let cols = row.querySelectorAll('td, th');
        let csvRow = [];
        for (let col of cols) {
          csvRow.push('"' + col.textContent.replace(/"/g, '""') + '"');
        }
        csv.push(csvRow.join(','));
      }
      
      const csvContent = csv.join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || 'tabla.csv';
      link.click();
    }
    
    // Inicializar al cargar
    window.addEventListener('DOMContentLoaded', () => {
      initCharts();
      
      // Agregar event listeners
      const toggleBtn = document.getElementById('togglePIAR');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePIARComparison);
      }
      
      const printBtn = document.getElementById('printBtn');
      if (printBtn) {
        printBtn.addEventListener('click', printReport);
      }
    });
  `;
};
