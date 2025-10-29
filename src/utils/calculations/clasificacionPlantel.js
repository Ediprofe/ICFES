/**
 * ✅ Utilidades de Cálculo: Clasificación de Plantel
 * 
 * METODOLOGÍA DE CÁLCULO:
 * 
 * 1. MUESTRA BASE (Sin PIAR):
 *    - Se excluyen estudiantes con PIAR de cada cohorte
 * 
 * 2. TOP 80% POR ÁREA:
 *    - De la muestra sin PIAR, se selecciona el 80% de mejores puntajes en cada área
 *    - Esto se hace independientemente para cada área académica
 * 
 * 3. ÍNDICE DE ÁREA:
 *    - Fórmula: Índice = Promedio / (1 - Varianza)
 *    - Promedio: Promedio del top 80% en el área
 *    - Varianza: Calculada usando VAR.P (varianza poblacional)
 *      * Población: 101 valores posibles (0 a 100)
 *      * Se usa la fórmula: Σ(xi - μ)² / N
 *      * Donde N = 101 (número de puntajes posibles)
 * 
 * 4. ÍNDICE GLOBAL:
 *    - Fórmula: IG = [(3×MA) + (3×LC) + (3×CN) + (3×SC) + IN] / 13
 *    - MA: Índice de Matemáticas
 *    - LC: Índice de Lectura Crítica
 *    - CN: Índice de Ciencias Naturales
 *    - SC: Índice de Sociales y Ciudadanas
 *    - IN: Índice de Inglés
 * 
 * 5. CLASIFICACIÓN:
 *    - A+: IG ≥ 0.77
 *    - A:  0.72 ≤ IG < 0.77
 *    - B:  0.67 ≤ IG < 0.72
 *    - C:  0.62 ≤ IG < 0.67
 *    - D:  IG < 0.62
 */

import { ACADEMIC_AREAS } from '../../config/columnConfig.js';

/**
 * Calcula el promedio y la varianza usando Frecuencia Relativa Acumulada (FRA)
 * Según metodología ICFES (Tabla 4 del documento)
 * 
 * @param {number[]} values - Array de valores (puntajes del top 80%)
 * @param {boolean} debug - Si true, imprime información de debugging
 * @returns {Object} { promedio, varianza } calculados según ICFES
 */
export function calculateFRAStatistics(values, debug = false) {
  if (values.length === 0) return { promedio: 0, varianza: 0 };
  
  // 1. Calcular promedio aritmético simple (para referencia)
  const sumScores = values.reduce((sum, val) => sum + val, 0);
  const avgScore = sumScores / values.length;
  
  // 2. Crear tabla de frecuencias para puntajes 0-100 (101 filas)
  const frequencies = new Array(101).fill(0);
  values.forEach(val => {
    const roundedVal = Math.round(val);
    if (roundedVal >= 0 && roundedVal <= 100) {
      frequencies[roundedVal]++;
    }
  });
  
  // 3. Calcular frecuencias relativas
  const totalCount = values.length;
  const relativeFrequencies = frequencies.map(freq => freq / totalCount);
  
  // 4. Calcular frecuencias relativas acumuladas (FRA)
  // IMPORTANTE: La FRA acumula desde el puntaje más ALTO (100) hacia el más BAJO (0)
  // FRA[i] = proporción de estudiantes con puntaje >= i
  // Esto significa que FRA[0] siempre será 1.0 (todos tienen 0 o más)
  const cumulativeFrequencies = new Array(101);
  let cumulative = 0;
  for (let i = 100; i >= 0; i--) {
    cumulative += relativeFrequencies[i];
    cumulativeFrequencies[i] = cumulative;
  }
  
  // 5. Calcular Promedio = Σ(FRA) / 101
  // Según documento ICFES: sumar TODAS las FRA y dividir entre 101
  const sumFRA = cumulativeFrequencies.reduce((sum, fra) => sum + fra, 0);
  const promedio = sumFRA / 101;
  
  // 6. Calcular Varianza usando VAR.P sobre la columna FRA
  // VAR.P = Σ(FRA - promedio_FRA)² / 101
  // Donde promedio_FRA es el promedio de los valores FRA (no el promedio calculado arriba)
  const promedioFRA = promedio; // Es el mismo: Σ(FRA) / 101
  let sumSquaredDiff = 0;
  for (let i = 0; i <= 100; i++) {
    const fra = cumulativeFrequencies[i];
    sumSquaredDiff += Math.pow(fra - promedioFRA, 2);
  }
  const varianza = sumSquaredDiff / 101;
  
  if (debug) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    console.log('=== DEBUG: Estadísticas de Puntajes ===');
    console.log(`Total valores: ${values.length}`);
    console.log(`Mínimo: ${min.toFixed(2)}`);
    console.log(`Máximo: ${max.toFixed(2)}`);
    console.log(`Promedio aritmético: ${avgScore.toFixed(4)}`);
    console.log(`Primeros 10 valores: [${values.slice(0, 10).map(v => v.toFixed(1)).join(', ')}]`);
    
    console.log('\n=== DEBUG: Tabla FRA (primeros 10 y últimos 10) ===');
    console.log('Puntaje | Frec | Frec.Rel | FRA');
    for (let i = 100; i >= 91; i--) {
      if (frequencies[i] > 0 || i === 100) {
        console.log(`${i.toString().padStart(3)} | ${frequencies[i].toString().padStart(4)} | ${relativeFrequencies[i].toFixed(4)} | ${cumulativeFrequencies[i].toFixed(4)}`);
      }
    }
    console.log('...');
    for (let i = 9; i >= 0; i--) {
      if (frequencies[i] > 0 || i === 0) {
        console.log(`${i.toString().padStart(3)} | ${frequencies[i].toString().padStart(4)} | ${relativeFrequencies[i].toFixed(4)} | ${cumulativeFrequencies[i].toFixed(4)}`);
      }
    }
    console.log(`\nÚltima FRA (debe ser 1.0): ${cumulativeFrequencies[100].toFixed(4)}`);
    
    console.log('\n=== DEBUG: Cálculos Finales ===');
    console.log(`Promedio aritmético simple: ${avgScore.toFixed(4)}`);
    console.log(`Suma de FRA: ${sumFRA.toFixed(4)}`);
    console.log(`Promedio = Σ(FRA) / 101 = ${sumFRA.toFixed(4)} / 101 = ${promedio.toFixed(4)}`);
    console.log(`\nCálculo de Varianza:`);
    console.log(`Suma de (FRA - Promedio)²: ${sumSquaredDiff.toFixed(6)}`);
    console.log(`Varianza = ${sumSquaredDiff.toFixed(6)} / 101 = ${varianza.toFixed(6)}`);
    console.log(`\nVerificación con algunos valores:`);
    console.log(`FRA[100] = ${cumulativeFrequencies[100].toFixed(4)}, (FRA - Prom)² = ${Math.pow(cumulativeFrequencies[100] - promedio, 2).toFixed(6)}`);
    console.log(`FRA[99] = ${cumulativeFrequencies[99].toFixed(4)}, (FRA - Prom)² = ${Math.pow(cumulativeFrequencies[99] - promedio, 2).toFixed(6)}`);
    console.log(`FRA[43] = ${cumulativeFrequencies[43].toFixed(4)}, (FRA - Prom)² = ${Math.pow(cumulativeFrequencies[43] - promedio, 2).toFixed(6)}`);
    console.log(`FRA[0] = ${cumulativeFrequencies[0].toFixed(4)}, (FRA - Prom)² = ${Math.pow(cumulativeFrequencies[0] - promedio, 2).toFixed(6)}`);
    console.log(`\nÍndice = ${promedio.toFixed(4)} / (1 - ${varianza.toFixed(4)}) = ${(promedio / (1 - varianza)).toFixed(4)}`);
    console.log('=====================================\n');
  }
  
  return { promedio, varianza };
}

/**
 * Obtiene el top 80% de estudiantes por área
 * 
 * @param {Array} students - Array de estudiantes
 * @param {string} areaField - Campo del área académica (ej: "Matemáticas", "Lectura crítica")
 * @returns {Array} Top 80% de estudiantes ordenados descendentemente
 */
export function getTop80Percent(students, areaField) {
  // Filtrar estudiantes con puntaje válido en el área
  const validStudents = students.filter(s => {
    const score = s[areaField];
    return score !== null && score !== undefined && !isNaN(score);
  });
  
  if (validStudents.length === 0) return [];
  
  // Ordenar descendentemente por puntaje
  const sorted = [...validStudents].sort((a, b) => b[areaField] - a[areaField]);
  
  // Calcular cantidad de estudiantes en el top 80%
  // Se usa Math.ceil para redondear hacia arriba
  const top80Count = Math.ceil(sorted.length * 0.8);
  
  // Retornar top 80%
  return sorted.slice(0, top80Count);
}

/**
 * Calcula el índice de un área académica
 * Fórmula: Índice = Promedio / (1 - Varianza)
 * Donde Promedio y Varianza se calculan sobre FRA
 * 
 * @param {Array} students - Array de estudiantes (ya filtrados sin PIAR)
 * @param {string} areaField - Campo del área académica
 * @param {boolean} debug - Si true, imprime información de debugging
 * @returns {Object} { indice, promedio, varianza, top80Count, totalCount }
 */
export function calculateAreaIndex(students, areaField, debug = false) {
  if (debug) {
    console.log(`\n========== CALCULANDO ÍNDICE PARA: ${areaField} ==========`);
    console.log(`Total estudiantes sin PIAR: ${students.length}`);
  }
  
  // 1. Obtener top 80% en el área
  const top80 = getTop80Percent(students, areaField);
  
  if (debug) {
    console.log(`Top 80% = ${top80.length} estudiantes`);
    if (top80.length > 0) {
      const allScores = top80.map(s => s[areaField]);
      console.log(`Puntajes del top 80%:`);
      console.log(`  - Mínimo: ${Math.min(...allScores).toFixed(2)}`);
      console.log(`  - Máximo: ${Math.max(...allScores).toFixed(2)}`);
      console.log(`  - Primeros 5: [${allScores.slice(0, 5).map(v => v.toFixed(1)).join(', ')}]`);
      console.log(`  - Últimos 5: [${allScores.slice(-5).map(v => v.toFixed(1)).join(', ')}]`);
    }
  }
  
  if (top80.length === 0) {
    return {
      indice: 0,
      promedio: 0,
      varianza: 0,
      top80Count: 0,
      totalCount: students.length
    };
  }
  
  // 2. Obtener puntajes del top 80%
  const scores = top80.map(s => s[areaField]);
  
  // 3. Calcular promedio y varianza usando FRA
  const { promedio, varianza } = calculateFRAStatistics(scores, debug);
  
  // 4. Calcular índice: Promedio / (1 - Varianza)
  // Ambos valores ya están en escala 0-1
  const indice = promedio / (1 - varianza);
  
  if (debug) {
    console.log(`\nRESULTADO FINAL para ${areaField}:`);
    console.log(`  Índice: ${indice.toFixed(4)}`);
    console.log(`========================================\n`);
  }
  
  return {
    indice,
    promedio,
    varianza,
    top80Count: top80.length,
    totalCount: students.length
  };
}

/**
 * Calcula el índice global del plantel
 * Fórmula: IG = [(3×MA) + (3×LC) + (3×CN) + (3×SC) + IN] / 13
 * 
 * @param {Object} areaIndices - Objeto con índices por área { "Matemáticas": {...}, "Lectura crítica": {...}, ... }
 * @returns {number} Índice global
 */
export function calculateGlobalIndex(areaIndices) {
  const MA = areaIndices['Matemáticas']?.indice || 0;
  const LC = areaIndices['Lectura crítica']?.indice || 0;
  const CN = areaIndices['Ciencias naturales']?.indice || 0;
  const SC = areaIndices['Sociales y ciudadanas']?.indice || 0;
  const IN = areaIndices['Inglés']?.indice || 0;
  
  const globalIndex = ((3 * MA) + (3 * LC) + (3 * CN) + (3 * SC) + IN) / 13;
  
  return globalIndex;
}

/**
 * Obtiene la clasificación según el índice global
 * 
 * @param {number} globalIndex - Índice global (escala 0-1)
 * @returns {Object} { categoria, color, bgColor, descripcion }
 */
export function getClassification(globalIndex) {
  // Rangos en escala 0-1 según la tabla proporcionada
  if (globalIndex >= 0.77) {
    return {
      categoria: 'A+',
      color: '#10b981', // Verde esmeralda
      bgColor: '#d1fae5',
      descripcion: 'Excelente'
    };
  } else if (globalIndex >= 0.72) {
    return {
      categoria: 'A',
      color: '#22c55e', // Verde
      bgColor: '#dcfce7',
      descripcion: 'Muy bueno'
    };
  } else if (globalIndex >= 0.67) {
    return {
      categoria: 'B',
      color: '#eab308', // Amarillo
      bgColor: '#fef9c3',
      descripcion: 'Bueno'
    };
  } else if (globalIndex >= 0.62) {
    return {
      categoria: 'C',
      color: '#f97316', // Naranja
      bgColor: '#fed7aa',
      descripcion: 'Regular'
    };
  } else {
    return {
      categoria: 'D',
      color: '#ef4444', // Rojo
      bgColor: '#fecaca',
      descripcion: 'Necesita mejora'
    };
  }
}

/**
 * Calcula todos los índices para un grupo de cohortes
 * 
 * @param {Array} analyses - Array de análisis (objetos Analysis)
 * @param {Array} years - Array de años a incluir
 * @param {boolean} debug - Si true, imprime información de debugging para Matemáticas
 * @returns {Object|null} Objeto con todos los cálculos o null si no hay datos
 */
export function calculateGroupIndices(analyses, years, debug = false) {
  if (debug) {
    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║  DEBUGGING CLASIFICACIÓN DE PLANTEL                    ║`);
    console.log(`║  Años seleccionados: ${years.join(', ')}                      ║`);
    console.log(`╚════════════════════════════════════════════════════════╝\n`);
  }
  
  // 1. Recopilar todos los estudiantes sin PIAR de las cohortes seleccionadas
  const allStudentsSinPIAR = [];
  
  years.forEach(year => {
    const analysis = analyses.find(a => a.year === year);
    if (analysis && analysis.processedData) {
      const studentsSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
      if (debug) {
        console.log(`Año ${year}: ${studentsSinPIAR.length} estudiantes sin PIAR`);
      }
      allStudentsSinPIAR.push(...studentsSinPIAR);
    }
  });
  
  if (debug) {
    console.log(`\nTOTAL estudiantes sin PIAR combinados: ${allStudentsSinPIAR.length}\n`);
  }
  
  if (allStudentsSinPIAR.length === 0) {
    return null;
  }
  
  // 2. Calcular índices por área
  const areaIndices = {};
  const areaDetails = [];
  
  ACADEMIC_AREAS.forEach((area, index) => {
    // Solo hacer debug para Matemáticas (primera área)
    const shouldDebug = debug && index === 0;
    // IMPORTANTE: Usar columnName en lugar de name para acceder a los datos
    const areaIndex = calculateAreaIndex(allStudentsSinPIAR, area.columnName, shouldDebug);
    areaIndices[area.name] = areaIndex;
    
    areaDetails.push({
      areaId: area.id,
      areaName: area.name,
      color: area.color,
      ...areaIndex
    });
  });
  
  // 3. Calcular índice global
  const globalIndex = calculateGlobalIndex(areaIndices);
  
  // 4. Obtener clasificación
  const classification = getClassification(globalIndex);
  
  if (debug) {
    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║  RESULTADO FINAL                                       ║`);
    console.log(`╠════════════════════════════════════════════════════════╣`);
    console.log(`║  Índice Global: ${globalIndex.toFixed(4)}                            ║`);
    console.log(`║  Clasificación: ${classification.categoria} - ${classification.descripcion.padEnd(20)} ║`);
    console.log(`╚════════════════════════════════════════════════════════╝\n`);
  }
  
  return {
    years,
    totalStudents: allStudentsSinPIAR.length,
    areaIndices: areaDetails,
    globalIndex,
    classification
  };
}
