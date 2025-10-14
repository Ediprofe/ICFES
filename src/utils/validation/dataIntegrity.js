/**
 * ✅ Validación de integridad de datos
 * Verifica consistencia, rangos, valores lógicos
 */

import { ACADEMIC_AREAS } from '../../config/columnConfig.js';

/**
 * Valida que el puntaje global sea consistente con la suma de áreas
 */
export const validateGlobalScoreConsistency = (data, tolerance = 5) => {
  const errors = [];
  const warnings = [];
  
  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    // Obtener puntajes de áreas
    const areaScores = ACADEMIC_AREAS.map(area => {
      const score = row[area.columnName];
      return (score !== null && score !== undefined && !isNaN(score)) ? Number(score) : 0;
    });
    
    const sumAreas = areaScores.reduce((a, b) => a + b, 0);
    const global = row['Global'];
    
    if (global !== null && global !== undefined && !isNaN(global)) {
      const difference = Math.abs(global - sumAreas);
      
      if (difference > tolerance) {
        warnings.push(
          `Fila ${rowNumber}: El puntaje Global (${global}) difiere de la suma de áreas (${sumAreas}) por ${difference.toFixed(2)} puntos`
        );
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Valida que no haya puntajes negativos
 */
export const validateNoNegativeScores = (data) => {
  const errors = [];
  
  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    // Verificar áreas
    ACADEMIC_AREAS.forEach(area => {
      const score = row[area.columnName];
      if (score !== null && score !== undefined && !isNaN(score) && Number(score) < 0) {
        errors.push(`Fila ${rowNumber}: ${area.columnName} no puede ser negativo (${score})`);
      }
    });
    
    // Verificar Global
    const global = row['Global'];
    if (global !== null && global !== undefined && !isNaN(global) && Number(global) < 0) {
      errors.push(`Fila ${rowNumber}: Global no puede ser negativo (${global})`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
};

/**
 * Valida que los percentiles estén entre 0 y 100
 */
export const validatePercentileRange = (data) => {
  const errors = [];
  const warnings = [];
  
  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    ACADEMIC_AREAS.forEach(area => {
      const percentile = row[area.percentileColumn];
      
      if (percentile !== null && percentile !== undefined && percentile !== '') {
        const percentileValue = Number(percentile);
        
        if (isNaN(percentileValue)) {
          warnings.push(`Fila ${rowNumber}: ${area.percentileColumn} no es un número válido`);
        } else if (percentileValue < 0 || percentileValue > 100) {
          errors.push(`Fila ${rowNumber}: ${area.percentileColumn} debe estar entre 0 y 100 (valor: ${percentileValue})`);
        }
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Valida que los valores de PIAR sean correctos
 */
export const validatePIARValues = (data) => {
  const errors = [];
  const warnings = [];
  
  const validValues = ['Sí', 'No', 'SI', 'NO', 'Si', 'si', 'no'];
  
  data.forEach((row, index) => {
    const rowNumber = index + 2;
    const piarValue = row['¿PIAR?'];
    
    if (piarValue === null || piarValue === undefined || piarValue === '') {
      errors.push(`Fila ${rowNumber}: ¿PIAR? es obligatorio`);
    } else {
      const strValue = String(piarValue).trim();
      
      if (!validValues.includes(strValue)) {
        errors.push(`Fila ${rowNumber}: ¿PIAR? debe ser "Sí" o "No" (valor actual: "${strValue}")`);
      } else if (strValue !== 'Sí' && strValue !== 'No') {
        warnings.push(`Fila ${rowNumber}: ¿PIAR? será normalizado a "Sí" o "No"`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Valida que no haya estudiantes duplicados
 */
export const validateNoDuplicateStudents = (data) => {
  const errors = [];
  const warnings = [];
  const seen = new Set();
  
  data.forEach((row, index) => {
    const rowNumber = index + 2;
    const key = `${row.Nombre}-${row.Apellido}-${row.Grupo}`.toLowerCase().trim();
    
    if (seen.has(key)) {
      warnings.push(
        `Fila ${rowNumber}: Posible estudiante duplicado: ${row.Nombre} ${row.Apellido} (${row.Grupo})`
      );
    } else {
      seen.add(key);
    }
  });
  
  return {
    valid: true, // Duplicados son advertencia, no error
    errors,
    warnings
  };
};

/**
 * Valida que todos los estudiantes tengan el mismo año (si la columna existe)
 * NOTA: La columna Año es OPCIONAL. Si no existe, se usará etiqueta manual.
 */
export const validateConsistentYear = (data) => {
  const errors = [];
  const warnings = [];
  const years = new Set();
  
  // Verificar si la columna Año existe en los datos
  const hasYearColumn = data.length > 0 && 'Año' in data[0];
  
  if (!hasYearColumn) {
    // La columna Año no existe - esto es válido, se usará etiqueta manual
    return {
      valid: true,
      errors: [],
      warnings: ['Columna "Año" no encontrada. Se usará etiqueta manual al cargar el archivo.'],
      year: null
    };
  }
  
  // Si la columna existe, validar consistencia
  data.forEach((row) => {
    const year = row['Año'];
    
    if (year !== null && year !== undefined && year !== '') {
      years.add(Number(year));
    }
  });
  
  if (years.size > 1) {
    errors.push(`Los datos contienen múltiples años: ${Array.from(years).join(', ')}. Todos los estudiantes deben ser del mismo año.`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    year: years.size === 1 ? Array.from(years)[0] : null
  };
};

/**
 * Validación completa de integridad de datos
 */
export const validateDataIntegrity = (data) => {
  const validations = [
    validateGlobalScoreConsistency(data),
    validateNoNegativeScores(data),
    validatePercentileRange(data),
    validatePIARValues(data),
    validateNoDuplicateStudents(data),
    validateConsistentYear(data)
  ];
  
  const allErrors = validations.flatMap(v => v.errors);
  const allWarnings = validations.flatMap(v => v.warnings);
  
  // Obtener el año si está disponible
  const yearValidation = validations[validations.length - 1];
  const year = yearValidation.year || null;
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    year
  };
};
