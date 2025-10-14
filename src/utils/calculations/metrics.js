/**
 * ✅ Cálculo de métricas agregadas
 * Métricas globales, por área, por grado
 */

import { mean, stdDev } from './basic.js';
import { findOutliers } from './statistical.js';
import { ACADEMIC_AREAS } from '../../config/columnConfig.js';
import { METRIC_LIMITS } from '../../config/metricsConfig.js';

// Métricas globales
export const calculateGlobalMetrics = (data, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí') 
    : data;
  
  const globals = filtered.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
  
  return {
    promedio: globals.length > 0 ? mean(globals) : 0,
    desviacion: globals.length > 0 ? stdDev(globals) : 0,
    totalEstudiantes: filtered.length,
    min: globals.length > 0 ? Math.min(...globals) : 0,
    max: globals.length > 0 ? Math.max(...globals) : 0
  };
};

// Métricas por área
export const calculateAreaMetrics = (data, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí') 
    : data;
  
  return ACADEMIC_AREAS.map(area => {
    // Obtener solo valores válidos para este área
    const values = filtered.map(s => s[area.columnName]).filter(v => v !== null && v !== undefined && !isNaN(v));
    const percentileValues = filtered.map(s => {
      const pValue = s[area.percentileColumn];
      return (pValue !== null && pValue !== undefined && !isNaN(parseFloat(pValue))) ? parseFloat(pValue) : null;
    }).filter(v => v !== null);
    
    return {
      area: area.columnName,
      areaId: area.id,
      shortName: area.shortName,
      color: area.color,
      promedio: values.length > 0 ? mean(values).toFixed(2) : 'N/A',
      desviacion: values.length > 0 ? stdDev(values).toFixed(2) : 'N/A',
      percentil: percentileValues.length > 0 ? mean(percentileValues).toFixed(2) : 'N/A',
      cantidadDatos: values.length
    };
  });
};

// Métricas por grado (con comparación con/sin PIAR)
export const calculateGradeMetrics = (data) => {
  // Agrupar por grado
  const byGrade = data.reduce((acc, student) => {
    const grade = student.Grupo;
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(student);
    return acc;
  }, {});
  
  // Calcular métricas para cada grado
  return Object.entries(byGrade).map(([grade, students]) => {
    const studentsConPIAR = students;
    const studentsSinPIAR = students.filter(s => s['¿PIAR?'] !== 'Sí');
    
    const metricsConPIAR = ACADEMIC_AREAS.map(area => {
      const values = studentsConPIAR.map(s => s[area.columnName]).filter(v => v !== null && v !== undefined && !isNaN(v));
      return {
        subject: area.columnName,
        areaId: area.id,
        promedio: values.length > 0 ? mean(values).toFixed(2) : 'N/A',
        desviacion: values.length > 0 ? stdDev(values).toFixed(2) : 'N/A',
        cantidadDatos: values.length
      };
    });
    
    const metricsSinPIAR = ACADEMIC_AREAS.map(area => {
      const values = studentsSinPIAR.map(s => s[area.columnName]).filter(v => v !== null && v !== undefined && !isNaN(v));
      return {
        subject: area.columnName,
        areaId: area.id,
        promedio: values.length > 0 ? mean(values).toFixed(2) : 'N/A',
        desviacion: values.length > 0 ? stdDev(values).toFixed(2) : 'N/A',
        cantidadDatos: values.length
      };
    });
    
    return {
      grado: grade,
      totalEstudiantes: studentsConPIAR.length,
      estudiantesSinPIAR: studentsSinPIAR.length,
      metricsConPIAR,
      metricsSinPIAR
    };
  }).sort((a, b) => a.grado.localeCompare(b.grado));
};

// Promedios globales por grado (para gráficos)
export const getGradeAverages = (data) => {
  // Agrupar por grado
  const byGrade = data.reduce((acc, student) => {
    const grade = student.Grupo;
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(student);
    return acc;
  }, {});
  
  // Calcular promedios y desviaciones para cada grado
  return Object.entries(byGrade).map(([grade, students]) => {
    const studentsConPIAR = students;
    const studentsSinPIAR = students.filter(s => s['¿PIAR?'] !== 'Sí');
    
    // Filtrar valores válidos de Global
    const globalsConPIAR = studentsConPIAR.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
    const globalsSinPIAR = studentsSinPIAR.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
    
    return {
      grado: grade,
      promedioConPIAR: globalsConPIAR.length > 0 ? mean(globalsConPIAR) : 0,
      promedioSinPIAR: globalsSinPIAR.length > 0 ? mean(globalsSinPIAR) : 0,
      desviacionConPIAR: globalsConPIAR.length > 0 ? stdDev(globalsConPIAR) : 0,
      desviacionSinPIAR: globalsSinPIAR.length > 0 ? stdDev(globalsSinPIAR) : 0
    };
  }).sort((a, b) => a.grado.localeCompare(b.grado));
};

// Top N por área
export const getTopByArea = (data, area, n = METRIC_LIMITS.TOP_PERFORMERS_BY_AREA, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí') 
    : data;
  
  return [...filtered]
    .filter(s => s[area] !== null && s[area] !== undefined && !isNaN(s[area]))
    .sort((a, b) => b[area] - a[area])
    .slice(0, n)
    .map(s => ({ 
      nombre: s.Nombre, 
      apellido: s.Apellido,
      nombreCompleto: `${s.Nombre} ${s.Apellido}`,
      puntaje: s[area] 
    }));
};

// Top 5 por área (alias para compatibilidad)
export const getTop5BySubject = (data, subject) => {
  return getTopByArea(data, subject, 5, false);
};

// Top N por grado
export const getTopByGrade = (data, grade, n = METRIC_LIMITS.TOP_PERFORMERS_BY_GRADE, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí') 
    : data;
  
  return [...filtered]
    .filter(s => s.Grupo === grade && s.Global !== null && s.Global !== undefined && !isNaN(s.Global))
    .sort((a, b) => b.Global - a.Global)
    .slice(0, n)
    .map(s => ({ 
      nombre: s.Nombre,
      apellido: s.Apellido,
      nombreCompleto: `${s.Nombre} ${s.Apellido}`,
      global: s.Global 
    }));
};

// Top 3 por todos los grados
export const getTop3ByGrade = (data) => {
  const byGrade = data.reduce((acc, student) => {
    const grade = student.Grupo;
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(student);
    return acc;
  }, {});
  
  return Object.entries(byGrade).map(([grade, students]) => ({
    grado: grade,
    top: students
      .filter(s => s.Global !== null && s.Global !== undefined && !isNaN(s.Global))
      .sort((a, b) => b.Global - a.Global)
      .slice(0, 3)
      .map(s => ({ 
        nombre: s.Nombre,
        apellido: s.Apellido,
        nombreCompleto: `${s.Nombre} ${s.Apellido}`,
        global: s.Global 
      }))
  }));
};

// Alias para compatibilidad
export const getAllTopByGrade = getTop3ByGrade;

// Obtener datos sin outliers (solo de la muestra sin PIAR)
export const getDataWithoutOutliers = (data) => {
  // Primero filtrar solo estudiantes sin PIAR
  const dataSinPIAR = data.filter(s => s['¿PIAR?'] !== 'Sí');
  const outliers = findOutliers(data);
  const outlierIds = new Set(outliers.map(o => `${o.Nombre}-${o.Apellido}-${o.Grupo}`));
  return dataSinPIAR.filter(s => !outlierIds.has(`${s.Nombre}-${s.Apellido}-${s.Grupo}`));
};

// Métricas globales y por área con/sin outliers (basado en muestra SIN PIAR)
export const getMetricsComparison = (data) => {
  // Muestra sin PIAR (con outliers)
  const dataSinPIAR = data.filter(s => s['¿PIAR?'] !== 'Sí');
  // Muestra sin PIAR y sin outliers
  const dataWithoutOutliers = getDataWithoutOutliers(data);
  
  // Métricas globales
  const globalsWithOutliers = dataSinPIAR.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
  const globalsWithoutOutliers = dataWithoutOutliers.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
  
  const globalMetrics = {
    conOutliers: {
      promedio: globalsWithOutliers.length > 0 ? mean(globalsWithOutliers) : 0,
      desviacion: globalsWithOutliers.length > 0 ? stdDev(globalsWithOutliers) : 0,
      cantidad: globalsWithOutliers.length
    },
    sinOutliers: {
      promedio: globalsWithoutOutliers.length > 0 ? mean(globalsWithoutOutliers) : 0,
      desviacion: globalsWithoutOutliers.length > 0 ? stdDev(globalsWithoutOutliers) : 0,
      cantidad: globalsWithoutOutliers.length
    }
  };
  
  // Métricas por área
  const areaMetrics = ACADEMIC_AREAS.map(area => {
    const valuesWithOutliers = dataSinPIAR.map(s => s[area.columnName]).filter(v => v !== null && v !== undefined && !isNaN(v));
    const valuesWithoutOutliers = dataWithoutOutliers.map(s => s[area.columnName]).filter(v => v !== null && v !== undefined && !isNaN(v));
    
    return {
      area: area.columnName,
      areaId: area.id,
      conOutliers: {
        promedio: valuesWithOutliers.length > 0 ? mean(valuesWithOutliers) : 0,
        desviacion: valuesWithOutliers.length > 0 ? stdDev(valuesWithOutliers) : 0,
        cantidad: valuesWithOutliers.length
      },
      sinOutliers: {
        promedio: valuesWithoutOutliers.length > 0 ? mean(valuesWithoutOutliers) : 0,
        desviacion: valuesWithoutOutliers.length > 0 ? stdDev(valuesWithoutOutliers) : 0,
        cantidad: valuesWithoutOutliers.length
      }
    };
  });
  
  return {
    global: globalMetrics,
    areas: areaMetrics
  };
};
