📋 INSTRUCCIONES CONSOLIDADAS FINALES PARA WINDSURF
DOCUMENTO ESTRATÉGICO DE REFACTORIZACIÓN - ICFES ANALYZER
Versión: 2.0
Fecha: 14 de Octubre de 2025
Objetivo: Refactorización completa para sistema modular, escalable y preparado para análisis multi-año

🎯 RESUMEN EJECUTIVO
Problemas Críticos Actuales:

❌ Monolitos gigantes (pdfBuilder.js: 800+ líneas, calculations.js: 400+ líneas)
❌ Duplicación masiva (código repetido 5+ veces en múltiples archivos)
❌ No escalable (imposible agregar análisis multi-año sin reescritura total)
❌ Estado monolítico (todo en App.jsx, prop drilling extremo)
❌ Tres sistemas separados (Web, PDF, HTML con lógicas diferentes)
❌ Sin tests (imposible refactorizar con confianza)

Solución:

✅ Configuración centralizada (un solo lugar para columnas, colores, métricas)
✅ Estado con Zustand (manejo profesional de múltiples años)
✅ Modelos de datos (Analysis y MultiYearAnalysis)
✅ Informes unificados (HTML y PDF comparten secciones y lógica)
✅ Validaciones robustas (sistema completo de validación)
✅ Código modular (archivos pequeños, responsabilidades claras)


📊 ESTRUCTURA DE CARPETAS FINAL
src/
├── config/                          ← NUEVA: Configuración centralizada
│   ├── columnConfig.js             (Columnas, áreas, validaciones)
│   ├── metricsConfig.js            (Métricas, límites, constantes)
│   ├── reportSections.js           (Secciones de informes)
│   └── visualConfig.js             (Colores, estilos, tamaños)
│
├── stores/                          ← NUEVA: Estado global con Zustand
│   └── analysisStore.js            (MultiYearAnalysis, actions, selectors)
│
├── models/                          ← NUEVA: Modelos de datos
│   ├── Analysis.js                 (Clase para un año)
│   └── MultiYearAnalysis.js        (Gestión multi-año)
│
├── utils/
│   ├── calculations/               ← DIVIDIDO EN MÓDULOS
│   │   ├── basic.js               (mean, stdDev, median, etc.)
│   │   ├── statistical.js         (zScore, outliers, percentiles)
│   │   ├── metrics.js             (métricas globales, por área, por grado)
│   │   ├── comparative.js         (comparativas multi-año) ← NUEVO
│   │   └── index.js               (exporta todo)
│   │
│   ├── validation/                 ← NUEVA: Sistema de validación
│   │   ├── schemaValidator.js     (estructura del Excel)
│   │   ├── dataIntegrity.js       (consistencia de datos)
│   │   └── multiYearValidator.js  (compatibilidad entre años)
│   │
│   ├── errors/                     ← NUEVA: Manejo de errores
│   │   ├── customErrors.js        (ValidationError, ParseError, etc.)
│   │   └── ErrorHandler.js        (manejo centralizado)
│   │
│   ├── excelParser.js              (refactorizado con validaciones)
│   └── percentiles.js              (sin cambios)
│
├── reports/                         ← NUEVA: Sistema de informes
│   ├── charts/
│   │   ├── chartDataPreparation.js (datos para gráficos - compartido)
│   │   └── chartRenderers/
│   │       ├── chartjs.js          (para HTML)
│   │       └── pdfCanvas.js        (para PDF)
│   │
│   ├── pdf/
│   │   ├── pdfCore.js              (funciones base de jsPDF)
│   │   ├── pdfHelpers.js           (drawTable, drawBarChart, etc.)
│   │   ├── pdfSections/            ← CADA SECCIÓN EN SU ARCHIVO
│   │   │   ├── coverPage.js
│   │   │   ├── studentsList.js
│   │   │   ├── areaMetrics.js
│   │   │   ├── gradeMetrics.js
│   │   │   ├── topPerformers.js
│   │   │   ├── outliers.js
│   │   │   ├── charts.js
│   │   │   └── comparison.js       ← NUEVO
│   │   └── PDFReportGenerator.js   (orquestador < 200 líneas)
│   │
│   ├── html/
│   │   ├── htmlCore.js             (estructura base)
│   │   ├── htmlInteractivity.js    (JavaScript para interactividad)
│   │   ├── htmlSections/           ← CADA SECCIÓN EN SU ARCHIVO
│   │   │   ├── coverSection.js
│   │   │   ├── studentsList.js
│   │   │   ├── areaMetrics.js
│   │   │   ├── gradeMetrics.js
│   │   │   ├── topPerformers.js
│   │   │   ├── outliers.js
│   │   │   ├── interactiveCharts.js
│   │   │   └── comparison.js       ← NUEVO
│   │   └── HTMLReportGenerator.js  (orquestador)
│   │
│   └── ReportGenerator.js          ← OPCIONAL: Clase abstracta base
│
├── components/
│   ├── ErrorBoundary.jsx           ← NUEVO
│   ├── FileUploader.jsx            (simplificado)
│   ├── DataPreview.jsx             ← NUEVO (tabla simple de preview)
│   ├── YearSelector.jsx            ← NUEVO (dropdown de años)
│   ├── ComparisonYearSelector.jsx  ← NUEVO (multi-select años)
│   ├── ExportButtons.jsx           ← NUEVO (botones HTML y PDF)
│   └── LoadingSpinner.jsx          ← NUEVO
│
├── App.jsx                          (refactorizado - usa Zustand)
└── main.jsx                         (envuelve con ErrorBoundary)

tests/                               ← NUEVA: Testing
├── unit/
│   ├── calculations/
│   ├── models/
│   └── validation/
└── integration/

🚀 PLAN DE IMPLEMENTACIÓN - 7 SPRINTS
SPRINT 1: FUNDAMENTOS (Semana 1-2) ⭐ CRÍTICO
Tareas:
1.1 Crear estructura de carpetas completa

Crear todas las carpetas listadas arriba
No mover código todavía, solo preparar estructura

1.2 Implementar archivos de configuración (/src/config/)
columnConfig.js:
javascript// DEBE CONTENER:
- COLUMN_TYPES (enum de tipos)
- REQUIRED_COLUMNS (array con {name, type, validation, errorMessage})
- OPTIONAL_COLUMNS (array similar)
- ACADEMIC_AREAS (array con {id, name, shortName, columnName, percentileColumn, color, lightColor, darkColor, icon})
- Helper functions: getAreaByColumnName(), getAreaById(), getAllColumnNames(), getRequiredColumnNames()
metricsConfig.js:
javascript// DEBE CONTENER:
- METRIC_TYPES (enum de tipos de métricas)
- GLOBAL_METRICS (array con configuración de métricas globales)
- AREA_METRICS (array con configuración por área)
- GRADE_METRICS (array con configuración por grado)
- COMPARISON_METRICS (array para comparativas multi-año) ← NUEVO
- METRIC_LIMITS (objeto con constantes: TOP_PERFORMERS_BY_AREA: 5, TOP_PERFORMERS_BY_GRADE: 3, OUTLIER_THRESHOLD_SIGMA: 3, HAZEN_CONSTANT: 0.5, MAX_COMPARISON_YEARS: 5)
- METRIC_DISPLAY (configuración de formato)
reportSections.js:
javascript// DEBE CONTENER:
- REPORT_SECTION_IDS (enum de IDs de secciones)
- REPORT_SECTIONS (array con {id, name, order, required, availableIn: ['html', 'pdf'], showInSingleYear, showInMultiYear, icon})
- Helper functions: getSectionById(), getSectionsForFormat(), getRequiredSections()

// Secciones: cover, yearSelector, globalMetrics, studentsList, areaMetrics, gradeMetrics, areaCharts, gradeCharts, topByArea, topByGrade, outliers, comparison
visualConfig.js:
javascript// DEBE CONTENER:
- COLORS (objeto con primary, secondary, accent, success, warning, error, info, gray[50-900], withPIAR, withoutPIAR)
- CHART_CONFIG (tamaños, fuentes, animaciones, leyendas, grid para HTML y PDF)
- TABLE_CONFIG (estilos header/body, columnWidths, maxRowsPerPage)
- LAYOUT_CONFIG (márgenes, espaciado, grid)
- BRANDING (name, url, social, colors)
- Helper functions: getColorForArea(), getChartConfig()
1.3 Instalar Zustand
bashnpm install zustand immer
1.4 Crear modelos de datos (/src/models/)
Analysis.js:
javascript// CLASE CON:
- constructor(year, rawData)
- Propiedades: year, rawData, processedData, metadata, filters, _calculationCache (Map)
- Métodos:
  * processRawData() - limpia datos
  * generateMetadata() - crea metadata
  * getFilteredData() - aplica filtros con cache
  * updateFilters(newFilters) - actualiza y limpia cache
  * getGlobalMetrics(withPIAR) - con cache
  * getAreaMetrics(withPIAR) - con cache
  * getGradeMetrics(withPIAR) - con cache
  * clearCache()
  * toJSON() - serializa
  * static fromJSON(json) - deserializa
MultiYearAnalysis.js:
javascript// CLASE CON:
- constructor()
- Propiedades: analyses (Map), baseYear, comparisonYears (array)
- Métodos:
  * addAnalysis(year, data) - agrega análisis, retorna Analysis
  * removeAnalysis(year)
  * getBaseAnalysis()
  * getAnalysis(year)
  * getComparisonAnalyses()
  * getAvailableYears() - ordenados descendente
  * setBaseYear(year)
  * addComparisonYear(year)
  * removeComparisonYear(year)
  * toggleComparisonYear(year)
  * getComparativeMetrics(metricName, includeBase)
  * getTrend(metricName)
  * getYearOverYearChange(metricName)
  * validateCompatibility()
  * toJSON()
  * static fromJSON(json)
1.5 Implementar Zustand store (/src/stores/analysisStore.js)
javascript// STORE CON:
- Estado:
  * multiYearAnalysis: MultiYearAnalysis
  * comparisonMode: boolean
  * loading: boolean
  * error: null | string

- Selectors:
  * getActiveAnalysis()
  * getAvailableYears()
  * getBaseYear()
  * getComparisonYears()
  * getComparisonAnalyses()
  * hasData()
  * isYearLoaded(year)

- Actions:
  * loadBaseYear(file) - async
  * loadComparisonYear(file) - async
  * enableComparisonMode()
  * disableComparisonMode()
  * setBaseYear(year)
  * toggleYearInComparison(year)
  * updateFilters(year, filters)
  * removeYear(year)
  * clearError()
  * reset()

- Middleware:
  * persist: guarda en localStorage
  * devtools: para debugging
  * immer: mutaciones inmutables
1.6 Dividir calculations.js en módulos
Mover funciones existentes a nuevos archivos:
/src/utils/calculations/basic.js:

mean() - filtrar nulls/NaN
stdDev() - usar n-1 (muestral)
median()
mode()
min()
max()
sum()
count()

/src/utils/calculations/statistical.js:

zScore(value, avg, sd)
findOutliers(data, excludePIAR) - usar METRIC_LIMITS.OUTLIER_THRESHOLD_SIGMA
calculatePercentile(value, sortedArray) - método Hazen con METRIC_LIMITS.HAZEN_CONSTANT
calculateAllPercentiles(data, field)
findExceptionalPerformance(data, threshold)
calculateDistribution(values, ranges)

/src/utils/calculations/metrics.js:

calculateGlobalMetrics(data, excludePIAR)
calculateAreaMetrics(data, excludePIAR) - usar ACADEMIC_AREAS de config
calculateGradeMetrics(data, excludePIAR) - usar ACADEMIC_AREAS de config
getTopByArea(data, area, n, excludePIAR) - n de METRIC_LIMITS
getTopByGrade(data, grade, n, excludePIAR) - n de METRIC_LIMITS
getAllTopByGrade(data, n, excludePIAR)

/src/utils/calculations/comparative.js ← NUEVO:
javascript// FUNCIONES PARA MULTI-AÑO:
- compareYears(analyses, metricName) - retorna array con {year, value}
- calculateTrend(analyses, metricName) - regresión lineal simple, retorna {direction, slope, data, prediction}
- getYearOverYearChange(baseAnalysis, comparisonAnalyses, metricName) - retorna array con {year, value, change, changePercent, previousYear, previousValue}
- compareAreaMetricsAcrossYears(analyses) - retorna objeto con series por área
- compareGradeMetricsAcrossYears(analyses) - retorna objeto con series por grado
- identifyBestAndWorstEvolution(analyses, metric) - retorna {best: [], worst: []}
/src/utils/calculations/index.js:
javascript// Exportar todo de forma organizada
export * from './basic';
export * from './statistical';
export * from './metrics';
export * from './comparative';
1.7 Tests básicos

Crear tests unitarios para basic.js (al menos mean, stdDev)
Usar Vitest (ya compatible con Vite)
Esto te dará confianza para refactorizar


SPRINT 2: VALIDACIÓN Y ROBUSTEZ (Semana 3) ⭐ CRÍTICO
Tareas:
2.1 Implementar sistema de validación (/src/utils/validation/)
schemaValidator.js:
javascript// FUNCIONES:
- validateExcelStructure(data) - verifica columnas contra columnConfig, retorna {valid, errors, warnings, fileColumns, missingColumns, extraColumns}
- validateRowData(data) - valida cada fila contra REQUIRED_COLUMNS y OPTIONAL_COLUMNS, usa validation functions de columnConfig
- validateExcelComplete(data) - combina las dos anteriores
dataIntegrity.js:
javascript// FUNCIONES:
- validateGlobalScoreConsistency(data, tolerance=5) - verifica que Global ≈ suma de áreas
- validateNoNegativeScores(data) - verifica que no haya negativos
- validatePercentileRange(data) - verifica que percentiles estén entre 0-100
- validatePIARValues(data) - verifica que PIAR sea 'Sí' o 'No'
- validateDataIntegrity(data) - combina todas
multiYearValidator.js:
javascript// FUNCIONES:
- validateNoDuplicateYear(existingAnalyses, newYear)
- validateColumnCompatibility(baseAnalysis, newData) - retorna warnings si estructuras difieren
- validateYearRange(year, existingAnalyses) - verifica que año esté entre 2000 y año actual +1
- validateMaxYearsLimit(existingAnalyses, maxYears=5) - usa METRIC_LIMITS.MAX_COMPARISON_YEARS
- validateMultiYear(existingAnalyses, newYear, newData, baseAnalysis) - combina todas
2.2 Crear sistema de errores (/src/utils/errors/)
customErrors.js:
javascript// CLASES:
- ValidationError extends Error
- DataIntegrityError extends Error
- ExportError extends Error
- ParseError extends Error
- MultiYearError extends Error

// Todas con: constructor(message, details = {}), propiedad userMessage
ErrorHandler.js:
javascript// CLASE ESTÁTICA CON:
- handle(error) - retorna objeto {type, message, details, severity, timestamp, stack}
- formatForUser(error) - retorna string formateado para mostrar
- log(error) - registra error (integrar con Sentry en futuro)
2.3 Crear ErrorBoundary (/src/components/ErrorBoundary.jsx)
javascript// COMPONENTE DE CLASE:
- componentDidCatch() - captura errores
- render() - muestra UI elegante con:
  * Icono de error
  * Mensaje del error
  * Sugerencias de solución
  * Botón "Intentar de nuevo"
  * Botón "Ir al inicio"
  * Detalles técnicos en modo dev
2.4 Refactorizar excelParser.js
javascript// ACTUALIZAR PARA:
- Usar validateExcelComplete() del schemaValidator
- Usar validateDataIntegrity() del dataIntegrity
- Extraer año automáticamente de columna "Año"
- Validar que todas las filas tengan el mismo año
- Lanzar ParseError en caso de error
- Retornar {year, data, warnings}
- Agregar función getExcelInfo(file) para preview sin parsear todo

SPRINT 3: PREPARACIÓN DE DATOS PARA GRÁFICOS (Semana 4) ⭐ ALTO IMPACTO
Tareas:
3.1 Crear módulo de preparación de datos (/src/reports/charts/chartDataPreparation.js)
javascript// FUNCIONES QUE PREPARAN DATOS DESDE Analysis HACIA FORMATO PARA GRÁFICOS:

prepareAreaChartData(analysis, includePIAR = true)
// Retorna: {
//   promedios: [{area, areaCompleta, conPIAR, sinPIAR, color}],
//   desviacion: [{area, areaCompleta, conPIAR, sinPIAR, color}],
//   percentiles: [{area, areaCompleta, conPIAR, sinPIAR, color, hasData}]
// }

prepareGradeChartData(analysis, includePIAR = true)
// Retorna: {
//   promedios: [{grado, conPIAR, sinPIAR}],
//   desviacion: [{grado, conPIAR, sinPIAR}]
// }

prepareIntegratedGradeAreaData(analysis, excludePIAR = true)
// Retorna: [{grado, Lectura, Matemáticas, Sociales, Naturales, Inglés}]
// Para gráfico integrado con todas las áreas por grado

prepareComparisonChartData(analyses, metricType = 'promedio')
// Retorna: {
//   areas: [{area, shortName, color, data: [{year, value}]}],
//   global: [{year, value}]
// }
// Para gráficos de líneas temporales multi-año
IMPORTANTE: Estas funciones son usadas tanto por HTML (Chart.js) como por PDF (canvas manual). Son la "fuente única de verdad" para datos de gráficos.

SPRINT 4: REFACTORIZAR PDF (Semana 5-6) ⭐ CRÍTICO - ALTA COMPLEJIDAD
Objetivo: Dividir pdfBuilder.js (800+ líneas) en módulos pequeños (<200 líneas cada uno)
4.1 Crear funciones core (/src/reports/pdf/pdfCore.js)
javascript// FUNCIONES BÁSICAS DE jsPDF:
- initPDF() - retorna nueva instancia de jsPDF
- getPageDimensions(doc) - retorna {width, height}
- addNewPage(doc)
- drawSectionHeader(doc, title, sectionNumber) - rectángulo azul con título
- drawFooter(doc, pageNumber, additionalInfo)
- checkAndAddPage(doc, currentY, requiredSpace) - agrega página si no cabe, retorna nueva Y
- drawWrappedText(doc, text, x, y, maxWidth) - texto con word wrap
4.2 Crear helpers de dibujo (/src/reports/pdf/pdfHelpers.js)
javascript// FUNCIONES HELPER:
- drawTable(doc, columns, rows, startY, options) - usa autoTable
- drawBarChart(doc, data, x, y, width, height, title, maxValue, showComparison) - dibuja barras con canvas primitives
- drawLineChart(doc, series, x, y, width, height, title) - para tendencias multi-año
- drawMetricCard(doc, title, value, x, y, width, color) - card de métrica
- hexToRgb(hex) - helper interno
4.3 Crear secciones individuales (/src/reports/pdf/pdfSections/)
Cada archivo debe tener UNA función que genera UNA sección:
coverPage.js:
javascriptgenerateCoverPage(doc, analysis, isMultiYear, comparisonYears)
// Genera portada con título, año, información general, branding
studentsList.js:
javascriptgenerateStudentsList(doc, analysis, sectionNumber, excludePIAR)
// Lista completa de estudiantes ordenada por Global usando drawTable()
areaMetrics.js:
javascriptgenerateAreaMetrics(doc, analysis, sectionNumber)
// Tabla comparativa con métricas por área (con/sin PIAR) usando drawTable()
gradeMetrics.js:
javascriptgenerateGradeMetrics(doc, analysis, sectionNumber)
// Tabla por cada grado con métricas por área usando drawTable()
topPerformers.js:
javascriptgenerateTopPerformers(doc, analysis, sectionNumber)
// Top 5 por área y Top 3 por grado usando drawTable()
outliers.js:
javascriptgenerateOutliers(doc, analysis, sectionNumber)
// Valores atípicos con z-scores usando drawTable()
charts.js:
javascriptgenerateCharts(doc, analysis, sectionNumber)
// Gráficos por área y por grado usando drawBarChart()
// Usa prepareAreaChartData() y prepareGradeChartData()
comparison.js ← NUEVO:
javascriptgenerateComparison(doc, baseAnalysis, comparisonAnalyses, sectionNumber)
// Sección de comparativas multi-año
// Tablas con evolución de métricas
// Gráficos de líneas con tendencias usando drawLineChart()
// Usa prepareComparisonChartData()
4.4 Crear orquestador (/src/reports/pdf/PDFReportGenerator.js)
javascript// FUNCIÓN PRINCIPAL (< 200 líneas):
export const generatePDF = (analysis, options = {}) => {
  const {
    isMultiYear = false,
    comparisonAnalyses = [],
    excludePIAR = true
  } = options;
  
  const doc = initPDF();
  let sectionNumber = 1;
  
  // 1. Portada
  generateCoverPage(doc, analysis, isMultiYear, comparisonAnalyses.map(a => a.year));
  
  // 2. Listado
  generateStudentsList(doc, analysis, sectionNumber++, excludePIAR);
  
  // 3. Métricas globales
  // ... (llamar a cada generate function en orden)
  
  // 4-11. Resto de secciones según REPORT_SECTIONS de config
  
  // 12. Comparación (solo si isMultiYear)
  if (isMultiYear && comparisonAnalyses.length > 0) {
    generateComparison(doc, analysis, comparisonAnalyses, sectionNumber++);
  }
  
  // Guardar
  const fileName = `informe-icfes-${analysis.year}${isMultiYear ? '-comparativo' : ''}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

SPRINT 5: IMPLEMENTAR HTML EXPORT (Semana 7) ⭐ ALTO IMPACTO
Objetivo: Crear sistema de HTML export modular similar al PDF
5.1 Crear core HTML (/src/reports/html/htmlCore.js)
javascript// FUNCIÓN QUE GENERA ESTRUCTURA HTML BASE:
export const generateHTMLTemplate = (title, year, isMultiYear) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Estilos personalizados */
  </style>
</head>
<body class="bg-gray-50">
  <div id="app" class="max-w-7xl mx-auto p-6">
    <!-- CONTENIDO SE INYECTA AQUÍ -->
  </div>
  
  <script>
    // DATOS EMBEBIDOS COMO JSON
    const analysisData = {DATA_PLACEHOLDER};
    const comparisonData = {COMPARISON_PLACEHOLDER};
    
    // FUNCIONES DE INTERACTIVIDAD
    {INTERACTIVITY_SCRIPT}
  </script>
</body>
</html>
  `;
};
5.2 Crear interactividad (/src/reports/html/htmlInteractivity.js)
javascript// GENERA CÓDIGO JAVASCRIPT PARA EL HTML:
export const generateInteractivityScript = () => {
  return `
    // Estado global
    let showPIAR = true;
    let charts = {};
    
    // Función para toggle PIAR
    function togglePIARComparison() {
      showPIAR = !showPIAR;
      updateAllCharts();
    }
    
    // Función para inicializar gráficos
    function initCharts() {
      // Crear gráficos de Chart.js
    }
    
    // Función para actualizar gráficos
    function updateAllCharts() {
      // Destruir y recrear gráficos
    }
    
    // Inicializar al cargar
    window.addEventListener('DOMContentLoaded', initCharts);
  `;
};
5.3 Crear secciones HTML (/src/reports/html/htmlSections/)
Cada archivo genera HTML string para una sección (usar template literals):
coverSection.js:
javascriptexport const generateCoverSection = (analysis, isMultiYear, comparisonYears) => {
  return `
    <section class="bg-white rounded-lg shadow-lg p-8 mb-6">
      <h1 class="text-4xl font-bold text-blue-600">Análisis ICFES ${analysis.year}</h1>
      <!-- resto del contenido -->
    </section>
  `;
};
studentsList.js:
javascriptexport const generateStudentsListSection = (data, excludePIAR) => {
  const students = excludePIAR ? data.filter(s => s['¿PIAR?'] !== 'Sí') : data;
  const sorted = [...students].sort((a, b) => b.Global - a.Global);
  
  return `
    <section class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-4">Listado de Estudiantes</h2>
      <table class="w-full">
        <!-- tabla con datos -->
      </table>
    </section>
  `;
};
interactiveCharts.js:
javascriptexport const generateInteractiveChartsSection = (chartData) => {
  return `
    <section class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Gráficos por Área</h2>
        <button 
          onclick="togglePIARComparison()" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Toggle Comparación PIAR
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <canvas id="chartPromedios"></canvas>
        </div>
        <div>
          <canvas id="chartDesviacion"></canvas>
        </div>
      </div>
    </section>
  `;
};
comparison.js ← NUEVO:
javascriptexport const generateComparisonSection = (baseAnalysis, comparisonAnalyses, comparisonData) => {
  return `
    <section class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-4">Análisis Comparativo Multi-Año</h2>
      
      <!-- Tabla de evolución -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-3">Evolución del Promedio Global</h3>
        <table class="w-full border-collapse">
          <!-- Tabla con años y valores -->
        </table>
      </div>
      
      <!-- Gráfico de líneas temporal -->
      <div class="mb-6">
        <canvas id="chartTemporal"></canvas>
      </div>
      
      <!-- Mejores y peores evoluciones -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-green-600">📈 Mejores Evoluciones</h3>
          <!-- Lista -->
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-3 text-red-600">📉 Áreas de Atención</h3>
          <!-- Lista -->
        </div>
      </div>
    </section>
  `;
};

Y así para cada sección...5.4 Crear orquestador HTML (/src/reports/html/HTMLReportGenerator.js)
export const generateHTML = (analysis, options = {}) => {
  const {
    isMultiYear = false,
    comparisonAnalyses = [],
    excludePIAR = true
  } = options;
  
  // 1. Generar template base
  let html = generateHTMLTemplate(
    `Análisis ICFES ${analysis.year}`,
    analysis.year,
    isMultiYear
  );
  
  // 2. Preparar datos para gráficos
  const areaChartData = prepareAreaChartData(analysis, true);
  const gradeChartData = prepareGradeChartData(analysis, true);
  
  let comparisonChartData = null;
  if (isMultiYear) {
    comparisonChartData = prepareComparisonChartData(
      [analysis, ...comparisonAnalyses],
      'promedio'
    );
  }
  
  // 3. Generar contenido de secciones
  const sections = [
    generateCoverSection(analysis, isMultiYear, comparisonAnalyses.map(a => a.year)),
    generateStudentsListSection(analysis.processedData, excludePIAR),
    generateAreaMetricsSection(analysis),
    generateGradeMetricsSection(analysis),
    generateInteractiveChartsSection(areaChartData),
    generateTopPerformersSection(analysis),
    generateOutliersSection(analysis)
  ];
  
  if (isMultiYear) {
    sections.push(
      generateComparisonSection(analysis, comparisonAnalyses, comparisonChartData)
    );
  }
  
  const content = sections.join('\n');
  
  // 4. Inyectar datos y contenido en template
  html = html.replace('<!-- CONTENIDO SE INYECTA AQUÍ -->', content);
  html = html.replace('{DATA_PLACEHOLDER}', JSON.stringify({
    areaChartData,
    gradeChartData,
    comparisonChartData
  }));
  html = html.replace('{INTERACTIVITY_SCRIPT}', generateInteractivityScript());
  
  // 5. Descargar
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analisis-icfes-${analysis.year}${isMultiYear ? '-comparativo' : ''}-${new Date().toISOString().split('T')[0]}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

SPRINT 6: COMPONENTES UI REFACTORIZADOS (Semana 8) ⭐ MEDIO IMPACTOObjetivo: Simplificar UI y conectar con Zustand6.1 Refactorizar App.jsx
import { useAnalysisStore, useHasData, useComparisonMode } from './stores/analysisStore';
import { ErrorBoundary } from './components/ErrorBoundary';
// ... otros imports

function App() {
  const hasData = useHasData();
  const comparisonMode = useComparisonMode();
  const loading = useAnalysisStore(state => state.loading);
  const error = useAnalysisStore(state => state.error);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con branding */}
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Análisis ICFES</h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Desarrollado por</p>
            <a href="https://ediprofe.com" className="text-lg font-bold text-blue-600">
              ediprofe.com
            </a>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6">
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {!hasData && !loading && <FileUploader />}
        
        {hasData && !loading && (
          <>
            <YearSelector />
            <DataPreview />
            
            {comparisonMode && <ComparisonYearSelector />}
            
            <ExportButtons />
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        {/* ... */}
      </footer>
    </div>
  );
}

// Envolver con ErrorBoundary en main.jsx
export default App;

6.2 Crear FileUploader.jsx (simplificado)
import { useAnalysisStore } from '../stores/analysisStore';

export const FileUploader = () => {
  const loadBaseYear = useAnalysisStore(state => state.loadBaseYear);
  const enableComparisonMode = useAnalysisStore(state => state.enableComparisonMode);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  
  const handleFileUpload = async (file) => {
    const result = await loadBaseYear(file);
    
    if (result.success) {
      // Preguntar si quiere cargar más años
      setShowComparisonDialog(true);
    }
  };
  
  return (
    <div>
      {/* Zona de carga con drag & drop */}
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
        <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
      </div>
      
      {/* Dialog: ¿Cargar más años? */}
      {showComparisonDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">¿Análisis Comparativo?</h3>
            <p className="mb-6">
              ¿Deseas cargar datos de años anteriores para realizar un análisis comparativo?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  enableComparisonMode();
                  setShowComparisonDialog(false);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sí, cargar más años
              </button>
              <button
                onClick={() => setShowComparisonDialog(false)}
                className="flex-1 bg-gray-200 px-4 py-2 rounded"
              >
                No, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { useAnalysisStore } from '../stores/analysisStore';

export const FileUploader = () => {
  const loadBaseYear = useAnalysisStore(state => state.loadBaseYear);
  const enableComparisonMode = useAnalysisStore(state => state.enableComparisonMode);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  
  const handleFileUpload = async (file) => {
    const result = await loadBaseYear(file);
    
    if (result.success) {
      // Preguntar si quiere cargar más años
      setShowComparisonDialog(true);
    }
  };
  
  return (
    <div>
      {/* Zona de carga con drag & drop */}
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
        <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
      </div>
      
      {/* Dialog: ¿Cargar más años? */}
      {showComparisonDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">¿Análisis Comparativo?</h3>
            <p className="mb-6">
              ¿Deseas cargar datos de años anteriores para realizar un análisis comparativo?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  enableComparisonMode();
                  setShowComparisonDialog(false);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sí, cargar más años
              </button>
              <button
                onClick={() => setShowComparisonDialog(false)}
                className="flex-1 bg-gray-200 px-4 py-2 rounded"
              >
                No, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

6.3 Crear DataPreview.jsx
import { useAnalysisStore, useAvailableYears } from '../stores/analysisStore';

export const YearSelector = () => {
  const availableYears = useAvailableYears();
  const baseYear = useAnalysisStore(state => state.getBaseYear());
  const setBaseYear = useAnalysisStore(state => state.setBaseYear);
  const comparisonMode = useAnalysisStore(state => state.comparisonMode);
  const enableComparisonMode = useAnalysisStore(state => state.enableComparisonMode);
  
  if (availableYears.length === 0) return null;
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Año Principal:
          </label>
          <select
            value={baseYear}
            onChange={(e) => setBaseYear(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        {availableYears.length === 1 && !comparisonMode && (
          <button
            onClick={enableComparisonMode}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cargar más años para comparar
          </button>
        )}
      </div>
    </div>
  );
};

6.5 Crear ComparisonYearSelector.jsx
import { useAnalysisStore } from '../stores/analysisStore';

export const ComparisonYearSelector = () => {
  const availableYears = useAnalysisStore(state => state.getAvailableYears());
  const baseYear = useAnalysisStore(state => state.getBaseYear());
  const comparisonYears = useAnalysisStore(state => state.getComparisonYears());
  const toggleYearInComparison = useAnalysisStore(state => state.toggleYearInComparison);
  const loadComparisonYear = useAnalysisStore(state => state.loadComparisonYear);
  
  const otherYears = availableYears.filter(y => y !== baseYear);
  
  const handleFileUpload = async (file) => {
    await loadComparisonYear(file);
  };
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">Años de Comparación</h3>
      
      {/* Lista de años cargados */}
      {otherYears.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">
            Selecciona los años que deseas incluir en la comparativa:
          </p>
          <div className="flex flex-wrap gap-2">
            {otherYears.map(year => (
              <label
                key={year}
                className={`
                  px-4 py-2 rounded cursor-pointer transition-colors
                  ${comparisonYears.includes(year)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={comparisonYears.includes(year)}
                  onChange={() => toggleYearInComparison(year)}
                  className="sr-only"
                />
                {year}
              </label>
            ))}
          </div>
        </div>
      )}
      
      {/* Botón para cargar más años */}
      <div>
        <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 inline-block">
          + Cargar Otro Año
          <input
            type="file"
            accept=".xlsx,.xlsm"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="sr-only"
          />
        </label>
        <p className="text-xs text-gray-600 mt-2">
          Máximo 5 años. Actualmente: {availableYears.length}/5
        </p>
      </div>
    </div>
  );
};

6.6 Crear ExportButtons.jsx
import { useActiveAnalysis, useComparisonMode } from '../stores/analysisStore';
import { generatePDF } from '../reports/pdf/PDFReportGenerator';
import { generateHTML } from '../reports/html/HTMLReportGenerator';
import { FileDown, Globe } from 'lucide-react';

export const ExportButtons = () => {
  const analysis = useActiveAnalysis();
  const comparisonMode = useComparisonMode();
  const comparisonAnalyses = useAnalysisStore(state => state.getComparisonAnalyses());
  const [generating, setGenerating] = useState(false);
  
  if (!analysis) return null;
  
  const handleGeneratePDF = async () => {
    setGenerating(true);
    try {
      await generatePDF(analysis, {
        isMultiYear: comparisonMode && comparisonAnalyses.length > 0,
        comparisonAnalyses,
        excludePIAR: true
      });
    } catch (error) {
      alert('Error al generar PDF: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleGenerateHTML = async () => {
    setGenerating(true);
    try {
      await generateHTML(analysis, {
        isMultiYear: comparisonMode && comparisonAnalyses.length > 0,
        comparisonAnalyses,
        excludePIAR: true
      });
    } catch (error) {
      alert('Error al generar HTML: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Generar Informes</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Botón PDF */}
        <button
          onClick={handleGeneratePDF}
          disabled={generating}
          className="flex items-center justify-center gap-3 bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
        >
          <FileDown size={24} />
          <div className="text-left">
            <div className="font-bold">Generar PDF</div>
            <div className="text-sm opacity-90">Informe estático para imprimir</div>
          </div>
        </button>
        
        {/* Botón HTML */}
        <button
          onClick={handleGenerateHTML}
          disabled={generating}
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <Globe size={24} />
          <div className="text-left">
            <div className="font-bold">Generar HTML</div>
            <div className="text-sm opacity-90">Informe interactivo para compartir</div>
          </div>
        </button>
      </div>
      
      {comparisonMode && comparisonAnalyses.length > 0 && (
        <p className="text-sm text-blue-600 mt-3 text-center">
          ℹ️ Los informes incluirán análisis comparativo de {comparisonAnalyses.length + 1} años
        </p>
      )}
    </div>
  );
};

6.7 Crear LoadingSpinner.jsx
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

6.8 Actualizar main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

SPRINT 7: TESTING Y POLISH (Semana 9-10) ⭐ CRÍTICO PARA CONFIANZA
Objetivo: Tests que te den confianza en la refactorización
7.1 Configurar Vitest
bashnpm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom
Actualizar vite.config.js:
javascriptexport default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js'
  }
});
7.2 Tests para calculations/basic.js
javascript// tests/unit/calculations/basic.test.js
import { describe, test, expect } from 'vitest';
import { mean, stdDev, median } from '../../../src/utils/calculations/basic';

describe('mean', () => {
  test('calcula promedio correctamente', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
  });
  
  test('maneja arrays vacíos', () => {
    expect(mean([])).toBe(0);
  });
  
  test('filtra nulls y NaN', () => {
    expect(mean([1, 2, null, 3, NaN, 4])).toBe(2.5);
  });
});

describe('stdDev', () => {
  test('calcula desviación estándar muestral (n-1)', () => {
    const result = stdDev([10, 20, 30, 40, 50]);
    expect(result).toBeCloseTo(15.81, 2); // Coincide con Excel DESVEST.M
  });
  
  test('retorna 0 para arrays de 1 elemento', () => {
    expect(stdDev([5])).toBe(0);
  });
});

// ... más tests
7.3 Tests para Analysis model
javascript// tests/unit/models/Analysis.test.js
import { describe, test, expect } from 'vitest';
import { Analysis } from '../../../src/models/Analysis';

describe('Analysis', () => {
  const mockData = [
    { Año: 2025, Nombre: 'Juan', Apellido: 'Pérez', Grupo: '11A', '¿PIAR?': 'No', Global: 350 },
    { Año: 2025, Nombre: 'María', Apellido: 'García', Grupo: '11A', '¿PIAR?': 'Sí', Global: 280 }
  ];
  
  test('crea instancia válida', () => {
    const analysis = new Analysis(2025, mockData);
    expect(analysis.year).toBe(2025);
    expect(analysis.processedData).toHaveLength(2);
  });
  
  test('aplica filtros correctamente', () => {
    const analysis = new Analysis(2025, mockData);
    analysis.updateFilters({ excludePIAR: true });
    const filtered = analysis.getFilteredData();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].Nombre).toBe('Juan');
  });
  
  test('cachea cálculos', () => {
    const analysis = new Analysis(2025, mockData);
    const metrics1 = analysis.getGlobalMetrics();
    const metrics2 = analysis.getGlobalMetrics();
    expect(metrics1).toBe(metrics2); // Mismo objeto en cache
  });
});
7.4 Tests para validaciones
javascript// tests/unit/validation/schemaValidator.test.js
import { describe, test, expect } from 'vitest';
import { validateExcelComplete } from '../../../src/utils/validation/schemaValidator';

describe('validateExcelComplete', () => {
  test('acepta Excel válido', () => {
    const validData = [{
      Año: 2025,
      '¿PIAR?': 'No',
      Grupo: '11A',
      Nombre: 'Juan',
      Apellido: 'Pérez',
      'Lectura crítica': 65,
      'Matemáticas': 70,
      'Sociales': 68,
      'Naturales': 72,
      'Inglés': 75,
      'Global': 350
    }];
    
    const result = validateExcelComplete(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('rechaza Excel con columnas faltantes', () => {
    const invalidData = [{
      Año: 2025,
      Nombre: 'Juan'
      // Faltan muchas columnas
    }];
    
    const result = validateExcelComplete(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

7.5 Test de integración: Flujo completo
javascript// tests/integration/analysis-flow.test.js
import { describe, test, expect, beforeEach } from 'vitest';
import { useAnalysisStore } from '../../src/stores/analysisStore';

describe('Flujo completo de análisis', () => {
  beforeEach(() => {
    // Reset store antes de cada test
    useAnalysisStore.getState().reset();
  });
  
  test('Usuario carga Excel → genera PDF exitosamente', async () => {
    // Este test simularía el flujo completo
    // Por ahora, asegurar que las piezas funcionan juntas
  });
});
7.6 Agregar scripts a package.json
json{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}

📋 CHECKLIST DE VERIFICACIÓN POST-REFACTORIZACIÓN
✅ Configuración:

 Todos los archivos de /src/config/ creados y poblados
 Ningún string mágico hardcodeado fuera de config
 Colores centralizados en visualConfig.js
 ACADEMIC_AREAS es la única fuente de verdad para áreas

✅ Estado:

 Zustand instalado y configurado
 analysisStore.js implementado con persist y devtools
 Todos los componentes usan hooks de Zustand
 No hay prop drilling

✅ Modelos:

 Clase Analysis funcional con cache
 Clase MultiYearAnalysis funcional
 Serialización/deserialización funcionando
 Tests para ambos modelos

✅ Cálculos:

 calculations.js dividido en 4 módulos
 Todas las funciones exportadas desde index.js
 Funciones comparativas implementadas
 Tests para funciones básicas y estadísticas

✅ Validación:

 Sistema de validación completo
 Errores personalizados implementados
 ErrorHandler funcional
 ErrorBoundary integrado

✅ PDF:
pdfBuilder.js dividido en <10 archivos
 Cada sección en su propio archivo
 PDF orquestador <200 líneas
 Sección de comparación implementada
 Usa prepareAreaChartData() y similares

✅ HTML:

 Sistema de HTML export modular
 Secciones separadas
 Interactividad con Chart.js
 Sección de comparación implementada
 Usa mismos datos preparados que PDF

✅ Componentes:

 App.jsx refactorizado (<150 líneas)
 Todos los componentes nuevos creados
 FileUploader con dialog de comparación
 ExportButtons funcional
 No hay lógica de negocio en componentes

✅ Testing:

 Vitest configurado
 Al menos 10 tests unitarios pasando
 Test de integración básico
 Coverage >50% en funciones críticas

✅ Funcionalidad:

 Carga de primer año funcional
 Dialog "¿Cargar más años?" aparece
 Modo comparativo se activa correctamente
 Carga de años adicionales funcional
 Selección de años para comparar funcional
 Preview de datos muestra información correcta
 Generación de PDF funciona (análisis simple)
 Generación de HTML funciona (análisis simple)
 Generación de PDF con comparación funciona
 Generación de HTML con comparación funciona


🎯 RESULTADO FINAL ESPERADO
Características del Sistema Refactorizado:

Modularidad Extrema:

Ningún archivo >300 líneas
Cada módulo con responsabilidad única
Fácil agregar nuevas funcionalidades


Escalabilidad Garantizada:

Análisis multi-año funciona out-of-the-box
Agregar nueva columna = modificar 1 archivo (config)
Agregar nueva métrica = modificar 2-3 archivos máximo
Agregar nueva sección de informe = crear 2 archivos (PDF + HTML)


Mantenibilidad Alta:

Código autodocumentado
Separación de concerns clara
Tests dan confianza para cambios
Nuevos desarrolladores entienden en <2 días


Robustez:

Validaciones en cada punto crítico
Manejo de errores profesional
Error Boundary captura crashes
Persist mantiene datos entre sesiones


UX Mejorada:

Flujo intuitivo de carga de años
Preview inmediato de datos
Feedback claro de estado (loading, errors)
Persist = no perder trabajo al recargar




🚨 NOTAS CRÍTICAS PARA WINDSURF
1. ORDEN ES CRUCIAL:

NO implementes Sprint 3 sin completar Sprint 1 y 2
Los archivos de config DEBEN existir antes de usarlos
Tests te darán confianza - no los omitas

2. NO TOCAR CÓDIGO VIEJO HASTA TENER NUEVO FUNCIONANDO:

Crear estructura nueva en paralelo
Migrar funcionalidad poco a poco
Mantener código viejo funcionando hasta verificar nuevo

3. COMMITS PEQUEÑOS Y FRECUENTES:

Commit después de cada archivo de config
Commit después de cada módulo de calculations
Commit después de cada sección de PDF/HTML

Usar mensajes descriptivos: "feat: add columnConfig", "refactor: split calculations into modules"
4. SI ALGO NO FUNCIONA:

NO continuar al siguiente sprint
Revisar imports/exports
Verificar que config files existen
Correr tests para encontrar el problema
5. IMPORTS CRÍTICOS:
// SIEMPRE usar imports absolutos desde config:
import { ACADEMIC_AREAS } from '../../config/columnConfig';
import { METRIC_LIMITS } from '../../config/metricsConfig';
import { COLORS } from '../../config/visualConfig';

// NUNCA hardcodear:
❌ const areas = ['Lectura crítica', 'Matemáticas', ...];
✅ import { ACADEMIC_AREAS } from '../../config/columnConfig';
   const areas = ACADEMIC_AREAS.map(a => a.name);
6. ZUSTAND PERSIST:
javascript// Al implementar persist, asegurar que Analysis y MultiYearAnalysis
// tengan métodos toJSON() y fromJSON()
// De lo contrario, persist no funcionará correctamente7. VALIDACIONES:
javascript// SIEMPRE validar ANTES de procesar:
1. validateExcelComplete(data) ← estructura y tipos
2. validateDataIntegrity(data) ← consistencia
3. validateMultiYear(...) ← al cargar año adicional

// Si validación falla, LANZAR error personalizado:
throw new ValidationError('Mensaje claro', { errors: [...] });8. PREPARACIÓN DE DATOS PARA GRÁFICOS:
javascript// HTML y PDF DEBEN usar las MISMAS funciones:
const chartData = prepareAreaChartData(analysis, true);

// PDF usa chartData para dibujar con primitives
// HTML usa chartData para configurar Chart.js

// NUNCA preparar datos dos veces de forma diferente9. SECCIONES DE INFORMES:
javascript// Cada sección PDF debe:
- Ser una función pura: generateXXX(doc, analysis, sectionNumber)
- Usar helpers: drawTable(), drawBarChart()
- NO tener lógica de cálculo (eso va en calculations)
- Retornar nueva posición Y si no agrega página

// Cada sección HTML debe:
- Ser una función pura: generateXXXSection(data)
- Retornar string de HTML
- NO tener lógica de cálculo
- Usar template literals10. MANEJO DE COMPARATIVAS MULTI-AÑO:
javascript// Al generar informes, SIEMPRE verificar:
if (isMultiYear && comparisonAnalyses.length > 0) {
  // Agregar sección de comparación
  generateComparison(...);
}

// NO generar sección vacía si no hay datos para comparar📊 MÉTRICAS DE ÉXITOCuantitativas (Medibles):

✅ pdfBuilder.js: 800 líneas → <200 líneas (75% reducción)
✅ calculations.js: 400 líneas → <100 líneas por módulo (modularizado)
✅ Duplicación de código: Reducir 60%+ (medible con herramientas)
✅ Cobertura de tests: >70% en funciones críticas
✅ Tiempo de carga inicial: <2 segundos (mismo o mejor)
✅ Tiempo de generación PDF: <5 segundos (mismo o mejor)
✅ Bundle size: <500KB gzipped (actual + ~12KB de Zustand)
Cualitativas (Observables):

✅ Agregar nueva columna: Modificar solo columnConfig.js
✅ Agregar nueva métrica: Modificar 2-3 archivos máximo
✅ Agregar nueva sección: Crear 2 archivos (PDF + HTML)
✅ Análisis multi-año: Funciona sin bugs
✅ Nuevos desarrolladores: Entienden arquitectura en <1 día
✅ Cambios futuros: No requieren tocar 8+ archivos
🎓 GUÍA DE TROUBLESHOOTING
Problema 1: "Cannot find module '../config/columnConfig'"
Causa: Archivo de config no existe o ruta incorrecta
Solución:

Verificar que archivo existe en /src/config/columnConfig.js
Verificar ruta relativa desde archivo que importa
Usar console.log(import.meta.url) para debug

Problema 2: "analyses.get is not a function"
Causa: MultiYearAnalysis no se deserializó correctamente desde persist
Solución:

Verificar que onRehydrateStorage en Zustand llama MultiYearAnalysis.fromJSON()
Verificar que toJSON() y fromJSON() están implementados correctamente
Limpiar localStorage y recargar: localStorage.clear()

Problema 3: Tests fallan con "ReferenceError: ..."
Causa: Imports o mocks faltantes
Solución:

Verificar que Vitest está configurado con globals: true
Mock de módulos externos si es necesario
Usar vi.mock() para módulos problemáticos

Problema 4: PDF se genera pero está en blanco
Causa: Funciones de sección no se llamaron o retornaron error silencioso
Solución:

Agregar console.log() en cada generateXXX() para verificar ejecución
Verificar que doc.save() se llama al final
Verificar que no hay errores en consola

Problema 5: HTML se genera pero gráficos no aparecen
Causa: Chart.js no se inicializa o datos mal formateados
Solución:

Verificar que CDN de Chart.js carga: <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0"></script>
Verificar que initCharts() se llama en DOMContentLoaded
Abrir consola del navegador en el HTML generado para ver errores
Verificar formato de datos: console.log(JSON.stringify(chartData))

Problema 6: "Maximum call stack size exceeded"
Causa: Referencia circular en serialización o cache infinito
Solución:

Verificar que toJSON() no incluye propiedades circulares
Limpiar cache antes de serializar: analysis.clearCache()
No incluir _calculationCache en toJSON()

Problema 7: Validaciones pasan pero datos están mal
Causa: Validaciones no cubren todos los casos
Solución:

Agregar más tests para casos edge
Revisar reglas de validación en columnConfig.js
Agregar validación de integridad adicional

Problema 8: Persist no funciona
Causa: Configuración incorrecta o datos no serializables
Solución:
javascript// Verificar estructura de persist:
persist(
  (set, get) => ({ ... }),
  {
    name: 'icfes-analysis-storage',
    partialize: (state) => ({
      // Solo incluir datos serializables
      multiYearAnalysis: state.multiYearAnalysis.toJSON(),
      comparisonMode: state.comparisonMode
    }),
    onRehydrateStorage: () => (state) => {
      if (state && state.multiYearAnalysis) {
        state.multiYearAnalysis = MultiYearAnalysis.fromJSON(
          state.multiYearAnalysis
        );
      }
    }
  }
)

📈 ROADMAP POST-REFACTORIZACIÓN
Una vez completada la refactorización, el sistema estará preparado para:
Corto Plazo (1-2 semanas):

✅ Agregar nuevas columnas opcionales (Componente, Competencia, % Acierto)
✅ Implementar filtros avanzados en vista interactiva
✅ Agregar gráficos adicionales (pastel, radar)
✅ Mejorar UI/UX con animaciones y transiciones

Mediano Plazo (1-2 meses):

✅ Exportar a Excel con formato profesional
✅ Comparativas personalizadas (seleccionar métricas específicas)
✅ Historial de análisis (guardar múltiples análisis en base de datos)
✅ Autenticación (login para instituciones)
✅ API REST para integración con otros sistemas

Largo Plazo (3-6 meses):

✅ Dashboard institucional con múltiples colegios
✅ BI avanzado con predicciones y recomendaciones
✅ Mobile app (React Native)
✅ Integración con LMS (Moodle, Canvas, etc.)
✅ IA para análisis predictivo de tendencias


🎯 ENTREGABLES FINALES
Al completar esta refactorización, deberás tener:
1. Código Fuente Refactorizado:

✅ Estructura de carpetas nueva implementada
✅ Todos los archivos de config poblados
✅ Zustand store funcional con persist
✅ Modelos de datos robustos
✅ Sistema de validación completo
✅ PDF y HTML modulares y sincronizados
✅ Componentes UI simplificados

2. Tests:

✅ Al menos 30 tests unitarios
✅ 2-3 tests de integración
✅ Coverage report generado
✅ Todos los tests pasando

3. Documentación:

✅ README actualizado con nueva arquitectura
✅ Comentarios JSDoc en funciones críticas
✅ Guía de contribución para nuevos developers
✅ Changelog con cambios principales

4. Build Funcional:

✅ npm run dev funciona sin errores
✅ npm run build genera bundle optimizado
✅ npm test pasa todos los tests
✅ Deploy en Vercel exitoso

5. Funcionalidades Verificadas:

✅ Análisis de un año funciona perfectamente
✅ Análisis multi-año funciona correctamente
✅ PDF se genera con todas las secciones
✅ HTML se genera con interactividad
✅ Comparativas muestran datos correctos
✅ Validaciones capturan errores apropiadamente
✅ ErrorBoundary maneja crashes elegantemente
✅ Persist mantiene datos entre sesiones


💎 PRINCIPIOS DE CÓDIGO A SEGUIR
1. DRY (Don't Repeat Yourself):
javascript// ❌ MAL - Código duplicado
const lecturaPromedio = data.filter(s => s['Lectura crítica'] != null)
  .reduce((sum, s) => sum + s['Lectura crítica'], 0) / data.length;

const matematicasPromedio = data.filter(s => s['Matemáticas'] != null)
  .reduce((sum, s) => sum + s['Matemáticas'], 0) / data.length;

// ✅ BIEN - Función reutilizable
const calcularPromedio = (data, campo) => {
  const valores = data.filter(s => s[campo] != null).map(s => s[campo]);
  return mean(valores);
};

const lecturaPromedio = calcularPromedio(data, 'Lectura crítica');
const matematicasPromedio = calcularPromedio(data, 'Matemáticas');
2. KISS (Keep It Simple, Stupid):
javascript// ❌ MAL - Demasiado complejo
const procesarEstudiantes = (data) => {
  return data.reduce((acc, student) => {
    if (student['¿PIAR?'] === 'Sí') {
      acc.conPIAR = [...(acc.conPIAR || []), student];
    } else {
      acc.sinPIAR = [...(acc.sinPIAR || []), student];
    }
    return acc;
  }, {});
};

// ✅ BIEN - Simple y claro
const separarPorPIAR = (data) => {
  return {
    conPIAR: data.filter(s => s['¿PIAR?'] === 'Sí'),
    sinPIAR: data.filter(s => s['¿PIAR?'] !== 'Sí')
  };
};
3. SOLID (Single Responsibility):
javascript// ❌ MAL - Función hace demasiado
const procesarYGenerarPDF = (file) => {
  const data = parseExcel(file); // Responsabilidad 1
  const metrics = calculateMetrics(data); // Responsabilidad 2
  const pdf = generatePDF(metrics); // Responsabilidad 3
  return pdf;
};

// ✅ BIEN - Cada función una responsabilidad
const data = parseExcel(file);
const metrics = calculateMetrics(data);
const pdf = generatePDF(metrics);
4. Fail Fast:
javascript// ❌ MAL - Falla tarde
const calculateAverage = (data) => {
  let sum = 0;
  let count = 0;
  for (let item of data) {
    if (item != null) {
      sum += item;
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
};

// ✅ BIEN - Falla rápido
const calculateAverage = (data) => {
  if (!data || data.length === 0) {
    throw new Error('Data is required');
  }
  
  const validData = data.filter(v => v != null);
  return mean(validData);
};
5. Composition over Inheritance:
javascript// ❌ MAL - Herencia compleja
class ReportGenerator {
  generate() { /* ... */ }
}
class PDFReportGenerator extends ReportGenerator { /* ... */ }
class HTMLReportGenerator extends ReportGenerator { /* ... */ }

// ✅ BIEN - Composición de funciones
const generateReport = (data, formatter) => {
  const sections = prepareSections(data);
  return formatter(sections);
};

const pdf = generateReport(data, formatAsPDF);
const html = generateReport(data, formatAsHTML);

🏁 CHECKLIST FINAL ANTES DE DEPLOYMENT
Pre-deployment:

 Todos los tests pasan (npm test)
 Build exitoso sin warnings (npm run build)
 Bundle size aceptable (<500KB)
 No hay console.log() en código de producción
 No hay TODOs críticos pendientes
 README actualizado con nueva documentación
 Changelog creado con cambios principales

Funcionalidad:

 Carga de Excel funciona con archivo válido
 Carga de Excel rechaza archivo inválido con mensaje claro
 Preview de datos muestra información correcta
 Análisis simple genera PDF correctamente
 Análisis simple genera HTML correctamente
 Modo comparativo se activa correctamente
 Carga de años adicionales funciona
 Análisis comparativo genera PDF con sección de comparación
 Análisis comparativo genera HTML con gráficos interactivos
 Persist mantiene datos al recargar página
 ErrorBoundary captura errores y muestra UI elegante

Performance:

 Carga inicial <3 segundos
 Generación de PDF <5 segundos
 Generación de HTML <3 segundos
 Sin memory leaks (verificar con DevTools)
 Smooth scrolling y transiciones

Browser Testing:

 Chrome (últimas 2 versiones)
 Firefox (últimas 2 versiones)
 Safari (últimas 2 versiones)
 Edge (últimas 2 versiones)

Mobile Testing:

 Vista responsive en móvil
 Touch interactions funcionan
 No hay overflow horizontal

Accesibilidad:

 Contraste de colores aceptable (WCAG AA)
 Navegación con teclado funciona
 Screen readers pueden navegar
 Mensajes de error son descriptivos


🎉 MENSAJE FINAL
Esta refactorización transformará tu proyecto de un prototipo funcional a un sistema profesional y escalable.
Beneficios inmediatos:

✅ Código más fácil de entender y mantener
✅ Tests te dan confianza para cambios futuros
✅ Agregar features es más rápido (días en lugar de semanas)
✅ Menos bugs por código más modular
✅ Mejor experiencia de usuario con Zustand persist

Beneficios a largo plazo:

✅ Base sólida para análisis multi-año
✅ Preparado para escalar a 100+ años
✅ Fácil integrar con backends/APIs
✅ Otros desarrolladores pueden contribuir fácilmente
✅ Sistema mantenible por años

Tiempo estimado: 10-12 semanas
Pero el resultado vale la pena: un sistema que podrás mantener y escalar durante años sin problemas.

📞 SOPORTE Y RECURSOS
Si te atascas:

Revisa este documento - Tiene la respuesta al 90% de problemas
Revisa los comentarios JSDoc en el código
Corre los tests - Te dirán qué está roto
Usa DevTools - Console, Network, React DevTools
Git bisect - Encuentra cuándo se rompió algo

Recursos útiles:

Zustand Docs: https://docs.pmnd.rs/zustand
Vitest Docs: https://vitest.dev
jsPDF Docs: https://artskydj.github.io/jsPDF/docs/
Chart.js Docs: https://www.chartjs.org/docs/

Comandos útiles:
bash# Ver qué cambió
git diff

# Ver estado actual
git status

# Crear branch para experimento
git checkout -b experiment/nueva-feature

# Ver tamaño del bundle
npm run build && ls -lh dist/

# Limpiar y reinstalar
rm -rf node_modules package-lock.json && npm install

# Ver coverage de tests
npm run test:coverage

✅ ¡ADELANTE CON LA REFACTORIZACIÓN!
Este documento es tu mapa completo. Sigue los sprints en orden, verifica cada checklist, y al final tendrás un sistema del que puedes estar orgulloso.
¡Éxito con el proyecto! 🚀

Fin del Documento de Auditoría e Instrucciones Consolidadas