import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { calculateAreaMetrics, getTop5BySubject, getTop3ByGrade, findOutliers, mean, stdDev, zScore } from './calculations';

export const generatePDF = (data, filters) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;
  
  // PÁGINA 1: Portada
  doc.setFontSize(24);
  doc.text('Informe ICFES Analyzer', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
  doc.text(`Total estudiantes: ${data.length}`, pageWidth / 2, yPos + 10, { align: 'center' });
  
  // PÁGINA 2: Listado ordenado
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Listado de Estudiantes por Puntaje Global', 14, 20);
  
  const sortedData = [...data].sort((a, b) => b.Global - a.Global);
  doc.autoTable({
    startY: 30,
    head: [['Pos', 'Nombre', 'Apellido', 'Grupo', 'Global']],
    body: sortedData.map((s, i) => [i + 1, s.Nombre, s.Apellido, s.Grupo, s.Global.toFixed(2)]),
    theme: 'grid'
  });
  
  // PÁGINA 3: Métricas por área
  doc.addPage();
  doc.text('Promedios y Desviación Estándar por Área', 14, 20);
  const metrics = calculateAreaMetrics(data, filters.excludePIAR);
  doc.autoTable({
    startY: 30,
    head: [['Área', 'Promedio', 'Desviación']],
    body: metrics.map(m => [m.area, m.promedio, m.desviacion]),
    theme: 'striped'
  });
  
  // PÁGINA 4: Top 5 por área
  doc.addPage();
  doc.text('Top 5 Estudiantes por Área', 14, 20);
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  let y = 30;
  subjects.forEach(subject => {
    const top5 = getTop5BySubject(data, subject);
    doc.setFontSize(12);
    doc.text(subject, 14, y);
    doc.autoTable({
      startY: y + 5,
      head: [['Nombre Completo', 'Puntaje']],
      body: top5.map(s => [s.nombreCompleto, s.puntaje.toFixed(2)]),
      margin: { left: 14 },
      theme: 'plain'
    });
    y = doc.lastAutoTable.finalY + 10;
    
    // Si estamos muy abajo, añadir nueva página
    if (y > 250) {
      doc.addPage();
      y = 30;
    }
  });
  
  // PÁGINA 5: Top 3 por grado
  doc.addPage();
  doc.text('Top 3 Estudiantes por Grado', 14, 20);
  const top3ByGrade = getTop3ByGrade(data);
  let yGrade = 30;
  top3ByGrade.forEach(({ grado, top }) => {
    doc.setFontSize(12);
    doc.text(`Grado: ${grado}`, 14, yGrade);
    doc.autoTable({
      startY: yGrade + 5,
      head: [['Nombre Completo', 'Global']],
      body: top.map(s => [s.nombreCompleto, s.global.toFixed(2)]),
      margin: { left: 14 },
      theme: 'plain'
    });
    yGrade = doc.lastAutoTable.finalY + 10;
    
    if (yGrade > 250) {
      doc.addPage();
      yGrade = 30;
    }
  });
  
  // PÁGINA 6: Outliers
  doc.addPage();
  doc.text('Estudiantes con Desempeño Excepcional (±3σ)', 14, 20);
  const outliers = findOutliers(data);
  if (outliers.length > 0) {
    const globals = data.map(s => s.Global);
    const avg = mean(globals);
    const sd = stdDev(globals);
    
    doc.autoTable({
      startY: 30,
      head: [['Nombre', 'Apellido', 'Global', 'Z-Score']],
      body: outliers.map(s => [
        s.Nombre,
        s.Apellido,
        s.Global.toFixed(2), 
        zScore(s.Global, avg, sd).toFixed(2)
      ]),
      theme: 'grid'
    });
  } else {
    doc.text('No se encontraron outliers', 14, 30);
  }
  
  doc.save('informe-icfes.pdf');
};
