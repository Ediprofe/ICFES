/**
 * GradeEvolution - Evolución del grado completo
 * 
 * MIGRADO A CHART.JS para fidelidad con HTML export
 * 
 * Toggle PIAR: "Ver impacto PIAR" - Muestra barra gris comparativa al lado
 */

import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus, Eye, EyeOff } from 'lucide-react';
import {
    COLORS,
    AREA_NAMES,
    baseOptions
} from '../../utils/chartConfig';

/**
 * Componente de tarjeta para gráficos con toggle PIAR
 */
function ChartCard({ title, children, showPIARImpact, onTogglePIAR }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <button
                    onClick={onTogglePIAR}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${showPIARImpact ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    {showPIARImpact ? <Eye size={16} /> : <EyeOff size={16} />}
                    Ver impacto PIAR
                </button>
            </div>
            <div className="h-[350px]">
                {children}
            </div>
        </div>
    );
}

/**
 * Crea datos de gráfico con opción de comparar PIAR
 * - Sin PIAR: Barras de colores
 * - Con PIAR: Barras grises al lado
 */
function createComparisonData(labels, valuesSinPIAR, valuesConPIAR, colors, showPIARImpact, label) {
    const datasets = [{
        label: label,
        data: valuesSinPIAR,
        backgroundColor: Array.isArray(colors) ? colors.map(c => c + 'cc') : colors + 'cc',
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
    }];

    if (showPIARImpact) {
        datasets.push({
            label: 'Con PIAR',
            data: valuesConPIAR,
            backgroundColor: '#9ca3af99',
            borderColor: '#9ca3af',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
        });
    }

    return { labels, datasets };
}

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GradeEvolution({ analysis }) {
    // Estado de toggle PIAR por gráfico (false = oculto, true = mostrar impacto)
    const [piarStates, setPiarStates] = useState({
        global: false,
        variabilidad: false,
        lectura: false,
        matematicas: false,
        sociales: false,
        naturales: false,
        ingles: false
    });

    const togglePIAR = (key) => {
        setPiarStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Métricas
    const metricsSinPIAR = useMemo(() => analysis.getGradeMetrics(true), [analysis]);
    const metricsConPIAR = useMemo(() => analysis.getGradeMetrics(false), [analysis]);

    // Datos para gráfico global
    const globalChartData = useMemo(() => {
        const labels = metricsSinPIAR.map(m => m.pruebaNombre);
        const valuesSinPIAR = metricsSinPIAR.map(m => m.promedioGlobal);
        const valuesConPIAR = metricsConPIAR.map(m => m.promedioGlobal);
        const colors = metricsSinPIAR.map((_, i) => COLORS.pruebas[i % COLORS.pruebas.length]);

        return createComparisonData(labels, valuesSinPIAR, valuesConPIAR, colors, piarStates.global, 'Sin PIAR');
    }, [piarStates.global, metricsSinPIAR, metricsConPIAR]);

    // Datos para gráfico de variabilidad
    const variabilidadChartData = useMemo(() => {
        const labels = metricsSinPIAR.map(m => m.pruebaNombre);
        const valuesSinPIAR = metricsSinPIAR.map(m => m.desviacionGlobal);
        const valuesConPIAR = metricsConPIAR.map(m => m.desviacionGlobal);

        return createComparisonData(labels, valuesSinPIAR, valuesConPIAR, '#f97316', piarStates.variabilidad, 'Sin PIAR');
    }, [piarStates.variabilidad, metricsSinPIAR, metricsConPIAR]);

    // Datos para gráficos por área
    const areaChartData = useMemo(() => {
        const result = {};
        Object.keys(AREA_NAMES).forEach(areaKey => {
            const labels = metricsSinPIAR.map(m => m.pruebaNombre);
            const valuesSinPIAR = metricsSinPIAR.map(m => m.areas[areaKey]?.promedio || 0);
            const valuesConPIAR = metricsConPIAR.map(m => m.areas[areaKey]?.promedio || 0);

            result[areaKey] = createComparisonData(labels, valuesSinPIAR, valuesConPIAR, COLORS.areas[areaKey], piarStates[areaKey], 'Sin PIAR');
        });
        return result;
    }, [piarStates, metricsSinPIAR, metricsConPIAR]);

    // KPIs
    const first = metricsSinPIAR[0];
    const last = metricsSinPIAR[metricsSinPIAR.length - 1];
    const cambio = metricsSinPIAR.length >= 2 ? last.promedioGlobal - first.promedioGlobal : 0;

    const getTrendIcon = (value) => {
        if (value > 2) return <TrendingUp className="text-green-500" size={20} />;
        if (value < -2) return <TrendingDown className="text-red-500" size={20} />;
        return <Minus className="text-gray-400" size={20} />;
    };

    // Opciones para gráficos
    const getChartOptions = (showLegend = false, coloredLabels = null) => ({
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            legend: { display: showLegend, position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true } },
            datalabels: coloredLabels ? {
                ...baseOptions.plugins.datalabels,
                color: coloredLabels
            } : baseOptions.plugins.datalabels
        }
    });

    const areaOptions = (showLegend, color) => ({
        ...getChartOptions(showLegend, color),
        scales: {
            ...baseOptions.scales,
            y: { ...baseOptions.scales.y, min: 0, max: 100 }
        }
    });

    return (
        <div className="w-full space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-md">
                    <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1">Punto de Partida</p>
                    <p className="text-3xl font-extrabold text-blue-800">{first?.promedioGlobal.toFixed(1) || '-'}</p>
                    <p className="text-sm text-blue-500 mt-1">{first?.pruebaNombre}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-md">
                    <p className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-1">Estado Actual</p>
                    <p className="text-3xl font-extrabold text-green-800">{last?.promedioGlobal.toFixed(1) || '-'}</p>
                    <p className="text-sm text-green-500 mt-1">{last?.pruebaNombre}</p>
                </div>
                <div className={`bg-gradient-to-br ${cambio >= 0 ? 'from-purple-50 to-purple-100' : 'from-red-50 to-red-100'} rounded-xl p-5 shadow-md`}>
                    <p className="text-xs uppercase tracking-wider text-purple-600 font-semibold mb-1">Evolución Neta</p>
                    <div className="flex items-center gap-2">
                        {getTrendIcon(cambio)}
                        <p className={`text-3xl font-extrabold ${cambio >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {cambio >= 0 ? '+' : ''}{cambio.toFixed(1)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gráfico Global */}
            <ChartCard
                title="📊 Promedio Global"
                showPIARImpact={piarStates.global}
                onTogglePIAR={() => togglePIAR('global')}
            >
                <Bar data={globalChartData} options={getChartOptions(piarStates.global)} />
            </ChartCard>

            {/* Gráfico Variabilidad */}
            <ChartCard
                title="📉 Variabilidad (Desviación Estándar)"
                showPIARImpact={piarStates.variabilidad}
                onTogglePIAR={() => togglePIAR('variabilidad')}
            >
                <Bar
                    data={variabilidadChartData}
                    options={{
                        ...getChartOptions(piarStates.variabilidad),
                        plugins: {
                            ...getChartOptions(piarStates.variabilidad).plugins,
                            datalabels: {
                                ...baseOptions.plugins.datalabels,
                                formatter: (v) => parseFloat(v).toFixed(2)
                            }
                        }
                    }}
                />
            </ChartCard>

            {/* Gráficos por Área */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Desglose por Asignatura</h3>
                <div className="grid grid-cols-1 gap-6">
                    {Object.entries(AREA_NAMES).map(([key, name]) => (
                        <div key={key} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: COLORS.areas[key] }}
                                    ></span>
                                    <h4 className="font-bold text-gray-700">{name}</h4>
                                </div>
                                <button
                                    onClick={() => togglePIAR(key)}
                                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${piarStates[key] ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {piarStates[key] ? <Eye size={12} /> : <EyeOff size={12} />}
                                    Ver impacto PIAR
                                </button>
                            </div>
                            <div className="h-[280px]">
                                <Bar
                                    data={areaChartData[key]}
                                    options={areaOptions(piarStates[key], COLORS.areas[key])}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GradeEvolution;
