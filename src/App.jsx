import { useState } from 'react';
import FileUploader from './components/FileUploader';
import StudentsTable from './components/StudentsTable';
import ChartsPanel from './components/ChartsPanel';
import MetricsPanel from './components/MetricsPanel';
import FilterControls from './components/FilterControls';
import PDFGenerator from './components/PDFGenerator';
import GradeAreaCharts from './components/GradeAreaCharts';
import { addPercentiles } from './utils/percentiles';
import { Youtube, Music2, Globe } from 'lucide-react';

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
    setData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 
            className="text-4xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleResetApp}
            title="Volver al inicio"
          >
            Análisis ICFES
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Desarrollado por</p>
            <a 
              href="https://ediprofe.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors block mb-3"
            >
              ediprofe.com
            </a>
            <div className="flex items-center justify-end gap-3">
              <a
                href="https://www.youtube.com/@ProfeEdi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                title="YouTube"
              >
                <Youtube size={24} fill="currentColor" />
              </a>
              <a
                href="https://www.tiktok.com/@ediprofe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-900 hover:text-gray-700 transition-colors"
                title="TikTok"
              >
                <Music2 size={24} />
              </a>
              <a
                href="https://ediprofe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                title="Sitio Web"
              >
                <Globe size={24} />
              </a>
            </div>
          </div>
        </div>
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
          
          <PDFGenerator data={data} />
          
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
