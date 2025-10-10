import { calculateAreaMetrics, getTop5BySubject, getTop3ByGrade, getMetricsByGrade, findOutliers, mean, stdDev, getGradeAverages } from './calculations';

/**
 * Genera un archivo HTML interactivo completo con todos los gráficos y métricas
 * @param {Array} data - Datos de estudiantes procesados
 * @returns {string} - HTML completo como string
 */
export function generateInteractiveHTML(data) {
  // Calcular todas las métricas necesarias
  const dataConPIAR = data;
  const dataSinPIAR = data.filter(s => s['¿PIAR?'] !== 'Sí');
  
  // Preparar listado de TODOS los estudiantes (incluyendo PIAR)
  const allStudentsList = data
    .map(s => ({
      nombre: s.Nombre || '',
      apellido: s.Apellido || '',
      nombreCompleto: s.nombreCompleto || `${s.Nombre || ''} ${s.Apellido || ''}`.trim(),
      grupo: s.Grupo || '',
      global: s.Global || 0,
      lectura: s['Lectura crítica'] || 0,
      matematicas: s['Matemáticas'] || 0,
      sociales: s['Sociales'] || 0,
      naturales: s['Naturales'] || 0,
      ingles: s['Inglés'] || 0,
      piar: s['¿PIAR?'] === 'Sí' ? 'Sí' : 'No'
    }))
    .sort((a, b) => b.global - a.global);
  
  const globalAvgConPIAR = mean(dataConPIAR.map(s => s.Global)).toFixed(2);
  const globalAvgSinPIAR = mean(dataSinPIAR.map(s => s.Global)).toFixed(2);
  
  const metricsConPIAR = calculateAreaMetrics(dataConPIAR, false);
  const metricsSinPIAR = calculateAreaMetrics(dataSinPIAR, false);
  const metricsByGrade = getMetricsByGrade(data);
  const gradeAverages = getGradeAverages(data);
  const outliers = findOutliers(data);
  const top3ByGrade = getTop3ByGrade(data);
  
  const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
  
  // Preparar datos de percentiles
  const chartDataPercentiles = subjects.map(subject => {
    const percentileKey = `Percentil ${subject}`;
    const area = subject.replace(' crítica', '');
    
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
    
    const studentsWithPercentilesSinPIAR = dataSinPIAR.filter(s => 
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
      conPIAR: avgPercentileConPIAR,
      sinPIAR: avgPercentileSinPIAR,
      hasData: avgPercentileConPIAR !== null || avgPercentileSinPIAR !== null
    };
  });
  
  const hasPercentileData = chartDataPercentiles.some(d => d.hasData);
  
  // Preparar datos para gráficos
  const chartDataPromedios = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    conPIAR: parseFloat(m.promedio),
    sinPIAR: parseFloat(metricsSinPIAR[index].promedio)
  }));
  
  const chartDataDesviacion = metricsConPIAR.map((m, index) => ({
    area: m.area.replace(' crítica', ''),
    conPIAR: parseFloat(m.desviacion),
    sinPIAR: parseFloat(metricsSinPIAR[index].desviacion)
  }));
  
  const chartDataGradosPromedios = gradeAverages.map(g => ({
    grado: `Grado ${g.grado}`,
    conPIAR: parseFloat(g.promedioConPIAR.toFixed(2)),
    sinPIAR: parseFloat(g.promedioSinPIAR.toFixed(2))
  }));
  
  const chartDataGradosDesviacion = gradeAverages.map(g => ({
    grado: `Grado ${g.grado}`,
    conPIAR: parseFloat(g.desviacionConPIAR.toFixed(2)),
    sinPIAR: parseFloat(g.desviacionSinPIAR.toFixed(2))
  }));
  
  // Preparar datos para gráfico integrado de todas las áreas por grado (CON y SIN PIAR)
  const chartDataIntegradoConPIAR = [];
  const chartDataIntegradoSinPIAR = [];
  const grades = [...new Set(data.map(s => s.Grupo))].sort();
  
  grades.forEach(grado => {
    const gradoData = metricsByGrade.find(g => g.grado === grado);
    if (gradoData) {
      // Con PIAR
      const dataPointConPIAR = {
        grado: `Grado ${grado}`,
        'Lectura': parseFloat(gradoData.metricsConPIAR.find(m => m.subject === 'Lectura crítica')?.promedio || 0),
        'Matemáticas': parseFloat(gradoData.metricsConPIAR.find(m => m.subject === 'Matemáticas')?.promedio || 0),
        'Sociales': parseFloat(gradoData.metricsConPIAR.find(m => m.subject === 'Sociales')?.promedio || 0),
        'Naturales': parseFloat(gradoData.metricsConPIAR.find(m => m.subject === 'Naturales')?.promedio || 0),
        'Inglés': parseFloat(gradoData.metricsConPIAR.find(m => m.subject === 'Inglés')?.promedio || 0)
      };
      chartDataIntegradoConPIAR.push(dataPointConPIAR);
      
      // Sin PIAR
      const dataPointSinPIAR = {
        grado: `Grado ${grado}`,
        'Lectura': parseFloat(gradoData.metricsSinPIAR.find(m => m.subject === 'Lectura crítica')?.promedio || 0),
        'Matemáticas': parseFloat(gradoData.metricsSinPIAR.find(m => m.subject === 'Matemáticas')?.promedio || 0),
        'Sociales': parseFloat(gradoData.metricsSinPIAR.find(m => m.subject === 'Sociales')?.promedio || 0),
        'Naturales': parseFloat(gradoData.metricsSinPIAR.find(m => m.subject === 'Naturales')?.promedio || 0),
        'Inglés': parseFloat(gradoData.metricsSinPIAR.find(m => m.subject === 'Inglés')?.promedio || 0)
      };
      chartDataIntegradoSinPIAR.push(dataPointSinPIAR);
    }
  });
  
  // Generar el HTML
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análisis ICFES - presentación interactiva</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      padding: 20px;
      line-height: 1.6;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    
    header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    header h1 {
      font-size: 3em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    header p {
      font-size: 1.2em;
      opacity: 0.9;
    }
    
    .brand {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid rgba(255,255,255,0.3);
    }
    
    .brand a {
      color: white;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.3em;
      transition: opacity 0.3s;
    }
    
    .brand a:hover {
      opacity: 0.8;
    }
    
    .social-links {
      margin-top: 15px;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    
    .social-links a {
      color: white;
      text-decoration: none;
      font-size: 0.9em;
      transition: transform 0.3s;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .social-links a:hover {
      transform: scale(1.1);
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 60px;
      animation: fadeIn 0.6s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    h2 {
      color: #2563eb;
      font-size: 2em;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #3b82f6;
    }
    
    h3 {
      color: #4f46e5;
      font-size: 1.5em;
      margin: 30px 0 15px 0;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .metric-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 25px;
      border-radius: 15px;
      border: 2px solid #bae6fd;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }
    
    .metric-card.highlight {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-color: #6ee7b7;
    }
    
    .metric-card.secondary {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-color: #d1d5db;
      opacity: 0.8;
    }
    
    .metric-label {
      font-size: 0.9em;
      color: #64748b;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .metric-value {
      font-size: 2.5em;
      font-weight: bold;
      color: #1e40af;
    }
    
    .metric-card.highlight .metric-value {
      color: #059669;
    }
    
    .metric-card.secondary .metric-value {
      color: #6b7280;
    }
    
    .metric-subtitle {
      font-size: 0.8em;
      color: #94a3b8;
      margin-top: 5px;
    }
    
    .chart-container {
      background: #f8fafc;
      padding: 30px;
      border-radius: 15px;
      margin: 30px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
    }
    
    .chart-wrapper {
      position: relative;
      height: 400px;
    }
    
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .toggle-button {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
      font-size: 1em;
    }
    
    .toggle-button:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    }
    
    .toggle-button.inactive {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    }
    
    .metric-toggle-group {
      display: flex;
      gap: 10px;
    }
    
    .metric-toggle {
      background: white;
      color: #64748b;
      border: 2px solid #e2e8f0;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .metric-toggle.active {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border-color: #2563eb;
    }
    
    .metric-toggle:hover {
      transform: translateY(-2px);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    th {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      user-select: none;
    }
    
    th:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    tr:hover {
      background: #f1f5f9;
    }
    
    #studentsTable tbody tr {
      transition: all 0.2s ease;
    }
    
    #studentsTable tbody tr:hover {
      background: #f1f5f9 !important;
      transform: scale(1.01);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .grade-section {
      background: #fefce8;
      padding: 25px;
      border-radius: 15px;
      margin: 20px 0;
      border: 2px solid #fde047;
    }
    
    .grade-section h3 {
      color: #ca8a04;
      margin-top: 0;
    }
    
    .top-list {
      list-style: none;
      padding: 0;
    }
    
    .top-list li {
      background: white;
      padding: 12px 15px;
      margin: 8px 0;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }
    
    .top-list li:hover {
      transform: translateX(5px);
    }
    
    .medal {
      font-size: 1.5em;
      margin-right: 10px;
    }
    
    .outlier-card {
      background: #fef2f2;
      border: 2px solid #fca5a5;
      border-radius: 10px;
      padding: 15px;
      margin: 10px 0;
    }
    
    .outlier-card.positive {
      background: #f0fdf4;
      border-color: #86efac;
    }
    
    footer {
      background: #1e293b;
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    footer a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: bold;
    }
    
    footer a:hover {
      text-decoration: underline;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
    
    .info-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    
    .info-box p {
      margin: 5px 0;
      font-size: 0.95em;
      color: #1e40af;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📊 Análisis ICFES</h1>
      <p>Presentación Interactiva de Resultados</p>
      <div class="brand">
        <p style="font-size: 0.9em; opacity: 0.8;">Desarrollado por</p>
        <a href="https://ediprofe.com" target="_blank">ediprofe.com</a>
        <div class="social-links">
          <a href="https://www.youtube.com/@ProfeEdi" target="_blank">
            📺 YouTube
          </a>
          <span>|</span>
          <a href="https://www.tiktok.com/@ediprofe" target="_blank">
            🎵 TikTok
          </a>
          <span>|</span>
          <a href="https://ediprofe.com" target="_blank">
            🌐 Web
          </a>
        </div>
      </div>
    </header>
    
    <div class="content">
      <!-- SECCIÓN 1: MÉTRICAS GLOBALES -->
      <div class="section">
        <h2>📈 Métricas globales</h2>
        <div class="metrics-grid">
          <div class="metric-card secondary">
            <div class="metric-label">Promedio Global (con PIAR)</div>
            <div class="metric-value">${globalAvgConPIAR}</div>
            <div class="metric-subtitle">${dataConPIAR.length} estudiantes</div>
          </div>
          <div class="metric-card highlight">
            <div class="metric-label">Promedio Global (sin PIAR)</div>
            <div class="metric-value">${globalAvgSinPIAR}</div>
            <div class="metric-subtitle">${dataSinPIAR.length} estudiantes</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Total Estudiantes</div>
            <div class="metric-value">${data.length}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Valores Atípicos</div>
            <div class="metric-value">${outliers.length}</div>
            <div class="metric-subtitle">${((outliers.length / data.length) * 100).toFixed(1)}% del total</div>
          </div>
        </div>
        
        <div class="info-box">
          <p><strong>💡 Nota:</strong> Los valores con PIAR incluyen todos los estudiantes. Los valores sin PIAR excluyen estudiantes con Plan Individual de Ajustes Razonables.</p>
        </div>
      </div>
      
      <!-- SECCIÓN 1.5: LISTADO DE ESTUDIANTES CON FILTROS -->
      <div class="section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0;">📋 Listado de Estudiantes</h2>
          <div style="display: flex; gap: 15px; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <label style="font-weight: 600; color: #64748b;">Mostrar PIAR:</label>
              <button class="toggle-button" id="togglePIARTable" onclick="togglePIARTable()" style="padding: 8px 16px;">
                No
              </button>
            </div>
            <div>
              <input 
                type="text" 
                id="searchTable" 
                placeholder="🔍 Buscar estudiante..." 
                style="padding: 10px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; width: 250px;"
                onkeyup="filterTable()"
              />
            </div>
          </div>
        </div>
        
        <p style="color: #64748b; margin-bottom: 15px;" id="studentsCount">
          Mostrando: <strong id="visibleCount">${dataSinPIAR.length}</strong> de <strong>${data.length}</strong> estudiantes
        </p>
        
        <div style="overflow-x: auto;">
          <table id="studentsTable">
            <thead>
              <tr>
                <th style="width: 50px; text-align: center; cursor: pointer;" onclick="sortTable(0)">#</th>
                <th style="cursor: pointer;" onclick="sortTable(1)">
                  Nombre ↕
                </th>
                <th style="cursor: pointer;" onclick="sortTable(2)">
                  Apellido ↕
                </th>
                <th style="cursor: pointer; text-align: center;" onclick="sortTable(3)">
                  Grado ↕
                </th>
                <th style="text-align: center; cursor: pointer;" onclick="sortTable(4)">
                  Global ↕
                </th>
                <th style="text-align: center; cursor: pointer;" onclick="sortTable(5)">
                  Lectura ↕
                </th>
                <th style="text-align: center; cursor: pointer;" onclick="sortTable(6)">
                  Matemáticas ↕
                </th>
                <th style="text-align: center; cursor: pointer;" onclick="sortTable(7)">
                  Sociales ↕
                </th>
                <th style="text-align: center; cursor: pointer;" onclick="sortTable(8)">
                  Naturales ↕
                </th>
                <th style="text-align: center; cursor: pointer;" onclick="sortTable(9)">
                  Inglés ↕
                </th>
                <th style="text-align: center; width: 80px;">PIAR</th>
              </tr>
            </thead>
            <tbody id="studentsTableBody">
              <!-- Filas generadas dinámicamente por JavaScript -->
            </tbody>
          </table>
        </div>
        
        <div class="info-box" style="margin-top: 20px;">
          <p><strong>💡 Funcionalidades:</strong></p>
          <ul style="margin: 10px 0 0 20px;">
            <li>Haz clic en los encabezados para <strong>ordenar</strong> la tabla</li>
            <li>Usa el buscador para <strong>filtrar</strong> por nombre, apellido o grado</li>
            <li>Activa "Mostrar PIAR" para incluir estudiantes con PIAR (aparecen resaltados en azul en la parte superior)</li>
            <li>Los <strong>3 primeros</strong> estudiantes están destacados en amarillo</li>
          </ul>
        </div>
      </div>
      
      <!-- SECCIÓN 2: PROMEDIOS POR ÁREA -->
      <div class="section">
        <h2>📊 Análisis por área</h2>
        
        <div class="controls">
          <h3 style="margin: 0;">Comparación de promedios</h3>
          <div>
            <span style="margin-right: 10px; color: #64748b;">Comparar con/sin PIAR:</span>
            <button class="toggle-button" id="togglePIAR" onclick="togglePIARComparison()">
              Comparación Activa
            </button>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-wrapper">
            <canvas id="chartPromedios"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Desviación estándar por área</h3>
          <div class="chart-wrapper">
            <canvas id="chartDesviacion"></canvas>
          </div>
        </div>
        
        ${hasPercentileData ? `
        <div class="chart-container">
          <h3>Percentiles promedio por área</h3>
          <p style="color: #64748b; font-size: 0.9em; margin-bottom: 15px;">
            Posición relativa de los estudiantes respecto al total nacional
          </p>
          <div class="chart-wrapper">
            <canvas id="chartPercentiles"></canvas>
          </div>
        </div>
        ` : ''}
        
        <h3>Tabla comparativa de métricas</h3>
        <table>
          <thead>
            <tr>
              <th rowspan="2">Área</th>
              <th colspan="2" style="text-align: center; border-left: 2px solid rgba(255,255,255,0.3);">Promedio</th>
              <th colspan="2" style="text-align: center; border-left: 2px solid rgba(255,255,255,0.3);">Desviación Estándar</th>
            </tr>
            <tr>
              <th style="border-left: 2px solid rgba(255,255,255,0.3); opacity: 0.7;">con PIAR</th>
              <th style="font-weight: bold;">sin PIAR</th>
              <th style="border-left: 2px solid rgba(255,255,255,0.3); opacity: 0.7;">con PIAR</th>
              <th style="font-weight: bold;">sin PIAR</th>
            </tr>
          </thead>
          <tbody>
            ${metricsConPIAR.map((metric, index) => `
              <tr>
                <td style="font-weight: bold; color: #2563eb;">${metric.area}</td>
                <td style="border-left: 2px solid #e2e8f0; color: #6b7280; background: #f9fafb;">${metric.promedio}</td>
                <td style="font-weight: bold; background: #d1fae5; color: #059669;">${metricsSinPIAR[index].promedio}</td>
                <td style="border-left: 2px solid #e2e8f0; color: #6b7280; background: #f9fafb;">${metric.desviacion}</td>
                <td style="font-weight: bold; background: #d1fae5; color: #059669;">${metricsSinPIAR[index].desviacion}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- SECCIÓN 3: ANÁLISIS POR GRADO -->
      <div class="section">
        <h2>🎓 Análisis por grado</h2>
        
        <div class="info-box">
          <p><strong>📊 Gráfico Integrado:</strong> Vista completa de todas las áreas académicas por grado (sin PIAR)</p>
        </div>
        
        <div class="chart-container">
          <h3>Análisis detallado: todas las áreas por grado</h3>
          <p style="color: #64748b; font-size: 0.9em; margin-bottom: 15px;">
            Comparación de promedios en las 5 áreas académicas agrupadas por grado
          </p>
          <div class="chart-wrapper" style="height: 500px;">
            <canvas id="chartIntegrado"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Promedios globales por grado</h3>
          <div class="chart-wrapper">
            <canvas id="chartGradosPromedios"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Desviación estándar por grado</h3>
          <div class="chart-wrapper">
            <canvas id="chartGradosDesviacion"></canvas>
          </div>
        </div>
        
        ${metricsByGrade.map(gradeData => `
          <div class="grade-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h3 style="margin: 0;">Grado ${gradeData.grado}</h3>
              <div style="font-size: 0.9em; color: #78716c;">
                <strong>${gradeData.totalEstudiantes}</strong> estudiantes total | 
                <strong style="color: #059669;">${gradeData.estudiantesSinPIAR}</strong> sin PIAR
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th rowspan="2">Área</th>
                  <th colspan="2" style="text-align: center; border-left: 2px solid rgba(255,255,255,0.3);">Promedio</th>
                  <th colspan="2" style="text-align: center; border-left: 2px solid rgba(255,255,255,0.3);">Desviación Estándar</th>
                </tr>
                <tr>
                  <th style="border-left: 2px solid rgba(255,255,255,0.3); opacity: 0.7;">con PIAR</th>
                  <th style="font-weight: bold;">sin PIAR</th>
                  <th style="border-left: 2px solid rgba(255,255,255,0.3); opacity: 0.7;">con PIAR</th>
                  <th style="font-weight: bold;">sin PIAR</th>
                </tr>
              </thead>
              <tbody>
                ${gradeData.metricsConPIAR.map((metric, index) => `
                  <tr>
                    <td style="font-weight: bold; color: #ca8a04;">${metric.subject}</td>
                    <td style="border-left: 2px solid #e2e8f0; color: #6b7280; background: #f9fafb;">${metric.promedio}</td>
                    <td style="font-weight: bold; background: #d1fae5; color: #059669;">${gradeData.metricsSinPIAR[index].promedio}</td>
                    <td style="border-left: 2px solid #e2e8f0; color: #6b7280; background: #f9fafb;">${metric.desviacion}</td>
                    <td style="font-weight: bold; background: #d1fae5; color: #059669;">${gradeData.metricsSinPIAR[index].desviacion}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>
      
      <!-- SECCIÓN 4: TOP 5 POR ÁREA -->
      <div class="section">
        <h2>🏆 Top 5 por área</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
          ${subjects.map(subject => {
            const top5 = getTop5BySubject(data, subject);
            const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
            return `
              <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="color: #2563eb; margin-top: 0;">${subject}</h3>
                <ol class="top-list">
                  ${top5.map((student, index) => `
                    <li>
                      <span><span class="medal">${medals[index]}</span>${student.nombreCompleto}</span>
                      <strong style="color: #2563eb;">${student.puntaje.toFixed(2)}</strong>
                    </li>
                  `).join('')}
                </ol>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- SECCIÓN 5: TOP 3 POR GRADO -->
      <div class="section">
        <h2>🌟 Top 3 por grado</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
          ${top3ByGrade.map(({ grado, top }) => {
            const medals = ['🥇', '🥈', '🥉'];
            return `
              <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 3px solid #fbbf24;">
                <h3 style="color: #d97706; margin-top: 0;">Grado ${grado}</h3>
                <ol class="top-list">
                  ${top.map((student, index) => `
                    <li>
                      <span><span class="medal">${medals[index]}</span>${student.nombreCompleto}</span>
                      <strong style="color: #d97706;">${student.global.toFixed(2)}</strong>
                    </li>
                  `).join('')}
                </ol>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- SECCIÓN 6: VALORES ATÍPICOS -->
      ${outliers.length > 0 ? `
      <div class="section">
        <h2>⚡ Valores atípicos (outliers)</h2>
        <div class="info-box">
          <p><strong>Definición:</strong> Estudiantes cuyo puntaje global se encuentra a más de 3 desviaciones estándar (±3σ) del promedio.</p>
          <p>Estos valores indican rendimiento excepcional (positivo) o que requiere atención especial (negativo).</p>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Total de outliers</div>
            <div class="metric-value">${outliers.length}</div>
            <div class="metric-subtitle">${((outliers.length / data.length) * 100).toFixed(1)}% del total</div>
          </div>
          <div class="metric-card" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-color: #6ee7b7;">
            <div class="metric-label">Sobresalientes</div>
            <div class="metric-value" style="color: #059669;">
              ${outliers.filter(s => {
                const globals = data.map(st => st.Global);
                const avg = mean(globals);
                const sd = stdDev(globals);
                return (s.Global - avg) / sd > 0;
              }).length}
            </div>
            <div class="metric-subtitle">Por encima de +3σ</div>
          </div>
          <div class="metric-card" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-color: #fca5a5;">
            <div class="metric-label">Bajo rendimiento</div>
            <div class="metric-value" style="color: #dc2626;">
              ${outliers.filter(s => {
                const globals = data.map(st => st.Global);
                const avg = mean(globals);
                const sd = stdDev(globals);
                return (s.Global - avg) / sd < 0;
              }).length}
            </div>
            <div class="metric-subtitle">Por debajo de -3σ</div>
          </div>
        </div>
        
        <div style="margin-top: 30px;">
          ${outliers.map(student => {
            const globals = data.map(s => s.Global);
            const avg = mean(globals);
            const sd = stdDev(globals);
            const z = (student.Global - avg) / sd;
            const isSobresaliente = z > 0;
            return `
              <div class="outlier-card ${isSobresaliente ? 'positive' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <strong style="font-size: 1.1em;">${student.Nombre} ${student.Apellido}</strong>
                    <div style="color: #64748b; font-size: 0.9em; margin-top: 5px;">
                      Grado: ${student.Grupo} | Puntaje: ${student.Global.toFixed(2)} | Z-Score: ${z.toFixed(2)}
                    </div>
                  </div>
                  <div style="text-align: center;">
                    <span style="display: inline-block; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 0.85em; ${
                      isSobresaliente 
                        ? 'background: #86efac; color: #065f46;' 
                        : 'background: #fca5a5; color: #991b1b;'
                    }">
                      ${isSobresaliente ? '↑ Sobresaliente' : '↓ Bajo rendimiento'}
                    </span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      ` : `
      <div class="section">
        <h2>⚡ Valores atípicos (outliers)</h2>
        <div style="text-align: center; padding: 40px; background: #f0fdf4; border-radius: 15px; border: 2px solid #86efac;">
          <div style="font-size: 3em; margin-bottom: 15px;">✓</div>
          <h3 style="color: #059669; margin: 0 0 10px 0;">No se encontraron valores atípicos</h3>
          <p style="color: #64748b;">Todos los estudiantes se encuentran dentro del rango normal (±3σ)</p>
        </div>
      </div>
      `}
    </div>
    
    <footer>
      <p style="font-size: 1.2em; margin-bottom: 15px;">
        Desarrollado por <a href="https://ediprofe.com" target="_blank">ediprofe.com</a>
      </p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #475569;">
        <p style="font-size: 0.9em; opacity: 0.8;">
          📺 <a href="https://www.youtube.com/@ProfeEdi" target="_blank">YouTube</a> | 
          🎵 <a href="https://www.tiktok.com/@ediprofe" target="_blank">TikTok</a> | 
          🌐 <a href="https://ediprofe.com" target="_blank">Sitio Web</a>
        </p>
        <p style="font-size: 0.8em; margin-top: 15px; opacity: 0.6;">
          © ${new Date().getFullYear()} - Análisis ICFES interactivo
        </p>
      </div>
    </footer>
  </div>
  
  <script>
    // Estado global
    let showPIAR = true;
    let charts = {};
    let showPIARInTable = false;
    let currentSortColumn = 4; // Global por defecto
    let currentSortDirection = 'desc';
    
    // Datos de estudiantes
    const allStudentsData = ${JSON.stringify(allStudentsList)};
    
    // Colores por área
    const areaColors = {
      'Lectura': '#3b82f6',
      'Matemáticas': '#ef4444',
      'Sociales': '#f97316',
      'Naturales': '#22c55e',
      'Inglés': '#a855f7'
    };
    
    // Funciones de la tabla de estudiantes
    function renderStudentsTable() {
      const searchTerm = document.getElementById('searchTable').value.toLowerCase();
      const tbody = document.getElementById('studentsTableBody');
      
      // Filtrar estudiantes
      let filteredStudents = allStudentsData.filter(student => {
        // Filtro PIAR
        if (!showPIARInTable && student.piar === 'Sí') {
          return false;
        }
        
        // Filtro búsqueda
        if (searchTerm) {
          const fullName = (student.nombre + ' ' + student.apellido + ' ' + student.grupo).toLowerCase();
          return fullName.includes(searchTerm);
        }
        
        return true;
      });
      
      // Ordenar con PIAR al inicio si está activado
      if (showPIARInTable) {
        filteredStudents.sort((a, b) => {
          // Primero por PIAR (Sí primero)
          if (a.piar === 'Sí' && b.piar !== 'Sí') return -1;
          if (a.piar !== 'Sí' && b.piar === 'Sí') return 1;
          // Luego por columna actual
          return sortByColumn(a, b, currentSortColumn, currentSortDirection);
        });
      } else {
        filteredStudents.sort((a, b) => sortByColumn(a, b, currentSortColumn, currentSortDirection));
      }
      
      // Actualizar contador
      document.getElementById('visibleCount').textContent = filteredStudents.length;
      
      // Generar HTML
      tbody.innerHTML = filteredStudents.map((student, index) => {
        const isPIAR = student.piar === 'Sí';
        const isTop3 = !showPIARInTable && index < 3;
        
        let rowStyle = '';
        if (isPIAR && showPIARInTable) {
          rowStyle = 'background: #dbeafe; border-left: 4px solid #3b82f6;';
        } else if (isTop3) {
          rowStyle = 'background: #fef3c7; font-weight: 600;';
        }
        
        return \`
          <tr style="\${rowStyle}">
            <td style="text-align: center; color: #64748b; font-weight: bold;">\${index + 1}</td>
            <td>\${student.nombre}</td>
            <td>\${student.apellido}</td>
            <td style="text-align: center; font-weight: 600;">\${student.grupo}</td>
            <td style="text-align: center; font-weight: bold; color: #2563eb; font-size: 1.05em;">\${student.global.toFixed(2)}</td>
            <td style="text-align: center; color: #3b82f6;">\${student.lectura.toFixed(2)}</td>
            <td style="text-align: center; color: #ef4444;">\${student.matematicas.toFixed(2)}</td>
            <td style="text-align: center; color: #f97316;">\${student.sociales.toFixed(2)}</td>
            <td style="text-align: center; color: #22c55e;">\${student.naturales.toFixed(2)}</td>
            <td style="text-align: center; color: #a855f7;">\${student.ingles.toFixed(2)}</td>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold; \${isPIAR ? 'background: #3b82f6; color: white;' : 'background: #e5e7eb; color: #6b7280;'}">
                \${student.piar}
              </span>
            </td>
          </tr>
        \`;
      }).join('');
    }
    
    function sortByColumn(a, b, column, direction) {
      let aVal, bVal;
      
      switch(column) {
        case 0: return 0; // # no se ordena
        case 1: aVal = a.nombre; bVal = b.nombre; break;
        case 2: aVal = a.apellido; bVal = b.apellido; break;
        case 3: aVal = a.grupo; bVal = b.grupo; break;
        case 4: aVal = a.global; bVal = b.global; break;
        case 5: aVal = a.lectura; bVal = b.lectura; break;
        case 6: aVal = a.matematicas; bVal = b.matematicas; break;
        case 7: aVal = a.sociales; bVal = b.sociales; break;
        case 8: aVal = a.naturales; bVal = b.naturales; break;
        case 9: aVal = a.ingles; bVal = b.ingles; break;
        default: return 0;
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    }
    
    function sortTable(column) {
      if (column === 0) return; // No ordenar por #
      
      if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'desc' ? 'asc' : 'desc';
      } else {
        currentSortColumn = column;
        currentSortDirection = 'desc';
      }
      
      renderStudentsTable();
    }
    
    function filterTable() {
      renderStudentsTable();
    }
    
    function togglePIARTable() {
      showPIARInTable = !showPIARInTable;
      const button = document.getElementById('togglePIARTable');
      
      if (showPIARInTable) {
        button.textContent = 'Sí';
        button.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        button.style.color = 'white';
      } else {
        button.textContent = 'No';
        button.style.background = 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
        button.style.color = 'white';
      }
      
      currentSortColumn = 4; // Reset a Global
      currentSortDirection = 'desc';
      document.getElementById('searchTable').value = ''; // Limpiar búsqueda
      renderStudentsTable();
    }
    
    // Registrar el plugin DataLabels globalmente
    Chart.register(ChartDataLabels);
    
    // Datos
    const dataPromedios = ${JSON.stringify(chartDataPromedios)};
    const dataDesviacion = ${JSON.stringify(chartDataDesviacion)};
    const dataPercentiles = ${JSON.stringify(chartDataPercentiles.filter(d => d.hasData))};
    const dataGradosPromedios = ${JSON.stringify(chartDataGradosPromedios)};
    const dataGradosDesviacion = ${JSON.stringify(chartDataGradosDesviacion)};
    
    // Configuración común de gráficos
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { size: 14, weight: 'bold' },
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          cornerRadius: 8
        },
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'end',
          offset: 4,
          font: {
            size: 11,
            weight: 'bold'
          },
          formatter: (value) => value ? value.toFixed(2) : '',
          color: '#1e293b'
        }
      },
      animation: {
        duration: 800,
        easing: 'easeInOutQuart'
      }
    };
    
    // Función para crear dataset
    function createDataset(label, data, colors, opacity = 1) {
      return {
        label: label,
        data: data,
        backgroundColor: colors.map(c => c.replace(')', \`, \${opacity})\`).replace('rgb', 'rgba')),
        borderColor: colors,
        borderWidth: 2
      };
    }
    
    // Inicializar gráficos
    function initCharts() {
      // Gráfico de promedios por área
      const ctxPromedios = document.getElementById('chartPromedios').getContext('2d');
      charts.promedios = new Chart(ctxPromedios, {
        type: 'bar',
        data: {
          labels: dataPromedios.map(d => d.area),
          datasets: showPIAR ? [
            {
              label: 'Con PIAR',
              data: dataPromedios.map(d => d.conPIAR),
              backgroundColor: 'rgba(156, 163, 175, 0.5)',
              borderColor: '#9ca3af',
              borderWidth: 2
            },
            createDataset(
              'Sin PIAR',
              dataPromedios.map(d => d.sinPIAR),
              dataPromedios.map(d => areaColors[d.area] || '#10b981')
            )
          ] : [
            createDataset(
              'Sin PIAR',
              dataPromedios.map(d => d.sinPIAR),
              dataPromedios.map(d => areaColors[d.area] || '#10b981')
            )
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              max: 100,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { size: 12 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 'bold' } }
            }
          },
          plugins: {
            ...commonOptions.plugins
          }
        }
      });
      
      // Gráfico de desviación estándar por área
      const ctxDesviacion = document.getElementById('chartDesviacion').getContext('2d');
      charts.desviacion = new Chart(ctxDesviacion, {
        type: 'bar',
        data: {
          labels: dataDesviacion.map(d => d.area),
          datasets: showPIAR ? [
            {
              label: 'Con PIAR',
              data: dataDesviacion.map(d => d.conPIAR),
              backgroundColor: 'rgba(156, 163, 175, 0.5)',
              borderColor: '#9ca3af',
              borderWidth: 2
            },
            createDataset(
              'Sin PIAR',
              dataDesviacion.map(d => d.sinPIAR),
              dataDesviacion.map(d => areaColors[d.area] || '#10b981')
            )
          ] : [
            createDataset(
              'Sin PIAR',
              dataDesviacion.map(d => d.sinPIAR),
              dataDesviacion.map(d => areaColors[d.area] || '#10b981')
            )
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: true,
              max: 30,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { size: 12 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 'bold' } }
            }
          }
        }
      });
      
      // Gráfico de percentiles (si hay datos)
      ${hasPercentileData ? `
      const ctxPercentiles = document.getElementById('chartPercentiles').getContext('2d');
      charts.percentiles = new Chart(ctxPercentiles, {
        type: 'bar',
        data: {
          labels: dataPercentiles.map(d => d.area),
          datasets: showPIAR ? [
            {
              label: 'Con PIAR',
              data: dataPercentiles.map(d => d.conPIAR),
              backgroundColor: 'rgba(156, 163, 175, 0.5)',
              borderColor: '#9ca3af',
              borderWidth: 2
            },
            createDataset(
              'Sin PIAR',
              dataPercentiles.map(d => d.sinPIAR),
              dataPercentiles.map(d => areaColors[d.area] || '#10b981')
            )
          ] : [
            createDataset(
              'Sin PIAR',
              dataPercentiles.map(d => d.sinPIAR),
              dataPercentiles.map(d => areaColors[d.area] || '#10b981')
            )
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { 
                font: { size: 12 },
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 'bold' } }
            }
          }
        }
      });
      ` : ''}
      
      // Gráfico de promedios por grado
      const ctxGradosPromedios = document.getElementById('chartGradosPromedios').getContext('2d');
      const allPromedios = dataGradosPromedios.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v > 0);
      const minPromedio = Math.min(...allPromedios);
      const maxPromedio = Math.max(...allPromedios);
      const paddingPromedio = (maxPromedio - minPromedio) * 0.15;
      
      charts.gradosPromedios = new Chart(ctxGradosPromedios, {
        type: 'bar',
        data: {
          labels: dataGradosPromedios.map(d => d.grado),
          datasets: showPIAR ? [
            {
              label: 'Con PIAR',
              data: dataGradosPromedios.map(d => d.conPIAR),
              backgroundColor: 'rgba(156, 163, 175, 0.5)',
              borderColor: '#9ca3af',
              borderWidth: 2
            },
            {
              label: 'Sin PIAR',
              data: dataGradosPromedios.map(d => d.sinPIAR),
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderColor: '#6366f1',
              borderWidth: 2
            }
          ] : [
            {
              label: 'Sin PIAR',
              data: dataGradosPromedios.map(d => d.sinPIAR),
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderColor: '#6366f1',
              borderWidth: 2
            }
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: false,
              min: Math.max(0, Math.floor(minPromedio - paddingPromedio)),
              max: Math.ceil(maxPromedio + paddingPromedio),
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { size: 12 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 'bold' } }
            }
          }
        }
      });
      
      // Gráfico de desviación por grado
      const ctxGradosDesviacion = document.getElementById('chartGradosDesviacion').getContext('2d');
      const allDesviaciones = dataGradosDesviacion.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v > 0);
      const maxDesviacion = Math.max(...allDesviaciones);
      
      charts.gradosDesviacion = new Chart(ctxGradosDesviacion, {
        type: 'bar',
        data: {
          labels: dataGradosDesviacion.map(d => d.grado),
          datasets: showPIAR ? [
            {
              label: 'Con PIAR',
              data: dataGradosDesviacion.map(d => d.conPIAR),
              backgroundColor: 'rgba(156, 163, 175, 0.5)',
              borderColor: '#9ca3af',
              borderWidth: 2
            },
            {
              label: 'Sin PIAR',
              data: dataGradosDesviacion.map(d => d.sinPIAR),
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderColor: '#6366f1',
              borderWidth: 2
            }
          ] : [
            {
              label: 'Sin PIAR',
              data: dataGradosDesviacion.map(d => d.sinPIAR),
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderColor: '#6366f1',
              borderWidth: 2
            }
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: true,
              max: Math.ceil(maxDesviacion * 1.2),
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { size: 12 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 'bold' } }
            }
          }
        }
      });
      
      // Gráfico integrado: Todas las áreas por grado (con comparación PIAR)
      const ctxIntegrado = document.getElementById('chartIntegrado').getContext('2d');
      const dataIntegradoConPIAR = ${JSON.stringify(chartDataIntegradoConPIAR)};
      const dataIntegradoSinPIAR = ${JSON.stringify(chartDataIntegradoSinPIAR)};
      
      // Colores por área (sólidos)
      const areaColorsIntegrado = {
        'Lectura': '#3b82f6',      // Azul
        'Matemáticas': '#ef4444',  // Rojo
        'Sociales': '#f97316',     // Naranja
        'Naturales': '#22c55e',    // Verde
        'Inglés': '#a855f7'        // Morado
      };
      
      // Crear datasets: cada área genera sus propias barras con PIAR y sin PIAR
      function createIntegradoDatasets() {
        const areas = ['Lectura', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
        const datasets = [];
        
        areas.forEach((area, index) => {
          const color = areaColorsIntegrado[area];
          
          if (showPIAR) {
            // Dataset CON PIAR para esta área (barra GRIS)
            datasets.push({
              label: \`\${area} (con PIAR)\`,
              data: dataIntegradoConPIAR.map(d => d[area]),
              backgroundColor: '#9ca3af',
              borderColor: '#6b7280',
              borderWidth: 1,
              barThickness: 'flex',
              maxBarThickness: 50
            });
            
            // Dataset SIN PIAR para esta área (barra A COLOR SÓLIDO)
            datasets.push({
              label: \`\${area} (sin PIAR)\`,
              data: dataIntegradoSinPIAR.map(d => d[area]),
              backgroundColor: color,
              borderColor: color,
              borderWidth: 2,
              barThickness: 'flex',
              maxBarThickness: 50
            });
          } else {
            // Solo SIN PIAR
            datasets.push({
              label: area,
              data: dataIntegradoSinPIAR.map(d => d[area]),
              backgroundColor: color,
              borderColor: color,
              borderWidth: 1,
              barThickness: 'flex',
              maxBarThickness: 50
            });
          }
        });
        
        return datasets;
      }
      
      charts.integrado = new Chart(ctxIntegrado, {
        type: 'bar',
        data: {
          labels: dataIntegradoSinPIAR.map(d => d.grado),
          datasets: createIntegradoDatasets()
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              max: 100,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { size: 12 } }
            },
            x: {
              stacked: false,
              grid: { display: false },
              ticks: { 
                font: { size: 12, weight: 'bold' }
              }
            }
          },
          plugins: {
            datalabels: {
              display: true,
              anchor: 'end',
              align: 'end',
              offset: 2,
              font: {
                size: 9,
                weight: 'bold'
              },
              formatter: (value) => value ? value.toFixed(1) : '',
              color: '#1e293b'
            },
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                font: { size: 12, weight: 'bold' },
                padding: 15,
                usePointStyle: true,
                boxWidth: 20,
                boxHeight: 20,
                generateLabels: function(chart) {
                  const areas = ['Lectura', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
                  const areaColors = {
                    'Lectura': '#3b82f6',
                    'Matemáticas': '#ef4444',
                    'Sociales': '#f97316',
                    'Naturales': '#22c55e',
                    'Inglés': '#a855f7'
                  };
                  
                  const labels = [];
                  
                  // Primera fila: colores de áreas (Sin PIAR - colores sólidos)
                  areas.forEach(area => {
                    labels.push({
                      text: area,
                      fillStyle: areaColors[area],
                      strokeStyle: areaColors[area],
                      lineWidth: 0,
                      hidden: false,
                      pointStyle: 'circle',
                      datasetIndex: -1
                    });
                  });
                  
                  // Segunda fila: indicadores Con/Sin PIAR
                  if (showPIAR) {
                    // Separador visual
                    labels.push({
                      text: '  ',
                      fillStyle: 'transparent',
                      strokeStyle: 'transparent',
                      hidden: false,
                      pointStyle: 'line',
                      datasetIndex: -1
                    });
                    
                    labels.push({
                      text: 'Con PIAR',
                      fillStyle: '#9ca3af',
                      strokeStyle: '#6b7280',
                      lineWidth: 1,
                      hidden: false,
                      pointStyle: 'rect',
                      datasetIndex: -1
                    });
                    
                    labels.push({
                      text: 'Sin PIAR',
                      fillStyle: '#475569',
                      strokeStyle: '#475569',
                      lineWidth: 0,
                      hidden: false,
                      pointStyle: 'rect',
                      datasetIndex: -1
                    });
                  }
                  
                  return labels;
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              cornerRadius: 8,
              callbacks: {
                title: function(context) {
                  return context[0].label;
                },
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y.toFixed(1);
                  return label + ': ' + value;
                }
              }
            }
          },
          animation: {
            duration: 800,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
    
    // Toggle comparación PIAR
    function togglePIARComparison() {
      showPIAR = !showPIAR;
      const button = document.getElementById('togglePIAR');
      
      if (showPIAR) {
        button.textContent = 'Comparación Activa';
        button.classList.remove('inactive');
      } else {
        button.textContent = 'Comparación Desactivada';
        button.classList.add('inactive');
      }
      
      // Destruir gráficos existentes
      Object.values(charts).forEach(chart => chart.destroy());
      
      // Reinicializar gráficos
      initCharts();
    }
    
    // Inicializar al cargar
    window.addEventListener('load', () => {
      renderStudentsTable();
      initCharts();
    });
  </script>
</body>
</html>`;
  
  return html;
}

/**
 * Descarga el HTML generado como archivo
 * @param {string} html - Contenido HTML
 * @param {string} filename - Nombre del archivo
 */
export function downloadHTML(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
