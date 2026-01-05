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

    // Ranking de la prueba seleccionada
    const rankingConPIAR = useMemo(() => {
        if (!selectedPrueba) return [];
        return analysis.getGroupRanking(selectedPrueba, false);
    }, [analysis, selectedPrueba]);

    const rankingSinPIAR = useMemo(() => {
        if (!selectedPrueba) return [];
        return analysis.getGroupRanking(selectedPrueba, true);
    }, [analysis, selectedPrueba]);

    const ranking = showPIAR ? rankingConPIAR : rankingSinPIAR;

    // Preparar datos para gráfico comparativo por prueba
    const chartDataByPrueba = useMemo(() => {
        return analysis.pruebas.map(p => {
            const data = { prueba: p.nombre };
            selectedGroups.forEach(grupo => {
                const metrics = showPIAR ? groupMetricsConPIAR[grupo] : groupMetricsSinPIAR[grupo];
                const pruebaMetrics = metrics?.find(m => m.pruebaId === p.id);
                data[grupo] = pruebaMetrics ? parseFloat(pruebaMetrics.promedioGlobal.toFixed(2)) : 0;
            });
            return data;
        });
    }, [analysis.pruebas, selectedGroups, groupMetricsConPIAR, groupMetricsSinPIAR, showPIAR]);

    // Toggle grupo
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
                            {showPIAR ? 'Incluye PIAR' : 'Excluye PIAR'}
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

                {/* Selector de prueba para ranking */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Ranking para:</span>
                    <select
                        value={selectedPrueba || ''}
                        onChange={(e) => setSelectedPrueba(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                    >
                        {analysis.pruebas.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Gráfico comparativo de evolución */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Evolución Comparativa de Grupos</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartDataByPrueba}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="prueba" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => value.toFixed(2)} />
                        <Legend />
                        {selectedGroups.map((grupo) => (
                            <Bar key={grupo} dataKey={grupo} fill={getGroupColor(grupo)}>
                                <LabelList dataKey={grupo} position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} formatter={(v) => v.toFixed(1)} />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    {showPIAR ? 'Incluye estudiantes con PIAR' : 'Excluye estudiantes con PIAR'}
                </p>
            </div>

            {/* Ranking de grupos */}
            {ranking.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Award className="text-amber-500" size={20} />
                        Ranking: {analysis.pruebas.find(p => p.id === selectedPrueba)?.nombre}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ranking.map((item, idx) => {
                            const isTop = idx === 0;
                            const color = getGroupColor(item.grupo);

                            return (
                                <div
                                    key={item.grupo}
                                    className={`flex items-center gap-4 p-4 rounded-lg ${isTop ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300' : 'bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${isTop ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold" style={{ color }}>{item.grupo}</p>
                                        <p className="text-xs text-gray-500">{item.totalEstudiantes} estudiantes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-800">{item.promedio.toFixed(1)}</p>
                                        <p className="text-xs text-gray-500">promedio</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tabla comparativa detallada */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle por Grupo y Prueba</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Grupo</th>
                                {analysis.pruebas.map(p => (
                                    <th key={p.id} className="px-4 py-3 font-semibold text-gray-700 text-center">
                                        {p.nombre}
                                    </th>
                                ))}
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Δ Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedGroups.map((grupo) => {
                                const metrics = showPIAR ? groupMetricsConPIAR[grupo] : groupMetricsSinPIAR[grupo];
                                if (!metrics) return null;

                                const primera = metrics[0]?.promedioGlobal || 0;
                                const ultima = metrics[metrics.length - 1]?.promedioGlobal || 0;
                                const cambio = ultima - primera;
                                const color = getGroupColor(grupo);

                                return (
                                    <tr key={grupo} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold" style={{ color }}>{grupo}</td>
                                        {metrics.map(m => (
                                            <td key={m.pruebaId} className="px-4 py-3 text-center">
                                                <span className="font-medium text-gray-800">{m.promedioGlobal.toFixed(1)}</span>
                                                <span className="text-xs text-gray-500 block">σ {m.desviacionGlobal.toFixed(1)}</span>
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-semibold ${cambio > 0 ? 'text-green-600' : cambio < 0 ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                {cambio >= 0 ? '+' : ''}{cambio.toFixed(1)}
                                            </span>
                                        </td>
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
