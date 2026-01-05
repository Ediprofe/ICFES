/**
 * PrivacyBanner - Banner informativo de privacidad
 * 
 * Muestra un mensaje tranquilizador sobre el procesamiento local de datos
 */

import { Shield, Lock, X } from 'lucide-react';
import { useState } from 'react';

export function PrivacyBanner({ variant = 'full' }) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    // Versión compacta para footers
    if (variant === 'compact') {
        return (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-2">
                <Shield size={14} className="text-green-600" />
                <span>Tus datos nunca salen de tu dispositivo</span>
                <a
                    href="https://github.com/tu-repo/icfes-analyzer/blob/main/PRIVACY.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline ml-2"
                >
                    Más info
                </a>
            </div>
        );
    }

    // Versión completa para mostrar al inicio
    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 relative">
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Cerrar"
            >
                <X size={18} />
            </button>

            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock className="text-green-600" size={24} />
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-green-800 mb-1">
                        🔒 Privacidad Garantizada
                    </h3>
                    <p className="text-sm text-green-700 mb-2">
                        Esta aplicación procesa tus datos <strong>exclusivamente en tu navegador</strong>.
                        Ningún archivo Excel ni información de estudiantes se envía a servidores externos.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-green-600">
                        <span className="flex items-center gap-1">
                            <Shield size={12} /> Sin servidores
                        </span>
                        <span className="flex items-center gap-1">
                            <Shield size={12} /> Sin cookies
                        </span>
                        <span className="flex items-center gap-1">
                            <Shield size={12} /> Sin rastreo
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyBanner;
