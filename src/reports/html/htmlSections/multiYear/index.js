/**
 * Secciones de Comparación Multi-Año
 * 
 * Este módulo exporta todas las funciones de generación de secciones HTML
 * para informes comparativos multi-año.
 * 
 * @module htmlSections/multiYear
 */

// Re-exportar desde el archivo original (transición gradual)
export {
    generateCombinedMetricsSection,
    generateGaussianCurvesSection,
    generateGlobalComparisonSection,
    generateAreaComparisonSection,
    generateAllStudentsTableSection,
    generateTrendChartSection
} from '../multiYearComparison.js';

// Exportar configuraciones compartidas
export * from './chartConfig.js';
export * from './utils.js';
