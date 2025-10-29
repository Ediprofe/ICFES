/**
 * ✅ Sección HTML: Clasificación de Plantel
 * Orquestador principal de la sección de clasificación
 * 
 * Esta sección compara la clasificación del plantel entre grupos de cohortes
 * utilizando un sistema de índices por área y un índice global.
 */

import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';
import { 
  generateMethodologySection, 
  generateGroupSelectors, 
  generateResultsContainer 
} from './clasificacionPlantelComponents.js';
import { generateClasificacionScripts } from './clasificacionPlantelScripts.js';

/**
 * Genera la sección completa de clasificación de plantel
 * @param {Array} analyses - Array de objetos Analysis
 * @param {number} sectionNumber - Número de la sección
 * @returns {string} HTML completo de la sección
 */
export const generateClasificacionPlantelSection = (analyses, sectionNumber) => {
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  const years = sortedAnalyses.map(a => a.year);
  
  // Preparar datos para el script (solo año y processedData)
  const analysesData = sortedAnalyses.map(a => ({
    year: a.year,
    processedData: a.processedData
  }));
  
  return `
    <!-- Encabezado de la sección -->
    <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg p-4 mb-6">
      <h2 class="text-2xl font-bold">${sectionNumber}. Clasificación de plantel</h2>
      <p class="text-emerald-100 text-sm mt-1">Compara la clasificación del plantel entre grupos de cohortes basada en el índice global</p>
    </div>
    
    <!-- Metodología -->
    ${generateMethodologySection()}
    
    <!-- Selectores de grupos -->
    ${generateGroupSelectors(years)}
    
    <!-- Contenedor de resultados -->
    ${generateResultsContainer()}
    
    <!-- Scripts de cálculo y visualización -->
    <script>
      // Datos de análisis (solo año y processedData)
      const clasificacionAnalyses = ${JSON.stringify(analysesData)};
      
      // Áreas académicas
      const academicAreas = ${JSON.stringify(ACADEMIC_AREAS)};
      
      // ========================================
      // FUNCIONES DE CÁLCULO
      // ========================================
      
      /**
       * Calcula promedio y varianza usando Frecuencia Relativa Acumulada (FRA)
       */
      function calculateFRAStatistics(values) {
        if (values.length === 0) return { promedio: 0, varianza: 0 };
        
        // 1. Crear tabla de frecuencias (0-100)
        const frequencies = new Array(101).fill(0);
        values.forEach(val => {
          const roundedVal = Math.round(val);
          if (roundedVal >= 0 && roundedVal <= 100) {
            frequencies[roundedVal]++;
          }
        });
        
        // 2. Calcular frecuencias relativas
        const totalCount = values.length;
        const relativeFrequencies = frequencies.map(freq => freq / totalCount);
        
        // 3. Calcular frecuencias relativas acumuladas (FRA)
        // FRA acumula desde puntaje 100 hacia 0 (de mayor a menor)
        const cumulativeFrequencies = new Array(101);
        let cumulative = 0;
        for (let i = 100; i >= 0; i--) {
          cumulative += relativeFrequencies[i];
          cumulativeFrequencies[i] = cumulative;
        }
        
        // 4. Calcular Promedio = Σ(FRA) / 101
        const sumFRA = cumulativeFrequencies.reduce((sum, fra) => sum + fra, 0);
        const promedio = sumFRA / 101;
        
        // 5. Calcular Varianza = Σ(FRA - Promedio)² / 101
        let sumSquaredDiff = 0;
        for (let i = 0; i <= 100; i++) {
          const fra = cumulativeFrequencies[i];
          sumSquaredDiff += Math.pow(fra - promedio, 2);
        }
        const varianza = sumSquaredDiff / 101;
        
        return { promedio, varianza };
      }
      
      /**
       * Obtiene el top 80% de estudiantes por área
       */
      function getTop80Percent(students, areaField) {
        const validStudents = students.filter(s => {
          const score = s[areaField];
          return score !== null && score !== undefined && !isNaN(score);
        });
        if (validStudents.length === 0) return [];
        const sorted = [...validStudents].sort((a, b) => b[areaField] - a[areaField]);
        const top80Count = Math.ceil(sorted.length * 0.8);
        return sorted.slice(0, top80Count);
      }
      
      /**
       * Calcula el índice de un área académica
       */
      function calculateAreaIndex(students, areaField) {
        const top80 = getTop80Percent(students, areaField);
        if (top80.length === 0) {
          return { indice: 0, promedio: 0, varianza: 0, top80Count: 0, totalCount: students.length };
        }
        const scores = top80.map(s => s[areaField]);
        const { promedio, varianza } = calculateFRAStatistics(scores);
        const indice = promedio / (1 - varianza);
        return { indice, promedio, varianza, top80Count: top80.length, totalCount: students.length };
      }
      
      /**
       * Calcula el índice global del plantel
       */
      function calculateGlobalIndex(areaIndices) {
        const MA = areaIndices['Matemáticas']?.indice || 0;
        const LC = areaIndices['Lectura crítica']?.indice || 0;
        const CN = areaIndices['Ciencias naturales']?.indice || 0;
        const SC = areaIndices['Sociales y ciudadanas']?.indice || 0;
        const IN = areaIndices['Inglés']?.indice || 0;
        return ((3 * MA) + (3 * LC) + (3 * CN) + (3 * SC) + IN) / 13;
      }
      
      /**
       * Obtiene la clasificación según el índice global
       */
      function getClassification(globalIndex) {
        if (globalIndex >= 0.77) {
          return { categoria: 'A+', color: '#10b981', bgColor: '#d1fae5', descripcion: 'Excelente' };
        } else if (globalIndex >= 0.72) {
          return { categoria: 'A', color: '#22c55e', bgColor: '#dcfce7', descripcion: 'Muy bueno' };
        } else if (globalIndex >= 0.67) {
          return { categoria: 'B', color: '#eab308', bgColor: '#fef9c3', descripcion: 'Bueno' };
        } else if (globalIndex >= 0.62) {
          return { categoria: 'C', color: '#f97316', bgColor: '#fed7aa', descripcion: 'Regular' };
        } else {
          return { categoria: 'D', color: '#ef4444', bgColor: '#fecaca', descripcion: 'Necesita mejora' };
        }
      }
      
      /**
       * Calcula todos los índices para un grupo de cohortes
       */
      function calculateGroupIndices(analyses, years) {
        const allStudentsSinPIAR = [];
        years.forEach(year => {
          const analysis = analyses.find(a => a.year === year);
          if (analysis && analysis.processedData) {
            const studentsSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
            allStudentsSinPIAR.push(...studentsSinPIAR);
          }
        });
        if (allStudentsSinPIAR.length === 0) return null;
        
        const areaIndices = {};
        const areaDetails = [];
        academicAreas.forEach(area => {
          // IMPORTANTE: Usar columnName para acceder a los datos
          const areaIndex = calculateAreaIndex(allStudentsSinPIAR, area.columnName);
          areaIndices[area.name] = areaIndex;
          areaDetails.push({ areaId: area.id, areaName: area.name, color: area.color, ...areaIndex });
        });
        
        const globalIndex = calculateGlobalIndex(areaIndices);
        const classification = getClassification(globalIndex);
        
        return { years, totalStudents: allStudentsSinPIAR.length, areaIndices: areaDetails, globalIndex, classification };
      }
    </script>
    
    ${generateClasificacionScripts()}
  `;
};
