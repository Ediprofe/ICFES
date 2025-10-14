/**
 * ✅ Gestiona múltiples análisis y sus comparativas
 */

import { Analysis } from './Analysis.js';

export class MultiYearAnalysis {
  constructor() {
    this.analyses = new Map(); // Map<year, Analysis>
    this.baseYear = null;
    this.comparisonYears = [];
  }
  
  /**
   * Agrega un análisis
   */
  addAnalysis(year, data) {
    if (this.analyses.has(year)) {
      throw new Error(`Ya existe un análisis para el año ${year}`);
    }
    
    const analysis = new Analysis(year, data);
    this.analyses.set(year, analysis);
    
    // Si es el primero o el más reciente, establecerlo como base
    if (!this.baseYear || year > this.baseYear) {
      this.baseYear = year;
    }
    
    return analysis;
  }
  
  /**
   * Elimina un análisis
   */
  removeAnalysis(year) {
    this.analyses.delete(year);
    
    // Si se eliminó el año base, seleccionar el más reciente
    if (this.baseYear === year) {
      const years = this.getAvailableYears();
      this.baseYear = years.length > 0 ? years[0] : null;
    }
    
    // Remover de años de comparación
    this.comparisonYears = this.comparisonYears.filter(y => y !== year);
  }
  
  /**
   * Obtiene análisis base
   */
  getBaseAnalysis() {
    return this.analyses.get(this.baseYear);
  }
  
  /**
   * Obtiene análisis por año
   */
  getAnalysis(year) {
    return this.analyses.get(year);
  }
  
  /**
   * Obtiene análisis de comparación
   */
  getComparisonAnalyses() {
    return this.comparisonYears
      .map(year => this.analyses.get(year))
      .filter(a => a !== undefined);
  }
  
  /**
   * Obtiene años disponibles ordenados descendente
   */
  getAvailableYears() {
    return Array.from(this.analyses.keys()).sort((a, b) => b - a);
  }
  
  /**
   * Establece año base
   */
  setBaseYear(year) {
    if (!this.analyses.has(year)) {
      throw new Error(`No existe análisis para el año ${year}`);
    }
    this.baseYear = year;
  }
  
  /**
   * Agrega año a comparación
   */
  addComparisonYear(year) {
    if (!this.analyses.has(year)) {
      throw new Error(`No existe análisis para el año ${year}`);
    }
    if (year === this.baseYear) {
      throw new Error('No se puede comparar el año base consigo mismo');
    }
    if (!this.comparisonYears.includes(year)) {
      this.comparisonYears.push(year);
      this.comparisonYears.sort((a, b) => b - a);
    }
  }
  
  /**
   * Elimina año de comparación
   */
  removeComparisonYear(year) {
    this.comparisonYears = this.comparisonYears.filter(y => y !== year);
  }
  
  /**
   * Toggle año en comparación
   */
  toggleComparisonYear(year) {
    if (this.comparisonYears.includes(year)) {
      this.removeComparisonYear(year);
    } else {
      this.addComparisonYear(year);
    }
  }
  
  /**
   * Obtiene métricas comparativas
   */
  getComparativeMetrics(metricName, includeBase = true) {
    const years = includeBase 
      ? [this.baseYear, ...this.comparisonYears]
      : this.comparisonYears;
    
    return years
      .map(year => {
        const analysis = this.analyses.get(year);
        if (!analysis) return null;
        
        const metrics = analysis.getGlobalMetrics(true);
        return {
          year,
          value: metrics[metricName] || 0
        };
      })
      .filter(m => m !== null)
      .sort((a, b) => a.year - b.year);
  }
  
  /**
   * Calcula tendencia (regresión lineal simple)
   */
  getTrend(metricName) {
    const data = this.getComparativeMetrics(metricName, true);
    
    if (data.length < 2) {
      return { direction: 'neutral', slope: 0, data, prediction: null };
    }
    
    // Regresión lineal simple
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.year, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d) => sum + (d.year * d.value), 0);
    const sumX2 = data.reduce((sum, d) => sum + (d.year * d.year), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predicción para el próximo año
    const nextYear = Math.max(...data.map(d => d.year)) + 1;
    const prediction = slope * nextYear + intercept;
    
    return {
      direction: slope > 0.5 ? 'up' : slope < -0.5 ? 'down' : 'neutral',
      slope,
      intercept,
      data,
      prediction: {
        year: nextYear,
        value: prediction
      }
    };
  }
  
  /**
   * Obtiene cambio año sobre año
   */
  getYearOverYearChange(metricName) {
    const data = this.getComparativeMetrics(metricName, true);
    
    if (data.length < 2) return [];
    
    return data.slice(1).map((current, index) => {
      const previous = data[index];
      const change = current.value - previous.value;
      const changePercent = previous.value !== 0 
        ? (change / previous.value) * 100 
        : 0;
      
      return {
        year: current.year,
        value: current.value,
        change,
        changePercent,
        previousYear: previous.year,
        previousValue: previous.value
      };
    });
  }
  
  /**
   * Valida compatibilidad entre análisis
   */
  validateCompatibility() {
    const years = this.getAvailableYears();
    if (years.length < 2) return { valid: true, warnings: [] };
    
    const warnings = [];
    const baseAnalysis = this.getBaseAnalysis();
    
    if (!baseAnalysis) {
      return { valid: false, warnings: ['No hay análisis base definido'] };
    }
    
    // Verificar que todos tengan las mismas columnas básicas
    const baseGrades = new Set(baseAnalysis.metadata.grades);
    
    for (const year of years) {
      if (year === this.baseYear) continue;
      
      const analysis = this.analyses.get(year);
      const grades = new Set(analysis.metadata.grades);
      
      // Verificar grados diferentes
      const missingGrades = [...baseGrades].filter(g => !grades.has(g));
      const extraGrades = [...grades].filter(g => !baseGrades.has(g));
      
      if (missingGrades.length > 0 || extraGrades.length > 0) {
        warnings.push(
          `Año ${year}: Diferencias en grados. ` +
          `Faltantes: ${missingGrades.join(', ') || 'ninguno'}. ` +
          `Extras: ${extraGrades.join(', ') || 'ninguno'}`
        );
      }
    }
    
    return {
      valid: true,
      warnings
    };
  }
  
  /**
   * Serializa para persistencia
   */
  toJSON() {
    return {
      analyses: Array.from(this.analyses.entries()).map(([year, analysis]) => ({
        year,
        data: analysis.toJSON()
      })),
      baseYear: this.baseYear,
      comparisonYears: this.comparisonYears
    };
  }
  
  /**
   * Crea instancia desde JSON
   */
  static fromJSON(json) {
    const multiYear = new MultiYearAnalysis();
    
    // Restaurar análisis
    json.analyses.forEach(({ year, data }) => {
      const analysis = Analysis.fromJSON(data);
      multiYear.analyses.set(year, analysis);
    });
    
    multiYear.baseYear = json.baseYear;
    multiYear.comparisonYears = json.comparisonYears || [];
    
    return multiYear;
  }
}
