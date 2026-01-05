/**
 * GroupComparison - Comparativa entre grupos del grado
 * 
 * Lógica "Profesional" (Single Chart + Toggle):
 * - Muestra un ÚNICO gráfico longitudinal (X=Prueba, Barras=Grupos).
 * - "Resultados limpiamente lado a lado" en lugar de apilados verticalmente.
 * - Toggle "Ver Impacto PIAR":
 *   - OFF: Solo muestra barras Sin PIAR (Limpieza total).
 *   - ON: Muestra comparativa Con vs Sin PIAR (Detalle).
 * - Esto cumple: "Ver en una sola gráfica... mete toggle que oculte PIAR".
 */

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Users, BarChart2, Eye, EyeOff } from 'lucide-react';

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
    const [showPIARComparison, setShowPIARComparison] = useState(false);

    // Inicializar con todos los grupos seleccionados
    useEffect(() => {
        if (analysis.grupos?.length > 0 && selectedGroups.length === 0) {
            setSelectedGroups(analysis.grupos);
        }
    }, [analysis, selectedGroups.length]);

    // Obtener métricas
    const groupMetricsConPIAR = useMemo(() => analysis.getGroupMetrics(null, false), [analysis]);
    const groupMetricsSinPIAR = useMemo(() => analysis.getGroupMetrics(null, true), [analysis]);

    // Preparar datos para gráfico LONGITUDINAL CLÁSICO
    const chartData = useMemo(() => {
        return analysis.pruebas.map(p => {
            const dataRow = {
                prueba: p.nombre,
                pruebaId: p.id
            };

            selectedGroups.forEach(grupo => {
                // Obtener datos Con PIAR
                const mCon = groupMetricsConPIAR[grupo]?.find(m => m.pruebaId === p.id);
                // Obtener datos Sin PIAR
                const mSin = groupMetricsSinPIAR[grupo]?.find(m => m.pruebaId === p.id);

                // Nombres de clave para Recharts
                dataRow[`${grupo} (Con PIAR)`] = mCon ? parseFloat(mCon.promedioGlobal.toFixed(2)) : 0;
                dataRow[`${grupo} (Sin PIAR)`] = mSin ? parseFloat(mSin.promedioGlobal.toFixed(2)) : 0;
                dataRow[grupo] = mSin ? parseFloat(mSin.promedioGlobal.toFixed(2)) : 0; // Dato base limpio
            });

            return dataRow;
        });
    }, [analysis.pruebas, selectedGroups, groupMetricsConPIAR, groupMetricsSinPIAR]);

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
            {/* Header y Filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Comparativa de Grupos</h2>
                            <p className="text-sm text-gray-500">Evolución longitudinal por grupo</p>
                        </div>
                    </div>

                    {/* Toggle PIAR */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <span className="text-sm font-medium text-gray-600">
                            {showPIARComparison ? 'Ocultar Estudiantes PIAR' : 'Ver Impacto PIAR'}
                        </span>
                        <button
                            onClick={() => setShowPIARComparison(!showPIARComparison)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${showPIARComparison ? 'bg-purple-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPIARComparison ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        {showPIARComparison ? <Eye size={18} className="text-purple-600" /> : <EyeOff size={18} className="text-gray-400" />}
                    </div>
                </div>

                {/* Filtro Grupos */}
                <div>
                    <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">Grupos Visibles</p>
                    <div className="flex flex-wrap gap-2">
                        {analysis.grupos.map((grupo) => {
                            const isSelected = selectedGroups.includes(grupo);
                            const color = getGroupColor(grupo);

                            return (
                                <button
                                    key={grupo}
                                    onClick={() => toggleGroup(grupo)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all border shadow-sm ${isSelected ? 'bg-white' : 'bg-gray-50 text-gray-400 border-transparent'
                                        }`}
                                    style={{
                                        borderColor: isSelected ? color : 'transparent',
                                        color: isSelected ? color : 'inherit',
                                        boxShadow: isSelected ? `0 2px 5px ${color}30` : 'none'
                                    }}
                                >
                                    {grupo}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* GRÁFICO PRINCIPAL UNIFICADO */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <BarChart2 size={20} className="text-gray-400" />
                        Evolución Comparativa
                    </h3>
                </div>

                {/* Scroll Horizontal Inteliigente si hay muchas barras */}
                <div className="overflow-x-auto pb-2">
                    <div style={{ minWidth: '100%', width: selectedGroups.length * analysis.pruebas.length > 12 ? '150%' : '100%' }}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="prueba"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={40}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    formatter={(value) => value.toFixed(2)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />

                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

                                {selectedGroups.map(grupo => {
                                    const color = getGroupColor(grupo);

                                    return showPIARComparison ? (
                                        // MODO COMPARATIVO: Muestra par para cada grupo
                                        [
                                            <Bar
                                                key={`${grupo}-con`}
                                                dataKey={`${grupo} (Con PIAR)`}
                                                name={`${grupo} (Con PIAR)`}
                                                fill="#9ca3af" // Gris
                                                opacity={0.5}
                                                radius={[4, 4, 0, 0]}
                                            >
                                                <LabelList position="top" style={{ fontSize: '9px', fill: '#9ca3af' }} formatter={v => v.toFixed(1)} />
                                            </Bar>,
                                            <Bar
                                                key={`${grupo}-sin`}
                                                dataKey={`${grupo} (Sin PIAR)`}
                                                name={`${grupo} (Sin PIAR)`}
                                                fill={color}
                                                radius={[4, 4, 0, 0]}
                                            >
                                                <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(1)} />
                                            </Bar>
                                        ]
                                    ) : (
                                        // MODO LIMPIO: Una barra por grupo
                                        <Bar
                                            key={grupo}
                                            dataKey={grupo} // Usa la clave limpia sin sufijo para el nombre en tooltip
                                            name={grupo}
                                            fill={color}
                                            radius={[4, 4, 0, 0]}
                                            barSize={60} // Barras más anchas y bonitas
                                        >
                                            <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(1)} />
                                        </Bar>
                                    );
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tabla Detallada */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Matriz de Resultados</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Grupo</th>
                                {analysis.pruebas.map(p => (
                                    <th key={p.id} className="px-4 py-3 font-semibold text-gray-700 text-center" colSpan={showPIARComparison ? 2 : 1}>
                                        {p.nombre}
                                    </th>
                                ))}
                            </tr>
                            {showPIARComparison && (
                                <tr className="bg-gray-50 text-xs text-gray-500">
                                    <th></th>
                                    {analysis.pruebas.map(p => (
                                        <>
                                            <th key={`${p.id}-sin`} className="pb-2 text-center text-gray-800">Sin PIAR</th>
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
                                            <span className="w-2 h-8 rounded-full" style={{ backgroundColor: color }}></span>
                                            {grupo}
                                        </td>
                                        {analysis.pruebas.map((p, idx) => {
                                            const mSin = metricsSin?.find(m => m.pruebaId === p.id);
                                            const mCon = metricsCon?.find(m => m.pruebaId === p.id);

                                            return showPIARComparison ? (
                                                <>
                                                    <td key={`${p.id}-sin`} className="px-2 py-3 text-center border-l border-gray-100">
                                                        <span className="font-bold text-gray-800 text-base">{mSin?.promedioGlobal.toFixed(1) || '-'}</span>
                                                    </td>
                                                    <td key={`${p.id}-con`} className="px-2 py-3 text-center text-gray-400 border-r border-gray-100">
                                                        {mCon?.promedioGlobal.toFixed(1) || '-'}
                                                    </td>
                                                </>
                                            ) : (
                                                <td key={`${p.id}-sin`} className="px-4 py-3 text-center border-l border-r border-gray-100">
                                                    <span className="font-bold text-gray-800 text-base">{mSin?.promedioGlobal.toFixed(1) || '-'}</span>
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
