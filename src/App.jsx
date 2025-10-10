import { useState } from 'react';
import FileUploader from './components/FileUploader';
import StudentsTable from './components/StudentsTable';
import ChartsPanel from './components/ChartsPanel';
import MetricsPanel from './components/MetricsPanel';
import FilterControls from './components/FilterControls';
import PDFGenerator from './components/PDFGenerator';
import { addPercentiles } from './utils/percentiles';

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
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">ICFES Analyzer</h1>
        <p className="text-gray-600">Análisis interactivo de resultados académicos</p>
      </header>
      
      {!data ? (
        <FileUploader onFileLoaded={handleFileLoaded} />
      ) : (
        <div className="space-y-6">
          <FilterControls 
            filters={filters} 
            setFilters={setFilters} 
            grades={[...new Set(data.map(s => s.Grupo))]}
          />
          
          {/* Tabla de estudiantes PRIMERO */}
          <StudentsTable data={filteredData} />
          
          {/* Métricas y gráficos después - ahora muestran comparación con/sin PIAR internamente */}
          <MetricsPanel data={data} />
          <ChartsPanel data={data} />
          
          <PDFGenerator data={data} filters={filters} />
        </div>
      )}
    </div>
  );
}

export default App;
