/**
 * ✅ Validación de estructura de datos del Excel
 * Verifica columnas, tipos de datos, valores requeridos
 */

import { REQUIRED_COLUMNS, OPTIONAL_COLUMNS, getAllColumnNames } from '../../config/columnConfig.js';

/**
 * Valida la estructura del Excel (columnas)
 */
export const validateExcelStructure = (data) => {
  if (!data || data.length === 0) {
    return {
      valid: false,
      errors: ['El archivo está vacío o no contiene datos'],
      warnings: [],
      fileColumns: [],
      missingColumns: [],
      extraColumns: []
    };
  }

  const firstRow = data[0];
  const fileColumns = Object.keys(firstRow);
  const requiredColumnNames = REQUIRED_COLUMNS.map(c => c.name);
  
  // Verificar columnas faltantes
  const missingColumns = requiredColumnNames.filter(col => !fileColumns.includes(col));
  
  // Verificar columnas extra (no es error, solo advertencia)
  const allValidColumns = getAllColumnNames();
  const extraColumns = fileColumns.filter(col => !allValidColumns.includes(col));
  
  const errors = [];
  const warnings = [];
  
  if (missingColumns.length > 0) {
    errors.push(`Faltan columnas obligatorias: ${missingColumns.join(', ')}`);
  }
  
  if (extraColumns.length > 0) {
    warnings.push(`Columnas no reconocidas (serán ignoradas): ${extraColumns.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fileColumns,
    missingColumns,
    extraColumns
  };
};

/**
 * Valida los datos de cada fila
 */
export const validateRowData = (data) => {
  const errors = [];
  const warnings = [];
  
  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 porque Excel empieza en 1 y tiene header
    
    // Validar columnas requeridas
    REQUIRED_COLUMNS.forEach(column => {
      const value = row[column.name];
      
      // Verificar si el valor existe
      if (value === null || value === undefined || value === '') {
        errors.push(`Fila ${rowNumber}: ${column.name} es obligatorio`);
        return;
      }
      
      // Validar tipo de dato
      if (column.type === 'number') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push(`Fila ${rowNumber}: ${column.name} debe ser un número`);
          return;
        }
        
        // Aplicar validación personalizada si existe
        if (column.validation && !column.validation(numValue)) {
          errors.push(`Fila ${rowNumber}: ${column.errorMessage || 'Valor inválido en ' + column.name}`);
        }
      } else if (column.type === 'text') {
        const strValue = String(value).trim();
        if (column.validation && !column.validation(strValue)) {
          errors.push(`Fila ${rowNumber}: ${column.errorMessage || 'Valor inválido en ' + column.name}`);
        }
      } else if (column.type === 'year') {
        const yearValue = Number(value);
        if (isNaN(yearValue)) {
          errors.push(`Fila ${rowNumber}: ${column.name} debe ser un año válido`);
        } else if (column.validation && !column.validation(yearValue)) {
          errors.push(`Fila ${rowNumber}: ${column.errorMessage || 'Año inválido'}`);
        }
      }
    });
    
    // Validar columnas opcionales (solo advertencias)
    OPTIONAL_COLUMNS.forEach(column => {
      const value = row[column.name];
      
      if (value !== null && value !== undefined && value !== '') {
        if (column.type === 'number') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            warnings.push(`Fila ${rowNumber}: ${column.name} debe ser un número (valor ignorado)`);
          } else if (column.validation && !column.validation(numValue)) {
            warnings.push(`Fila ${rowNumber}: ${column.name} tiene un valor fuera de rango (valor ignorado)`);
          }
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
 * Validación completa del Excel
 */
export const validateExcelComplete = (data) => {
  // Validar estructura
  const structureValidation = validateExcelStructure(data);
  
  if (!structureValidation.valid) {
    return {
      valid: false,
      errors: structureValidation.errors,
      warnings: structureValidation.warnings,
      details: {
        structure: structureValidation
      }
    };
  }
  
  // Validar datos de filas
  const rowValidation = validateRowData(data);
  
  return {
    valid: rowValidation.valid,
    errors: [...structureValidation.errors, ...rowValidation.errors],
    warnings: [...structureValidation.warnings, ...rowValidation.warnings],
    details: {
      structure: structureValidation,
      rows: rowValidation
    }
  };
};
