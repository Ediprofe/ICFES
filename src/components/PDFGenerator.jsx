import { FileDown } from 'lucide-react';
import { generatePDF } from '../utils/pdfBuilder';

export default function PDFGenerator({ data, filters }) {
  return (
    <button 
      onClick={() => generatePDF(data, filters)}
      className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 transition-all hover:scale-105"
    >
      <FileDown size={20} />
      Descargar PDF
    </button>
  );
}
