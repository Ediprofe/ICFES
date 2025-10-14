/**
 * ✅ Sección HTML: Portada
 */

import { generateMetricCard } from '../htmlCore.js';

export const generateCoverSection = (analysis, isMultiYear = false, comparisonYears = []) => {
  const metrics = analysis.getGlobalMetrics(true);
  
  return `
    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg shadow-2xl p-12 mb-8">
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-4">Análisis ICFES</h1>
        <p class="text-2xl mb-2">
          ${isMultiYear ? 'Análisis Comparativo Multi-Año' : `Año ${analysis.year}`}
        </p>
        ${isMultiYear ? `
          <p class="text-lg opacity-90">
            Años: ${[analysis.year, ...comparisonYears].sort((a, b) => b - a).join(', ')}
          </p>
        ` : ''}
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      ${generateMetricCard('Total Estudiantes', analysis.metadata.totalStudents, '👥', 'blue')}
      ${generateMetricCard('Con PIAR', analysis.metadata.studentsWithPIAR, '📋', 'orange')}
      ${generateMetricCard('Sin PIAR', analysis.metadata.studentsWithoutPIAR, '✓', 'green')}
      ${generateMetricCard('Promedio Global', metrics.promedio.toFixed(2), '📊', 'purple')}
    </div>
    
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-xl font-bold mb-4 text-gray-800">Información del Análisis</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">Grados analizados</p>
          <p class="text-lg font-semibold text-gray-800">${analysis.metadata.grades.join(', ')}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Desviación Estándar</p>
          <p class="text-lg font-semibold text-gray-800">${metrics.desviacion.toFixed(2)}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Valores Atípicos</p>
          <p class="text-lg font-semibold text-gray-800">${metrics.outliers.length}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Fecha de Carga</p>
          <p class="text-lg font-semibold text-gray-800">
            ${new Date(analysis.metadata.loadedAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  `;
};
