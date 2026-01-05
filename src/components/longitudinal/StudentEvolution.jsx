/**
 * StudentEvolution - Vista de evolución individual por estudiante
 * 
 * Muestra:
 * - Filtros por grupo y estudiante
 * - Métricas del estudiante seleccionado
 * - Tabla de resultados por prueba
 * - Indicadores de cambio
 */

import { useState, useMemo } from 'react';
import { User, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function StudentEvolution({ analysis }) {
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar estudiantes por grupo
    const filteredStudents = useMemo(() => {
        const allStudents = Array.from(analysis.estudiantes?.values() || []);
        let filtered = allStudents;

        if (selectedGroup !== 'all') {
            filtered = filtered.filter(s => s.grupo === selectedGroup);
        }

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                s.nombre.toLowerCase().includes(search) ||
                s.apellido.toLowerCase().includes(search) ||
                s.codigo.toLowerCase().includes(search)
            );
        }

        return filtered.sort((a, b) => a.apellido.localeCompare(b.apellido));
    }, [analysis, selectedGroup, searchTerm]);

    // Métricas del estudiante seleccionado
    const studentMetrics = useMemo(() => {
        if (!selectedStudent) return null;
        return analysis.getStudentMetrics(selectedStudent);
    }, [analysis, selectedStudent]);

    // Icono de tendencia
    const getTrendIcon = (value) => {
        if (value > 2) return <TrendingUp className="text-green-500" size={16} />;
        if (value < -2) return <TrendingDown className="text-red-500" size={16} />;
        return <Minus className="text-gray-400" size={16} />;
    };

    // Color de diferencia
    const getDiffClass = (value) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-500';
    };

    // Nombres de áreas
    const areaNames = {
        lectura: 'Lectura crítica',
        matematicas: 'Matemáticas',
        sociales: 'Sociales',
        naturales: 'Naturales',
        ingles: 'Inglés'
    };

    return (
        <div className="space-y-6">
            {/* Header con filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <User className="text-indigo-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Evolución por Estudiante</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filtro por grupo */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Filter size={16} />
                            Grupo
                        </label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => {
                                setSelectedGroup(e.target.value);
                                setSelectedStudent(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos los grupos</option>
                            {analysis.grupos.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Búsqueda */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Search size={16} />
                            Buscar
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nombre, apellido o código..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Selector de estudiante */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User size={16} />
                            Estudiante
                        </label>
                        <select
                            value={selectedStudent || ''}
                            onChange={(e) => setSelectedStudent(e.target.value || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Seleccionar estudiante...</option>
                            {filteredStudents.map(s => (
                                <option key={s.codigo} value={s.codigo}>
                                    {s.apellido} {s.nombre} ({s.codigo})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''} encontrado{filteredStudents.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Vista del estudiante seleccionado */}
            {studentMetrics && (
                <>
                    {/* Info del estudiante */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    {studentMetrics.estudiante.nombre} {studentMetrics.estudiante.apellido}
                                </h3>
                                <div className="flex items-center gap-4 mt-2 text-indigo-100">
                                    <span>Código: {studentMetrics.estudiante.codigo}</span>
                                    <span>Grupo: {studentMetrics.estudiante.grupo}</span>
                                    {studentMetrics.estudiante.piar === 'Sí' && (
                                        <span className="px-2 py-1 bg-amber-500/30 rounded text-amber-100 text-sm">PIAR</span>
                                    )}
                                </div>
                            </div>

                            {/* Resumen */}
                            <div className="text-right">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <p className="text-sm text-indigo-100">Pruebas</p>
                                        <p className="text-2xl font-bold">
                                            {studentMetrics.resumen.pruebasPresente}/{studentMetrics.resumen.pruebasTotales}
                                        </p>
                                    </div>
                                    {studentMetrics.resumen.cambioGlobal !== null && (
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <p className="text-sm text-indigo-100">Cambio Global</p>
                                            <p className={`text-2xl font-bold ${studentMetrics.resumen.cambioGlobal >= 0 ? 'text-green-300' : 'text-red-300'
                                                }`}>
                                                {studentMetrics.resumen.cambioGlobal >= 0 ? '+' : ''}
                                                {studentMetrics.resumen.cambioGlobal.toFixed(0)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de resultados por prueba */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Resultados por Prueba</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-4 py-3 font-semibold text-gray-700">Prueba</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Global</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Lectura</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Matemáticas</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Sociales</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Naturales</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Inglés</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentMetrics.resultados.map((r, idx) => {
                                        const prevResult = idx > 0 ? studentMetrics.resultados[idx - 1] : null;

                                        return (
                                            <tr key={r.pruebaId} className={`border-t border-gray-100 ${r.presente ? 'hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}`}>
                                                <td className="px-4 py-3 font-medium">{r.pruebaNombre}</td>
                                                <td className="px-4 py-3 text-center font-bold text-blue-600">
                                                    {r.presente ? r.global : '—'}
                                                </td>
                                                {['lectura', 'matematicas', 'sociales', 'naturales', 'ingles'].map(area => (
                                                    <td key={area} className="px-4 py-3 text-center">
                                                        {r.presente && r.areas[area] !== null ? r.areas[area] : '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Cambios por área */}
                    {Object.keys(studentMetrics.resumen.cambioAreas || {}).length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Cambio por Área (Primera → Última Prueba)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.entries(studentMetrics.resumen.cambioAreas).map(([area, cambio]) => (
                                    <div key={area} className={`p-4 rounded-lg ${cambio > 0 ? 'bg-green-50' : cambio < 0 ? 'bg-red-50' : 'bg-gray-50'
                                        }`}>
                                        <p className="text-sm text-gray-600 mb-1">{areaNames[area] || area}</p>
                                        <p className={`text-2xl font-bold flex items-center gap-2 ${getDiffClass(cambio)}`}>
                                            {getTrendIcon(cambio)}
                                            {cambio >= 0 ? '+' : ''}{cambio.toFixed(0)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Placeholder si no hay estudiante seleccionado */}
            {!selectedStudent && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
                    <User className="mx-auto mb-4 text-gray-300" size={48} />
                    <p className="text-lg">Selecciona un estudiante para ver su evolución</p>
                </div>
            )}
        </div>
    );
}

export default StudentEvolution;
