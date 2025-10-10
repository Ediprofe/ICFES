import { Upload } from 'lucide-react';
import { parseExcel } from '../utils/excelParser';

export default function FileUploader({ onFileLoaded }) {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const data = await parseExcel(file);
      onFileLoaded(data);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-primary rounded-lg bg-white">
      <Upload size={48} className="text-primary mb-4" />
      <label className="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Seleccionar archivo Excel
        <input type="file" accept=".xlsx,.xlsm" onChange={handleFile} className="hidden" />
      </label>
      <p className="text-sm text-gray-500 mt-4">Soporta archivos .xlsx y .xlsm</p>
    </div>
  );
}
