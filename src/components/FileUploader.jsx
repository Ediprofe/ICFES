import { Upload, Download, AlertCircle, CheckCircle, BarChart3, Image } from 'lucide-react';
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
  
  const handleDownloadTemplate = () => {
    // Link directo a Google Drive para descargar
    window.open('https://docs.google.com/spreadsheets/d/1yWM2rnUcBc4QTe-Jf8713qTyPbdzvwlP/export?format=xlsx', '_blank');
  };
  
  return (
    <div className="space-y-6">
      {/* Título principal con descripción */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BarChart3 size={48} />
          <h1 className="text-4xl font-bold">Analiza los resultados ICFES de tu colegio</h1>
        </div>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Carga tu archivo Excel con los datos de los estudiantes y obtén un análisis completo 
          con métricas, gráficos comparativos y reportes en PDF
        </p>
      </div>
      
      {/* Zona de carga PRIMERO */}
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-blue-600 rounded-lg bg-white hover:bg-blue-50 transition-colors">
        <Upload size={48} className="text-blue-600 mb-4" />
        <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Seleccionar archivo Excel
          <input type="file" accept=".xlsx,.xlsm" onChange={handleFile} className="hidden" />
        </label>
        <p className="text-sm text-gray-500 mt-4">Soporta archivos .xlsx y .xlsm</p>
      </div>
      
      {/* Video de demostración */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-600 text-white rounded-full p-2">
            <BarChart3 size={24} />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">
            🎥 Video de demostración
          </h2>
        </div>
        <p className="text-purple-800 mb-4">
          Mira cómo funciona: carga del Excel, visualización del reporte en la web, descarga del PDF y vista previa del informe
        </p>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            src="https://www.youtube.com/embed/XQ3rpX4eLEM"
            title="Video de demostración - Analizador ICFES"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      
      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
          <AlertCircle size={28} />
          Instrucciones para cargar los datos
        </h2>
        
        <div className="space-y-4 text-blue-900">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div>
              <p className="font-semibold mb-1">Descarga el archivo de plantilla</p>
              <p className="text-sm text-blue-800">
                Usa el botón de abajo para descargar el archivo de ejemplo. Este archivo te servirá como molde para organizar tus datos.
              </p>
              <button
                onClick={handleDownloadTemplate}
                className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download size={18} />
                Descargar plantilla de ejemplo
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div className="w-full">
              <p className="font-semibold mb-2">Estructura del archivo Excel</p>
              <p className="text-sm text-blue-800 mb-3">
                Tu archivo debe verse exactamente como el ejemplo de abajo. Los campos con fondo amarillo son obligatorios.
              </p>
              
              {/* Imagen de ejemplo */}
              <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-3">
                  <Image size={20} className="text-blue-600" />
                  <p className="font-semibold text-blue-900 text-sm">Ejemplo de cómo debe lucir tu archivo Excel:</p>
                </div>
                <img 
                  src="/image.png" 
                  alt="Ejemplo de estructura del Excel" 
                  className="w-full rounded border border-gray-300 shadow-sm"
                />
                <div className="mt-3 text-xs text-blue-700 bg-blue-50 p-3 rounded">
                  <p className="font-semibold mb-1">⚠️ Recuerda:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Las columnas con fondo amarillo son obligatorias</li>
                    <li>Los percentiles son opcionales</li>
                    <li>No dejes espacios vacíos en las columnas obligatorias</li>
                    <li>Usa el formato exacto de los nombres de columnas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
              ⚠️
            </div>
            <div>
              <p className="font-semibold mb-1 text-orange-900">Importante: No agregues datos debajo de la tabla</p>
              <p className="text-sm text-blue-800">
                Solo debes llenar la tabla con los datos de tus estudiantes. No agregues filas adicionales, totales, ni comentarios debajo de la tabla de datos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
