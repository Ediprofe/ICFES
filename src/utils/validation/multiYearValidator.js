/**
 * ✅ Validación para análisis multi-año
 * Verifica compatibilidad entre diferentes años
 */

import { METRIC_LIMITS } from '../../config/metricsConfig.js';

/**
 * Valida que no haya años duplicados
 */
export const validateNoDuplicateYear = (existingAnalyses, newYear) => {
  const existingYears = existingAnalyses.getAvailableYears();
  
  if (existingYears.includes(newYear)) {
    return {
      valid: false,
      errors: [`Ya existe un análisis para el año ${newYear}`],
      warnings: []
    };
  }
  
  return {
    valid: true,
    errors: [],
    warnings: []
  };
};

/**
 * Valida compatibilidad de columnas entre análisis
 */
export const validateColumnCompatibility = (baseAnalysis, newData) => {
  const errors = [];
  const warnings = [];
  
  if (!baseAnalysis) {
    return { valid: true, errors, warnings };
  }
  
  // Obtener grados de ambos análisis
  const baseGrades = new Set(baseAnalysis.metadata.grades);
  const newGrades = new Set([...new Set(newData.map(s => s.Grupo))]);
  
  // Verificar grados faltantes
  const missingGrades = [...baseGrades].filter(g => !newGrades.has(g));
  const extraGrades = [...newGrades].filter(g => !baseGrades.has(g));
  
  if (missingGrades.length > 0) {
    warnings.push(
      `El nuevo año no tiene datos para los grados: ${missingGrades.join(', ')}`
    );
  }
  
  if (extraGrades.length > 0) {
    warnings.push(
      `El nuevo año tiene grados adicionales: ${extraGrades.join(', ')}`
    );
  }
  
  // Verificar diferencias significativas en cantidad de estudiantes
  const baseTotal = baseAnalysis.metadata.totalStudents;
  const newTotal = newData.length;
  const difference = Math.abs(baseTotal - newTotal);
  const percentDiff = (difference / baseTotal) * 100;
  
  if (percentDiff > 30) {
    warnings.push(
      `Gran diferencia en cantidad de estudiantes: ` +
      `año base tiene ${baseTotal}, nuevo año tiene ${newTotal} (${percentDiff.toFixed(1)}% de diferencia)`
    );
  }
  
  return {
    valid: true, // Las diferencias son advertencias, no errores
    errors,
    warnings
  };
};

/**
 * Valida que el año esté en un rango válido
 */
export const validateYearRange = (year, existingAnalyses) => {
  const errors = [];
  const warnings = [];
  const currentYear = new Date().getFullYear();
  
  // Verificar que el año no sea muy antiguo o futuro
  if (year < 2000) {
    errors.push(`El año ${year} es demasiado antiguo (mínimo: 2000)`);
  }
  
  if (year > currentYear + 1) {
    errors.push(`El año ${year} es futuro (máximo: ${currentYear + 1})`);
  }
  
  // Verificar coherencia con años existentes
  const existingYears = existingAnalyses.getAvailableYears();
  if (existingYears.length > 0) {
    const minYear = Math.min(...existingYears);
    const maxYear = Math.max(...existingYears);
    
    // Advertir si hay un gap grande
    if (year < minYear && (minYear - year) > 5) {
      warnings.push(
        `Hay un gap de ${minYear - year} años entre este año y el más antiguo (${minYear})`
      );
    }
    
    if (year > maxYear && (year - maxYear) > 5) {
      warnings.push(
        `Hay un gap de ${year - maxYear} años entre este año y el más reciente (${maxYear})`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Valida que no se exceda el límite de años
 */
export const validateMaxYearsLimit = (existingAnalyses, maxYears = METRIC_LIMITS.MAX_COMPARISON_YEARS) => {
  const errors = [];
  const warnings = [];
  const currentCount = existingAnalyses.getAvailableYears().length;
  
  if (currentCount >= maxYears) {
    errors.push(
      `Se ha alcanzado el límite de ${maxYears} años. ` +
      `Elimina un año existente antes de agregar uno nuevo.`
    );
  } else if (currentCount === maxYears - 1) {
    warnings.push(
      `Después de agregar este año, alcanzarás el límite de ${maxYears} años`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validación completa para multi-año
 */
export const validateMultiYear = (existingAnalyses, newYear, newData, baseAnalysis = null) => {
  const validations = [
    validateNoDuplicateYear(existingAnalyses, newYear),
    validateYearRange(newYear, existingAnalyses),
    validateMaxYearsLimit(existingAnalyses),
    validateColumnCompatibility(baseAnalysis, newData)
  ];
  
  const allErrors = validations.flatMap(v => v.errors);
  const allWarnings = validations.flatMap(v => v.warnings);
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};
