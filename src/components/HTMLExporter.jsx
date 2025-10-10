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
      alert('Error al exportar el informe. Por favor, intenta de nuevo.');
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 transition-all hover:scale-105 z-50 cursor-pointer"
    >
      <Globe size={20} />
      Descargar Informe Completo
    </button>
  );
}
