/**
 * GroupComparison - Comparativa entre grupos del grado
 * 
 * Mejoras implementadas:
 * 1. Contenedor a ancho completo de pantalla
 * 2. Gráfica principal a ancho completo
 * 3. Toggle PIAR individual por gráfica (usando ChartCard)
 */

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Users } from 'lucide-react';
import { ChartCard } from './ChartCard';

// Colores para grupos
const GROUP_COLORS = [
    '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6',
];

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GroupComparison({ analysis }) {
    const [selectedGroups, setSelectedGroups] = useState([]);

    // Inicializar con todos los grupos seleccionados
    useEffect(() => {
        if (analysis.grupos?.length > 0 && selectedGroups.length === 0) {
            setSelectedGroups(analysis.grupos);
        }
    }, [analysis, selectedGroups.length]);

    // Obtener métricas
    const groupMetricsConPIAR = useMemo(() => analysis.getGroupMetrics(null, false), [analysis]);
    const groupMetricsSinPIAR = useMemo(() => analysis.getGroupMetrics(null, true), [analysis]);

    // Preparar datos para gráfico LONGITUDINAL
    const chartData = useMemo(() => {
        return analysis.pruebas.map(p => {
            const dataRow = { prueba: p.nombre, pruebaId: p.id };

            selectedGroups.forEach(grupo => {
                const mCon = groupMetricsConPIAR[grupo]?.find(m => m.pruebaId === p.id);
                const mSin = groupMetricsSinPIAR[grupo]?.find(m => m.pruebaId === p.id);

                dataRow[`${grupo} (Con PIAR)`] = mCon ? parseFloat(mCon.promedioGlobal.toFixed(2)) : 0;
                dataRow[`${grupo} (Sin PIAR)`] = mSin ? parseFloat(mSin.promedioGlobal.toFixed(2)) : 0;
                dataRow[grupo] = mSin ? parseFloat(mSin.promedioGlobal.toFixed(2)) : 0;
            });

            return dataRow;
        });
    }, [analysis.pruebas, selectedGroups, groupMetricsConPIAR, groupMetricsSinPIAR]);

    const toggleGroup = (grupo) => {
        setSelectedGroups(prev =>
            prev.includes(grupo) ? prev.filter(g => g !== grupo) : [...prev, grupo]
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
        // CONTENEDOR PRINCIPAL A ANCHO COMPLETO
        <div className="w-full max-w-full space-y-6">

            {/* Header y Filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 w-full">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Comparativa de Grupos</h2>
                        <p className="text-sm text-gray-500">Evolución longitudinal por grupo</p>
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

            {/* GRÁFICA PRINCIPAL - ANCHO COMPLETO con su propio toggle */}
            <ChartCard title="Evolución Comparativa de Grupos">
                {(showPIAR) => (
                    <div className="overflow-x-auto pb-2">
                        <div style={{ minWidth: '100%', width: selectedGroups.length * analysis.pruebas.length > 12 ? '150%' : '100%' }}>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData} barCategoryGap="15%">
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="prueba"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 'bold' }}
                                        dy={10}
                                    />
                                    <YAxis axisLine={false} tickLine={false} width={40} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value) => value.toFixed(2)} />
                                    <Legend wrapperStyle={{ paddingTop: '15px' }} iconType="circle" />

                                    {selectedGroups.map(grupo => {
                                        const color = getGroupColor(grupo);

                                        return showPIAR ? (
                                            [
                                                <Bar
                                                    key={`${grupo}-con`}
                                                    dataKey={`${grupo} (Con PIAR)`}
                                                    name={`${grupo} (Con PIAR)`}
                                                    fill="#9ca3af"
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
                                            <Bar
                                                key={grupo}
                                                dataKey={grupo}
                                                name={grupo}
                                                fill={color}
                                                radius={[4, 4, 0, 0]}
                                                barSize={50}
                                            >
                                                <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(1)} />
                                            </Bar>
                                        );
                                    })}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </ChartCard>

            {/* Tabla Detallada */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Matriz de Resultados</h3>
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
                            </tr>
                        </thead>
                        <tbody>
                            {selectedGroups.map((grupo) => {
                                const metricsSin = groupMetricsSinPIAR[grupo];
                                const color = getGroupColor(grupo);

                                return (
                                    <tr key={grupo} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-8 rounded-full" style={{ backgroundColor: color }}></span>
                                            {grupo}
                                        </td>
                                        {analysis.pruebas.map((p) => {
                                            const mSin = metricsSin?.find(m => m.pruebaId === p.id);

                                            return (
                                                <td key={p.id} className="px-4 py-3 text-center border-l border-r border-gray-100">
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
