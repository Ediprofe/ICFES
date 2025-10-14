/**
 * ✅ Sección HTML: Gráficos Interactivos
 */

import { generateSectionHeader, generateChartContainer, generateToggleButton } from '../htmlCore.js';

export const generateInteractiveChartsSection = (sectionNumber) => {
  return `
    ${generateSectionHeader('Gráficos Estadísticos', sectionNumber, '📈')}
    
    <div class="mb-6 flex gap-4 no-print">
      ${generateToggleButton('togglePIAR', 'Ocultar Comparación PIAR', '🔄')}
      ${generateToggleButton('printBtn', 'Imprimir Informe', '🖨️')}
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${generateChartContainer('chartAreaPromedios', 'Promedios por Área Académica')}
      ${generateChartContainer('chartAreaDesviacion', 'Desviación Estándar por Área')}
    </div>
    
    <div class="mt-6">
      ${generateChartContainer('chartGradePromedios', 'Promedios Globales por Grado')}
    </div>
  `;
};
