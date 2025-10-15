/**
 * ✅ Sección HTML: Outliers
 */

import { generateSectionHeader } from '../htmlCore.js';
import { zScore } from '../../../utils/calculations/index.js';

export const generateOutliersSection = (analysis, sectionNumber) => {
  // Obtener outliers usando la misma lógica que el PDF
  const globalMetrics = analysis.getGlobalMetrics(false); // Sin PIAR
  const outliers = globalMetrics.outliers || [];
  
  // Calcular métricas para z-scores
  const dataSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
  const globals = dataSinPIAR.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
  const avg = globals.reduce((a, b) => a + b, 0) / globals.length;
  const variance = globals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (globals.length - 1);
  const sd = Math.sqrt(variance);
  
  return `
    ${generateSectionHeader('Valores atípicos (outliers)', sectionNumber, '⚠️')}
    
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-base font-bold text-blue-900 mb-2">¿Qué son los outliers?</h3>
          <div class="text-sm text-blue-800">
            <p class="mb-2">Los <strong>outliers</strong> son estudiantes con puntajes que se alejan significativamente del promedio del grupo (±3 desviaciones estándar).</p>
            <ul class="list-disc list-inside space-y-1">
              <li><strong>Outliers Superiores:</strong> Estudiantes con rendimiento excepcional, muy por encima del promedio. Pueden beneficiarse de programas de enriquecimiento académico.</li>
              <li><strong>Outliers Inferiores:</strong> Estudiantes con rendimiento significativamente bajo. Requieren apoyo adicional y seguimiento personalizado.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    ${outliers.length > 0 ? `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div class="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
          <h3 class="text-xl font-bold text-white">Estudiantes identificados como outliers</h3>
          <p class="text-red-100 text-sm mt-1">Total: ${outliers.length} estudiante${outliers.length > 1 ? 's' : ''}</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-700 to-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Apellido</th>
                <th class="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Grado</th>
                <th class="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">Global</th>
                <th class="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">Z-Score</th>
                <th class="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Tipo</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${outliers.map((student, index) => {
                const z = zScore(student.Global, avg, sd);
                const isLow = z < 0;
                const typeColor = isLow ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800';
                const typeText = isLow ? 'Inferior' : 'Superior';
                const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                
                return `
                  <tr class="${rowBg} hover:bg-yellow-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.Nombre}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.Apellido}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        ${student.Grupo}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${isLow ? 'text-blue-600' : 'text-red-600'}">
                      ${student.Global.toFixed(1)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-mono ${isLow ? 'text-blue-600' : 'text-red-600'}">
                      ${z.toFixed(2)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColor}">
                        ${typeText}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-base font-bold text-indigo-900 mb-2">💡 Recomendaciones pedagógicas</h3>
            <div class="text-sm text-indigo-800 space-y-2">
              <p><strong>Para Outliers Superiores:</strong> Considerar programas de enriquecimiento académico, tutorías entre pares, o participación en olimpiadas y competencias.</p>
              <p><strong>Para Outliers Inferiores:</strong> Implementar planes de apoyo personalizados, refuerzo académico, y seguimiento continuo para identificar necesidades específicas.</p>
            </div>
          </div>
        </div>
      </div>
    ` : `
      <div class="bg-green-50 border-l-4 border-green-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">No se detectaron outliers</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Todos los estudiantes se encuentran dentro del rango esperado (±3σ). Los datos muestran una distribución normal.</p>
            </div>
          </div>
        </div>
      </div>
    `}
  `;
};
