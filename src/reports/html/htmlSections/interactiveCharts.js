/**
 * ✅ Sección HTML: Gráficos Interactivos
 */

import { generateSectionHeader, generateChartContainer, generateToggleButton } from '../htmlCore.js';

export const generateInteractiveChartsSection = (sectionNumber) => {
  return `
    ${generateSectionHeader('Gráficos estadísticos', sectionNumber, '📈')}
    
    <div class="mb-6 flex gap-4 no-print">
      ${generateToggleButton('togglePIAR', 'Ocultar Comparación PIAR', '🔄')}
      ${generateToggleButton('printBtn', 'Imprimir Informe', '🖨️')}
    </div>
    
    <!-- Gráficos por Área (uno debajo del otro) -->
    <div class="space-y-6 mb-8">
      ${generateChartContainer('chartAreaPromedios', 'Promedios por Área Académica')}
      ${generateChartContainer('chartAreaDesviacion', 'Desviación Estándar por Área')}
    </div>
    
    <!-- Gráficos por Grado (uno debajo del otro) -->
    <div class="space-y-6">
      ${generateChartContainer('chartGradePromedios', 'Promedios Globales por Grado')}
      ${generateChartContainer('chartGradeDesviacion', 'Desviación Estándar por Grado')}
    </div>
  `;
};
