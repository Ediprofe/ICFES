/**
 * ✅ Core HTML - Estructura base del documento HTML
 */

import { BRANDING, COLORS } from '../../config/visualConfig.js';

/**
 * Genera la estructura HTML base
 */
export const generateHTMLTemplate = (title, year, isMultiYear = false) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Análisis de resultados ICFES ${year}">
  <title>${title}</title>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <!-- Chart.js Datalabels Plugin -->
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    @media print {
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    
    .chart-container {
      position: relative;
      height: 300px;
      margin: 20px 0;
    }
    
    .metric-card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }
    
    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .section-header {
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      margin: 24px 0 16px 0;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      background-color: ${COLORS.primary};
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    tr:hover {
      background-color: #f9fafb;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .badge-success {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
    }
    
    .badge-info {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    /* Botón flotante de exportar PDF */
    .export-pdf-button {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 1000;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 50px;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
      cursor: pointer;
      border: none;
      font-weight: 700;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
    }
    
    .export-pdf-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(59, 130, 246, 0.6);
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    }
    
    .export-pdf-button:active {
      transform: translateY(-1px);
    }
    
    @media print {
      .export-pdf-button { display: none !important; }
    }
  </style>
</head>
<body class="bg-gray-50">
  <!-- Botón flotante de exportar a PDF -->
  <button class="export-pdf-button no-print" onclick="exportToPDF()">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
    <span>Exportar a PDF</span>
  </button>
  
  <div id="app" class="max-w-7xl mx-auto p-6">
    <!-- CONTENIDO SE INYECTA AQUÍ -->
  </div>
  
  <!-- Footer -->
  <footer class="bg-white border-t border-gray-200 mt-12 py-8">
    <div class="max-w-7xl mx-auto px-6 text-center">
      <p class="text-sm text-gray-600 mb-2">Desarrollado por</p>
      <a href="${BRANDING.url}" target="_blank" class="text-2xl font-bold text-blue-600 hover:text-blue-700">
        ${BRANDING.name}
      </a>
      <div class="mt-4 flex justify-center gap-6 text-sm text-gray-500">
        <a href="${BRANDING.social.youtube}" target="_blank" class="hover:text-blue-600">
          YouTube: @ProfeEdi
        </a>
        <a href="${BRANDING.social.tiktok}" target="_blank" class="hover:text-blue-600">
          TikTok: @ediprofe
        </a>
        <a href="${BRANDING.social.web}" target="_blank" class="hover:text-blue-600">
          Web: ediprofe.com
        </a>
      </div>
      <p class="mt-4 text-xs text-gray-400">
        Generado el ${new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>
  </footer>
  
  <script>
    // DATOS EMBEBIDOS COMO JSON
    const analysisData = {DATA_PLACEHOLDER};
    const comparisonData = {COMPARISON_PLACEHOLDER};
    
    // FUNCIÓN PARA EXPORTAR A PDF
    function exportToPDF() {
      // Usar la función de impresión del navegador que permite guardar como PDF
      window.print();
    }
    
    // FUNCIONES DE INTERACTIVIDAD
    {INTERACTIVITY_SCRIPT}
  </script>
</body>
</html>`;
};

/**
 * Genera el header de una sección
 */
export const generateSectionHeader = (title, sectionNumber, icon = '📊') => {
  return `
    <div class="section-header">
      <h2 class="text-2xl font-bold">
        ${icon} ${sectionNumber}. ${title}
      </h2>
    </div>
  `;
};

/**
 * Genera un card de métrica
 */
export const generateMetricCard = (title, value, icon = '📊', color = 'blue') => {
  const colorClasses = {
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    red: 'border-red-500 text-red-600',
    orange: 'border-orange-500 text-orange-600',
    purple: 'border-purple-500 text-purple-600'
  };
  
  return `
    <div class="metric-card border-l-4 ${colorClasses[color] || colorClasses.blue}">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">${title}</p>
          <p class="text-3xl font-bold ${colorClasses[color] || colorClasses.blue}">${value}</p>
        </div>
        <div class="text-4xl opacity-20">${icon}</div>
      </div>
    </div>
  `;
};

/**
 * Genera una tabla HTML
 */
export const generateTable = (columns, rows, options = {}) => {
  const { striped = true, hover = true, bordered = false } = options;
  
  const tableClasses = [
    'w-full',
    striped ? 'divide-y divide-gray-200' : '',
    bordered ? 'border border-gray-300' : ''
  ].filter(Boolean).join(' ');
  
  const columnsHTML = columns.map(col => `<th class="px-4 py-3 text-left">${col}</th>`).join('');
  
  const rowsHTML = rows.map((row, index) => {
    const rowClass = striped && index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
    const cells = row.map(cell => `<td class="px-4 py-2">${cell}</td>`).join('');
    return `<tr class="${rowClass} ${hover ? 'hover:bg-gray-100' : ''}">${cells}</tr>`;
  }).join('');
  
  return `
    <div class="table-responsive bg-white rounded-lg shadow overflow-hidden">
      <table class="${tableClasses}">
        <thead>
          <tr>${columnsHTML}</tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Genera un contenedor para gráfico
 */
export const generateChartContainer = (chartId, title = '') => {
  return `
    <div class="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      ${title ? `<h4 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">${title}</h4>` : ''}
      <div style="height: 380px; position: relative;">
        <canvas id="${chartId}"></canvas>
      </div>
    </div>
  `;
};

/**
 * Genera un badge/etiqueta
 */
export const generateBadge = (text, type = 'info') => {
  const types = {
    success: 'badge-success',
    warning: 'badge-warning',
    info: 'badge-info',
    error: 'bg-red-100 text-red-800'
  };
  
  return `<span class="badge ${types[type] || types.info}">${text}</span>`;
};

/**
 * Genera un botón de toggle
 */
export const generateToggleButton = (id, text, icon = '🔄') => {
  return `
    <button 
      id="${id}"
      class="no-print px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
    >
      <span>${icon}</span>
      <span>${text}</span>
    </button>
  `;
};
