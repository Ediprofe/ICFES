/**
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
