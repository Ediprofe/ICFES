/**
 * GradeEvolution - Dashboard de evolución a nivel de grado
 * 
 * Estrategia de Diseño "Profesional":
 * - Mantiene la grilla de gráficos por área (solicitada previa) para claridad.
 * - Implementa un toggle "Mostrar Análisis PIAR" que por defecto está APAGADO.
 *   - OFF: Gráficos limpios con una sola barra por prueba (Sin PIAR).
 *   - ON: Aparecen las barras "Con PIAR" para comparación.
 * - Esto resuelve el problema de "apretado" por defecto, dando control al usuario.
 */

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3, LayoutGrid, Eye, EyeOff } from 'lucide-react';

// Colores consistentes 
const AREA_COLORS = {
    lectura: '#3b82f6', // Azul
    matematicas: '#ef4444', // Rojo
    sociales: '#f97316', // Naranja
    naturales: '#22c55e', // Verde
    ingles: '#a855f7' // Morado
};

// Nombres para mostrar
const AREA_NAMES = {
    lectura: 'Lectura',
    matematicas: 'Matemáticas',
    sociales: 'Sociales',
    naturales: 'Naturales',
    ingles: 'Inglés'
};

const PRUEBA_COLORS = [
    '#3b82f6', // Azul
    '#22c55e', // Verde
    '#a855f7', // Morado
    '#f97316', // Naranja
    '#ec4899', // Rosa
    '#14b8a6', // Teal
];

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GradeEvolution({ analysis }) {
    // Estado para controlar VISIBILIDAD de la comparativa PIAR
    // Por defecto FALSE para que se vea limpio y espacioso
    const [showPIARComparison, setShowPIARComparison] = useState(false);

    // Calcular métricas
    const metricsConPIAR = useMemo(() => analysis.getGradeMetrics(false), [analysis]);
    const metricsSinPIAR = useMemo(() => analysis.getGradeMetrics(true), [analysis]);

    // Datos Globales
    const chartDataGlobal = useMemo(() => {
        return metricsConPIAR.map((m, idx) => ({
            prueba: m.pruebaNombre,
            'Con PIAR': parseFloat(m.promedioGlobal.toFixed(2)),
            'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.promedioGlobal.toFixed(2) || 0),
            // Dato único para visualización limpia
            'Promedio': parseFloat(metricsSinPIAR[idx]?.promedioGlobal.toFixed(2) || 0)
        }));
    }, [metricsConPIAR, metricsSinPIAR]);

    // Datos Desviación
    const chartDataDesviacion = useMemo(() => {
        return metricsConPIAR.map((m, idx) => ({
            prueba: m.pruebaNombre,
            'Con PIAR': parseFloat(m.desviacionGlobal.toFixed(2)),
            'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.desviacionGlobal.toFixed(2) || 0),
            'Desviación': parseFloat(metricsSinPIAR[idx]?.desviacionGlobal.toFixed(2) || 0)
        }));
    }, [metricsConPIAR, metricsSinPIAR]);

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

            return {
                areaKey,
                title: AREA_NAMES[areaKey],
                color: AREA_COLORS[areaKey],
                data
            };
        });
    }, [metricsConPIAR, metricsSinPIAR]);

    // Cambio neto (Metrics Sin PIAR como referencia base estándar)
    const cambioGlobal = useMemo(() => {
        if (metricsSinPIAR.length < 2) return null;
        const primera = metricsSinPIAR[0].promedioGlobal;
        const ultima = metricsSinPIAR[metricsSinPIAR.length - 1].promedioGlobal;
        return ultima - primera;
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
        <div className="space-y-8">
            {/* Header Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Título y controles */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Evolución del Grado</h2>
                            <p className="text-sm text-gray-500">Análisis longitudinal de desempeño promedio</p>
                        </div>
                    </div>

                    {/* Toggle "Profesional" para PIAR */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <span className="text-sm font-medium text-gray-600">
                            {showPIARComparison ? 'Ocultar Estudiantes PIAR' : 'Ver Impacto PIAR'}
                        </span>
                        <button
                            onClick={() => setShowPIARComparison(!showPIARComparison)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showPIARComparison ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPIARComparison ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        {showPIARComparison ? <Eye size={18} className="text-blue-600" /> : <EyeOff size={18} className="text-gray-400" />}
                    </div>
                </div>

                {/* Tarjetas de Resumen (KPIs) */}
                {cambioGlobal !== null && (
                    <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
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

            {/* 1. Evolución Global y Variabilidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart Global */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Promedio Global</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartDataGlobal} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="prueba" tick={{ fill: '#4b5563', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                formatter={(value) => value.toFixed(2)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />

                            {showPIARComparison ? (
                                <>
                                    <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.6} radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                    <Bar dataKey="Sin PIAR" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#1e3a8a' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
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
                </div>

                {/* Chart Variabilidad */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Variabilidad (Desviación Estándar)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartDataDesviacion} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="prueba" tick={{ fill: '#4b5563', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 'auto']} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                formatter={(value) => value.toFixed(2)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />

                            {showPIARComparison ? (
                                <>
                                    <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.6} radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={v => v.toFixed(2)} />
                                    </Bar>
                                    <Bar dataKey="Sin PIAR" fill="#f97316" radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#c2410c' }} formatter={v => v.toFixed(2)} />
                                    </Bar>
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                                </>
                            ) : (
                                <Bar dataKey="Desviación" fill="#f97316" radius={[4, 4, 0, 0]}>
                                    <LabelList position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#c2410c' }} formatter={v => v.toFixed(2)} />
                                </Bar>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Sección Evolución por Área (GRID) 
          Mantenemos la grilla de 3 columnas porque el usuario pidió "un gráfico por asignatura", 
          pero ahora se beneficia del Toggle Global.
      */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <LayoutGrid size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                        Desglose por Asignatura
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chartsByArea.map((chartInfo) => (
                        <div key={chartInfo.areaKey} className="flex flex-col">
                            <h4 className="text-center font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chartInfo.color }}></span>
                                {chartInfo.title}
                            </h4>
                            <div className="h-[250px] w-full bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartInfo.data} barGap={2}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                        <XAxis
                                            dataKey="prueba"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            fontSize={11}
                                            width={30}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip formatter={v => v.toFixed(1)} />

                                        {showPIARComparison ? (
                                            <>
                                                <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.5} radius={[3, 3, 0, 0]}>
                                                    <LabelList position="top" style={{ fontSize: '9px', fill: '#9ca3af' }} formatter={v => v.toFixed(1)} />
                                                </Bar>
                                                <Bar dataKey="Sin PIAR" fill={chartInfo.color} radius={[3, 3, 0, 0]}>
                                                    <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: chartInfo.color }} formatter={v => v.toFixed(1)} />
                                                </Bar>
                                            </>
                                        ) : (
                                            <Bar dataKey="Promedio" fill={chartInfo.color} radius={[3, 3, 0, 0]}>
                                                <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: chartInfo.color }} formatter={v => v.toFixed(1)} />
                                            </Bar>
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GradeEvolution;
