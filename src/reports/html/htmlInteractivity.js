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
        btn.textContent = showPIAR ? '🔄 Ocultar Comparación PIAR' : '🔄 Mostrar Comparación PIAR';
      }
    }
    
    // Función para crear gráfico de barras
    function createBarChart(canvasId, data, title, options = {}) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;
      
      const { maxValue = 100, showComparison = true } = options;
      
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
      
      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.area || d.grado),
          datasets: datasets
        },
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
              display: showComparison && showPIAR,
              position: 'top'
            },
            datalabels: {
              display: true,
              anchor: 'end',
              align: 'top',
              formatter: (value) => value ? value.toFixed(1) : '',
              font: {
                weight: 'bold',
                size: 11
              },
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
                text: 'Año'
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
    
    // Función para inicializar todos los gráficos
    function initCharts() {
      if (!analysisData || !analysisData.areaChartData) return;
      
      const { areaChartData, gradeChartData } = analysisData;
      
      // Gráfico de promedios por área
      if (areaChartData && areaChartData.promedios) {
        charts.areaPromedios = createBarChart(
          'chartAreaPromedios',
          areaChartData.promedios,
          'Promedios por Área Académica',
          { maxValue: 100, showComparison: true }
        );
      }
      
      // Gráfico de desviación por área
      if (areaChartData && areaChartData.desviacion) {
        charts.areaDesviacion = createBarChart(
          'chartAreaDesviacion',
          areaChartData.desviacion,
          'Desviación Estándar por Área',
          { maxValue: 30, showComparison: true }
        );
      }
      
      // Gráfico de promedios por grado
      if (gradeChartData && gradeChartData.promedios) {
        charts.gradePromedios = createBarChart(
          'chartGradePromedios',
          gradeChartData.promedios,
          'Promedios Globales por Grado',
          { maxValue: 500, showComparison: true }
        );
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
