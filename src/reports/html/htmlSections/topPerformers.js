/**
 * ✅ Sección HTML: Top Performers (Rankings)
 */

import { generateSectionHeader } from '../htmlCore.js';
import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';
import { METRIC_LIMITS } from '../../../config/metricsConfig.js';

export const generateTopPerformersSection = (analysis, sectionNumber) => {
  // Obtener top performers por área
  const topByArea = ACADEMIC_AREAS.map(area => ({
    area: area.name,
    shortName: area.shortName,
    color: area.color,
    students: analysis.getTopByArea(area.columnName, METRIC_LIMITS.TOP_PERFORMERS_BY_AREA)
  }));
  
  // Obtener top performers por grado
  const topByGrade = analysis.getTopByGrade(METRIC_LIMITS.TOP_PERFORMERS_BY_GRADE);
  
  return `
    ${generateSectionHeader('Top Performers', sectionNumber, '🏆')}
    
    <!-- Top por Área Académica -->
    <div class="mb-8">
      <h3 class="text-xl font-bold text-gray-800 mb-4">🎯 Top ${METRIC_LIMITS.TOP_PERFORMERS_BY_AREA} por Área Académica</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${topByArea.map(areaData => `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden border-t-4" style="border-color: ${areaData.color}">
            <div class="p-4" style="background: linear-gradient(135deg, ${areaData.color}15 0%, ${areaData.color}05 100%)">
              <h4 class="text-lg font-bold text-gray-800 mb-3">${areaData.area}</h4>
              ${areaData.students.length > 0 ? `
                <div class="space-y-2">
                  ${areaData.students.map((student, index) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const medal = student.ranking <= 3 ? medals[student.ranking - 1] : `#${student.ranking}`;
                    return `
                      <div class="flex items-center justify-between p-2 bg-white rounded-lg hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-2">
                          <span class="text-2xl">${medal}</span>
                          <div>
                            <p class="font-semibold text-gray-800 text-sm">${student.nombre} ${student.apellido}</p>
                          </div>
                        </div>
                        <span class="text-lg font-bold" style="color: ${areaData.color}">${student.puntaje.toFixed(1)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <p class="text-gray-500 text-sm italic">No hay datos disponibles</p>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Top por Grado -->
    <div class="mb-8">
      <h3 class="text-xl font-bold text-gray-800 mb-4">📚 Top ${METRIC_LIMITS.TOP_PERFORMERS_BY_GRADE} por Grado</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${topByGrade.map(gradeData => `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500">
            <div class="p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Grado ${gradeData.grado}</h4>
              ${gradeData.top.length > 0 ? `
                <div class="space-y-2">
                  ${gradeData.top.map((student, index) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const medal = student.ranking <= 3 ? medals[student.ranking - 1] : `#${student.ranking}`;
                    return `
                      <div class="flex items-center justify-between p-2 bg-white rounded-lg hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-2">
                          <span class="text-2xl">${medal}</span>
                          <div>
                            <p class="font-semibold text-gray-800 text-sm">${student.nombre} ${student.apellido}</p>
                          </div>
                        </div>
                        <span class="text-lg font-bold text-indigo-600">${student.global.toFixed(1)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <p class="text-gray-500 text-sm italic">No hay datos disponibles</p>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};
