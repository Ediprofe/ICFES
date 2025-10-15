/**
 * ✅ Sección PDF: Comparación Multi-Año
 * Compara métricas entre diferentes años
 */

import { drawTable, drawBarChart } from '../pdfHelpers.js';
import { ACADEMIC_AREAS } from '../../../config/columnConfig.js';
import { prepareAreaChartData } from '../../charts/chartDataPreparation.js';

// Helper para convertir hex a RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 37, g: 99, b: 235 }; // blue-600 por defecto
};

/**
 * Genera la sección de comparación de métricas globales
 */
export const generateGlobalComparisonSection = (doc, analyses, startY) => {
  let currentY = startY;
  
  // Título de la sección con diseño mejorado
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(15, currentY - 8, 180, 12, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('1. COMPARACION DE METRICAS GLOBALES', 20, currentY);
  currentY += 10;
  
  // Ordenar análisis por año
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Subtítulo - Sin PIAR
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74); // green-600
  doc.text('SIN PIAR (Metricas Principales)', 20, currentY);
  currentY += 6;
  
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
  
  // Subtítulo - Con PIAR
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text('CON PIAR (Todos los Estudiantes)', 20, currentY);
  currentY += 6;
  
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
 * Genera gráficos de comparación de promedios y desviación estándar por año
 */
export const generateYearComparisonChart = (doc, analyses, startY) => {
  let currentY = startY;
  
  // Verificar si necesitamos nueva página
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }
  
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Preparar datos para el gráfico de promedios
  const chartDataPromedio = sortedAnalyses.map(analysis => {
    const metricsSinPIAR = analysis.getGlobalMetrics(true);
    const metricsConPIAR = analysis.getGlobalMetrics(false);
    
    return {
      area: analysis.year.toString(),
      sinPIAR: metricsSinPIAR.promedio,
      conPIAR: metricsConPIAR.promedio
    };
  });
  
  // Gráfico de Promedio
  currentY = drawBarChart(
    doc,
    chartDataPromedio,
    20,
    currentY,
    170,
    70,
    'Evolucion del Promedio Global por Año',
    {
      showComparison: true,
      useDynamicScale: true,
      showLabels: true
    }
  );
  
  currentY += 10;
  
  // Verificar espacio para segundo gráfico
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }
  
  // Preparar datos para el gráfico de desviación estándar
  const chartDataDesviacion = sortedAnalyses.map(analysis => {
    const metricsSinPIAR = analysis.getGlobalMetrics(true);
    const metricsConPIAR = analysis.getGlobalMetrics(false);
    
    return {
      area: analysis.year.toString(),
      sinPIAR: metricsSinPIAR.desviacion,
      conPIAR: metricsConPIAR.desviacion
    };
  });
  
  // Gráfico de Desviación Estándar
  currentY = drawBarChart(
    doc,
    chartDataDesviacion,
    20,
    currentY,
    170,
    70,
    'Evolucion de la Desviacion Estandar por Año',
    {
      showComparison: true,
      useDynamicScale: false,
      maxValue: 50,
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
  
  // Título de la sección con diseño mejorado
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(15, currentY - 8, 180, 12, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('2. COMPARACION POR AREAS ACADEMICAS', 20, currentY);
  currentY += 12;
  
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Para cada área académica
  ACADEMIC_AREAS.forEach((area) => {
    // Verificar espacio
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    
    // Nombre del área con color
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const areaColor = area.color || '#2563eb';
    const rgb = hexToRgb(areaColor);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text(area.name.toUpperCase(), 20, currentY);
    currentY += 6;
    
    // Tabla de comparación para esta área
    const columns = ['Año', 'Promedio Sin PIAR', 'Desv. Est.', 'Sin Outliers', 'Promedio Con PIAR'];
    const rows = sortedAnalyses.map(analysis => {
      // Usar la misma lógica que funciona en análisis de un solo año
      const chartData = prepareAreaChartData(analysis, true);
      
      // Buscar datos de esta área específica
      const areaData = chartData.promedios.find(item => item.areaId === area.id);
      const areaDesv = chartData.desviacion.find(item => item.areaId === area.id);
      
      if (!areaData || !areaDesv) {
        return [
          analysis.year.toString(),
          'N/A',
          'N/A',
          'N/A',
          'N/A'
        ];
      }
      
      return [
        analysis.year.toString(),
        areaData.sinPIAR.toFixed(2),
        areaDesv.sinPIAR.toFixed(2),
        areaData.sinOutliers.toFixed(2), // Promedio sin PIAR y sin outliers (±3σ)
        areaData.conPIAR.toFixed(2)
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
  
  // Título con diseño mejorado
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(15, currentY - 8, 180, 12, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('3. LISTADO COMPLETO DE ESTUDIANTES', 20, currentY);
  currentY += 12;
  
  const sortedAnalyses = [...analyses].sort((a, b) => a.year - b.year);
  
  // Recopilar todos los estudiantes (INCLUYE PIAR)
  const allStudents = [];
  sortedAnalyses.forEach(analysis => {
    const students = analysis.processedData; // No filtrar PIAR
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
  
  // Crear tabla con headers optimizados
  const columns = ['Año', 'Nombre', 'Apellido', 'Grado', 'Global', 'Lectura', 'Matemat.', 'Sociales', 'Natural.', 'Ingles'];
  const rows = allStudents.map(student => [
    student.year.toString(),
    student.nombre || '',
    student.apellido || '',
    student.grado || '',
    student.global != null ? student.global.toFixed(1) : 'N/A',
    student.lectura != null ? student.lectura.toFixed(1) : 'N/A',
    student.matematicas != null ? student.matematicas.toFixed(1) : 'N/A',
    student.sociales != null ? student.sociales.toFixed(1) : 'N/A',
    student.naturales != null ? student.naturales.toFixed(1) : 'N/A',
    student.ingles != null ? student.ingles.toFixed(1) : 'N/A'
  ]);
  
  currentY = drawTable(doc, columns, rows, currentY, {
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
      1: { halign: 'left', cellWidth: 28 },
      2: { halign: 'left', cellWidth: 30 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 22 },
      7: { halign: 'center', cellWidth: 20 },
      8: { halign: 'center', cellWidth: 20 },
      9: { halign: 'center', cellWidth: 18 }
    },
    margin: { left: 10, right: 10 } // Márgenes más pequeños para aprovechar espacio
  });
  
  // Agregar resumen al final
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Total de estudiantes: ${allStudents.length}`, 20, currentY + 5);
  
  return currentY;
};
