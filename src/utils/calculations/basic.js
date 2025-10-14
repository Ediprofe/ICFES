/**
 * ✅ Funciones estadísticas básicas
 * Todas filtran valores null/undefined/NaN automáticamente
 */

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

// Mediana
export const median = (values) => {
  const nums = values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v));
  if (nums.length === 0) return 0;
  
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

// Moda
export const mode = (values) => {
  const nums = values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v));
  if (nums.length === 0) return 0;
  
  const frequency = {};
  let maxFreq = 0;
  let modes = [];
  
  nums.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
      modes = [num];
    } else if (frequency[num] === maxFreq && !modes.includes(num)) {
      modes.push(num);
    }
  });
  
  return modes.length === nums.length ? nums[0] : modes[0];
};

// Mínimo
export const min = (values) => {
  const nums = values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v));
  return nums.length ? Math.min(...nums) : 0;
};

// Máximo
export const max = (values) => {
  const nums = values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v));
  return nums.length ? Math.max(...nums) : 0;
};

// Suma
export const sum = (values) => {
  const nums = values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v));
  return nums.reduce((a, b) => a + b, 0);
};

// Conteo
export const count = (values) => {
  return values.filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v)).length;
};
