/**
 * Chart Configuration for Longitudinal HTML Export
 * 
 * Contains chart options and dataset helper functions
 */

/**
 * Generates the chart options and dataset helper functions
 * @returns {string} - JavaScript code for chart config
 */
export function generateChartConfig() {
    return `
// Opciones base
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true } },
        datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            offset: 4,
            font: { size: 10, weight: 'bold' },
            formatter: (v) => v ? parseFloat(v).toFixed(1) : '',
            color: '#1e293b'
        }
    },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } }
    }
};

// Opciones específicas para grupos (filtrar leyenda PIAR)
const groupOptions = {
    ...baseOptions,
    plugins: {
        ...baseOptions.plugins,
        legend: {
            ...baseOptions.plugins.legend,
            labels: {
                ...baseOptions.plugins.legend.labels,
                filter: (legendItem, chartData) => {
                     // Solo mostrar el PRIMER label 'Con PIAR' en la leyenda
                     if (legendItem.text.includes('Con PIAR')) {
                        const datasets = chartData.datasets;
                        const firstIndex = datasets.findIndex(d => d.label.includes('Con PIAR'));
                        return legendItem.datasetIndex === firstIndex;
                     }
                     return true;
                }
            }
        }
    }
};
`;
}

/**
 * Generates the dataset helper functions for App component
 * @returns {string} - JavaScript code for dataset helpers
 */
export function generateDatasetHelpers() {
    return `
    // Helpers para datasets comparativos
    const getComparisonDataset = (isGlobal, areaKey = null, metricKey = 'promedio') => {
        const datasets = [];
        
        // Principal (Sin PIAR)
        datasets.push({
            label: isGlobal ? 'Promedio (Sin PIAR)' : DATA.areaNames[areaKey] + ' (Sin PIAR)',
            data: DATA.gradeMetricsSinPIAR.map(m => isGlobal ? m.promedioGlobal : (m.areas[areaKey]?.[metricKey] || 0)),
            backgroundColor: DATA.gradeMetricsSinPIAR.map((_, i) => {
                const isLast = i === DATA.gradeMetricsSinPIAR.length - 1;
                const baseColor = isGlobal 
                    ? DATA.colors.pruebas[i % DATA.colors.pruebas.length]
                    : DATA.colors.areas[areaKey];
                // Último: Color sólido. Anteriores: Opacidad reducida ('66' ~40%)
                return baseColor + (isLast ? '' : '66');
            }),
            borderColor: isGlobal
                ? DATA.gradeMetricsSinPIAR.map((_, i) => DATA.colors.pruebas[i % DATA.colors.pruebas.length])
                : DATA.colors.areas[areaKey],
            borderWidth: 2,
            borderRadius: 6,
            order: 2
        });

        // Comparativo (Con PIAR) - Solo si se activa toggle
        const chartId = isGlobal ? 'global' : 'area_' + areaKey;
        if (showPIAR[chartId]) {
            datasets.push({
                label: isGlobal ? 'Promedio (Con PIAR)' : 'Con PIAR',
                data: DATA.gradeMetricsConPIAR.map(m => isGlobal ? m.promedioGlobal : (m.areas[areaKey]?.[metricKey] || 0)),
                backgroundColor: '#cbd5e1', // Slate-300
                borderColor: '#94a3b8', // Slate-400
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.5,
                categoryPercentage: 0.8,
                order: 1,
                datalabels: {
                    color: '#64748b', // Slate-500
                    font: { size: 9 },
                    anchor: 'end',
                    align: 'top'
                }
            });
        }

        return datasets;
    };

    // Helper para comparativa grupos
    const getGroupDataset = (isGlobal, areaKey = null) => {
        const datasets = [];
        
        DATA.grupos.forEach((g, i) => {
            const baseGroupColor = DATA.colors.groups[i % DATA.colors.groups.length];

            // Grupo principal
            datasets.push({
                label: g, // Solo el nombre del grupo
                data: DATA.pruebas.map(p => {
                    const match = DATA.groupMetrics[g].sinPIAR.find(m => m.pruebaId === p.id);
                    return isGlobal ? (match?.promedioGlobal || 0) : (match?.areas?.[areaKey]?.promedio || 0);
                }),
                // Color dinámico: Última prueba sólida, anteriores transparentes
                backgroundColor: DATA.pruebas.map((_, idx) => {
                    const isLast = idx === DATA.pruebas.length - 1;
                    return baseGroupColor + (isLast ? '' : '55'); // '55' ~33% opacity
                }),
                borderColor: baseGroupColor,
                borderWidth: 2,
                borderRadius: 4,
                // Agrupamiento visual: Para que queden juntos G1 y su PIAR, pero separados de G2
                stack: 'grupo_' + g 
            });

            // Grupo comparativo (PIAR)
            const chartId = isGlobal ? 'group_global' : 'group_area_' + areaKey;
            if (showPIAR[chartId]) {
                datasets.push({
                    label: 'Con PIAR', // Nombre genérico para la leyenda
                    data: DATA.pruebas.map(p => {
                        const match = DATA.groupMetrics[g].conPIAR.find(m => m.pruebaId === p.id);
                        return isGlobal ? (match?.promedioGlobal || 0) : (match?.areas?.[areaKey]?.promedio || 0);
                    }),
                    backgroundColor: '#9ca3af', // Gray-400
                    borderColor: '#6b7280', // Gray-500
                    borderWidth: 1,
                    borderRadius: 4,
                    stack: 'grupo_' + g, // Stack compartido para agrupación lógica si se usara, pero lo borramos abajo
                });
            }
        });

        // Re-organización para Chart.js:
        // Borramos stack para evitar apilamiento vertical. Borramos order para respetar intercalado.
        datasets.forEach(d => { delete d.stack; delete d.order; });

        return datasets;
    };
`;
}
