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
    ${generateSectionHeader('Top performers', sectionNumber, '🏆')}
    
    <!-- Top por área académica -->
    <div class="mb-8">
      <h3 class="text-xl font-bold text-gray-800 mb-4">🎯 Top ${METRIC_LIMITS.TOP_PERFORMERS_BY_AREA} por área académica</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${topByArea.map(areaData => `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden border-t-4" style="border-color: ${areaData.color}">
            <div class="p-4" style="background: linear-gradient(135deg, ${areaData.color}15 0%, ${areaData.color}05 100%)">
              <h4 class="text-lg font-bold text-gray-800 mb-3">${areaData.area}</h4>
              ${areaData.students.length > 0 ? `
                <div class="space-y-2">
                  ${areaData.students.map((student) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const rankNum = student.ranking || 0;
                    const isTopThree = rankNum <= 3 && rankNum > 0;
                    const medal = isTopThree ? medals[rankNum - 1] : '';
                    
                    return `
                      <div class="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-lg transition-all border border-gray-100 ${!isTopThree ? 'hover:border-gray-300' : ''}">
                        <div class="flex items-center gap-3">
                          ${isTopThree ? `
                            <span class="text-3xl">${medal}</span>
                          ` : `
                            <div class="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white text-sm" style="background: linear-gradient(135deg, ${areaData.color} 0%, ${areaData.color}CC 100%)">
                              #${rankNum}
                            </div>
                          `}
                          <div>
                            <p class="font-bold text-gray-900 text-sm">${student.nombre} ${student.apellido}</p>
                            ${!isTopThree ? `<p class="text-xs text-gray-500">Puesto ${rankNum}</p>` : ''}
                          </div>
                        </div>
                        <div class="text-right">
                          <span class="text-xl font-bold" style="color: ${areaData.color}">${student.puntaje.toFixed(1)}</span>
                          ${!isTopThree ? `<p class="text-xs text-gray-500">puntos</p>` : ''}
                        </div>
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
    
    <!-- Top por grado -->
    <div class="mb-8">
      <h3 class="text-xl font-bold text-gray-800 mb-4">📚 Top ${METRIC_LIMITS.TOP_PERFORMERS_BY_GRADE} por grado</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${topByGrade.map(gradeData => `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500">
            <div class="p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Grado ${gradeData.grado}</h4>
              ${gradeData.top.length > 0 ? `
                <div class="space-y-2">
                  ${gradeData.top.map((student) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const rankNum = student.ranking || 0;
                    const isTopThree = rankNum <= 3 && rankNum > 0;
                    const medal = isTopThree ? medals[rankNum - 1] : '';
                    
                    return `
                      <div class="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-lg transition-all border border-gray-100 ${!isTopThree ? 'hover:border-indigo-300' : ''}">
                        <div class="flex items-center gap-3">
                          ${isTopThree ? `
                            <span class="text-3xl">${medal}</span>
                          ` : `
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white text-sm shadow-md">
                              #${rankNum}
                            </div>
                          `}
                          <div>
                            <p class="font-bold text-gray-900 text-sm">${student.nombre} ${student.apellido}</p>
                            ${!isTopThree ? `<p class="text-xs text-gray-500">Puesto ${rankNum}</p>` : ''}
                          </div>
                        </div>
                        <div class="text-right">
                          <span class="text-xl font-bold text-indigo-600">${student.global.toFixed(1)}</span>
                          ${!isTopThree ? `<p class="text-xs text-gray-500">puntos</p>` : ''}
                        </div>
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
