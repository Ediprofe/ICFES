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
    /* Marca de agua para impresión */
    @media print {
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
      
      body::before {
        content: "ediprofe.com";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 120px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.05);
        z-index: 9999;
        pointer-events: none;
        white-space: nowrap;
        letter-spacing: 0.1em;
      }
      
      /* Simplificar header en impresión */
      header {
        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;
        padding: 20px !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      header .flex {
        flex-direction: column !important;
        gap: 10px !important;
      }
      
      header svg {
        display: none !important;
      }
      
      /* Simplificar footer en impresión */
      footer {
        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;
        padding: 20px !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      footer .grid {
        display: block !important;
      }
      
      footer .space-y-3 {
        display: none !important;
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
  
  <!-- Header con Branding -->
  <header class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">
            <a href="${BRANDING.url}" target="_blank" class="hover:text-blue-100 transition-colors">
              ${BRANDING.name}
            </a>
          </h1>
          <p class="text-blue-100 text-lg">
            Guía Educativa para Ciencias y Matemáticas
          </p>
        </div>
        <div class="flex gap-6 items-center">
          <a href="${BRANDING.social.youtube}" target="_blank" class="flex items-center gap-2 hover:opacity-80 transition-opacity" title="YouTube">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span class="text-sm font-medium">/profedi</span>
          </a>
          <a href="${BRANDING.social.tiktok}" target="_blank" class="flex items-center gap-2 hover:opacity-80 transition-opacity" title="TikTok">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <span class="text-sm font-medium">@ediprofe</span>
          </a>
          <a href="${BRANDING.url}" target="_blank" class="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Sitio Web">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
          </a>
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
        <span class="text-gray-400">•</span>
        <span>Generado con tecnología ${BRANDING.name}</span>
      </div>
    </div>
  </div>

  <div id="app" class="max-w-7xl mx-auto p-6">
    <!-- CONTENIDO SE INYECTA AQUÍ -->
  </div>
  
  <!-- Footer con branding mejorado -->
  <footer class="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 mt-12 py-12 text-white">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Sección principal -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Información de la marca -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <a href="https://ediprofe.com" target="_blank" class="text-3xl font-extrabold hover:text-blue-200 transition-colors">
              ediprofe.com
            </a>
          </div>
          <p class="text-blue-100 text-lg font-semibold mb-3">
            Guía Educativa para Ciencias y Matemáticas
          </p>
          <p class="text-blue-200 leading-relaxed">
            Explora lecciones estructuradas con videos explicativos, material didáctico y recursos descargables que simplifican el aprendizaje de conceptos complejos. Cada unidad temática contiene múltiples lecciones organizadas de forma progresiva para facilitar el aprendizaje paso a paso.
          </p>
        </div>
        
        <!-- Redes sociales y enlaces -->
        <div class="flex flex-col justify-center">
          <h3 class="text-xl font-bold mb-4">🌐 Síguenos en nuestras redes</h3>
          <div class="space-y-3">
            <!-- YouTube -->
            <a href="https://www.youtube.com/@ProfeEdi" target="_blank" 
               class="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:scale-105 group">
              <div class="bg-red-500 rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-bold">YouTube</p>
                <p class="text-sm text-blue-200">/profedi</p>
              </div>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
            
            <!-- TikTok -->
            <a href="https://www.tiktok.com/@ediprofe" target="_blank" 
               class="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:scale-105 group">
              <div class="bg-gray-900 rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-bold">TikTok</p>
                <p class="text-sm text-blue-200">@ediprofe</p>
              </div>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
            
            <!-- Sitio Web -->
            <a href="https://ediprofe.com" target="_blank" 
               class="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:scale-105 group">
              <div class="bg-blue-500 rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-bold">Sitio Web</p>
                <p class="text-sm text-blue-200">ediprofe.com</p>
              </div>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Línea divisoria y copyright -->
      <div class="border-t border-white/20 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-blue-100 text-sm">
            © ${new Date().getFullYear()} ${BRANDING.name} - Herramienta de Análisis Académico ICFES
          </p>
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
        <div class="mt-4 text-center">
          <p class="text-blue-200 text-xs italic">
            "Simplificando el aprendizaje de conceptos complejos, un paso a la vez"
          </p>
        </div>
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
