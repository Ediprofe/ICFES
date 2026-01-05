/**
 * Configuración compartida de Chart.js
 * 
 * Este módulo centraliza TODAS las configuraciones de gráficos.
 * Se usa tanto en React (react-chartjs-2) como en HTML export.
 */

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

// ============================================
// COLORES
// ============================================

export const COLORS = {
    areas: {
        lectura: '#3b82f6',
        matematicas: '#ef4444',
        sociales: '#f97316',
        naturales: '#22c55e',
        ingles: '#a855f7'
    },
    groups: ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6'],
    pruebas: ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6'],
    piar: '#9ca3af'
};

export const AREA_NAMES = {
    lectura: 'Lectura',
    matematicas: 'Matemáticas',
    sociales: 'Sociales',
    naturales: 'Naturales',
    ingles: 'Inglés'
};

// ============================================
// OPCIONES BASE
// ============================================

export const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                font: { size: 12, weight: 'bold', family: 'system-ui' },
                padding: 15,
                usePointStyle: true
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            cornerRadius: 8,
            displayColors: true
        },
        datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            offset: 4,
            font: { size: 11, weight: 'bold' },
            formatter: (value) => value !== null && value !== undefined ? parseFloat(value).toFixed(1) : '',
            color: '#1e293b'
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { font: { size: 12, weight: 'bold' } }
        },
        y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 } },
            beginAtZero: false
        }
    },
    animation: {
        duration: 800,
        easing: 'easeInOutQuart'
    }
};

// ============================================
// GENERADORES DE CONFIGURACIÓN
// ============================================

/**
 * Crea configuración para gráfico de barras simple
 */
export function createSingleBarConfig(labels, data, color, options = {}) {
    const colorWithAlpha = color + 'cc';

    return {
        labels,
        datasets: [{
            label: options.label || 'Valor',
            data,
            backgroundColor: Array.isArray(color) ? color.map(c => c + 'cc') : colorWithAlpha,
            borderColor: color,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
        }]
    };
}

/**
 * Crea configuración para gráfico de barras agrupadas (por grupo/comparación)
 */
export function createGroupedBarConfig(labels, datasets) {
    return {
        labels,
        datasets: datasets.map((ds, i) => ({
            label: ds.label,
            data: ds.data,
            backgroundColor: (COLORS.groups[i % COLORS.groups.length]) + 'aa',
            borderColor: COLORS.groups[i % COLORS.groups.length],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false
        }))
    };
}

/**
 * Crea configuración para gráfico de barras por prueba (colores variados)
 */
export function createPruebasBarConfig(labels, datasets) {
    return {
        labels,
        datasets: datasets.map((ds, i) => ({
            label: ds.label,
            data: ds.data,
            backgroundColor: (COLORS.pruebas[i % COLORS.pruebas.length]) + 'aa',
            borderColor: COLORS.pruebas[i % COLORS.pruebas.length],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false
        }))
    };
}

/**
 * Opciones para gráfico con escala 0-100 (para áreas)
 */
export function getAreaScaleOptions() {
    return {
        ...baseOptions,
        scales: {
            ...baseOptions.scales,
            y: {
                ...baseOptions.scales.y,
                min: 0,
                max: 100
            }
        }
    };
}

/**
 * Opciones sin leyenda
 */
export function getOptionsNoLegend() {
    return {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            legend: { display: false }
        }
    };
}

/**
 * Opciones con datalabels coloreados
 */
export function getOptionsWithColoredLabels(color) {
    return {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            legend: { display: false },
            datalabels: {
                ...baseOptions.plugins.datalabels,
                color: color
            }
        }
    };
}

/**
 * Calcula dominio Y con padding para evitar corte de labels
 */
export function getYDomainWithPadding(maxValue, padding = 15) {
    return [0, Math.ceil((maxValue + padding) / 10) * 10];
}

// ============================================
// EXPORTAR PARA HTML
// ============================================

/**
 * Genera string de configuración para HTML export
 * (Para usar en scripts inline del HTML)
 */
export function getChartConfigForHTML() {
    return {
        COLORS,
        AREA_NAMES,
        baseOptions: JSON.stringify(baseOptions),
        // Note: baseOptions para HTML necesita ser serializable
    };
}
