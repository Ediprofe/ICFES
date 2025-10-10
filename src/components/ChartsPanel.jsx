import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { calculateAreaMetrics } from '../utils/calculations';

export default function ChartsPanel({ data }) {
  const [showPIAR, setShowPIAR] = useState(true);
  
  // Calcular métricas con PIAR y sin PIAR
  const metricsConPIAR = calculateAreaMetrics(data, false);
  const metricsSinPIAR = calculateAreaMetrics(data, true);
  
  // Colores por área
  const areaColors = {
    'Lectura': '#3b82f6', // Azul
    'Matemáticas': '#ef4444', // Rojo
    'Sociales': '#f97316', // Naranja
    'Naturales': '#22c55e', // Verde
    'Inglés': '#a855f7' // Morado
  };
  
  // Preparar datos para el gráfico comparativo
  const chartData = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    areaFull: m.area,
    'Con PIAR': parseFloat(m.promedio),
    'Sin PIAR': parseFloat(metricsSinPIAR[index].promedio)
  }));
  
  const chartDataDesviacion = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    areaFull: m.area,
    'Con PIAR': parseFloat(m.desviacion),
    'Sin PIAR': parseFloat(metricsSinPIAR[index].desviacion)
  }));
  
  // Función para obtener el color de la barra según el área
  const getBarColor = (entry) => {
    return areaColors[entry.area] || '#10b981';
  };
  
  // Preparar datos de percentiles por área
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  const dataSinPIAR = data.filter(s => s['¿PIAR?'] !== 'Sí');
  
  const chartDataPercentiles = subjects.map(subject => {
    const percentileKey = `Percentil ${subject}`;
    const area = subject.replace(' crítica', '');
    
    // Calcular promedio CON PIAR
    const studentsWithPercentilesConPIAR = data.filter(s => 
      s[percentileKey] !== undefined && 
      s[percentileKey] !== null && 
      s[percentileKey] !== ''
    );
    
    let avgPercentileConPIAR = null;
    if (studentsWithPercentilesConPIAR.length > 0) {
      const sum = studentsWithPercentilesConPIAR.reduce((acc, s) => {
        const value = parseFloat(s[percentileKey]);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
      avgPercentileConPIAR = sum / studentsWithPercentilesConPIAR.length;
    }
    
    // Calcular promedio SIN PIAR
    const studentsWithPercentilesSinPIAR = dataSinPIAR.filter(s => 
      s[percentileKey] !== undefined && 
      s[percentileKey] !== null && 
      s[percentileKey] !== ''
    );
    
    let avgPercentileSinPIAR = null;
    if (studentsWithPercentilesSinPIAR.length > 0) {
      const sum = studentsWithPercentilesSinPIAR.reduce((acc, s) => {
        const value = parseFloat(s[percentileKey]);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
      avgPercentileSinPIAR = sum / studentsWithPercentilesSinPIAR.length;
    }
    
    return {
      area,
      'Con PIAR': avgPercentileConPIAR,
      'Sin PIAR': avgPercentileSinPIAR,
      hasData: avgPercentileConPIAR !== null || avgPercentileSinPIAR !== null
    };
  });
  
  // Verificar si hay datos de percentiles
  const hasPercentileData = chartDataPercentiles.some(d => d.hasData);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Toggle para mostrar/ocultar comparación */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Promedios por área</h2>
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
            {showPIAR ? 'Comparación activa' : 'Comparación desactivada'}
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="area" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          {showPIAR ? (
            <>
              <Bar dataKey="Con PIAR" fill="#9ca3af" fillOpacity={0.5}>
                <LabelList dataKey="Con PIAR" position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#6b7280' }} formatter={(value) => value.toFixed(1)} />
              </Bar>
              <Bar dataKey="Sin PIAR" strokeWidth={2}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry)} stroke={getBarColor(entry)} strokeOpacity={0.8} />
                ))}
                <LabelList dataKey="Sin PIAR" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => value.toFixed(1)} />
              </Bar>
            </>
          ) : (
            <Bar dataKey="Sin PIAR" strokeWidth={2}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} stroke={getBarColor(entry)} strokeOpacity={0.8} />
              ))}
              <LabelList dataKey="Sin PIAR" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => value.toFixed(1)} />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Desviación estándar por área</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartDataDesviacion}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="area" />
          <YAxis domain={[0, 30]} />
          <Tooltip />
          <Legend />
          {showPIAR ? (
            <>
              <Bar dataKey="Con PIAR" fill="#9ca3af" fillOpacity={0.5}>
                <LabelList dataKey="Con PIAR" position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#6b7280' }} formatter={(value) => value.toFixed(1)} />
              </Bar>
              <Bar dataKey="Sin PIAR" strokeWidth={2}>
                {chartDataDesviacion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry)} stroke={getBarColor(entry)} strokeOpacity={0.8} />
                ))}
                <LabelList dataKey="Sin PIAR" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => value.toFixed(1)} />
              </Bar>
            </>
          ) : (
            <Bar dataKey="Sin PIAR" strokeWidth={2}>
              {chartDataDesviacion.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} stroke={getBarColor(entry)} strokeOpacity={0.8} />
              ))}
              <LabelList dataKey="Sin PIAR" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => value.toFixed(1)} />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>

      {/* Gráfico de Percentiles por área */}
      {hasPercentileData && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">
            Percentiles promedio por área
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {chartDataPercentiles.filter(d => d.hasData).length === subjects.length 
              ? 'Mostrando percentiles para todas las áreas' 
              : 'Mostrando solo las áreas con datos de percentiles disponibles'}
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartDataPercentiles.filter(d => d.hasData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => `${value.toFixed(1)}%`}
                labelFormatter={(label) => `Área: ${label}`}
              />
              <Legend />
              {showPIAR ? (
                <>
                  <Bar dataKey="Con PIAR" fill="#9ca3af" fillOpacity={0.5}>
                    <LabelList dataKey="Con PIAR" position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#6b7280' }} formatter={(value) => value ? `${value.toFixed(1)}%` : ''} />
                  </Bar>
                  <Bar dataKey="Sin PIAR" strokeWidth={2}>
                    {chartDataPercentiles.filter(d => d.hasData).map((entry, index) => (
                      <Cell key={`cell-percentile-${index}`} fill={getBarColor(entry)} stroke={getBarColor(entry)} strokeOpacity={0.8} />
                    ))}
                    <LabelList 
                      dataKey="Sin PIAR" 
                      position="top" 
                      style={{ fontSize: '12px', fontWeight: 'bold' }} 
                      formatter={(value) => value ? `${value.toFixed(1)}%` : ''} 
                    />
                  </Bar>
                </>
              ) : (
                <Bar dataKey="Sin PIAR" strokeWidth={2}>
                  {chartDataPercentiles.filter(d => d.hasData).map((entry, index) => (
                    <Cell key={`cell-percentile-${index}`} fill={getBarColor(entry)} stroke={getBarColor(entry)} strokeOpacity={0.8} />
                  ))}
                  <LabelList 
                    dataKey="Sin PIAR" 
                    position="top" 
                    style={{ fontSize: '12px', fontWeight: 'bold' }} 
                    formatter={(value) => value ? `${value.toFixed(1)}%` : ''} 
                  />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
