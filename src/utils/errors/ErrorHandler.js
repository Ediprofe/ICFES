/**
 * ✅ Manejador centralizado de errores
 * Procesa, formatea y registra errores del sistema
 */

import {
  ValidationError,
  DataIntegrityError,
  ExportError,
  ParseError,
  MultiYearError,
  CalculationError,
  ConfigurationError
} from './customErrors.js';

/**
 * Clase estática para manejo de errores
 */
export class ErrorHandler {
  /**
   * Procesa un error y retorna información estructurada
   */
  static handle(error) {
    const errorInfo = {
      type: error.name || 'Error',
      message: error.message,
      details: error.details || {},
      severity: this.getSeverity(error),
      timestamp: new Date().toISOString(),
      stack: error.stack
    };
    
    // Registrar en consola (en producción, esto iría a un servicio como Sentry)
    this.log(errorInfo);
    
    return errorInfo;
  }
  
  /**
   * Determina la severidad del error
   */
  static getSeverity(error) {
    if (error instanceof ValidationError) return 'warning';
    if (error instanceof DataIntegrityError) return 'error';
    if (error instanceof ExportError) return 'error';
    if (error instanceof ParseError) return 'error';
    if (error instanceof MultiYearError) return 'warning';
    if (error instanceof CalculationError) return 'error';
    if (error instanceof ConfigurationError) return 'critical';
    
    return 'error';
  }
  
  /**
   * Formatea el error para mostrar al usuario
   */
  static formatForUser(error) {
    // Si el error tiene un mensaje de usuario personalizado, usarlo
    if (error.userMessage) {
      return error.userMessage;
    }
    
    // Mensajes genéricos según el tipo
    const messages = {
      'ValidationError': '❌ Los datos no cumplen con el formato requerido.',
      'DataIntegrityError': '❌ Se encontraron inconsistencias en los datos.',
      'ExportError': '❌ No se pudo generar el archivo de exportación.',
      'ParseError': '❌ No se pudo leer el archivo Excel.',
      'MultiYearError': '❌ No se puede agregar este año al análisis.',
      'CalculationError': '❌ Error al procesar los cálculos.',
      'ConfigurationError': '❌ Error de configuración del sistema.'
    };
    
    const baseMessage = messages[error.name] || '❌ Ocurrió un error inesperado.';
    let fullMessage = baseMessage;
    
    if (error.message) {
      fullMessage += `\n\nDetalles: ${error.message}`;
    }
    
    // Agregar sugerencias según el tipo de error
    const suggestions = this.getSuggestions(error);
    if (suggestions.length > 0) {
      fullMessage += '\n\n💡 Sugerencias:\n';
      suggestions.forEach(suggestion => {
        fullMessage += `  • ${suggestion}\n`;
      });
    }
    
    return fullMessage;
  }
  
  /**
   * Obtiene sugerencias para resolver el error
   */
  static getSuggestions(error) {
    const suggestions = [];
    
    if (error instanceof ValidationError) {
      suggestions.push('Verifica que el archivo Excel tenga todas las columnas requeridas');
      suggestions.push('Asegúrate de que los datos estén en el formato correcto');
      if (error.details.missingColumns && error.details.missingColumns.length > 0) {
        suggestions.push(`Agrega las columnas faltantes: ${error.details.missingColumns.join(', ')}`);
      }
    }
    
    if (error instanceof ParseError) {
      suggestions.push('Verifica que el archivo sea un Excel válido (.xlsx)');
      suggestions.push('Asegúrate de que la primera fila contenga los encabezados');
      suggestions.push('Revisa que no haya celdas combinadas en los encabezados');
    }
    
    if (error instanceof DataIntegrityError) {
      suggestions.push('Revisa los valores de las columnas numéricas');
      suggestions.push('Verifica que los puntajes estén en los rangos correctos');
      suggestions.push('Asegúrate de que no haya valores negativos');
    }
    
    if (error instanceof MultiYearError) {
      suggestions.push('Verifica que el año no esté duplicado');
      suggestions.push('Asegúrate de no exceder el límite de años');
    }
    
    if (error instanceof ExportError) {
      suggestions.push('Intenta exportar nuevamente');
      suggestions.push('Verifica que tengas espacio en disco');
      suggestions.push('Cierra otros archivos PDF/HTML que puedan estar abiertos');
    }
    
    return suggestions;
  }
  
  /**
   * Registra el error (consola o servicio externo)
   */
  static log(errorInfo) {
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      console.group(`🔴 ${errorInfo.type} [${errorInfo.severity}]`);
      console.error('Message:', errorInfo.message);
      if (Object.keys(errorInfo.details).length > 0) {
        console.error('Details:', errorInfo.details);
      }
      console.error('Timestamp:', errorInfo.timestamp);
      if (errorInfo.stack) {
        console.error('Stack:', errorInfo.stack);
      }
      console.groupEnd();
    } else {
      // En producción, enviar a servicio de logging (ej: Sentry)
      // Sentry.captureException(errorInfo);
      console.error(`[${errorInfo.severity}] ${errorInfo.type}: ${errorInfo.message}`);
    }
  }
  
  /**
   * Crea un error desde una respuesta de validación
   */
  static fromValidationResult(validationResult, errorType = 'ValidationError') {
    if (validationResult.valid) {
      return null;
    }
    
    const ErrorClass = {
      'ValidationError': ValidationError,
      'DataIntegrityError': DataIntegrityError,
      'ParseError': ParseError,
      'MultiYearError': MultiYearError
    }[errorType] || ValidationError;
    
    const message = validationResult.errors.length > 0
      ? validationResult.errors[0]
      : 'Error de validación';
    
    return new ErrorClass(message, {
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      ...validationResult.details
    });
  }
}
