/**
 * GradeEvolution - Dashboard de evolución a nivel de grado
 * 
 * Muestra métricas globales del grado a través de las pruebas:
 * - Gráfico de evolución del promedio global
 * - Gráfico de evolución por área 
 * - Tabla de métricas por prueba
 * - Toggle PIAR siguiendo el patrón de ChartsPanel
 */

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

// Colores por área y prueba (consistentes con ChartsPanel)
const AREA_COLORS = {
    lectura: '#3b82f6', // Azul
    matematicas: '#ef4444', // Rojo
    sociales: '#f97316', // Naranja
    naturales: '#22c55e', // Verde
    ingles: '#a855f7' // Morado
};

// Colores para las pruebas en el gráfico global (secuenciales)
const PRUEBA_COLORS = [
    '#3b82f6', // Azul
    '#22c55e', // Verde
    '#a855f7', // Morado
    '#f97316', // Naranja
    '#ec4899', // Rosa
    '#14b8a6', // Teal
];

const AREA_NAMES = {
    lectura: 'Lectura',
    matematicas: 'Matemáticas',
    sociales: 'Sociales',
    naturales: 'Naturales',
    ingles: 'Inglés'
};

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

    // Preparar datos para gráfico por área
    const chartDataAreas = useMemo(() => {
        const areas = Object.keys(metricsConPIAR[0]?.areas || {});
        return areas.map(areaId => {
            const data = {
                area: AREA_NAMES[areaId] || areaId,
                areaId,
            };

            // Añadir datos para cada prueba (Con y Sin PIAR)
            metricsConPIAR.forEach((m, idx) => {
                data[`${m.pruebaNombre} (Con PIAR)`] = parseFloat(m.areas[areaId]?.promedio?.toFixed(2) || 0);
                data[`${m.pruebaNombre} (Sin PIAR)`] = parseFloat(metricsSinPIAR[idx]?.areas[areaId]?.promedio?.toFixed(2) || 0);
            });
            return data;
        });
    }, [metricsConPIAR, metricsSinPIAR]);

    // Calcular cambio entre primera y última prueba
    const cambioGlobal = useMemo(() => {
        if (metricsSinPIAR.length < 2) return null;
        const primera = metricsSinPIAR[0].promedioGlobal;
        const ultima = metricsSinPIAR[metricsSinPIAR.length - 1].promedioGlobal;
        return ultima - primera;
    }, [metricsSinPIAR]);

    // Icono de tendencia
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
        <div className="space-y-6">
            {/* Header con resumen y toggle PIAR */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <BarChart3 size={28} />
                        <h2 className="text-2xl font-bold">Evolución del Grado</h2>
                    </div>

                    {/* Toggle PIAR */}
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
                            <p className="text-xs text-blue-200">{metricsSinPIAR[0].pruebaNombre}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Última prueba</p>
                            <p className="text-2xl font-bold">{metricsSinPIAR[metricsSinPIAR.length - 1].promedioGlobal.toFixed(1)}</p>
                            <p className="text-xs text-blue-200">{metricsSinPIAR[metricsSinPIAR.length - 1].pruebaNombre}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Cambio</p>
                            <p className={`text-2xl font-bold flex items-center gap-2 ${cambioGlobal >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {getTrendIcon(cambioGlobal)}
                                {cambioGlobal >= 0 ? '+' : ''}{cambioGlobal.toFixed(1)}
                            </p>
                            <p className="text-xs text-blue-200">puntos (sin PIAR)</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Gráfico de evolución global */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Evolución del Promedio Global</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataGlobal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="prueba" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => value.toFixed(2)} />
                        <Legend />
                        {showPIAR ? (
                            <>
                                <Bar dataKey="Con PIAR" fill="#9ca3af">
                                    <LabelList dataKey="Con PIAR" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#6b7280' }} formatter={(v) => v.toFixed(1)} />
                                </Bar>
                                <Bar dataKey="Sin PIAR">
                                    {chartDataGlobal.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getPruebaColor(index)} />
                                    ))}
                                    <LabelList dataKey="Sin PIAR" position="top" style={{ fontSize: '11px', fontWeight: 'bold' }} formatter={(v) => v.toFixed(1)} />
                                </Bar>
                            </>
                        ) : (
                            <Bar dataKey="Sin PIAR">
                                {chartDataGlobal.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getPruebaColor(index)} />
                                ))}
                                <LabelList dataKey="Sin PIAR" position="top" style={{ fontSize: '11px', fontWeight: 'bold' }} formatter={(v) => v.toFixed(1)} />
                            </Bar>
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de evolución por área - COHERENTE CON CHARTSPANEL */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Evolución por Área</h3>
                <ResponsiveContainer width="100%" height={350}>
                    {/* Aquí invertimos la lógica: Agrupamos por prueba en lugar de por área, o usamos la lógica de ChartsPanel */}
                    {/* La lógica de ChartsPanel es: XAxis=Area, Barras=Con/Sin PIAR. Aquí tenemos MULTIPLES pruebas */}
                    {/* Solución: Iteramos sobre las áreas en XAxis, y mostramos una barra por cada PRUEBA (sin PIAR) o par de barras (con/sin) */}
                    <BarChart data={chartDataAreas}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="area" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => value.toFixed(2)} />
                        <Legend />

                        {/* Renderizar barras para cada prueba */}
                        {metricsConPIAR.map((m, idx) => {
                            const pruebaColor = getPruebaColor(idx);

                            return showPIAR ? (
                                // Si hay PIAR, mostramos par de barras por prueba: Con PIAR (gris/transparente) y Sin PIAR (color solido)
                                // Nota: esto puede saturar el gráfico si hay muchas pruebas.
                                // Alternativa: Solo mostrar Sin PIAR por defecto y un toggle global. Pero el usuario pidió toggle.
                                <>
                                    {/* Barra Con PIAR (grisácea, un poco transparente) */}
                                    <Bar
                                        key={`${m.pruebaNombre}-con`}
                                        dataKey={`${m.pruebaNombre} (Con PIAR)`}
                                        name={`${m.pruebaNombre} (Con PIAR)`}
                                        fill="#9ca3af"
                                        opacity={0.6}
                                    >
                                        <LabelList position="top" style={{ fontSize: '9px', fill: '#6b7280' }} formatter={v => v.toFixed(1)} />
                                    </Bar>

                                    {/* Barra Sin PIAR (color sólido) */}
                                    <Bar
                                        key={`${m.pruebaNombre}-sin`}
                                        dataKey={`${m.pruebaNombre} (Sin PIAR)`}
                                        name={`${m.pruebaNombre} (Sin PIAR)`}
                                        fill={pruebaColor}
                                    >
                                        <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                </>
                            ) : (
                                // Solo Sin PIAR
                                <Bar
                                    key={`${m.pruebaNombre}-sin`}
                                    dataKey={`${m.pruebaNombre} (Sin PIAR)`}
                                    name={m.pruebaNombre}
                                    fill={pruebaColor}
                                >
                                    <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                </Bar>
                            );
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla resumen */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen por Prueba</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Prueba</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Estudiantes</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Promedio (sin PIAR)</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Desv. Est. (sin PIAR)</th>
                                {showPIAR && (
                                    <>
                                        <th className="px-4 py-3 font-semibold text-gray-500 text-center">Promedio (con PIAR)</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 text-center">Desv. Est. (con PIAR)</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {metricsSinPIAR.map((m, idx) => {
                                const color = getPruebaColor(idx);
                                return (
                                    <tr key={m.pruebaId} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                                            {m.pruebaNombre}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600">{m.totalEstudiantes}</td>
                                        <td className="px-4 py-3 text-center font-semibold text-blue-600">{m.promedioGlobal.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-center text-gray-600">{m.desviacionGlobal.toFixed(2)}</td>
                                        {showPIAR && (
                                            <>
                                                <td className="px-4 py-3 text-center text-gray-400">{metricsConPIAR[idx].promedioGlobal.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center text-gray-400">{metricsConPIAR[idx].desviacionGlobal.toFixed(2)}</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GradeEvolution;
