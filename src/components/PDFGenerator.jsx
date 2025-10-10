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
    <button 
      onClick={handleDownload}
      className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 transition-all hover:scale-105 z-50 cursor-pointer"
    >
      <FileDown size={20} />
      Descargar Informe PDF
    </button>
  );
}
