/**
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
    name: 'Año',
    type: COLUMN_TYPES.YEAR,
    validation: (val) => val >= 2000 && val <= 2100,
    errorMessage: 'Año debe estar entre 2000 y 2100'
  },
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
