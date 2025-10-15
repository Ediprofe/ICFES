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
      {/* Título principal con descripción mejorado */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-2xl shadow-2xl p-12 text-center text-white overflow-hidden">
        {/* Efecto de fondo animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <BarChart3 size={56} className="text-white" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              Reporte de resultados pruebas tipo Saber
            </h1>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-2xl text-blue-100 max-w-4xl mx-auto font-light leading-relaxed">
            Carga tu archivo Excel y obtén <span className="font-bold">análisis interactivos en vivo</span>, archivo HTML para presentaciones sin internet, y reporte PDF profesional.
          </p>
        </div>
      </div>
      
      {/* Zona de carga mejorada */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative flex flex-col items-center justify-center h-64 border-3 border-dashed border-blue-600 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-lg">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full p-6 mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Upload size={48} className="text-white" />
          </div>
          <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg">
            📂 Seleccionar archivo Excel
            <input type="file" accept=".xlsx,.xlsm" onChange={handleFile} className="hidden" />
          </label>
          <p className="text-sm text-gray-600 mt-6 font-medium">✅ Soporta archivos .xlsx y .xlsm</p>
          <p className="text-xs text-gray-500 mt-2">Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
        </div>
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
          Aprende a cargar el Excel, visualizar el análisis en vivo, exportar el informe HTML para presentaciones (offline, al abrir con un navegador), y generar el PDF para enviar
        </p>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            src="https://www.youtube.com/embed/IvSn37VhKOY"
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
