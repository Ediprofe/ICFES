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
  
  // Generar el HTML
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análisis ICFES - Presentación Interactiva</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
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
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    tr:hover {
      background: #f1f5f9;
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
        <h2>📈 Métricas Globales</h2>
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
      
      <!-- SECCIÓN 2: PROMEDIOS POR ÁREA -->
      <div class="section">
        <h2>📊 Análisis por Área</h2>
        
        <div class="controls">
          <h3 style="margin: 0;">Comparación de Promedios</h3>
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
          <h3>Desviación Estándar por Área</h3>
          <div class="chart-wrapper">
            <canvas id="chartDesviacion"></canvas>
          </div>
        </div>
        
        ${hasPercentileData ? `
        <div class="chart-container">
          <h3>Percentiles Promedio por Área</h3>
          <p style="color: #64748b; font-size: 0.9em; margin-bottom: 15px;">
            Posición relativa de los estudiantes respecto al total nacional
          </p>
          <div class="chart-wrapper">
            <canvas id="chartPercentiles"></canvas>
          </div>
        </div>
        ` : ''}
        
        <h3>Tabla Comparativa de Métricas</h3>
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
        <h2>🎓 Análisis por Grado</h2>
        
        <div class="chart-container">
          <h3>Promedios Globales por Grado</h3>
          <div class="chart-wrapper">
            <canvas id="chartGradosPromedios"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Desviación Estándar por Grado</h3>
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
        <h2>🏆 Top 5 por Área</h2>
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
        <h2>🌟 Top 3 por Grado</h2>
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
        <h2>⚡ Valores Atípicos (Outliers)</h2>
        <div class="info-box">
          <p><strong>Definición:</strong> Estudiantes cuyo puntaje global se encuentra a más de 3 desviaciones estándar (±3σ) del promedio.</p>
          <p>Estos valores indican rendimiento excepcional (positivo) o que requiere atención especial (negativo).</p>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Total de Outliers</div>
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
            <div class="metric-label">Bajo Rendimiento</div>
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
                      ${isSobresaliente ? '↑ Sobresaliente' : '↓ Bajo Rendimiento'}
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
        <h2>⚡ Valores Atípicos (Outliers)</h2>
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
          © ${new Date().getFullYear()} - Análisis ICFES Interactivo
        </p>
      </div>
    </footer>
  </div>
  
  <script>
    // Estado global
    let showPIAR = true;
    let charts = {};
    
    // Colores por área
    const areaColors = {
      'Lectura': '#3b82f6',
      'Matemáticas': '#ef4444',
      'Sociales': '#f97316',
      'Naturales': '#22c55e',
      'Inglés': '#a855f7'
    };
    
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
            ...commonOptions.plugins,
            datalabels: false
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
