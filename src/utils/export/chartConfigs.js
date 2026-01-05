/**
 * Configuraciones de Chart.js para exportación HTML
 * 
 * Genera configuraciones listas para Chart.js con plugin datalabels.
 */

import { COLORS, AREA_NAMES } from './htmlTemplates.js';

/**
 * Configuración base para todos los gráficos de barras
 */
export function getBaseBarConfig() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                labels: { font: { family: 'Inter', weight: '500' } }
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                offset: 4,
                font: { weight: 'bold', size: 11 },
                formatter: (value) => value !== null && value !== undefined ? parseFloat(value).toFixed(1) : ''
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Inter', weight: '600' },
                bodyFont: { family: 'Inter' },
                padding: 12,
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', weight: '600', size: 12 } }
            },
            y: {
                grid: { color: '#f3f4f6' },
                ticks: { font: { family: 'Inter', size: 11 } },
                beginAtZero: false
            }
        }
    };
}

/**
 * Genera script de gráfico de evolución global
 */
export function generateGlobalEvolutionChart(gradeMetrics, id = 'chartGlobal') {
    const labels = gradeMetrics.map(m => m.pruebaNombre);
    const values = gradeMetrics.map(m => m.promedioGlobal.toFixed(2));
    const colors = gradeMetrics.map((_, i) => COLORS.pruebas[i % COLORS.pruebas.length]);

    return `
        new Chart(document.getElementById('${id}'), {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                    label: 'Promedio Global',
                    data: ${JSON.stringify(values)},
                    backgroundColor: ${JSON.stringify(colors.map(c => c + 'cc'))},
                    borderColor: ${JSON.stringify(colors)},
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...${JSON.stringify(getBaseBarConfig())},
                plugins: {
                    ...${JSON.stringify(getBaseBarConfig().plugins)},
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: 4,
                        color: '#1e40af',
                        font: { weight: 'bold', size: 12, family: 'Inter' },
                        formatter: (v) => parseFloat(v).toFixed(1)
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    `;
}

/**
 * Genera script de gráfico de desviación
 */
export function generateDesviacionChart(gradeMetrics, id = 'chartDesviacion') {
    const labels = gradeMetrics.map(m => m.pruebaNombre);
    const values = gradeMetrics.map(m => m.desviacionGlobal.toFixed(2));

    return `
        new Chart(document.getElementById('${id}'), {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                    label: 'Desviación Estándar',
                    data: ${JSON.stringify(values)},
                    backgroundColor: 'rgba(249, 115, 22, 0.7)',
                    borderColor: 'rgb(249, 115, 22)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: 4,
                        color: '#c2410c',
                        font: { weight: 'bold', size: 12, family: 'Inter' },
                        formatter: (v) => parseFloat(v).toFixed(2)
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: '600' } } },
                    y: { grid: { color: '#f3f4f6' }, beginAtZero: true }
                }
            },
            plugins: [ChartDataLabels]
        });
    `;
}

/**
 * Genera script de gráfico por área
 */
export function generateAreaChart(gradeMetrics, areaKey, areaName, id) {
    const labels = gradeMetrics.map(m => m.pruebaNombre);
    const values = gradeMetrics.map(m => m.areas[areaKey]?.promedio?.toFixed(2) || 0);
    const color = COLORS.areas[areaKey];

    return `
        new Chart(document.getElementById('${id}'), {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                    label: '${areaName}',
                    data: ${JSON.stringify(values)},
                    backgroundColor: '${color}aa',
                    borderColor: '${color}',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: 4,
                        color: '${color}',
                        font: { weight: 'bold', size: 11, family: 'Inter' },
                        formatter: (v) => parseFloat(v).toFixed(1)
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: '500', size: 11 } } },
                    y: { min: 0, max: 100, grid: { color: '#f3f4f6' } }
                }
            },
            plugins: [ChartDataLabels]
        });
    `;
}

/**
 * Genera script de gráfico de grupos
 */
export function generateGroupChart(analysis, groups, id, metric = 'promedioGlobal') {
    const labels = analysis.pruebas.map(p => p.nombre);

    const datasets = groups.map((g, i) => {
        const gm = analysis.getGroupMetrics(g, true);
        const data = analysis.pruebas.map(p => {
            const match = gm?.find(m => m.pruebaId === p.id);
            return metric === 'promedioGlobal'
                ? match?.promedioGlobal?.toFixed(2) || 0
                : match?.desviacionGlobal?.toFixed(2) || 0;
        });
        const color = COLORS.groups[i % COLORS.groups.length];
        return {
            label: g,
            data,
            backgroundColor: color + 'aa',
            borderColor: color,
            borderWidth: 2,
            borderRadius: 5
        };
    });

    return `
        new Chart(document.getElementById('${id}'), {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(labels)},
                datasets: ${JSON.stringify(datasets)}
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true, 
                        position: 'bottom',
                        labels: { font: { family: 'Inter', weight: '500' }, usePointStyle: true, padding: 15 }
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: 2,
                        font: { weight: 'bold', size: 9, family: 'Inter' },
                        formatter: (v) => parseFloat(v).toFixed(1)
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: '600' } } },
                    y: { grid: { color: '#f3f4f6' } }
                }
            },
            plugins: [ChartDataLabels]
        });
    `;
}

/**
 * Genera gráfico de área por grupo
 */
export function generateGroupAreaChart(analysis, groups, areaKey, id) {
    const labels = analysis.pruebas.map(p => p.nombre);

    const datasets = groups.map((g, i) => {
        const gm = analysis.getGroupMetrics(g, true);
        const data = analysis.pruebas.map(p => {
            const match = gm?.find(m => m.pruebaId === p.id);
            return match?.areas?.[areaKey]?.promedio?.toFixed(2) || 0;
        });
        const color = COLORS.groups[i % COLORS.groups.length];
        return {
            label: g,
            data,
            backgroundColor: color + 'aa',
            borderColor: color,
            borderWidth: 1,
            borderRadius: 4
        };
    });

    return `
        new Chart(document.getElementById('${id}'), {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(labels)},
                datasets: ${JSON.stringify(datasets)}
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'bottom', labels: { font: { family: 'Inter', size: 10 }, usePointStyle: true } },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: 1,
                        font: { weight: 'bold', size: 8 },
                        formatter: (v) => parseFloat(v).toFixed(1)
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: { min: 0, max: 100, grid: { color: '#f3f4f6' } }
                }
            },
            plugins: [ChartDataLabels]
        });
    `;
}
