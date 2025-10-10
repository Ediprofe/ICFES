export const calculatePercentile = (value, sortedArray) => {
  // Si el valor es null o el array está vacío, retornar null
  if (value === null || value === undefined || isNaN(value) || sortedArray.length === 0) {
    return null;
  }
  
  const n = sortedArray.length;
  const rank = sortedArray.filter(v => v < value).length + 1;
  return ((rank - 0.5) / n) * 100;
};

export const addPercentiles = (data, subjects) => {
  return data.map(student => {
    const withPercentiles = { ...student };
    
    subjects.forEach(subject => {
      const newPercentileKey = `Percentil ${subject}`;
      const oldPercentileKey = `% ${subject}`;
      
      // Si ya existe el percentil (nuevo o viejo formato), mantenerlo
      if (student[newPercentileKey] !== undefined && student[newPercentileKey] !== null) {
        withPercentiles[newPercentileKey] = student[newPercentileKey];
      } else if (student[oldPercentileKey] !== undefined && student[oldPercentileKey] !== null) {
        withPercentiles[newPercentileKey] = student[oldPercentileKey];
      } else {
        // Calcular solo si el estudiante tiene un valor válido para esta materia
        const studentValue = student[subject];
        
        if (studentValue !== null && studentValue !== undefined && !isNaN(studentValue)) {
          // Filtrar solo valores válidos de todos los estudiantes para este subject
          const values = data
            .map(s => s[subject])
            .filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v))
            .sort((a, b) => a - b);
          
          const percentile = calculatePercentile(studentValue, values);
          withPercentiles[newPercentileKey] = percentile !== null ? percentile.toFixed(2) : null;
        } else {
          // Si el estudiante no tiene puntaje en esta materia, el percentil es null
          withPercentiles[newPercentileKey] = null;
        }
      }
    });
    
    return withPercentiles;
  });
};
