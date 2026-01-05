/**
 * Generador de HTML para Análisis Longitudinal
 * 
 * Archivo principal que orquesta los módulos de exportación.
 * Genera HTML profesional e interactivo con Chart.js + datalabels.
 */

import { getHtmlHead, getReportHeader, getReportFooter, getTabsNavigation, AREA_NAMES } from './export/htmlTemplates.js';
import {
    generateGlobalEvolutionChart,
    generateDesviacionChart,
    generateAreaChart,
    generateGroupChart,
    generateGroupAreaChart
} from './export/chartConfigs.js';
import {
    generateGradeTab,
    generateGroupsTab,
    generateStudentsTab,
    generateInteractivityScripts
} from './export/tabContents.js';

/**
 * Prepara los datos de ranking de estudiantes
 */
function prepareStudentRankingData(analysis) {
    const allStudents = Array.from(analysis.estudiantes.values());

    return allStudents.map(student => {
        const metrics = analysis.getStudentMetrics(student.codigo);
        const resultados = metrics?.resultados || [];

        const globales = resultados.filter(r => r.presente).map(r => r.global);
        const promedioGlobal = globales.length > 0 ? globales.reduce((a, b) => a + b, 0) / globales.length : null;

        const areas = {};
        Object.keys(AREA_NAMES).forEach(area => {
            const valores = resultados.filter(r => r.presente && r.areas[area] !== null).map(r => r.areas[area]);
            areas[area] = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
        });

        const pruebasPresentes = resultados.filter(r => r.presente).length;
        const todasLasPruebas = pruebasPresentes === analysis.pruebas.length;

        return {
            ...student,
            promedioGlobal,
            ...areas,
            pruebasPresentes,
            pruebasTotales: analysis.pruebas.length,
            todasLasPruebas
        };
    }).filter(s => s.promedioGlobal !== null)
        .sort((a, b) => (b.promedioGlobal || 0) - (a.promedioGlobal || 0));
}

/**
 * Genera todos los scripts de Chart.js
 */
function generateAllChartScripts(analysis, gradeMetrics, groups) {
    const areaCharts = Object.entries(AREA_NAMES).map(([key, name]) =>
        generateAreaChart(gradeMetrics, key, name, `chartArea_${key}`)
    ).join('\n');

    const groupAreaCharts = Object.entries(AREA_NAMES).map(([key]) =>
        generateGroupAreaChart(analysis, groups, key, `chartGroupArea_${key}`)
    ).join('\n');

    return `
    <script>
        // Register datalabels plugin globally
        Chart.register(ChartDataLabels);
        
        // Default configurations
        Chart.defaults.font.family = 'Inter';
        Chart.defaults.plugins.datalabels.display = true;

        // Grade Evolution Charts
        ${generateGlobalEvolutionChart(gradeMetrics)}
        ${generateDesviacionChart(gradeMetrics)}
        ${areaCharts}

        // Group Comparison Charts
        ${generateGroupChart(analysis, groups, 'chartGroupGlobal', 'promedioGlobal')}
        ${generateGroupChart(analysis, groups, 'chartGroupDesviacion', 'desviacionGlobal')}
        ${groupAreaCharts}
    <\/script>`;
}

/**
 * Genera el HTML completo del reporte longitudinal
 * @param {import('../models/LongitudinalAnalysis.js').LongitudinalAnalysis} analysis
 * @returns {string} HTML completo
 */
export function generateLongitudinalHTML(analysis) {
    const gradeMetrics = analysis.getGradeMetrics(true); // Sin PIAR
    const groups = analysis.grupos;
    const studentRankingData = prepareStudentRankingData(analysis);
    const title = `Análisis Longitudinal - ${analysis.grado}`;

    // Ensamblar HTML
    const html = [
        getHtmlHead(title),
        getReportHeader(analysis),
        getTabsNavigation(),
        generateGradeTab(gradeMetrics),
        generateGroupsTab(groups),
        generateStudentsTab(studentRankingData, groups),
        '        </div>', // Close tabs container
        generateInteractivityScripts(),
        generateAllChartScripts(analysis, gradeMetrics, groups),
        getReportFooter()
    ].join('\n');

    return html;
}
