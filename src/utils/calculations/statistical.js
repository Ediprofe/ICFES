/**
 * ✅ Funciones estadísticas avanzadas
 * Z-scores, outliers, percentiles
 */

import { mean, stdDev } from './basic.js';
import { METRIC_LIMITS } from '../../config/metricsConfig.js';

// Z-score
export const zScore = (value, avg, sd) => {
  return sd === 0 ? 0 : (value - avg) / sd;
};

// Outliers (±3σ) - Basado en muestra CON PIAR (todos los estudiantes)
export const findOutliers = (data, excludePIAR = false) => {
  // Siempre usar TODOS los estudiantes (CON PIAR) para calcular outliers
  const validStudents = data.filter(s => 
    s.Global !== null && 
    s.Global !== undefined && 
    !isNaN(s.Global)
  );
  
  const globals = validStudents.map(s => s.Global);
  const avg = mean(globals);
  const sd = stdDev(globals);
  
  const threshold = METRIC_LIMITS.OUTLIER_THRESHOLD_SIGMA;
  
  // Buscar outliers
  return validStudents.filter(student => {
    const z = Math.abs(zScore(student.Global, avg, sd));
    return z >= threshold;
  });
};

// Encontrar outliers por área académica específica
export const findOutliersByArea = (data, areaField) => {
  // Usar TODOS los estudiantes (CON PIAR) para calcular outliers
  const validStudents = data.filter(s => 
    s[areaField] !== null && 
    s[areaField] !== undefined && 
    !isNaN(s[areaField])
  );
  
  if (validStudents.length === 0) return [];
  
  const values = validStudents.map(s => s[areaField]);
  const avg = mean(values);
  const sd = stdDev(values);
  
  const threshold = METRIC_LIMITS.OUTLIER_THRESHOLD_SIGMA;
  
  // Buscar outliers
  return validStudents.filter(student => {
    const z = Math.abs(zScore(student[areaField], avg, sd));
    return z >= threshold;
  });
};

// Calcular percentil usando método Hazen
export const calculatePercentile = (value, sortedArray) => {
  if (!sortedArray || sortedArray.length === 0) return 0;
  
  const position = sortedArray.findIndex(v => v >= value);
  if (position === -1) return 100;
  if (position === 0) return 0;
  
  // Método Hazen: (i - 0.5) / n * 100
  const percentile = ((position - METRIC_LIMITS.HAZEN_CONSTANT) / sortedArray.length) * 100;
  return Math.max(0, Math.min(100, percentile));
};

// Calcular todos los percentiles para un campo
export const calculateAllPercentiles = (data, field) => {
  const values = data
    .map(s => s[field])
    .filter(v => v !== null && v !== undefined && !isNaN(v));
  
  const sorted = [...values].sort((a, b) => a - b);
  
  return data.map(student => {
    const value = student[field];
    if (value === null || value === undefined || isNaN(value)) {
      return { ...student, [`Percentil ${field}`]: null };
    }
    
    const percentile = calculatePercentile(value, sorted);
    return { ...student, [`Percentil ${field}`]: percentile };
  });
};

// Encontrar rendimiento excepcional (por encima de percentil dado)
export const findExceptionalPerformance = (data, threshold = 90) => {
  return data.filter(student => {
    const percentiles = [
      'Percentil Lectura crítica',
      'Percentil Matemáticas',
      'Percentil Sociales',
      'Percentil Naturales',
      'Percentil Inglés'
    ];
    
    const validPercentiles = percentiles
      .map(p => student[p])
      .filter(v => v !== null && v !== undefined && !isNaN(v));
    
    if (validPercentiles.length === 0) return false;
    
    const avgPercentile = mean(validPercentiles);
    return avgPercentile >= threshold;
  });
};

// Calcular distribución de valores en rangos
export const calculateDistribution = (values, ranges) => {
  const nums = values.filter(v => v !== null && v !== undefined && !isNaN(v));
  
  return ranges.map(range => {
    const count = nums.filter(v => v >= range.min && v < range.max).length;
    return {
      ...range,
      count,
      percentage: nums.length > 0 ? (count / nums.length) * 100 : 0
    };
  });
};
