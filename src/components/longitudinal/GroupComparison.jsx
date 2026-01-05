/**
 * GroupComparison - Comparativa entre grupos del grado
 * 
 * MEJORAS:
 * 1. Mismo desglose por asignatura que GradeEvolution pero separado por grupo
 * 2. Dominio Y con padding para etiquetas
 * 3. Eliminada matriz redundante
 */

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Users, LayoutGrid } from 'lucide-react';
import { ChartCard, getYDomainWithPadding } from './ChartCard';

// Colores para grupos
const GROUP_COLORS = [
    '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6',
];

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

    // Datos para gráfico de Promedio Global por grupo
    const chartDataGlobal = useMemo(() => {
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

    const maxGlobal = useMemo(() => {
        return Math.max(...chartDataGlobal.flatMap(d =>
            selectedGroups.flatMap(g => [d[`${g} (Con PIAR)`] || 0, d[`${g} (Sin PIAR)`] || 0])
        ));
    }, [chartDataGlobal, selectedGroups]);

    // Datos de Desviación por grupo
    const chartDataDesviacion = useMemo(() => {
        return analysis.pruebas.map(p => {
            const dataRow = { prueba: p.nombre };

            selectedGroups.forEach(grupo => {
                const mCon = groupMetricsConPIAR[grupo]?.find(m => m.pruebaId === p.id);
                const mSin = groupMetricsSinPIAR[grupo]?.find(m => m.pruebaId === p.id);

                dataRow[`${grupo} (Con PIAR)`] = mCon ? parseFloat(mCon.desviacionGlobal.toFixed(2)) : 0;
                dataRow[`${grupo} (Sin PIAR)`] = mSin ? parseFloat(mSin.desviacionGlobal.toFixed(2)) : 0;
                dataRow[grupo] = mSin ? parseFloat(mSin.desviacionGlobal.toFixed(2)) : 0;
            });

            return dataRow;
        });
    }, [analysis.pruebas, selectedGroups, groupMetricsConPIAR, groupMetricsSinPIAR]);

    const maxDesviacion = useMemo(() => {
        return Math.max(...chartDataDesviacion.flatMap(d =>
            selectedGroups.flatMap(g => [d[`${g} (Con PIAR)`] || 0, d[`${g} (Sin PIAR)`] || 0])
        ));
    }, [chartDataDesviacion, selectedGroups]);

    // Datos por Área por Grupo (igual que GradeEvolution pero separado por grupo)
    const chartsByArea = useMemo(() => {
        const areaKeys = Object.keys(AREA_NAMES);

        return areaKeys.map(areaKey => {
            const data = analysis.pruebas.map(p => {
                const dataRow = { prueba: p.nombre };

                selectedGroups.forEach(grupo => {
                    const mCon = groupMetricsConPIAR[grupo]?.find(m => m.pruebaId === p.id);
                    const mSin = groupMetricsSinPIAR[grupo]?.find(m => m.pruebaId === p.id);

                    dataRow[`${grupo} (Con PIAR)`] = mCon?.areas?.[areaKey]?.promedio ? parseFloat(mCon.areas[areaKey].promedio.toFixed(2)) : 0;
                    dataRow[`${grupo} (Sin PIAR)`] = mSin?.areas?.[areaKey]?.promedio ? parseFloat(mSin.areas[areaKey].promedio.toFixed(2)) : 0;
                    dataRow[grupo] = mSin?.areas?.[areaKey]?.promedio ? parseFloat(mSin.areas[areaKey].promedio.toFixed(2)) : 0;
                });

                return dataRow;
            });

            const maxValue = Math.max(...data.flatMap(d =>
                selectedGroups.flatMap(g => [d[`${g} (Con PIAR)`] || 0, d[`${g} (Sin PIAR)`] || 0])
            ));

            return { areaKey, title: AREA_NAMES[areaKey], color: AREA_COLORS[areaKey], data, maxValue };
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

            {/* GRÁFICA 1: Promedio Global por Grupo */}
            <ChartCard title="Promedio Global por Grupo">
                {(showPIAR) => (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartDataGlobal} barCategoryGap="15%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="prueba" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 'bold' }} dy={10} />
                            <YAxis domain={getYDomainWithPadding(maxGlobal)} axisLine={false} tickLine={false} width={40} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value) => value.toFixed(2)} />
                            <Legend wrapperStyle={{ paddingTop: '15px' }} iconType="circle" />

                            {selectedGroups.map(grupo => {
                                const color = getGroupColor(grupo);

                                return showPIAR ? (
                                    [
                                        <Bar key={`${grupo}-con`} dataKey={`${grupo} (Con PIAR)`} name={`${grupo} (Con PIAR)`} fill="#9ca3af" opacity={0.5} radius={[4, 4, 0, 0]}>
                                            <LabelList position="top" style={{ fontSize: '9px', fill: '#9ca3af' }} formatter={v => v.toFixed(1)} />
                                        </Bar>,
                                        <Bar key={`${grupo}-sin`} dataKey={`${grupo} (Sin PIAR)`} name={`${grupo} (Sin PIAR)`} fill={color} radius={[4, 4, 0, 0]}>
                                            <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(1)} />
                                        </Bar>
                                    ]
                                ) : (
                                    <Bar key={grupo} dataKey={grupo} name={grupo} fill={color} radius={[4, 4, 0, 0]} barSize={50}>
                                        <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(1)} />
                                    </Bar>
                                );
                            })}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            {/* GRÁFICA 2: Variabilidad por Grupo */}
            <ChartCard title="Variabilidad (Desviación Estándar) por Grupo">
                {(showPIAR) => (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartDataDesviacion} barCategoryGap="15%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="prueba" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} dy={10} />
                            <YAxis domain={getYDomainWithPadding(maxDesviacion)} axisLine={false} tickLine={false} width={40} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value) => value.toFixed(2)} />
                            <Legend wrapperStyle={{ paddingTop: '15px' }} iconType="circle" />

                            {selectedGroups.map(grupo => {
                                const color = getGroupColor(grupo);

                                return showPIAR ? (
                                    [
                                        <Bar key={`${grupo}-con`} dataKey={`${grupo} (Con PIAR)`} name={`${grupo} (Con PIAR)`} fill="#9ca3af" opacity={0.5} radius={[4, 4, 0, 0]}>
                                            <LabelList position="top" style={{ fontSize: '9px', fill: '#9ca3af' }} formatter={v => v.toFixed(2)} />
                                        </Bar>,
                                        <Bar key={`${grupo}-sin`} dataKey={`${grupo} (Sin PIAR)`} name={`${grupo} (Sin PIAR)`} fill={color} radius={[4, 4, 0, 0]}>
                                            <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(2)} />
                                        </Bar>
                                    ]
                                ) : (
                                    <Bar key={grupo} dataKey={grupo} name={grupo} fill={color} radius={[4, 4, 0, 0]}>
                                        <LabelList position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(2)} />
                                    </Bar>
                                );
                            })}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            {/* SECCIÓN: Desglose por Asignatura (separado por grupo) */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <LayoutGrid size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Desglose por Asignatura (Comparativa de Grupos)</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {chartsByArea.map((chartInfo) => (
                        <ChartCard key={chartInfo.areaKey} title={chartInfo.title}>
                            {(showPIAR) => (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={chartInfo.data} barCategoryGap="15%">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                        <XAxis dataKey="prueba" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                                        <YAxis domain={getYDomainWithPadding(chartInfo.maxValue)} fontSize={11} width={35} tickLine={false} axisLine={false} />
                                        <Tooltip formatter={v => v.toFixed(1)} />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />

                                        {selectedGroups.map(grupo => {
                                            const color = getGroupColor(grupo);

                                            return showPIAR ? (
                                                [
                                                    <Bar key={`${grupo}-con`} dataKey={`${grupo} (Con PIAR)`} name={`${grupo} (Con PIAR)`} fill="#9ca3af" opacity={0.5} radius={[3, 3, 0, 0]}>
                                                        <LabelList position="top" style={{ fontSize: '8px', fill: '#9ca3af' }} formatter={v => v.toFixed(1)} />
                                                    </Bar>,
                                                    <Bar key={`${grupo}-sin`} dataKey={`${grupo} (Sin PIAR)`} name={`${grupo} (Sin PIAR)`} fill={color} radius={[3, 3, 0, 0]}>
                                                        <LabelList position="top" style={{ fontSize: '9px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(1)} />
                                                    </Bar>
                                                ]
                                            ) : (
                                                <Bar key={grupo} dataKey={grupo} name={grupo} fill={color} radius={[3, 3, 0, 0]}>
                                                    <LabelList position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: color }} formatter={v => v.toFixed(1)} />
                                                </Bar>
                                            );
                                        })}
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

export default GroupComparison;
