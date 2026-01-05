/**
 * LongitudinalDashboard - Dashboard principal para análisis longitudinal
 * 
 * Integra los tres componentes:
 * - GradeEvolution: Métricas a nivel de grado
 * - GroupComparison: Comparativa entre grupos
 * - StudentEvolution: Evolución individual
 */

import { useState } from 'react';
import { BarChart3, Users, User } from 'lucide-react';
import { GradeEvolution } from './GradeEvolution.jsx';
import { GroupComparison } from './GroupComparison.jsx';
import { StudentEvolution } from './StudentEvolution.jsx';

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function LongitudinalDashboard({ analysis }) {
    const [activeTab, setActiveTab] = useState('grade');

    const tabs = [
        { id: 'grade', label: 'Evolución del Grado', icon: BarChart3 },
        { id: 'groups', label: 'Comparativa de Grupos', icon: Users },
        { id: 'students', label: 'Por Estudiante', icon: User }
    ];

    return (
        <div className="space-y-6">
            {/* Resumen general */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{analysis.grado}</h2>
                        <p className="text-gray-500">Análisis longitudinal</p>
                    </div>
                    <div className="flex gap-4 text-center">
                        <div className="px-4 py-2 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{analysis.pruebas?.length}</p>
                            <p className="text-xs text-green-700">Pruebas</p>
                        </div>
                        <div className="px-4 py-2 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{analysis.estudiantes?.size}</p>
                            <p className="text-xs text-blue-700">Estudiantes</p>
                        </div>
                        <div className="px-4 py-2 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{analysis.grupos?.length}</p>
                            <p className="text-xs text-purple-700">Grupos</p>
                        </div>
                    </div>
                </div>

                {/* Lista de pruebas */}
                <div className="flex flex-wrap gap-2">
                    {analysis.pruebas?.map((p, idx) => (
                        <span key={p.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {idx + 1}. {p.nombre}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tab navigation */}
            <div className="bg-white rounded-xl shadow-lg">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${isActive
                                            ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab content */}
                <div className="p-6">
                    {activeTab === 'grade' && <GradeEvolution analysis={analysis} />}
                    {activeTab === 'groups' && <GroupComparison analysis={analysis} />}
                    {activeTab === 'students' && <StudentEvolution analysis={analysis} />}
                </div>
            </div>
        </div>
    );
}

export default LongitudinalDashboard;
