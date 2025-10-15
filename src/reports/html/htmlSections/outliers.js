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
    ${generateSectionHeader('Valores Atípicos (Outliers)', sectionNumber, '⚠️')}
    
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">¿Qué son los Outliers?</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>Los outliers son valores que se desvían significativamente del resto de los datos (±3σ). Pueden indicar casos excepcionales que requieren atención especial.</p>
          </div>
        </div>
      </div>
    </div>
    
    ${outliers.length > 0 ? `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div class="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
          <h3 class="text-xl font-bold text-white">Estudiantes Identificados como Outliers</h3>
          <p class="text-red-100 text-sm mt-1">Total: ${outliers.length} estudiante${outliers.length > 1 ? 's' : ''}</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Global</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Z-Score</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
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
      
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Recomendación</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>Estos estudiantes requieren atención especial. Los outliers bajos pueden necesitar apoyo adicional, mientras que los altos pueden beneficiarse de programas de enriquecimiento.</p>
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
