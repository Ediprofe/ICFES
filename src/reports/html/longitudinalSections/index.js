/**
 * Longitudinal HTML Export - Modular Structure Index
 * 
 * This index provides both the original working exporter and the new modular components.
 * 
 * USAGE:
 * - For production: Import from the original working file until full migration is complete
 * - For development/extension: Import from individual modules
 * 
 * MODULAR STRUCTURE:
 * ├── longitudinalCore.js      - Data preparation and HTML structure
 * ├── longitudinalStyles.js    - CSS styles
 * ├── longitudinalComponents.js - React components (Icons, SortableHeader, etc.)
 * ├── longitudinalCharts.js    - Chart configuration and dataset helpers
 * └── longitudinalGenerator.js  - Main orchestrator (in progress)
 * 
 * MIGRATION STATUS:
 * ✅ Core utilities extracted
 * ✅ Styles extracted
 * ✅ Components extracted
 * ✅ Chart config extracted
 * ⏳ Tab content modules (future improvement)
 * ⏳ Full generator migration (future improvement)
 */

// Re-export from original working file for backwards compatibility
export { generateLongitudinalHTML } from '../../utils/longitudinalHtmlExporter';

// Export modular components for future use/extension
export { prepareExportData, generateHtmlHead, generateHtmlFooter, generateDataScript } from './longitudinalCore';
export { generateStyles } from './longitudinalStyles';
export { generateComponents } from './longitudinalComponents';
export { generateChartConfig, generateDatasetHelpers } from './longitudinalCharts';
