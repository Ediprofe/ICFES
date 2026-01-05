/**
 * GroupComparison - Comparativa entre grupos del grado
 * 
 * Muestra:
 * - Selector de grupos para comparar
 * - Ranking de grupos por promedio
 * - Gráfico comparativo de evolución entre grupos
 */

import { useState, useMemo } from 'react';
import { Users, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GroupComparison({ analysis }) {
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedPrueba, setSelectedPrueba] = useState(null);

    // Inicializar con todos los grupos seleccionados
    useMemo(() => {
        if (analysis.grupos?.length > 0 && selectedGroups.length === 0) {
            setSelectedGroups(analysis.grupos);
        }
        if (analysis.pruebas?.length > 0 && !selectedPrueba) {
            setSelectedPrueba(analysis.pruebas[analysis.pruebas.length - 1]?.id);
        }
    }, [analysis, selectedGroups.length, selectedPrueba]);

    // Obtener métricas por grupo
    const groupMetrics = useMemo(() => {
        return analysis.getGroupMetrics(null, true);
    }, [analysis]);

    // Ranking de la prueba seleccionada
    const ranking = useMemo(() => {
        if (!selectedPrueba) return [];
        return analysis.getGroupRanking(selectedPrueba, true);
    }, [analysis, selectedPrueba]);

    // Toggle grupo
    const toggleGroup = (grupo) => {
        setSelectedGroups(prev =>
            prev.includes(grupo)
                ? prev.filter(g => g !== grupo)
                : [...prev, grupo]
        );
    };

    // Colores para grupos
    const groupColors = [
        { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' },
        { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
        { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
        { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
        { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-500' },
    ];

    const getGroupColor = (idx) => groupColors[idx % groupColors.length];

    // Icono de tendencia
    const getTrendIcon = (value) => {
        if (value > 2) return <TrendingUp className="text-green-500" size={16} />;
        if (value < -2) return <TrendingDown className="text-red-500" size={16} />;
        return <Minus className="text-gray-400" size={16} />;
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
            {/* Header con selector de grupos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Users className="text-purple-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Comparativa de Grupos</h2>
                </div>

                {/* Selector de grupos */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {analysis.grupos.map((grupo, idx) => {
                        const isSelected = selectedGroups.includes(grupo);
                        const color = getGroupColor(idx);

                        return (
                            <button
                                key={grupo}
                                onClick={() => toggleGroup(grupo)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                        ? `${color.bg} text-white`
                                        : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                                    }`}
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

            {/* Ranking de grupos */}
            {ranking.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Award className="text-amber-500" size={20} />
                        Ranking: {analysis.pruebas.find(p => p.id === selectedPrueba)?.nombre}
                    </h3>
                    <div className="space-y-3">
                        {ranking.map((item, idx) => {
                            const color = getGroupColor(analysis.grupos.indexOf(item.grupo));
                            const isTop = idx === 0;

                            return (
                                <div
                                    key={item.grupo}
                                    className={`flex items-center gap-4 p-4 rounded-lg ${isTop ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300' : 'bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isTop ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-semibold ${color.text}`}>{item.grupo}</p>
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

            {/* Tabla comparativa por prueba */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Evolución por Grupo</h3>
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
                            {selectedGroups.map((grupo, idx) => {
                                const metrics = groupMetrics[grupo] || [];
                                const primera = metrics[0]?.promedioGlobal || 0;
                                const ultima = metrics[metrics.length - 1]?.promedioGlobal || 0;
                                const cambio = ultima - primera;
                                const color = getGroupColor(idx);

                                return (
                                    <tr key={grupo} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className={`px-4 py-3 font-semibold ${color.text}`}>{grupo}</td>
                                        {metrics.map(m => (
                                            <td key={m.pruebaId} className="px-4 py-3 text-center">
                                                <span className="font-medium text-gray-800">{m.promedioGlobal.toFixed(1)}</span>
                                                <span className="text-xs text-gray-500 block">σ {m.desviacionGlobal.toFixed(1)}</span>
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1 font-semibold ${cambio > 0 ? 'text-green-600' : cambio < 0 ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                {getTrendIcon(cambio)}
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
