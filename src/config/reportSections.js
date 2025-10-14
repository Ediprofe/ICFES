/**
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
