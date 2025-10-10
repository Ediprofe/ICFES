import { useState, Fragment } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { getMetricsByGrade } from '../utils/calculations';

export default function GradeAreaCharts({ data }) {
  const [showPIAR, setShowPIAR] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('promedio'); // 'promedio' o 'desviacion'
  
  const metricsByGrade = getMetricsByGrade(data);
  
  // Colores por área
  const areaColors = {
    'Lectura crítica': '#3b82f6', // Azul
    'Matemáticas': '#ef4444', // Rojo
    'Sociales': '#f97316', // Naranja
    'Naturales': '#22c55e', // Verde
    'Inglés': '#a855f7' // Morado
  };
  
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  
  // Preparar datos para gráficos por área
  const chartsByArea = subjects.map(subject => {
    const chartData = metricsByGrade.map(gradeData => {
      const metricConPIAR = gradeData.metricsConPIAR.find(m => m.subject === subject);
      const metricSinPIAR = gradeData.metricsSinPIAR.find(m => m.subject === subject);
      
      const valueKey = selectedMetric === 'promedio' ? 'promedio' : 'desviacion';
      
      return {
        grado: gradeData.grado,
        'Con PIAR': parseFloat(metricConPIAR[valueKey]) || 0,
        'Sin PIAR': parseFloat(metricSinPIAR[valueKey]) || 0
      };
    });
    
    return {
      subject,
      shortName: subject.replace(' crítica', ''),
      color: areaColors[subject],
      chartData
    };
  });
  
  // Calcular dominio dinámico
  const allValues = chartsByArea.flatMap(area => 
    area.chartData.flatMap(d => [d['Con PIAR'], d['Sin PIAR']])
  ).filter(v => v > 0);
  
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.15;
  const domainMin = selectedMetric === 'promedio' ? Math.max(0, Math.floor(minValue - padding)) : 0;
  const domainMax = Math.ceil(maxValue + padding);
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">
          Análisis detallado: Grado por área
        </h2>
        <div className="flex gap-4">
          {/* Toggle para mostrar/ocultar comparación */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Comparar con/sin PIAR:</span>
            <button
              onClick={() => setShowPIAR(!showPIAR)}
              className={`px-4 py-2 rounded-lg transition-all ${
                showPIAR 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {showPIAR ? 'Activa' : 'Desactivada'}
            </button>
          </div>
          
          {/* Toggle para métrica */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Métrica:</span>
            <div className="flex rounded-lg overflow-hidden border-2 border-indigo-200">
              <button
                onClick={() => setSelectedMetric('promedio')}
                className={`px-4 py-2 transition-all ${
                  selectedMetric === 'promedio'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Promedios
              </button>
              <button
                onClick={() => setSelectedMetric('desviacion')}
                className={`px-4 py-2 transition-all ${
                  selectedMetric === 'desviacion'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Desviación Est.
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Comparación de {selectedMetric === 'promedio' ? 'promedios' : 'desviaciones estándar'} por grado en cada área académica, 
        mostrando la diferencia entre estudiantes con y sin PIAR.
      </p>
      
      {/* Gráficos individuales por área */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chartsByArea.map((areaData, index) => (
          <div key={index} className="border-2 border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 
              className="text-lg font-bold mb-4 text-center pb-2 border-b-2" 
              style={{ color: areaData.color, borderColor: areaData.color }}
            >
              {areaData.subject}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={areaData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="grado" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Grado', position: 'insideBottom', offset: -5, style: { fontSize: 12, fontWeight: 'bold' } }}
                />
                <YAxis 
                  domain={[domainMin, domainMax]}
                  tick={{ fontSize: 11 }}
                  label={{ 
                    value: selectedMetric === 'promedio' ? 'Puntaje' : 'Desviación', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 12, fontWeight: 'bold' }
                  }}
                />
                <Tooltip 
                  formatter={(value) => value.toFixed(2)}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="square"
                />
                {showPIAR ? (
                  <>
                    <Bar dataKey="Con PIAR" fill="#9ca3af" fillOpacity={0.6} radius={[8, 8, 0, 0]}>
                      <LabelList 
                        dataKey="Con PIAR" 
                        position="top" 
                        style={{ fontSize: '11px', fontWeight: 'bold', fill: '#6b7280' }} 
                        formatter={(value) => value.toFixed(1)} 
                      />
                    </Bar>
                    <Bar dataKey="Sin PIAR" fill={areaData.color} radius={[8, 8, 0, 0]}>
                      <LabelList 
                        dataKey="Sin PIAR" 
                        position="top" 
                        style={{ fontSize: '11px', fontWeight: 'bold', fill: areaData.color }} 
                        formatter={(value) => value.toFixed(1)} 
                      />
                    </Bar>
                  </>
                ) : (
                  <Bar dataKey="Sin PIAR" fill={areaData.color} radius={[8, 8, 0, 0]}>
                    <LabelList 
                      dataKey="Sin PIAR" 
                      position="top" 
                      style={{ fontSize: '11px', fontWeight: 'bold', fill: areaData.color }} 
                      formatter={(value) => value.toFixed(1)} 
                    />
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
