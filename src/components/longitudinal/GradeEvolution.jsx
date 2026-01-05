/**
 * GradeEvolution - Dashboard de evolución a nivel de grado
 * 
 * Muestra métricas globales del grado a través de las pruebas:
 * - Gráfico de evolución del promedio global
 * - Gráficos de evolución POR CADA ÁREA (separados)
 * - Tabla de métricas por prueba
 * - Toggle PIAR
 */

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3, LayoutGrid } from 'lucide-react';

// Colores consistentes 
const AREA_COLORS = {
    lectura: '#3b82f6', // Azul
    matematicas: '#ef4444', // Rojo
    sociales: '#f97316', // Naranja
    naturales: '#22c55e', // Verde
    ingles: '#a855f7' // Morado
};

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
    const [showPIAR, setShowPIAR] = useState(true);

    // Calcular métricas CON y SIN PIAR
    const metricsConPIAR = useMemo(() => analysis.getGradeMetrics(false), [analysis]);
    const metricsSinPIAR = useMemo(() => analysis.getGradeMetrics(true), [analysis]);

    // Preparar datos para gráfico de evolución global
    const chartDataGlobal = useMemo(() => {
        return metricsConPIAR.map((m, idx) => ({
            prueba: m.pruebaNombre,
            'Con PIAR': parseFloat(m.promedioGlobal.toFixed(2)),
            'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.promedioGlobal.toFixed(2) || 0),
            estudiantes: m.totalEstudiantes
        }));
    }, [metricsConPIAR, metricsSinPIAR]);

    // Preparar datos para gráfico de desviación
    const chartDataDesviacion = useMemo(() => {
        return metricsConPIAR.map((m, idx) => ({
            prueba: m.pruebaNombre,
            'Con PIAR': parseFloat(m.desviacionGlobal.toFixed(2)),
            'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.desviacionGlobal.toFixed(2) || 0)
        }));
    }, [metricsConPIAR, metricsSinPIAR]);

    // Preparar datos por ÁREA (un dataset por área)
    const chartsByArea = useMemo(() => {
        const areaKeys = Object.keys(AREA_NAMES);

        return areaKeys.map(areaKey => {
            const data = metricsConPIAR.map((m, idx) => ({
                prueba: m.pruebaNombre,
                'Con PIAR': parseFloat(m.areas[areaKey]?.promedio?.toFixed(2) || 0),
                'Sin PIAR': parseFloat(metricsSinPIAR[idx]?.areas[areaKey]?.promedio?.toFixed(2) || 0)
            }));

            return {
                areaKey,
                title: AREA_NAMES[areaKey],
                color: AREA_COLORS[areaKey],
                data
            };
        });
    }, [metricsConPIAR, metricsSinPIAR]);

    // Calcular cambio entre primera y última prueba
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
            {/* Header con resumen y toggle PIAR */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <BarChart3 size={28} />
                        <h2 className="text-2xl font-bold">Evolución del Grado</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-100">Comparar con/sin PIAR:</span>
                        <button
                            onClick={() => setShowPIAR(!showPIAR)}
                            className={`px-4 py-2 rounded-lg transition-all ${showPIAR
                                    ? 'bg-white text-blue-600 font-medium'
                                    : 'bg-blue-500/30 text-white'
                                }`}
                        >
                            {showPIAR ? 'Comparación activa' : 'Comparación desactivada'}
                        </button>
                    </div>
                </div>

                {/* Resumen */}
                {cambioGlobal !== null && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Primera prueba</p>
                            <p className="text-2xl font-bold">{metricsSinPIAR[0].promedioGlobal.toFixed(1)}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Última prueba</p>
                            <p className="text-2xl font-bold">{metricsSinPIAR[metricsSinPIAR.length - 1].promedioGlobal.toFixed(1)}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Cambio Neto</p>
                            <p className={`text-2xl font-bold flex items-center gap-2 ${cambioGlobal >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {getTrendIcon(cambioGlobal)}
                                {cambioGlobal >= 0 ? '+' : ''}{cambioGlobal.toFixed(1)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 1. Evolución Global y Desviación (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Promedio Global</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartDataGlobal}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="prueba" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip formatter={(value) => value.toFixed(2)} />
                            <Legend />
                            {showPIAR ? (
                                <>
                                    <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.6}>
                                        <LabelList position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                    <Bar dataKey="Sin PIAR" fill="#6366f1">
                                        <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                </>
                            ) : (
                                <Bar dataKey="Sin PIAR">
                                    <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                    {chartDataGlobal.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getPruebaColor(index)} />
                                    ))}
                                </Bar>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Variabilidad (Desviación Estándar)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartDataDesviacion}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="prueba" />
                            <YAxis domain={[0, 'auto']} />
                            <Tooltip formatter={(value) => value.toFixed(2)} />
                            <Legend />
                            {showPIAR ? (
                                <>
                                    <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.6}>
                                        <LabelList position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={v => v.toFixed(2)} />
                                    </Bar>
                                    <Bar dataKey="Sin PIAR" fill="#f97316">
                                        <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(2)} />
                                    </Bar>
                                </>
                            ) : (
                                <Bar dataKey="Sin PIAR" fill="#f97316">
                                    <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(2)} />
                                </Bar>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Sección Evolución por Área (GRID: 1 gráfico por área) */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <LayoutGrid size={24} className="text-blue-600" />
                        Evolución por Asignatura
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chartsByArea.map((chartInfo) => (
                        <div key={chartInfo.areaKey} className="flex flex-col">
                            <h4 className="text-center font-bold text-gray-700 mb-2">{chartInfo.title}</h4>
                            <div className="h-[250px] w-full bg-gray-50 rounded-lg p-2 border border-gray-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartInfo.data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="prueba" fontSize={11} interval={0} />
                                        <YAxis domain={[0, 100]} fontSize={11} width={30} />
                                        <Tooltip formatter={v => v.toFixed(1)} />
                                        {/* Solo mostramos leyenda en el primer gráfico para ahorrar espacio si se desea, 
                                    pero aquí la dejaremos para claridad individual */}
                                        <Legend wrapperStyle={{ fontSize: '10px' }} />

                                        {showPIAR ? (
                                            <>
                                                <Bar dataKey="Con PIAR" fill="#9ca3af" opacity={0.5} name="Con PIAR" barSize={30}>
                                                    <LabelList position="top" style={{ fontSize: '9px', fill: '#6b7280' }} formatter={v => v.toFixed(1)} />
                                                </Bar>
                                                <Bar dataKey="Sin PIAR" fill={chartInfo.color} name="Sin PIAR" barSize={30}>
                                                    <LabelList position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                                </Bar>
                                            </>
                                        ) : (
                                            <Bar dataKey="Sin PIAR" fill={chartInfo.color} name="Promedio" barSize={40}>
                                                <LabelList position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                            </Bar>
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabla resumen detallada */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tabla de Datos</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Prueba</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Promedio (Sin PIAR)</th>
                                {showPIAR && <th className="px-4 py-3 font-semibold text-gray-500 text-center">Promedio (Con PIAR)</th>}
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Desviación (Sin PIAR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metricsSinPIAR.map((m, idx) => (
                                <tr key={m.pruebaId} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getPruebaColor(idx) }}></span>
                                        {m.pruebaNombre}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-blue-700 text-base">{m.promedioGlobal.toFixed(2)}</td>
                                    {showPIAR && <td className="px-4 py-3 text-center text-gray-500">{metricsConPIAR[idx].promedioGlobal.toFixed(2)}</td>}
                                    <td className="px-4 py-3 text-center text-gray-600">{m.desviacionGlobal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GradeEvolution;
