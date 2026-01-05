/**
 * Generador de HTML para Análisis Longitudinal
 * 
 * Genera un reporte HTML interactivo FIEL al dashboard:
 * - Pestañas: Evolución del Grado, Comparativa de Grupos, Por Estudiante
 * - Gráficos con Chart.js
 * - Tablas interactivas con filtros
 */

const AREA_NAMES = {
    lectura: 'Lectura',
    matematicas: 'Matemáticas',
    sociales: 'Sociales',
    naturales: 'Naturales',
    ingles: 'Inglés'
};

const AREA_COLORS = {
    lectura: '#3b82f6',
    matematicas: '#ef4444',
    sociales: '#f97316',
    naturales: '#22c55e',
    ingles: '#a855f7'
};

const GROUP_COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6'];

/**
 * @param {import('../models/LongitudinalAnalysis.js').LongitudinalAnalysis} analysis
 * @returns {string} HTML completo
 */
export function generateLongitudinalHTML(analysis) {
    const gradeMetricsSinPIAR = analysis.getGradeMetrics(true);
    const gradeMetricsConPIAR = analysis.getGradeMetrics(false);
    const allStudents = Array.from(analysis.estudiantes.values());
    const groups = analysis.grupos;

    // Calcular datos de ranking
    const studentRankingData = allStudents.map(student => {
        const metrics = analysis.getStudentMetrics(student.codigo);
        const resultados = metrics?.resultados || [];

        const globales = resultados.filter(r => r.presente).map(r => r.global);
        const promedioGlobal = globales.length > 0 ? globales.reduce((a, b) => a + b, 0) / globales.length : null;

        const areas = {};
        Object.keys(AREA_NAMES).forEach(area => {
            const valores = resultados.filter(r => r.presente && r.areas[area] !== null).map(r => r.areas[area]);
            areas[area] = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
        });

        // Por prueba
        const datosPorPrueba = {};
        resultados.forEach(r => {
            datosPorPrueba[r.pruebaId] = {
                global: r.presente ? r.global : null,
                ...Object.fromEntries(Object.keys(AREA_NAMES).map(area => [area, r.presente ? r.areas[area] : null]))
            };
        });

        const pruebasPresentes = resultados.filter(r => r.presente).length;
        const todasLasPruebas = pruebasPresentes === analysis.pruebas.length;

        return {
            ...student,
            promedioGlobal,
            ...areas,
            datosPorPrueba,
            pruebasPresentes,
            pruebasTotales: analysis.pruebas.length,
            todasLasPruebas
        };
    }).filter(s => s.promedioGlobal !== null)
        .sort((a, b) => (b.promedioGlobal || 0) - (a.promedioGlobal || 0));

    // Métricas de grupo
    const groupMetrics = {};
    groups.forEach(g => {
        groupMetrics[g] = analysis.getGroupMetrics(g, true);
    });

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Análisis Longitudinal - ${analysis.grado}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; }
        .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); padding: 1.5rem; margin-bottom: 1.5rem; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th, td { padding: 0.5rem 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; position: sticky; top: 0; cursor: pointer; user-select: none; white-space: nowrap; }
        th:hover { background: #f3f4f6; }
        tr:hover { background: #f9fafb; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        input, select { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; }
        .tab-btn { padding: 1rem 1.5rem; font-weight: 500; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s; }
        .tab-btn:hover { background: #f9fafb; }
        .tab-btn.active { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .chart-container { height: 350px; margin-bottom: 1rem; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="w-full p-4 md:p-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-6 text-white">
            <h1 class="text-3xl font-bold mb-2">📊 Análisis Longitudinal</h1>
            <p class="text-xl text-blue-100">${analysis.grado}</p>
            <div class="flex gap-6 mt-6">
                <div class="bg-white/10 px-4 py-2 rounded-lg">
                    <p class="text-2xl font-bold">${analysis.pruebas.length}</p>
                    <p class="text-sm text-blue-200">Pruebas</p>
                </div>
                <div class="bg-white/10 px-4 py-2 rounded-lg">
                    <p class="text-2xl font-bold">${analysis.estudiantes.size}</p>
                    <p class="text-sm text-blue-200">Estudiantes</p>
                </div>
                <div class="bg-white/10 px-4 py-2 rounded-lg">
                    <p class="text-2xl font-bold">${groups.length}</p>
                    <p class="text-sm text-blue-200">Grupos</p>
                </div>
            </div>
            <p class="mt-4 text-sm text-blue-200">Pruebas: ${analysis.pruebas.map(p => p.nombre).join(' → ')}</p>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-white rounded-xl shadow-lg mb-6">
            <div class="flex border-b border-gray-200">
                <button class="tab-btn active" onclick="showTab('grade')">📈 Evolución del Grado</button>
                <button class="tab-btn" onclick="showTab('groups')">👥 Comparativa de Grupos</button>
                <button class="tab-btn" onclick="showTab('students')">👤 Por Estudiante</button>
            </div>

            <!-- TAB 1: Evolución del Grado -->
            <div id="tab-grade" class="tab-content active p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6">Evolución del Grado</h2>
                
                <!-- KPIs -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-500">Punto de Partida</p>
                        <p class="text-2xl font-bold text-gray-800">${gradeMetricsSinPIAR[0]?.promedioGlobal.toFixed(1) || '-'}</p>
                        <p class="text-xs text-gray-400">${gradeMetricsSinPIAR[0]?.pruebaNombre}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-500">Estado Actual</p>
                        <p class="text-2xl font-bold text-gray-800">${gradeMetricsSinPIAR[gradeMetricsSinPIAR.length - 1]?.promedioGlobal.toFixed(1) || '-'}</p>
                        <p class="text-xs text-gray-400">${gradeMetricsSinPIAR[gradeMetricsSinPIAR.length - 1]?.pruebaNombre}</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-500">Evolución Neta</p>
                        ${(() => {
            const cambio = gradeMetricsSinPIAR.length >= 2
                ? gradeMetricsSinPIAR[gradeMetricsSinPIAR.length - 1].promedioGlobal - gradeMetricsSinPIAR[0].promedioGlobal
                : 0;
            return `<p class="text-2xl font-bold ${cambio >= 0 ? 'text-green-600' : 'text-red-600'}">${cambio >= 0 ? '+' : ''}${cambio.toFixed(1)}</p>`;
        })()}
                    </div>
                </div>

                <!-- Chart Global -->
                <div class="card">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Promedio Global</h3>
                    <div class="chart-container"><canvas id="chartGlobal"></canvas></div>
                </div>

                <!-- Chart Desviación -->
                <div class="card">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Variabilidad (Desviación Estándar)</h3>
                    <div class="chart-container"><canvas id="chartDesviacion"></canvas></div>
                </div>

                <!-- Charts por Área -->
                <h3 class="text-lg font-bold text-gray-800 mb-4">Desglose por Asignatura</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${Object.entries(AREA_NAMES).map(([key, name]) => `
                        <div class="card">
                            <h4 class="font-bold text-gray-700 mb-2">${name}</h4>
                            <canvas id="chartArea_${key}" height="200"></canvas>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- TAB 2: Comparativa de Grupos -->
            <div id="tab-groups" class="tab-content p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6">Comparativa de Grupos</h2>
                
                <div class="card">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Promedio Global por Grupo</h3>
                    <div class="chart-container"><canvas id="chartGroupGlobal"></canvas></div>
                </div>

                <div class="card">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Variabilidad por Grupo</h3>
                    <div class="chart-container"><canvas id="chartGroupDesviacion"></canvas></div>
                </div>

                <!-- Charts por Área por Grupo -->
                <h3 class="text-lg font-bold text-gray-800 mb-4">Desglose por Asignatura (Grupos)</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${Object.entries(AREA_NAMES).map(([key, name]) => `
                        <div class="card">
                            <h4 class="font-bold text-gray-700 mb-2">${name}</h4>
                            <canvas id="chartGroupArea_${key}" height="200"></canvas>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- TAB 3: Por Estudiante -->
            <div id="tab-students" class="tab-content p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6">Ranking Promedio</h2>
                
                <!-- Filtros -->
                <div class="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label class="text-sm text-gray-600">Buscar:</label>
                        <input type="text" id="searchInput" placeholder="Nombre o código..." oninput="filterTable()" class="ml-2">
                    </div>
                    <div>
                        <label class="text-sm text-gray-600">Grupo:</label>
                        <select id="groupFilter" onchange="filterTable()" class="ml-2">
                            <option value="">Todos</option>
                            ${groups.map(g => `<option value="${g}">${g}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-sm text-gray-600">PIAR:</label>
                        <select id="piarFilter" onchange="filterTable()" class="ml-2">
                            <option value="">Todos</option>
                            <option value="Sí">Con PIAR</option>
                            <option value="No">Sin PIAR</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm text-gray-600">Asistencia:</label>
                        <select id="asistenciaFilter" onchange="filterTable()" class="ml-2">
                            <option value="">Todos</option>
                            <option value="todas">Presentó todas</option>
                            <option value="incompletas">Incompletas</option>
                        </select>
                    </div>
                </div>

                <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table id="rankingTable">
                        <thead>
                            <tr>
                                <th onclick="sortTable(0)">#</th>
                                <th onclick="sortTable(1)">Código</th>
                                <th onclick="sortTable(2)">Apellido</th>
                                <th onclick="sortTable(3)">Nombre</th>
                                <th onclick="sortTable(4)">Grupo</th>
                                <th>PIAR</th>
                                <th onclick="sortTable(6, true)">Global</th>
                                ${Object.values(AREA_NAMES).map((name, i) => `<th onclick="sortTable(${7 + i}, true)">${name}</th>`).join('')}
                                <th onclick="sortTable(12)">Pruebas</th>
                                <th>Completo</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${studentRankingData.map((s, idx) => `
                                <tr data-grupo="${s.grupo}" data-piar="${s.piar || 'No'}" data-completo="${s.todasLasPruebas}">
                                    <td class="font-bold text-gray-500">${idx + 1}</td>
                                    <td>${s.codigo}</td>
                                    <td class="font-medium">${s.apellido}</td>
                                    <td>${s.nombre}</td>
                                    <td>${s.grupo}</td>
                                    <td>${s.piar === 'Sí' ? '<span class="badge badge-yellow">PIAR</span>' : ''}</td>
                                    <td class="font-bold ${s.promedioGlobal >= 60 ? 'text-green-600' : 'text-red-600'}">${s.promedioGlobal?.toFixed(1) || '-'}</td>
                                    ${Object.keys(AREA_NAMES).map(area =>
            `<td class="${s[area] >= 60 ? 'text-green-600' : s[area] !== null && s[area] < 40 ? 'text-red-600' : ''}">${s[area]?.toFixed(1) || '-'}</td>`
        ).join('')}
                                    <td>${s.pruebasPresentes}/${s.pruebasTotales}</td>
                                    <td>${s.todasLasPruebas ? '<span class="badge badge-green">Sí</span>' : '<span class="badge badge-red">No</span>'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <p class="text-sm text-gray-500 mt-4">Total: <span id="visibleCount">${studentRankingData.length}</span> estudiantes</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-gray-400 text-sm mt-8">
            <p>Generado el ${new Date().toLocaleString('es-CO')}</p>
        </div>
    </div>

    <script>
        // Tab switching
        function showTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('tab-' + tabId).classList.add('active');
            event.target.classList.add('active');
        }

        // Table filtering
        function filterTable() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            const group = document.getElementById('groupFilter').value;
            const piar = document.getElementById('piarFilter').value;
            const asistencia = document.getElementById('asistenciaFilter').value;
            
            const rows = document.querySelectorAll('#rankingTable tbody tr');
            let visible = 0;

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const rowGroup = row.dataset.grupo;
                const rowPiar = row.dataset.piar;
                const rowCompleto = row.dataset.completo === 'true';

                let show = true;
                if (search && !text.includes(search)) show = false;
                if (group && rowGroup !== group) show = false;
                if (piar && rowPiar !== piar) show = false;
                if (asistencia === 'todas' && !rowCompleto) show = false;
                if (asistencia === 'incompletas' && rowCompleto) show = false;

                row.style.display = show ? '' : 'none';
                if (show) visible++;
            });

            document.getElementById('visibleCount').textContent = visible;
        }

        // Table sorting
        let sortDirection = {};
        function sortTable(colIndex, isNumeric = false) {
            const table = document.getElementById('rankingTable');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            sortDirection[colIndex] = !sortDirection[colIndex];
            const dir = sortDirection[colIndex] ? 1 : -1;

            rows.sort((a, b) => {
                let aVal = a.cells[colIndex].textContent.trim();
                let bVal = b.cells[colIndex].textContent.trim();
                
                if (isNumeric) {
                    aVal = parseFloat(aVal) || 0;
                    bVal = parseFloat(bVal) || 0;
                    return (aVal - bVal) * dir;
                }
                return aVal.localeCompare(bVal) * dir;
            });

            rows.forEach(row => tbody.appendChild(row));
        }

        // Chart.js charts
        const pruebas = ${JSON.stringify(analysis.pruebas.map(p => p.nombre))};
        const groups = ${JSON.stringify(groups)};
        const groupColors = ${JSON.stringify(GROUP_COLORS)};

        // Chart 1: Global Evolution
        new Chart(document.getElementById('chartGlobal'), {
            type: 'bar',
            data: {
                labels: pruebas,
                datasets: [{
                    label: 'Promedio Global',
                    data: ${JSON.stringify(gradeMetricsSinPIAR.map(m => m.promedioGlobal.toFixed(2)))},
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        // Chart 2: Desviación
        new Chart(document.getElementById('chartDesviacion'), {
            type: 'bar',
            data: {
                labels: pruebas,
                datasets: [{
                    label: 'Desviación Estándar',
                    data: ${JSON.stringify(gradeMetricsSinPIAR.map(m => m.desviacionGlobal.toFixed(2)))},
                    backgroundColor: 'rgba(249, 115, 22, 0.7)',
                    borderColor: 'rgb(249, 115, 22)',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        // Charts por Área
        ${Object.entries(AREA_NAMES).map(([key, name]) => `
            new Chart(document.getElementById('chartArea_${key}'), {
                type: 'bar',
                data: {
                    labels: pruebas,
                    datasets: [{
                        label: '${name}',
                        data: ${JSON.stringify(gradeMetricsSinPIAR.map(m => m.areas[key]?.promedio?.toFixed(2) || 0))},
                        backgroundColor: '${AREA_COLORS[key]}99',
                        borderColor: '${AREA_COLORS[key]}',
                        borderWidth: 2,
                        borderRadius: 4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }
            });
        `).join('')}

        // Chart Groups Global
        new Chart(document.getElementById('chartGroupGlobal'), {
            type: 'bar',
            data: {
                labels: pruebas,
                datasets: groups.map((g, i) => ({
                    label: g,
                    data: ${JSON.stringify(analysis.pruebas.map(p => {
            // Obtenemos métricas de cada grupo por prueba
            return 'groupMetrics[g]?.find(m => m.pruebaId === p.id)?.promedioGlobal?.toFixed(2) || 0';
        }))}.map(() => {
                        // Placeholder - datos reales calculados en runtime
                        return Math.random() * 20 + 280;
                    }),
                    backgroundColor: groupColors[i % groupColors.length] + '99',
                    borderColor: groupColors[i % groupColors.length],
                    borderWidth: 1,
                    borderRadius: 4
                }))
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Recalcular datasets de grupos con datos reales
        (function() {
            const groupMetricsData = ${JSON.stringify(
            Object.fromEntries(groups.map(g => [
                g,
                analysis.pruebas.map(p => {
                    const gm = analysis.getGroupMetrics(g, true);
                    const match = gm?.find(m => m.pruebaId === p.id);
                    return match?.promedioGlobal?.toFixed(2) || 0;
                })
            ]))
        )};
            
            const chartGroupGlobal = Chart.getChart('chartGroupGlobal');
            chartGroupGlobal.data.datasets = groups.map((g, i) => ({
                label: g,
                data: groupMetricsData[g],
                backgroundColor: groupColors[i % groupColors.length] + '99',
                borderColor: groupColors[i % groupColors.length],
                borderWidth: 1,
                borderRadius: 4
            }));
            chartGroupGlobal.update();

            // Desviación por grupo
            const groupDesviacionData = ${JSON.stringify(
            Object.fromEntries(groups.map(g => [
                g,
                analysis.pruebas.map(p => {
                    const gm = analysis.getGroupMetrics(g, true);
                    const match = gm?.find(m => m.pruebaId === p.id);
                    return match?.desviacionGlobal?.toFixed(2) || 0;
                })
            ]))
        )};

            new Chart(document.getElementById('chartGroupDesviacion'), {
                type: 'bar',
                data: {
                    labels: pruebas,
                    datasets: groups.map((g, i) => ({
                        label: g,
                        data: groupDesviacionData[g],
                        backgroundColor: groupColors[i % groupColors.length] + '99',
                        borderColor: groupColors[i % groupColors.length],
                        borderWidth: 1,
                        borderRadius: 4
                    }))
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

            // Área por grupo
            ${Object.entries(AREA_NAMES).map(([key, name]) => {
            const areaData = Object.fromEntries(groups.map(g => [
                g,
                analysis.pruebas.map(p => {
                    const gm = analysis.getGroupMetrics(g, true);
                    const match = gm?.find(m => m.pruebaId === p.id);
                    return match?.areas?.[key]?.promedio?.toFixed(2) || 0;
                })
            ]));
            return `
                    new Chart(document.getElementById('chartGroupArea_${key}'), {
                        type: 'bar',
                        data: {
                            labels: pruebas,
                            datasets: groups.map((g, i) => ({
                                label: g,
                                data: ${JSON.stringify(areaData)}[g],
                                backgroundColor: groupColors[i % groupColors.length] + '99',
                                borderColor: groupColors[i % groupColors.length],
                                borderWidth: 1,
                                borderRadius: 3
                            }))
                        },
                        options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
                    });
                `;
        }).join('')}
        })();
    </script>
</body>
</html>`;
}
