/**
 * ✅ Funciones para análisis comparativo multi-año
 * Tendencias, evolución, comparaciones temporales
 */

import { mean, stdDev } from './basic.js';
import { ACADEMIC_AREAS } from '../../config/columnConfig.js';

/**
 * Compara una métrica específica entre años
 */
export const compareYears = (analyses, metricName) => {
  return analyses
    .map(analysis => {
      const metrics = analysis.getGlobalMetrics(true);
      return {
        year: analysis.year,
        value: metrics[metricName] || 0
      };
    })
    .sort((a, b) => a.year - b.year);
};

/**
 * Calcula tendencia usando regresión lineal simple
 */
export const calculateTrend = (analyses, metricName) => {
  const data = compareYears(analyses, metricName);
  
  if (data.length < 2) {
    return { 
      direction: 'neutral', 
      slope: 0, 
      intercept: 0,
      data, 
      prediction: null 
    };
  }
  
  // Regresión lineal simple
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.year, 0);
  const sumY = data.reduce((sum, d) => sum + d.value, 0);
  const sumXY = data.reduce((sum, d) => sum + (d.year * d.value), 0);
  const sumX2 = data.reduce((sum, d) => sum + (d.year * d.year), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predicción para el próximo año
  const nextYear = Math.max(...data.map(d => d.year)) + 1;
  const prediction = slope * nextYear + intercept;
  
  return {
    direction: slope > 0.5 ? 'up' : slope < -0.5 ? 'down' : 'neutral',
    slope,
    intercept,
    data,
    prediction: {
      year: nextYear,
      value: prediction
    }
  };
};

/**
 * Obtiene cambio año sobre año
 */
export const getYearOverYearChange = (baseAnalysis, comparisonAnalyses, metricName) => {
  const allAnalyses = [baseAnalysis, ...comparisonAnalyses].sort((a, b) => a.year - b.year);
  const data = compareYears(allAnalyses, metricName);
  
  if (data.length < 2) return [];
  
  return data.slice(1).map((current, index) => {
    const previous = data[index];
    const change = current.value - previous.value;
    const changePercent = previous.value !== 0 
      ? (change / previous.value) * 100 
      : 0;
    
    return {
      year: current.year,
      value: current.value,
      change,
      changePercent,
      previousYear: previous.year,
      previousValue: previous.value
    };
  });
};

/**
 * Compara métricas por área entre años
 */
export const compareAreaMetricsAcrossYears = (analyses) => {
  const result = {};
  
  ACADEMIC_AREAS.forEach(area => {
    result[area.id] = {
      area: area.columnName,
      shortName: area.shortName,
      color: area.color,
      data: analyses.map(analysis => {
        const areaMetrics = analysis.getAreaMetrics(true);
        const metric = areaMetrics.find(m => m.areaId === area.id);
        
        return {
          year: analysis.year,
          promedio: metric ? parseFloat(metric.promedio) || 0 : 0,
          desviacion: metric ? parseFloat(metric.desviacion) || 0 : 0
        };
      }).sort((a, b) => a.year - b.year)
    };
  });
  
  return result;
};

/**
 * Compara métricas por grado entre años
 */
export const compareGradeMetricsAcrossYears = (analyses) => {
  // Obtener todos los grados únicos
  const allGrades = new Set();
  analyses.forEach(analysis => {
    analysis.metadata.grades.forEach(grade => allGrades.add(grade));
  });
  
  const result = {};
  
  allGrades.forEach(grade => {
    result[grade] = {
      grado: grade,
      data: analyses.map(analysis => {
        const gradeMetrics = analysis.getGradeMetrics(true);
        const metric = gradeMetrics.find(m => m.grado === grade);
        
        if (!metric) {
          return {
            year: analysis.year,
            promedio: 0,
            desviacion: 0,
            totalEstudiantes: 0
          };
        }
        
        // Calcular promedio global del grado
        const globals = analysis.processedData
          .filter(s => s.Grupo === grade)
          .map(s => s.Global)
          .filter(v => v !== null && v !== undefined && !isNaN(v));
        
        return {
          year: analysis.year,
          promedio: globals.length > 0 ? mean(globals) : 0,
          desviacion: globals.length > 0 ? stdDev(globals) : 0,
          totalEstudiantes: metric.totalEstudiantes
        };
      }).sort((a, b) => a.year - b.year)
    };
  });
  
  return result;
};

/**
 * Identifica mejores y peores evoluciones
 */
export const identifyBestAndWorstEvolution = (analyses, metric = 'promedio') => {
  const areaComparison = compareAreaMetricsAcrossYears(analyses);
  
  const evolutions = Object.entries(areaComparison).map(([areaId, areaData]) => {
    const data = areaData.data;
    if (data.length < 2) return null;
    
    const first = data[0][metric];
    const last = data[data.length - 1][metric];
    const change = last - first;
    const changePercent = first !== 0 ? (change / first) * 100 : 0;
    
    return {
      areaId,
      area: areaData.area,
      shortName: areaData.shortName,
      color: areaData.color,
      first,
      last,
      change,
      changePercent
    };
  }).filter(e => e !== null);
  
  // Ordenar por cambio porcentual
  const sorted = evolutions.sort((a, b) => b.changePercent - a.changePercent);
  
  return {
    best: sorted.slice(0, 3),
    worst: sorted.slice(-3).reverse()
  };
};
