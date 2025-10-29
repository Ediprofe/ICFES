/**
 * ✅ Componentes HTML: Clasificación de Plantel
 * Genera los componentes visuales para la sección de clasificación
 */

/**
 * Genera la sección de metodología
 */
export function generateMethodologySection() {
  return `
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
      <h3 class="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
        <span class="text-2xl">📖</span>
        <span>Metodología de cálculo</span>
      </h3>
      
      <div class="space-y-3 text-sm text-gray-800">
        <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <p class="font-bold text-blue-900 mb-2">1. Muestra base (sin PIAR)</p>
          <p>Se excluyen estudiantes con PIAR de cada cohorte para obtener la muestra base.</p>
        </div>
        
        <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <p class="font-bold text-green-900 mb-2">2. Top 80% por área</p>
          <p>De la muestra sin PIAR, se selecciona el <strong>80% de mejores puntajes</strong> en cada área académica independientemente.</p>
        </div>
        
        <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
          <p class="font-bold text-purple-900 mb-2">3. Índice de área</p>
          <p class="mb-2"><strong>Fórmula:</strong> <code class="bg-gray-100 px-2 py-1 rounded">Índice = Promedio / (1 - Varianza)</code></p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li><strong>Promedio:</strong> Promedio de puntajes del top 80% normalizado (0-1)</li>
            <li><strong>Varianza:</strong> Σ(FRA - Promedio)² / 101 donde FRA = Frecuencia Relativa Acumulada</li>
            <li>La varianza se calcula sobre la FRA, no sobre los puntajes directos</li>
            <li>El índice resultante está en escala 0-1</li>
          </ul>
        </div>
        
        <div class="bg-white rounded-lg p-4 border-l-4 border-orange-500">
          <p class="font-bold text-orange-900 mb-2">4. Índice global</p>
          <p class="mb-2"><strong>Fórmula:</strong></p>
          <div class="bg-gray-100 p-3 rounded font-mono text-xs">
            IG = [(3 × MA) + (3 × LC) + (3 × CN) + (3 × SC) + IN] / 13
          </div>
          <p class="mt-2 text-xs text-gray-600">
            MA: Matemáticas | LC: Lectura Crítica | CN: Ciencias Naturales | SC: Sociales | IN: Inglés
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-4 border-l-4 border-red-500">
          <p class="font-bold text-red-900 mb-2">5. Clasificación</p>
          <div class="grid grid-cols-5 gap-2 mt-2">
            <div class="text-center p-2 bg-green-100 rounded border border-green-300">
              <p class="font-bold text-green-800">A+</p>
              <p class="text-xs text-green-600">≥ 0.77</p>
            </div>
            <div class="text-center p-2 bg-green-50 rounded border border-green-200">
              <p class="font-bold text-green-700">A</p>
              <p class="text-xs text-green-600">0.72-0.77</p>
            </div>
            <div class="text-center p-2 bg-yellow-100 rounded border border-yellow-300">
              <p class="font-bold text-yellow-800">B</p>
              <p class="text-xs text-yellow-600">0.67-0.72</p>
            </div>
            <div class="text-center p-2 bg-orange-100 rounded border border-orange-300">
              <p class="font-bold text-orange-800">C</p>
              <p class="text-xs text-orange-600">0.62-0.67</p>
            </div>
            <div class="text-center p-2 bg-red-100 rounded border border-red-300">
              <p class="font-bold text-red-800">D</p>
              <p class="text-xs text-red-600">&lt; 0.62</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Genera los selectores de grupos de cohortes
 */
export function generateGroupSelectors(years) {
  return `
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span class="text-2xl">🎯</span>
        <span>Seleccionar grupos de cohortes para comparar</span>
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Grupo A -->
        <div class="border-2 border-emerald-300 rounded-lg p-4 bg-emerald-50">
          <h4 class="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <span class="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">A</span>
            <span>Grupo A</span>
          </h4>
          <div class="space-y-2">
            ${years.map(year => `
              <label class="flex items-center gap-2 px-3 py-2 bg-white hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors border border-emerald-200">
                <input 
                  type="checkbox" 
                  class="clasificacion-group-a w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" 
                  value="${year}"
                  onchange="updateClasificacionComparison()"
                >
                <span class="font-semibold text-gray-800">${year}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Grupo B -->
        <div class="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
          <h4 class="text-lg font-bold text-teal-800 mb-3 flex items-center gap-2">
            <span class="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">B</span>
            <span>Grupo B</span>
          </h4>
          <div class="space-y-2">
            ${years.map(year => `
              <label class="flex items-center gap-2 px-3 py-2 bg-white hover:bg-teal-100 rounded-lg cursor-pointer transition-colors border border-teal-200">
                <input 
                  type="checkbox" 
                  class="clasificacion-group-b w-4 h-4 text-teal-600 rounded focus:ring-teal-500" 
                  value="${year}"
                  onchange="updateClasificacionComparison()"
                >
                <span class="font-semibold text-gray-800">${year}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p class="text-sm text-yellow-800">
          <strong>💡 Sugerencia:</strong> Selecciona diferentes grupos de años para comparar la evolución del plantel. 
          Por ejemplo: Grupo A (2022, 2023, 2024) vs Grupo B (2023, 2024, 2025).
        </p>
      </div>
    </div>
  `;
}

/**
 * Genera el contenedor de resultados inicial
 */
export function generateResultsContainer() {
  return `
    <div id="clasificacionResults" class="mt-6">
      <div class="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <p class="text-gray-600">
          <span class="text-4xl mb-3 block">🎯</span>
          <span class="text-lg font-semibold">Selecciona años en ambos grupos para ver la comparación</span>
        </p>
      </div>
    </div>
  `;
}
