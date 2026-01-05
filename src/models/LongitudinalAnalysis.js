/**
 * LongitudinalAnalysis - Modelo para análisis longitudinal
 * 
 * Estructura datos para analizar evolución de un grado a través de múltiples pruebas.
 * Niveles de análisis: Grado → Grupos → Estudiantes
 */

import { ACADEMIC_AREAS } from '../config/columnConfig.js';

/**
 * @typedef {Object} Prueba
 * @property {string} id - ID de la prueba
 * @property {string} nombre - Nombre de la prueba
 * @property {Array} data - Datos de estudiantes
 * @property {number} totalEstudiantes - Total de estudiantes
 */

/**
 * @typedef {Object} Estudiante
 * @property {string} codigo - Código único
 * @property {string} nombre - Nombre
 * @property {string} apellido - Apellido
 * @property {string} grupo - Grupo al que pertenece
 * @property {string} piar - Estado PIAR
 */

export class LongitudinalAnalysis {
    /**
     * @param {Object} parsedData - Datos del parser parseExcelMultiSheet
     */
    constructor(parsedData = null) {
        this.grado = parsedData?.grado || '';
        this.pruebas = parsedData?.pruebas || [];
        this.estudiantes = parsedData?.estudiantes || new Map();
        this.grupos = parsedData?.grupos || [];
        this.metadata = parsedData?.metadata || {};
    }

    /**
     * Calcula métricas a nivel de grado (todos los estudiantes)
     * @param {boolean} excludePIAR - Excluir estudiantes PIAR
     * @returns {Object} Métricas por prueba
     */
    getGradeMetrics(excludePIAR = true) {
        return this.pruebas.map(prueba => {
            const data = excludePIAR
                ? prueba.data.filter(row => row['¿PIAR?'] !== 'Sí')
                : prueba.data;

            return {
                pruebaId: prueba.id,
                pruebaNombre: prueba.nombre,
                totalEstudiantes: data.length,
                ...this._calculateMetrics(data)
            };
        });
    }

    /**
     * Calcula métricas por grupo
     * @param {string} grupo - Nombre del grupo (opcional, si no se pasa, retorna todos)
     * @param {boolean} excludePIAR - Excluir estudiantes PIAR
     * @returns {Object} Métricas por grupo y prueba
     */
    getGroupMetrics(grupo = null, excludePIAR = true) {
        const gruposAAnalizar = grupo ? [grupo] : this.grupos;

        const result = {};

        gruposAAnalizar.forEach(g => {
            result[g] = this.pruebas.map(prueba => {
                let data = prueba.data.filter(row => row['Grupo'] === g);
                if (excludePIAR) {
                    data = data.filter(row => row['¿PIAR?'] !== 'Sí');
                }

                return {
                    pruebaId: prueba.id,
                    pruebaNombre: prueba.nombre,
                    totalEstudiantes: data.length,
                    ...this._calculateMetrics(data)
                };
            });
        });

        return grupo ? result[grupo] : result;
    }

    /**
     * Calcula métricas para un estudiante específico
     * @param {string} codigo - Código del estudiante
     * @returns {Object} Métricas del estudiante por prueba
     */
    getStudentMetrics(codigo) {
        const estudiante = this.estudiantes.get(codigo);
        if (!estudiante) return null;

        const resultados = this.pruebas.map(prueba => {
            const row = prueba.data.find(r => r['Código'] === codigo);
            if (!row) {
                return {
                    pruebaId: prueba.id,
                    pruebaNombre: prueba.nombre,
                    presente: false,
                    global: null,
                    areas: {}
                };
            }

            const areas = {};
            ACADEMIC_AREAS.forEach(area => {
                areas[area.id] = row[area.columnName] ?? null;
            });

            return {
                pruebaId: prueba.id,
                pruebaNombre: prueba.nombre,
                presente: true,
                global: row['Global'],
                areas
            };
        });

        // Calcular cambio entre primera y última prueba
        const pruebasPresente = resultados.filter(r => r.presente);
        let cambioGlobal = null;
        let cambioAreas = {};

        if (pruebasPresente.length >= 2) {
            const primera = pruebasPresente[0];
            const ultima = pruebasPresente[pruebasPresente.length - 1];

            cambioGlobal = ultima.global - primera.global;

            ACADEMIC_AREAS.forEach(area => {
                const valorPrimera = primera.areas[area.id];
                const valorUltima = ultima.areas[area.id];
                if (valorPrimera !== null && valorUltima !== null) {
                    cambioAreas[area.id] = valorUltima - valorPrimera;
                }
            });
        }

        // Calcular variabilidad (desviación estándar de sus propios resultados)
        const globales = pruebasPresente.map(r => r.global).filter(g => g !== null);
        const variabilidad = this._calculateStdDev(globales);

        return {
            estudiante,
            resultados,
            resumen: {
                pruebasPresente: pruebasPresente.length,
                pruebasTotales: this.pruebas.length,
                cambioGlobal,
                cambioAreas,
                variabilidad
            }
        };
    }

    /**
     * Obtiene ranking de grupos por promedio global en una prueba
     * @param {string} pruebaId - ID de la prueba
     * @param {boolean} excludePIAR - Excluir estudiantes PIAR
     * @returns {Array} Grupos ordenados por promedio
     */
    getGroupRanking(pruebaId, excludePIAR = true) {
        const prueba = this.pruebas.find(p => p.id === pruebaId);
        if (!prueba) return [];

        return this.grupos.map(grupo => {
            let data = prueba.data.filter(row => row['Grupo'] === grupo);
            if (excludePIAR) {
                data = data.filter(row => row['¿PIAR?'] !== 'Sí');
            }

            const globales = data.map(r => r['Global']).filter(g => g !== null);
            const promedio = globales.length > 0
                ? globales.reduce((a, b) => a + b, 0) / globales.length
                : 0;

            return {
                grupo,
                promedio,
                totalEstudiantes: data.length
            };
        }).sort((a, b) => b.promedio - a.promedio);
    }

    /**
     * Obtiene estudiantes con mayor/menor cambio entre primera y última prueba
     * @param {number} limit - Cantidad de estudiantes a retornar
     * @param {boolean} excludePIAR - Excluir estudiantes PIAR
     * @returns {Object} { mejora: [], caida: [] }
     */
    getStudentChanges(limit = 5, excludePIAR = true) {
        const cambios = [];

        this.estudiantes.forEach((estudiante, codigo) => {
            if (excludePIAR && estudiante.piar === 'Sí') return;

            const metrics = this.getStudentMetrics(codigo);
            if (metrics && metrics.resumen.cambioGlobal !== null) {
                cambios.push({
                    codigo,
                    estudiante,
                    cambio: metrics.resumen.cambioGlobal
                });
            }
        });

        cambios.sort((a, b) => b.cambio - a.cambio);

        return {
            mayorMejora: cambios.slice(0, limit),
            mayorCaida: cambios.slice(-limit).reverse()
        };
    }

    /**
     * Calcula métricas básicas de un conjunto de datos
     * @private
     */
    _calculateMetrics(data) {
        // Global
        const globales = data.map(r => r['Global']).filter(g => g !== null);
        const promedioGlobal = this._calculateMean(globales);
        const desvGlobal = this._calculateStdDev(globales);

        // Por área
        const areas = {};
        ACADEMIC_AREAS.forEach(area => {
            const valores = data.map(r => r[area.columnName]).filter(v => v !== null);
            areas[area.id] = {
                promedio: this._calculateMean(valores),
                desviacion: this._calculateStdDev(valores)
            };
        });

        return {
            promedioGlobal,
            desviacionGlobal: desvGlobal,
            areas
        };
    }

    _calculateMean(values) {
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    _calculateStdDev(values) {
        if (values.length < 2) return 0;
        const mean = this._calculateMean(values);
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
    }

    /**
     * Serializa para persistencia
     */
    toJSON() {
        return {
            grado: this.grado,
            pruebas: this.pruebas,
            estudiantes: Array.from(this.estudiantes.entries()),
            grupos: this.grupos,
            metadata: this.metadata
        };
    }

    /**
     * Deserializa desde JSON
     */
    static fromJSON(json) {
        const instance = new LongitudinalAnalysis();
        instance.grado = json.grado;
        instance.pruebas = json.pruebas;
        instance.estudiantes = new Map(json.estudiantes);
        instance.grupos = json.grupos;
        instance.metadata = json.metadata;
        return instance;
    }
}

export default LongitudinalAnalysis;
