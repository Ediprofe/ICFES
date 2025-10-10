import { calculateAreaMetrics, getTop5BySubject, getTop3ByGrade, findOutliers, mean } from '../utils/calculations';

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
  
  const outliers = findOutliers(data);
  const top3ByGrade = getTop3ByGrade(data);
  
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  
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
              {metricsConPIAR.map((metric, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{metric.area}</td>
                  <td className="p-2 text-right border-l-2 border-gray-200 bg-gray-100 text-gray-500">{metric.promedio}</td>
                  <td className="p-2 text-right bg-green-100 text-green-800 font-bold border-2 border-green-300">{metricsSinPIAR[index].promedio}</td>
                  <td className="p-2 text-right border-l-2 border-gray-200 bg-gray-100 text-gray-500">{metric.desviacion}</td>
                  <td className="p-2 text-right bg-green-100 text-green-800 font-bold border-2 border-green-300">{metricsSinPIAR[index].desviacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 3 por Grado */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Top 3 por grado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {top3ByGrade.map(({ grado, top }) => (
            <div key={grado} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-primary">Grado {grado}</h3>
              <ol className="space-y-2">
                {top.map((student, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm">
                      <span className="font-bold">{index + 1}.</span> {student.nombreCompleto}
                    </span>
                    <span className="font-bold text-primary">{student.global.toFixed(2)}</span>
                  </li>
                ))}
              </ol>
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
            return (
              <div key={subject} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2 text-primary">{subject}</h3>
                <ol className="space-y-2">
                  {top5.map((student, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-sm">
                        <span className="font-bold">{index + 1}.</span> {student.nombreCompleto}
                      </span>
                      <span className="font-bold text-primary">{student.puntaje.toFixed(2)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outliers */}
      {outliers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Estudiantes con desempeño excepcional (±3σ)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-50">
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Apellido</th>
                  <th className="p-2 text-left">Grupo</th>
                  <th className="p-2 text-right">Global</th>
                </tr>
              </thead>
              <tbody>
                {outliers.map((student, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{student.Nombre}</td>
                    <td className="p-2">{student.Apellido}</td>
                    <td className="p-2">{student.Grupo}</td>
                    <td className="p-2 text-right font-bold">{student.Global.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
