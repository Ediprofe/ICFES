/**
 * ✅ Parser de archivos Excel con validación completa
 * Usa el sistema de validación centralizado
 */

import * as XLSX from 'xlsx';
import { validateExcelComplete } from './validation/schemaValidator.js';
import { validateDataIntegrity } from './validation/dataIntegrity.js';
import { ParseError } from './errors/customErrors.js';
import { ErrorHandler } from './errors/ErrorHandler.js';
import { ACADEMIC_AREAS } from '../config/columnConfig.js';

/**
 * Parsea un archivo Excel y retorna datos validados
 * @param {File} file - Archivo Excel a parsear
 * @param {number|string} yearLabel - Etiqueta de año opcional (si el archivo no tiene columna Año)
 */
export const parseExcel = (file, yearLabel = null) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Leer archivo Excel
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        if (!rawData || rawData.length === 0) {
          throw new ParseError('El archivo está vacío o no contiene datos');
        }
        
        // Validar estructura
        const structureValidation = validateExcelComplete(rawData);
        
        if (!structureValidation.valid) {
          const error = ErrorHandler.fromValidationResult(structureValidation, 'ParseError');
          throw error;
        }
        
        // Limpiar y normalizar datos
        const cleanedData = cleanData(rawData);
        
        // Validar integridad de datos
        const integrityValidation = validateDataIntegrity(cleanedData);
        
        if (!integrityValidation.valid) {
          const error = ErrorHandler.fromValidationResult(integrityValidation, 'DataIntegrityError');
          throw error;
        }
        
        // Extraer cohorte: prioridad a yearLabel, luego integrityValidation, luego año actual
        let year;
        if (yearLabel !== null) {
          // Permitir strings o números
          year = yearLabel;
          // Si es un string numérico, intentar convertir a número para compatibilidad
          const numericYear = parseInt(yearLabel);
          if (!isNaN(numericYear) && numericYear.toString() === yearLabel.toString()) {
            year = numericYear;
          }
        } else {
          year = integrityValidation.year || new Date().getFullYear();
        }
        
        // Filtrar filas completamente vacías
        const validData = cleanedData.filter(row => 
          row.Nombre && row.Apellido && row.Grupo
        );
        
        if (validData.length === 0) {
          throw new ParseError('No se encontraron datos válidos en el archivo');
        }
        
        // Retornar datos con información adicional
        resolve({
          year,
          data: validData,
          warnings: [
            ...structureValidation.warnings,
            ...integrityValidation.warnings
          ],
          metadata: {
            totalRows: validData.length,
            fileName: file.name,
            fileSize: file.size,
            parsedAt: new Date().toISOString()
          }
        });
        
      } catch (error) {
        // Si no es un error personalizado, convertirlo
        if (!(error instanceof ParseError)) {
          reject(new ParseError(error.message || 'Error al leer el archivo', { originalError: error }));
        } else {
          reject(error);
        }
      }
    };
    
    reader.onerror = () => {
      reject(new ParseError('Error al leer el archivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Limpia y normaliza los datos
 */
function cleanData(rawData) {
  return rawData.map(row => {
    const cleanRow = { ...row };
    
    // Limpiar áreas académicas
    ACADEMIC_AREAS.forEach(area => {
      const value = row[area.columnName];
      if (value === undefined || value === null || value === '' || isNaN(Number(value))) {
        cleanRow[area.columnName] = null;
      } else {
        cleanRow[area.columnName] = Number(value);
      }
      
      // Limpiar percentiles si existen
      const percentileValue = row[area.percentileColumn];
      if (percentileValue !== undefined && percentileValue !== null && percentileValue !== '') {
        cleanRow[area.percentileColumn] = Number(percentileValue);
      }
    });
    
    // Limpiar Global
    const globalValue = row['Global'];
    if (globalValue === undefined || globalValue === null || globalValue === '' || isNaN(Number(globalValue))) {
      cleanRow['Global'] = null;
    } else {
      cleanRow['Global'] = Number(globalValue);
    }
    
    // Limpiar Año
    const yearValue = row['Año'];
    if (yearValue !== undefined && yearValue !== null && yearValue !== '') {
      cleanRow['Año'] = Number(yearValue);
    }
    
    // Asegurar que campos de texto sean strings
    cleanRow['Nombre'] = String(row['Nombre'] || '').trim();
    cleanRow['Apellido'] = String(row['Apellido'] || '').trim();
    cleanRow['Grupo'] = String(row['Grupo'] || '').trim();
    
    // Normalizar PIAR
    const piarValue = String(row['¿PIAR?'] || '').trim();
    if (['SI', 'Si', 'si', 'Sí'].includes(piarValue)) {
      cleanRow['¿PIAR?'] = 'Sí';
    } else if (['NO', 'No', 'no'].includes(piarValue)) {
      cleanRow['¿PIAR?'] = 'No';
    } else {
      cleanRow['¿PIAR?'] = piarValue;
    }
    
    return cleanRow;
  });
}

/**
 * Obtiene información básica del archivo sin parsearlo completamente
 */
export const getExcelInfo = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Obtener rango de celdas
        const range = XLSX.utils.decode_range(sheet['!ref']);
        const rowCount = range.e.r - range.s.r; // Excluye header
        
        // Leer solo la primera fila para obtener columnas
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
        
        resolve({
          fileName: file.name,
          fileSize: file.size,
          sheetName,
          rowCount,
          columns: headers,
          estimatedStudents: rowCount
        });
      } catch (error) {
        reject(new ParseError('Error al obtener información del archivo', { originalError: error }));
      }
    };
    
    reader.onerror = () => {
      reject(new ParseError('Error al leer el archivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
