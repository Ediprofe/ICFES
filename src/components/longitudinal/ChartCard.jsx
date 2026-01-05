/**
 * ChartCard - Componente reutilizable para gráficas longitudinales
 * 
 * Encapsula:
 * - Contenedor con ancho completo
 * - Toggle PIAR individual a la altura de la gráfica
 * - Estilo consistente
 * 
 * UTILS:
 * - getYDomainWithPadding: Añade padding superior al dominio Y para que las etiquetas no se corten
 */

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Calcula un dominio Y con padding superior para que las etiquetas no se corten
 * @param {number} maxValue - Valor máximo de los datos
 * @param {number} paddingPercent - Porcentaje de padding (default 10%)
 * @returns {[number, number]} - [min, max] para el dominio Y
 */
export function getYDomainWithPadding(maxValue, paddingPercent = 15) {
    const padding = maxValue * (paddingPercent / 100);
    return [0, Math.ceil(maxValue + padding)];
}

/**
 * @param {Object} props
 * @param {string} props.title - Título de la gráfica
 * @param {React.ReactNode} props.children - Función render que recibe showPIAR
 * @param {boolean} [props.showPIARToggle=true] - Si mostrar el toggle PIAR
 * @param {string} [props.className] - Clases adicionales
 */
export function ChartCard({ title, children, showPIARToggle = true, className = '' }) {
    const [showPIAR, setShowPIAR] = useState(false);

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 w-full ${className}`}>
            {/* Header con título y toggle PIAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>

                {showPIARToggle && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shrink-0">
                        <span className="text-xs font-medium text-gray-500">
                            {showPIAR ? 'Ocultar PIAR' : 'Ver Impacto PIAR'}
                        </span>
                        <button
                            onClick={() => setShowPIAR(!showPIAR)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${showPIAR ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            aria-label={showPIAR ? 'Ocultar comparación PIAR' : 'Mostrar comparación PIAR'}
                        >
                            <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${showPIAR ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                        {showPIAR ? (
                            <Eye size={14} className="text-blue-600" />
                        ) : (
                            <EyeOff size={14} className="text-gray-400" />
                        )}
                    </div>
                )}
            </div>

            {/* Contenido de la gráfica - Renderiza con el estado showPIAR */}
            <div className="w-full">
                {typeof children === 'function' ? children(showPIAR) : children}
            </div>
        </div>
    );
}

export default ChartCard;
