export const calculatePercentile = (value, sortedArray) => {
  // Si el valor es null o el array está vacío, retornar null
  if (value === null || value === undefined || isNaN(value) || sortedArray.length === 0) {
    return null;
  }
  
  const n = sortedArray.length;
  const rank = sortedArray.filter(v => v < value).length + 1;
  return ((rank - 0.5) / n) * 100;
};

// Función auxiliar para verificar si el Excel tiene columnas de percentiles
export const hasPercentileColumns = (data, subjects) => {
  if (!data || data.length === 0) return false;
  
  // Verificar si al menos una columna de percentil existe en los datos
  const firstRow = data[0];
  return subjects.some(subject => {
    const newPercentileKey = `Percentil ${subject}`;
    const oldPercentileKey = `% ${subject}`;
    return newPercentileKey in firstRow || oldPercentileKey in firstRow;
  });
};

export const addPercentiles = (data, subjects) => {
  // IMPORTANTE: Solo procesar percentiles si el Excel ya los tiene
  const hasPercentiles = hasPercentileColumns(data, subjects);
  
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
      } else if (hasPercentiles) {
        // Solo si el Excel tiene percentiles pero este estudiante no tiene valor, asignar null
        withPercentiles[newPercentileKey] = null;
      }
      // Si el Excel NO tiene percentiles, NO los calculamos automáticamente
    });
    
    return withPercentiles;
  });
};
