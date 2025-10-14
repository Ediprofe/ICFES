/**
 * ✅ Errores personalizados para el sistema
 * Proporciona contexto específico para diferentes tipos de errores
 */

/**
 * Error de validación de datos
 */
export class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.userMessage = this.formatUserMessage(message, details);
  }
  
  formatUserMessage(message, details) {
    let userMsg = `❌ Error de Validación: ${message}`;
    
    if (details.errors && details.errors.length > 0) {
      userMsg += '\n\nErrores encontrados:\n';
      details.errors.slice(0, 5).forEach(err => {
        userMsg += `  • ${err}\n`;
      });
      
      if (details.errors.length > 5) {
        userMsg += `  ... y ${details.errors.length - 5} errores más`;
      }
    }
    
    if (details.warnings && details.warnings.length > 0) {
      userMsg += '\n\nAdvertencias:\n';
      details.warnings.slice(0, 3).forEach(warn => {
        userMsg += `  ⚠️ ${warn}\n`;
      });
    }
    
    return userMsg;
  }
}

/**
 * Error de integridad de datos
 */
export class DataIntegrityError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'DataIntegrityError';
    this.details = details;
    this.userMessage = `❌ Error de Integridad: ${message}\n\n` +
      `Los datos contienen inconsistencias que deben corregirse antes de continuar.`;
  }
}

/**
 * Error de exportación (PDF/HTML)
 */
export class ExportError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ExportError';
    this.details = details;
    this.userMessage = `❌ Error al Exportar: ${message}\n\n` +
      `No se pudo generar el archivo. Por favor, intenta nuevamente.`;
  }
}

/**
 * Error de parseo de Excel
 */
export class ParseError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ParseError';
    this.details = details;
    this.userMessage = this.formatUserMessage(message, details);
  }
  
  formatUserMessage(message, details) {
    let userMsg = `❌ Error al Leer Archivo: ${message}\n\n`;
    
    if (details.missingColumns && details.missingColumns.length > 0) {
      userMsg += `Columnas faltantes:\n`;
      details.missingColumns.forEach(col => {
        userMsg += `  • ${col}\n`;
      });
      userMsg += '\n';
    }
    
    userMsg += 'Verifica que el archivo Excel tenga el formato correcto.';
    
    return userMsg;
  }
}

/**
 * Error de análisis multi-año
 */
export class MultiYearError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'MultiYearError';
    this.details = details;
    this.userMessage = `❌ Error Multi-Año: ${message}\n\n` +
      `No se puede agregar este año al análisis comparativo.`;
  }
}

/**
 * Error de cálculo
 */
export class CalculationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'CalculationError';
    this.details = details;
    this.userMessage = `❌ Error de Cálculo: ${message}\n\n` +
      `Ocurrió un error al procesar los datos. Verifica que los valores sean correctos.`;
  }
}

/**
 * Error de configuración
 */
export class ConfigurationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ConfigurationError';
    this.details = details;
    this.userMessage = `❌ Error de Configuración: ${message}\n\n` +
      `Hay un problema con la configuración del sistema.`;
  }
}
