/**
 * GradeEvolution - Dashboard de evolución a nivel de grado
 * 
 * MEJORAS:
 * 1. Dominio Y con padding para que etiquetas no se corten
 * 2. Contenedor a ancho completo
 * 3. Toggle PIAR individual por gráfica
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3, LayoutGrid } from 'lucide-react';
import { ChartCard, getYDomainWithPadding } from './ChartCard';

// Colores consistentes 
const AREA_COLORS = {
    lectura: '#3b82f6',
    matematicas: '#ef4444',
    sociales: '#f97316',
    naturales: '#22c55e',
    ingles: '#a855f7'
};

const AREA_NAMES = {
    lectura: 'Lectura',
    matematicas: 'Matemáticas',
    sociales: 'Sociales',
    naturales: 'Naturales',
    ingles: 'Inglés'
};

const PRUEBA_COLORS = [
    '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6',
];

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GradeEvolution({ analysis }) {
    // Calcular métricas
    const metricsConPIAR = useMemo(() => analysis.getGradeMetrics(false), [analysis]);
    const metricsSinPIAR = useMemo(() => analysis.getGradeMetrics(true), [analysis]);

    // Datos Globales
    const chartDataGlobal = useMemo(() => {
        return metricsConPIAR.map((m, idx) => ({
            prueba: m.pruebaNombre,
            'Con PIAR': parseFloat(m.promedioGlobal.toFixed(2)),
            'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.promedioGlobal.toFixed(2) || 0),
            'Promedio': parseFloat(metricsSinPIAR[idx]?.promedioGlobal.toFixed(2) || 0)
        }));
    }, [metricsConPIAR, metricsSinPIAR]);

    // Max value para dominio Y global
    const maxGlobal = useMemo(() => {
        return Math.max(...chartDataGlobal.flatMap(d => [d['Con PIAR'], d['Sin PIAR']]));
    }, [chartDataGlobal]);

    // Datos Desviación
    const chartDataDesviacion = useMemo(() => {
        return metricsConPIAR.map((m, idx) => ({
            prueba: m.pruebaNombre,
            'Con PIAR': parseFloat(m.desviacionGlobal.toFixed(2)),
            'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.desviacionGlobal.toFixed(2) || 0),
            'Desviación': parseFloat(metricsSinPIAR[idx]?.desviacionGlobal.toFixed(2) || 0)
        }));
    }, [metricsConPIAR, metricsSinPIAR]);

    const maxDesviacion = useMemo(() => {
        return Math.max(...chartDataDesviacion.flatMap(d => [d['Con PIAR'], d['Sin PIAR']]));
    }, [chartDataDesviacion]);

    // Datos por Área
    const chartsByArea = useMemo(() => {
        const areaKeys = Object.keys(AREA_NAMES);

        return areaKeys.map(areaKey => {
            const data = metricsConPIAR.map((m, idx) => ({
                prueba: m.pruebaNombre,
                'Con PIAR': parseFloat(m.areas[areaKey]?.promedio?.toFixed(2) || 0),
                'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.areas[areaKey]?.promedio?.toFixed(2) || 0),
                'Promedio': parseFloat(metricsSinPIAR[idx]?.areas[areaKey]?.promedio?.toFixed(2) || 0)
            }));

            const maxValue = Math.max(...data.flatMap(d => [d['Con PIAR'], d['Sin PIAR']]));

            return { areaKey, title: AREA_NAMES[areaKey], color: AREA_COLORS[areaKey], data, maxValue };
        });
    }, [metricsConPIAR, metricsSinPIAR]);

    // Cambio neto
    const cambioGlobal = useMemo(() => {
        if (metricsSinPIAR.length < 2) return null;
        return metricsSinPIAR[metricsSinPIAR.length - 1].promedioGlobal - metricsSinPIAR[0].promedioGlobal;
    }, [metricsSinPIAR]);

    const getTrendIcon = (value) => {
        if (value > 2) return <TrendingUp className="text-green-500" size={20} />;
        if (value < -2) return <TrendingDown className="text-red-500" size={20} />;
        return <Minus className="text-gray-400" size={20} />;
    };

    const getPruebaColor = (index) => PRUEBA_COLORS[index % PRUEBA_COLORS.length];

    if (!metricsConPIAR || metricsConPIAR.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                No hay datos para mostrar
            </div>
        );
    }

    return (
        <div className="w-full max-w-full space-y-6">

            {/* Header con KPIs */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 w-full">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Evolución del Grado</h2>
                        <p className="text-sm text-gray-500">Análisis longitudinal de desempeño promedio</p>
                    </div>
                </div>

                {cambioGlobal !== null && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Punto de Partida ({metricsSinPIAR[0].pruebaNombre})</p>
                            <p className="text-3xl font-bold text-gray-800">{metricsSinPIAR[0].promedioGlobal.toFixed(1)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Estado Actual ({metricsSinPIAR[metricsSinPIAR.length - 1].pruebaNombre})</p>
                            <p className="text-3xl font-bold text-gray-800">{metricsSinPIAR[metricsSinPIAR.length - 1].promedioGlobal.toFixed(1)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Evolución Neta</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-3xl font-bold ${cambioGlobal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {cambioGlobal >= 0 ? '+' : ''}{cambioGlobal.toFixed(1)}
                                </span>
                                {getTrendIcon(cambioGlobal)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* GRÁFICA 1: Promedio Global */}
            <ChartCard title="Promedio Global">
                {(showPIAR) => (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartDataGlobal} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="prueba" tick={{ fill: '#4b5563', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis domain={getYDomainWithPadding(maxGlobal)} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value) => value.toFixed(2)} />

                            {showPIAR ? (
                                <>
                                    <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.6} radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                    <Bar dataKey="Sin PIAR" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#1e3a8a' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                    <Legend iconType="circle" />
                                </>
                            ) : (
                                <Bar dataKey="Promedio" radius={[4, 4, 0, 0]}>
                                    <LabelList position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#1e3a8a' }} formatter={v => v.toFixed(1)} />
                                    {chartDataGlobal.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getPruebaColor(index)} />
                                    ))}
                                </Bar>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            {/* GRÁFICA 2: Variabilidad */}
            <ChartCard title="Variabilidad (Desviación Estándar)">
                {(showPIAR) => (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartDataDesviacion} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="prueba" tick={{ fill: '#4b5563', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis domain={getYDomainWithPadding(maxDesviacion)} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value) => value.toFixed(2)} />

                            {showPIAR ? (
                                <>
                                    <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.6} radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={v => v.toFixed(2)} />
                                    </Bar>
                                    <Bar dataKey="Sin PIAR" fill="#f97316" radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#c2410c' }} formatter={v => v.toFixed(2)} />
                                    </Bar>
                                    <Legend iconType="circle" />
                                </>
                            ) : (
                                <Bar dataKey="Desviación" fill="#f97316" radius={[4, 4, 0, 0]}>
                                    <LabelList position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#c2410c' }} formatter={v => v.toFixed(2)} />
                                </Bar>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            {/* SECCIÓN: Desglose por Asignatura */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <LayoutGrid size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Desglose por Asignatura</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {chartsByArea.map((chartInfo) => (
                        <ChartCard key={chartInfo.areaKey} title={chartInfo.title}>
                            {(showPIAR) => (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartInfo.data} barGap={2}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                        <XAxis dataKey="prueba" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                                        <YAxis domain={getYDomainWithPadding(chartInfo.maxValue)} fontSize={11} width={35} tickLine={false} axisLine={false} />
                                        <Tooltip formatter={v => v.toFixed(1)} />

                                        {showPIAR ? (
                                            <>
                                                <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.5} radius={[3, 3, 0, 0]}>
                                                    <LabelList position="top" style={{ fontSize: '9px', fill: '#9ca3af' }} formatter={v => v.toFixed(1)} />
                                                </Bar>
                                                <Bar dataKey="Sin PIAR" fill={chartInfo.color} radius={[3, 3, 0, 0]}>
                                                    <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: chartInfo.color }} formatter={v => v.toFixed(1)} />
                                                </Bar>
                                                <Legend iconType="circle" />
                                            </>
                                        ) : (
                                            <Bar dataKey="Promedio" fill={chartInfo.color} radius={[3, 3, 0, 0]}>
                                                <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: chartInfo.color }} formatter={v => v.toFixed(1)} />
                                            </Bar>
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </ChartCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GradeEvolution;
