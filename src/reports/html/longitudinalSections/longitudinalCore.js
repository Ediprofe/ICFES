/**
 * Core utilities for Longitudinal HTML Export
 * 
 * Prepares all data needed for the export and provides HTML document structure
 */

import { COLORS, AREA_NAMES } from '../../utils/chartConfig';

/**
 * Prepares all data for export from a LongitudinalAnalysis instance
 * @param {LongitudinalAnalysis} analysis - The analysis model
 * @returns {Object} - Prepared data object
 */
export function prepareExportData(analysis) {
    // Métricas del grado
    const gradeMetricsSinPIAR = analysis.getGradeMetrics(true);
    const gradeMetricsConPIAR = analysis.getGradeMetrics(false);

    // Métricas por grupo
    const groupMetrics = {};
    analysis.grupos.forEach(g => {
        groupMetrics[g] = {
            sinPIAR: analysis.getGroupMetrics(g, true),
            conPIAR: analysis.getGroupMetrics(g, false)
        };
    });

    // Datos de estudiantes
    const students = Array.from(analysis.estudiantes.values()).map(student => {
        const metrics = analysis.getStudentMetrics(student.codigo);
        const resultados = metrics?.resultados || [];

        // Promedios
        const globales = resultados.filter(r => r.presente).map(r => r.global);
        const promedioGlobal = globales.length > 0 ? globales.reduce((a, b) => a + b, 0) / globales.length : null;

        const areasPromedio = {};
        Object.keys(AREA_NAMES).forEach(area => {
            const valores = resultados.filter(r => r.presente && r.areas[area] !== null).map(r => r.areas[area]);
            areasPromedio[area] = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
        });

        // Datos por prueba específica (para ranking por simulacro)
        const datosPorPrueba = {};
        resultados.forEach(r => {
            datosPorPrueba[r.pruebaId] = {
                global: r.presente ? r.global : null,
                ...Object.fromEntries(Object.keys(AREA_NAMES).map(area => [area, r.presente ? r.areas[area] : null]))
            };
        });

        return {
            codigo: student.codigo,
            nombre: student.nombre,
            apellido: student.apellido,
            grupo: student.grupo,
            piar: student.piar,
            promedioGlobal,
            areasPromedio,
            datosPorPrueba,
            resultados: resultados.map(r => ({
                pruebaId: r.pruebaId,
                pruebaNombre: r.pruebaNombre,
                presente: r.presente,
                global: r.global,
                areas: r.areas
            })),
            pruebasPresentes: resultados.filter(r => r.presente).length,
            pruebasTotales: analysis.pruebas.length,
            todasLasPruebas: resultados.filter(r => r.presente).length === analysis.pruebas.length
        };
    }).filter(s => s.promedioGlobal !== null)
        .sort((a, b) => (b.promedioGlobal || 0) - (a.promedioGlobal || 0));

    return {
        grado: analysis.grado,
        pruebas: analysis.pruebas.map(p => ({ id: p.id, nombre: p.nombre })),
        grupos: analysis.grupos,
        gradeMetricsSinPIAR,
        gradeMetricsConPIAR,
        groupMetrics,
        students,
        colors: COLORS,
        areaNames: AREA_NAMES
    };
}

/**
 * Generates the HTML document header (DOCTYPE, head, CDN scripts)
 * @param {string} grado - Grade name for title
 * @returns {string} - HTML head section
 */
export function generateHtmlHead(grado) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Análisis Longitudinal - ${grado}</title>
    
    <!-- CDN: Librerías públicas (sin datos de estudiantes) -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
`;
}

/**
 * Generates the HTML document footer (closing tags)
 * @returns {string} - HTML footer
 */
export function generateHtmlFooter() {
    return `
</body>
</html>`;
}

/**
 * Generates the data embedding script
 * @param {string} dataJSON - Stringified data object
 * @returns {string} - Script tag with embedded data
 */
export function generateDataScript(dataJSON) {
    return `
<!-- DATOS EMBEBIDOS (privados, nunca salen de tu PC) -->
<script>
    const DATA = ${dataJSON};
    Chart.register(ChartDataLabels);
</script>

<div id="root"></div>
`;
}
