/**
 * GradeEvolution - Dashboard de evolución a nivel de grado
 * 
 * Muestra métricas globales del grado a través de las pruebas:
 * - Gráfico de evolución del promedio global
 * - Tabla de métricas por prueba
 * - Gráfico de evolución por área
 */

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function GradeEvolution({ analysis }) {
    // Calcular métricas del grado
    const gradeMetrics = useMemo(() => {
        return analysis.getGradeMetrics(true);
    }, [analysis]);

    // Calcular cambio entre primera y última prueba
    const cambio = useMemo(() => {
        if (gradeMetrics.length < 2) return null;
        const primera = gradeMetrics[0];
        const ultima = gradeMetrics[gradeMetrics.length - 1];
        return {
            global: ultima.promedioGlobal - primera.promedioGlobal,
            primeraPromedioGlobal: primera.promedioGlobal,
            ultimaPromedioGlobal: ultima.promedioGlobal
        };
    }, [gradeMetrics]);

    // Icono de tendencia
    const getTrendIcon = (value) => {
        if (value > 2) return <TrendingUp className="text-green-500" size={20} />;
        if (value < -2) return <TrendingDown className="text-red-500" size={20} />;
        return <Minus className="text-gray-400" size={20} />;
    };

    // Color de la diferencia
    const getDiffClass = (value) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-500';
    };

    if (!gradeMetrics || gradeMetrics.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                No hay datos para mostrar
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con resumen */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <BarChart3 size={28} />
                    <h2 className="text-2xl font-bold">Evolución del Grado</h2>
                </div>

                {cambio && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Primera prueba</p>
                            <p className="text-2xl font-bold">{cambio.primeraPromedioGlobal.toFixed(1)}</p>
                            <p className="text-xs text-blue-200">{gradeMetrics[0].pruebaNombre}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Última prueba</p>
                            <p className="text-2xl font-bold">{cambio.ultimaPromedioGlobal.toFixed(1)}</p>
                            <p className="text-xs text-blue-200">{gradeMetrics[gradeMetrics.length - 1].pruebaNombre}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm text-blue-100 mb-1">Cambio</p>
                            <p className={`text-2xl font-bold ${cambio.global >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {cambio.global >= 0 ? '+' : ''}{cambio.global.toFixed(1)}
                            </p>
                            <p className="text-xs text-blue-200">puntos</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla de métricas por prueba */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Métricas por Prueba</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Prueba</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Estudiantes</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Promedio Global</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Desv. Estándar</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Δ vs Anterior</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradeMetrics.map((metric, idx) => {
                                const prevMetric = idx > 0 ? gradeMetrics[idx - 1] : null;
                                const diff = prevMetric ? metric.promedioGlobal - prevMetric.promedioGlobal : null;

                                return (
                                    <tr key={metric.pruebaId} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{metric.pruebaNombre}</td>
                                        <td className="px-4 py-3 text-center text-gray-600">{metric.totalEstudiantes}</td>
                                        <td className="px-4 py-3 text-center font-semibold text-blue-600">
                                            {metric.promedioGlobal.toFixed(1)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600">
                                            {metric.desviacionGlobal.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {diff !== null ? (
                                                <span className={`inline-flex items-center gap-1 ${getDiffClass(diff)}`}>
                                                    {getTrendIcon(diff)}
                                                    {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Métricas por área */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Evolución por Área</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Área</th>
                                {gradeMetrics.map(m => (
                                    <th key={m.pruebaId} className="px-4 py-3 font-semibold text-gray-700 text-center">
                                        {m.pruebaNombre}
                                    </th>
                                ))}
                                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Δ Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(gradeMetrics[0]?.areas || {}).map(areaId => {
                                const areaNames = {
                                    lectura: 'Lectura crítica',
                                    matematicas: 'Matemáticas',
                                    sociales: 'Sociales',
                                    naturales: 'Naturales',
                                    ingles: 'Inglés'
                                };

                                const primera = gradeMetrics[0]?.areas[areaId]?.promedio || 0;
                                const ultima = gradeMetrics[gradeMetrics.length - 1]?.areas[areaId]?.promedio || 0;
                                const cambioArea = ultima - primera;

                                return (
                                    <tr key={areaId} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{areaNames[areaId] || areaId}</td>
                                        {gradeMetrics.map(m => (
                                            <td key={m.pruebaId} className="px-4 py-3 text-center text-gray-600">
                                                {m.areas[areaId]?.promedio?.toFixed(1) || '—'}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1 font-semibold ${getDiffClass(cambioArea)}`}>
                                                {getTrendIcon(cambioArea)}
                                                {cambioArea >= 0 ? '+' : ''}{cambioArea.toFixed(1)}
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

export default GradeEvolution;
