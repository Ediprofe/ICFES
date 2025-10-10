// Promedio
export const mean = (values) => {
  const nums = values.filter(v => typeof v === 'number');
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
};

// Desviación estándar (muestral, usa n-1 como Excel DESVEST.M)
export const stdDev = (values) => {
  const nums = values.filter(v => typeof v === 'number');
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

// Outliers (±3σ)
export const findOutliers = (data) => {
  const globals = data.map(s => s.Global);
  const avg = mean(globals);
  const sd = stdDev(globals);
  
  return data.filter(student => {
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
  
  return subjects.map(subject => ({
    area: subject,
    promedio: mean(filtered.map(s => s[subject])).toFixed(2),
    desviacion: stdDev(filtered.map(s => s[subject])).toFixed(2),
    percentil: mean(filtered.map(s => parseFloat(s[`Percentil ${subject}`] || 0))).toFixed(2)
  }));
};

// Top 5 por área
export const getTop5BySubject = (data, subject) => {
  return [...data]
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
    
    const metricsConPIAR = subjects.map(subject => ({
      subject,
      promedio: mean(studentsConPIAR.map(s => s[subject])).toFixed(2),
      desviacion: stdDev(studentsConPIAR.map(s => s[subject])).toFixed(2)
    }));
    
    const metricsSinPIAR = subjects.map(subject => ({
      subject,
      promedio: mean(studentsSinPIAR.map(s => s[subject])).toFixed(2),
      desviacion: stdDev(studentsSinPIAR.map(s => s[subject])).toFixed(2)
    }));
    
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
    
    return {
      grado: grade,
      promedioConPIAR: mean(studentsConPIAR.map(s => s.Global)),
      promedioSinPIAR: mean(studentsSinPIAR.map(s => s.Global)),
      desviacionConPIAR: stdDev(studentsConPIAR.map(s => s.Global)),
      desviacionSinPIAR: stdDev(studentsSinPIAR.map(s => s.Global))
    };
  }).sort((a, b) => a.grado.localeCompare(b.grado));
};
