import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateAreaMetrics } from '../utils/calculations';

export default function ChartsPanel({ data }) {
  const [showPIAR, setShowPIAR] = useState(true);
  
  // Calcular métricas con PIAR y sin PIAR
  const metricsConPIAR = calculateAreaMetrics(data, false);
  const metricsSinPIAR = calculateAreaMetrics(data, true);
  
  // Preparar datos para el gráfico comparativo
  const chartData = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    'Con PIAR': parseFloat(m.promedio),
    'Sin PIAR': parseFloat(metricsSinPIAR[index].promedio)
  }));
  
  const chartDataDesviacion = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    'Con PIAR': parseFloat(m.desviacion),
    'Sin PIAR': parseFloat(metricsSinPIAR[index].desviacion)
  }));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Toggle para mostrar/ocultar comparación */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Promedios por Área</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Comparar con/sin PIAR:</span>
          <button
            onClick={() => setShowPIAR(!showPIAR)}
            className={`px-4 py-2 rounded-lg transition-all ${
              showPIAR 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {showPIAR ? 'Comparación Activa' : 'Comparación Desactivada'}
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
              <Bar dataKey="Con PIAR" fill="#2563eb" />
              <Bar dataKey="Sin PIAR" fill="#10b981" />
            </>
          ) : (
            <Bar dataKey="Con PIAR" fill="#2563eb" />
          )}
        </BarChart>
      </ResponsiveContainer>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Desviación Estándar por Área</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartDataDesviacion}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="area" />
          <YAxis domain={[0, 30]} />
          <Tooltip />
          <Legend />
          {showPIAR ? (
            <>
              <Bar dataKey="Con PIAR" fill="#64748b" />
              <Bar dataKey="Sin PIAR" fill="#f59e0b" />
            </>
          ) : (
            <Bar dataKey="Con PIAR" fill="#64748b" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
