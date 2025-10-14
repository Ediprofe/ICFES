🔍 AUDITORÍA COMPLETA Y PLAN DE REFACTORIZACIÓN - ICFES ANALYZER
Fecha de Auditoría: 14 de Octubre de 2025
Auditor: Claude (Anthropic)
Proyecto: ICFES Analyzer - Sistema de Análisis de Resultados Académicos
Versión Actual: 1.0 (Funcional pero con deuda técnica significativa)

📊 RESUMEN EJECUTIVO
Estado Actual

✅ Funcional: El sistema cumple su propósito actual
⚠️ Deuda Técnica Alta: ~245 horas estimadas
🚨 No Escalable: Bloqueado para análisis multi-año sin refactorización
⚠️ Mantenibilidad Baja: Cambios simples requieren modificar múltiples archivos

Objetivo de Refactorización
Transformar el proyecto en un sistema:

✅ Modular y mantenible
✅ Escalable para análisis multi-año
✅ Con informes unificados (HTML + PDF con mismas secciones)
✅ Testeable y robusto
✅ Preparado para crecimiento futuro

Tiempo Estimado
10-12 semanas (1 desarrollador full-time) dividido en 7 sprints

🔴 HALLAZGOS CRÍTICOS DE LA AUDITORÍA
1. ARQUITECTURA Y ESTRUCTURA
❌ PROBLEMAS CRÍTICOS:
1.1 Monolitos Gigantes
❌ src/utils/pdfBuilder.js: 800+ líneas
   - Violación severa de Single Responsibility Principle
   - Mezcla lógica de negocio, presentación y dibujo
   - Imposible de testear unitariamente
   
❌ src/utils/calculations.js: 400+ líneas
   - Todas las funciones estadísticas mezcladas
   - Sin categorización ni separación de concerns
   - Funciones >100 líneas con alta complejidad ciclomática
```

**1.2 Acoplamiento Extremo**
```
❌ Componentes dependen de estructura exacta de datos
❌ Nombres de columnas hardcodeados en 8+ archivos
❌ Colores y estilos duplicados en 3+ lugares
❌ Lógica de "con PIAR vs sin PIAR" repetida 5+ veces
```

**1.3 Sin Separación de Concerns**
```
❌ Lógica de negocio mezclada con presentación
❌ No hay capa de servicios
❌ Utils hacen todo directamente
❌ Componentes calculan en lugar de recibir datos

2. GESTIÓN DE ESTADO
❌ PROBLEMAS CRÍTICOS:
2.1 Estado Monolítico en App.jsx
javascript// ACTUAL (Problemático)
const [data, setData] = useState(null);
const [filters, setFilters] = useState({...});

// PROBLEMA: 
// - Todo vive en un solo componente
// - Prop drilling extremo
// - Re-renders innecesarios
// - Imposible gestionar múltiples años
```

**2.2 No Preparado para Multi-Año**
```
❌ Estado es un array plano, no estructura de análisis
❌ No hay concepto de "período" o "año"
❌ Imposible mantener múltiples datasets simultáneamente
❌ Filtros globales, no por análisis
```

**2.3 Sin Validación de Tipos**
```
❌ No hay TypeScript ni PropTypes
❌ Errores en runtime, no en desarrollo
❌ Difícil debugging

3. DUPLICACIÓN DE CÓDIGO
❌ CÓDIGO DUPLICADO MASIVAMENTE:
3.1 Configuración de Columnas (8+ archivos)
javascript// excelParser.js
const requiredColumns = ['¿PIAR?', 'Grupo', 'Nombre', ...];

// calculations.js
const subjects = ['Lectura crítica', 'Matemáticas', ...];

// ChartsPanel.jsx
const subjects = ['Lectura crítica', 'Matemáticas', ...];

// pdfBuilder.js
const subjects = ['Lectura crítica', 'Matemáticas', ...];

// MetricsPanel.jsx
const areaColors = {
  'Lectura crítica': '#3b82f6',
  'Matemáticas': '#ef4444',
  ...
};

// ❌ PROBLEMA: Agregar nueva área = modificar 8+ archivos
3.2 Lógica "Con PIAR vs Sin PIAR" (5+ lugares)
javascript// Repetido en: calculations.js, MetricsPanel.jsx, ChartsPanel.jsx, 
// pdfBuilder.js, htmlExporter.js

const dataSinPIAR = data.filter(s => s['¿PIAR?'] !== 'Sí');
const metricsConPIAR = calculateMetrics(data);
const metricsSinPIAR = calculateMetrics(dataSinPIAR);
```

**3.3 Generación de Gráficos (3+ implementaciones)**
```
❌ Lógica casi idéntica pero copiada en:
   - ChartsPanel.jsx (Recharts para web)
   - pdfBuilder.js (Canvas manual para PDF)
   - htmlExporter.js (Chart.js para HTML export)

4. MANTENIBILIDAD Y ESCALABILIDAD
❌ BLOQUEADORES PARA ANÁLISIS MULTI-AÑO:
4.1 No Hay Modelo de Datos
javascript// ACTUAL: Array plano
const data = [
  { Nombre: 'Juan', Global: 350, ... },
  ...
];

// NECESARIO para multi-año:
const analyses = {
  '2025': {
    year: 2025,
    data: [...],
    filters: {...},
    calculations: {...},
    metadata: {...}
  },
  '2024': { ... },
  '2023': { ... }
};
```

**4.2 Componentes No Preparados**
```
❌ Todos asumen un solo dataset
❌ No hay concepto de "comparación temporal"
❌ Gráficos no soportan múltiples series de años
❌ Exports asumen un solo análisis
```

**4.3 Configuración Hardcodeada**
```
❌ Magic numbers sin constantes: 3 (outliers), 0.5 (Hazen)
❌ Límites hardcodeados: Top 5, Top 3
❌ Nombres de secciones dispersos
❌ Sin archivo de configuración central
```

---

### 5. TESTING Y CALIDAD

#### 🚨 **AUSENCIA TOTAL DE TESTS:**
```
❌ NO HAY TESTS UNITARIOS
❌ NO HAY TESTS DE INTEGRACIÓN  
❌ NO HAY VALIDACIÓN AUTOMÁTICA
❌ NO HAY CI/CD

RIESGO:
- Imposible refactorizar con confianza
- Regresiones no detectables
- Dificultad para nuevos desarrolladores
```

---

### 6. RENDIMIENTO

#### ⚠️ **OPTIMIZACIONES AUSENTES:**
```
❌ Re-renders innecesarios: Cada cambio de filtro recalcula todo
❌ Cálculos no memoizados: useMemo ausente en operaciones costosas
❌ No hay lazy loading: Todos los componentes cargan al inicio
❌ Archivos gigantes: pdfBuilder.js muy pesado
```

---

### 7. ESTRUCTURA DE INFORMES

#### ❌ **PROBLEMAS ACTUALES:**

**7.1 Tres Sistemas Separados**
```
❌ Web: Visualización con Recharts
❌ PDF: pdfBuilder.js con lógica propia
❌ HTML Export: htmlExporter.js con lógica diferente

PROBLEMA:
- Contenido inconsistente entre formatos
- Agregar sección = modificar 3 lugares
- No hay "fuente única de verdad"
```

**7.2 HTML y PDF No Sincronizados**
```
❌ HTML tiene secciones que PDF no tiene
❌ Orden diferente de secciones
❌ Datos calculados de forma diferente
❌ Estilos y colores inconsistentes

📋 EVALUACIÓN POR DIMENSIONES
DimensiónCalificaciónJustificaciónMantenibilidad⚠️ 4/10Alta duplicación, acoplamiento fuerte, funciones gigantesEscalabilidad🚨 2/10No preparado para multi-año sin refactorización mayorLegibilidad✅ 6/10Nombres descriptivos, pero funciones muy largasRobustez⚠️ 5/10Validaciones básicas, pero sin testsModularidad🚨 3/10Archivos gigantes rompen la modularidadPerformance⚠️ 6/10Funciona, pero muchas optimizaciones pendientes

💰 DEUDA TÉCNICA CUANTIFICADA
Crítica (Bloqueante para nuevas features):

✅ Refactorizar pdfBuilder.js en módulos → 40 horas
✅ Implementar gestión de estado centralizada (Zustand) → 30 horas
✅ Crear modelo de datos para multi-año → 20 horas
✅ Extraer configuración a archivos centrales → 15 horas

Alta (Dificulta mantenimiento):

✅ Eliminar duplicación de código → 25 horas
✅ Implementar memoización y optimizaciones → 15 horas
✅ Crear capa de servicios → 20 horas
✅ Dividir calculations.js en módulos → 15 horas

Media (Mejora calidad):

✅ Tests unitarios básicos → 40 horas
✅ Refactorizar componentes grandes → 20 horas
✅ Documentación técnica detallada → 10 horas

TOTAL ESTIMADO: ~245 horas de deuda técnica

🎯 PLAN DE REFACTORIZACIÓN COMPLETO
VISIÓN DE LA NUEVA ARQUITECTURA
Principios Rectores:

"Una sola fuente de verdad" - Configuración centralizada
"Mismo contenido, múltiples formatos" - HTML y PDF sincronizados
"Componentes tontos, lógica en stores" - Separación clara
"Test-Driven Refactoring" - Tests antes de cambios
"Escalabilidad desde el diseño" - Preparado para multi-año

Roles de Cada Capa:

Web: Vista previa simple + validación visual
HTML Export: Informe interactivo completo (filtros, toggles, Chart.js)
PDF Export: Mismo contenido que HTML pero estático
Store: Gestión de múltiples análisis y estado global
Models: Encapsulación de datos y cálculos
Utils: Funciones puras reutilizables


🏗️ SPRINT 1: FUNDAMENTOS (Semana 1-2)
Objetivo:
Crear la base de configuración centralizada y estructura de carpetas
1.1 CREAR SISTEMA DE CONFIGURACIÓN CENTRALIZADO
Crear /src/config/columnConfig.js
javascript/**
 * ✅ ÚNICA FUENTE DE VERDAD para todas las columnas del sistema
 * Agregar nuevas columnas aquí las propaga automáticamente a todo el sistema
 */

export const COLUMN_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  YEAR: 'year'
};

export const REQUIRED_COLUMNS = [
  {
    name: 'Año',
    type: COLUMN_TYPES.YEAR,
    validation: (val) => val >= 2000 && val <= 2100,
    errorMessage: 'Año debe estar entre 2000 y 2100'
  },
  {
    name: '¿PIAR?',
    type: COLUMN_TYPES.TEXT,
    validation: (val) => ['Sí', 'No'].includes(val),
    errorMessage: 'PIAR debe ser "Sí" o "No"'
  },
  {
    name: 'Grupo',
    type: COLUMN_TYPES.TEXT,
    validation: (val) => val && val.trim().length > 0,
    errorMessage: 'Grupo es obligatorio'
  },
  {
    name: 'Nombre',
    type: COLUMN_TYPES.TEXT,
    validation: (val) => val && val.trim().length > 0,
    errorMessage: 'Nombre es obligatorio'
  },
  {
    name: 'Apellido',
    type: COLUMN_TYPES.TEXT,
    validation: (val) => val && val.trim().length > 0,
    errorMessage: 'Apellido es obligatorio'
  },
  {
    name: 'Lectura crítica',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100,
    errorMessage: 'Lectura crítica debe estar entre 0 y 100'
  },
  {
    name: 'Matemáticas',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100,
    errorMessage: 'Matemáticas debe estar entre 0 y 100'
  },
  {
    name: 'Sociales',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100,
    errorMessage: 'Sociales debe estar entre 0 y 100'
  },
  {
    name: 'Naturales',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100,
    errorMessage: 'Naturales debe estar entre 0 y 100'
  },
  {
    name: 'Inglés',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100,
    errorMessage: 'Inglés debe estar entre 0 y 100'
  },
  {
    name: 'Global',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 500,
    errorMessage: 'Global debe estar entre 0 y 500'
  }
];

export const OPTIONAL_COLUMNS = [
  {
    name: 'Percentil Lectura crítica',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100
  },
  {
    name: 'Percentil Matemáticas',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100
  },
  {
    name: 'Percentil Sociales',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100
  },
  {
    name: 'Percentil Naturales',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100
  },
  {
    name: 'Percentil Inglés',
    type: COLUMN_TYPES.NUMBER,
    validation: (val) => val >= 0 && val <= 100
  },
  {
    name: 'Componente',
    type: COLUMN_TYPES.TEXT
  },
  {
    name: 'Competencia',
    type: COLUMN_TYPES.TEXT
  },
  {
    name: '% Acierto',
    type: COLUMN_TYPES.NUMBER
  }
];

// Áreas académicas (subjects)
export const ACADEMIC_AREAS = [
  {
    id: 'lectura',
    name: 'Lectura crítica',
    shortName: 'Lectura',
    columnName: 'Lectura crítica',
    percentileColumn: 'Percentil Lectura crítica',
    color: '#3b82f6',      // blue-500
    lightColor: '#dbeafe', // blue-100
    darkColor: '#1e40af',  // blue-800
    icon: '📖'
  },
  {
    id: 'matematicas',
    name: 'Matemáticas',
    shortName: 'Matemáticas',
    columnName: 'Matemáticas',
    percentileColumn: 'Percentil Matemáticas',
    color: '#ef4444',      // red-500
    lightColor: '#fee2e2', // red-100
    darkColor: '#991b1b',  // red-800
    icon: '🔢'
  },
  {
    id: 'sociales',
    name: 'Sociales y ciudadanas',
    shortName: 'Sociales',
    columnName: 'Sociales',
    percentileColumn: 'Percentil Sociales',
    color: '#f97316',      // orange-500
    lightColor: '#ffedd5', // orange-100
    darkColor: '#9a3412',  // orange-800
    icon: '🌍'
  },
  {
    id: 'naturales',
    name: 'Ciencias naturales',
    shortName: 'Naturales',
    columnName: 'Naturales',
    percentileColumn: 'Percentil Naturales',
    color: '#22c55e',      // green-500
    lightColor: '#dcfce7', // green-100
    darkColor: '#166534',  // green-800
    icon: '🔬'
  },
  {
    id: 'ingles',
    name: 'Inglés',
    shortName: 'Inglés',
    columnName: 'Inglés',
    percentileColumn: 'Percentil Inglés',
    color: '#a855f7',      // purple-500
    lightColor: '#f3e8ff', // purple-100
    darkColor: '#6b21a8',  // purple-800
    icon: '🗣️'
  }
];

// Helper functions
export const getAreaByColumnName = (columnName) => {
  return ACADEMIC_AREAS.find(a => a.columnName === columnName);
};

export const getAreaById = (id) => {
  return ACADEMIC_AREAS.find(a => a.id === id);
};

export const getAllColumnNames = () => {
  return [
    ...REQUIRED_COLUMNS.map(c => c.name),
    ...OPTIONAL_COLUMNS.map(c => c.name)
  ];
};

export const getRequiredColumnNames = () => {
  return REQUIRED_COLUMNS.map(c => c.name);
};

Crear /src/config/metricsConfig.js
javascript/**
 * ✅ Configuración de todas las métricas calculables
 * Define qué se calcula, cómo se visualiza, en qué secciones aparece
 */

export const METRIC_TYPES = {
  MEAN: 'mean',
  STD_DEV: 'stdDev',
  MEDIAN: 'median',
  MODE: 'mode',
  MIN: 'min',
  MAX: 'max',
  PERCENTILE: 'percentile',
  Z_SCORE: 'zScore',
  OUTLIERS: 'outliers'
};

export const GLOBAL_METRICS = [
  {
    id: 'avgGlobal',
    name: 'Promedio global',
    type: METRIC_TYPES.MEAN,
    field: 'Global',
    format: (val) => val.toFixed(2),
    icon: '📊'
  },
  {
    id: 'totalStudents',
    name: 'Total de estudiantes',
    type: 'count',
    format: (val) => val.toString(),
    icon: '👥'
  },
  {
    id: 'outliers',
    name: 'Valores atípicos',
    type: METRIC_TYPES.OUTLIERS,
    threshold: 3, // ±3σ
    format: (val) => val.toString(),
    icon: '⚠️'
  }
];

export const AREA_METRICS = [
  {
    id: 'avgArea',
    name: 'Promedio',
    type: METRIC_TYPES.MEAN,
    format: (val) => val.toFixed(2)
  },
  {
    id: 'stdDevArea',
    name: 'Desviación estándar',
    type: METRIC_TYPES.STD_DEV,
    format: (val) => val.toFixed(2)
  },
  {
    id: 'percentileArea',
    name: 'Percentil promedio',
    type: METRIC_TYPES.PERCENTILE,
    format: (val) => val.toFixed(1) + '%'
  }
];

export const GRADE_METRICS = [
  {
    id: 'avgGrade',
    name: 'Promedio global',
    type: METRIC_TYPES.MEAN,
    field: 'Global',
    format: (val) => val.toFixed(2)
  },
  {
    id: 'stdDevGrade',
    name: 'Desviación estándar',
    type: METRIC_TYPES.STD_DEV,
    field: 'Global',
    format: (val) => val.toFixed(2)
  },
  {
    id: 'countGrade',
    name: 'Total estudiantes',
    type: 'count',
    format: (val) => val.toString()
  }
];

// Configuración para comparativas multi-año
export const COMPARISON_METRICS = [
  {
    id: 'yearOverYearAvg',
    name: 'Evolución del promedio',
    type: METRIC_TYPES.MEAN,
    chartType: 'line',
    showTrend: true
  },
  {
    id: 'yearOverYearStdDev',
    name: 'Evolución de la variabilidad',
    type: METRIC_TYPES.STD_DEV,
    chartType: 'line',
    showTrend: true
  },
  {
    id: 'yearOverYearOutliers',
    name: 'Tendencia de valores atípicos',
    type: METRIC_TYPES.OUTLIERS,
    chartType: 'bar',
    showTrend: false
  }
];

// Límites y constantes
export const METRIC_LIMITS = {
  TOP_PERFORMERS_BY_AREA: 5,
  TOP_PERFORMERS_BY_GRADE: 3,
  OUTLIER_THRESHOLD_SIGMA: 3,
  PERCENTILE_METHOD: 'hazen', // 'hazen' o 'linear'
  HAZEN_CONSTANT: 0.5,
  MAX_COMPARISON_YEARS: 5
};

export const METRIC_DISPLAY = {
  decimal_places: {
    [METRIC_TYPES.MEAN]: 2,
    [METRIC_TYPES.STD_DEV]: 2,
    [METRIC_TYPES.PERCENTILE]: 1,
    [METRIC_TYPES.Z_SCORE]: 2
  },
  colors: {
    positive: '#22c55e',  // green
    negative: '#ef4444',  // red
    neutral: '#6b7280',   // gray
    warning: '#f59e0b'    // amber
  }
};

Crear /src/config/reportSections.js
javascript/**
 * ✅ Define las secciones del informe y su orden
 * Mismo orden para HTML y PDF, diferente renderizado
 */

export const REPORT_SECTION_IDS = {
  COVER: 'cover',
  YEAR_SELECTOR: 'yearSelector',
  GLOBAL_METRICS: 'globalMetrics',
  STUDENTS_LIST: 'studentsList',
  AREA_METRICS: 'areaMetrics',
  GRADE_METRICS: 'gradeMetrics',
  AREA_CHARTS: 'areaCharts',
  GRADE_CHARTS: 'gradeCharts',
  TOP_BY_AREA: 'topByArea',
  TOP_BY_GRADE: 'topByGrade',
  OUTLIERS: 'outliers',
  COMPARISON: 'comparison'
};

export const REPORT_SECTIONS = [
  {
    id: REPORT_SECTION_IDS.COVER,
    name: 'Portada',
    order: 1,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '📄'
  },
  {
    id: REPORT_SECTION_IDS.YEAR_SELECTOR,
    name: 'Selector de Año',
    order: 2,
    required: false,
    availableIn: ['html'],
    showInSingleYear: false,
    showInMultiYear: true,
    icon: '📅'
  },
  {
    id: REPORT_SECTION_IDS.GLOBAL_METRICS,
    name: 'Métricas Globales',
    order: 3,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '📊'
  },
  {
    id: REPORT_SECTION_IDS.STUDENTS_LIST,
    name: 'Listado de Estudiantes',
    order: 4,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '📋'
  },
  {
    id: REPORT_SECTION_IDS.AREA_METRICS,
    name: 'Análisis por Área',
    order: 5,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '📚'
  },
  {
    id: REPORT_SECTION_IDS.GRADE_METRICS,
    name: 'Análisis por Grado',
    order: 6,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '🎓'
  },
  {
    id: REPORT_SECTION_IDS.AREA_CHARTS,
    name: 'Gráficos por Área',
    order: 7,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '📈'
  },
  {
    id: REPORT_SECTION_IDS.GRADE_CHARTS,
    name: 'Gráficos por Grado',
    order: 8,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '📉'
  },
  {
    id: REPORT_SECTION_IDS.TOP_BY_AREA,
    name: 'Top 5 por Área',
    order: 9,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '🏆'
  },
  {
    id: REPORT_SECTION_IDS.TOP_BY_GRADE,
    name: 'Top 3 por Grado',
    order: 10,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '🥇'
  },
  {
    id: REPORT_SECTION_IDS.OUTLIERS,
    name: 'Valores Atípicos',
    order: 11,
    required: true,
    availableIn: ['html', 'pdf'],
    showInSingleYear: true,
    showInMultiYear: true,
    icon: '⚠️'
  },
  {
    id: REPORT_SECTION_IDS.COMPARISON,
    name: 'Análisis Comparativo Multi-Año',
    order: 12,
    required: false,
    availableIn: ['html', 'pdf'],
    showInSingleYear: false,
    showInMultiYear: true,
    icon: '📊'
  }
];

// Helper functions
export const getSectionById = (id) => {
  return REPORT_SECTIONS.find(s => s.id === id);
};

export const getSectionsForFormat = (format, isMultiYear = false) => {
  return REPORT_SECTIONS
    .filter(s => s.availableIn.includes(format))
    .filter(s => isMultiYear ? s.showInMultiYear : s.showInSingleYear)
    .sort((a, b) => a.order - b.order);
};

export const getRequiredSections = () => {
  return REPORT_SECTIONS.filter(s => s.required);
};

Crear /src/config/visualConfig.js
javascript/**
 * ✅ Estilos, colores, tamaños para gráficos y tablas
 * Compartido entre HTML y PDF
 */

export const COLORS = {
  // Brand colors
  primary: '#2563eb',     // blue-600
  secondary: '#6366f1',   // indigo-500
  accent: '#f59e0b',      // amber-500
  
  // Status colors
  success: '#22c55e',     // green-500
  warning: '#f59e0b',     // amber-500
  error: '#ef4444',       // red-500
  info: '#3b82f6',        // blue-500
  
  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'},
  
  // PIAR comparison colors
  withPIAR: {
    main: '#9ca3af',      // gray-400
    light: '#f3f4f6',     // gray-100
    dark: '#6b7280'       // gray-500
  },
  withoutPIAR: {
    main: '#22c55e',      // green-500
    light: '#dcfce7',     // green-100
    dark: '#166534'       // green-800
  }
};

export const CHART_CONFIG = {
  // Tamaños
  sizes: {
    html: {
      height: 300,
      width: '100%',
      barThickness: 40
    },
    pdf: {
      height: 70,
      width: 170, // pageWidth - 40 (margins)
      barThickness: 15,
      spacing: 95
    }
  },
  
  // Fuentes
  fonts: {
    html: {
      family: 'system-ui, -apple-system, sans-serif',
      size: {
        title: 16,
        label: 12,
        value: 11
      }
    },
    pdf: {
      family: 'helvetica',
      size: {
        title: 12,
        label: 9,
        value: 8
      }
    }
  },
  
  // Animaciones (solo HTML)
  animations: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  
  // Leyendas
  legend: {
    position: 'top',
    labels: {
      withPIAR: 'Con PIAR',
      withoutPIAR: 'Sin PIAR'
    }
  },
  
  // Grid
  grid: {
    color: COLORS.gray[200],
    lineWidth: 1
  }
};

export const TABLE_CONFIG = {
  // Estilos de tabla
  styles: {
    header: {
      fillColor: COLORS.primary,
      textColor: '#ffffff',
      fontStyle: 'bold',
      fontSize: 10
    },
    body: {
      fontSize: 9,
      textColor: COLORS.gray[800]
    },
    alternateRow: {
      fillColor: COLORS.gray[50]
    }
  },
  
  // Ancho de columnas (PDF)
  columnWidths: {
    position: 15,
    name: 40,
    lastName: 40,
    grade: 25,
    score: 25
  },
  
  // Límites
  maxRowsPerPage: {
    html: Infinity,
    pdf: 30
  }
};

export const LAYOUT_CONFIG = {
  // Márgenes
  margins: {
    html: {
      x: 20,
      y: 20
    },
    pdf: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  },
  
  // Espaciado
  spacing: {
    sectionGap: 30,
    elementGap: 15,
    paragraphGap: 10
  },
  
  // Grid
  grid: {
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1
    }
  }
};

export const BRANDING = {
  name: 'ediprofe.com',
  url: 'https://ediprofe.com',
  social: {
    youtube: 'https://www.youtube.com/@ProfeEdi',
    tiktok: 'https://www.tiktok.com/@ediprofe',
    web: 'https://ediprofe.com'
  },
  colors: {
    primary: COLORS.primary,
    text: COLORS.gray[700]
  }
};

// Helper functions
export const getColorForArea = (areaId) => {
  const area = ACADEMIC_AREAS.find(a => a.id === areaId);
  return area ? area.color : COLORS.gray[500];
};

export const getChartConfig = (format) => {
  return {
    ...CHART_CONFIG,
    ...CHART_CONFIG.sizes[format],
    ...CHART_CONFIG.fonts[format]
  };
};

1.2 CREAR MODELO DE DATOSCrear /src/models/Analysis.js
/**
 * ✅ Clase para representar un análisis de un año
 * Encapsula datos + metadatos + cálculos
 */

import { calculateAreaMetrics, calculateGradeMetrics, calculateGlobalMetrics } from '../utils/calculations';

export class Analysis {
  constructor(year, rawData) {
    this.year = year;
    this.rawData = rawData;
    this.processedData = this.processRawData(rawData);
    this.metadata = this.generateMetadata();
    this.filters = {
      excludePIAR: false,
      selectedGrade: 'Todos',
      minScore: 0,
      maxScore: 500
    };
    this._calculationCache = new Map();
  }
  
  /**
   * Procesa y limpia los datos crudos
   */
  processRawData(rawData) {
    // Validar y limpiar datos
    return rawData.map(student => ({
      ...student,
      nombreCompleto: `${student.Nombre} ${student.Apellido}`.trim(),
      year: this.year
    }));
  }
  
  /**
   * Genera metadata del análisis
   */
  generateMetadata() {
    return {
      totalStudents: this.rawData.length,
      studentsWithPIAR: this.rawData.filter(s => s['¿PIAR?'] === 'Sí').length,
      studentsWithoutPIAR: this.rawData.filter(s => s['¿PIAR?'] !== 'Sí').length,
      grades: [...new Set(this.rawData.map(s => s.Grupo))].sort(),
      loadedAt: new Date().toISOString(),
      year: this.year
    };
  }
  
  /**
   * Aplica filtros y retorna datos filtrados
   */
  getFilteredData() {
    const cacheKey = JSON.stringify(this.filters);
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    let filtered = this.processedData;
    
    if (this.filters.excludePIAR) {
      filtered = filtered.filter(s => s['¿PIAR?'] !== 'Sí');
    }
    
    if (this.filters.selectedGrade !== 'Todos') {
      filtered = filtered.filter(s => s.Grupo === this.filters.selectedGrade);
    }
    
    filtered = filtered.filter(s => 
      s.Global >= this.filters.minScore && 
      s.Global <= this.filters.maxScore
    );
    
    // Ordenar por puntaje global descendente
    filtered.sort((a, b) => b.Global - a.Global);
    
    this._calculationCache.set(cacheKey, filtered);
    return filtered;
  }
  
  /**
   * Actualiza filtros y limpia cache
   */
  updateFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this._calculationCache.clear();
  }
  
  /**
   * Obtiene métricas globales (con cache)
   */
  getGlobalMetrics(withPIAR = true) {
    const cacheKey = `global_${withPIAR}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const data = withPIAR 
      ? this.processedData 
      : this.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
    
    const metrics = calculateGlobalMetrics(data);
    this._calculationCache.set(cacheKey, metrics);
    
    return metrics;
  }
  
  /**
   * Obtiene métricas por área (con cache)
   */
  getAreaMetrics(withPIAR = true) {
    const cacheKey = `area_${withPIAR}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const data = withPIAR 
      ? this.processedData 
      : this.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
    
    const metrics = calculateAreaMetrics(data);
    this._calculationCache.set(cacheKey, metrics);
    
    return metrics;
  }
  
  /**
   * Obtiene métricas por grado (con cache)
   */
  getGradeMetrics(withPIAR = true) {
    const cacheKey = `grade_${withPIAR}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const data = withPIAR 
      ? this.processedData 
      : this.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
    
    const metrics = calculateGradeMetrics(data);
    this._calculationCache.set(cacheKey, metrics);
    
    return metrics;
  }
  
  /**
   * Limpia cache de cálculos
   */
  clearCache() {
    this._calculationCache.clear();
  }
  
  /**
   * Serializa para persistencia
   */
  toJSON() {
    return {
      year: this.year,
      rawData: this.rawData,
      filters: this.filters,
      metadata: this.metadata
    };
  }
  
  /**
   * Crea instancia desde JSON
   */
  static fromJSON(json) {
    const analysis = new Analysis(json.year, json.rawData);
    analysis.filters = json.filters;
    return analysis;
  }
}

Crear /src/models/MultiYearAnalysis.js
/**
 * ✅ Gestiona múltiples análisis y sus comparativas
 */

import { Analysis } from './Analysis';
import { compareYears, calculateTrend, getYearOverYearChange } from '../utils/calculations/comparative';

export class MultiYearAnalysis {
  constructor() {
    this.analyses = new Map(); // Map<year, Analysis>
    this.baseYear = null;
    this.comparisonYears = [];
  }
  
  /**
   * Agrega un análisis
   */
  addAnalysis(year, data) {
    if (this.analyses.has(year)) {
      throw new Error(`Ya existe un análisis para el año ${year}`);
    }
    
    const analysis = new Analysis(year, data);
    this.analyses.set(year, analysis);
    
    // Si es el primero o el más reciente, establecerlo como base
    if (!this.baseYear || year > this.baseYear) {
      this.baseYear = year;
    }
    
    return analysis;
  }
  
  /**
   * Elimina un análisis
   */
  removeAnalysis(year) {
    this.analyses.delete(year);
    
    // Si se eliminó el año base, seleccionar el más reciente
    if (this.baseYear === year) {
      const years = this.getAvailableYears();
      this.baseYear = years.length > 0 ? years[0] : null;
    }
    
    // Remover de años de comparación
    this.comparisonYears = this.comparisonYears.filter(y => y !== year);
  }
  
  /**
   * Obtiene análisis base
   */
  getBaseAnalysis() {
    return this.analyses.get(this.baseYear);
  }
  
  /**
   * Obtiene análisis por año
   */
  getAnalysis(year) {
    return this.analyses.get(year);
  }
  
  /**
   * Obtiene análisis de comparación
   */
  getComparisonAnalyses() {
    return this.comparisonYears
      .map(year => this.analyses.get(year))
      .filter(a => a !== undefined);
  }
  
  /**
   * Obtiene años disponibles (ordenados descendente)
   */
  getAvailableYears() {
    return Array.from(this.analyses.keys()).sort((a, b) => b - a);
  }
  
  /**
   * Establece año base
   */
  setBaseYear(year) {
    if (!this.analyses.has(year)) {
      throw new Error(`No existe análisis para el año ${year}`);
    }
    this.baseYear = year;
  }
  
  /**
   * Agrega año a comparación
   */
  addComparisonYear(year) {
    if (!this.analyses.has(year)) {
      throw new Error(`No existe análisis para el año ${year}`);
    }
    
    if (year === this.baseYear) {
      throw new Error('No puedes comparar el año base consigo mismo');
    }
    
    if (!this.comparisonYears.includes(year)) {
      this.comparisonYears.push(year);
      this.comparisonYears.sort((a, b) => b - a);
    }
  }
  
  /**
   * Remueve año de comparación
   */
  removeComparisonYear(year) {
    this.comparisonYears = this.comparisonYears.filter(y => y !== year);
  }
  
  /**
   * Toggle año en comparación
   */
  toggleComparisonYear(year) {
    if (this.comparisonYears.includes(year)) {
      this.removeComparisonYear(year);
    } else {
      this.addComparisonYear(year);
    }
  }
  
  /**
   * Obtiene métricas comparativas para una métrica específica
   */
  getComparativeMetrics(metricName, includeBase = true) {
    const years = includeBase 
      ? [this.baseYear, ...this.comparisonYears]
      : this.comparisonYears;
    
    const analyses = years
      .map(year => this.analyses.get(year))
      .filter(a => a !== undefined);
    
    return compareYears(analyses, metricName);
  }
  
  /**
   * Obtiene tendencia de una métrica a través de los años
   */
  getTrend(metricName) {
    const years = [this.baseYear, ...this.comparisonYears].sort();
    const analyses = years
      .map(year => this.analyses.get(year))
      .filter(a => a !== undefined);
    
    return calculateTrend(analyses, metricName);
  }
  
  /**
   * Obtiene cambio año sobre año
   */
  getYearOverYearChange(metricName) {
    const baseAnalysis = this.getBaseAnalysis();
    const comparisonAnalyses = this.getComparisonAnalyses();
    
    return getYearOverYearChange(baseAnalysis, comparisonAnalyses, metricName);
  }
  
  /**
   * Valida compatibilidad entre años
   */
  validateCompatibility() {
    if (this.analyses.size < 2) return true;
    
    const analyses = Array.from(this.analyses.values());
    const firstAnalysis = analyses[0];
    
    // Verificar que todos tengan las mismas áreas académicas
    for (let i = 1; i < analyses.length; i++) {
      // Aquí iría la lógica de validación
      // Por ahora, asumimos compatibilidad
    }
    
    return true;
  }
  
  /**
   * Serializa para persistencia
   */
  toJSON() {
    return {
      baseYear: this.baseYear,
      comparisonYears: this.comparisonYears,
      analyses: Array.from(this.analyses.entries()).map(([year, analysis]) => ({
        year,
        data: analysis.toJSON()
      }))
    };
  }
  
  /**
   * Crea instancia desde JSON
   */
  static fromJSON(json) {
    const multiYear = new MultiYearAnalysis();
    multiYear.baseYear = json.baseYear;
    multiYear.comparisonYears = json.comparisonYears;
    
    json.analyses.forEach(({ year, data }) => {
      const analysis = Analysis.fromJSON(data);
      multiYear.analyses.set(year, analysis);
    });
    
    return multiYear;
  }
}

1.3 IMPLEMENTAR ZUSTAND STORE
Instalar dependencias
npm install zustand immer

Crear /src/stores/analysisStore.js
/**
 * ✅ Store principal usando Zustand
 * Gestiona múltiples análisis, año activo, modo comparativo
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MultiYearAnalysis } from '../models/MultiYearAnalysis';
import { parseExcel } from '../utils/excelParser';

export const useAnalysisStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // ============ STATE ============
        multiYearAnalysis: new MultiYearAnalysis(),
        comparisonMode: false,
        loading: false,
        error: null,
        
        // ============ COMPUTED/SELECTORS ============
        
        /**
         * Obtiene el análisis activo (año base)
         */
        getActiveAnalysis: () => {
          return get().multiYearAnalysis.getBaseAnalysis();
        },
        
        /**
         * Obtiene años disponibles
         */
        getAvailableYears: () => {
          return get().multiYearAnalysis.getAvailableYears();
        },
        
        /**
         * Obtiene año base actual
         */
        getBaseYear: () => {
          return get().multiYearAnalysis.baseYear;
        },
        
        /**
         * Obtiene años seleccionados para comparación
         */
        getComparisonYears: () => {
          return get().multiYearAnalysis.comparisonYears;
        },
        
        /**
         * Obtiene análisis de comparación
         */
        getComparisonAnalyses: () => {
          return get().multiYearAnalysis.getComparisonAnalyses();
        },
        
        /**
         * Verifica si hay datos cargados
         */
        hasData: () => {
          return get().multiYearAnalysis.analyses.size > 0;
        },
        
        /**
         * Verifica si un año específico está cargado
         */
        isYearLoaded: (year) => {
          return get().multiYearAnalysis.analyses.has(year);
        },
        
        // ============ ACTIONS ============
        
        /**
         * Carga el primer año (año base)
         */
        loadBaseYear: async (file) => {
          set({ loading: true, error: null });
          
          try {
            const { year, data } = await parseExcel(file);
            
            // Validar que no esté ya cargado
            if (get().isYearLoaded(year)) {
              throw new Error(`El año ${year} ya está cargado`);
            }
            
            set((state) => {
              state.multiYearAnalysis.addAnalysis(year, data);
              state.loading = false;
            });
            
            return { success: true, year };
          } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
          }
        },
        
        /**
         * Carga un año adicional para comparación
         */
        loadComparisonYear: async (file) => {
          set({ loading: true, error: null });
          
          try {
            const { year, data } = await parseExcel(file);
            
            // Validar que no esté ya cargado
            if (get().isYearLoaded(year)) {
              throw new Error(`El año ${year} ya está cargado`);
            }
            
            set((state) => {
              state.multiYearAnalysis.addAnalysis(year, data);
              // Automáticamente agregar a comparación
              state.multiYearAnalysis.addComparisonYear(year);
              state.loading = false;
            });
            
            return { success: true, year };
          } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
          }
        },
        
        /**
         * Activa modo comparativo
         */
        enableComparisonMode: () => {
          set({ comparisonMode: true });
        },
        
        /**
         * Desactiva modo comparativo
         */
        disableComparisonMode: () => {
          set({ comparisonMode: false });
        },
        
        /**
         * Cambia el año base
         */
        setBaseYear: (year) => {
          try {
            set((state) => {
              state.multiYearAnalysis.setBaseYear(year);
            });
          } catch (error) {
            set({ error: error.message });
          }
        },
        
        /**
         * Toggle año en comparación
         */
        toggleYearInComparison: (year) => {
          try {
            set((state) => {
              state.multiYearAnalysis.toggleComparisonYear(year);
            });
          } catch (error) {
            set({ error: error.message });
          }
        },
        
        /**
         * Actualiza filtros de un análisis específico
         */
        updateFilters: (year, filters) => {
          const analysis = get().multiYearAnalysis.getAnalysis(year);
          if (analysis) {
            analysis.updateFilters(filters);
            // Forzar re-render
            set((state) => {
              state.multiYearAnalysis = { ...state.multiYearAnalysis };
            });
          }
        },
        
        /**
         * Elimina un año
         */
        removeYear: (year) => {
          set((state) => {
            state.multiYearAnalysis.removeAnalysis(year);
          });
        },
        
        /**
         * Limpia el error
         */
        clearError: () => {
          set({ error: null });
        },
        
        /**
         * Reset completo
         */
        reset: () => {
          set({
            multiYearAnalysis: new MultiYearAnalysis(),
            comparisonMode: false,
            loading: false,
            error: null
          });
        }
        
      })),
      {
        name: 'icfes-analysis-storage',
        partialize: (state) => ({
          // Solo persistir datos importantes
          multiYearAnalysis: state.multiYearAnalysis.toJSON(),
          comparisonMode: state.comparisonMode
        }),
        onRehydrateStorage: () => (state) => {
          // Reconstruir instancias desde JSON al cargar
          if (state && state.multiYearAnalysis) {
            state.multiYearAnalysis = MultiYearAnalysis.fromJSON(
              state.multiYearAnalysis
            );
          }
        }
      }
    ),
    { name: 'ICFES Analysis Store' }
  )
);

// Hooks personalizados para selectores comunes
export const useActiveAnalysis = () => 
  useAnalysisStore(state => state.getActiveAnalysis());

export const useAvailableYears = () => 
  useAnalysisStore(state => state.getAvailableYears());

export const useComparisonMode = () => 
  useAnalysisStore(state => state.comparisonMode);

export const useHasData = () => 
  useAnalysisStore(state => state.hasData());

1.4 DIVIDIR calculations.js EN MÓDULOS
Crear /src/utils/calculations/basic.js
/**
 * ✅ Funciones matemáticas básicas (puras)
 */

/**
 * Calcula el promedio de un array
 * Filtra valores null, undefined y NaN automáticamente
 */
export const mean = (values) => {
  const nums = values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  );
  
  return nums.length > 0 
    ? nums.reduce((a, b) => a + b, 0) / nums.length 
    : 0;
};

/**
 * Calcula la desviación estándar muestral (n-1)
 * Compatible con Excel DESVEST.M
 */
export const stdDev = (values) => {
  const nums = values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  );
  
  if (nums.length <= 1) return 0;
  
  const avg = mean(values);
  const squareDiffs = nums.map(v => Math.pow(v - avg, 2));
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / (nums.length - 1);
  
  return Math.sqrt(variance);
};

/**
 * Calcula la mediana
 */
export const median = (values) => {
  const nums = values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  ).sort((a, b) => a - b);
  
  if (nums.length === 0) return 0;
  
  const mid = Math.floor(nums.length / 2);
  
  return nums.length % 2 === 0
    ? (nums[mid - 1] + nums[mid]) / 2
    : nums[mid];
};

/**
 * Calcula la moda
 */
export const mode = (values) => {
  const nums = values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  );
  
  if (nums.length === 0) return null;
  
  const frequency = {};
  let maxFreq = 0;
  let modes = [];
  
  nums.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
      modes = [num];
    } else if (frequency[num] === maxFreq) {
      modes.push(num);
    }
  });
  
  return modes.length === nums.length ? null : modes[0];
};

/**
 * Encuentra el valor mínimo
 */
export const min = (values) => {
  const nums = values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  );
  
  return nums.length > 0 ? Math.min(...nums) : null;
};

/**
 * Encuentra el valor máximo
 */
export const max = (values) => {
  const nums = values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  );
  
  return nums.length > 0 ? Math.max(...nums) : null;
};

/**
 * Suma de valores
 */
export const sum = (values) => {
  const nums = values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  );
  
  return nums.reduce((a, b) => a + b, 0);
};

/**
 * Cuenta valores válidos
 */
export const count = (values) => {
  return values.filter(v => 
    v !== null && 
    v !== undefined && 
    typeof v === 'number' && 
    !isNaN(v)
  ).length;
};

Crear /src/utils/calculations/statistical.js
/**
 * ✅ Funciones estadísticas avanzadas
 */

import { mean, stdDev } from './basic';
import { METRIC_LIMITS } from '../../config/metricsConfig';

/**
 * Calcula el Z-score de un valor
 */
export const zScore = (value, avg, sd) => {
  if (sd === 0) return 0;
  return (value - avg) / sd;
};

/**
 * Encuentra valores atípicos (outliers) usando ±3σ
 * @param {Array} data - Array de estudiantes
 * @param {boolean} excludePIAR - Si se deben excluir estudiantes con PIAR del cálculo base
 * @returns {Array} Array de estudiantes outliers con sus z-scores
 */
export const findOutliers = (data, excludePIAR = true) => {
  // Filtrar datos base para cálculo (sin PIAR si se especifica)
  const baseData = excludePIAR
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;
  
  const validStudents = baseData.filter(s => 
    s.Global !== null && 
    s.Global !== undefined && 
    !isNaN(s.Global)
  );
  
  if (validStudents.length === 0) return [];
  
  const globals = validStudents.map(s => s.Global);
  const avg = mean(globals);
  const sd = stdDev(globals);
  
  const threshold = METRIC_LIMITS.OUTLIER_THRESHOLD_SIGMA;
  
  // Buscar outliers en todos los estudiantes (incluyendo PIAR)
  return data
    .filter(student => 
      student.Global !== null && 
      student.Global !== undefined && 
      !isNaN(student.Global)
    )
    .map(student => ({
      ...student,
      zScore: zScore(student.Global, avg, sd),
      category: zScore(student.Global, avg, sd) >= threshold
        ? 'Sobresaliente'
        : zScore(student.Global, avg, sd) <= -threshold
        ? 'Bajo rendimiento'
        : 'Normal'
    }))
    .filter(student => Math.abs(student.zScore) >= threshold);
};

/**
 * Calcula percentil usando el método Hazen
 * @param {number} value - Valor para el cual calcular el percentil
 * @param {Array} sortedArray - Array ordenado de valores
 * @returns {number|null} Percentil o null
*/
export const calculatePercentile = (value, sortedArray) => {
  if (value === null || value === undefined || isNaN(value) || sortedArray.length === 0) {
    return null;
  }
  
  const n = sortedArray.length;
  const rank = sortedArray.filter(v => v < value).length + 1;
  
  return ((rank - METRIC_LIMITS.HAZEN_CONSTANT) / n) * 100;
};

/**
 * Calcula todos los percentiles para un conjunto de datos
 * @param {Array} data - Array de estudiantes
 * @param {string} field - Campo para calcular percentil
 * @returns {Array} Array de estudiantes con percentiles agregados
 */
export const calculateAllPercentiles = (data, field) => {
  const validValues = data
    .map(s => s[field])
    .filter(v => v !== null && v !== undefined && !isNaN(v))
    .sort((a, b) => a - b);
  
  if (validValues.length === 0) return data;
  
  return data.map(student => {
    const value = student[field];
    const percentile = calculatePercentile(value, validValues);
    
    return {
      ...student,
      [`Percentil_${field}`]: percentile
    };
  });
};

/**
 * Identifica estudiantes con desempeño excepcional
 * @param {Array} data - Array de estudiantes
 * @param {number} threshold - Umbral de z-score (por defecto 2)
 * @returns {Object} Objeto con excepcionales positivos y negativos
 */
export const findExceptionalPerformance = (data, threshold = 2) => {
  const validStudents = data.filter(s => 
    s.Global !== null && 
    s.Global !== undefined && 
    !isNaN(s.Global)
  );
  
  if (validStudents.length === 0) {
    return { positive: [], negative: [] };
  }
  
  const globals = validStudents.map(s => s.Global);
  const avg = mean(globals);
  const sd = stdDev(globals);
  
  const withZScores = validStudents.map(student => ({
    ...student,
    zScore: zScore(student.Global, avg, sd)
  }));
  
  return {
    positive: withZScores.filter(s => s.zScore >= threshold),
    negative: withZScores.filter(s => s.zScore <= -threshold)
  };
};

/**
 * Calcula distribución por rangos
 * @param {Array} values - Array de valores
 * @param {Array} ranges - Array de rangos [{min, max, label}]
 * @returns {Object} Objeto con conteo por rango
 */
export const calculateDistribution = (values, ranges) => {
  const validValues = values.filter(v => 
    v !== null && 
    v !== undefined && 
    !isNaN(v)
  );
  
  const distribution = {};
  
  ranges.forEach(range => {
    distribution[range.label] = validValues.filter(v => 
      v >= range.min && v <= range.max
    ).length;
  });
  
  return distribution;
};

Crear /src/utils/calculations/metrics.js
/**
 * ✅ Métricas de alto nivel (globales, por área, por grado)
 */

import { mean, stdDev, count } from './basic';
import { findOutliers, findExceptionalPerformance } from './statistical';
import { ACADEMIC_AREAS } from '../../config/columnConfig';

/**
 * Calcula métricas globales
 */
export const calculateGlobalMetrics = (data, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;
  
  const globals = filtered
    .map(s => s.Global)
    .filter(v => v !== null && v !== undefined && !isNaN(v));
  
  const outliers = findOutliers(data, excludePIAR);
  const exceptional = findExceptionalPerformance(filtered);
  
  return {
    promedio: mean(globals),
    desviacion: stdDev(globals),
    totalEstudiantes: filtered.length,
    estudiantesValidos: globals.length,
    outliers: outliers.length,
    excepcionalPositivo: exceptional.positive.length,
    excepcionalNegativo: exceptional.negative.length,
    conPIAR: !excludePIAR ? data.filter(s => s['¿PIAR?'] === 'Sí').length : 0,
    sinPIAR: data.filter(s => s['¿PIAR?'] !== 'Sí').length
  };
};

/**
 * Calcula métricas por área
 */
export const calculateAreaMetrics = (data, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;
  
  return ACADEMIC_AREAS.map(area => {
    const values = filtered
      .map(s => s[area.columnName])
      .filter(v => v !== null && v !== undefined && !isNaN(v));
    
    const percentileValues = filtered
      .map(s => s[area.percentileColumn])
      .filter(v => v !== null && v !== undefined && !isNaN(v));
    
    return {
      id: area.id,
      area: area.name,
      shortName: area.shortName,
      promedio: values.length > 0 ? mean(values).toFixed(2) : 'N/A',
      desviacion: values.length > 0 ? stdDev(values).toFixed(2) : 'N/A',
      percentil: percentileValues.length > 0 
        ? mean(percentileValues).toFixed(1) 
        : 'N/A',
      cantidadDatos: values.length,
      color: area.color,
      icon: area.icon
    };
  });
};

/**
 * Calcula métricas por grado
 */
export const calculateGradeMetrics = (data, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;
  
  // Obtener grados únicos
  const grades = [...new Set(filtered.map(s => s.Grupo))].sort();
  
  return grades.map(grade => {
    const gradeStudents = filtered.filter(s => s.Grupo === grade);
    
    const globals = gradeStudents
      .map(s => s.Global)
      .filter(v => v !== null && v !== undefined && !isNaN(v));
    
    // Métricas por área para este grado
    const areaMetrics = ACADEMIC_AREAS.map(area => {
      const values = gradeStudents
        .map(s => s[area.columnName])
        .filter(v => v !== null && v !== undefined && !isNaN(v));
      
      return {
        area: area.name,
        promedio: values.length > 0 ? mean(values).toFixed(2) : 'N/A',
        desviacion: values.length > 0 ? stdDev(values).toFixed(2) : 'N/A'
      };
    });
    
    return {
      grado: grade,
      promedioGlobal: mean(globals).toFixed(2),
      desviacionGlobal: stdDev(globals).toFixed(2),
      totalEstudiantes: gradeStudents.length,
      areaMetrics
    };
  });
};

/**
 * Obtiene Top N estudiantes por área
 */
export const getTopByArea = (data, area, n = 5, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;
  
  const areaConfig = ACADEMIC_AREAS.find(a => a.id === area || a.name === area);
  if (!areaConfig) return [];
  
  return filtered
    .filter(s => 
      s[areaConfig.columnName] !== null && 
      s[areaConfig.columnName] !== undefined &&
      !isNaN(s[areaConfig.columnName])
    )
    .map(s => ({
      nombre: s.Nombre,
      apellido: s.Apellido,
      nombreCompleto: s.nombreCompleto || `${s.Nombre} ${s.Apellido}`,
      grado: s.Grupo,
      puntaje: s[areaConfig.columnName]
    }))
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, n);
};

/**
 * Obtiene Top N estudiantes por grado
 */
export const getTopByGrade = (data, grade, n = 3, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;
  
  return filtered
    .filter(s => s.Grupo === grade)
    .filter(s => 
      s.Global !== null && 
      s.Global !== undefined &&
      !isNaN(s.Global)
    )
    .map(s => ({
      nombre: s.Nombre,
      apellido: s.Apellido,
      nombreCompleto: s.nombreCompleto || `${s.Nombre} ${s.Apellido}`,
      grado: s.Grupo,
      global: s.Global
    }))
    .sort((a, b) => b.global - a.global)
    .slice(0, n);
};

/**
 * Obtiene todos los Top por grado
 */
export const getAllTopByGrade = (data, n = 3, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí')
    : data;
  
  const grades = [...new Set(filtered.map(s => s.Grupo))].sort();
  
  return grades.map(grade => ({
    grado: grade,
    top: getTopByGrade(data, grade, n, excludePIAR)
  }));
};

Crear /src/utils/calculations/comparative.js
/**
 * ✅ Funciones específicas para comparativas multi-año
 */

import { mean, stdDev } from './basic';
import { calculateGlobalMetrics, calculateAreaMetrics, calculateGradeMetrics } from './metrics';

/**
 * Compara una métrica específica entre múltiples años
 * @param {Array} analyses - Array de Analysis objects
 * @param {string} metricName - Nombre de la métrica a comparar
 * @returns {Array} Array con datos comparativos
 */
export const compareYears = (analyses, metricName) => {
  return analyses.map(analysis => {
    const year = analysis.year;
    const data = analysis.processedData;
    
    let metricValue;
    
    switch (metricName) {
      case 'promedioGlobal':
        const globals = data.map(s => s.Global).filter(v => v != null && !isNaN(v));
        metricValue = mean(globals);
        break;
        
      case 'desviacionGlobal':
        const globalsStd = data.map(s => s.Global).filter(v => v != null && !isNaN(v));
        metricValue = stdDev(globalsStd);
        break;
        
      case 'totalEstudiantes':
        metricValue = data.length;
        break;
        
      case 'estudiantesSinPIAR':
        metricValue = data.filter(s => s['¿PIAR?'] !== 'Sí').length;
        break;
        
      default:
        metricValue = null;
    }
    
    return {
      year,
      value: metricValue
    };
  }).sort((a, b) => a.year - b.year);
};

/**
 * Calcula tendencia de una métrica a través de años
 * @param {Array} analyses - Array de Analysis objects (ordenados por año)
 * @param {string} metricName - Nombre de la métrica
 * @returns {Object} Tendencia con slope, dirección y datos
 */
export const calculateTrend = (analyses, metricName) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  const comparison = compareYears(sortedAnalyses, metricName);
  
  if (comparison.length < 2) {
    return {
      direction: 'insufficient_data',
      slope: 0,
      data: comparison
    };
  }
  
  // Regresión lineal simple
  const n = comparison.length;
  const sumX = comparison.reduce((sum, d, i) => sum + i, 0);
  const sumY = comparison.reduce((sum, d) => sum + d.value, 0);
  const sumXY = comparison.reduce((sum, d, i) => sum + (i * d.value), 0);
  const sumX2 = comparison.reduce((sum, d, i) => sum + (i * i), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  return {
    direction: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable',
    slope,
    data: comparison,
    prediction: comparison[comparison.length - 1].value + slope
  };
};

/**
 * Calcula cambio año sobre año
 * @param {Analysis} baseAnalysis - Análisis del año base
 * @param {Array} comparisonAnalyses - Array de análisis para comparar
 * @param {string} metricName - Nombre de la métrica
 * @returns {Array} Array con cambios porcentuales
 */
export const getYearOverYearChange = (baseAnalysis, comparisonAnalyses, metricName) => {
  const allAnalyses = [baseAnalysis, ...comparisonAnalyses];
  const comparison = compareYears(allAnalyses, metricName);
  
  return comparison.map((current, index) => {
    if (index === 0) {
      return {
        ...current,
        change: null,
        changePercent: null
      };
    }
    
    const previous = comparison[index - 1];
    const change = current.value - previous.value;
    const changePercent = previous.value !== 0 
      ? (change / previous.value) * 100 
      : null;
    
    return {
      ...current,
      change,
      changePercent,
      previousYear: previous.year,
      previousValue: previous.value
    };
  });
};

/**
 * Compara métricas por área entre años
 * @param {Array} analyses - Array de Analysis objects
 * @returns {Object} Objeto con comparaciones por área
 */
export const compareAreaMetricsAcrossYears = (analyses) => {
  const results = {};
  
  analyses.forEach(analysis => {
    const areaMetrics = calculateAreaMetrics(analysis.processedData, true);
    
    areaMetrics.forEach(metric => {
      if (!results[metric.area]) {
        results[metric.area] = [];
      }
      
      results[metric.area].push({
        year: analysis.year,
        promedio: parseFloat(metric.promedio) || 0,
        desviacion: parseFloat(metric.desviacion) || 0
      });
    });
  });
  
  // Ordenar por año
  Object.keys(results).forEach(area => {
    results[area].sort((a, b) => a.year - b.year);
  });
  
  return results;
};

/**
 * Compara métricas por grado entre años
 * @param {Array} analyses - Array de Analysis objects
 * @returns {Object} Objeto con comparaciones por grado
 */
export const compareGradeMetricsAcrossYears = (analyses) => {
  const results = {};
  
  analyses.forEach(analysis => {
    const gradeMetrics = calculateGradeMetrics(analysis.processedData, true);
    
    gradeMetrics.forEach(metric => {
      if (!results[metric.grado]) {
        results[metric.grado] = [];
      }
      
      results[metric.grado].push({
        year: analysis.year,
        promedioGlobal: parseFloat(metric.promedioGlobal) || 0,
        desviacionGlobal: parseFloat(metric.desviacionGlobal) || 0,
        totalEstudiantes: metric.totalEstudiantes
      });
    });
  });
  
  // Ordenar por año
  Object.keys(results).forEach(grade => {
    results[grade].sort((a, b) => a.year - b.year);
  });
  
  return results;
};

/**
 * Identifica mejores y peores evoluciones
 * @param {Array} analyses - Array de Analysis objects
 * @param {string} metric - 'area' o 'grade'
 * @returns {Object} Objeto con mejores y peores evoluciones
 */
export const identifyBestAndWorstEvolution = (analyses, metric = 'area') => {
  const comparisons = metric === 'area'
    ? compareAreaMetricsAcrossYears(analyses)
    : compareGradeMetricsAcrossYears(analyses);
  
  const evolutions = Object.keys(comparisons).map(key => {
    const data = comparisons[key];
    
    if (data.length < 2) {
      return { key, change: 0, insufficient: true };
    }
    
    const first = data[0].promedio || data[0].promedioGlobal;
    const last = data[data.length - 1].promedio || data[data.length - 1].promedioGlobal;
    const change = last - first;
    const changePercent = first !== 0 ? (change / first) * 100 : 0;
    
    return {
      key,
      change,
      changePercent,
      firstValue: first,
      lastValue: last,
      data
    };
  }).filter(e => !e.insufficient);
  
  evolutions.sort((a, b) => b.changePercent - a.changePercent);
  
  return {
    best: evolutions.slice(0, 3),
    worst: evolutions.slice(-3).reverse()
  };
};

Crear /src/utils/calculations/index.js
/**
 * ✅ Exporta todas las funciones de cálculo de forma organizada
 */

// Funciones básicas
export {
  mean,
  stdDev,
  median,
  mode,
  min,
  max,
  sum,
  count
} from './basic';

// Funciones estadísticas
export {
  zScore,
  findOutliers,
  calculatePercentile,
  calculateAllPercentiles,
  findExceptionalPerformance,
  calculateDistribution
} from './statistical';

// Métricas
export {
  calculateGlobalMetrics,
  calculateAreaMetrics,
  calculateGradeMetrics,
  getTopByArea,
  getTopByGrade,
  getAllTopByGrade
} from './metrics';

// Comparativas (multi-año)
export {
  compareYears,
  calculateTrend,
  getYearOverYearChange,
  compareAreaMetricsAcrossYears,
  compareGradeMetricsAcrossYears,
  identifyBestAndWorstEvolution
} from './comparative';

🏗️ SPRINT 2: VALIDACIÓN Y ROBUSTEZ (Semana 3)2.1 SISTEMA DE VALIDACIÓN ROBUSTOCrear /src/utils/validation/schemaValidator.js

/**
 * ✅ Valida que el Excel cumpla con la configuración de columnas
 */

import { REQUIRED_COLUMNS, OPTIONAL_COLUMNS, getRequiredColumnNames } from '../../config/columnConfig';

/**
 * Valida la estructura de un archivo Excel
 * @param {Array} data - Datos parseados del Excel
 * @returns {Object} Resultado de validación
 */
export const validateExcelStructure = (data) => {
  const errors = [];
  const warnings = [];
  
  if (!data || data.length === 0) {
    errors.push('El archivo está vacío o no contiene datos válidos');
    return { valid: false, errors, warnings };
  }
  
  // Obtener columnas del archivo
  const fileColumns = Object.keys(data[0]);
  const requiredColumnNames = getRequiredColumnNames();
  
  // Validar columnas obligatorias
  const missingColumns = requiredColumnNames.filter(col => !fileColumns.includes(col));
  if (missingColumns.length > 0) {
    errors.push(`Faltan columnas obligatorias: ${missingColumns.join(', ')}`);
  }
  
  // Advertir sobre columnas extra
  const knownColumns = [
    ...REQUIRED_COLUMNS.map(c => c.name),
    ...OPTIONAL_COLUMNS.map(c => c.name)
  ];
  
  const extraColumns = fileColumns.filter(col => !knownColumns.includes(col));
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
 * @param {Array} data - Datos parseados del Excel
 * @returns {Object} Resultado de validación
 */
export const validateRowData = (data) => {
  const errors = [];
  const warnings = [];
  
  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 porque Excel empieza en 1 y hay header
    
    // Validar cada columna obligatoria
    REQUIRED_COLUMNS.forEach(columnConfig => {
      const value = row[columnConfig.name];
      
      // Verificar que no esté vacío
      if (value === null || value === undefined || value === '') {
        errors.push(
          `Fila ${rowNumber}: ${columnConfig.name} es obligatorio pero está vacío`
        );
        return;
      }
      
      // Validar tipo
      if (columnConfig.type === 'number') {
        if (isNaN(Number(value))) {
          errors.push(
            `Fila ${rowNumber}: ${columnConfig.name} debe ser un número (valor: "${value}")`
          );
          return;
        }
      }
      
      // Validar regla específica
      if (columnConfig.validation && !columnConfig.validation(value)) {
        errors.push(
          `Fila ${rowNumber}: ${columnConfig.errorMessage || 'Valor inválido en ' + columnConfig.name}`
        );
      }
    });
    
    // Validar columnas opcionales si están presentes
    OPTIONAL_COLUMNS.forEach(columnConfig => {
      const value = row[columnConfig.name];
      
      // Solo validar si tiene valor
      if (value !== null && value !== undefined && value !== '') {
        if (columnConfig.validation && !columnConfig.validation(value)) {
          warnings.push(
            `Fila ${rowNumber}: Valor inválido en columna opcional ${columnConfig.name}`
          );
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
 * @param {Array} data - Datos parseados del Excel
 * @returns {Object} Resultado completo de validación
 */
export const validateExcelComplete = (data) => {
  const structureValidation = validateExcelStructure(data);
  
  if (!structureValidation.valid) {
    return structureValidation;
  }
  
  const dataValidation = validateRowData(data);
  
  return {
    valid: structureValidation.valid && dataValidation.valid,
    errors: [...structureValidation.errors, ...dataValidation.errors],
    warnings: [...structureValidation.warnings, ...dataValidation.warnings],
    fileColumns: structureValidation.fileColumns,
    totalRows: data.length
  };
};

Crear /src/utils/validation/dataIntegrity.js
/**
 * ✅ Verifica integridad y consistencia de datos
 */

import { ACADEMIC_AREAS } from '../../config/columnConfig';

/**
 * Verifica que el puntaje global sea consistente con las áreas
 * @param {Array} data - Datos de estudiantes
 * @param {number} tolerance - Tolerancia de diferencia aceptable
 * @returns {Object} Resultado de validación
 */
export const validateGlobalScoreConsistency = (data, tolerance = 5) => {
  const errors = [];
  const warnings = [];
  
  data.forEach((student, index) => {
    const rowNumber = index + 2;
    
    // Sumar áreas
    const areaSum = ACADEMIC_AREAS.reduce((sum, area) => {
      const value = student[area.columnName];
      return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
    }, 0);
    
    const global = student.Global;
    
    if (global != null && !isNaN(global)) {
      const difference = Math.abs(global - areaSum);
      
      if (difference > tolerance) {
        warnings.push(
          `Fila ${rowNumber}: El puntaje global (${global}) difiere de la suma de áreas (${areaSum}) por ${difference.toFixed(2)} puntos`
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
 * Verifica que no haya valores negativos en puntajes
 * @param {Array} data - Datos de estudiantes
 * @returns {Object} Resultado de validación
 */
export const validateNoNegativeScores = (data) => {
  const errors = [];
  
  const numericColumns = [
    ...ACADEMIC_AREAS.map(a => a.columnName),
    'Global',
    ...ACADEMIC_AREAS.map(a => a.percentileColumn)
  ];
  
  data.forEach((student, index) => {
    const rowNumber = index + 2;
    
    numericColumns.forEach(column => {
      const value = student[column];
      
      if (value != null && !isNaN(value) && value < 0) {
        errors.push(
          `Fila ${rowNumber}: ${column} no puede ser negativo (valor: ${value})`
        );
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Verifica que los percentiles estén en rango válido
 * @param {Array} data - Datos de estudiantes
 * @returns {Object} Resultado de validación
 */
export const validatePercentileRange = (data) => {
  const errors = [];
  const warnings = [];
  
  data.forEach((student, index) => {
    const rowNumber = index + 2;
    
    ACADEMIC_AREAS.forEach(area => {
      const percentile = student[area.percentileColumn];
      
      if (percentile != null && !isNaN(percentile)) {
        if (percentile < 0 || percentile > 100) {
          errors.push(
            `Fila ${rowNumber}: ${area.percentileColumn} debe estar entre 0 y 100 (valor: ${percentile})`
          );
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
 * Verifica que PIAR solo tenga valores válidos
 * @param {Array} data - Datos de estudiantes
 * @returns {Object} Resultado de validación
 */
export const validatePIARValues = (data) => {
  const errors = [];
  const validValues = ['Sí', 'No', 'SI', 'NO', 'si', 'no'];
  
  data.forEach((student, index) => {
    const rowNumber = index + 2;
    const piar = student['¿PIAR?'];
    
    if (!validValues.includes(piar)) {
      errors.push(
        `Fila ${rowNumber}: ¿PIAR? debe ser "Sí" o "No" (valor: "${piar}")`
      );
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validación completa de integridad
 * @param {Array} data - Datos de estudiantes
 * @returns {Object} Resultado completo de validación
 */
export const validateDataIntegrity = (data) => {
  const results = [
    validateGlobalScoreConsistency(data),
    validateNoNegativeScores(data),
    validatePercentileRange(data),
    validatePIARValues(data)
  ];
  
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings || []);
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

Crear /src/utils/validation/multiYearValidator.js
/**
 * ✅ Valida compatibilidad entre análisis de diferentes años
 */

/**
 * Valida que un año no esté duplicado
 * @param {Map} existingAnalyses - Map de análisis existentes
 * @param {number} newYear - Año a validar
 * @returns {Object} Resultado de validación
 */
export const validateNoDuplicateYear = (existingAnalyses, newYear) => {
  if (existingAnalyses.has(newYear)) {
    return {
      valid: false,
      error: `El año ${newYear} ya está cargado. Por favor, elimínalo primero si deseas recargarlo.`
    };
  }
  
  return { valid: true };
};

/**
 * Valida que las estructuras de columnas sean compatibles
 * @param {Analysis} baseAnalysis - Análisis base
 * @param {Array} newData - Datos nuevos a validar
 * @returns {Object} Resultado de validación
 */
export const validateColumnCompatibility
= (baseAnalysis, newData) => {
  const warnings = [];
  
  if (!baseAnalysis || !newData || newData.length === 0) {
    return { valid: true, warnings };
  }
  
  const baseColumns = Object.keys(baseAnalysis.rawData[0]);
  const newColumns = Object.keys(newData[0]);
  
  // Verificar columnas faltantes en nuevo dataset
  const missingInNew = baseColumns.filter(col => !newColumns.includes(col));
  if (missingInNew.length > 0) {
    warnings.push(
      `El nuevo año no tiene las siguientes columnas presentes en el año base: ${missingInNew.join(', ')}`
    );
  }
  
  // Verificar columnas extras en nuevo dataset
  const extraInNew = newColumns.filter(col => !baseColumns.includes(col));
  if (extraInNew.length > 0) {
    warnings.push(
      `El nuevo año tiene columnas adicionales no presentes en el año base: ${extraInNew.join(', ')}`
    );
  }
  
  return {
    valid: true, // Solo warnings, no bloqueante
    warnings
  };
};

/**
 * Valida que el año sea válido y razonable
 * @param {number} year - Año a validar
 * @param {Map} existingAnalyses - Análisis existentes
 * @returns {Object} Resultado de validación
 */
export const validateYearRange = (year, existingAnalyses) => {
  const currentYear = new Date().getFullYear();
  const errors = [];
  const warnings = [];
  
  // Validar que sea un número válido
  if (isNaN(year) || !Number.isInteger(year)) {
    errors.push('El año debe ser un número entero válido');
    return { valid: false, errors, warnings };
  }
  
  // Validar rango razonable (2000 - año actual + 1)
  if (year < 2000 || year > currentYear + 1) {
    errors.push(`El año debe estar entre 2000 y ${currentYear + 1}`);
    return { valid: false, errors, warnings };
  }
  
  // Advertir si el año es muy antiguo comparado con otros
  if (existingAnalyses.size > 0) {
    const years = Array.from(existingAnalyses.keys());
    const newestYear = Math.max(...years);
    const oldestYear = Math.min(...years);
    
    const yearDiff = newestYear - year;
    
    if (yearDiff > 10) {
      warnings.push(
        `El año ${year} está a más de 10 años del año más reciente (${newestYear}). ` +
        `Las comparativas pueden no ser tan relevantes.`
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
 * Valida límite de años cargados
 * @param {Map} existingAnalyses - Análisis existentes
 * @param {number} maxYears - Máximo de años permitidos
 * @returns {Object} Resultado de validación
 */
export const validateMaxYearsLimit = (existingAnalyses, maxYears = 5) => {
  if (existingAnalyses.size >= maxYears) {
    return {
      valid: false,
      error: `Has alcanzado el límite de ${maxYears} años cargados. ` +
             `Por favor, elimina un año antes de cargar otro.`
    };
  }
  
  return { valid: true };
};

/**
 * Validación completa para multi-año
 * @param {Map} existingAnalyses - Análisis existentes
 * @param {number} newYear - Año nuevo
 * @param {Array} newData - Datos nuevos
 * @param {Analysis} baseAnalysis - Análisis base opcional
 * @returns {Object} Resultado completo
 */
export const validateMultiYear = (existingAnalyses, newYear, newData, baseAnalysis = null) => {
  const results = [
    validateNoDuplicateYear(existingAnalyses, newYear),
    validateYearRange(newYear, existingAnalyses),
    validateMaxYearsLimit(existingAnalyses)
  ];
  
  if (baseAnalysis) {
    results.push(validateColumnCompatibility(baseAnalysis, newData));
  }
  
  const allErrors = results.flatMap(r => r.error ? [r.error] : (r.errors || []));
  const allWarnings = results.flatMap(r => r.warnings || []);
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

2.2 MANEJO DE ERRORES PROFESIONALCrear /src/utils/errors/customErrors.js
/**
 * ✅ Errores personalizados para el sistema
 */

export class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.userMessage = message;
  }
}

export class DataIntegrityError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'DataIntegrityError';
    this.details = details;
    this.userMessage = 'Los datos del archivo tienen inconsistencias. ' + message;
  }
}

export class ExportError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ExportError';
    this.details = details;
    this.userMessage = 'Error al generar el informe. ' + message;
  }
}

export class ParseError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ParseError';
    this.details = details;
    this.userMessage = 'Error al leer el archivo Excel. ' + message;
  }
}

export class MultiYearError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'MultiYearError';
    this.details = details;
    this.userMessage = message;
  }
}

Crear /src/utils/errors/ErrorHandler.js
/**
 * ✅ Manejador centralizado de errores
 */

import { 
  ValidationError, 
  DataIntegrityError, 
  ExportError, 
  ParseError,
  MultiYearError
} from './customErrors';

export class ErrorHandler {
  /**
   * Maneja un error y retorna objeto estructurado
   * @param {Error} error - Error a manejar
   * @returns {Object} Objeto con información del error
   */
  static handle(error) {
    // Log para debugging (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.error('[ErrorHandler]', error);
    }
    
    // Determinar tipo de error
    let errorType = 'unknown';
    let userMessage = 'Ha ocurrido un error inesperado';
    let details = {};
    let severity = 'error'; // 'error', 'warning', 'info'
    
    if (error instanceof ValidationError) {
      errorType = 'validation';
      userMessage = error.userMessage;
      details = error.details;
      severity = 'error';
    } else if (error instanceof DataIntegrityError) {
      errorType = 'data_integrity';
      userMessage = error.userMessage;
      details = error.details;
      severity = 'warning';
    } else if (error instanceof ExportError) {
      errorType = 'export';
      userMessage = error.userMessage;
      details = error.details;
      severity = 'error';
    } else if (error instanceof ParseError) {
      errorType = 'parse';
      userMessage = error.userMessage;
      details = error.details;
      severity = 'error';
    } else if (error instanceof MultiYearError) {
      errorType = 'multi_year';
      userMessage = error.userMessage;
      details = error.details;
      severity = 'error';
    } else {
      // Error genérico
      userMessage = error.message || userMessage;
    }
    
    return {
      type: errorType,
      message: userMessage,
      details,
      severity,
      timestamp: new Date().toISOString(),
      stack: import.meta.env.DEV ? error.stack : undefined
    };
  }
  
  /**
   * Formatea un error para mostrar al usuario
   * @param {Error} error - Error a formatear
   * @returns {string} Mensaje formateado
   */
  static formatForUser(error) {
    const handled = this.handle(error);
    
    let message = handled.message;
    
    // Agregar detalles si existen
    if (handled.details.errors && handled.details.errors.length > 0) {
      message += '\n\nDetalles:\n' + handled.details.errors.slice(0, 5).join('\n');
      
      if (handled.details.errors.length > 5) {
        message += `\n... y ${handled.details.errors.length - 5} errores más`;
      }
    }
    
    if (handled.details.warnings && handled.details.warnings.length > 0) {
      message += '\n\nAdvertencias:\n' + handled.details.warnings.slice(0, 3).join('\n');
    }
    
    return message;
  }
  
  /**
   * Registra un error (para analytics o logging)
   * @param {Error} error - Error a registrar
   */
  static log(error) {
    const handled = this.handle(error);
    
    // Aquí podrías integrar con servicios de logging
    // como Sentry, LogRocket, etc.
    
    if (import.meta.env.DEV) {
      console.error('[Error Log]', handled);
    }
    
    // En producción, enviar a servicio de analytics
    // analytics.trackError(handled);
  }
}

Crear /src/components/ErrorBoundary.jsx
/**
 * ✅ Error Boundary para capturar errores de React
 */

import { Component } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { ErrorHandler } from '../utils/errors/ErrorHandler';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log del error
    ErrorHandler.log(error);
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };
  
  handleGoHome = () => {
    window.location.href = '/';
  };
  
  render() {
    if (this.state.hasError) {
      const handled = ErrorHandler.handle(this.state.error);
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            {/* Icono y título */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Algo salió mal
                </h1>
                <p className="text-gray-600 mt-1">
                  La aplicación encontró un error inesperado
                </p>
              </div>
            </div>
            
            {/* Mensaje de error */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium mb-2">
                {handled.message}
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-red-700 hover:text-red-800">
                    Detalles técnicos (modo desarrollo)
                  </summary>
                  <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            
            {/* Sugerencias */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 font-medium mb-2">
                💡 Sugerencias:
              </p>
              <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>Intenta recargar la página</li>
                <li>Verifica que tu archivo Excel esté correctamente formateado</li>
                <li>Si el problema persiste, contacta al soporte</li>
              </ul>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw size={20} />
                Intentar de nuevo
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Home size={20} />
                Ir al inicio
              </button>
            </div>
            
            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Desarrollado por{' '}
                
                  href="https://ediprofe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ediprofe.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

2.3 REFACTORIZAR excelParser.jsActualizar /src/utils/excelParser.js
/**
 * ✅ Parser de Excel refactorizado con validaciones robustas
 */

import * as XLSX from 'xlsx';
import { getRequiredColumnNames } from '../config/columnConfig';
import { validateExcelComplete } from './validation/schemaValidator';
import { validateDataIntegrity } from './validation/dataIntegrity';
import { ParseError } from './errors/customErrors';

/**
 * Parsea un archivo Excel y extrae datos validados
 * @param {File} file - Archivo Excel
 * @returns {Promise<{year: number, data: Array}>} Año y datos parseados
 */
export const parseExcel = async (file) => {
  try {
    // Leer archivo
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, {
      cellStyles: true,
      cellFormulas: true,
      cellDates: true,
      cellNF: true,
      sheetStubs: true
    });
    
    // Obtener primera hoja
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convertir a JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
      raw: false
    });
    
    if (rawData.length === 0) {
      throw new ParseError('El archivo Excel está vacío o no contiene datos válidos');
    }
    
    // Validar estructura
    const structureValidation = validateExcelComplete(rawData);
    if (!structureValidation.valid) {
      throw new ParseError(
        'El archivo Excel tiene errores de estructura',
        { errors: structureValidation.errors }
      );
    }
    
    // Limpiar y normalizar datos
    const cleanedData = cleanData(rawData);
    
    // Validar integridad
    const integrityValidation = validateDataIntegrity(cleanedData);
    if (!integrityValidation.valid) {
      // Lanzar warning pero no bloquear
      console.warn('[Excel Parser] Advertencias de integridad:', integrityValidation.warnings);
    }
    
    // Extraer año (debe ser consistente en todas las filas)
    const year = extractYear(cleanedData);
    
    return {
      year,
      data: cleanedData,
      warnings: [
        ...structureValidation.warnings,
        ...integrityValidation.warnings
      ]
    };
    
  } catch (error) {
    if (error instanceof ParseError) {
      throw error;
    }
    throw new ParseError(
      'Error al leer el archivo Excel: ' + error.message,
      { originalError: error }
    );
  }
};

/**
 * Limpia y normaliza los datos del Excel
 * @param {Array} rawData - Datos crudos del Excel
 * @returns {Array} Datos limpios
 */
const cleanData = (rawData) => {
  return rawData.map((row, index) => {
    const cleanRow = {};
    
    // Limpiar cada campo
    Object.keys(row).forEach(key => {
      let value = row[key];
      
      // Trim strings
      if (typeof value === 'string') {
        value = value.trim();
        
        // Normalizar PIAR
        if (key === '¿PIAR?') {
          value = ['SI', 'si', 'Sí', 'sí', 'Si'].includes(value) ? 'Sí' : 'No';
        }
      }
      
      // Convertir números
      if (typeof value === 'string' && !isNaN(value) && value !== '') {
        const numericColumns = [
          'Año',
          'Lectura crítica',
          'Matemáticas',
          'Sociales',
          'Naturales',
          'Inglés',
          'Global',
          'Percentil Lectura crítica',
          'Percentil Matemáticas',
          'Percentil Sociales',
          'Percentil Naturales',
          'Percentil Inglés',
          '% Acierto'
        ];
        
        if (numericColumns.includes(key)) {
          value = Number(value);
        }
      }
      
      // Convertir valores vacíos a null
      if (value === '' || value === undefined) {
        value = null;
      }
      
      cleanRow[key] = value;
    });
    
    // Validar que la fila no esté completamente vacía
    const hasData = Object.values(cleanRow).some(v => v !== null && v !== undefined && v !== '');
    
    return hasData ? cleanRow : null;
  }).filter(row => row !== null);
};

/**
 * Extrae y valida el año del dataset
 * @param {Array} data - Datos limpios
 * @returns {number} Año del análisis
 */
const extractYear = (data) => {
  if (!data || data.length === 0) {
    throw new ParseError('No hay datos para extraer el año');
  }
  
  // Obtener años únicos
  const years = [...new Set(data.map(row => row.Año).filter(y => y != null))];
  
  if (years.length === 0) {
    throw new ParseError('No se encontró la columna "Año" o está vacía');
  }
  
  if (years.length > 1) {
    throw new ParseError(
      `El archivo contiene datos de múltiples años: ${years.join(', ')}. ` +
      `Por favor, asegúrate de que todos los datos correspondan a un solo año.`
    );
  }
  
  const year = Number(years[0]);
  
  if (isNaN(year) || !Number.isInteger(year)) {
    throw new ParseError(`El año "${years[0]}" no es un número entero válido`);
  }
  
  const currentYear = new Date().getFullYear();
  if (year < 2000 || year > currentYear + 1) {
    throw new ParseError(
      `El año ${year} está fuera del rango válido (2000-${currentYear + 1})`
    );
  }
  
  return year;
};

/**
 * Obtiene información resumida del archivo sin parsearlo completamente
 * @param {File} file - Archivo Excel
 * @returns {Promise<Object>} Información básica
 */
export const getExcelInfo = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { bookSheets: true });
    
    return {
      fileName: file.name,
      fileSize: file.size,
      sheets: workbook.SheetNames,
      lastModified: new Date(file.lastModified)
    };
  } catch (error) {
    throw new ParseError('Error al leer información del archivo: ' + error.message);
  }
};

🏗️ SPRINT 3: REPORTS UNIFICADOS (Semana 4-5)OBJETIVO: Crear sistema de generación de informes modular con HTML y PDF sincronizados3.1 PREPARACIÓN DE DATOS PARA GRÁFICOSCrear /src/reports/charts/chartDataPreparation.js
/**
 * ✅ Prepara datos para gráficos (compartido entre HTML y PDF)
 */

import { ACADEMIC_AREAS } from '../../config/columnConfig';
import { calculateAreaMetrics, calculateGradeMetrics } from '../../utils/calculations';

/**
 * Prepara datos para gráficos de área
 * @param {Analysis} analysis - Análisis a procesar
 * @param {boolean} includePIAR - Incluir comparación con/sin PIAR
 * @returns {Object} Datos preparados para gráficos
 */
export const prepareAreaChartData = (analysis, includePIAR = true) => {
  const dataSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
  
  const metricsConPIAR = calculateAreaMetrics(analysis.processedData, false);
  const metricsSinPIAR = calculateAreaMetrics(dataSinPIAR, false);
  
  return {
    // Datos para gráfico de promedios
    promedios: ACADEMIC_AREAS.map((area, index) => ({
      area: area.shortName,
      areaCompleta: area.name,
      conPIAR: parseFloat(metricsConPIAR[index].promedio) || 0,
      sinPIAR: parseFloat(metricsSinPIAR[index].promedio) || 0,
      color: area.color
    })),
    
    // Datos para gráfico de desviación estándar
    desviacion: ACADEMIC_AREAS.map((area, index) => ({
      area: area.shortName,
      areaCompleta: area.name,
      conPIAR: parseFloat(metricsConPIAR[index].desviacion) || 0,
      sinPIAR: parseFloat(metricsSinPIAR[index].desviacion) || 0,
      color: area.color
    })),
    
    // Datos para gráfico de percentiles (si existen)
    percentiles: ACADEMIC_AREAS.map((area, index) => {
      const percentilConPIAR = metricsConPIAR[index].percentil;
      const percentilSinPIAR = metricsSinPIAR[index].percentil;
      
      return {
        area: area.shortName,
        areaCompleta: area.name,
        conPIAR: percentilConPIAR !== 'N/A' ? parseFloat(percentilConPIAR) : null,
        sinPIAR: percentilSinPIAR !== 'N/A' ? parseFloat(percentilSinPIAR) : null,
        color: area.color,
        hasData: percentilConPIAR !== 'N/A' || percentilSinPIAR !== 'N/A'
      };
    }).filter(d => d.hasData)
  };
};

/**
 * Prepara datos para gráficos de grado
 * @param {Analysis} analysis - Análisis a procesar
 * @param {boolean} includePIAR - Incluir comparación con/sin PIAR
 * @returns {Object} Datos preparados para gráficos
 */
export const prepareGradeChartData = (analysis, includePIAR = true) => {
  const dataSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
  
  const metricsConPIAR = calculateGradeMetrics(analysis.processedData, false);
  const metricsSinPIAR = calculateGradeMetrics(dataSinPIAR, false);
  
  return {
    // Datos para gráfico de promedios por grado
    promedios: metricsConPIAR.map((metric, index) => ({
      grado: metric.grado,
      conPIAR: parseFloat(metric.promedioGlobal) || 0,
      sinPIAR: parseFloat(metricsSinPIAR[index].promedioGlobal) || 0
    })),
    
    // Datos para gráfico de desviación por grado
    desviacion: metricsConPIAR.map((metric, index) => ({
      grado: metric.grado,
      conPIAR: parseFloat(metric.desviacionGlobal) || 0,
      sinPIAR: parseFloat(metricsSinPIAR[index].desviacionGlobal) || 0
    }))
  };
};

/**
 * Prepara datos para gráfico integrado (todas las áreas por grado)
 * @param {Analysis} analysis - Análisis a procesar
 * @param {boolean} excludePIAR - Excluir estudiantes con PIAR
 * @returns {Array} Datos preparados
 */
export const prepareIntegratedGradeAreaData = (analysis, excludePIAR = true) => {
  const data = excludePIAR
    ? analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
    : analysis.processedData;
  
  const metrics = calculateGradeMetrics(data, false);
  
  return metrics.map(gradeMetric => {
    const gradeData = { grado: gradeMetric.grado };
    
    gradeMetric.areaMetrics.forEach(areaMetric => {
      const area = ACADEMIC_AREAS.find(a => a.name === areaMetric.area);
      if (area) {
        gradeData[area.shortName] = parseFloat(areaMetric.promedio) || 0;
      }
    });
    
    return gradeData;
  });
};

/**
 * Prepara datos para comparativas multi-año
 * @param {Array} analyses - Array de Analysis objects
 * @param {string} metricType - 'promedio' | 'desviacion'
 * @returns {Object} Datos preparados para gráficos temporales
 */
export const prepareComparisonChartData = (analyses, metricType = 'promedio') => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  return {
    // Datos por área a través del tiempo
    areas: ACADEMIC_AREAS.map(area => {
      const seriesData = sortedAnalyses.map(analysis => {
        const dataSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
        const metrics = calculateAreaMetrics(dataSinPIAR, false);
        const areaMetric = metrics.find(m => m.area === area.name);
        
        const value = metricType === 'promedio'
          ? parseFloat(areaMetric.promedio) || 0
          : parseFloat(areaMetric.desviacion) || 0;
        
        return {
          year: analysis.year,
          value
        };
      });
      
      return {
        area: area.name,
        shortName: area.shortName,
        color: area.color,
        data: seriesData
      };
    }),
    
    // Datos globales a través del tiempo
    global: sortedAnalyses.map(analysis => {
      const dataSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
      const globals = dataSinPIAR.map(s => s.Global).filter(v => v != null && !isNaN(v));
      
      const value = metricType === 'promedio'
        ? globals.reduce((a, b) => a + b, 0) / globals.length
        : 0; // Calcular desviación si es necesario
      
      return {
        year: analysis.year,
        value
      };
    })
  };
};

NOTA IMPORTANTE PARA WINDSURF:
Este documento continúa con:
3.2 DIVIDIR pdfBuilder.js EN MÓDULOSCrear /src/reports/pdf/pdfCore.js
/**
 * ✅ Funciones core de jsPDF
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { COLORS, BRANDING } from '../../config/visualConfig';

/**
 * Inicializa un nuevo documento PDF
 * @returns {jsPDF} Instancia de jsPDF
 */
export const initPDF = () => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
};

/**
 * Obtiene dimensiones de página
 * @param {jsPDF} doc - Documento PDF
 * @returns {Object} Dimensiones
 */
export const getPageDimensions = (doc) => {
  return {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight()
  };
};

/**
 * Agrega una nueva página
 * @param {jsPDF} doc - Documento PDF
 */
export const addNewPage = (doc) => {
  doc.addPage();
};

/**
 * Dibuja header de sección
 * @param {jsPDF} doc - Documento PDF
 * @param {string} title - Título de la sección
 * @param {number} sectionNumber - Número de sección
 */
export const drawSectionHeader = (doc, title, sectionNumber) => {
  const pageWidth = getPageDimensions(doc).width;
  
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`${sectionNumber}. ${title}`, 14, 13);
  
  // Reset
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
};

/**
 * Dibuja footer en página
 * @param {jsPDF} doc - Documento PDF
 * @param {number} pageNumber - Número de página
 * @param {string} additionalInfo - Información adicional
 */
export const drawFooter = (doc, pageNumber, additionalInfo = '') => {
  const pageWidth = getPageDimensions(doc).width;
  const pageHeight = getPageDimensions(doc).height;
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  // Fecha y página
  const footerText = additionalInfo || new Date().toLocaleDateString('es-ES');
  doc.text(footerText, 14, pageHeight - 10);
  doc.text(`Página ${pageNumber}`, pageWidth - 30, pageHeight - 10);
  
  doc.setTextColor(0, 0, 0);
};

/**
 * Calcula posición Y disponible
 * @param {jsPDF} doc - Documento PDF
 * @param {number} currentY - Posición Y actual
 * @param {number} requiredSpace - Espacio requerido
 * @returns {number} Nueva posición Y (después de agregar página si es necesario)
 */
export const checkAndAddPage = (doc, currentY, requiredSpace) => {
  const pageHeight = getPageDimensions(doc).height;
  
  if (currentY + requiredSpace > pageHeight - 20) {
    addNewPage(doc);
    return 28; // Posición inicial después del header
  }
  
  return currentY;
};

/**
 * Dibuja texto con word wrap
 * @param {jsPDF} doc - Documento PDF
 * @param {string} text - Texto a dibujar
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {number} maxWidth - Ancho máximo
 * @returns {number} Nueva posición Y
 */
export const drawWrappedText = (doc, text, x, y, maxWidth) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + (lines.length * 5); // Aproximadamente 5mm por línea
};

Crear /src/reports/pdf/pdfHelpers.js
/**
 * ✅ Funciones helper para dibujar elementos en PDF
 */

import { COLORS } from '../../config/visualConfig';

/**
 * Dibuja una tabla usando autoTable
 * @param {jsPDF} doc - Documento PDF
 * @param {Array} columns - Definición de columnas
 * @param {Array} rows - Datos de filas
 * @param {number} startY - Posición Y inicial
 * @param {Object} options - Opciones adicionales
 */
export const drawTable = (doc, columns, rows, startY, options = {}) => {
  doc.autoTable({
    startY,
    head: [columns],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [31, 41, 55] // gray-800
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251] // gray-50
    },
    margin: { left: 14, right: 14 },
    ...options
  });
  
  return doc.lastAutoTable.finalY;
};

/**
 * Dibuja un gráfico de barras
 * @param {jsPDF} doc - Documento PDF
 * @param {Array} data - Datos [{label, conPIAR, sinPIAR, color}]
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {number} width - Ancho del gráfico
 * @param {number} height - Alto del gráfico
 * @param {string} title - Título del gráfico
 * @param {number} maxValue - Valor máximo del eje Y
 * @param {boolean} showComparison - Mostrar comparación con/sin PIAR
 */
export const drawBarChart = (doc, data, x, y, width, height, title, maxValue, showComparison = false) => {
  // Título
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, x, y);
  doc.setFont(undefined, 'normal');
  
  const chartY = y + 8;
  const chartHeight = height - 15;
  const barWidth = (width / data.length) * 0.7;
  const spacing = (width / data.length);
  
  // Dibujar ejes
  doc.setDrawColor(200, 200, 200);
  doc.line(x, chartY, x, chartY + chartHeight); // Eje Y
  doc.line(x, chartY + chartHeight, x + width, chartY + chartHeight); // Eje X
  
  // Dibujar barras
  data.forEach((item, index) => {
    const barX = x + (index * spacing) + (spacing - barWidth) / 2;
    
    if (showComparison) {
      // Dos barras: conPIAR y sinPIAR
      const barWidthHalf = barWidth / 2.2;
      
      // Barra conPIAR (gris)
      const heightConPIAR = (item.conPIAR / maxValue) * chartHeight;
      doc.setFillColor(156, 163, 175); // gray-400
      doc.rect(barX, chartY + chartHeight - heightConPIAR, barWidthHalf, heightConPIAR, 'F');
      
      // Valor conPIAR
      doc.setFontSize(7);
      doc.text(
        item.conPIAR.toFixed(1),
        barX + barWidthHalf / 2,
        chartY + chartHeight - heightConPIAR - 2,
        { align: 'center' }
      );
      
      // Barra sinPIAR (color del área)
      const heightSinPIAR = (item.sinPIAR / maxValue) * chartHeight;
      const rgb = hexToRgb(item.color);
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(barX + barWidthHalf + 2, chartY + chartHeight - heightSinPIAR, barWidthHalf, heightSinPIAR, 'F');
      
      // Valor sinPIAR
      doc.text(
        item.sinPIAR.toFixed(1),
        barX + barWidthHalf + 2 + barWidthHalf / 2,
        chartY + chartHeight - heightSinPIAR - 2,
        { align: 'center' }
      );
    } else {
      // Una sola barra (sinPIAR)
      const barHeight = (item.sinPIAR / maxValue) * chartHeight;
      const rgb = hexToRgb(item.color);
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(barX, chartY + chartHeight - barHeight, barWidth, barHeight, 'F');
      
      // Valor
      doc.setFontSize(8);
      doc.text(
        item.sinPIAR.toFixed(1),
        barX + barWidth / 2,
        chartY + chartHeight - barHeight - 2,
        { align: 'center' }
      );
    }
    
    // Etiqueta del eje X
    doc.setFontSize(8);
    doc.text(
      item.label,
      barX + barWidth / 2,
      chartY + chartHeight + 5,
      { align: 'center', maxWidth: barWidth }
    );
  });
  
  // Leyenda si hay comparación
  if (showComparison) {
    const legendY = chartY + chartHeight + 12;
    
    // Cuadrado gris
    doc.setFillColor(156, 163, 175);
    doc.rect(x + width / 2 - 30, legendY, 4, 4, 'F');
    doc.setFontSize(8);
    doc.text('con PIAR', x + width / 2 - 24, legendY + 3);
    
    // Cuadrado verde
    doc.setFillColor(34, 197, 94);
    doc.rect(x + width / 2 + 5, legendY, 4, 4, 'F');
    doc.text('sin PIAR', x + width / 2 + 11, legendY + 3);
  }
};

/**
 * Dibuja un gráfico de líneas (para tendencias multi-año)
 * @param {jsPDF} doc - Documento PDF
 * @param {Array} series - Array de series [{name, color, data: [{x, y}]}]
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {number} width - Ancho del gráfico
 * @param {number} height - Alto del gráfico
 * @param {string} title - Título del gráfico
 */
export const drawLineChart = (doc, series, x, y, width, height, title) => {
  // Título
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, x, y);
  doc.setFont(undefined, 'normal');
  
  const chartY = y + 8;
  const chartHeight = height - 20;
  
  // Encontrar rangos
  const allYValues = series.flatMap(s => s.data.map(d => d.y));
  const allXValues = series.flatMap(s => s.data.map(d => d.x));
  const minY = Math.min(...allYValues);
  const maxY = Math.max(...allYValues);
  const minX = Math.min(...allXValues);
  const maxX = Math.max(...allXValues);
  
  const rangeY = maxY - minY;
  const rangeX = maxX - minX;
  
  // Dibujar ejes
  doc.setDrawColor(200, 200, 200);
  doc.line(x, chartY, x, chartY + chartHeight);
  doc.line(x, chartY + chartHeight, x + width, chartY + chartHeight);
  
  // Dibujar series
  series.forEach((serie, serieIndex) => {
    const rgb = hexToRgb(serie.color);
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.5);
    
    // Dibujar línea
    serie.data.forEach((point, index) => {
      if (index > 0) {
        const prevPoint = serie.data[index - 1];
        
        const x1 = x + ((prevPoint.x - minX) / rangeX) * width;
        const y1 = chartY + chartHeight - ((prevPoint.y - minY) / rangeY) * chartHeight;
        const x2 = x + ((point.x - minX) / rangeX) * width;
        const y2 = chartY + chartHeight - ((point.y - minY) / rangeY) * chartHeight;
        
        doc.line(x1, y1, x2, y2);
      }
      
      // Dibujar punto
      const px = x + ((point.x - minX) / rangeX) * width;
      const py = chartY + chartHeight - ((point.y - minY) / rangeY) * chartHeight;
      
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.circle(px, py, 1.5, 'F');
      
      // Etiqueta de valor
      doc.setFontSize(7);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.text(point.y.toFixed(1), px, py - 3, { align: 'center' });
    });
  });
  
  // Leyenda
  const legendY = chartY + chartHeight + 10;
  let legendX = x;
  
  series.forEach((serie, index) => {
    const rgb = hexToRgb(serie.color);
    
    // Línea de muestra
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.line(legendX, legendY + 2, legendX + 8, legendY + 2);
    
    // Nombre
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(serie.name, legendX + 10, legendY + 3);
    
    legendX += 40;
  });
  
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
};

/**
 * Convierte hex a RGB
 * @param {string} hex - Color hexadecimal
 * @returns {Object} {r, g, b}
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Dibuja una card de métrica
 * @param {jsPDF} doc - Documento PDF
 * @param {string} title - Título de la métrica
 * @param {string} value - Valor de la métrica
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {number} width - Ancho de la card
 * @param {string} color - Color del borde (hex)
 */
export const drawMetricCard = (doc, title, value, x, y, width, color = COLORS.primary) => {
  const height = 20;
  const rgb = hexToRgb(color);
  
  // Borde
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(0.5);
  doc.rect(x, y, width, height);
  
  // Título
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(title, x + width / 2, y + 6, { align: 'center' });
  
  // Valor
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text(value.toString(), x + width / 2, y + 15, { align: 'center' });
  
  // Reset
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
};

Crear /src/reports/pdf/pdfSections/coverPage.js
/**
 * ✅ Sección: Portada del PDF
 */

import { BRANDING, COLORS } from '../../../config/visualConfig';
import { getPageDimensions } from '../pdfCore';

/**
 * Genera la portada del PDF
 * @param {jsPDF} doc - Documento PDF
 * @param {Analysis} analysis - Análisis principal
 * @param {boolean} isMultiYear - Si es análisis multi-año
 * @param {Array} comparisonYears - Años de comparación (si aplica)
 */
export const generateCoverPage = (doc, analysis, isMultiYear = false, comparisonYears = []) => {
  const { width, height } = getPageDimensions(doc);
  
  // Fondo decorativo
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, width, 80, 'F');
  
  // Título principal
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.text('Análisis ICFES', width / 2, 35, { align: 'center' });
  
  // Subtítulo
  doc.setFontSize(18);
  doc.setFont(undefined, 'normal');
  
  if (isMultiYear) {
    doc.text('Informe Comparativo Multi-Año', width / 2, 50, { align: 'center' });
    doc.setFontSize(14);
    doc.text(
      `Año Base: ${analysis.year}`,
      width / 2,
      60,
      { align: 'center' }
    );
    doc.setFontSize(12);
    doc.text(
      `Comparando con: ${comparisonYears.join(', ')}`,
      width / 2,
      68,
      { align: 'center' }
    );
  } else {
    doc.text(`Año ${analysis.year}`, width / 2, 55, { align: 'center' });
  }
  
  // Reset color
  doc.setTextColor(0, 0, 0);
  
  // Información general
  const infoY = 100;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Información General', 20, infoY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  
  const metadata = analysis.metadata;
  const infoLines = [
    `Total de estudiantes: ${metadata.totalStudents}`,
    `Estudiantes sin PIAR: ${metadata.studentsWithoutPIAR}`,
    `Estudiantes con PIAR: ${metadata.studentsWithPIAR}`,
    `Grados evaluados: ${metadata.grades.join(', ')}`,
    `Fecha de generación: ${new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`
  ];
  
  infoLines.forEach((line, index) => {
    doc.text(line, 20, infoY + 10 + (index * 8));
  });
  
  // Descripción del informe
  const descY = infoY + 60;
  doc.setFont(undefined, 'bold');
  doc.text('Contenido del Informe', 20, descY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  const sections = [
    'Listado completo de estudiantes ordenado por puntaje',
    'Métricas globales y por área académica',
    'Análisis por grado con métricas detalladas',
    'Top 5 estudiantes por área',
    'Top 3 estudiantes por grado',
    'Identificación de valores atípicos (outliers)',
    'Gráficos comparativos por área y grado'
  ];
  
  if (isMultiYear) {
    sections.push('Análisis comparativo multi-año con tendencias');
  }
  
  sections.forEach((section, index) => {
    doc.text(`• ${section}`, 25, descY + 10 + (index * 7));
  });
  
  // Branding en footer
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text(
    `Desarrollado por: ${BRANDING.name}`,
    width / 2,
    height - 30,
    { align: 'center' }
  );
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    BRANDING.url,
    width / 2,
    height - 20,
    { align: 'center' }
  );
  
  // Reset
  doc.setTextColor(0, 0, 0);
};

Crear /src/reports/pdf/pdfSections/studentsList.js
/**
 * ✅ Sección: Listado de estudiantes
 */

import { drawSectionHeader, addNewPage } from '../pdfCore';
import { drawTable } from '../pdfHelpers';

/**
 * Genera sección de listado de estudiantes
 * @param {jsPDF} doc - Documento PDF
 * @param {Analysis} analysis - Análisis
 * @param {number} sectionNumber - Número de sección
 * @param {boolean} excludePIAR - Excluir estudiantes con PIAR
 */
export const generateStudentsList = (doc, analysis, sectionNumber, excludePIAR = true) => {
  addNewPage(doc);
  drawSectionHeader(doc, 'Listado de Estudiantes por Puntaje Global', sectionNumber);
  
  let yPos = 28;
  
  // Descripción
  doc.setFontSize(10);
  doc.text(
    excludePIAR
      ? 'Estudiantes ordenados por puntaje global (sin incluir estudiantes con PIAR)'
      : 'Todos los estudiantes ordenados por puntaje global',
    14,
    yPos
  );
  
  yPos += 10;
  
  // Preparar datos
  const data = excludePIAR
    ? analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
    : analysis.processedData;
  
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  
  // Columnas
  const columns = ['#', 'Nombre', 'Apellido', 'Grado', 'Global'];
  
  // Filas
  const rows = sortedData.map((student, index) => [
    (index + 1).toString(),
    student.Nombre,
    student.Apellido,
    student.Grupo,
    student.Global?.toFixed(2) || 'N/A'
  ]);
  
  // Dibujar tabla
  drawTable(doc, columns, rows, yPos, {
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 45 },
      2: { cellWidth: 45 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' }
    }
  });
};

Crear /src/reports/pdf/pdfSections/areaMetrics.js
/**
 * ✅ Sección: Métricas por área
 */

import { ACADEMIC_AREAS } from '../../../config/columnConfig';
import { drawSectionHeader, addNewPage, checkAndAddPage } from '../pdfCore';
import { drawTable } from '../pdfHelpers';
import { calculateAreaMetrics } from '../../../utils/calculations';

/**
 * Genera sección de métricas por área
 * @param {jsPDF} doc - Documento PDF
 * @param {Analysis} analysis - Análisis
 * @param {number} sectionNumber - Número de sección
 */
export const generateAreaMetrics = (doc, analysis, sectionNumber) => {
  addNewPage(doc);
  drawSectionHeader(doc, 'Métricas por Área Académica', sectionNumber);
  
  let yPos = 28;
  
  // Descripción
  doc.setFontSize(10);
  doc.text(
    'Comparación de métricas estadísticas por área, incluyendo y excluyendo estudiantes con PIAR',
    14,
    yPos
  );
  
  yPos += 10;
  
  // Calcular métricas
  const metricsConPIAR = calculateAreaMetrics(analysis.processedData, false);
  const metricsSinPIAR = calculateAreaMetrics(
    analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí'),
    false
  );
  
  // Preparar datos para tabla
  const columns = [
    'Área',
    'Prom. (con PIAR)',
    'Prom. (sin PIAR)',
    'Desv. (con PIAR)',
    'Desv. (sin PIAR)',
    'Percentil'
  ];
  
  const rows = ACADEMIC_AREAS.map((area, index) => {
    const metricCon = metricsConPIAR[index];
    const metricSin = metricsSinPIAR[index];
    
    return [
      area.shortName,
      metricCon.promedio,
      metricSin.promedio,
      metricCon.desviacion,
      metricSin.desviacion,
      metricSin.percentil !== 'N/A' ? metricSin.percentil + '%' : 'N/A'
    ];
  });
  
  // Dibujar tabla
  drawTable(doc, columns, rows, yPos, {
    columnStyles: {
      0: { cellWidth: 35, fontStyle: 'bold' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center', fillColor: [220, 252, 231] }, // green-100
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center', fillColor: [220, 252, 231] },
      5: { cellWidth: 20, halign: 'center' }
    }
  });
};

CONTINÚA EN SIGUIENTE SECCIÓN...
El documento completo es muy extenso. He cubierto hasta aquí los aspectos más críticos. ¿Quieres que continúe con:

Las demás secciones del PDF (gradeMetrics, topPerformers, outliers, charts, comparison)
El sistema de HTML Export completo
Los componentes de UI refactorizados
Los tests
O prefieres que genere un documento consolidado final más compacto con todas las instrucciones clave para Windsurf?

Recomendación: Te sugiero opción 5 - un documento CONSOLIDADO FINAL más compacto que Windsurf pueda seguir paso a paso, enfocándose en las instrucciones clave sin tanto código de ejemplo (que Windsurf puede generar). ¿Procedemos así?