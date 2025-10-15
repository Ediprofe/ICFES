/**
 * ✅ Preparación de datos para gráficos
 * Fuente única de verdad para HTML (Chart.js) y PDF (canvas)
 */

import { ACADEMIC_AREAS } from '../../config/columnConfig.js';
import { calculateAreaMetrics, getMetricsByGrade, getGradeAverages, findOutliers } from '../../utils/calculations/index.js';

/**
 * Prepara datos para gráficos por área
 * Retorna datos listos para renderizar en cualquier formato
 */
export const prepareAreaChartData = (analysis, includePIAR = true) => {
  const dataConPIAR = analysis.processedData;
  const dataSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
  
  // Encontrar outliers basados en muestra sin PIAR (±3σ)
  const outliers = findOutliers(analysis.processedData, true);
  const outlierIds = new Set(outliers.map(o => `${o.Nombre}_${o.Apellido}_${o.Grupo}`));
  
  // Datos sin PIAR y sin outliers
  const dataSinPIARSinOutliers = dataSinPIAR.filter(s => 
    !outlierIds.has(`${s.Nombre}_${s.Apellido}_${s.Grupo}`)
  );
  
  const metricsConPIAR = calculateAreaMetrics(dataConPIAR, false);
  const metricsSinPIAR = calculateAreaMetrics(dataSinPIAR, true);
  const metricsSinOutliers = calculateAreaMetrics(dataSinPIARSinOutliers, true);
  
  // Preparar datos de promedios
  const promedios = ACADEMIC_AREAS.map((area, index) => {
    const metricCon = metricsConPIAR[index];
    const metricSin = metricsSinPIAR[index];
    const metricSinOut = metricsSinOutliers[index];
    
    return {
      area: area.shortName,
      areaCompleta: area.name,
      areaId: area.id,
      conPIAR: parseFloat(metricCon.promedio) || 0,
      sinPIAR: parseFloat(metricSin.promedio) || 0,
      sinOutliers: parseFloat(metricSinOut.promedio) || 0,
      color: area.color,
      lightColor: area.lightColor,
      darkColor: area.darkColor
    };
  });
  
  // Preparar datos de desviación estándar
  const desviacion = ACADEMIC_AREAS.map((area, index) => {
    const metricCon = metricsConPIAR[index];
    const metricSin = metricsSinPIAR[index];
    const metricSinOut = metricsSinOutliers[index];
    
    return {
      area: area.shortName,
      areaCompleta: area.name,
      areaId: area.id,
      conPIAR: parseFloat(metricCon.desviacion) || 0,
      sinPIAR: parseFloat(metricSin.desviacion) || 0,
      sinOutliers: parseFloat(metricSinOut.desviacion) || 0,
      color: area.color,
      lightColor: area.lightColor,
      darkColor: area.darkColor
    };
  });
  
  // Preparar datos de percentiles
  const percentiles = ACADEMIC_AREAS.map((area, index) => {
    const metricCon = metricsConPIAR[index];
    const metricSin = metricsSinPIAR[index];
    
    const conPIARValue = metricCon.percentil !== 'N/A' ? parseFloat(metricCon.percentil) : null;
    const sinPIARValue = metricSin.percentil !== 'N/A' ? parseFloat(metricSin.percentil) : null;
    
    return {
      area: area.shortName,
      areaCompleta: area.name,
      areaId: area.id,
      conPIAR: conPIARValue,
      sinPIAR: sinPIARValue,
      hasData: conPIARValue !== null || sinPIARValue !== null,
      color: area.color,
      lightColor: area.lightColor,
      darkColor: area.darkColor
    };
  });
  
  return {
    promedios,
    desviacion,
    percentiles
  };
};

/**
 * Prepara datos para gráficos por grado
 */
export const prepareGradeChartData = (analysis, includePIAR = true) => {
  const gradeAverages = getGradeAverages(analysis.processedData);
  
  // Preparar datos de promedios
  const promedios = gradeAverages.map(grade => ({
    grado: grade.grado,
    conPIAR: grade.promedioConPIAR,
    sinPIAR: grade.promedioSinPIAR
  }));
  
  // Preparar datos de desviación
  const desviacion = gradeAverages.map(grade => ({
    grado: grade.grado,
    conPIAR: grade.desviacionConPIAR,
    sinPIAR: grade.desviacionSinPIAR
  }));
  
  return {
    promedios,
    desviacion
  };
};

/**
 * Prepara datos integrados de grado x área
 * Para gráficos que muestran todas las áreas por cada grado
 */
export const prepareIntegratedGradeAreaData = (analysis, excludePIAR = true) => {
  const data = excludePIAR 
    ? analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
    : analysis.processedData;
  
  const gradeMetrics = getMetricsByGrade(data);
  
  return gradeMetrics.map(gradeData => {
    const row = {
      grado: gradeData.grado,
      totalEstudiantes: gradeData.totalEstudiantes
    };
    
    // Agregar promedio de cada área
    const metrics = excludePIAR ? gradeData.metricsSinPIAR : gradeData.metricsConPIAR;
    
    ACADEMIC_AREAS.forEach((area, index) => {
      const metric = metrics[index];
      row[area.shortName] = metric.promedio !== 'N/A' ? parseFloat(metric.promedio) : 0;
    });
    
    return row;
  });
};

/**
 * Prepara datos para gráficos de comparación multi-año
 */
export const prepareComparisonChartData = (analyses, metricType = 'promedio') => {
  if (!analyses || analyses.length === 0) {
    return { areas: [], global: [] };
  }
  
  // Ordenar análisis por año
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Preparar datos por área
  const areas = ACADEMIC_AREAS.map(area => {
    const data = sortedAnalyses.map(analysis => {
      const areaMetrics = analysis.getAreaMetrics(true);
      const metric = areaMetrics.find(m => m.areaId === area.id);
      
      let value = 0;
      if (metric) {
        if (metricType === 'promedio') {
          value = metric.promedio !== 'N/A' ? parseFloat(metric.promedio) : 0;
        } else if (metricType === 'desviacion') {
          value = metric.desviacion !== 'N/A' ? parseFloat(metric.desviacion) : 0;
        }
      }
      
      return {
        year: analysis.year,
        value
      };
    });
    
    return {
      area: area.name,
      shortName: area.shortName,
      areaId: area.id,
      color: area.color,
      data
    };
  });
  
  // Preparar datos globales
  const global = sortedAnalyses.map(analysis => {
    const globalMetrics = analysis.getGlobalMetrics(true);
    
    let value = 0;
    if (metricType === 'promedio') {
      value = globalMetrics.promedio || 0;
    } else if (metricType === 'desviacion') {
      value = globalMetrics.desviacion || 0;
    }
    
    return {
      year: analysis.year,
      value
    };
  });
  
  return {
    areas,
    global
  };
};

/**
 * Prepara datos para gráfico de tendencias (con línea de regresión)
 */
export const prepareTrendChartData = (analyses, metricType = 'promedio') => {
  const comparisonData = prepareComparisonChartData(analyses, metricType);
  
  // Calcular tendencia para cada área
  const areasWithTrend = comparisonData.areas.map(area => {
    const data = area.data;
    
    if (data.length < 2) {
      return { ...area, trend: null };
    }
    
    // Regresión lineal simple
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.year, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d) => sum + (d.year * d.value), 0);
    const sumX2 = data.reduce((sum, d) => sum + (d.year * d.year), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generar puntos de la línea de tendencia
    const trendLine = data.map(d => ({
      year: d.year,
      value: slope * d.year + intercept
    }));
    
    return {
      ...area,
      trend: {
        slope,
        intercept,
        line: trendLine,
        direction: slope > 0.5 ? 'up' : slope < -0.5 ? 'down' : 'stable'
      }
    };
  });
  
  // Calcular tendencia global
  const globalData = comparisonData.global;
  let globalTrend = null;
  
  if (globalData.length >= 2) {
    const n = globalData.length;
    const sumX = globalData.reduce((sum, d) => sum + d.year, 0);
    const sumY = globalData.reduce((sum, d) => sum + d.value, 0);
    const sumXY = globalData.reduce((sum, d) => sum + (d.year * d.value), 0);
    const sumX2 = globalData.reduce((sum, d) => sum + (d.year * d.year), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const trendLine = globalData.map(d => ({
      year: d.year,
      value: slope * d.year + intercept
    }));
    
    globalTrend = {
      slope,
      intercept,
      line: trendLine,
      direction: slope > 0.5 ? 'up' : slope < -0.5 ? 'down' : 'stable'
    };
  }
  
  return {
    areas: areasWithTrend,
    global: globalData,
    globalTrend
  };
};

/**
 * Prepara datos para gráfico de distribución de puntajes
 */
export const prepareDistributionChartData = (analysis, excludePIAR = true) => {
  const data = excludePIAR 
    ? analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
    : analysis.processedData;
  
  const globals = data
    .map(s => s.Global)
    .filter(v => v !== null && v !== undefined && !isNaN(v));
  
  // Definir rangos
  const ranges = [
    { min: 0, max: 100, label: '0-100' },
    { min: 100, max: 200, label: '100-200' },
    { min: 200, max: 300, label: '200-300' },
    { min: 300, max: 400, label: '300-400' },
    { min: 400, max: 500, label: '400-500' }
  ];
  
  // Contar estudiantes en cada rango
  const distribution = ranges.map(range => {
    const count = globals.filter(v => v >= range.min && v < range.max).length;
    const percentage = globals.length > 0 ? (count / globals.length) * 100 : 0;
    
    return {
      ...range,
      count,
      percentage: parseFloat(percentage.toFixed(1))
    };
  });
  
  return distribution;
};
