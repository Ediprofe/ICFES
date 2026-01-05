/**
 * Generador de contenido de pestañas para HTML exportado
 */

import { AREA_NAMES, COLORS } from './htmlTemplates.js';

/**
 * Genera el contenido de la pestaña "Evolución del Grado"
 */
export function generateGradeTab(gradeMetrics) {
    const first = gradeMetrics[0];
    const last = gradeMetrics[gradeMetrics.length - 1];
    const cambio = gradeMetrics.length >= 2 ? last.promedioGlobal - first.promedioGlobal : 0;

    return `
            <!-- TAB 1: Evolución del Grado -->
            <div id="tab-grade" class="tab-content active p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span class="p-2 bg-blue-100 rounded-lg">📈</span> Evolución del Grado
                </h2>
                
                <!-- KPIs -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="kpi-card">
                        <p class="kpi-label">Punto de Partida</p>
                        <p class="kpi-value">${first?.promedioGlobal.toFixed(1) || '-'}</p>
                        <p class="text-xs text-gray-500 mt-1">${first?.pruebaNombre || ''}</p>
                    </div>
                    <div class="kpi-card" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
                        <p class="kpi-label">Estado Actual</p>
                        <p class="kpi-value" style="color: #166534;">${last?.promedioGlobal.toFixed(1) || '-'}</p>
                        <p class="text-xs text-gray-500 mt-1">${last?.pruebaNombre || ''}</p>
                    </div>
                    <div class="kpi-card" style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);">
                        <p class="kpi-label">Evolución Neta</p>
                        <p class="kpi-value" style="color: ${cambio >= 0 ? '#166534' : '#dc2626'};">
                            ${cambio >= 0 ? '+' : ''}${cambio.toFixed(1)}
                        </p>
                    </div>
                </div>

                <!-- Chart Global -->
                <div class="card">
                    <h3 class="card-title">Promedio Global</h3>
                    <div class="chart-container"><canvas id="chartGlobal"></canvas></div>
                </div>

                <!-- Chart Desviación -->
                <div class="card">
                    <h3 class="card-title">Variabilidad (Desviación Estándar)</h3>
                    <div class="chart-container"><canvas id="chartDesviacion"></canvas></div>
                </div>

                <!-- Charts por Área -->
                <div class="card">
                    <h3 class="card-title mb-4">Desglose por Asignatura</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${Object.entries(AREA_NAMES).map(([key, name]) => `
                            <div class="bg-gray-50 rounded-xl p-4">
                                <h4 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full" style="background: ${COLORS.areas[key]}"></span>
                                    ${name}
                                </h4>
                                <div style="height: 200px;"><canvas id="chartArea_${key}"></canvas></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
}

/**
 * Genera el contenido de la pestaña "Comparativa de Grupos"
 */
export function generateGroupsTab(groups) {
    return `
            <!-- TAB 2: Comparativa de Grupos -->
            <div id="tab-groups" class="tab-content p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span class="p-2 bg-purple-100 rounded-lg">👥</span> Comparativa de Grupos
                </h2>
                
                <div class="card">
                    <h3 class="card-title">Promedio Global por Grupo</h3>
                    <div class="chart-container" style="height: 380px;"><canvas id="chartGroupGlobal"></canvas></div>
                </div>

                <div class="card">
                    <h3 class="card-title">Variabilidad por Grupo</h3>
                    <div class="chart-container"><canvas id="chartGroupDesviacion"></canvas></div>
                </div>

                <!-- Charts por Área por Grupo -->
                <div class="card">
                    <h3 class="card-title mb-4">Desglose por Asignatura (Grupos)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Object.entries(AREA_NAMES).map(([key, name]) => `
                            <div class="bg-gray-50 rounded-xl p-4">
                                <h4 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full" style="background: ${COLORS.areas[key]}"></span>
                                    ${name}
                                </h4>
                                <div style="height: 250px;"><canvas id="chartGroupArea_${key}"></canvas></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
}

/**
 * Genera el contenido de la pestaña "Por Estudiante"
 */
export function generateStudentsTab(studentRankingData, groups) {
    return `
            <!-- TAB 3: Por Estudiante -->
            <div id="tab-students" class="tab-content p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span class="p-2 bg-indigo-100 rounded-lg">👤</span> Ranking Promedio
                </h2>
                
                <!-- Filtros -->
                <div class="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-medium text-gray-600">🔍 Buscar:</label>
                        <input type="text" id="searchInput" placeholder="Nombre o código..." oninput="filterTable()">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-medium text-gray-600">Grupo:</label>
                        <select id="groupFilter" onchange="filterTable()">
                            <option value="">Todos</option>
                            ${groups.map(g => `<option value="${g}">${g}</option>`).join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-medium text-gray-600">PIAR:</label>
                        <select id="piarFilter" onchange="filterTable()">
                            <option value="">Todos</option>
                            <option value="Sí">Con PIAR</option>
                            <option value="No">Sin PIAR</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-medium text-gray-600">Asistencia:</label>
                        <select id="asistenciaFilter" onchange="filterTable()">
                            <option value="">Todos</option>
                            <option value="todas">Presentó todas</option>
                            <option value="incompletas">Incompletas</option>
                        </select>
                    </div>
                </div>

                <div class="card overflow-hidden" style="padding: 0;">
                    <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table id="rankingTable">
                            <thead>
                                <tr>
                                    <th onclick="sortTable(0)"># ↕</th>
                                    <th onclick="sortTable(1)">Código ↕</th>
                                    <th onclick="sortTable(2)">Apellido ↕</th>
                                    <th onclick="sortTable(3)">Nombre ↕</th>
                                    <th onclick="sortTable(4)">Grupo ↕</th>
                                    <th>PIAR</th>
                                    <th onclick="sortTable(6, true)">Global ↕</th>
                                    ${Object.values(AREA_NAMES).map((name, i) => `<th onclick="sortTable(${7 + i}, true)">${name} ↕</th>`).join('')}
                                    <th onclick="sortTable(12, true)">Pruebas ↕</th>
                                    <th>Completo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${studentRankingData.map((s, idx) => `
                                    <tr data-grupo="${s.grupo}" data-piar="${s.piar || 'No'}" data-completo="${s.todasLasPruebas}">
                                        <td class="font-bold text-gray-400">${idx + 1}</td>
                                        <td class="font-mono text-sm">${s.codigo}</td>
                                        <td class="font-semibold">${s.apellido}</td>
                                        <td>${s.nombre}</td>
                                        <td><span class="badge" style="background: #e0e7ff; color: #3730a3;">${s.grupo}</span></td>
                                        <td>${s.piar === 'Sí' ? '<span class="badge badge-yellow">PIAR</span>' : ''}</td>
                                        <td class="font-bold ${s.promedioGlobal >= 60 ? 'text-green-600' : 'text-red-600'}">${s.promedioGlobal?.toFixed(1) || '-'}</td>
                                        ${Object.keys(AREA_NAMES).map(area =>
        `<td class="${s[area] !== null && s[area] >= 60 ? 'text-green-600' : s[area] !== null && s[area] < 40 ? 'text-red-600' : ''}">${s[area]?.toFixed(1) || '-'}</td>`
    ).join('')}
                                        <td class="text-center">${s.pruebasPresentes}/${s.pruebasTotales}</td>
                                        <td class="text-center">${s.todasLasPruebas ? '<span class="badge badge-green">✓</span>' : '<span class="badge badge-red">✗</span>'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p class="text-sm text-gray-500 mt-4 flex items-center gap-2">
                    <span>📊</span> Total: <strong id="visibleCount">${studentRankingData.length}</strong> estudiantes
                </p>
            </div>`;
}

/**
 * Genera scripts de interactividad (tabs, filtros, ordenamiento)
 */
export function generateInteractivityScripts() {
    return `
    <script>
        // Tab switching
        function showTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('tab-' + tabId).classList.add('active');
            event.target.closest('.tab-btn').classList.add('active');
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
    <\/script>`;
}
