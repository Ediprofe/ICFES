/**
 * AnalysisModeSelector - Selector de tipo de análisis
 * 
 * Tres modos disponibles:
 * 1. Análisis de Prueba (1 cohorte, 1 prueba)
 * 2. Comparativo de Cohortes (N cohortes, 1 prueba)
 * 3. Evolución Longitudinal (1 cohorte, N pruebas)
 */

import { BarChart3, GitCompare, TrendingUp } from 'lucide-react';

/**
 * @typedef {'single' | 'comparative' | 'longitudinal'} AnalysisMode
 */

/**
 * Configuración de los modos de análisis
 */
export const ANALYSIS_MODES = {
    single: {
        id: 'single',
        name: 'Análisis de Prueba',
        description: 'Una cohorte, una prueba',
        icon: BarChart3,
        color: 'blue',
        requiresCodigo: false
    },
    comparative: {
        id: 'comparative',
        name: 'Comparativo de Cohortes',
        description: 'Varias cohortes, misma prueba',
        icon: GitCompare,
        color: 'purple',
        requiresCodigo: false
    },
    longitudinal: {
        id: 'longitudinal',
        name: 'Evolución Longitudinal',
        description: 'Una cohorte, varias pruebas',
        icon: TrendingUp,
        color: 'green',
        requiresCodigo: true  // OBLIGATORIO
    }
};

/**
 * Componente selector de modo de análisis
 * @param {Object} props
 * @param {function} props.onSelectMode - Callback cuando se selecciona un modo
 */
export function AnalysisModeSelector({ onSelectMode }) {
    const modes = Object.values(ANALYSIS_MODES);

    const getColorClasses = (color, isHover = false) => {
        const colors = {
            blue: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                hoverBorder: 'hover:border-blue-500',
                icon: 'text-blue-600',
                title: 'text-blue-900',
                desc: 'text-blue-700',
                selected: 'ring-2 ring-blue-500 bg-blue-100'
            },
            purple: {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                hoverBorder: 'hover:border-purple-500',
                icon: 'text-purple-600',
                title: 'text-purple-900',
                desc: 'text-purple-700',
                selected: 'ring-2 ring-purple-500 bg-purple-100'
            },
            green: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                hoverBorder: 'hover:border-green-500',
                icon: 'text-green-600',
                title: 'text-green-900',
                desc: 'text-green-700',
                selected: 'ring-2 ring-green-500 bg-green-100'
            }
        };
        return colors[color];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        📊 ICFES Analyzer
                    </h1>
                    <p className="text-lg text-gray-600">
                        ¿Qué tipo de análisis deseas realizar?
                    </p>
                </div>

                {/* Mode Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        const colors = getColorClasses(mode.color);

                        return (
                            <button
                                key={mode.id}
                                onClick={() => onSelectMode(mode.id)}
                                className={`
                  ${colors.bg} ${colors.border} ${colors.hoverBorder}
                  border-2 rounded-xl p-6 
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  text-left
                `}
                            >
                                {/* Icon */}
                                <div className={`${colors.icon} mb-4`}>
                                    <Icon size={48} strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className={`text-xl font-bold ${colors.title} mb-2`}>
                                    {mode.name}
                                </h3>

                                {/* Description */}
                                <p className={`text-sm ${colors.desc}`}>
                                    {mode.description}
                                </p>

                                {/* Código badge for longitudinal */}
                                {mode.requiresCodigo && (
                                    <div className="mt-4 inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                        <span>⚠️</span>
                                        <span>Requiere columna "Código"</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer info */}
                <div className="mt-10 text-center text-sm text-gray-500">
                    <p>
                        Selecciona un modo para comenzar. Podrás cambiar de modo en cualquier momento.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AnalysisModeSelector;
