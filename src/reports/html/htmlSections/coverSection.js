/**
 * ✅ Sección HTML: Portada
 */

import { generateMetricCard } from '../htmlCore.js';

export const generateCoverSection = (analysis, isMultiYear = false, comparisonYears = [], allAnalyses = []) => {
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
            Años: ${[analysis.year, ...comparisonYears].sort((a, b) => b - a).join(' • ')}
          </p>
        ` : ''}
      </div>
    </div>
    
    ${isMultiYear && allAnalyses.length > 0 ? `
      <!-- Resumen por año -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">📊 Resumen por Año</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${allAnalyses.sort((a, b) => b.year - a.year).map((yearAnalysis, index) => `
            <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 ${index % 2 === 0 ? 'border-blue-600' : 'border-indigo-600'}">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-3xl font-bold text-blue-600">${yearAnalysis.year}</h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  Año ${index + 1}
                </span>
              </div>
              
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <p class="text-xs text-gray-600 mb-1">Total</p>
                  <p class="text-2xl font-bold text-gray-800">${yearAnalysis.metadata.totalStudents}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-600 mb-1">Sin PIAR</p>
                  <p class="text-2xl font-bold text-green-600">${yearAnalysis.metadata.studentsWithoutPIAR}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-600 mb-1">Con PIAR</p>
                  <p class="text-2xl font-bold text-gray-500">${yearAnalysis.metadata.studentsWithPIAR}</p>
                </div>
              </div>
              
              <div class="pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-600">Grados</p>
                <p class="text-sm font-semibold text-gray-800">${yearAnalysis.metadata.grades.join(', ')}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : `
      <!-- Vista de un solo año -->
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
    `}
  `;
};
