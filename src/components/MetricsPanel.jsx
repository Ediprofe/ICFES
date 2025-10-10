import { calculateAreaMetrics, getTop5BySubject, getTop3ByGrade, getMetricsByGrade, findOutliers, mean, stdDev } from '../utils/calculations';

export default function MetricsPanel({ data }) {
  // Calcular datos completos (todos los estudiantes)
  const allData = data;
  const dataConPIAR = allData;
  const dataSinPIAR = allData.filter(s => s['¿PIAR?'] !== 'Sí');
  
  // Promedios globales
  const globalAvgConPIAR = mean(dataConPIAR.map(s => s.Global)).toFixed(2);
  const globalAvgSinPIAR = mean(dataSinPIAR.map(s => s.Global)).toFixed(2);
  
  // Métricas por área con y sin PIAR
  const metricsConPIAR = calculateAreaMetrics(dataConPIAR, false);
  const metricsSinPIAR = calculateAreaMetrics(dataSinPIAR, false);
  
  // Métricas por grado
  const metricsByGrade = getMetricsByGrade(data);
  
  const outliers = findOutliers(data);
  const top3ByGrade = getTop3ByGrade(data);
  
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  
  // Colores por área
  const areaColors = {
    'Lectura crítica': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-300',
      light: 'bg-blue-100'
    },
    'Matemáticas': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-300',
      light: 'bg-red-100'
    },
    'Sociales': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-300',
      light: 'bg-orange-100'
    },
    'Naturales': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-300',
      light: 'bg-green-100'
    },
    'Inglés': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-300',
      light: 'bg-purple-100'
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Métrica Global - Comparación con/sin PIAR */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Métricas globales</h2>
        
        {/* Comparación Global con/sin PIAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300 opacity-75">
            <p className="text-sm text-gray-500 mb-1">Promedio global (con PIAR)</p>
            <p className="text-3xl font-bold text-gray-600">{globalAvgConPIAR}</p>
            <p className="text-xs text-gray-400 mt-1">{dataConPIAR.length} estudiantes</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-4 border-green-500 shadow-lg">
            <p className="text-sm text-green-800 mb-1 font-semibold">Promedio global (sin PIAR)</p>
            <p className="text-4xl font-bold text-green-600">{globalAvgSinPIAR}</p>
            <p className="text-xs text-green-700 mt-1 font-medium">{dataSinPIAR.length} estudiantes</p>
          </div>
        </div>

        {/* Otras métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de estudiantes</p>
            <p className="text-3xl font-bold text-purple-600">{data.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Estudiantes excepcionales</p>
            <p className="text-3xl font-bold text-yellow-600">{outliers.length}</p>
          </div>
        </div>
      </div>

      {/* Métricas por Área - Comparación con/sin PIAR */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Métricas por área (comparación con/sin PIAR)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left" rowSpan="2">Área</th>
                <th className="p-2 text-center border-l-2 border-gray-300" colSpan="2">Promedio</th>
                <th className="p-2 text-center border-l-2 border-gray-300" colSpan="2">Desviación estándar</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="p-2 text-right text-xs border-l-2 border-gray-300 text-gray-500">con PIAR</th>
                <th className="p-2 text-right text-xs text-green-700 font-bold">sin PIAR</th>
                <th className="p-2 text-right text-xs border-l-2 border-gray-300 text-gray-500">con PIAR</th>
                <th className="p-2 text-right text-xs text-green-700 font-bold">sin PIAR</th>
              </tr>
            </thead>
            <tbody>
              {metricsConPIAR.map((metric, index) => {
                const colors = areaColors[metric.area] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300', light: 'bg-gray-100' };
                return (
                  <tr key={index} className={`border-b hover:${colors.light} transition-colors`}>
                    <td className={`p-3 font-semibold ${colors.text}`}>{metric.area}</td>
                    <td className="p-3 text-right border-l-2 border-gray-200 bg-gray-50 text-gray-500">{metric.promedio}</td>
                    <td className={`p-3 text-right ${colors.light} ${colors.text} font-bold border-2 ${colors.border}`}>{metricsSinPIAR[index].promedio}</td>
                    <td className="p-3 text-right border-l-2 border-gray-200 bg-gray-50 text-gray-500">{metric.desviacion}</td>
                    <td className={`p-3 text-right ${colors.light} ${colors.text} font-bold border-2 ${colors.border}`}>{metricsSinPIAR[index].desviacion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Métricas por Grado (comparación con/sin PIAR) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Métricas por grado (comparación con/sin PIAR)</h2>
        <div className="space-y-6">
          {metricsByGrade.map((gradeData) => (
            <div key={gradeData.grado} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-300">
                <h3 className="text-xl font-bold text-gray-800">Grado {gradeData.grado}</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{gradeData.totalEstudiantes}</span> estudiantes total
                  {' | '}
                  <span className="font-semibold text-green-600">{gradeData.estudiantesSinPIAR}</span> sin PIAR
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left" rowSpan="2">Área</th>
                      <th className="p-2 text-center border-l-2 border-gray-300" colSpan="2">Promedio</th>
                      <th className="p-2 text-center border-l-2 border-gray-300" colSpan="2">Desviación estándar</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-right text-xs border-l-2 border-gray-300 text-gray-500">con PIAR</th>
                      <th className="p-2 text-right text-xs text-green-700 font-bold">sin PIAR</th>
                      <th className="p-2 text-right text-xs border-l-2 border-gray-300 text-gray-500">con PIAR</th>
                      <th className="p-2 text-right text-xs text-green-700 font-bold">sin PIAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeData.metricsConPIAR.map((metric, index) => {
                      const colors = areaColors[metric.subject] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300', light: 'bg-gray-100' };
                      const metricSinPIAR = gradeData.metricsSinPIAR[index];
                      return (
                        <tr key={index} className={`border-b hover:${colors.light} transition-colors`}>
                          <td className={`p-3 font-semibold ${colors.text}`}>{metric.subject}</td>
                          <td className="p-3 text-right border-l-2 border-gray-200 bg-gray-50 text-gray-500">{metric.promedio}</td>
                          <td className={`p-3 text-right ${colors.light} ${colors.text} font-bold border-2 ${colors.border}`}>{metricSinPIAR.promedio}</td>
                          <td className="p-3 text-right border-l-2 border-gray-200 bg-gray-50 text-gray-500">{metric.desviacion}</td>
                          <td className={`p-3 text-right ${colors.light} ${colors.text} font-bold border-2 ${colors.border}`}>{metricSinPIAR.desviacion}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 por Área */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Top 5 por área</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => {
            const top5 = getTop5BySubject(data, subject);
            const colors = areaColors[subject] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300', light: 'bg-gray-100' };
            return (
              <div key={subject} className={`border-2 ${colors.border} rounded-lg p-4 ${colors.bg} hover:shadow-md transition-shadow`}>
                <h3 className={`font-bold text-lg mb-3 ${colors.text} pb-2 border-b-2 ${colors.border}`}>{subject}</h3>
                <ol className="space-y-2">
                  {top5.map((student, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-sm">
                        <span className={`font-bold ${colors.text}`}>{index + 1}.</span> {student.nombreCompleto}
                      </span>
                      <span className={`font-bold ${colors.text}`}>{student.puntaje.toFixed(2)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 3 por Grado */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Top 3 por grado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {top3ByGrade.map(({ grado, top }) => (
            <div key={grado} className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-3 text-indigo-700 pb-2 border-b-2 border-indigo-300">Grado {grado}</h3>
              <ol className="space-y-2">
                {top.map((student, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm">
                      <span className="font-bold text-indigo-700">{index + 1}.</span> {student.nombreCompleto}
                    </span>
                    <span className="font-bold text-indigo-700">{student.global.toFixed(2)}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Valores Atípicos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">Valores atípicos (outliers)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Estudiantes cuyo puntaje global se encuentra a más de 3 desviaciones estándar (±3σ) del promedio
        </p>
        
        {outliers.length > 0 ? (
          <>
            {/* Resumen estadístico */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                <p className="text-sm text-gray-600 mb-1">Total de valores atípicos</p>
                <p className="text-3xl font-bold text-yellow-600">{outliers.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((outliers.length / data.length) * 100).toFixed(1)}% del total
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <p className="text-sm text-gray-600 mb-1">Rendimiento sobresaliente</p>
                <p className="text-3xl font-bold text-green-600">
                  {outliers.filter(s => {
                    const globals = data.map(st => st.Global);
                    const avg = mean(globals);
                    const sd = stdDev(globals);
                    return (s.Global - avg) / sd > 0;
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Por encima de +3σ</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                <p className="text-sm text-gray-600 mb-1">Bajo rendimiento</p>
                <p className="text-3xl font-bold text-red-600">
                  {outliers.filter(s => {
                    const globals = data.map(st => st.Global);
                    const avg = mean(globals);
                    const sd = stdDev(globals);
                    return (s.Global - avg) / sd < 0;
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Por debajo de -3σ</p>
              </div>
            </div>

            {/* Tabla de valores atípicos */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Apellido</th>
                    <th className="p-3 text-left">Grupo</th>
                    <th className="p-3 text-right">Puntaje global</th>
                    <th className="p-3 text-right">Z-Score</th>
                    <th className="p-3 text-center">Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {outliers.map((student, index) => {
                    const globals = data.map(s => s.Global);
                    const avg = mean(globals);
                    const sd = stdDev(globals);
                    const z = (student.Global - avg) / sd;
                    const isSobresaliente = z > 0;
                    
                    return (
                      <tr key={index} className={`border-b hover:bg-gray-50 ${isSobresaliente ? 'bg-green-50' : 'bg-red-50'}`}>
                        <td className="p-3">{student.Nombre}</td>
                        <td className="p-3">{student.Apellido}</td>
                        <td className="p-3">{student.Grupo}</td>
                        <td className="p-3 text-right font-bold">{student.Global.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold">{z.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            isSobresaliente 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-red-200 text-red-800'
                          }`}>
                            {isSobresaliente ? 'Sobresaliente ↑' : 'Bajo rendimiento ↓'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 mb-2">✓ No se encontraron valores atípicos</p>
            <p className="text-sm text-gray-500">
              Todos los estudiantes se encuentran dentro del rango normal (±3σ)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
