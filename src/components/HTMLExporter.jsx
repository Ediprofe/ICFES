import { Globe } from 'lucide-react';
import { generateInteractiveHTML, downloadHTML } from '../utils/htmlExporter';

export default function HTMLExporter({ data }) {
  const handleExport = () => {
    try {
      const html = generateInteractiveHTML(data);
      const now = new Date();
      const filename = `analisis-icfes-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.html`;
      downloadHTML(html, filename);
    } catch (error) {
      console.error('Error al exportar HTML:', error);
      alert('Error al exportar la presentación. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-blue-700 mb-2">Exportar Presentación Web</h3>
          <p className="text-sm text-gray-600">
            Genera un archivo HTML interactivo con todos los gráficos y métricas para compartir con tu equipo
          </p>
        </div>
        <Globe size={48} className="text-blue-500" />
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-blue-800 mb-2">✨ Características del archivo:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>📊 <strong>Gráficos interactivos</strong> - Todos los botones y controles funcionan</li>
          <li>🔄 <strong>Comparación PIAR</strong> - Activar/desactivar en tiempo real</li>
          <li>📈 <strong>Cambio de métricas</strong> - Promedios ↔ Desviación estándar</li>
          <li>🎨 <strong>Diseño profesional</strong> - Listo para presentaciones</li>
          <li>🔒 <strong>Sin datos sensibles</strong> - Solo métricas y gráficos agregados</li>
          <li>⚡ <strong>Archivo único</strong> - Todo embebido, funciona sin internet</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-yellow-800 mb-2">📤 ¿Cómo compartirlo?</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Súbelo a <strong>Vercel</strong> (gratis, sin consumo de recursos dinámicos)</li>
          <li>• Compártelo en <strong>Google Drive</strong> con enlace público</li>
          <li>• Envíalo por <strong>correo electrónico</strong></li>
          <li>• Publícalo en tu <strong>sitio web</strong></li>
          <li>• Guárdalo en <strong>Dropbox/OneDrive</strong></li>
        </ul>
      </div>

      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
      >
        <Globe size={24} />
        Exportar Presentación Web
      </button>
    </div>
  );
}
