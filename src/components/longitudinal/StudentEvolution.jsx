/**
 * StudentEvolution - Vista de evolución individual por estudiante
 * 
 * MEJORAS:
 * 1. Dominio Y con padding para etiquetas
 * 2. Contenedor a ancho completo
 */

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { User, Search, Filter, TrendingUp, TrendingDown, Minus, Eye, EyeOff } from 'lucide-react';
import { getYDomainWithPadding } from './ChartCard';

// Colores por área
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

const PRUEBA_COLORS = [
    '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6',
];

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function StudentEvolution({ analysis }) {
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [includePIAR, setIncludePIAR] = useState(true);

    // Filtrar estudiantes por grupo y PIAR
    const filteredStudents = useMemo(() => {
        let students = Array.from(analysis.estudiantes?.values() || []);

        if (!includePIAR) {
            students = students.filter(s => s.piar !== 'Sí');
        }

        if (selectedGroup !== 'all') {
            students = students.filter(s => s.grupo === selectedGroup);
        }

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            students = students.filter(s =>
                s.nombre.toLowerCase().includes(search) ||
                s.apellido.toLowerCase().includes(search) ||
                s.codigo.toLowerCase().includes(search)
            );
        }

        return students.sort((a, b) => a.apellido.localeCompare(b.apellido));
    }, [analysis, selectedGroup, searchTerm, includePIAR]);

    // Métricas del estudiante seleccionado
    const studentMetrics = useMemo(() => {
        if (!selectedStudent) return null;
        return analysis.getStudentMetrics(selectedStudent);
    }, [analysis, selectedStudent]);

    // Preparar datos para gráfico de Global
    const chartDataGlobal = useMemo(() => {
        if (!studentMetrics) return [];
        return studentMetrics.resultados.map(r => ({
            prueba: r.pruebaNombre,
            Global: r.presente ? r.global : null
        }));
    }, [studentMetrics]);

    const maxGlobal = useMemo(() => {
        return Math.max(...chartDataGlobal.map(d => d.Global || 0));
    }, [chartDataGlobal]);

    // Preparar datos para gráfico por áreas
    const chartDataAreas = useMemo(() => {
        if (!studentMetrics) return [];
        return Object.keys(AREA_NAMES).map(areaId => {
            const data = { area: AREA_NAMES[areaId], areaId };

            studentMetrics.resultados.forEach(r => {
                data[r.pruebaNombre] = r.presente && r.areas[areaId] !== null ? r.areas[areaId] : null;
            });
            return data;
        });
    }, [studentMetrics]);

    // Iconos de tendencia
    const getTrendIcon = (value) => {
        if (value > 2) return <TrendingUp className="text-green-500" size={16} />;
        if (value < -2) return <TrendingDown className="text-red-500" size={16} />;
        return <Minus className="text-gray-400" size={16} />;
    };

    const getDiffClass = (value) => {
        if (value > 0) return 'text-green-600 bg-green-50';
        if (value < 0) return 'text-red-600 bg-red-50';
        return 'text-gray-500 bg-gray-50';
    };

    return (
        <div className="w-full max-w-full space-y-6">
            {/* Header con filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <User className="text-indigo-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Evolución por Estudiante</h2>
                    </div>

                    {/* Toggle PIAR para filtrado de lista */}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-500">
                            {includePIAR ? 'Listar PIAR' : 'Ocultar PIAR'}
                        </span>
                        <button
                            onClick={() => {
                                setIncludePIAR(!includePIAR);
                                setSelectedStudent(null);
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includePIAR ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                        >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${includePIAR ? 'translate-x-5' : 'translate-x-0.5'
                                }`} />
                        </button>
                        {includePIAR ? <Eye size={14} className="text-indigo-600" /> : <EyeOff size={14} className="text-gray-400" />}
                    </div>
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
                    {!includePIAR && ' (sin PIAR)'}
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
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 rounded-lg p-3 text-center">
                                    <p className="text-sm text-indigo-100">Pruebas</p>
                                    <p className="text-2xl font-bold">
                                        {studentMetrics.resumen.pruebasPresente}/{studentMetrics.resumen.pruebasTotales}
                                    </p>
                                </div>
                                {studentMetrics.resumen.cambioGlobal !== null && (
                                    <div className="bg-white/10 rounded-lg p-3 text-center">
                                        <p className="text-sm text-indigo-100">Cambio Global</p>
                                        <p className={`text-2xl font-bold flex items-center gap-1 justify-center ${studentMetrics.resumen.cambioGlobal >= 0 ? 'text-green-300' : 'text-red-300'
                                            }`}>
                                            {getTrendIcon(studentMetrics.resumen.cambioGlobal)}
                                            {studentMetrics.resumen.cambioGlobal >= 0 ? '+' : ''}
                                            {studentMetrics.resumen.cambioGlobal.toFixed(0)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gráfico Global por Prueba */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Puntaje Global por Prueba</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartDataGlobal}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="prueba" axisLine={false} tickLine={false} />
                                <YAxis domain={getYDomainWithPadding(maxGlobal)} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value) => value || 'No presentó'} />
                                <Bar dataKey="Global" fill="#6366f1" radius={[4, 4, 0, 0]}>
                                    {chartDataGlobal.map((entry, idx) => (
                                        <Cell
                                            key={`cell-${idx}`}
                                            fill={entry.Global !== null ? PRUEBA_COLORS[idx % PRUEBA_COLORS.length] : '#e5e7eb'}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="Global"
                                        position="top"
                                        style={{ fontSize: '12px', fontWeight: 'bold' }}
                                        formatter={(v) => v !== null ? v : '—'}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico por Áreas */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Resultados por Área</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartDataAreas}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="area" axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 115]} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value) => value !== null ? value : 'No presentó'} />
                                <Legend wrapperStyle={{ paddingTop: '15px' }} iconType="circle" />
                                {analysis.pruebas.map((p, idx) => (
                                    <Bar
                                        key={p.id}
                                        dataKey={p.nombre}
                                        fill={PRUEBA_COLORS[idx % PRUEBA_COLORS.length]}
                                        radius={[3, 3, 0, 0]}
                                    >
                                        <LabelList
                                            dataKey={p.nombre}
                                            position="top"
                                            style={{ fontSize: '9px', fontWeight: 'bold' }}
                                            formatter={(v) => v !== null ? v.toFixed(1) : ''}
                                        />
                                    </Bar>
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Cambios por área */}
                    {Object.keys(studentMetrics.resumen.cambioAreas || {}).length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Cambio por Área (Primera → Última Prueba)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.entries(studentMetrics.resumen.cambioAreas).map(([area, cambio]) => (
                                    <div key={area} className={`p-4 rounded-lg ${getDiffClass(cambio)}`}>
                                        <p className="text-sm mb-1">{AREA_NAMES[area] || area}</p>
                                        <p className="text-2xl font-bold flex items-center gap-2">
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
