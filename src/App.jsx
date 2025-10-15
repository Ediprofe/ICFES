import { useState } from 'react';
import FileUploader from './components/FileUploader';
import StudentsTable from './components/StudentsTable';
import MetricsPanel from './components/MetricsPanel';
import FilterControls from './components/FilterControls';
import PDFGenerator from './components/PDFGenerator';
import GradeAreaCharts from './components/GradeAreaCharts';
import HTMLExporter from './components/HTMLExporter';
import { addPercentiles } from './utils/percentiles';
import { Youtube, Music2, Globe, RefreshCw, BarChart3 } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    excludePIAR: false,
    selectedGrade: 'Todos',
    minScore: 0,
    maxScore: 500
  });
  
  const handleFileLoaded = (parsedData) => {
    const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
    const withPercentiles = addPercentiles(parsedData, subjects);
    setData(withPercentiles);
  };
  
  const filteredData = data ? data.filter(student => {
    if (filters.excludePIAR && student['¿PIAR?'] === 'Sí') return false;
    if (filters.selectedGrade !== 'Todos' && student.Grupo !== filters.selectedGrade) return false;
    if (student.Global < filters.minScore || student.Global > filters.maxScore) return false;
    return true;
  }).sort((a, b) => b.Global - a.Global) : [];
  
  const handleResetApp = () => {
    if (data && !confirm('¿Deseas iniciar un nuevo análisis? Los datos actuales se perderán.')) {
      return;
    }
    setData(null);
    setFilters({
      excludePIAR: false,
      selectedGrade: 'Todos',
      minScore: 0,
      maxScore: 500
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
        {/* Encabezado principal */}
        <div className="p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Título y descripción */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <BarChart3 size={40} className="text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Reporte de resultados pruebas tipo Saber
                </h1>
              </div>
              <p className="text-blue-100 text-lg ml-16">
                Sistema de análisis de resultados académicos
              </p>
            </div>
            
            {/* Información del desarrollador */}
            <div className="text-center lg:text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-200 mb-1">Desarrollado por</p>
              <a 
                href="https://ediprofe.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl font-bold text-white hover:text-blue-200 transition-colors block mb-3"
              >
                ediprofe.com
              </a>
              <div className="flex items-center justify-center lg:justify-end gap-3">
                <a
                  href="https://www.youtube.com/@ProfeEdi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors bg-white/20 rounded-full p-2"
                  title="YouTube"
                >
                  <Youtube size={24} fill="currentColor" />
                </a>
                <a
                  href="https://www.tiktok.com/@ediprofe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-blue-200 transition-colors bg-white/20 rounded-full p-2"
                  title="TikTok"
                >
                  <Music2 size={24} />
                </a>
                <a
                  href="https://ediprofe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-200 hover:text-white transition-colors bg-white/20 rounded-full p-2"
                  title="Sitio Web"
                >
                  <Globe size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de acciones (solo visible cuando hay datos) */}
        {data && (
          <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">Cohorte activa</p>
                  <p className="text-2xl font-bold">2025</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">Total estudiantes</p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
              </div>
              
              <button
                onClick={handleResetApp}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                title="Iniciar nuevo análisis"
              >
                <RefreshCw size={20} />
                <span>Nuevo análisis</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!data ? (
        <FileUploader onFileLoaded={handleFileLoaded} />
      ) : (
        <div className="space-y-6">
          <FilterControls 
            filters={filters} 
            setFilters={setFilters} 
            grades={[...new Set(data.map(s => s.Grupo))]}
          />
          
          {/* 1. Listado de estudiantes */}
          <StudentsTable data={filteredData} />
          
          {/* 2. Métricas globales, por área y por grado */}
          <MetricsPanel data={data} />
          
          {/* 3. Análisis detallado: Grado por área (gráficos interactivos) */}
          <GradeAreaCharts data={data} />
          
          {/* Exportadores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PDFGenerator data={data} />
            <HTMLExporter data={data} />
          </div>
          
          {/* Footer */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Desarrollado por{' '}
              <a 
                href="https://ediprofe.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                ediprofe.com
              </a>
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.youtube.com/@ProfeEdi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                title="YouTube"
              >
                <Youtube size={28} fill="currentColor" />
                <span className="text-sm font-semibold">YouTube</span>
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="https://www.tiktok.com/@ediprofe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
                title="TikTok"
              >
                <Music2 size={28} />
                <span className="text-sm font-semibold">TikTok</span>
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="https://ediprofe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                title="Sitio Web"
              >
                <Globe size={28} />
                <span className="text-sm font-semibold">Web</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
