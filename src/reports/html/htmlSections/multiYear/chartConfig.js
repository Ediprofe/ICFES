/**
 * Configuración compartida de Chart.js para sección multi-año
 * @module multiYear/chartConfig
 */

/**
 * Colores disponibles para cada año en gráficos
 */
export const YEAR_COLORS = [
  { border: 'rgba(59, 130, 246, 1)', background: 'rgba(59, 130, 246, 0.1)' },   // Azul
  { border: 'rgba(16, 185, 129, 1)', background: 'rgba(16, 185, 129, 0.1)' },   // Verde
  { border: 'rgba(239, 68, 68, 1)', background: 'rgba(239, 68, 68, 0.1)' },     // Rojo
  { border: 'rgba(245, 158, 11, 1)', background: 'rgba(245, 158, 11, 0.1)' },   // Naranja
  { border: 'rgba(139, 92, 246, 1)', background: 'rgba(139, 92, 246, 0.1)' },   // Púrpura
  { border: 'rgba(236, 72, 153, 1)', background: 'rgba(236, 72, 153, 0.1)' },   // Rosa
];

/**
 * Opciones base para Chart.js
 */
export const BASE_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1500,
    easing: 'easeInOutQuart'
  },
  interaction: {
    mode: 'index',
    intersect: false
  }
};

/**
 * Configuración de plugins de Chart.js
 */
export const CHART_PLUGINS_CONFIG = {
  legend: {
    display: true,
    position: 'top',
    labels: {
      font: { size: 14, weight: '600' },
      padding: 15,
      usePointStyle: true,
      pointStyle: 'circle'
    }
  },
  datalabels: {
    anchor: 'end',
    align: 'top',
    font: { weight: 'bold', size: 14 },
    color: '#1f2937',
    offset: 4,
    formatter: (value) => typeof value === 'number' ? value.toFixed(1) : value
  }
};

/**
 * Zonas de rendimiento por percentiles
 */
export const PERFORMANCE_ZONES = {
  roja: { min: 0, max: 25, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.08)', label: 'Necesita apoyo' },
  amarilla: { min: 25, max: 50, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.08)', label: 'En desarrollo' },
  verde: { min: 50, max: 75, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.08)', label: 'Satisfactorio' },
  azul: { min: 75, max: 100, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.08)', label: 'Sobresaliente' }
};
