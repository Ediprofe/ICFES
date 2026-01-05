/**
 * Generador de HTML para Análisis Longitudinal
 * 
 * OPCIÓN B: Single Page App Exportable
 * - React + Chart.js desde CDN (librerías públicas)
 * - Datos de estudiantes embebidos (privados, locales)
 * - Totalmente interactivo
 */

import { COLORS, AREA_NAMES } from './chartConfig';

/**
 * Prepara todos los datos para el export
 */
function prepareExportData(analysis) {
    // Métricas del grado
    const gradeMetricsSinPIAR = analysis.getGradeMetrics(true);
    const gradeMetricsConPIAR = analysis.getGradeMetrics(false);

    // Métricas por grupo
    const groupMetrics = {};
    analysis.grupos.forEach(g => {
        groupMetrics[g] = {
            sinPIAR: analysis.getGroupMetrics(g, true),
            conPIAR: analysis.getGroupMetrics(g, false)
        };
    });

    // Datos de estudiantes
    const students = Array.from(analysis.estudiantes.values()).map(student => {
        const metrics = analysis.getStudentMetrics(student.codigo);
        const resultados = metrics?.resultados || [];

        // Promedios
        const globales = resultados.filter(r => r.presente).map(r => r.global);
        const promedioGlobal = globales.length > 0 ? globales.reduce((a, b) => a + b, 0) / globales.length : null;

        const areasPromedio = {};
        Object.keys(AREA_NAMES).forEach(area => {
            const valores = resultados.filter(r => r.presente && r.areas[area] !== null).map(r => r.areas[area]);
            areasPromedio[area] = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
        });

        // Datos por prueba específica (para ranking por simulacro)
        const datosPorPrueba = {};
        resultados.forEach(r => {
            datosPorPrueba[r.pruebaId] = {
                global: r.presente ? r.global : null,
                ...Object.fromEntries(Object.keys(AREA_NAMES).map(area => [area, r.presente ? r.areas[area] : null]))
            };
        });

        return {
            codigo: student.codigo,
            nombre: student.nombre,
            apellido: student.apellido,
            grupo: student.grupo,
            piar: student.piar,
            promedioGlobal,
            areasPromedio,
            datosPorPrueba,
            resultados: resultados.map(r => ({
                pruebaId: r.pruebaId,
                pruebaNombre: r.pruebaNombre,
                presente: r.presente,
                global: r.global,
                areas: r.areas
            })),
            pruebasPresentes: resultados.filter(r => r.presente).length,
            pruebasTotales: analysis.pruebas.length,
            todasLasPruebas: resultados.filter(r => r.presente).length === analysis.pruebas.length
        };
    }).filter(s => s.promedioGlobal !== null)
        .sort((a, b) => (b.promedioGlobal || 0) - (a.promedioGlobal || 0));

    return {
        grado: analysis.grado,
        pruebas: analysis.pruebas.map(p => ({ id: p.id, nombre: p.nombre })),
        grupos: analysis.grupos,
        gradeMetricsSinPIAR,
        gradeMetricsConPIAR,
        groupMetrics,
        students,
        colors: COLORS,
        areaNames: AREA_NAMES
    };
}

/**
 * Genera el HTML completo
 */
export function generateLongitudinalHTML(analysis) {
    const data = prepareExportData(analysis);
    const dataJSON = JSON.stringify(data);

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Análisis Longitudinal - ${data.grado}</title>
    
    <!-- CDN: Librerías públicas (sin datos de estudiantes) -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; }
        .chart-container { position: relative; height: 350px; }
        .chart-container-small { position: relative; height: 280px; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-100 to-indigo-100 min-h-screen">

<!-- DATOS EMBEBIDOS (privados, nunca salen de tu PC) -->
<script>
    const DATA = ${dataJSON};
    Chart.register(ChartDataLabels);
</script>

<div id="root"></div>

<script>
const { useState, useEffect, useRef, useMemo } = React;

// ============================================
// ICONOS
// ============================================
const Icons = {
    Sort: () => React.createElement('svg', { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M7 15l5 5 5-5" }), React.createElement('path', { d: "M7 9l5-5 5 5" })),
    SortAsc: () => React.createElement('svg', { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M12 19V5" }), React.createElement('path', { d: "M5 12l7 7 7-7" })),
    SortDesc: () => React.createElement('svg', { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M12 5v14" }), React.createElement('path', { d: "M19 12l-7-7-7 7" }))
};

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function SortableHeader({ label, field, sortConfig, onSort }) {
    const isActive = sortConfig.key === field;
    return React.createElement('th', { 
        className: 'px-2 py-2 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none',
        onClick: () => onSort(field)
    }, 
        React.createElement('div', { className: 'flex items-center justify-between gap-1' },
            label,
            isActive 
                ? (sortConfig.direction === 'asc' ? React.createElement(Icons.SortAsc) : React.createElement(Icons.SortDesc))
                : React.createElement(Icons.Sort, { className: 'text-gray-300' })
        )
    );
}

function ChartCard({ title, children, showPIAR, onTogglePIAR }) {
    return React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
        React.createElement('div', { className: 'flex items-center justify-between mb-6' },
            React.createElement('h3', { className: 'text-lg font-bold text-gray-800' }, title),
            onTogglePIAR && React.createElement('button', {
                onClick: onTogglePIAR,
                className: 'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ' +
                    (showPIAR ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            },
                showPIAR ? '📊 Ver impacto PIAR' : '👁️ Ver impacto PIAR'
            )
        ),
        React.createElement('div', { className: 'chart-container' }, children)
    );
}

// ============================================
// COMPONENTES DE GRÁFICOS
// ============================================

function BarChart({ data, options, id }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        
        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, options]);

    return React.createElement('canvas', { ref: canvasRef, id: id });
}

// Opciones base
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true } },
        datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            offset: 4,
            font: { size: 10, weight: 'bold' },
            formatter: (v) => v ? parseFloat(v).toFixed(1) : '',
            color: '#1e293b'
        }
    },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } }
    }
};

// Opciones específicas para grupos (filtrar leyenda PIAR)
const groupOptions = {
    ...baseOptions,
    plugins: {
        ...baseOptions.plugins,
        legend: {
            ...baseOptions.plugins.legend,
            labels: {
                ...baseOptions.plugins.legend.labels,
                filter: (legendItem, chartData) => {
                     // Solo mostrar el PRIMER label 'Con PIAR' en la leyenda
                     if (legendItem.text.includes('Con PIAR')) {
                        const datasets = chartData.datasets;
                        const firstIndex = datasets.findIndex(d => d.label.includes('Con PIAR'));
                        return legendItem.datasetIndex === firstIndex;
                     }
                     return true;
                }
            }
        }
    }
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function App() {
    const [activeTab, setActiveTab] = useState('grade');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    const [includePIAR, setIncludePIAR] = useState(true);
    const [filterCompleto, setFilterCompleto] = useState('all');
    const [selectedPrueba, setSelectedPrueba] = useState(DATA.pruebas.length > 0 ? DATA.pruebas[DATA.pruebas.length - 1].id : 'promedio');
    const [showPIAR, setShowPIAR] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'global', direction: 'desc' });

    // Alternar vista PIAR para un gráfico específico
    const togglePIAR = (chartId) => {
        setShowPIAR(prev => ({ ...prev, [chartId]: !prev[chartId] }));
    };

    // Función para obtener valor según prueba seleccionada
    const getValorActual = (student, campo) => {
        if (selectedPrueba === 'promedio') {
            if (campo === 'global') return student.promedioGlobal;
            return student.areasPromedio[campo];
        } else {
            const datosPrueba = student.datosPorPrueba[selectedPrueba];
            if (!datosPrueba) return null;
            return datosPrueba[campo];
        }
    };

    // KPIs
    const first = DATA.gradeMetricsSinPIAR[0];
    const last = DATA.gradeMetricsSinPIAR[DATA.gradeMetricsSinPIAR.length - 1];
    const cambio = DATA.gradeMetricsSinPIAR.length >= 2 ? last.promedioGlobal - first.promedioGlobal : 0;

    // Manejar ordenamiento
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    // Filtrar y ordenar estudiantes
    const filteredStudents = useMemo(() => {
        let data = [...DATA.students];
        
        // Filtros
        if (!includePIAR) data = data.filter(s => s.piar !== 'Sí');
        if (groupFilter) data = data.filter(s => s.grupo === groupFilter);
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            data = data.filter(s =>
                s.nombre.toLowerCase().includes(search) ||
                s.apellido.toLowerCase().includes(search) ||
                s.codigo.toLowerCase().includes(search)
            );
        }
        if (filterCompleto === 'completo') data = data.filter(s => s.todasLasPruebas);
        else if (filterCompleto === 'incompleto') data = data.filter(s => !s.todasLasPruebas);
        
        // Ordenamiento dinámico
        data.sort((a, b) => {
            let valA, valB;

            switch (sortConfig.key) {
                case 'codigo': valA = a.codigo; valB = b.codigo; break;
                case 'apellido': valA = a.apellido; valB = b.apellido; break;
                case 'nombre': valA = a.nombre; valB = b.nombre; break;
                case 'grupo': valA = a.grupo; valB = b.grupo; break;
                case 'piar': valA = a.piar; valB = b.piar; break;
                case 'pruebas': valA = a.pruebasPresentes; valB = b.pruebasPresentes; break;
                case 'completo': valA = a.todasLasPruebas; valB = b.todasLasPruebas; break;
                case 'global': 
                    valA = getValorActual(a, 'global') ?? -Infinity; 
                    valB = getValorActual(b, 'global') ?? -Infinity; 
                    break;
                default:
                    // Es un área
                    valA = getValorActual(a, sortConfig.key) ?? -Infinity;
                    valB = getValorActual(b, sortConfig.key) ?? -Infinity;
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        return data;
    }, [searchTerm, groupFilter, includePIAR, filterCompleto, selectedPrueba, sortConfig]);

    // Título del ranking
    const rankingTitle = selectedPrueba === 'promedio' 
        ? '🏆 Ranking Promedio General'
        : '🏆 Ranking: ' + (DATA.pruebas.find(p => p.id === selectedPrueba)?.nombre || selectedPrueba);

    // Estudiante seleccionado
    const studentData = useMemo(() => {
        if (!selectedStudent) return null;
        return DATA.students.find(s => s.codigo === selectedStudent);
    }, [selectedStudent]);

    // Helpers para datasets comparativos
    const getComparisonDataset = (isGlobal, areaKey = null, metricKey = 'promedio') => {
        const datasets = [];
        
        // Principal (Sin PIAR)
        datasets.push({
            label: isGlobal ? 'Promedio (Sin PIAR)' : DATA.areaNames[areaKey] + ' (Sin PIAR)',
            data: DATA.gradeMetricsSinPIAR.map(m => isGlobal ? m.promedioGlobal : (m.areas[areaKey]?.[metricKey] || 0)),
            backgroundColor: DATA.gradeMetricsSinPIAR.map((_, i) => {
                const isLast = i === DATA.gradeMetricsSinPIAR.length - 1;
                const baseColor = isGlobal 
                    ? DATA.colors.pruebas[i % DATA.colors.pruebas.length]
                    : DATA.colors.areas[areaKey];
                // Último: Color sólido. Anteriores: Opacidad reducida ('66' ~40%)
                return baseColor + (isLast ? '' : '66');
            }),
            borderColor: isGlobal
                ? DATA.gradeMetricsSinPIAR.map((_, i) => DATA.colors.pruebas[i % DATA.colors.pruebas.length])
                : DATA.colors.areas[areaKey],
            borderWidth: 2,
            borderRadius: 6,
            order: 2
        });

        // Comparativo (Con PIAR) - Solo si se activa toggle
        const chartId = isGlobal ? 'global' : 'area_' + areaKey;
        if (showPIAR[chartId]) {
            datasets.push({
                label: isGlobal ? 'Promedio (Con PIAR)' : 'Con PIAR',
                data: DATA.gradeMetricsConPIAR.map(m => isGlobal ? m.promedioGlobal : (m.areas[areaKey]?.[metricKey] || 0)),
                backgroundColor: '#cbd5e1', // Slate-300
                borderColor: '#94a3b8', // Slate-400
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.5,
                categoryPercentage: 0.8,
                order: 1,
                datalabels: {
                    color: '#64748b', // Slate-500
                    font: { size: 9 },
                    anchor: 'end',
                    align: 'top'
                }
            });
        }

        return datasets;
    };

    // Helper para comparativa grupos
    const getGroupDataset = (isGlobal, areaKey = null) => {
        const datasets = [];
        
        DATA.grupos.forEach((g, i) => {
            const baseGroupColor = DATA.colors.groups[i % DATA.colors.groups.length];

            // Grupo principal
            datasets.push({
                label: g, // Solo el nombre del grupo
                data: DATA.pruebas.map(p => {
                    const match = DATA.groupMetrics[g].sinPIAR.find(m => m.pruebaId === p.id);
                    return isGlobal ? (match?.promedioGlobal || 0) : (match?.areas?.[areaKey]?.promedio || 0);
                }),
                // Color dinámico: Última prueba sólida, anteriores transparentes
                backgroundColor: DATA.pruebas.map((_, idx) => {
                    const isLast = idx === DATA.pruebas.length - 1;
                    return baseGroupColor + (isLast ? '' : '55'); // '55' ~33% opacity
                }),
                borderColor: baseGroupColor,
                borderWidth: 2,
                borderRadius: 4,
                // Agrupamiento visual: Para que queden juntos G1 y su PIAR, pero separados de G2
                stack: 'grupo_' + g 
            });

            // Grupo comparativo (PIAR)
            const chartId = isGlobal ? 'group_global' : 'group_area_' + areaKey;
            if (showPIAR[chartId]) {
                datasets.push({
                    label: 'Con PIAR', // Nombre genérico para la leyenda
                    data: DATA.pruebas.map(p => {
                        const match = DATA.groupMetrics[g].conPIAR.find(m => m.pruebaId === p.id);
                        return isGlobal ? (match?.promedioGlobal || 0) : (match?.areas?.[areaKey]?.promedio || 0);
                    }),
                    backgroundColor: '#9ca3af', // Gray-400
                    borderColor: '#6b7280', // Gray-500
                    borderWidth: 1,
                    borderRadius: 4,
                    stack: 'grupo_' + g, // Stack compartido para agrupación lógica si se usara, pero lo borramos abajo
                });
            }
        });

        // Re-organización para Chart.js:
        // Borramos stack para evitar apilamiento vertical. Borramos order para respetar intercalado.
        datasets.forEach(d => { delete d.stack; delete d.order; });

        return datasets;
    };

    // ============================================
    // RENDER
    // ============================================

    return React.createElement('div', { className: 'max-w-7xl mx-auto p-4 md:p-6' },
        // Header
        React.createElement('div', { className: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-6 text-white' },
            React.createElement('div', { className: 'flex items-center gap-4' },
                React.createElement('span', { className: 'text-5xl' }, '📊'),
                React.createElement('div', null,
                    React.createElement('h1', { className: 'text-3xl font-bold' }, 'Análisis Longitudinal'),
                    React.createElement('p', { className: 'text-purple-100 text-lg' }, DATA.grado)
                )
            ),
            React.createElement('div', { className: 'flex flex-wrap gap-4 mt-6' },
                React.createElement('div', { className: 'bg-white/15 backdrop-blur px-5 py-3 rounded-xl' },
                    React.createElement('p', { className: 'text-3xl font-bold' }, DATA.pruebas.length),
                    React.createElement('p', { className: 'text-sm text-purple-100' }, 'Pruebas')
                ),
                React.createElement('div', { className: 'bg-white/15 backdrop-blur px-5 py-3 rounded-xl' },
                    React.createElement('p', { className: 'text-3xl font-bold' }, DATA.students.length),
                    React.createElement('p', { className: 'text-sm text-purple-100' }, 'Estudiantes')
                ),
                React.createElement('div', { className: 'bg-white/15 backdrop-blur px-5 py-3 rounded-xl' },
                    React.createElement('p', { className: 'text-3xl font-bold' }, DATA.grupos.length),
                    React.createElement('p', { className: 'text-sm text-purple-100' }, 'Grupos')
                )
            ),
            React.createElement('p', { className: 'mt-4 text-sm text-purple-200' }, 
                '📅 ' + DATA.pruebas.map(p => p.nombre).join(' → ')
            )
        ),

        // Tabs
        React.createElement('div', { className: 'flex bg-white rounded-xl shadow-lg mb-6 overflow-hidden' },
            ['grade', 'groups', 'students'].map(tab => 
                React.createElement('button', {
                    key: tab,
                    onClick: () => setActiveTab(tab),
                    className: 'flex-1 py-4 px-6 font-semibold transition-all ' + 
                        (activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50')
                }, tab === 'grade' ? '📈 Evolución del Grado' : tab === 'groups' ? '👥 Comparativa de Grupos' : '👤 Por Estudiante')
            )
        ),

        // TAB: Evolución del Grado
        activeTab === 'grade' && React.createElement('div', { className: 'space-y-6' },
            // KPIs
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
                React.createElement('div', { className: 'bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-md' },
                    React.createElement('p', { className: 'text-xs uppercase tracking-wider text-blue-600 font-semibold' }, 'Punto de Partida'),
                    React.createElement('p', { className: 'text-3xl font-extrabold text-blue-800' }, first?.promedioGlobal.toFixed(1) || '-'),
                    React.createElement('p', { className: 'text-sm text-blue-500' }, first?.pruebaNombre)
                ),
                React.createElement('div', { className: 'bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-md' },
                    React.createElement('p', { className: 'text-xs uppercase tracking-wider text-green-600 font-semibold' }, 'Estado Actual'),
                    React.createElement('p', { className: 'text-3xl font-extrabold text-green-800' }, last?.promedioGlobal.toFixed(1) || '-'),
                    React.createElement('p', { className: 'text-sm text-green-500' }, last?.pruebaNombre)
                ),
                React.createElement('div', { className: 'bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-md' },
                    React.createElement('p', { className: 'text-xs uppercase tracking-wider text-purple-600 font-semibold' }, 'Evolución Neta'),
                    React.createElement('p', { className: 'text-3xl font-extrabold ' + (cambio >= 0 ? 'text-green-700' : 'text-red-700') }, 
                        (cambio >= 0 ? '+' : '') + cambio.toFixed(1)
                    )
                )
            ),

            // Chart Global
            React.createElement(ChartCard, { 
                title: '📊 Promedio Global',
                showPIAR: showPIAR['global'],
                onTogglePIAR: () => togglePIAR('global')
            },
                React.createElement(BarChart, {
                    id: 'chartGlobal',
                    data: {
                        labels: DATA.gradeMetricsSinPIAR.map(m => m.pruebaNombre),
                        datasets: getComparisonDataset(true)
                    },
                    options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }
                })
            ),

            // Charts por Área
            React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
                React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📚 Desglose por Asignatura'),
                React.createElement('div', { className: 'grid grid-cols-1 gap-6' },
                    Object.entries(DATA.areaNames).map(([key, name]) =>
                        React.createElement('div', { key: key },
                            React.createElement(ChartCard, { 
                                title: name,
                                showPIAR: showPIAR['area_' + key],
                                onTogglePIAR: () => togglePIAR('area_' + key)
                            },
                                React.createElement('div', { className: 'flex items-center gap-2 mb-3' },
                                    React.createElement('span', { 
                                        className: 'w-4 h-4 rounded-full',
                                        style: { backgroundColor: DATA.colors.areas[key] }
                                    })
                                ),
                                React.createElement(BarChart, {
                                    id: 'chartArea_' + key,
                                    data: {
                                        labels: DATA.gradeMetricsSinPIAR.map(m => m.pruebaNombre),
                                        datasets: getComparisonDataset(false, key)
                                    },
                                    options: { 
                                        ...baseOptions, 
                                        plugins: { ...baseOptions.plugins, legend: { display: false }, datalabels: { ...baseOptions.plugins.datalabels, color: DATA.colors.areas[key] } },
                                        scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, min: 0, max: 100 } }
                                    }
                                })
                            )
                        )
                    )
                )
            )
        ),

        // TAB: Comparativa de Grupos (CON OPCIONES NUEVAS PARA LEYENDA)
        activeTab === 'groups' && React.createElement('div', { className: 'space-y-6' },
            React.createElement(ChartCard, { 
                title: '📊 Promedio Global por Grupo',
                showPIAR: showPIAR['group_global'],
                onTogglePIAR: () => togglePIAR('group_global')
            },
                React.createElement(BarChart, {
                    id: 'chartGroupGlobal',
                    data: {
                        labels: DATA.pruebas.map(p => p.nombre),
                        datasets: getGroupDataset(true)
                    },
                    options: groupOptions // USANDO OPTION FILTRADA
                })
            ),
            
            // Áreas por grupo
            React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
                React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📚 Desglose por Asignatura (Grupos)'),
                React.createElement('div', { className: 'grid grid-cols-1 gap-6' },
                    Object.entries(DATA.areaNames).map(([key, name]) =>
                        React.createElement('div', { key: key },
                            React.createElement(ChartCard, { 
                                title: name,
                                showPIAR: showPIAR['group_area_' + key],
                                onTogglePIAR: () => togglePIAR('group_area_' + key)
                            },
                                React.createElement('div', { className: 'flex items-center gap-2 mb-3' },
                                    React.createElement('span', { className: 'w-4 h-4 rounded-full', style: { backgroundColor: DATA.colors.areas[key] } }),
                                ),
                                React.createElement(BarChart, {
                                    id: 'chartGroupArea_' + key,
                                    data: {
                                        labels: DATA.pruebas.map(p => p.nombre),
                                        datasets: getGroupDataset(false, key)
                                    },
                                    options: { 
                                        ...groupOptions, // USANDO OPTION FILTRADA
                                        scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, min: 0, max: 100 } }
                                    }
                                })
                            )
                        )
                    )
                )
            )
        ),

        // TAB: Por Estudiante (REORDENADO)
        activeTab === 'students' && React.createElement('div', { className: 'space-y-6' },
            // Filtros 
            React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
                React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '👤 Filtros y Búsqueda'),
                React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-6 gap-4 mb-4' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'text-sm font-medium text-gray-700 mb-1 block' }, '📅 Vista'),
                        React.createElement('select', {
                            value: selectedPrueba,
                            onChange: (e) => setSelectedPrueba(e.target.value),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm'
                        },
                            React.createElement('option', { value: 'promedio' }, '📊 Promedio General'),
                            DATA.pruebas.map(p => React.createElement('option', { key: p.id, value: p.id }, '📝 ' + p.nombre))
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'text-sm font-medium text-gray-700 mb-1 block' }, '🔍 Buscar'),
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Nombre o código...',
                            value: searchTerm,
                            onChange: (e) => setSearchTerm(e.target.value),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'text-sm font-medium text-gray-700 mb-1 block' }, '👥 Grupo'),
                        React.createElement('select', {
                            value: groupFilter,
                            onChange: (e) => setGroupFilter(e.target.value),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm'
                        },
                            React.createElement('option', { value: '' }, 'Todos'),
                            DATA.grupos.map(g => React.createElement('option', { key: g, value: g }, g))
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'text-sm font-medium text-gray-700 mb-1 block' }, 'PIAR'),
                        React.createElement('select', {
                            value: includePIAR ? 'todos' : 'sinPiar',
                            onChange: (e) => setIncludePIAR(e.target.value === 'todos'),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm'
                        },
                            React.createElement('option', { value: 'todos' }, 'Incluir PIAR'),
                            React.createElement('option', { value: 'sinPiar' }, 'Excluir PIAR')
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'text-sm font-medium text-gray-700 mb-1 block' }, 'Asistencia'),
                        React.createElement('select', {
                            value: filterCompleto,
                            onChange: (e) => setFilterCompleto(e.target.value),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm'
                        },
                            React.createElement('option', { value: 'all' }, 'Todos'),
                            React.createElement('option', { value: 'completo' }, 'Presentó todas'),
                            React.createElement('option', { value: 'incompleto' }, 'Incompletas')
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'text-sm font-medium text-gray-700 mb-1 block' }, 'Estudiante'),
                        React.createElement('select', {
                            value: selectedStudent || '',
                            onChange: (e) => setSelectedStudent(e.target.value || null),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm'
                        },
                            React.createElement('option', { value: '' }, 'Ver detalle...'),
                            filteredStudents.map(s => React.createElement('option', { key: s.codigo, value: s.codigo }, s.apellido + ' ' + s.nombre))
                        )
                    )
                ),
                React.createElement('p', { className: 'text-sm text-gray-500' }, 
                    filteredStudents.length + ' estudiante' + (filteredStudents.length !== 1 ? 's' : '') + ' encontrado' + (filteredStudents.length !== 1 ? 's' : '') +
                    (!includePIAR ? ' (sin PIAR)' : '')
                )
            ),

            // Tabla de ranking (MOVIDO AQUI)
            React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
                React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, rankingTitle),
                React.createElement('div', { className: 'overflow-x-auto max-h-[500px] overflow-y-auto' },
                    React.createElement('table', { className: 'w-full text-sm' },
                        React.createElement('thead', { className: 'sticky top-0 bg-white z-10' },
                            React.createElement('tr', { className: 'bg-gray-50 text-left' },
                                React.createElement('th', { className: 'px-2 py-2 font-semibold text-gray-700' }, '#'),
                                React.createElement(SortableHeader, { label: 'Código', field: 'codigo', sortConfig: sortConfig, onSort: handleSort }),
                                React.createElement(SortableHeader, { label: 'Apellido', field: 'apellido', sortConfig: sortConfig, onSort: handleSort }),
                                React.createElement(SortableHeader, { label: 'Nombre', field: 'nombre', sortConfig: sortConfig, onSort: handleSort }),
                                React.createElement(SortableHeader, { label: 'Grupo', field: 'grupo', sortConfig: sortConfig, onSort: handleSort }),
                                React.createElement(SortableHeader, { label: 'PIAR', field: 'piar', sortConfig: sortConfig, onSort: handleSort }),
                                React.createElement(SortableHeader, { label: 'Global', field: 'global', sortConfig: sortConfig, onSort: handleSort }),
                                Object.values(DATA.areaNames).map(name => {
                                     const areaKey = Object.keys(DATA.areaNames).find(k => DATA.areaNames[k] === name);
                                     return React.createElement(SortableHeader, { key: name, label: name, field: areaKey, sortConfig: sortConfig, onSort: handleSort });
                                }),
                                React.createElement(SortableHeader, { label: 'Pruebas', field: 'pruebas', sortConfig: sortConfig, onSort: handleSort }),
                                React.createElement(SortableHeader, { label: 'Completo', field: 'completo', sortConfig: sortConfig, onSort: handleSort }),
                                React.createElement('th', { className: 'px-2 py-2 font-semibold text-gray-700 text-center' }, 'Ver')
                            )
                        ),
                        React.createElement('tbody', null,
                            filteredStudents.map((s, idx) => {
                                const globalVal = getValorActual(s, 'global');
                                return React.createElement('tr', { 
                                    key: s.codigo, 
                                    className: 'border-t border-gray-100 hover:bg-gray-50 cursor-pointer ' + (selectedStudent === s.codigo ? 'bg-indigo-50 ring-2 ring-indigo-200' : ''),
                                    onClick: () => setSelectedStudent(s.codigo),
                                    id: 'row-' + s.codigo
                                },
                                    React.createElement('td', { className: 'px-2 py-2 font-bold text-gray-400' }, idx + 1),
                                    React.createElement('td', { className: 'px-2 py-2 font-mono text-xs text-gray-600' }, s.codigo),
                                    React.createElement('td', { className: 'px-2 py-2 font-medium text-gray-800' }, s.apellido),
                                    React.createElement('td', { className: 'px-2 py-2 text-gray-700' }, s.nombre),
                                    React.createElement('td', { className: 'px-2 py-2' },
                                        React.createElement('span', { className: 'px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs' }, s.grupo)
                                    ),
                                    React.createElement('td', { className: 'px-2 py-2 text-center' },
                                        s.piar === 'Sí' 
                                            ? React.createElement('span', { className: 'px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium' }, 'PIAR')
                                            : ''
                                    ),
                                    React.createElement('td', { className: 'px-2 py-2 text-center font-bold ' + (globalVal !== null && globalVal >= 60 ? 'text-green-600' : globalVal !== null ? 'text-red-600' : 'text-gray-400') },
                                        globalVal !== null ? globalVal.toFixed(1) : '-'
                                    ),
                                    Object.keys(DATA.areaNames).map(area => {
                                        const val = getValorActual(s, area);
                                        return React.createElement('td', { 
                                            key: area, 
                                            className: 'px-2 py-2 text-center ' + (val !== null && val >= 60 ? 'text-green-600' : val !== null && val < 40 ? 'text-red-600' : 'text-gray-600')
                                        }, val !== null ? val.toFixed(1) : '-');
                                    }),
                                    React.createElement('td', { className: 'px-2 py-2 text-center text-gray-600' },
                                        s.pruebasPresentes + '/' + s.pruebasTotales
                                    ),
                                    React.createElement('td', { className: 'px-2 py-2 text-center' },
                                        s.todasLasPruebas 
                                            ? React.createElement('span', { className: 'px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium' }, 'Sí')
                                            : React.createElement('span', { className: 'px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium' }, 'No')
                                    ),
                                    React.createElement('td', { className: 'px-2 py-2 text-center' },
                                        React.createElement('button', { 
                                            className: 'p-1 text-indigo-600 hover:bg-indigo-50 rounded',
                                            onClick: (e) => { e.stopPropagation(); setSelectedStudent(s.codigo); }
                                        }, '👁️')
                                    )
                                );
                            })
                        )
                    )
                )
            ),

            // Detalle del estudiante seleccionado (MOVIDO AQUI)
            studentData && React.createElement('div', { className: 'space-y-6 animate-fade-in' },
                // Header del estudiante
                React.createElement('div', { className: 'bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white' },
                    React.createElement('div', { className: 'flex justify-between items-start' },
                        React.createElement('div', null,
                            React.createElement('h2', { className: 'text-2xl font-bold' }, 
                                studentData.nombre + ' ' + studentData.apellido
                            ),
                            React.createElement('div', { className: 'flex items-center gap-4 mt-2 text-indigo-100' },
                                React.createElement('span', null, 'Código: ' + studentData.codigo),
                                React.createElement('span', null, 'Grupo: ' + studentData.grupo),
                                studentData.piar === 'Sí' && React.createElement('span', { 
                                    className: 'px-2 py-1 bg-amber-500/30 rounded text-amber-100 text-sm'
                                }, 'PIAR')
                            )
                        ),
                        React.createElement('div', { className: 'text-right' },
                            React.createElement('p', { className: 'text-sm text-indigo-200' }, 'Promedio General'),
                            React.createElement('p', { className: 'text-4xl font-bold' }, 
                                studentData.promedioGlobal?.toFixed(1) || '-'
                            ),
                            React.createElement('p', { className: 'text-sm text-indigo-200 mt-2' }, 
                                'Pruebas: ' + studentData.pruebasPresentes + '/' + studentData.pruebasTotales
                            )
                        )
                    )
                ),

                // Gráfico del estudiante: Global
                React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
                    React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📊 Puntaje Global por Prueba'),
                    React.createElement('div', { className: 'chart-container' },
                        React.createElement(BarChart, {
                            id: 'chartStudentGlobal',
                            data: {
                                labels: studentData.resultados.map(r => r.pruebaNombre),
                                datasets: [{
                                    label: 'Puntaje',
                                    data: studentData.resultados.map(r => r.presente ? r.global : null),
                                    backgroundColor: studentData.resultados.map((_, i) => DATA.colors.pruebas[i % DATA.colors.pruebas.length] + 'cc'),
                                    borderColor: studentData.resultados.map((_, i) => DATA.colors.pruebas[i % DATA.colors.pruebas.length]),
                                    borderWidth: 2,
                                    borderRadius: 8
                                }]
                            },
                            options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }
                        })
                    )
                ),

                // Gráfico del estudiante: Por Áreas
                React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
                    React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📚 Resultados por Asignatura'),
                    React.createElement('div', { className: 'chart-container' },
                        React.createElement(BarChart, {
                            id: 'chartStudentAreas',
                            data: {
                                labels: Object.values(DATA.areaNames),
                                datasets: studentData.resultados.filter(r => r.presente).map((r, i) => ({
                                    label: r.pruebaNombre,
                                    data: Object.keys(DATA.areaNames).map(area => r.areas[area]),
                                    backgroundColor: DATA.colors.pruebas[i % DATA.colors.pruebas.length] + 'aa',
                                    borderColor: DATA.colors.pruebas[i % DATA.colors.pruebas.length],
                                    borderWidth: 2,
                                    borderRadius: 5
                                }))
                            },
                            options: { 
                                ...baseOptions, 
                                scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, min: 0, max: 100 } }
                            }
                        })
                    )
                ),

                // Tabla de resultados detallados
                React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
                    React.createElement('h3', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📋 Resultados Detallados'),
                    React.createElement('div', { className: 'overflow-x-auto' },
                        React.createElement('table', { className: 'w-full text-sm' },
                            React.createElement('thead', null,
                                React.createElement('tr', { className: 'bg-gray-50 text-left' },
                                    React.createElement('th', { className: 'px-4 py-3 font-semibold' }, 'Prueba'),
                                    React.createElement('th', { className: 'px-4 py-3 font-semibold text-center' }, 'Estado'),
                                    React.createElement('th', { className: 'px-4 py-3 font-semibold text-center' }, 'Global'),
                                    Object.values(DATA.areaNames).map(name =>
                                        React.createElement('th', { key: name, className: 'px-4 py-3 font-semibold text-center' }, name)
                                    )
                                )
                            ),
                            React.createElement('tbody', null,
                                studentData.resultados.map(r =>
                                    React.createElement('tr', { key: r.pruebaId, className: 'border-t border-gray-100' },
                                        React.createElement('td', { className: 'px-4 py-3 font-medium' }, r.pruebaNombre),
                                        React.createElement('td', { className: 'px-4 py-3 text-center' },
                                            r.presente 
                                                ? React.createElement('span', { className: 'px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs' }, '✓ Presentó')
                                                : React.createElement('span', { className: 'px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs' }, '✗ Ausente')
                                        ),
                                        React.createElement('td', { className: 'px-4 py-3 text-center font-bold ' + (r.presente && r.global >= 60 ? 'text-green-600' : r.presente ? 'text-red-600' : 'text-gray-400') },
                                            r.presente ? r.global?.toFixed(1) : '-'
                                        ),
                                        Object.keys(DATA.areaNames).map(area =>
                                            React.createElement('td', { 
                                                key: area, 
                                                className: 'px-4 py-3 text-center ' + (r.presente && r.areas[area] >= 60 ? 'text-green-600' : r.presente && r.areas[area] < 40 ? 'text-red-600' : '')
                                            }, r.presente ? r.areas[area]?.toFixed(1) : '-')
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ),

        // Footer
        React.createElement('div', { className: 'text-center text-gray-400 text-sm mt-8 pb-8' },
            '📊 Generado el ' + new Date().toLocaleString('es-CO')
        )
    );
}

// Render
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
</script>

</body>
</html>`;
}
