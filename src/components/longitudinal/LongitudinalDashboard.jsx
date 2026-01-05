/**
 * LongitudinalDashboard - Dashboard principal para análisis longitudinal
 * 
 * Integra los tres componentes:
 * - GradeEvolution: Métricas a nivel de grado
 * - GroupComparison: Comparativa entre grupos
 * - StudentEvolution: Evolución individual
 */

import { useState } from 'react';
import { BarChart3, Users, User, FileDown } from 'lucide-react';
import { GradeEvolution } from './GradeEvolution.jsx';
import { GroupComparison } from './GroupComparison.jsx';
import { StudentEvolution } from './StudentEvolution.jsx';
import { downloadHTML } from '../../utils/htmlExporter.js';
import { generateLongitudinalHTML } from '../../utils/longitudinalHtmlExporter.js';

/**
 * @param {Object} props
 * @param {import('../../models/LongitudinalAnalysis.js').LongitudinalAnalysis} props.analysis
 */
export function LongitudinalDashboard({ analysis }) {
    const [activeTab, setActiveTab] = useState('hidden'); // Por defecto oculto para priorizar descarga
    const [isExporting, setIsExporting] = useState(false);

    const tabs = [
        { id: 'grade', label: 'Evolución del Grado', icon: BarChart3 },
        { id: 'groups', label: 'Comparativa de Grupos', icon: Users },
        { id: 'students', label: 'Por Estudiante', icon: User }
    ];

    const handleExportHTML = async () => {
        setIsExporting(true);
        try {
            const html = generateLongitudinalHTML(analysis);
            const filename = `Longitudinal_${analysis.grado}_${new Date().toISOString().split('T')[0]}.html`;
            downloadHTML(html, filename);
        } catch (error) {
            console.error('Error exportando HTML:', error);
            alert('Error al exportar: ' + error.message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 py-12">
            {/* Header de Éxito y Resumen */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-xl p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-3xl font-extrabold text-green-800 mb-2">¡Datos Procesados Correctamente!</h2>
                <p className="text-green-600 text-lg mb-8">El análisis longitudinal para <b>{analysis.grado}</b> está listo.</p>

                {/* Estadísticas Clave */}
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                        <p className="text-4xl font-bold text-gray-800">{analysis.pruebas?.length}</p>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pruebas</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                        <p className="text-4xl font-bold text-gray-800">{analysis.estudiantes?.size}</p>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Estudiantes</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                        <p className="text-4xl font-bold text-gray-800">{analysis.grupos?.length}</p>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Grupos</p>
                    </div>
                </div>

                {/* Botón Principal de Acción */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleExportHTML}
                        disabled={isExporting}
                        className="group relative flex items-center gap-4 px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 disabled:opacity-75 disabled:cursor-not-allowed w-full max-w-md"
                    >
                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                            <FileDown size={32} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-blue-100">Recomendado</p>
                            <p className="text-2xl font-bold">Descargar Reporte HTML</p>
                        </div>
                        {isExporting && (
                            <div className="absolute inset-0 bg-blue-800/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="animate-pulse font-bold">Generando...</span>
                            </div>
                        )}
                    </button>
                    <p className="text-sm text-gray-500 max-w-md">
                        Este archivo contiene el dashboard completo e interactivo. Funciona sin internet y puedes compartirlo fácilmente.
                    </p>
                </div>
            </div>

            {/* Opción secundaria (Toggle para ver dashboard en React) */}
            <div className="text-center">
                <button
                    onClick={() => setActiveTab(activeTab === 'hidden' ? 'grade' : 'hidden')}
                    className="text-gray-400 hover:text-gray-600 text-sm underline decoration-dotted"
                >
                    {activeTab === 'hidden' ? 'Ver dashboard en modo debug (lento)' : 'Ocultar dashboard debug'}
                </button>
            </div>

            {/* Dashboard React (Oculto por defecto) */}
            {activeTab !== 'hidden' && (
                <div className="opacity-50 pointer-events-none filter grayscale transition-all duration-500 hover:opacity-100 hover:pointer-events-auto hover:grayscale-0">
                    <div className="bg-white rounded-xl shadow p-4 mb-4 border border-yellow-200 bg-yellow-50">
                        <p className="text-yellow-800 text-center font-medium">⚠️ Modo Debug: La experiencia de usuario real está en el HTML exportado.</p>
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

                        <div className="p-6 bg-gray-50">
                            <div className="grid grid-cols-1 gap-6 pb-20">
                                {activeTab === 'grade' && (<GradeEvolution analysis={analysis} />)}
                                {activeTab === 'groups' && (<GroupComparison analysis={analysis} />)}
                                {activeTab === 'students' && (<StudentEvolution analysis={analysis} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LongitudinalDashboard;
