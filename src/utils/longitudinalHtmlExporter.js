/**
 * Generador de HTML para Análisis Longitudinal
 * 
 * Sigue el MISMO patrón probado de htmlExporter.js
 * - Mismos CDNs (versiones específicas)
 * - Mismo commonOptions con datalabels
 * - Misma estructura initCharts()
 */

import { AREA_NAMES } from './export/htmlTemplates.js';

const AREA_COLORS = {
    lectura: '#3b82f6',
    matematicas: '#ef4444',
    sociales: '#f97316',
    naturales: '#22c55e',
    ingles: '#a855f7'
};

const GROUP_COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6'];
const PRUEBA_COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6'];

/**
 * Prepara los datos de ranking de estudiantes
 */
function prepareStudentRankingData(analysis) {
    const allStudents = Array.from(analysis.estudiantes.values());

    return allStudents.map(student => {
        const metrics = analysis.getStudentMetrics(student.codigo);
        const resultados = metrics?.resultados || [];

        const globales = resultados.filter(r => r.presente).map(r => r.global);
        const promedioGlobal = globales.length > 0 ? globales.reduce((a, b) => a + b, 0) / globales.length : null;

        const areas = {};
        Object.keys(AREA_NAMES).forEach(area => {
            const valores = resultados.filter(r => r.presente && r.areas[area] !== null).map(r => r.areas[area]);
            areas[area] = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
        });

        const pruebasPresentes = resultados.filter(r => r.presente).length;
        const todasLasPruebas = pruebasPresentes === analysis.pruebas.length;

        return {
            ...student,
            promedioGlobal,
            ...areas,
            pruebasPresentes,
            pruebasTotales: analysis.pruebas.length,
            todasLasPruebas
        };
    }).filter(s => s.promedioGlobal !== null)
        .sort((a, b) => (b.promedioGlobal || 0) - (a.promedioGlobal || 0));
}

/**
 * Genera el HTML completo del reporte longitudinal
 * @param {import('../models/LongitudinalAnalysis.js').LongitudinalAnalysis} analysis
 * @returns {string} HTML completo
 */
export function generateLongitudinalHTML(analysis) {
    const gradeMetrics = analysis.getGradeMetrics(true);
    const groups = analysis.grupos;
    const studentRankingData = prepareStudentRankingData(analysis);
    const pruebas = analysis.pruebas;

    // Datos para gráficos
    const dataGlobal = gradeMetrics.map(m => ({ prueba: m.pruebaNombre, valor: parseFloat(m.promedioGlobal.toFixed(2)) }));
    const dataDesviacion = gradeMetrics.map(m => ({ prueba: m.pruebaNombre, valor: parseFloat(m.desviacionGlobal.toFixed(2)) }));

    // Datos por área
    const dataAreas = {};
    Object.keys(AREA_NAMES).forEach(key => {
        dataAreas[key] = gradeMetrics.map(m => ({
            prueba: m.pruebaNombre,
            valor: parseFloat(m.areas[key]?.promedio?.toFixed(2) || 0)
        }));
    });

    // Datos por grupo
    const dataGrupos = {};
    groups.forEach(g => {
        const gm = analysis.getGroupMetrics(g, true);
        dataGrupos[g] = pruebas.map(p => {
            const match = gm?.find(m => m.pruebaId === p.id);
            return {
                prueba: p.nombre,
                global: parseFloat(match?.promedioGlobal?.toFixed(2) || 0),
                desviacion: parseFloat(match?.desviacionGlobal?.toFixed(2) || 0)
            };
        });
    });

    // KPIs
    const first = gradeMetrics[0];
    const last = gradeMetrics[gradeMetrics.length - 1];
    const cambio = gradeMetrics.length >= 2 ? last.promedioGlobal - first.promedioGlobal : 0;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análisis Longitudinal - ${analysis.grado}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      padding: 20px;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
      color: white;
      padding: 30px;
      border-radius: 16px;
      margin-bottom: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .header-stats { display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
    .header-stat { background: rgba(255,255,255,0.15); padding: 15px 25px; border-radius: 12px; }
    .header-stat .value { font-size: 2rem; font-weight: bold; }
    .header-stat .label { font-size: 0.875rem; opacity: 0.9; }
    .card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .card-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .chart-container { position: relative; height: 350px; }
    .chart-container-small { position: relative; height: 250px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
    .kpi-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 20px; text-align: center; }
    .kpi-value { font-size: 2.5rem; font-weight: 800; color: #1e40af; }
    .kpi-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
    .kpi-sub { font-size: 0.875rem; color: #94a3b8; }
    .tabs { display: flex; background: #f1f5f9; border-radius: 12px; padding: 5px; margin-bottom: 20px; }
    .tab-btn { flex: 1; padding: 12px 20px; border: none; background: transparent; font-weight: 600; cursor: pointer; border-radius: 8px; transition: all 0.2s; color: #64748b; }
    .tab-btn.active { background: white; color: #3b82f6; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .tab-btn:hover:not(.active) { background: rgba(255,255,255,0.5); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; font-weight: 600; position: sticky; top: 0; cursor: pointer; user-select: none; }
    th:hover { background: #f1f5f9; }
    tr:hover { background: #fafbfc; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    .badge-yellow { background: #fef3c7; color: #92400e; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .text-green { color: #16a34a; }
    .text-red { color: #dc2626; }
    .filters { display: flex; flex-wrap: wrap; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 12px; margin-bottom: 15px; }
    .filter-group { display: flex; align-items: center; gap: 8px; }
    .filter-group label { font-size: 0.875rem; font-weight: 500; color: #64748b; }
    .filter-group input, .filter-group select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; }
    .filter-group input:focus, .filter-group select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .table-container { max-height: 600px; overflow-y: auto; border-radius: 12px; border: 1px solid #e2e8f0; }
    .footer { text-align: center; padding: 20px; color: rgba(255,255,255,0.7); font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 Análisis Longitudinal</h1>
      <p style="font-size: 1.25rem; opacity: 0.9;">${analysis.grado}</p>
      <div class="header-stats">
        <div class="header-stat">
          <div class="value">${pruebas.length}</div>
          <div class="label">Pruebas</div>
        </div>
        <div class="header-stat">
          <div class="value">${analysis.estudiantes.size}</div>
          <div class="label">Estudiantes</div>
        </div>
        <div class="header-stat">
          <div class="value">${groups.length}</div>
          <div class="label">Grupos</div>
        </div>
      </div>
      <p style="margin-top: 15px; font-size: 0.875rem; opacity: 0.8;">📅 ${pruebas.map(p => p.nombre).join(' → ')}</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab-btn active" onclick="showTab('grade')">📈 Evolución del Grado</button>
      <button class="tab-btn" onclick="showTab('groups')">👥 Comparativa de Grupos</button>
      <button class="tab-btn" onclick="showTab('students')">👤 Por Estudiante</button>
    </div>

    <!-- Tab 1: Evolución del Grado -->
    <div id="tab-grade" class="tab-content active">
      <!-- KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Punto de Partida</div>
          <div class="kpi-value">${first?.promedioGlobal.toFixed(1) || '-'}</div>
          <div class="kpi-sub">${first?.pruebaNombre || ''}</div>
        </div>
        <div class="kpi-card" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
          <div class="kpi-label">Estado Actual</div>
          <div class="kpi-value" style="color: #166534;">${last?.promedioGlobal.toFixed(1) || '-'}</div>
          <div class="kpi-sub">${last?.pruebaNombre || ''}</div>
        </div>
        <div class="kpi-card" style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);">
          <div class="kpi-label">Evolución Neta</div>
          <div class="kpi-value" style="color: ${cambio >= 0 ? '#166534' : '#dc2626'};">${cambio >= 0 ? '+' : ''}${cambio.toFixed(1)}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📊 Promedio Global</div>
        <div class="chart-container"><canvas id="chartGlobal"></canvas></div>
      </div>

      <div class="card">
        <div class="card-title">📉 Variabilidad (Desviación Estándar)</div>
        <div class="chart-container"><canvas id="chartDesviacion"></canvas></div>
      </div>

      <div class="card">
        <div class="card-title">📚 Desglose por Asignatura</div>
        <div class="grid-3">
          ${Object.entries(AREA_NAMES).map(([key, name]) => `
            <div style="background: #f8fafc; border-radius: 12px; padding: 15px;">
              <h4 style="font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: ${AREA_COLORS[key]};"></span>
                ${name}
              </h4>
              <div class="chart-container-small"><canvas id="chartArea_${key}"></canvas></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Tab 2: Comparativa de Grupos -->
    <div id="tab-groups" class="tab-content">
      <div class="card">
        <div class="card-title">👥 Promedio Global por Grupo</div>
        <div class="chart-container"><canvas id="chartGroupsGlobal"></canvas></div>
      </div>

      <div class="card">
        <div class="card-title">📉 Variabilidad por Grupo</div>
        <div class="chart-container"><canvas id="chartGroupsDesviacion"></canvas></div>
      </div>

      <div class="card">
        <div class="card-title">📚 Desglose por Asignatura (Grupos)</div>
        <div class="grid-2">
          ${Object.entries(AREA_NAMES).map(([key, name]) => `
            <div style="background: #f8fafc; border-radius: 12px; padding: 15px;">
              <h4 style="font-weight: 600; margin-bottom: 10px;">${name}</h4>
              <div class="chart-container-small"><canvas id="chartGroupArea_${key}"></canvas></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Tab 3: Por Estudiante -->
    <div id="tab-students" class="tab-content">
      <div class="card">
        <div class="card-title">🏆 Ranking Promedio</div>
        
        <div class="filters">
          <div class="filter-group">
            <label>🔍 Buscar:</label>
            <input type="text" id="searchInput" placeholder="Nombre o código..." oninput="filterTable()">
          </div>
          <div class="filter-group">
            <label>Grupo:</label>
            <select id="groupFilter" onchange="filterTable()">
              <option value="">Todos</option>
              ${groups.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label>PIAR:</label>
            <select id="piarFilter" onchange="filterTable()">
              <option value="">Todos</option>
              <option value="Sí">Con PIAR</option>
              <option value="No">Sin PIAR</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Asistencia:</label>
            <select id="asistenciaFilter" onchange="filterTable()">
              <option value="">Todos</option>
              <option value="todas">Presentó todas</option>
              <option value="incompletas">Incompletas</option>
            </select>
          </div>
        </div>

        <div class="table-container">
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
                  <td style="font-weight: bold; color: #94a3b8;">${idx + 1}</td>
                  <td style="font-family: monospace;">${s.codigo}</td>
                  <td style="font-weight: 600;">${s.apellido}</td>
                  <td>${s.nombre}</td>
                  <td><span class="badge badge-blue">${s.grupo}</span></td>
                  <td>${s.piar === 'Sí' ? '<span class="badge badge-yellow">PIAR</span>' : ''}</td>
                  <td class="${s.promedioGlobal >= 60 ? 'text-green' : 'text-red'}" style="font-weight: bold;">${s.promedioGlobal?.toFixed(1) || '-'}</td>
                  ${Object.keys(AREA_NAMES).map(area =>
        `<td class="${s[area] !== null && s[area] >= 60 ? 'text-green' : s[area] !== null && s[area] < 40 ? 'text-red' : ''}">${s[area]?.toFixed(1) || '-'}</td>`
    ).join('')}
                  <td style="text-align: center;">${s.pruebasPresentes}/${s.pruebasTotales}</td>
                  <td style="text-align: center;">${s.todasLasPruebas ? '<span class="badge badge-green">✓</span>' : '<span class="badge badge-red">✗</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p style="margin-top: 15px; color: #64748b; font-size: 0.875rem;">Total: <strong id="visibleCount">${studentRankingData.length}</strong> estudiantes</p>
      </div>
    </div>

    <div class="footer">
      📊 Generado el ${new Date().toLocaleString('es-CO')}
    </div>
  </div>

  <script>
    // Registrar plugin globalmente (igual que htmlExporter.js)
    Chart.register(ChartDataLabels);

    // Datos
    const dataGlobal = ${JSON.stringify(dataGlobal)};
    const dataDesviacion = ${JSON.stringify(dataDesviacion)};
    const dataAreas = ${JSON.stringify(dataAreas)};
    const dataGrupos = ${JSON.stringify(dataGrupos)};
    const groups = ${JSON.stringify(groups)};
    const pruebaColors = ${JSON.stringify(PRUEBA_COLORS)};
    const groupColors = ${JSON.stringify(GROUP_COLORS)};
    const areaColors = ${JSON.stringify(AREA_COLORS)};

    // Opciones comunes (EXACTAMENTE como htmlExporter.js)
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { font: { size: 12, weight: 'bold' }, padding: 15, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          cornerRadius: 8
        },
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'end',
          offset: 4,
          font: { size: 11, weight: 'bold' },
          formatter: (value) => value ? parseFloat(value).toFixed(1) : '',
          color: '#1e293b'
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12, weight: 'bold' } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } }
      },
      animation: { duration: 800, easing: 'easeInOutQuart' }
    };

    // Inicializar gráficos
    function initCharts() {
      // Gráfico Global
      new Chart(document.getElementById('chartGlobal'), {
        type: 'bar',
        data: {
          labels: dataGlobal.map(d => d.prueba),
          datasets: [{
            label: 'Promedio Global',
            data: dataGlobal.map(d => d.valor),
            backgroundColor: dataGlobal.map((_, i) => pruebaColors[i % pruebaColors.length] + 'cc'),
            borderColor: dataGlobal.map((_, i) => pruebaColors[i % pruebaColors.length]),
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { display: false } } }
      });

      // Gráfico Desviación
      new Chart(document.getElementById('chartDesviacion'), {
        type: 'bar',
        data: {
          labels: dataDesviacion.map(d => d.prueba),
          datasets: [{
            label: 'Desviación Estándar',
            data: dataDesviacion.map(d => d.valor),
            backgroundColor: 'rgba(249, 115, 22, 0.7)',
            borderColor: 'rgb(249, 115, 22)',
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: { 
          ...commonOptions, 
          plugins: { 
            ...commonOptions.plugins, 
            legend: { display: false },
            datalabels: { ...commonOptions.plugins.datalabels, formatter: (v) => parseFloat(v).toFixed(2) }
          } 
        }
      });

      // Gráficos por Área
      Object.entries(dataAreas).forEach(([key, data]) => {
        const color = areaColors[key];
        new Chart(document.getElementById('chartArea_' + key), {
          type: 'bar',
          data: {
            labels: data.map(d => d.prueba),
            datasets: [{
              label: key,
              data: data.map(d => d.valor),
              backgroundColor: color + 'aa',
              borderColor: color,
              borderWidth: 2,
              borderRadius: 6
            }]
          },
          options: {
            ...commonOptions,
            plugins: { 
              ...commonOptions.plugins, 
              legend: { display: false },
              datalabels: { ...commonOptions.plugins.datalabels, color: color }
            },
            scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: 0, max: 100 } }
          }
        });
      });

      // Gráfico Grupos Global
      new Chart(document.getElementById('chartGroupsGlobal'), {
        type: 'bar',
        data: {
          labels: dataGlobal.map(d => d.prueba),
          datasets: groups.map((g, i) => ({
            label: g,
            data: dataGrupos[g].map(d => d.global),
            backgroundColor: groupColors[i % groupColors.length] + 'aa',
            borderColor: groupColors[i % groupColors.length],
            borderWidth: 2,
            borderRadius: 5
          }))
        },
        options: commonOptions
      });

      // Gráfico Grupos Desviación
      new Chart(document.getElementById('chartGroupsDesviacion'), {
        type: 'bar',
        data: {
          labels: dataGlobal.map(d => d.prueba),
          datasets: groups.map((g, i) => ({
            label: g,
            data: dataGrupos[g].map(d => d.desviacion),
            backgroundColor: groupColors[i % groupColors.length] + 'aa',
            borderColor: groupColors[i % groupColors.length],
            borderWidth: 2,
            borderRadius: 5
          }))
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            datalabels: { ...commonOptions.plugins.datalabels, formatter: (v) => parseFloat(v).toFixed(2) }
          }
        }
      });

      // Gráficos Área por Grupo
      Object.keys(dataAreas).forEach(areaKey => {
        new Chart(document.getElementById('chartGroupArea_' + areaKey), {
          type: 'bar',
          data: {
            labels: dataGlobal.map(d => d.prueba),
            datasets: groups.map((g, i) => {
              const gm = ${JSON.stringify(
        Object.fromEntries(groups.map(g => [
            g,
            Object.fromEntries(Object.keys(AREA_NAMES).map(areaKey => [
                areaKey,
                pruebas.map(p => {
                    const gm = analysis.getGroupMetrics(g, true);
                    const match = gm?.find(m => m.pruebaId === p.id);
                    return parseFloat(match?.areas?.[areaKey]?.promedio?.toFixed(2) || 0);
                })
            ]))
        ]))
    )};
              return {
                label: g,
                data: gm[g][areaKey],
                backgroundColor: groupColors[i % groupColors.length] + 'aa',
                borderColor: groupColors[i % groupColors.length],
                borderWidth: 1,
                borderRadius: 4
              };
            })
          },
          options: {
            ...commonOptions,
            plugins: { ...commonOptions.plugins, datalabels: { ...commonOptions.plugins.datalabels, font: { size: 9 } } },
            scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: 0, max: 100 } }
          }
        });
      });
    }

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
        let show = true;
        if (search && !text.includes(search)) show = false;
        if (group && row.dataset.grupo !== group) show = false;
        if (piar && row.dataset.piar !== piar) show = false;
        if (asistencia === 'todas' && row.dataset.completo !== 'true') show = false;
        if (asistencia === 'incompletas' && row.dataset.completo === 'true') show = false;

        row.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      document.getElementById('visibleCount').textContent = visible;
    }

    // Table sorting
    let sortDirection = {};
    function sortTable(colIndex, isNumeric = false) {
      const tbody = document.querySelector('#rankingTable tbody');
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

    // Inicializar al cargar
    document.addEventListener('DOMContentLoaded', initCharts);
  <\/script>
</body>
</html>`;

    return html;
}
