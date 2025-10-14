import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateAreaMetrics, getTop5BySubject, getTop3ByGrade, getMetricsByGrade, getGradeAverages, findOutliers, mean, stdDev, zScore, getMetricsComparison } from './calculations';

// Función auxiliar para dibujar gráfico de barras en el PDF
const drawBarChart = (doc, data, x, y, width, height, title, yAxisMax = 100, showComparison = true, useDynamicScale = false, isOutlierComparison = false) => {
  const barWidth = width / (data.length * (showComparison ? 2.5 : 1.5));
  const chartHeight = height - 35; // Dejar espacio para título y ejes
  const barSpacing = barWidth * 0.3;
  
  // Calcular escala dinámica si se solicita
  let dynamicMin = 0;
  let dynamicMax = yAxisMax;
  
  if (useDynamicScale) {
    const allValues = data.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v !== undefined && v > 0);
    if (allValues.length > 0) {
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const padding = (maxValue - minValue) * 0.15; // 15% de padding
      dynamicMin = Math.max(0, Math.floor(minValue - padding));
      dynamicMax = Math.ceil(maxValue + padding);
    }
  }
  
  const scaleMin = useDynamicScale ? dynamicMin : 0;
  const scaleMax = useDynamicScale ? dynamicMax : yAxisMax;
  
  // Título del gráfico
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, x + width / 2, y, { align: 'center' });
  
  y += 10;
  
  // Dibujar eje Y con líneas de referencia
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  
  // Líneas horizontales de referencia
  for (let i = 0; i <= 5; i++) {
    const yLine = y + chartHeight - (i * chartHeight / 5);
    doc.line(x, yLine, x + width, yLine);
    
    // Etiquetas del eje Y (usar escala dinámica)
    doc.setFontSize(8);
    doc.setTextColor(100);
    const label = (scaleMin + ((scaleMax - scaleMin) / 5) * i).toFixed(0);
    doc.text(label, x - 5, yLine + 1, { align: 'right' });
  }
  
  doc.setTextColor(0);
  
  // Dibujar barras
  const areaColors = {
    'Lectura': [59, 130, 246],
    'Matemáticas': [239, 68, 68],
    'Sociales': [249, 115, 22],
    'Naturales': [34, 197, 94],
    'Inglés': [168, 85, 247]
  };
  
  // Detectar si son grados (todos empiezan con "Grado")
  const isGradeChart = data.length > 0 && data[0].area.startsWith('Grado');
  const gradeColor = [99, 102, 241]; // Color índigo para grados
  
  data.forEach((item, index) => {
    // Usar color índigo para grados, o colores específicos para áreas
    const color = isGradeChart ? gradeColor : (areaColors[item.area] || [37, 99, 235]);
    const xPos = x + (index * (barWidth * (showComparison ? 2.5 : 1.5)));
    
    if (showComparison && item.conPIAR !== undefined) {
      // Barra con PIAR (gris, más tenue)
      const normalizedConPIAR = (item.conPIAR - scaleMin) / (scaleMax - scaleMin);
      const barHeightConPIAR = normalizedConPIAR * chartHeight;
      doc.setFillColor(156, 163, 175); // Gris
      doc.setDrawColor(107, 114, 128);
      doc.setLineWidth(0.5);
      doc.rect(xPos, y + chartHeight - barHeightConPIAR, barWidth - barSpacing, barHeightConPIAR, 'FD');
      
      // Etiqueta con PIAR
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.setFont(undefined, 'bold');
      doc.text(item.conPIAR.toFixed(1), xPos + (barWidth - barSpacing) / 2, y + chartHeight - barHeightConPIAR - 2, { align: 'center' });
    }
    
    // Barra sin PIAR (color del área)
    const xPosSinPIAR = showComparison ? xPos + barWidth : xPos;
    const normalizedSinPIAR = (item.sinPIAR - scaleMin) / (scaleMax - scaleMin);
    const barHeightSinPIAR = normalizedSinPIAR * chartHeight;
    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8);
    doc.setLineWidth(0.5);
    doc.rect(xPosSinPIAR, y + chartHeight - barHeightSinPIAR, barWidth - barSpacing, barHeightSinPIAR, 'FD');
    
    // Etiqueta sin PIAR
    doc.setFontSize(8);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont(undefined, 'bold');
    doc.text(item.sinPIAR.toFixed(1), xPosSinPIAR + (barWidth - barSpacing) / 2, y + chartHeight - barHeightSinPIAR - 2, { align: 'center' });
    
    // Etiqueta del eje X (nombre del área)
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    const labelX = showComparison ? xPos + barWidth : xPos + (barWidth - barSpacing) / 2;
    doc.text(item.area, labelX, y + chartHeight + 8, { align: 'center', maxWidth: barWidth * (showComparison ? 2 : 1) });
  });
  
  // Leyenda
  if (showComparison) {
    const legendY = y + chartHeight + 15;
    doc.setFontSize(8);
    
    if (isOutlierComparison) {
      // Con outliers
      doc.setFillColor(156, 163, 175);
      doc.rect(x + width / 2 - 40, legendY - 2, 4, 4, 'F');
      doc.setTextColor(100);
      doc.text('Con outliers', x + width / 2 - 33, legendY + 1);
      
      // Sin outliers
      doc.setFillColor(34, 197, 94);
      doc.rect(x + width / 2 + 5, legendY - 2, 4, 4, 'F');
      doc.setTextColor(100);
      doc.text('Sin outliers', x + width / 2 + 12, legendY + 1);
    } else {
      // Con PIAR
      doc.setFillColor(156, 163, 175);
      doc.rect(x + width / 2 - 35, legendY - 2, 4, 4, 'F');
      doc.setTextColor(100);
      doc.text('Con PIAR', x + width / 2 - 28, legendY + 1);
      
      // Sin PIAR
      doc.setFillColor(34, 197, 94);
      doc.rect(x + width / 2 + 5, legendY - 2, 4, 4, 'F');
      doc.setTextColor(100);
      doc.text('Sin PIAR', x + width / 2 + 12, legendY + 1);
    }
  }
  
  doc.setTextColor(0);
};

export const generatePDF = (data) => {
  console.log('Iniciando generación de PDF con', data.length, 'estudiantes');
  
  const doc = new jsPDF();
  
  // Asignar autoTable al documento para compatibilidad con jsPDF 3.x
  if (!doc.autoTable && autoTable) {
    doc.autoTable = autoTable.bind(null, doc);
  }
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let pageNumber = 0;
  
  // Función para agregar pie de página
  const addFooter = () => {
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100);
    
    // Línea superior del pie de página
    doc.setDrawColor(200);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    // Texto del pie de página
    doc.text('Análisis de puntajes - Informe de resultados', 14, footerY);
    doc.text(`Página ${pageNumber}`, pageWidth - 14, footerY, { align: 'right' });
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, pageWidth / 2, footerY, { align: 'center' });
    
    // Resetear color
    doc.setTextColor(0);
  };
  
  // Función para agregar nueva página con pie
  const addNewPage = () => {
    doc.addPage();
    pageNumber++;
    addFooter();
  };
  
  let yPos = 20;
  
  // PÁGINA 1: Portada
  pageNumber = 1;
  
  // Rectángulo de encabezado
  doc.setFillColor(37, 99, 235); // Color azul primary
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.text('Análisis de puntajes', pageWidth / 2, 25, { align: 'center' });
  doc.setFont(undefined, 'normal');
  doc.setFontSize(12);
  doc.text('Informe de resultados académicos', pageWidth / 2, 38, { align: 'center' });
  
  // Información general
  doc.setTextColor(0);
  yPos = 70;
  
  // Caja de información
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(30, yPos, pageWidth - 60, 50, 3, 3);
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Información general', pageWidth / 2, yPos + 10, { align: 'center' });
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(12);
  const fechaGeneracion = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Fecha de generación: ${fechaGeneracion}`, pageWidth / 2, yPos + 22, { align: 'center' });
  doc.text(`Total de estudiantes analizados: ${data.length}`, pageWidth / 2, yPos + 32, { align: 'center' });
  
  const countSinPIAR = data.filter(s => s['¿PIAR?'] !== 'Sí').length;
  doc.text(`Estudiantes sin PIAR: ${countSinPIAR}`, pageWidth / 2, yPos + 42, { align: 'center' });
  
  // Descripción
  yPos = 140;
  doc.setFontSize(11);
  doc.setTextColor(60);
  const descripcion = [
    'Este informe presenta un análisis completo de los resultados académicos,',
    'incluyendo métricas por área, clasificaciones de estudiantes destacados,',
    'y análisis estadísticos detallados para cada una de las áreas evaluadas.'
  ];
  descripcion.forEach((linea, i) => {
    doc.text(linea, pageWidth / 2, yPos + (i * 7), { align: 'center' });
  });
  
  addFooter();
  
  // PÁGINA 2: Detalle completo de estudiantes con promedios por área
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('1. Detalle de puntajes por estudiante', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  
  // Crear tabla con todos los puntajes por área
  doc.autoTable({
    startY: 28,
    head: [['#', 'Nombre Completo', 'Grupo', 'Lectura', 'Matemát.', 'Sociales', 'Naturales', 'Inglés', 'Global']],
    body: sortedData.map((s, i) => [
      i + 1,
      `${s.Nombre} ${s.Apellido}`,
      s.Grupo,
      s['Lectura crítica'] !== null ? s['Lectura crítica'].toFixed(1) : 'N/A',
      s['Matemáticas'] !== null ? s['Matemáticas'].toFixed(1) : 'N/A',
      s['Sociales'] !== null ? s['Sociales'].toFixed(1) : 'N/A',
      s['Naturales'] !== null ? s['Naturales'].toFixed(1) : 'N/A',
      s['Inglés'] !== null ? s['Inglés'].toFixed(1) : 'N/A',
      s.Global.toFixed(2)
    ]),
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235], 
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center'
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontSize: 7 },
      1: { cellWidth: 50, fontSize: 8 },
      2: { cellWidth: 20, halign: 'center', fontSize: 8 },
      3: { cellWidth: 18, halign: 'center', fontSize: 8 },
      4: { cellWidth: 18, halign: 'center', fontSize: 8 },
      5: { cellWidth: 18, halign: 'center', fontSize: 8 },
      6: { cellWidth: 18, halign: 'center', fontSize: 8 },
      7: { cellWidth: 18, halign: 'center', fontSize: 8 },
      8: { cellWidth: 20, halign: 'center', fontStyle: 'bold', textColor: [37, 99, 235], fontSize: 9 }
    },
    margin: { bottom: 25 },
    styles: { fontSize: 8 },
    didDrawPage: (data) => {
      if (data.pageNumber > pageNumber) {
        pageNumber = data.pageNumber;
        addFooter();
      }
    }
  });
  
  // PÁGINA 2.5: Métricas globales
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('2. Métricas globales', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  // Calcular datos
  const allData = data;
  const dataConPIAR = allData;
  const dataSinPIAR = allData.filter(s => s['¿PIAR?'] !== 'Sí');
  const globalAvgConPIAR = mean(dataConPIAR.map(s => s.Global)).toFixed(2);
  const globalAvgSinPIAR = mean(dataSinPIAR.map(s => s.Global)).toFixed(2);
  
  yPos = 30;
  
  // Título de sección
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Promedios globales (comparación con/sin PIAR)', 14, yPos);
  doc.setFont(undefined, 'normal');
  
  yPos += 10;
  
  // Cajas de promedios globales
  const boxWidth = (pageWidth - 40) / 2;
  const boxHeight = 35;
  const boxX1 = 14;
  const boxX2 = 14 + boxWidth + 6;
  
  // Caja Con PIAR (gris, menos prominente)
  doc.setDrawColor(156, 163, 175);
  doc.setLineWidth(1);
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(boxX1, yPos, boxWidth, boxHeight, 3, 3, 'FD');
  
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text('Promedio global (con PIAR)', boxX1 + 5, yPos + 8);
  
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text(globalAvgConPIAR, boxX1 + boxWidth / 2, yPos + 22, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`${dataConPIAR.length} estudiantes`, boxX1 + boxWidth / 2, yPos + 30, { align: 'center' });
  
  // Caja Sin PIAR (verde, destacada)
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(2);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(boxX2, yPos, boxWidth, boxHeight, 3, 3, 'FD');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('Promedio global (sin PIAR)', boxX2 + 5, yPos + 8);
  
  doc.setFontSize(26);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(22, 163, 74);
  doc.text(globalAvgSinPIAR, boxX2 + boxWidth / 2, yPos + 22, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text(`${dataSinPIAR.length} estudiantes`, boxX2 + boxWidth / 2, yPos + 30, { align: 'center' });
  
  // Otras métricas
  yPos += boxHeight + 15;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0);
  doc.text('Otras métricas', 14, yPos);
  doc.setFont(undefined, 'normal');
  
  yPos += 8;
  
  // Cajas de otras métricas
  const smallBoxWidth = (pageWidth - 40) / 2;
  const smallBoxHeight = 28;
  
  // Total de estudiantes
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(1);
  doc.setFillColor(250, 245, 255);
  doc.roundedRect(boxX1, yPos, smallBoxWidth, smallBoxHeight, 3, 3, 'FD');
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Total de estudiantes', boxX1 + 5, yPos + 8);
  
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(168, 85, 247);
  doc.text(String(data.length), boxX1 + smallBoxWidth / 2, yPos + 20, { align: 'center' });
  
  // Estudiantes excepcionales
  const outliersCount = findOutliers(data).length;
  doc.setDrawColor(234, 179, 8);
  doc.setLineWidth(1);
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(boxX2, yPos, smallBoxWidth, smallBoxHeight, 3, 3, 'FD');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100);
  doc.text('Estudiantes excepcionales', boxX2 + 5, yPos + 8);
  
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(234, 179, 8);
  doc.text(String(outliersCount), boxX2 + smallBoxWidth / 2, yPos + 20, { align: 'center' });
  
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0);
  
  // PÁGINA 3: Métricas por área
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('3. Métricas por área', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  // Comparación por área
  yPos = 30;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Comparación por área (con/sin PIAR)', 14, yPos);
  doc.setFont(undefined, 'normal');
  
  const metricsConPIAR = calculateAreaMetrics(data, false);
  const metricsSinPIAR = calculateAreaMetrics(data, true);
  
  doc.autoTable({
    startY: yPos + 5,
    head: [['Área', 'Promedio\n(con PIAR)', 'Promedio\n(sin PIAR)', 'Desv. Est.\n(con PIAR)', 'Desv. Est.\n(sin PIAR)']],
    body: metricsConPIAR.map((m, i) => [
      m.area,
      m.promedio,
      metricsSinPIAR[i].promedio,
      m.desviacion,
      metricsSinPIAR[i].desviacion
    ]),
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontStyle: 'bold', halign: 'center' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { halign: 'center', cellWidth: 30 },
      2: { halign: 'center', cellWidth: 30, fillColor: [220, 252, 231], textColor: [22, 101, 52] },
      3: { halign: 'center', cellWidth: 30 },
      4: { halign: 'center', cellWidth: 30, fillColor: [220, 252, 231], textColor: [22, 101, 52] }
    },
    margin: { bottom: 25 },
    didDrawPage: (data) => {
      if (data.pageNumber > pageNumber) {
        pageNumber = data.pageNumber;
        addFooter();
      }
    }
  });
  
  // PÁGINA 4: Top 5 por área
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('4. Top 5 estudiantes por área', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  const areaColors = {
    'Lectura crítica': [59, 130, 246],
    'Matemáticas': [239, 68, 68],
    'Sociales': [249, 115, 22],
    'Naturales': [34, 197, 94],
    'Inglés': [168, 85, 247]
  };
  
  let y = 28;
  subjects.forEach((subject, index) => {
    const top5 = getTop5BySubject(data, subject);
    const color = areaColors[subject] || [37, 99, 235];
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`${subject}`, 14, y);
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    
    doc.autoTable({
      startY: y + 2,
      head: [['Pos', 'Nombre Completo', 'Puntaje']],
      body: top5.map((s, i) => [i + 1, s.nombreCompleto, s.puntaje.toFixed(2)]),
      theme: 'striped',
      headStyles: { fillColor: color, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14, bottom: 25 },
      didDrawPage: (data) => {
        if (data.pageNumber > pageNumber) {
          pageNumber = data.pageNumber;
          addFooter();
        }
      }
    });
    
    y = doc.lastAutoTable.finalY + 8;
    
    // Si estamos muy abajo y no es la última área, añadir nueva página
    if (y > 240 && index < subjects.length - 1) {
      addNewPage();
      
      // Repetir encabezado de sección
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('4. Top 5 estudiantes por área (continuación)', 14, 13);
      doc.setTextColor(0);
      doc.setFont(undefined, 'normal');
      
      y = 28;
    }
  });
  
  // PÁGINA 5: Top 3 por grado
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('5. Top 3 estudiantes por grado', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  const top3ByGrade = getTop3ByGrade(data);
  let yGrade = 28;
  
  top3ByGrade.forEach(({ grado, top }, index) => {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(99, 102, 241); // Color índigo
    doc.text(`Grado ${grado}`, 14, yGrade);
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    
    doc.autoTable({
      startY: yGrade + 2,
      head: [['Pos', 'Nombre Completo', 'Global']],
      body: top.map((s, i) => [i + 1, s.nombreCompleto, s.global.toFixed(2)]),
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14, bottom: 25 },
      didDrawPage: (data) => {
        if (data.pageNumber > pageNumber) {
          pageNumber = data.pageNumber;
          addFooter();
        }
      }
    });
    
    yGrade = doc.lastAutoTable.finalY + 8;
    
    if (yGrade > 240 && index < top3ByGrade.length - 1) {
      addNewPage();
      
      // Repetir encabezado de sección
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('5. Top 3 estudiantes por grado (continuación)', 14, 13);
      doc.setTextColor(0);
      doc.setFont(undefined, 'normal');
      
      yGrade = 28;
    }
  });
  
  // NUEVA SECCIÓN: Métricas por Grado (comparación con/sin PIAR)
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('6. Métricas por grado (comparación con/sin PIAR)', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  const metricsByGrade = getMetricsByGrade(data);
  let yGradeMetrics = 28;
  
  metricsByGrade.forEach(({ grado, totalEstudiantes, estudiantesSinPIAR, metricsConPIAR, metricsSinPIAR }, index) => {
    // Título del grado
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(`Grado ${grado}`, 14, yGradeMetrics);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text(`${totalEstudiantes} estudiantes total | ${estudiantesSinPIAR} sin PIAR`, 14, yGradeMetrics + 5);
    doc.setTextColor(0);
    
    // Tabla de métricas
    doc.autoTable({
      startY: yGradeMetrics + 8,
      head: [
        ['Área', 'Promedio\n(con PIAR)', 'Promedio\n(sin PIAR)', 'Desv. Est.\n(con PIAR)', 'Desv. Est.\n(sin PIAR)']
      ],
      body: metricsConPIAR.map((m, i) => [
        m.subject,
        m.promedio,
        metricsSinPIAR[i].promedio,
        m.desviacion,
        metricsSinPIAR[i].desviacion
      ]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], fontStyle: 'bold', halign: 'center', fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { halign: 'center', cellWidth: 30 },
        2: { halign: 'center', cellWidth: 30, fillColor: [220, 252, 231], textColor: [22, 101, 52], fontStyle: 'bold' },
        3: { halign: 'center', cellWidth: 30 },
        4: { halign: 'center', cellWidth: 30, fillColor: [220, 252, 231], textColor: [22, 101, 52], fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14, bottom: 25 },
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        if (data.pageNumber > pageNumber) {
          pageNumber = data.pageNumber;
          addFooter();
        }
      }
    });
    
    yGradeMetrics = doc.lastAutoTable.finalY + 10;
    
    // Si estamos muy abajo y no es el último grado, añadir nueva página
    if (yGradeMetrics > 220 && index < metricsByGrade.length - 1) {
      addNewPage();
      
      // Repetir encabezado de sección
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('6. Métricas por grado (continuación)', 14, 13);
      doc.setTextColor(0);
      doc.setFont(undefined, 'normal');
      
      yGradeMetrics = 28;
    }
  });
  
  // NUEVA SECCIÓN: Análisis detallado por grado y área
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('7. Análisis detallado: Grado por área', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  // Descripción
  yPos = 28;
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text('Tabla comparativa de promedios por grado en cada área, mostrando la diferencia con/sin PIAR', 14, yPos);
  doc.setTextColor(0);
  
  yPos += 8;
  
  // Preparar datos para la tabla: cada fila es un grado, cada columna es un área
  const metricsByGradeForTable = getMetricsByGrade(data);
  
  // Crear tabla con promedios
  const tableHeaderPromedio = [
    'Grado',
    'Lectura\n(con PIAR)',
    'Lectura\n(sin PIAR)',
    'Matemát.\n(con PIAR)',
    'Matemát.\n(sin PIAR)',
    'Sociales\n(con PIAR)',
    'Sociales\n(sin PIAR)',
    'Naturales\n(con PIAR)',
    'Naturales\n(sin PIAR)',
    'Inglés\n(con PIAR)',
    'Inglés\n(sin PIAR)'
  ];
  
  const tableBodyPromedio = metricsByGradeForTable.map(gradeData => {
    const row = [gradeData.grado];
    
    gradeData.metricsConPIAR.forEach((metricConPIAR, index) => {
      const metricSinPIAR = gradeData.metricsSinPIAR[index];
      row.push(metricConPIAR.promedio);
      row.push(metricSinPIAR.promedio);
    });
    
    return row;
  });
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Promedios por grado y área', 14, yPos);
  doc.setFont(undefined, 'normal');
  
  doc.autoTable({
    startY: yPos + 3,
    head: [tableHeaderPromedio],
    body: tableBodyPromedio,
    theme: 'grid',
    headStyles: { 
      fillColor: [37, 99, 235], 
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold', halign: 'center', fillColor: [245, 247, 250] },
      1: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      2: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      3: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      4: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      5: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      6: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      7: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      8: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      9: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      10: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' }
    },
    styles: { fontSize: 7, cellPadding: 2 },
    margin: { bottom: 25 },
    didDrawPage: (data) => {
      if (data.pageNumber > pageNumber) {
        pageNumber = data.pageNumber;
        addFooter();
      }
    }
  });
  
  // Tabla de desviaciones estándar
  yPos = doc.lastAutoTable.finalY + 12;
  
  // Si no cabe en la página, crear nueva
  if (yPos > 220) {
    addNewPage();
    
    // Repetir encabezado de sección
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('7. Análisis detallado: Grado por área (continuación)', 14, 13);
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    
    yPos = 28;
  }
  
  const tableHeaderDesviacion = [
    'Grado',
    'Lectura\n(con PIAR)',
    'Lectura\n(sin PIAR)',
    'Matemát.\n(con PIAR)',
    'Matemát.\n(sin PIAR)',
    'Sociales\n(con PIAR)',
    'Sociales\n(sin PIAR)',
    'Naturales\n(con PIAR)',
    'Naturales\n(sin PIAR)',
    'Inglés\n(con PIAR)',
    'Inglés\n(sin PIAR)'
  ];
  
  const tableBodyDesviacion = metricsByGradeForTable.map(gradeData => {
    const row = [gradeData.grado];
    
    gradeData.metricsConPIAR.forEach((metricConPIAR, index) => {
      const metricSinPIAR = gradeData.metricsSinPIAR[index];
      row.push(metricConPIAR.desviacion);
      row.push(metricSinPIAR.desviacion);
    });
    
    return row;
  });
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0);
  doc.text('Desviación estándar por grado y área', 14, yPos);
  doc.setFont(undefined, 'normal');
  
  doc.autoTable({
    startY: yPos + 3,
    head: [tableHeaderDesviacion],
    body: tableBodyDesviacion,
    theme: 'grid',
    headStyles: { 
      fillColor: [37, 99, 235], 
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold', halign: 'center', fillColor: [245, 247, 250] },
      1: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      2: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      3: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      4: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      5: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      6: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      7: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      8: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
      9: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [243, 244, 246], textColor: [107, 114, 128] },
      10: { cellWidth: 16, halign: 'center', fontSize: 7, fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' }
    },
    styles: { fontSize: 7, cellPadding: 2 },
    margin: { bottom: 25 },
    didDrawPage: (data) => {
      if (data.pageNumber > pageNumber) {
        pageNumber = data.pageNumber;
        addFooter();
      }
    }
  });
  
  // NUEVA SECCIÓN: Gráficos de barras por grado y área (PROMEDIOS)
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(99, 102, 241); // Color índigo
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('7.1. Gráficos: Promedios por grado y área', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  // Descripción
  yPos = 28;
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text('Visualización gráfica de los promedios por grado en cada área académica', 14, yPos);
  doc.setTextColor(0);
  
  // Preparar datos para gráficos por área
  const subjectsForGradeCharts = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  const metricsByGradeForCharts = getMetricsByGrade(data);
  
  yPos += 10;
  let chartCount = 0;
  
  subjectsForGradeCharts.forEach((subject) => {
    // Preparar datos para este subject
    const chartData = metricsByGradeForCharts.map(gradeData => {
      const metricConPIAR = gradeData.metricsConPIAR.find(m => m.subject === subject);
      const metricSinPIAR = gradeData.metricsSinPIAR.find(m => m.subject === subject);
      
      return {
        area: gradeData.grado,
        conPIAR: parseFloat(metricConPIAR.promedio) || 0,
        sinPIAR: parseFloat(metricSinPIAR.promedio) || 0
      };
    });
    
    // Calcular escala dinámica para promedios (la función drawBarChart la usa internamente)
    const allPromedios = chartData.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v > 0);
    const minPromedio = Math.min(...allPromedios);
    const maxPromedio = Math.max(...allPromedios);
    const padding = (maxPromedio - minPromedio) * 0.15;
    Math.max(0, Math.floor(minPromedio - padding)); // Para referencia de escala
    Math.ceil(maxPromedio + padding); // Para referencia de escala
    
    // Dibujar gráfico (2 por página)
    const chartWidth = pageWidth - 40;
    const chartHeight = 60;
    const xPos = 20;
    
    if (chartCount > 0 && chartCount % 2 === 0) {
      // Nueva página cada 2 gráficos
      addNewPage();
      
      // Repetir encabezado de sección
      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('7.1. Gráficos: Promedios por grado y área (continuación)', 14, 13);
      doc.setTextColor(0);
      doc.setFont(undefined, 'normal');
      
      yPos = 28;
    }
    
    drawBarChart(doc, chartData, xPos, yPos, chartWidth, chartHeight, subject, 100, true, true);
    
    yPos += chartHeight + 20;
    chartCount++;
  });
  
  // NUEVA SECCIÓN: Gráficos de barras por grado y área (DESVIACIONES)
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('7.2. Gráficos: Desviación estándar por grado y área', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  // Descripción
  yPos = 28;
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text('Visualización gráfica de las desviaciones estándar por grado en cada área académica', 14, yPos);
  doc.setTextColor(0);
  
  yPos += 10;
  chartCount = 0;
  
  subjectsForGradeCharts.forEach((subject) => {
    // Preparar datos para este subject
    const chartData = metricsByGradeForCharts.map(gradeData => {
      const metricConPIAR = gradeData.metricsConPIAR.find(m => m.subject === subject);
      const metricSinPIAR = gradeData.metricsSinPIAR.find(m => m.subject === subject);
      
      return {
        area: gradeData.grado,
        conPIAR: parseFloat(metricConPIAR.desviacion) || 0,
        sinPIAR: parseFloat(metricSinPIAR.desviacion) || 0
      };
    });
    
    // Calcular escala dinámica para desviaciones
    const allDesviaciones = chartData.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v > 0);
    const maxDesviacion = Math.max(...allDesviaciones);
    const dynamicMax = Math.ceil(maxDesviacion * 1.2);
    
    // Dibujar gráfico (2 por página)
    const chartWidth = pageWidth - 40;
    const chartHeight = 60;
    const xPos = 20;
    
    if (chartCount > 0 && chartCount % 2 === 0) {
      // Nueva página cada 2 gráficos
      addNewPage();
      
      // Repetir encabezado de sección
      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('7.2. Gráficos: Desviación estándar por grado y área (continuación)', 14, 13);
      doc.setTextColor(0);
      doc.setFont(undefined, 'normal');
      
      yPos = 28;
    }
    
    drawBarChart(doc, chartData, xPos, yPos, chartWidth, chartHeight, subject, dynamicMax, true, true);
    
    yPos += chartHeight + 20;
    chartCount++;
  });
  
  // NUEVA SECCIÓN: Gráficos de barras por área
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('8. Gráficos comparativos por área', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  // Preparar datos para los gráficos
  const chartData = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    conPIAR: parseFloat(m.promedio),
    sinPIAR: parseFloat(metricsSinPIAR[index].promedio)
  }));
  
  const chartDataDesviacion = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    conPIAR: parseFloat(m.desviacion),
    sinPIAR: parseFloat(metricsSinPIAR[index].desviacion)
  }));
  
  // Calcular datos de percentiles
  const subjectsForChart = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  const chartDataPercentiles = subjectsForChart.map(subject => {
    const percentileKey = `Percentil ${subject}`;
    const area = subject.replace(' crítica', '');
    
    // Calcular promedio CON PIAR
    const studentsWithPercentilesConPIAR = data.filter(s => 
      s[percentileKey] !== undefined && 
      s[percentileKey] !== null && 
      s[percentileKey] !== ''
    );
    
    let avgPercentileConPIAR = null;
    if (studentsWithPercentilesConPIAR.length > 0) {
      const sum = studentsWithPercentilesConPIAR.reduce((acc, s) => {
        const value = parseFloat(s[percentileKey]);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
      avgPercentileConPIAR = sum / studentsWithPercentilesConPIAR.length;
    }
    
    // Calcular promedio SIN PIAR
    const studentsSinPIARForPercentile = data.filter(s => s['¿PIAR?'] !== 'Sí');
    const studentsWithPercentilesSinPIAR = studentsSinPIARForPercentile.filter(s => 
      s[percentileKey] !== undefined && 
      s[percentileKey] !== null && 
      s[percentileKey] !== ''
    );
    
    let avgPercentileSinPIAR = null;
    if (studentsWithPercentilesSinPIAR.length > 0) {
      const sum = studentsWithPercentilesSinPIAR.reduce((acc, s) => {
        const value = parseFloat(s[percentileKey]);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
      avgPercentileSinPIAR = sum / studentsWithPercentilesSinPIAR.length;
    }
    
    return {
      area,
      conPIAR: avgPercentileConPIAR || 0,
      sinPIAR: avgPercentileSinPIAR || 0,
      hasData: avgPercentileConPIAR !== null || avgPercentileSinPIAR !== null
    };
  }).filter(d => d.hasData);
  
  // Gráfico 1: Promedios por área
  yPos = 28;
  drawBarChart(doc, chartData, 20, yPos, pageWidth - 40, 70, 'Promedios por área', 100, true);
  
  // Gráfico 2: Desviación estándar por área
  yPos += 95;
  drawBarChart(doc, chartDataDesviacion, 20, yPos, pageWidth - 40, 70, 'Desviación estándar por área', 30, true);
  
  // Gráfico 3: Percentiles (si hay datos)
  if (chartDataPercentiles.length > 0) {
    yPos += 95;
    
    // Si no cabe en la página, crear nueva
    if (yPos > 180) {
      addNewPage();
      
      // Repetir encabezado de sección
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('9. Gráficos comparativos por área (continuación)', 14, 13);
      doc.setTextColor(0);
      doc.setFont(undefined, 'normal');
      
      yPos = 28;
    }
    
    drawBarChart(doc, chartDataPercentiles, 20, yPos, pageWidth - 40, 70, 'Percentiles promedio por área', 100, true);
  }
  
  // NUEVA SECCIÓN: Gráficos por Grado
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('9. Gráficos comparativos por grado', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  // Preparar datos de promedios por grado
  const gradeAverages = getGradeAverages(data);
  
  const chartDataByGrade = gradeAverages.map(g => ({
    area: `Grado ${g.grado}`,
    conPIAR: g.promedioConPIAR,
    sinPIAR: g.promedioSinPIAR
  }));
  
  const chartDataDesviacionByGrade = gradeAverages.map(g => ({
    area: `Grado ${g.grado}`,
    conPIAR: g.desviacionConPIAR,
    sinPIAR: g.desviacionSinPIAR
  }));
  
  // Gráfico 1: Promedios globales por grado
  yPos = 28;
  drawBarChart(doc, chartDataByGrade, 20, yPos, pageWidth - 40, 70, 'Promedios globales por grado', 100, true, true);
  
  // Gráfico 2: Desviación estándar por grado
  yPos += 95;
  
  // Si no cabe en la página, crear nueva
  if (yPos > 180) {
    addNewPage();
    
    // Repetir encabezado de sección
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('9. Gráficos comparativos por grado (continuación)', 14, 13);
      doc.setTextColor(0);
      doc.setFont(undefined, 'normal');    yPos = 28;
  }
  
  drawBarChart(doc, chartDataDesviacionByGrade, 20, yPos, pageWidth - 40, 70, 'Desviación estándar por grado', 30, true, true);
  
  // PÁGINA: Valores Atípicos (Outliers) - MOVIDO AL FINAL
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('10. Valores atípicos', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  yPos = 30;
  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text('Estudiantes sin PIAR cuyo puntaje global se encuentra a más de 3 desviaciones estándar (±3σ)', 14, yPos);
  doc.text('del promedio de la muestra sin PIAR, ya sea por encima (sobresaliente) o por debajo (bajo rendimiento).', 14, yPos + 5);
  doc.setTextColor(0);
  
  const outliers = findOutliers(data);
  if (outliers.length > 0) {
    const dataSinPIAR = data.filter(s => s['¿PIAR?'] !== 'Sí');
    const globals = dataSinPIAR.map(s => s.Global);
    const avg = mean(globals);
    const sd = stdDev(globals);
    
    // Separar en sobresalientes y bajo rendimiento
    const sobresalientes = outliers.filter(s => zScore(s.Global, avg, sd) > 0);
    const bajoRendimiento = outliers.filter(s => zScore(s.Global, avg, sd) < 0);
    
    yPos += 10;
    
    // Tabla de valores atípicos
    doc.autoTable({
      startY: yPos,
      head: [['Nombre', 'Apellido', 'Grupo', 'Puntaje global', 'Z-Score', 'Categoría']],
      body: outliers.map(s => {
        const z = zScore(s.Global, avg, sd);
        return [
          s.Nombre,
          s.Apellido,
          s.Grupo,
          s.Global.toFixed(2),
          z.toFixed(2),
          z > 0 ? 'Sobresaliente ↑' : 'Bajo rendimiento ↓'
        ];
      }),
      theme: 'striped',
      headStyles: { fillColor: [234, 179, 8], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [254, 252, 232] },
      columnStyles: {
        3: { halign: 'center', fontStyle: 'bold' },
        4: { halign: 'center', fontStyle: 'bold' },
        5: { halign: 'center', fontSize: 9 }
      },
      margin: { bottom: 25 },
      didDrawPage: (data) => {
        if (data.pageNumber > pageNumber) {
          pageNumber = data.pageNumber;
          addFooter();
        }
      }
    });
    
    // Resumen estadístico
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Resumen:', 14, yPos);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const dataSinPIARCount = dataSinPIAR.length;
    doc.text(`• Total de valores atípicos: ${outliers.length} (${((outliers.length / dataSinPIARCount) * 100).toFixed(1)}% de estudiantes sin PIAR)`, 14, yPos + 7);
    doc.text(`• Rendimiento sobresaliente: ${sobresalientes.length} estudiante${sobresalientes.length !== 1 ? 's' : ''}`, 14, yPos + 14);
    doc.text(`• Bajo rendimiento: ${bajoRendimiento.length} estudiante${bajoRendimiento.length !== 1 ? 's' : ''}`, 14, yPos + 21);
  } else {
    doc.setFontSize(12);
    doc.text('✓ No se encontraron valores atípicos', 14, yPos + 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Todos los estudiantes se encuentran dentro del rango normal (±3σ)', 14, yPos + 25);
  }
  
  // NUEVA SECCIÓN: Comparación con/sin outliers
  addNewPage();
  
  // Encabezado de sección
  doc.setFillColor(99, 102, 241); // Color índigo
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('10.1. Comparación de métricas con/sin valores atípicos', 14, 13);
  doc.setTextColor(0);
  doc.setFont(undefined, 'normal');
  
  yPos = 28;
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text('Análisis del impacto de los valores atípicos en las estadísticas de la muestra sin PIAR', 14, yPos);
  doc.setTextColor(0);
  
  // Obtener métricas de comparación
  const metricsComparison = getMetricsComparison(data);
  
  // Gráfico 1: Métricas Globales (Promedio y Desviación)
  const chartDataGlobal = [
    {
      area: 'Promedio',
      conPIAR: metricsComparison.global.conOutliers.promedio,
      sinPIAR: metricsComparison.global.sinOutliers.promedio
    },
    {
      area: 'Desv. est.',
      conPIAR: metricsComparison.global.conOutliers.desviacion,
      sinPIAR: metricsComparison.global.sinOutliers.desviacion
    }
  ];
  
  yPos += 8;
  drawBarChart(doc, chartDataGlobal, 20, yPos, pageWidth - 40, 60, 'Métricas globales (con/sin outliers)', null, true, true, true);
  
  // Gráfico 2: Métricas por Área (solo áreas, sin global)
  const chartDataAreas = metricsComparison.areas.map(area => ({
    area: area.area.replace(' crítica', ''),
    conPIAR: area.conOutliers.promedio,
    sinPIAR: area.sinOutliers.promedio
  }));
  
  yPos += 85;
  drawBarChart(doc, chartDataAreas, 20, yPos, pageWidth - 40, 60, 'Promedios por área (con/sin outliers)', null, true, true, true);
  
  // Generar nombre de archivo con fecha
  const fechaArchivo = new Date().toISOString().split('T')[0];
  const nombreArchivo = `informe-icfes-${fechaArchivo}.pdf`;
  
  console.log('PDF generado, descargando como:', nombreArchivo);
  doc.save(nombreArchivo);
  console.log('Descarga completada');
};
