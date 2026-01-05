/**
 * GradeEvolution - Evolución del grado completo
 * 
 * MIGRADO A CHART.JS para fidelidad con HTML export
 */

import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus, Eye, EyeOff } from 'lucide-react';
import {
    COLORS,
    AREA_NAMES,
    baseOptions,
    getOptionsNoLegend,
    getOptionsWithColoredLabels,
    createSingleBarConfig
} from '../../utils/chartConfig';

/**
 * Componente de tarjeta para gráficos con toggle PIAR
 */
function ChartCard({ title, children, showPIAR, onTogglePIAR, hasPIARData = true }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                {hasPIARData && (
                    <button
                        onClick={onTogglePIAR}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${showPIAR ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                            }`}
                    >
                        {showPIAR ? <Eye size={16} /> : <EyeOff size={16} />}
                        {showPIAR ? 'Ocultando PIAR' : 'Incluir PIAR'}
                    </button>
                )}
            </div>
            <div className="h-[350px]">
                {children}
            </div>
        </div>
    );
}

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GradeEvolution({ analysis }) {
    // Estado de toggle PIAR por gráfico
    const [piarStates, setPiarStates] = useState({
        global: true,
        variabilidad: true,
        lectura: true,
        matematicas: true,
        sociales: true,
        naturales: true,
        ingles: true
    });

    const togglePIAR = (key) => {
        setPiarStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Métricas para cada estado de PIAR
    const metricsSinPIAR = useMemo(() => analysis.getGradeMetrics(true), [analysis]);
    const metricsConPIAR = useMemo(() => analysis.getGradeMetrics(false), [analysis]);

    const getMetrics = (excludePIAR) => excludePIAR ? metricsSinPIAR : metricsConPIAR;

    // Datos para gráfico global
    const globalChartData = useMemo(() => {
        const metrics = getMetrics(piarStates.global);
        const labels = metrics.map(m => m.pruebaNombre);
        const values = metrics.map(m => m.promedioGlobal);
        const colors = metrics.map((_, i) => COLORS.pruebas[i % COLORS.pruebas.length]);

        return createSingleBarConfig(labels, values, colors, { label: 'Promedio Global' });
    }, [piarStates.global, metricsSinPIAR, metricsConPIAR]);

    // Datos para gráfico de variabilidad
    const variabilidadChartData = useMemo(() => {
        const metrics = getMetrics(piarStates.variabilidad);
        const labels = metrics.map(m => m.pruebaNombre);
        const values = metrics.map(m => m.desviacionGlobal);

        return createSingleBarConfig(labels, values, '#f97316', { label: 'Desviación Estándar' });
    }, [piarStates.variabilidad, metricsSinPIAR, metricsConPIAR]);

    // Datos para gráficos por área
    const areaChartData = useMemo(() => {
        const result = {};
        Object.keys(AREA_NAMES).forEach(areaKey => {
            const metrics = getMetrics(piarStates[areaKey]);
            const labels = metrics.map(m => m.pruebaNombre);
            const values = metrics.map(m => m.areas[areaKey]?.promedio || 0);

            result[areaKey] = createSingleBarConfig(labels, values, COLORS.areas[areaKey], { label: AREA_NAMES[areaKey] });
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

    // Opciones con escala 0-100 para áreas
    const areaOptions = {
        ...getOptionsNoLegend(),
        scales: {
            ...baseOptions.scales,
            y: { ...baseOptions.scales.y, min: 0, max: 100 }
        }
    };

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
                showPIAR={piarStates.global}
                onTogglePIAR={() => togglePIAR('global')}
            >
                <Bar data={globalChartData} options={getOptionsNoLegend()} />
            </ChartCard>

            {/* Gráfico Variabilidad */}
            <ChartCard
                title="📉 Variabilidad (Desviación Estándar)"
                showPIAR={piarStates.variabilidad}
                onTogglePIAR={() => togglePIAR('variabilidad')}
            >
                <Bar
                    data={variabilidadChartData}
                    options={{
                        ...getOptionsNoLegend(),
                        plugins: {
                            ...getOptionsNoLegend().plugins,
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
                                    PIAR
                                </button>
                            </div>
                            <div className="h-[280px]">
                                <Bar
                                    data={areaChartData[key]}
                                    options={{
                                        ...areaOptions,
                                        plugins: {
                                            ...areaOptions.plugins,
                                            datalabels: {
                                                ...baseOptions.plugins.datalabels,
                                                color: COLORS.areas[key]
                                            }
                                        }
                                    }}
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
