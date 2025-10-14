/**
 * ✅ Sección: Gráficos (por área y por grado)
 */

import { drawSectionHeader, checkAndAddPage, getPageDimensions } from '../pdfCore.js';
import { drawBarChart } from '../pdfHelpers.js';
import { prepareAreaChartData, prepareGradeChartData } from '../../../charts/chartDataPreparation.js';

export const generateCharts = (doc, analysis, sectionNumber) => {
  const { width } = getPageDimensions(doc);
  const chartWidth = width - 40;
  const chartHeight = 70;
  
  let y = 20;
  
  // Encabezado de sección
  y = drawSectionHeader(doc, 'Gráficos Estadísticos', sectionNumber, y);
  y += 5;
  
  // Obtener datos preparados
  const areaData = prepareAreaChartData(analysis, true);
  const gradeData = prepareGradeChartData(analysis, true);
  
  // Gráfico 1: Promedios por Área
  y = checkAndAddPage(doc, y, chartHeight + 20);
  
  const areaPromediosData = areaData.promedios.map(item => ({
    area: item.area,
    conPIAR: item.conPIAR,
    sinPIAR: item.sinPIAR
  }));
  
  y = drawBarChart(
    doc,
    areaPromediosData,
    20,
    y,
    chartWidth,
    chartHeight,
    'Promedios por Área Académica',
    {
      maxValue: 100,
      showComparison: true,
      useDynamicScale: false,
      showLabels: true
    }
  );
  
  // Gráfico 2: Desviación Estándar por Área
  y = checkAndAddPage(doc, y, chartHeight + 20);
  
  const areaDesviacionData = areaData.desviacion.map(item => ({
    area: item.area,
    conPIAR: item.conPIAR,
    sinPIAR: item.sinPIAR
  }));
  
  y = drawBarChart(
    doc,
    areaDesviacionData,
    20,
    y,
    chartWidth,
    chartHeight,
    'Desviación Estándar por Área',
    {
      maxValue: 30,
      showComparison: true,
      useDynamicScale: true,
      showLabels: true
    }
  );
  
  // Gráfico 3: Promedios por Grado
  y = checkAndAddPage(doc, y, chartHeight + 20);
  
  const gradePromediosData = gradeData.promedios.map(item => ({
    area: item.grado,
    conPIAR: item.conPIAR,
    sinPIAR: item.sinPIAR
  }));
  
  y = drawBarChart(
    doc,
    gradePromediosData,
    20,
    y,
    chartWidth,
    chartHeight,
    'Promedios Globales por Grado',
    {
      maxValue: 500,
      showComparison: true,
      useDynamicScale: true,
      showLabels: true
    }
  );
  
  return y;
};
