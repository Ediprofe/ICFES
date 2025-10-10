import { FileDown } from 'lucide-react';
import { generatePDF } from '../utils/pdfBuilder';

export default function PDFGenerator({ data }) {
  const handleDownload = () => {
    console.log('Botón de descarga presionado');
    console.log('Datos disponibles:', data ? data.length : 0);
    
    if (!data || data.length === 0) {
      alert('No hay datos para generar el informe');
      return;
    }
    
    generatePDF(data);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Exportar Informe PDF</h3>
          <p className="text-sm text-gray-600">
            Genera un documento PDF con todos los datos, métricas y gráficos para imprimir o compartir
          </p>
        </div>
        <FileDown size={48} className="text-red-500" />
      </div>

      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-red-800 mb-2">📄 Características del PDF:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>📊 <strong>Gráficos estáticos</strong> - Imágenes de alta calidad</li>
          <li>📋 <strong>Listado completo</strong> - Todos los estudiantes con sus puntajes</li>
          <li>📈 <strong>Métricas detalladas</strong> - Por área y por grado</li>
          <li>🏆 <strong>Rankings</strong> - Top 5 por área y Top 3 por grado</li>
          <li>📑 <strong>Formato profesional</strong> - Listo para imprimir</li>
          <li>🔒 <strong>Datos completos</strong> - Incluye nombres y puntajes individuales</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-yellow-800 mb-2">💡 Recomendado para:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Reuniones de <strong>coordinación académica</strong></li>
          <li>• Informes para <strong>rectores y directivos</strong></li>
          <li>• Documentación <strong>oficial del colegio</strong></li>
          <li>• Archivos <strong>para imprimir y archivar</strong></li>
          <li>• Respaldo <strong>físico de los resultados</strong></li>
        </ul>
      </div>

      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
      >
        <FileDown size={24} />
        Descargar Informe PDF
      </button>
    </div>
  );
}
