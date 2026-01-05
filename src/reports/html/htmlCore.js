/**
 * ✅ Core HTML - Estructura base del documento HTML
 */

import { BRANDING, COLORS } from '../../config/visualConfig.js';

/**
 * Genera la estructura HTML base
 * @param {string} title - Título del documento
 * @param {string} year - Año del análisis
 * @param {boolean} isMultiYear - Indica si es un análisis multi-año (disponible para uso futuro)
 */
export const generateHTMLTemplate = (title, year) => {
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
    /* ========================================
       ESTILOS PARA IMPRESIÓN Y EXPORTACIÓN PDF
       ======================================== */
    @media print {
      /* Configuración de página - HORIZONTAL para presentaciones */
      @page {
        size: A4 landscape;
        margin: 1cm 1.5cm;
      }
      
      /* Ocultar elementos no imprimibles */
      .no-print { display: none !important; }
      
      /* Control de saltos de página */
      .page-break { 
        page-break-before: always; 
        break-before: always;
      }
      
      .page-break-after { 
        page-break-after: always; 
        break-after: always;
      }
      
      .avoid-break { 
        page-break-inside: avoid; 
        break-inside: avoid;
      }
      
      /* Evitar que elementos importantes se corten */
      .bg-white, .rounded-lg, .shadow-lg, .shadow-md {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* Tablas */
      table { 
        page-break-inside: auto;
        break-inside: auto;
      }
      
      tr { 
        page-break-inside: avoid; 
        page-break-after: auto;
        break-inside: avoid;
        break-after: auto;
      }
      
      thead { 
        display: table-header-group;
      }
      
      tfoot { 
        display: table-footer-group;
      }
      
      /* Gráficos */
      canvas {
        max-width: 100% !important;
        height: auto !important;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .chart-container {
        page-break-inside: avoid;
        break-inside: avoid;
        margin: 10px 0;
      }
      
      /* Marca de agua */
      body::before {
        content: "ICFES Analyzer";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 100px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.03);
        z-index: 9999;
        pointer-events: none;
        white-space: nowrap;
        letter-spacing: 0.1em;
      }
      
      /* Preservar colores de fondo */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      /* Header simplificado */
      header {
        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;
        padding: 15px !important;
        page-break-after: avoid;
        break-after: avoid;
      }
      
      header .flex {
        flex-direction: column !important;
        gap: 8px !important;
      }
      
      header svg {
        display: none !important;
      }
      
      /* Footer simplificado */
      footer {
        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;
        padding: 15px !important;
        page-break-before: avoid;
        break-before: avoid;
      }
      
      footer .grid {
        display: block !important;
      }
      
      footer .space-y-3 {
        display: none !important;
      }
      
      /* Ajustar márgenes y espaciado */
      body {
        margin: 0;
        padding: 0;
      }
      
      .container {
        max-width: 100% !important;
        padding: 0 !important;
      }
      
      /* Reducir espaciado para PDF */
      .mb-8 { margin-bottom: 1rem !important; }
      .mb-6 { margin-bottom: 0.75rem !important; }
      .mt-8 { margin-top: 1rem !important; }
      .mt-6 { margin-top: 0.75rem !important; }
      .p-6 { padding: 0.75rem !important; }
      .p-4 { padding: 0.5rem !important; }
      
      /* Sombras más sutiles */
      .shadow-lg, .shadow-md {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12) !important;
      }
      
      /* Optimizar fuentes */
      body {
        font-size: 10pt;
        line-height: 1.3;
      }
      
      h1 { font-size: 18pt; }
      h2 { font-size: 16pt; }
      h3 { font-size: 14pt; }
      h4 { font-size: 12pt; }
      
      /* Botones y controles interactivos */
      button, .cursor-pointer {
        display: none !important;
      }
      
      /* Inputs y selects */
      input, select {
        border: 1px solid #ccc !important;
        background: white !important;
      }
      
      /* Mejorar contraste de texto */
      .text-gray-600 {
        color: #4b5563 !important;
      }
      
      .text-gray-700 {
        color: #374151 !important;
      }
      
      /* Asegurar que los badges se vean bien */
      .rounded-full {
        border-radius: 9999px !important;
      }
      
      /* Optimizar tablas para impresión */
      table {
        width: 100%;
        border-collapse: collapse;
      }
      
      th, td {
        padding: 3px 6px !important;
        font-size: 8pt;
      }
      
      /* Tabla de estudiantes más compacta en horizontal */
      #allStudentsTable th,
      #allStudentsTable td {
        padding: 2px 4px !important;
        font-size: 7pt;
      }
      
      #allStudentsTable .rounded-full {
        font-size: 6pt !important;
        padding: 1px 4px !important;
      }
      
      /* Evitar que las secciones se corten */
      section, article, .section-container {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* Si una sección es muy grande, permitir corte pero no en elementos hijos */
      .large-section {
        page-break-inside: auto;
      }
      
      .large-section > div {
        page-break-inside: avoid;
        break-inside: avoid;
      }
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
  
  <!-- Header Neutral -->
  <header class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">
            📊 ICFES Analyzer
          </h1>
          <p class="text-blue-100 text-lg">
            Análisis de Resultados Académicos
          </p>
        </div>
        <div class="flex gap-4 items-center">
          <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p class="text-sm font-medium">🔒 Procesado localmente</p>
            <p class="text-xs text-blue-200">Tus datos nunca salen de tu dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Barra de información del reporte -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="font-semibold text-gray-800">Reporte Académico ICFES</span>
        <span class="text-gray-400">•</span>
        <span>${year}</span>
      </div>
    </div>
  </div>

  <div id="app" class="max-w-7xl mx-auto p-6">
    <!-- CONTENIDO SE INYECTA AQUÍ -->
  </div>
  
  <!-- Footer Neutral -->
  <footer class="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 mt-12 py-8 text-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <!-- Info principal -->
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-bold mb-2">📊 ICFES Analyzer</h3>
          <p class="text-blue-200 text-sm max-w-md">
            Herramienta de análisis para resultados de pruebas tipo ICFES. 
            Todos los datos son procesados localmente en tu navegador.
          </p>
        </div>
        
        <!-- Privacidad -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span class="font-bold">100% Privado</span>
          </div>
          <p class="text-xs text-blue-200">
            Ningún dato personal fue enviado a servidores externos
          </p>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="border-t border-white/20 mt-6 pt-4 text-center">
        <p class="text-blue-200 text-xs">
          Reporte generado el ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
        </p>
      </div>
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
