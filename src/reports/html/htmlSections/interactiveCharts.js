/**
 * ✅ Sección HTML: Gráficos Interactivos
 */

import { generateSectionHeader, generateChartContainer, generateToggleButton } from '../htmlCore.js';

export const generateInteractiveChartsSection = (sectionNumber) => {
  return `
    ${generateSectionHeader('Gráficos por área y grado', sectionNumber, '📈')}
    
    <div class="mb-6 flex gap-4 no-print">
      ${generateToggleButton('togglePIAR', 'Ocultar comparación PIAR', '🔄')}
      ${generateToggleButton('printBtn', 'Imprimir Informe', '🖨️')}
    </div>
    
    <!-- Gráficos por Área (uno debajo del otro) -->
    <div class="space-y-6 mb-8">
      ${generateChartContainer('chartAreaPromedios', 'Promedios por área académica')}
      ${generateChartContainer('chartAreaDesviacion', 'Desviación estándar por área')}
    </div>
    
    <!-- Gráficos por Grado (uno debajo del otro) -->
    <div class="space-y-6">
      ${generateChartContainer('chartGradePromedios', 'Promedios globales por grado')}
      ${generateChartContainer('chartGradeDesviacion', 'Desviación estándar por grado')}
    </div>
    
    <!-- Gráficos por Grado y Asignatura -->
    <div class="space-y-6 mt-8">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Promedios por grado en cada asignatura</h3>
      ${generateChartContainer('chartGradeSubjectPromediosLECTURA', 'Promedio de lectura crítica')}
      ${generateChartContainer('chartGradeSubjectPromediosMATEMATICAS', 'Promedio de matemáticas')}
      ${generateChartContainer('chartGradeSubjectPromediosSOCIALES', 'Promedio de sociales')}
      ${generateChartContainer('chartGradeSubjectPromediosNATURALES', 'Promedio de naturales')}
      ${generateChartContainer('chartGradeSubjectPromediosINGLES', 'Promedio de inglés')}
    </div>
    
    <div class="space-y-6 mt-8">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Desviación estándar por grado en cada asignatura</h3>
      ${generateChartContainer('chartGradeSubjectDesviacionLECTURA', 'Desviación estándar de lectura crítica')}
      ${generateChartContainer('chartGradeSubjectDesviacionMATEMATICAS', 'Desviación estándar de matemáticas')}
      ${generateChartContainer('chartGradeSubjectDesviacionSOCIALES', 'Desviación estándar de sociales')}
      ${generateChartContainer('chartGradeSubjectDesviacionNATURALES', 'Desviación estándar de naturales')}
      ${generateChartContainer('chartGradeSubjectDesviacionINGLES', 'Desviación estándar de inglés')}
    </div>
  `;
};
