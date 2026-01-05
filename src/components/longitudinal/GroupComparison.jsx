/**
 * GroupComparison - Comparativa entre grupos
 * 
 * MIGRADO A CHART.JS para fidelidad con HTML export
 * 
 * Toggle PIAR: "Ver impacto PIAR" - Muestra barras grises al lado
 */

import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Users, Eye, EyeOff } from 'lucide-react';
import {
    COLORS,
    AREA_NAMES,
    baseOptions
} from '../../utils/chartConfig';

/**
 * Componente de tarjeta para gráficos con toggle PIAR
 */
function ChartCard({ title, children, showPIARImpact, onTogglePIAR }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <button
                    onClick={onTogglePIAR}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${showPIARImpact ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    {showPIARImpact ? <Eye size={16} /> : <EyeOff size={16} />}
                    Ver impacto PIAR
                </button>
            </div>
            <div className="h-[380px]">
                {children}
            </div>
        </div>
    );
}

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GroupComparison({ analysis }) {
    const [piarStates, setPiarStates] = useState({
        global: false,
        variabilidad: false,
        lectura: false,
        matematicas: false,
        sociales: false,
        naturales: false,
        ingles: false
    });

    const togglePIAR = (key) => {
        setPiarStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const groups = analysis.grupos;
    const pruebas = analysis.pruebas;

    // Métricas por grupo
    const groupMetricsSinPIAR = useMemo(() => {
        const result = {};
        groups.forEach(g => {
            result[g] = analysis.getGroupMetrics(g, true);
        });
        return result;
    }, [analysis, groups]);

    const groupMetricsConPIAR = useMemo(() => {
        const result = {};
        groups.forEach(g => {
            result[g] = analysis.getGroupMetrics(g, false);
        });
        return result;
    }, [analysis, groups]);

    // Crea datasets para comparación
    const createGroupedData = (getValueFn, showPIARImpact, formatter = null) => {
        const labels = pruebas.map(p => p.nombre);

        // Datasets sin PIAR (coloreados)
        const datasets = groups.map((g, i) => ({
            label: g,
            data: pruebas.map(p => {
                const match = groupMetricsSinPIAR[g]?.find(m => m.pruebaId === p.id);
                return getValueFn(match);
            }),
            backgroundColor: COLORS.groups[i % COLORS.groups.length] + 'aa',
            borderColor: COLORS.groups[i % COLORS.groups.length],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false
        }));

        // Si mostrar impacto PIAR, agregar datasets grises
        if (showPIARImpact) {
            groups.forEach((g, i) => {
                datasets.push({
                    label: `${g} (PIAR)`,
                    data: pruebas.map(p => {
                        const match = groupMetricsConPIAR[g]?.find(m => m.pruebaId === p.id);
                        return getValueFn(match);
                    }),
                    backgroundColor: '#9ca3af66',
                    borderColor: '#9ca3af',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                });
            });
        }

        return { labels, datasets };
    };

    // Datos para gráficos
    const globalChartData = useMemo(() =>
        createGroupedData(m => m?.promedioGlobal || 0, piarStates.global),
        [piarStates.global, groupMetricsSinPIAR, groupMetricsConPIAR, groups, pruebas]
    );

    const variabilidadChartData = useMemo(() =>
        createGroupedData(m => m?.desviacionGlobal || 0, piarStates.variabilidad),
        [piarStates.variabilidad, groupMetricsSinPIAR, groupMetricsConPIAR, groups, pruebas]
    );

    const areaChartData = useMemo(() => {
        const result = {};
        Object.keys(AREA_NAMES).forEach(areaKey => {
            result[areaKey] = createGroupedData(m => m?.areas?.[areaKey]?.promedio || 0, piarStates[areaKey]);
        });
        return result;
    }, [piarStates, groupMetricsSinPIAR, groupMetricsConPIAR, groups, pruebas]);

    // Opciones base para gráficos agrupados
    const groupedOptions = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            datalabels: {
                ...baseOptions.plugins.datalabels,
                font: { size: 9, weight: 'bold' }
            }
        }
    };

    const areaOptions = {
        ...groupedOptions,
        scales: {
            ...baseOptions.scales,
            y: { ...baseOptions.scales.y, min: 0, max: 100 }
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3">
                    <Users size={28} />
                    <div>
                        <h2 className="text-2xl font-bold">Comparativa de Grupos</h2>
                        <p className="text-purple-100">{groups.length} grupos • {pruebas.length} pruebas</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                    {groups.map((g, i) => (
                        <span
                            key={g}
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                                backgroundColor: COLORS.groups[i % COLORS.groups.length] + '33',
                                color: 'white'
                            }}
                        >
                            {g}
                        </span>
                    ))}
                </div>
            </div>

            {/* Gráfico Global por Grupo */}
            <ChartCard
                title="📊 Promedio Global por Grupo"
                showPIARImpact={piarStates.global}
                onTogglePIAR={() => togglePIAR('global')}
            >
                <Bar data={globalChartData} options={groupedOptions} />
            </ChartCard>

            {/* Gráfico Variabilidad por Grupo */}
            <ChartCard
                title="📉 Variabilidad por Grupo"
                showPIARImpact={piarStates.variabilidad}
                onTogglePIAR={() => togglePIAR('variabilidad')}
            >
                <Bar
                    data={variabilidadChartData}
                    options={{
                        ...groupedOptions,
                        plugins: {
                            ...groupedOptions.plugins,
                            datalabels: {
                                ...groupedOptions.plugins.datalabels,
                                formatter: (v) => parseFloat(v).toFixed(2)
                            }
                        }
                    }}
                />
            </ChartCard>

            {/* Gráficos por Área */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Desglose por Asignatura (Grupos)</h3>
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
                                    Ver impacto PIAR
                                </button>
                            </div>
                            <div className="h-[300px]">
                                <Bar data={areaChartData[key]} options={areaOptions} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GroupComparison;
