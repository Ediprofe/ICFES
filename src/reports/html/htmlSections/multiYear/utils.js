/**
 * Utilidades compartidas para sección multi-año
 * @module multiYear/utils
 */

/**
 * Ordena un array de análisis por año ascendente
 * @param {Array} analyses - Array de objetos Analysis
 * @returns {Array} Array ordenado
 */
export const sortAnalysesByYear = (analyses) => {
    return [...analyses].sort((a, b) => a.year - b.year);
};

/**
 * Extrae los años de un array de análisis
 * @param {Array} analyses - Array de objetos Analysis
 * @returns {Array<number>} Array de años
 */
export const extractYears = (analyses) => {
    return analyses.map(a => a.year);
};

/**
 * Prepara métricas globales sin PIAR para cada año
 * @param {Array} analyses - Array de objetos Analysis ordenados
 * @returns {Array<Object>} Datos de métricas por año
 */
export const prepareGlobalMetricsData = (analyses) => {
    return analyses.map(analysis => {
        const globalSinPIAR = analysis.getGlobalMetrics(true, false);
        return {
            year: analysis.year,
            promedio: globalSinPIAR.promedio,
            desviacion: globalSinPIAR.desviacion
        };
    });
};

/**
 * Genera HTML para selector de años con checkboxes
 * @param {Array<number>} years - Años disponibles
 * @param {string} className - Clase CSS para los checkboxes
 * @param {string} onChangeHandler - Nombre de función onChange
 * @param {Array} [yearColors] - Colores opcionales por año
 * @returns {string} HTML del selector
 */
export const generateYearSelector = (years, className, onChangeHandler, yearColors = null) => {
    return years.map((year, index) => {
        const colorSpan = yearColors
            ? `<span class="w-6 h-6 rounded-full" style="background-color: ${yearColors[index % yearColors.length].border}"></span>`
            : '';

        return `
      <label class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors border-2 border-transparent hover:border-purple-500">
        <input 
          type="checkbox" 
          class="${className} w-5 h-5 text-purple-600 rounded focus:ring-purple-500" 
          value="${year}"
          ${yearColors ? `data-color-border="${yearColors[index % yearColors.length].border}" data-color-bg="${yearColors[index % yearColors.length].background}"` : ''}
          checked
          onchange="${onChangeHandler}()"
        >
        <span class="font-semibold text-gray-800">${year}</span>
        ${colorSpan}
      </label>
    `;
    }).join('');
};

/**
 * Genera botones de seleccionar/deseleccionar todos
 * @param {string} functionName - Nombre de la función JS a llamar
 * @param {string} [bgColor='purple'] - Color base de Tailwind
 * @returns {string} HTML de los botones
 */
export const generateSelectAllButtons = (functionName, bgColor = 'purple') => {
    return `
    <button 
      onclick="${functionName}(true)" 
      class="px-4 py-2 bg-${bgColor}-600 text-white rounded-lg hover:bg-${bgColor}-700 transition-colors font-medium text-sm mr-2"
    >
      ✓ Seleccionar todos
    </button>
    <button 
      onclick="${functionName}(false)" 
      class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
    >
      ✗ Deseleccionar todos
    </button>
  `;
};

/**
 * Genera encabezado de sección con gradiente
 * @param {number} sectionNumber - Número de sección
 * @param {string} title - Título de la sección
 * @param {string} subtitle - Subtítulo de la sección
 * @param {string} [gradient='from-purple-600 to-pink-600'] - Clases de gradiente
 * @returns {string} HTML del encabezado
 */
export const generateSectionHeader = (sectionNumber, title, subtitle, gradient = 'from-purple-600 to-pink-600') => {
    return `
    <div class="bg-gradient-to-r ${gradient} text-white rounded-t-lg p-4 mb-6">
      <h2 class="text-2xl font-bold">${sectionNumber}. ${title}</h2>
      <p class="text-purple-100 text-sm mt-1">${subtitle}</p>
    </div>
  `;
};
