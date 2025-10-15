/**
 * ✅ Sección PDF: Comparación Multi-Año
 * Compara métricas entre diferentes años
 */

import { drawTable, drawBarChart } from '../pdfHelpers.js';
import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';

/**
 * Genera la sección de comparación de métricas globales
 */
export const generateGlobalComparisonSection = (doc, analyses, startY) => {
  let currentY = startY;
  
  // Título de la sección
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('📊 Comparación de Métricas Globales', 20, currentY);
  currentY += 10;
  
  // Ordenar análisis por año
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Tabla de comparación - Sin PIAR (métricas principales)
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0);
  doc.text('Sin PIAR (Métricas Principales)', 20, currentY);
  currentY += 8;
  
  const sinPIARColumns = ['Año', 'Estudiantes', 'Promedio', 'Desv. Est.', 'Mínimo', 'Máximo', 'Sin Outliers'];
  const sinPIARRows = sortedAnalyses.map(analysis => {
    const metrics = analysis.getGlobalMetrics(true, false); // excludePIAR = true, excludeOutliers = false
    const metricsNoOutliers = analysis.getGlobalMetrics(true, true); // excludePIAR = true, excludeOutliers = true
    
    return [
      analysis.year.toString(),
      analysis.metadata.studentsWithoutPIAR.toString(),
      typeof metrics.promedio === 'number' ? metrics.promedio.toFixed(2) : (metrics.promedio || 'N/A'),
      typeof metrics.desviacion === 'number' ? metrics.desviacion.toFixed(2) : (metrics.desviacion || 'N/A'),
      typeof metrics.minimo === 'number' ? metrics.minimo.toFixed(2) : (metrics.minimo || 'N/A'),
      typeof metrics.maximo === 'number' ? metrics.maximo.toFixed(2) : (metrics.maximo || 'N/A'),
      typeof metricsNoOutliers.promedio === 'number' ? metricsNoOutliers.promedio.toFixed(2) : (metricsNoOutliers.promedio || 'N/A')
    ];
  });
  
  currentY = drawTable(doc, sinPIARColumns, sinPIARRows, currentY, {
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold' },
      1: { halign: 'center' },
      2: { halign: 'center', fontStyle: 'bold', textColor: [22, 163, 74] },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center', textColor: [59, 130, 246] }
    }
  });
  
  currentY += 5;
  
  // Tabla de comparación - Con PIAR
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0);
  doc.text('Con PIAR', 20, currentY);
  currentY += 8;
  
  const conPIARColumns = ['Año', 'Estudiantes', 'Promedio', 'Desv. Est.', 'Mínimo', 'Máximo'];
  const conPIARRows = sortedAnalyses.map(analysis => {
    const metricsPIAR = analysis.getGlobalMetrics(false, false); // excludePIAR = false (incluye todos), excludeOutliers = false
    
    return [
      analysis.year.toString(),
      analysis.metadata.totalStudents.toString(), // Total de estudiantes (con y sin PIAR)
      typeof metricsPIAR.promedio === 'number' ? metricsPIAR.promedio.toFixed(2) : (metricsPIAR.promedio || 'N/A'),
      typeof metricsPIAR.desviacion === 'number' ? metricsPIAR.desviacion.toFixed(2) : (metricsPIAR.desviacion || 'N/A'),
      typeof metricsPIAR.minimo === 'number' ? metricsPIAR.minimo.toFixed(2) : (metricsPIAR.minimo || 'N/A'),
      typeof metricsPIAR.maximo === 'number' ? metricsPIAR.maximo.toFixed(2) : (metricsPIAR.maximo || 'N/A')
    ];
  });
  
  currentY = drawTable(doc, conPIARColumns, conPIARRows, currentY, {
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold' },
      1: { halign: 'center' },
      2: { halign: 'center', fontStyle: 'bold' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' }
    }
  });
  
  return currentY;
};

/**
 * Genera gráfico de comparación de promedios por año
 */
export const generateYearComparisonChart = (doc, analyses, startY) => {
  let currentY = startY;
  
  // Verificar si necesitamos nueva página
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }
  
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Preparar datos para el gráfico
  const chartData = sortedAnalyses.map(analysis => {
    const metricsSinPIAR = analysis.getGlobalMetrics(true);
    const metricsConPIAR = analysis.getGlobalMetrics(false);
    
    return {
      area: analysis.year.toString(),
      sinPIAR: metricsSinPIAR.promedio,
      conPIAR: metricsConPIAR.promedio
    };
  });
  
  currentY = drawBarChart(
    doc,
    chartData,
    20,
    currentY,
    170,
    80,
    'Evolución del Promedio Global por Año',
    {
      showComparison: true,
      useDynamicScale: true,
      showLabels: true
    }
  );
  
  return currentY;
};

/**
 * Genera comparación por áreas académicas
 */
export const generateAreaComparisonSection = (doc, analyses, startY) => {
  let currentY = startY;
  
  // Verificar si necesitamos nueva página
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }
  
  // Título de la sección
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('📚 Comparación por Áreas Académicas', 20, currentY);
  currentY += 10;
  
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Para cada área académica
  ACADEMIC_AREAS.forEach((area) => {
    // Verificar espacio
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text(`${area.name}`, 20, currentY);
    currentY += 8;
    
    // Tabla de comparación para esta área
    const columns = ['Año', 'Promedio Sin PIAR', 'Desv. Est.', 'Sin Outliers', 'Promedio Con PIAR'];
    const rows = sortedAnalyses.map(analysis => {
      const allMetricsSinPIAR = analysis.getAreaMetrics(true); // excludePIAR = true (sin PIAR)
      const allMetricsConPIAR = analysis.getAreaMetrics(false); // excludePIAR = false (con todos)
      
      // Buscar métricas de esta área específica
      const metricsSinPIAR = allMetricsSinPIAR.find(m => m.areaId === area.id) || {};
      const metricsConPIAR = allMetricsConPIAR.find(m => m.areaId === area.id) || {};
      
      return [
        analysis.year.toString(),
        typeof metricsSinPIAR.promedio === 'number' ? metricsSinPIAR.promedio.toFixed(2) : 'N/A',
        typeof metricsSinPIAR.desviacion === 'number' ? metricsSinPIAR.desviacion.toFixed(2) : 'N/A',
        typeof metricsSinPIAR.promedio === 'number' ? metricsSinPIAR.promedio.toFixed(2) : 'N/A', // Por ahora usamos el mismo
        typeof metricsConPIAR.promedio === 'number' ? metricsConPIAR.promedio.toFixed(2) : 'N/A'
      ];
    });
    
    currentY = drawTable(doc, columns, rows, currentY, {
      columnStyles: {
        0: { halign: 'center', fontStyle: 'bold' },
        1: { halign: 'center', fontStyle: 'bold', textColor: [22, 163, 74] },
        2: { halign: 'center' },
        3: { halign: 'center', textColor: [59, 130, 246] },
        4: { halign: 'center', textColor: [107, 114, 128] }
      }
    });
    
    currentY += 5;
  });
  
  return currentY;
};

/**
 * Genera tabla extendida de todos los estudiantes de todos los años
 */
export const generateAllStudentsTable = (doc, analyses, startY) => {
  let currentY = startY;
  
  // Nueva página para la tabla
  doc.addPage();
  currentY = 20;
  
  // Título
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('📋 Listado Completo de Estudiantes (Todos los Años)', 20, currentY);
  currentY += 10;
  
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Recopilar todos los estudiantes
  const allStudents = [];
  sortedAnalyses.forEach(analysis => {
    const students = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
    students.forEach(student => {
      allStudents.push({
        year: analysis.year,
        nombre: student.Nombre,
        apellido: student.Apellido,
        grado: student.Grupo,
        global: student.Global,
        lectura: student['Lectura crítica'],
        matematicas: student.Matemáticas,
        sociales: student.Sociales,
        naturales: student.Naturales,
        ingles: student.Inglés
      });
    });
  });
  
  // Ordenar por año y luego por puntaje global
  allStudents.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return b.global - a.global;
  });
  
  // Crear tabla
  const columns = ['Año', 'Nombre', 'Apellido', 'Grado', 'Global', 'Lect.', 'Mat.', 'Soc.', 'Nat.', 'Ing.'];
  const rows = allStudents.map(student => [
    student.year.toString(),
    student.nombre,
    student.apellido,
    student.grado,
    student.global.toFixed(1),
    student.lectura.toFixed(1),
    student.matematicas.toFixed(1),
    student.sociales.toFixed(1),
    student.naturales.toFixed(1),
    student.ingles.toFixed(1)
  ]);
  
  currentY = drawTable(doc, columns, rows, currentY, {
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 15 },
      1: { halign: 'left', cellWidth: 25 },
      2: { halign: 'left', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 15 },
      6: { halign: 'center', cellWidth: 15 },
      7: { halign: 'center', cellWidth: 15 },
      8: { halign: 'center', cellWidth: 15 },
      9: { halign: 'center', cellWidth: 15 }
    }
  });
  
  // Agregar resumen al final
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Total de estudiantes: ${allStudents.length}`, 20, currentY + 5);
  
  return currentY;
};
