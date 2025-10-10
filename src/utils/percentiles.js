export const calculatePercentile = (value, sortedArray) => {
  const n = sortedArray.length;
  const rank = sortedArray.filter(v => v < value).length + 1;
  return ((rank - 0.5) / n) * 100;
};

export const addPercentiles = (data, subjects) => {
  return data.map(student => {
    const withPercentiles = { ...student };
    
    subjects.forEach(subject => {
      const percentileKey = `% ${subject}`;
      
      // Si no existe, calcular
      if (!student[percentileKey]) {
        const values = data
          .map(s => s[subject])
          .filter(v => typeof v === 'number')
          .sort((a, b) => a - b);
        
        withPercentiles[percentileKey] = calculatePercentile(
          student[subject], 
          values
        ).toFixed(2);
      }
    });
    
    return withPercentiles;
  });
};
