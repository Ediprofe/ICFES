// Promedio (ignora null, undefined y valores no numéricos)
export const mean = (values) => {
  const nums = values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v));
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
};

// Desviación estándar (muestral, usa n-1 como Excel DESVEST.M)
export const stdDev = (values) => {
  const nums = values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v));
  if (nums.length <= 1) return 0;
  
  const avg = mean(values);
  const squareDiffs = nums.map(v => Math.pow(v - avg, 2));
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / (nums.length - 1); // n-1 para muestra
  return Math.sqrt(variance);
};

// Z-score
export const zScore = (value, avg, sd) => {
  return sd === 0 ? 0 : (value - avg) / sd;
};

// Outliers (±3σ) - Basado en muestra SIN PIAR
export const findOutliers = (data) => {
  // Filtrar solo estudiantes SIN PIAR con puntaje global válido
  const validStudentsSinPIAR = data.filter(s => 
    s['¿PIAR?'] !== 'Sí' && 
    s.Global !== null && 
    s.Global !== undefined && 
    !isNaN(s.Global)
  );
  const globals = validStudentsSinPIAR.map(s => s.Global);
  const avg = mean(globals);
  const sd = stdDev(globals);
  
  // Buscar outliers solo en la muestra sin PIAR
  return validStudentsSinPIAR.filter(student => {
    const z = Math.abs(zScore(student.Global, avg, sd));
    return z >= 3;
  });
};

// Métricas por área
export const calculateAreaMetrics = (data, excludePIAR = false) => {
  const filtered = excludePIAR 
    ? data.filter(s => s['¿PIAR?'] !== 'Sí') 
    : data;
  
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  
  return subjects.map(subject => {
    // Obtener solo valores válidos para este subject
    const values = filtered.map(s => s[subject]).filter(v => v !== null && v !== undefined && !isNaN(v));
    const percentileValues = filtered.map(s => {
      const pValue = s[`Percentil ${subject}`];
      return (pValue !== null && pValue !== undefined && !isNaN(parseFloat(pValue))) ? parseFloat(pValue) : null;
    }).filter(v => v !== null);
    
    return {
      area: subject,
      promedio: values.length > 0 ? mean(values).toFixed(2) : 'N/A',
      desviacion: values.length > 0 ? stdDev(values).toFixed(2) : 'N/A',
      percentil: percentileValues.length > 0 ? mean(percentileValues).toFixed(2) : 'N/A',
      cantidadDatos: values.length
    };
  });
};

// Top 5 por área
export const getTop5BySubject = (data, subject) => {
  return [...data]
    .filter(s => s[subject] !== null && s[subject] !== undefined && !isNaN(s[subject])) // Filtrar valores válidos
    .sort((a, b) => b[subject] - a[subject])
    .slice(0, 5)
    .map(s => ({ 
      nombre: s.Nombre, 
      apellido: s.Apellido,
      nombreCompleto: `${s.Nombre} ${s.Apellido}`,
      puntaje: s[subject] 
    }));
};

// Top 3 por grado
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
      .filter(s => s.Global !== null && s.Global !== undefined && !isNaN(s.Global)) // Filtrar válidos
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

// Métricas por grado (con comparación con/sin PIAR)
export const getMetricsByGrade = (data) => {
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  
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
    
    const metricsConPIAR = subjects.map(subject => {
      const values = studentsConPIAR.map(s => s[subject]).filter(v => v !== null && v !== undefined && !isNaN(v));
      return {
        subject,
        promedio: values.length > 0 ? mean(values).toFixed(2) : 'N/A',
        desviacion: values.length > 0 ? stdDev(values).toFixed(2) : 'N/A',
        cantidadDatos: values.length
      };
    });
    
    const metricsSinPIAR = subjects.map(subject => {
      const values = studentsSinPIAR.map(s => s[subject]).filter(v => v !== null && v !== undefined && !isNaN(v));
      return {
        subject,
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
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  
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
  const areaMetrics = subjects.map(subject => {
    const valuesWithOutliers = dataSinPIAR.map(s => s[subject]).filter(v => v !== null && v !== undefined && !isNaN(v));
    const valuesWithoutOutliers = dataWithoutOutliers.map(s => s[subject]).filter(v => v !== null && v !== undefined && !isNaN(v));
    
    return {
      area: subject,
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
