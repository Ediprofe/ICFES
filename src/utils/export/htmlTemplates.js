/**
 * Templates HTML para exportación longitudinal
 * 
 * Módulo separado para mantener templates limpios y mantenibles.
 */

export const COLORS = {
    areas: {
        lectura: '#3b82f6',
        matematicas: '#ef4444',
        sociales: '#f97316',
        naturales: '#22c55e',
        ingles: '#a855f7'
    },
    groups: ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6'],
    pruebas: ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6']
};

export const AREA_NAMES = {
    lectura: 'Lectura',
    matematicas: 'Matemáticas',
    sociales: 'Sociales',
    naturales: 'Naturales',
    ingles: 'Inglés'
};

/**
 * Genera el HTML base con estilos y scripts
 */
export function getHtmlHead(title) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"><\/script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Inter', system-ui, sans-serif; }
        body { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); min-height: 100vh; }
        .card { 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 4px 20px -5px rgba(0,0,0,0.1); 
            padding: 1.5rem; 
            margin-bottom: 1.5rem;
            border: 1px solid #e5e7eb;
        }
        .card-title { font-size: 1.125rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th, td { padding: 0.625rem 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; position: sticky; top: 0; cursor: pointer; user-select: none; white-space: nowrap; }
        th:hover { background: #f3f4f6; }
        tr:hover { background: #fafbfc; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        input, select { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; }
        input:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .tab-btn { 
            padding: 1rem 1.5rem; 
            font-weight: 600; 
            border-bottom: 3px solid transparent; 
            cursor: pointer; 
            transition: all 0.2s;
            color: #6b7280;
        }
        .tab-btn:hover { background: #f9fafb; color: #374151; }
        .tab-btn.active { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .chart-container { position: relative; height: 320px; margin-bottom: 0.5rem; }
        .kpi-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 1rem 1.25rem; }
        .kpi-value { font-size: 2rem; font-weight: 800; color: #1e40af; }
        .kpi-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>
</head>`;
}

/**
 * Header del reporte
 */
export function getReportHeader(analysis) {
    return `
<body>
    <div class="w-full p-4 md:p-6 lg:p-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-8 mb-6 text-white">
            <div class="flex items-center gap-3 mb-2">
                <span class="text-4xl">📊</span>
                <div>
                    <h1 class="text-3xl font-extrabold">Análisis Longitudinal</h1>
                    <p class="text-blue-100 text-lg mt-1">${analysis.grado}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-4 mt-6">
                <div class="bg-white/15 backdrop-blur px-5 py-3 rounded-xl">
                    <p class="text-3xl font-bold">${analysis.pruebas.length}</p>
                    <p class="text-sm text-blue-100">Pruebas</p>
                </div>
                <div class="bg-white/15 backdrop-blur px-5 py-3 rounded-xl">
                    <p class="text-3xl font-bold">${analysis.estudiantes.size}</p>
                    <p class="text-sm text-blue-100">Estudiantes</p>
                </div>
                <div class="bg-white/15 backdrop-blur px-5 py-3 rounded-xl">
                    <p class="text-3xl font-bold">${analysis.grupos.length}</p>
                    <p class="text-sm text-blue-100">Grupos</p>
                </div>
            </div>
            <p class="mt-6 text-sm text-blue-200 flex items-center gap-2">
                <span>📅</span> ${analysis.pruebas.map(p => p.nombre).join(' → ')}
            </p>
        </div>`;
}

/**
 * Footer del reporte
 */
export function getReportFooter() {
    return `
        <!-- Footer -->
        <div class="text-center text-gray-400 text-sm mt-8 pb-8">
            <p>📊 Generado el ${new Date().toLocaleString('es-CO')}</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Navegación de pestañas
 */
export function getTabsNavigation() {
    return `
        <!-- Tabs Container -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div class="flex border-b border-gray-200 bg-gray-50">
                <button class="tab-btn active flex items-center gap-2" onclick="showTab('grade')">
                    <span>📈</span> Evolución del Grado
                </button>
                <button class="tab-btn flex items-center gap-2" onclick="showTab('groups')">
                    <span>👥</span> Comparativa de Grupos
                </button>
                <button class="tab-btn flex items-center gap-2" onclick="showTab('students')">
                    <span>👤</span> Por Estudiante
                </button>
            </div>`;
}
