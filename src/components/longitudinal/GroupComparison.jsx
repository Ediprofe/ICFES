/**
 * GroupComparison - Comparativa entre grupos del grado
 * 
 * Muestra:
 * - Selector de grupos para comparar
 * - Toggle PIAR
 * - Gráficos de barras comparativos entre grupos
 * - Ranking de grupos por promedio
 */

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Users, Award } from 'lucide-react';

// Colores para grupos
const GROUP_COLORS = [
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
export function GroupComparison({ analysis }) {
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedPrueba, setSelectedPrueba] = useState(null);
    const [showPIAR, setShowPIAR] = useState(true);

    // Inicializar con todos los grupos seleccionados
    useEffect(() => {
        if (analysis.grupos?.length > 0 && selectedGroups.length === 0) {
            setSelectedGroups(analysis.grupos);
        }
        if (analysis.pruebas?.length > 0 && !selectedPrueba) {
            setSelectedPrueba(analysis.pruebas[analysis.pruebas.length - 1]?.id);
        }
    }, [analysis, selectedGroups.length, selectedPrueba]);

    // Obtener métricas por grupo (con y sin PIAR)
    const groupMetricsConPIAR = useMemo(() => analysis.getGroupMetrics(null, false), [analysis]);
    const groupMetricsSinPIAR = useMemo(() => analysis.getGroupMetrics(null, true), [analysis]);

    // Métricas del grado para referencia (promedio)
    const gradeMetricsSinPIAR = useMemo(() => analysis.getGradeMetrics(true), [analysis]);

    // Ranking de la prueba seleccionada (usando siempre Sin PIAR para ranking oficial)
    const ranking = useMemo(() => {
        if (!selectedPrueba) return [];
        return analysis.getGroupRanking(selectedPrueba, true);
    }, [analysis, selectedPrueba]);

    // Preparar datos para gráfico
    const chartDataByPrueba = useMemo(() => {
        return analysis.pruebas.map(p => {
            const data = { prueba: p.nombre };
            selectedGroups.forEach(grupo => {
                // Obtener datos Con PIAR
                const metricsCon = groupMetricsConPIAR[grupo]?.find(m => m.pruebaId === p.id);
                data[`${grupo} (Con PIAR)`] = metricsCon ? parseFloat(metricsCon.promedioGlobal.toFixed(2)) : 0;

                // Obtener datos Sin PIAR
                const metricsSin = groupMetricsSinPIAR[grupo]?.find(m => m.pruebaId === p.id);
                data[`${grupo} (Sin PIAR)`] = metricsSin ? parseFloat(metricsSin.promedioGlobal.toFixed(2)) : 0;
            });

            // Agregar promedio del grado como referencia
            const gradeMetric = gradeMetricsSinPIAR.find(m => m.pruebaId === p.id);
            data['Promedio Grado'] = gradeMetric ? parseFloat(gradeMetric.promedioGlobal.toFixed(2)) : 0;

            return data;
        });
    }, [analysis.pruebas, selectedGroups, groupMetricsConPIAR, groupMetricsSinPIAR, gradeMetricsSinPIAR]);

    const toggleGroup = (grupo) => {
        setSelectedGroups(prev =>
            prev.includes(grupo)
                ? prev.filter(g => g !== grupo)
                : [...prev, grupo]
        );
    };

    const getGroupColor = (grupo) => {
        const idx = analysis.grupos.indexOf(grupo);
        return GROUP_COLORS[idx % GROUP_COLORS.length];
    };

    if (!analysis.grupos || analysis.grupos.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                No hay grupos para comparar
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con selector de grupos y toggle PIAR */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Users className="text-purple-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Comparativa de Grupos</h2>
                    </div>

                    {/* Toggle PIAR */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Comparar con/sin PIAR:</span>
                        <button
                            onClick={() => setShowPIAR(!showPIAR)}
                            className={`px-4 py-2 rounded-lg transition-all ${showPIAR
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {showPIAR ? 'Comparación activa' : 'Comparación desactivada'}
                        </button>
                    </div>
                </div>

                {/* Selector de grupos */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {analysis.grupos.map((grupo) => {
                        const isSelected = selectedGroups.includes(grupo);
                        const color = getGroupColor(grupo);

                        return (
                            <button
                                key={grupo}
                                onClick={() => toggleGroup(grupo)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2`}
                                style={{
                                    backgroundColor: isSelected ? color : 'transparent',
                                    borderColor: color,
                                    color: isSelected ? 'white' : color
                                }}
                            >
                                {grupo}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Gráfico comparativo de evolución */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Evolución Comparativa de Grupos</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartDataByPrueba} barGap={0} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="prueba" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => value.toFixed(2)} />
                        <Legend />

                        {/* Barras por grupo seleccionado */}
                        {selectedGroups.map((grupo) => {
                            const color = getGroupColor(grupo);

                            return showPIAR ? (
                                // Renderizar par de barras si PIAR activo
                                [
                                    <Bar
                                        key={`${grupo}-con`}
                                        dataKey={`${grupo} (Con PIAR)`}
                                        fill="#9ca3af" // Gris neutro
                                        opacity={0.6}
                                        radius={[4, 4, 0, 0]}
                                    >
                                        <LabelList position="top" style={{ fontSize: '9px', fill: '#6b7280' }} formatter={v => v.toFixed(1)} />
                                    </Bar>,
                                    <Bar
                                        key={`${grupo}-sin`}
                                        dataKey={`${grupo} (Sin PIAR)`}
                                        fill={color}
                                        radius={[4, 4, 0, 0]}
                                    >
                                        <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                ]
                            ) : (
                                // Solo barra Sin PIAR
                                <Bar
                                    key={`${grupo}-sin`}
                                    dataKey={`${grupo} (Sin PIAR)`}
                                    name={grupo}
                                    fill={color}
                                    radius={[4, 4, 0, 0]}
                                >
                                    <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={v => v.toFixed(1)} />
                                </Bar>
                            );
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla comparativa detallada */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle por Grupo y Prueba</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Grupo</th>
                                {analysis.pruebas.map(p => (
                                    <th key={p.id} className="px-4 py-3 font-semibold text-gray-700 text-center" colSpan={showPIAR ? 2 : 1}>
                                        {p.nombre}
                                    </th>
                                ))}
                            </tr>
                            {showPIAR && (
                                <tr className="bg-gray-50 text-xs text-gray-500">
                                    <th></th>
                                    {analysis.pruebas.map(p => (
                                        <>
                                            <th key={`${p.id}-sin`} className="pb-2 text-center">Sin PIAR</th>
                                            <th key={`${p.id}-con`} className="pb-2 text-center text-gray-400">Con PIAR</th>
                                        </>
                                    ))}
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {selectedGroups.map((grupo) => {
                                const metricsCon = groupMetricsConPIAR[grupo];
                                const metricsSin = groupMetricsSinPIAR[grupo];
                                const color = getGroupColor(grupo);

                                return (
                                    <tr key={grupo} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                                            {grupo}
                                        </td>
                                        {analysis.pruebas.map((p, idx) => {
                                            const mSin = metricsSin?.find(m => m.pruebaId === p.id);
                                            const mCon = metricsCon?.find(m => m.pruebaId === p.id);

                                            return showPIAR ? (
                                                <>
                                                    <td key={`${p.id}-sin`} className="px-2 py-3 text-center border-l border-gray-100">
                                                        <span className="font-bold text-gray-800">{mSin?.promedioGlobal.toFixed(1) || '-'}</span>
                                                    </td>
                                                    <td key={`${p.id}-con`} className="px-2 py-3 text-center text-gray-400 border-r border-gray-100">
                                                        {mCon?.promedioGlobal.toFixed(1) || '-'}
                                                    </td>
                                                </>
                                            ) : (
                                                <td key={`${p.id}-sin`} className="px-4 py-3 text-center border-l border-r border-gray-100">
                                                    <span className="font-bold text-gray-800">{mSin?.promedioGlobal.toFixed(1) || '-'}</span>
                                                    <div className="text-xs text-gray-500">σ {mSin?.desviacionGlobal.toFixed(1)}</div>
                                                </td>
                                            );
                                        })}
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

export default GroupComparison;
