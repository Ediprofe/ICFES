/**
 * ✅ Clase para representar un análisis de un año
 * Encapsula datos + metadatos + cálculos
 */

import { 
  mean, 
  stdDev, 
  findOutliers, 
  calculateAreaMetrics, 
  getTopByArea, 
  getTop3ByGrade, 
  getMetricsByGrade, 
  getGradeAverages 
} from '../utils/calculations.js';

export class Analysis {
  constructor(year, rawData) {
    this.year = year;
    this.rawData = rawData;
    this.processedData = this.processRawData(rawData);
    this.metadata = this.generateMetadata();
    this.filters = {
      excludePIAR: false,
      selectedGrade: 'Todos',
      minScore: 0,
      maxScore: 500
    };
    this._calculationCache = new Map();
  }
  
  /**
   * Procesa y limpia los datos crudos
   */
  processRawData(rawData) {
    // Validar y limpiar datos
    return rawData.map(student => ({
      ...student,
      nombreCompleto: `${student.Nombre} ${student.Apellido}`.trim(),
      year: this.year
    }));
  }
  
  /**
   * Genera metadata del análisis
   */
  generateMetadata() {
    return {
      totalStudents: this.rawData.length,
      studentsWithPIAR: this.rawData.filter(s => s['¿PIAR?'] === 'Sí').length,
      studentsWithoutPIAR: this.rawData.filter(s => s['¿PIAR?'] !== 'Sí').length,
      grades: [...new Set(this.rawData.map(s => s.Grupo))].sort(),
      loadedAt: new Date().toISOString(),
      year: this.year
    };
  }
  
  /**
   * Aplica filtros y retorna datos filtrados
   */
  getFilteredData() {
    const cacheKey = JSON.stringify(this.filters);
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    let filtered = this.processedData;
    
    if (this.filters.excludePIAR) {
      filtered = filtered.filter(s => s['¿PIAR?'] !== 'Sí');
    }
    
    if (this.filters.selectedGrade !== 'Todos') {
      filtered = filtered.filter(s => s.Grupo === this.filters.selectedGrade);
    }
    
    filtered = filtered.filter(s => 
      s.Global >= this.filters.minScore && 
      s.Global <= this.filters.maxScore
    );
    
    // Ordenar por puntaje global descendente
    filtered.sort((a, b) => b.Global - a.Global);
    
    this._calculationCache.set(cacheKey, filtered);
    return filtered;
  }
  
  /**
   * Actualiza filtros y limpia cache
   */
  updateFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this._calculationCache.clear();
  }
  
  /**
   * Obtiene métricas globales (con cache)
   * @param {boolean} excludePIAR - Si true, excluye estudiantes con PIAR (sin PIAR). Si false, incluye todos (con PIAR)
   * @param {boolean} excludeOutliers - Si true, excluye outliers del cálculo
   */
  getGlobalMetrics(excludePIAR = false, excludeOutliers = false) {
    const cacheKey = `global_${excludePIAR}_${excludeOutliers}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    // Filtrar datos según parámetros
    let data = excludePIAR 
      ? this.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
      : this.processedData;
    
    // Si se excluyen outliers, filtrarlos
    if (excludeOutliers) {
      const outliers = findOutliers(data);
      const outlierIds = new Set(outliers.map(o => `${o.Nombre}_${o.Apellido}_${o.Grupo}`));
      data = data.filter(s => !outlierIds.has(`${s.Nombre}_${s.Apellido}_${s.Grupo}`));
    }
    
    const globals = data.map(s => s.Global).filter(v => v !== null && v !== undefined && !isNaN(v));
    
    const metrics = {
      promedio: globals.length > 0 ? mean(globals) : 0,
      desviacion: globals.length > 0 ? stdDev(globals) : 0,
      minimo: globals.length > 0 ? Math.min(...globals) : 0,
      maximo: globals.length > 0 ? Math.max(...globals) : 0,
      totalEstudiantes: data.length,
      outliers: findOutliers(this.processedData)
    };
    
    this._calculationCache.set(cacheKey, metrics);
    
    return metrics;
  }
  
  /**
   * Obtiene métricas por área (con cache)
   * @param {boolean} excludePIAR - Si true, excluye estudiantes con PIAR (sin PIAR). Si false, incluye todos (con PIAR)
   */
  getAreaMetrics(excludePIAR = false) {
    const cacheKey = `area_${excludePIAR}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const data = excludePIAR 
      ? this.processedData.filter(s => s['¿PIAR?'] !== 'Sí')
      : this.processedData;
    
    const metrics = calculateAreaMetrics(data, excludePIAR);
    this._calculationCache.set(cacheKey, metrics);
    
    return metrics;
  }
  
  /**
   * Obtiene métricas por grado (con cache)
   */
  getGradeMetrics(withPIAR = true) {
    const cacheKey = `grade_${withPIAR}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const data = withPIAR 
      ? this.processedData 
      : this.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
    
    const metrics = getMetricsByGrade(data);
    this._calculationCache.set(cacheKey, metrics);
    
    return metrics;
  }
  
  /**
   * Obtiene promedios por grado para gráficos
   */
  getGradeAverages() {
    const cacheKey = 'grade_averages';
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const averages = getGradeAverages(this.processedData);
    this._calculationCache.set(cacheKey, averages);
    
    return averages;
  }
  
  /**
   * Obtiene top performers por área
   */
  getTopByArea(area, n = 5) {
    const cacheKey = `top_area_${area}_${n}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const top = getTopByArea(this.processedData, area, n, false);
    this._calculationCache.set(cacheKey, top);
    
    return top;
  }
  
  /**
   * Obtiene top performers por grado
   */
  getTopByGrade(n = 3) {
    const cacheKey = `top_grade_${n}`;
    
    if (this._calculationCache.has(cacheKey)) {
      return this._calculationCache.get(cacheKey);
    }
    
    const top = getTop3ByGrade(this.processedData);
    this._calculationCache.set(cacheKey, top);
    
    return top;
  }
  
  /**
   * Limpia cache de cálculos
   */
  clearCache() {
    this._calculationCache.clear();
  }
  
  /**
   * Serializa para persistencia
   */
  toJSON() {
    return {
      year: this.year,
      rawData: this.rawData,
      filters: this.filters,
      metadata: this.metadata
    };
  }
  
  /**
   * Crea instancia desde JSON
   */
  static fromJSON(json) {
    const analysis = new Analysis(json.year, json.rawData);
    analysis.filters = json.filters;
    // Restaurar metadata si existe, sino se recalculará automáticamente
    if (json.metadata) {
      analysis.metadata = json.metadata;
    }
    return analysis;
  }
}
