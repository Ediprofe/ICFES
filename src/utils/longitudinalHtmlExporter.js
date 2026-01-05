/**
 * Generador de HTML para Análisis Longitudinal
 * 
 * Genera un reporte HTML interactivo con:
 * - Resumen general
 * - Gráficos de evolución
 * - Tabla de ranking de estudiantes
 */

/**
 * @param {import('../models/LongitudinalAnalysis.js').LongitudinalAnalysis} analysis
 * @returns {string} HTML completo
 */
export function generateLongitudinalHTML(analysis) {
    const gradeMetrics = analysis.getGradeMetrics(true); // Sin PIAR
    const allStudents = Array.from(analysis.estudiantes.values());

    // Calcular promedios por estudiante
    const studentRankingData = allStudents.map(student => {
        const metrics = analysis.getStudentMetrics(student.codigo);
        const resultados = metrics?.resultados || [];

        // Calcular promedios
        const globales = resultados.filter(r => r.presente).map(r => r.global);
        const promedioGlobal = globales.length > 0 ? globales.reduce((a, b) => a + b, 0) / globales.length : null;

        // Promedios por área
        const areas = {};
        const areaKeys = ['lectura', 'matematicas', 'sociales', 'naturales', 'ingles'];
        areaKeys.forEach(area => {
            const valores = resultados.filter(r => r.presente && r.areas[area] !== null).map(r => r.areas[area]);
            areas[area] = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
        });

        const pruebasPresentes = resultados.filter(r => r.presente).length;
        const todasLasPruebas = pruebasPresentes === analysis.pruebas.length;

        return {
            codigo: student.codigo,
            nombre: student.nombre,
            apellido: student.apellido,
            grupo: student.grupo,
            piar: student.piar,
            promedioGlobal,
            ...areas,
            pruebasPresentes,
            pruebasTotales: analysis.pruebas.length,
            todasLasPruebas
        };
    }).filter(s => s.promedioGlobal !== null)
        .sort((a, b) => (b.promedioGlobal || 0) - (a.promedioGlobal || 0));

    const areaNames = {
        lectura: 'Lectura',
        matematicas: 'Matemáticas',
        sociales: 'Sociales',
        naturales: 'Naturales',
        ingles: 'Inglés'
    };

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
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; position: sticky; top: 0; }
        tr:hover { background: #f9fafb; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        input, select { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
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
                    <p class="text-2xl font-bold">${analysis.grupos.length}</p>
                    <p class="text-sm text-blue-200">Grupos</p>
                </div>
            </div>
            <p class="mt-4 text-sm text-blue-200">Pruebas: ${analysis.pruebas.map(p => p.nombre).join(' → ')}</p>
        </div>

        <!-- Evolución Global -->
        <div class="card">
            <h2 class="text-xl font-bold text-gray-800 mb-4">📈 Evolución del Promedio Global</h2>
            <canvas id="chartGlobal" height="100"></canvas>
        </div>

        <!-- Ranking de Estudiantes -->
        <div class="card">
            <h2 class="text-xl font-bold text-gray-800 mb-4">🏆 Ranking de Estudiantes</h2>
            
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
                        ${analysis.grupos.map(g => `<option value="${g}">${g}</option>`).join('')}
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
                        <option value="incompletas">Pruebas incompletas</option>
                    </select>
                </div>
            </div>

            <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table id="rankingTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Código</th>
                            <th>Apellido</th>
                            <th>Nombre</th>
                            <th>Grupo</th>
                            <th>PIAR</th>
                            <th>Global</th>
                            ${Object.values(areaNames).map(name => `<th>${name}</th>`).join('')}
                            <th>Pruebas</th>
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
                                ${['lectura', 'matematicas', 'sociales', 'naturales', 'ingles'].map(area =>
        `<td class="${s[area] >= 60 ? 'text-green-600' : s[area] < 40 ? 'text-red-600' : ''}">${s[area]?.toFixed(1) || '-'}</td>`
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

        <!-- Footer -->
        <div class="text-center text-gray-400 text-sm mt-8">
            <p>Generado el ${new Date().toLocaleString('es-CO')}</p>
        </div>
    </div>

    <script>
        // Datos para gráfico
        const chartData = {
            labels: ${JSON.stringify(gradeMetrics.map(m => m.pruebaNombre))},
            datasets: [{
                label: 'Promedio Global (Sin PIAR)',
                data: ${JSON.stringify(gradeMetrics.map(m => m.promedioGlobal.toFixed(2)))},
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                borderRadius: 6
            }]
        };

        new Chart(document.getElementById('chartGlobal'), {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });

        // Filtrado de tabla
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
    </script>
</body>
</html>`;
}
