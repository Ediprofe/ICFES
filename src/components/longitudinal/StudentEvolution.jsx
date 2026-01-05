/**
 * StudentEvolution - Vista de evolución individual por estudiante
 * 
 * INCLUYE:
 * 1. Tabla de ranking con filtros
 * 2. Columna "Presentó todas las pruebas"
 * 3. Vista individual del estudiante seleccionado
 */

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { User, Search, Filter, TrendingUp, TrendingDown, Minus, Eye, EyeOff, Table, ChevronUp, ChevronDown } from 'lucide-react';
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
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'individual'
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [includePIAR, setIncludePIAR] = useState(true);
    const [filterCompleto, setFilterCompleto] = useState('all'); // 'all', 'completo', 'incompleto'
    const [sortField, setSortField] = useState('promedioGlobal');
    const [sortDir, setSortDir] = useState('desc');

    // Calcular datos de ranking para todos los estudiantes
    const rankingData = useMemo(() => {
        const allStudents = Array.from(analysis.estudiantes?.values() || []);

        return allStudents.map(student => {
            const metrics = analysis.getStudentMetrics(student.codigo);
            const resultados = metrics?.resultados || [];

            // Calcular promedios
            const globales = resultados.filter(r => r.presente).map(r => r.global);
            const promedioGlobal = globales.length > 0 ? globales.reduce((a, b) => a + b, 0) / globales.length : null;

            // Promedios por área
            const areas = {};
            Object.keys(AREA_NAMES).forEach(area => {
                const valores = resultados.filter(r => r.presente && r.areas[area] !== null).map(r => r.areas[area]);
                areas[area] = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
            });

            const pruebasPresentes = resultados.filter(r => r.presente).length;
            const todasLasPruebas = pruebasPresentes === analysis.pruebas.length;

            return {
                ...student,
                promedioGlobal,
                ...areas,
                pruebasPresentes,
                pruebasTotales: analysis.pruebas.length,
                todasLasPruebas
            };
        });
    }, [analysis]);

    // Filtrar y ordenar
    const filteredRanking = useMemo(() => {
        let data = [...rankingData];

        // Filtrar por PIAR
        if (!includePIAR) {
            data = data.filter(s => s.piar !== 'Sí');
        }

        // Filtrar por grupo
        if (selectedGroup !== 'all') {
            data = data.filter(s => s.grupo === selectedGroup);
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            data = data.filter(s =>
                s.nombre.toLowerCase().includes(search) ||
                s.apellido.toLowerCase().includes(search) ||
                s.codigo.toLowerCase().includes(search)
            );
        }

        // Filtrar por completitud
        if (filterCompleto === 'completo') {
            data = data.filter(s => s.todasLasPruebas);
        } else if (filterCompleto === 'incompleto') {
            data = data.filter(s => !s.todasLasPruebas);
        }

        // Ordenar
        data.sort((a, b) => {
            const valA = a[sortField] ?? -Infinity;
            const valB = b[sortField] ?? -Infinity;
            return sortDir === 'desc' ? valB - valA : valA - valB;
        });

        return data;
    }, [rankingData, includePIAR, selectedGroup, searchTerm, filterCompleto, sortField, sortDir]);

    // Estudiante seleccionado para vista individual
    const studentMetrics = useMemo(() => {
        if (!selectedStudent) return null;
        return analysis.getStudentMetrics(selectedStudent);
    }, [analysis, selectedStudent]);

    // Datos para gráficos del estudiante
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

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />;
    };

    return (
        <div className="w-full max-w-full space-y-6">
            {/* Header con selector de vista */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <User className="text-indigo-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Evolución por Estudiante</h2>
                    </div>

                    {/* Toggle Vista */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                                }`}
                        >
                            <Table size={16} className="inline mr-2" />
                            Ranking
                        </button>
                        <button
                            onClick={() => setViewMode('individual')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'individual' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                                }`}
                        >
                            <User size={16} className="inline mr-2" />
                            Detalle
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Búsqueda */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Search size={14} />
                            Buscar
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nombre, apellido o código..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    {/* Filtro por grupo */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Filter size={14} />
                            Grupo
                        </label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="all">Todos</option>
                            {analysis.grupos.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro PIAR */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">PIAR</label>
                        <select
                            value={includePIAR ? 'todos' : 'sinPiar'}
                            onChange={(e) => setIncludePIAR(e.target.value === 'todos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="todos">Incluir PIAR</option>
                            <option value="sinPiar">Excluir PIAR</option>
                        </select>
                    </div>

                    {/* Filtro Completitud */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Asistencia</label>
                        <select
                            value={filterCompleto}
                            onChange={(e) => setFilterCompleto(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="all">Todos</option>
                            <option value="completo">Presentó todas</option>
                            <option value="incompleto">Pruebas incompletas</option>
                        </select>
                    </div>

                    {/* Selector estudiante (solo para vista individual) */}
                    {viewMode === 'individual' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Estudiante</label>
                            <select
                                value={selectedStudent || ''}
                                onChange={(e) => setSelectedStudent(e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                <option value="">Seleccionar...</option>
                                {filteredRanking.map(s => (
                                    <option key={s.codigo} value={s.codigo}>
                                        {s.apellido} {s.nombre} ({s.codigo})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    {filteredRanking.length} estudiante{filteredRanking.length !== 1 ? 's' : ''}
                    {!includePIAR && ' (sin PIAR)'}
                </p>
            </div>

            {/* VISTA: TABLA DE RANKING */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-3 py-3 font-semibold text-gray-700">#</th>
                                <th className="px-3 py-3 font-semibold text-gray-700">Código</th>
                                <th className="px-3 py-3 font-semibold text-gray-700">Apellido</th>
                                <th className="px-3 py-3 font-semibold text-gray-700">Nombre</th>
                                <th className="px-3 py-3 font-semibold text-gray-700">Grupo</th>
                                <th className="px-3 py-3 font-semibold text-gray-700">PIAR</th>
                                <th
                                    className="px-3 py-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('promedioGlobal')}
                                >
                                    <div className="flex items-center gap-1">
                                        Global <SortIcon field="promedioGlobal" />
                                    </div>
                                </th>
                                {Object.entries(AREA_NAMES).map(([key, name]) => (
                                    <th
                                        key={key}
                                        className="px-3 py-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort(key)}
                                    >
                                        <div className="flex items-center gap-1">
                                            {name} <SortIcon field={key} />
                                        </div>
                                    </th>
                                ))}
                                <th className="px-3 py-3 font-semibold text-gray-700 text-center">Pruebas</th>
                                <th className="px-3 py-3 font-semibold text-gray-700 text-center">Completo</th>
                                <th className="px-3 py-3 font-semibold text-gray-700 text-center">Ver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRanking.map((s, idx) => (
                                <tr key={s.codigo} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-3 py-3 font-bold text-gray-400">{idx + 1}</td>
                                    <td className="px-3 py-3 text-gray-600">{s.codigo}</td>
                                    <td className="px-3 py-3 font-medium text-gray-800">{s.apellido}</td>
                                    <td className="px-3 py-3 text-gray-700">{s.nombre}</td>
                                    <td className="px-3 py-3 text-gray-600">{s.grupo}</td>
                                    <td className="px-3 py-3">
                                        {s.piar === 'Sí' && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">PIAR</span>
                                        )}
                                    </td>
                                    <td className={`px-3 py-3 font-bold ${s.promedioGlobal >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                        {s.promedioGlobal?.toFixed(1) || '-'}
                                    </td>
                                    {Object.keys(AREA_NAMES).map(area => (
                                        <td key={area} className={`px-3 py-3 ${s[area] >= 60 ? 'text-green-600' : s[area] < 40 ? 'text-red-600' : 'text-gray-600'}`}>
                                            {s[area]?.toFixed(1) || '-'}
                                        </td>
                                    ))}
                                    <td className="px-3 py-3 text-center text-gray-600">{s.pruebasPresentes}/{s.pruebasTotales}</td>
                                    <td className="px-3 py-3 text-center">
                                        {s.todasLasPruebas ? (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Sí</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">No</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedStudent(s.codigo);
                                                setViewMode('individual');
                                            }}
                                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                            title="Ver detalle"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* VISTA: DETALLE INDIVIDUAL */}
            {viewMode === 'individual' && studentMetrics && (
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
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 rounded-lg p-3 text-center">
                                    <p className="text-sm text-indigo-100">Pruebas</p>
                                    <p className="text-2xl font-bold">
                                        {studentMetrics.resumen.pruebasPresente}/{studentMetrics.resumen.pruebasTotales}
                                    </p>
                                </div>
                                {studentMetrics.resumen.cambioGlobal !== null && (
                                    <div className="bg-white/10 rounded-lg p-3 text-center">
                                        <p className="text-sm text-indigo-100">Cambio</p>
                                        <p className={`text-2xl font-bold flex items-center gap-1 justify-center ${studentMetrics.resumen.cambioGlobal >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                            {getTrendIcon(studentMetrics.resumen.cambioGlobal)}
                                            {studentMetrics.resumen.cambioGlobal >= 0 ? '+' : ''}
                                            {studentMetrics.resumen.cambioGlobal.toFixed(0)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gráfico Global */}
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
                                        <Cell key={`cell-${idx}`} fill={entry.Global !== null ? PRUEBA_COLORS[idx % PRUEBA_COLORS.length] : '#e5e7eb'} />
                                    ))}
                                    <LabelList dataKey="Global" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(v) => v !== null ? v : '—'} />
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
                                    <Bar key={p.id} dataKey={p.nombre} fill={PRUEBA_COLORS[idx % PRUEBA_COLORS.length]} radius={[3, 3, 0, 0]}>
                                        <LabelList dataKey={p.nombre} position="top" style={{ fontSize: '9px', fontWeight: 'bold' }} formatter={(v) => v !== null ? v.toFixed(1) : ''} />
                                    </Bar>
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Cambios por área */}
                    {Object.keys(studentMetrics.resumen.cambioAreas || {}).length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Cambio por Área</h3>
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

            {/* Placeholder si está en modo individual pero no hay estudiante */}
            {viewMode === 'individual' && !selectedStudent && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
                    <User className="mx-auto mb-4 text-gray-300" size={48} />
                    <p className="text-lg">Selecciona un estudiante para ver su evolución</p>
                </div>
            )}
        </div>
    );
}

export default StudentEvolution;
