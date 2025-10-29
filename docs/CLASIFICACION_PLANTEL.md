# 📊 Clasificación de Plantel - Documentación Técnica

## Descripción General

La sección **"Clasificación de Plantel"** es una nueva funcionalidad del reporte HTML comparativo (multianual) que permite evaluar y comparar el desempeño institucional entre diferentes grupos de cohortes mediante un sistema de índices académicos.

## Ubicación en el Reporte

Esta sección aparece como la **última sección** del reporte HTML comparativo (multianual), después de:
1. Gráfico de tendencias
2. Tabla de todos los estudiantes
3. Tabla de métricas combinadas
4. Curvas de distribución normal
5. Comparación global
6. Comparación por áreas
7. **→ Clasificación de plantel** (NUEVA)

## Metodología de Cálculo

### 1. Muestra Base (Sin PIAR)

**Objetivo:** Trabajar con una población homogénea que refleje el desempeño típico del plantel.

**Proceso:**
- Se excluyen todos los estudiantes que tienen PIAR (Plan Individual de Ajustes Razonables)
- Esto se hace para cada cohorte seleccionada
- La muestra resultante es la "muestra sin PIAR"

**Código:**
```javascript
const studentsSinPIAR = analysis.processedData.filter(s => s['¿PIAR?'] !== 'Sí');
```

### 2. Top 80% por Área

**Objetivo:** Enfocarse en el desempeño de los mejores estudiantes en cada área académica.

**Proceso:**
- Para cada área académica (Matemáticas, Lectura Crítica, Ciencias Naturales, Sociales, Inglés):
  1. Se filtran estudiantes con puntaje válido en el área
  2. Se ordenan descendentemente por puntaje
  3. Se calcula el 80% superior: `Math.ceil(total * 0.8)`
  4. Se seleccionan los estudiantes en ese rango

**Ejemplo:**
- Si hay 100 estudiantes sin PIAR en Matemáticas
- El top 80% serían los 80 mejores estudiantes
- Si hay 95 estudiantes, el top 80% serían 76 estudiantes (redondeado hacia arriba)

**Código:**
```javascript
function getTop80Percent(students, areaField) {
  const validStudents = students.filter(s => {
    const score = s[areaField];
    return score !== null && score !== undefined && !isNaN(score);
  });
  
  const sorted = [...validStudents].sort((a, b) => b[areaField] - a[areaField]);
  const top80Count = Math.ceil(sorted.length * 0.8);
  return sorted.slice(0, top80Count);
}
```

### 3. Índice de Área

**Objetivo:** Calcular un índice que refleje tanto el promedio como la consistencia del desempeño.

**Fórmula:**
```
Índice de Área = Promedio × (1 - CV)
```

**Componentes:**

#### a) Promedio
- Promedio aritmético de los puntajes del top 80% en el área
- Fórmula: `Σ(puntajes) / n`

#### b) Coeficiente de Variación Normalizado (CV)
- Mide la **dispersión relativa** de los datos
- Fórmula: `CV = (σ / μ) / (1 + σ / μ)`
  - `σ`: desviación estándar de los puntajes del top 80%
  - `μ`: promedio de los puntajes del top 80%
  - La normalización asegura que CV esté siempre entre 0 y 1

**¿Por qué esta fórmula?**
- El coeficiente de variación (σ/μ) mide la dispersión relativa al promedio
- La normalización `x / (1 + x)` garantiza que el valor esté en el rango [0, 1]
- Un CV bajo indica datos consistentes (poca dispersión)
- Un CV alto indica datos dispersos (alta variabilidad)

**Interpretación del Índice:**
- **Mayor índice** = Mejor desempeño (alto promedio y baja dispersión)
- **Menor índice** = Menor desempeño (bajo promedio o alta dispersión)
- El índice está en el rango **[0, 100]** aproximadamente
- La multiplicación por `(1 - CV)` penaliza la inconsistencia

**Código:**
```javascript
function calculateNormalizedVariation(values) {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  if (mean === 0) return 0;
  
  // Calcular desviación estándar
  const sumSquaredDiff = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
  const stdDev = Math.sqrt(sumSquaredDiff / values.length);
  
  // Coeficiente de variación
  const cv = stdDev / mean;
  
  // Normalizar al rango [0, 1]
  const normalizedCV = cv / (1 + cv);
  
  return normalizedCV;
}

function calculateAreaIndex(students, areaField) {
  const top80 = getTop80Percent(students, areaField);
  const scores = top80.map(s => s[areaField]);
  const promedio = scores.reduce((sum, val) => sum + val, 0) / scores.length;
  const coeficienteVariacion = calculateNormalizedVariation(scores);
  const indice = promedio * (1 - coeficienteVariacion);
  
  return { indice, promedio, coeficienteVariacion, top80Count: top80.length };
}
```

### 4. Índice Global

**Objetivo:** Obtener una medida única del desempeño institucional que pondere adecuadamente todas las áreas.

**Fórmula:**
```
IG = [(3 × MA) + (3 × LC) + (3 × CN) + (3 × SC) + IN] / 13
```

**Donde:**
- `MA`: Índice de Matemáticas
- `LC`: Índice de Lectura Crítica
- `CN`: Índice de Ciencias Naturales
- `SC`: Índice de Sociales y Ciudadanas
- `IN`: Índice de Inglés

**Ponderación:**
- Matemáticas, Lectura Crítica, Ciencias Naturales y Sociales: **peso 3** cada una
- Inglés: **peso 1**
- Total: 3 + 3 + 3 + 3 + 1 = **13**

**¿Por qué esta ponderación?**
- Las áreas fundamentales (MA, LC, CN, SC) tienen mayor peso porque son consideradas más críticas para el desempeño académico general
- Inglés tiene menor peso por ser un área complementaria

**Ejemplo de Cálculo:**
```
Supongamos:
- MA = 0.6363
- LC = 0.5344
- CN = 0.6314
- SC = 0.6398
- IN = 0.5620

IG = [(3 × 0.6363) + (3 × 0.5344) + (3 × 0.6314) + (3 × 0.6398) + 0.5620] / 13
IG = [1.9089 + 1.6032 + 1.8942 + 1.9194 + 0.5620] / 13
IG = 7.8877 / 13
IG = 0.6065
```

**Código:**
```javascript
function calculateGlobalIndex(areaIndices) {
  const MA = areaIndices['Matemáticas']?.indice || 0;
  const LC = areaIndices['Lectura crítica']?.indice || 0;
  const CN = areaIndices['Naturales']?.indice || 0;
  const SC = areaIndices['Sociales']?.indice || 0;
  const IN = areaIndices['Inglés']?.indice || 0;
  
  return ((3 * MA) + (3 * LC) + (3 * CN) + (3 * SC) + IN) / 13;
}
```

### 5. Clasificación

**Objetivo:** Asignar una categoría cualitativa al desempeño institucional basada en el índice global.

**Tabla de Clasificación:**

| Categoría | Rango de IG | Color | Descripción |
|-----------|-------------|-------|-------------|
| **A+** | IG ≥ 77 | Verde esmeralda (#10b981) | Excelente |
| **A** | 72 ≤ IG < 77 | Verde (#22c55e) | Muy bueno |
| **B** | 67 ≤ IG < 72 | Amarillo (#eab308) | Bueno |
| **C** | 62 ≤ IG < 67 | Naranja (#f97316) | Regular |
| **D** | IG < 62 | Rojo (#ef4444) | Necesita mejora |

**Código:**
```javascript
function getClassification(globalIndex) {
  if (globalIndex >= 77) {
    return { categoria: 'A+', color: '#10b981', bgColor: '#d1fae5', descripcion: 'Excelente' };
  } else if (globalIndex >= 72) {
    return { categoria: 'A', color: '#22c55e', bgColor: '#dcfce7', descripcion: 'Muy bueno' };
  } else if (globalIndex >= 67) {
    return { categoria: 'B', color: '#eab308', bgColor: '#fef9c3', descripcion: 'Bueno' };
  } else if (globalIndex >= 62) {
    return { categoria: 'C', color: '#f97316', bgColor: '#fed7aa', descripcion: 'Regular' };
  } else {
    return { categoria: 'D', color: '#ef4444', bgColor: '#fecaca', descripcion: 'Necesita mejora' };
  }
}
```

## Comparación entre Grupos de Cohortes

### Funcionalidad

La sección permite al usuario:
1. Seleccionar un **Grupo A** de cohortes (ej: 2022, 2023, 2024)
2. Seleccionar un **Grupo B** de cohortes (ej: 2023, 2024, 2025)
3. Ver una comparación detallada entre ambos grupos

### Proceso de Comparación

1. **Agregación de datos:**
   - Se combinan todos los estudiantes sin PIAR de las cohortes seleccionadas en cada grupo
   - Ejemplo: Si Grupo A tiene cohortes 2022, 2023, 2024, se juntan todos los estudiantes sin PIAR de esos tres años

2. **Cálculo de índices:**
   - Se calculan los índices por área para cada grupo
   - Se calcula el índice global para cada grupo
   - Se obtiene la clasificación para cada grupo

3. **Análisis comparativo:**
   - Diferencia en índice global: `IG_B - IG_A`
   - Diferencia porcentual: `((IG_B - IG_A) / IG_A) × 100`
   - Cambio de clasificación: Comparación de categorías (A+, A, B, C, D)

### Visualizaciones

1. **Tarjetas de resumen:**
   - Clasificación (A+, A, B, C, D)
   - Índice global (4 decimales)
   - Total de estudiantes sin PIAR

2. **Tabla de índices por área:**
   - Índice de cada área para Grupo A
   - Índice de cada área para Grupo B
   - Diferencia entre grupos

3. **Gráfico de barras:**
   - Comparación visual del índice global entre grupos

4. **Gráfico radar:**
   - Comparación de índices por área académica
   - Permite ver fortalezas y debilidades relativas

## Estructura de Archivos

### Archivos Creados

```
src/
├── utils/
│   └── calculations/
│       └── clasificacionPlantel.js          # Funciones de cálculo puras
├── reports/
│   └── html/
│       └── htmlSections/
│           ├── clasificacionPlantel.js       # Orquestador principal
│           ├── clasificacionPlantelComponents.js  # Componentes HTML
│           └── clasificacionPlantelScripts.js     # Scripts JavaScript
docs/
└── CLASIFICACION_PLANTEL.md                  # Esta documentación
```

### Responsabilidades

#### `clasificacionPlantel.js` (Cálculos)
- `calculatePopulationVariance()`: Calcula VAR.P
- `getTop80Percent()`: Obtiene top 80% de estudiantes
- `calculateAreaIndex()`: Calcula índice de área
- `calculateGlobalIndex()`: Calcula índice global
- `getClassification()`: Obtiene clasificación
- `calculateGroupIndices()`: Orquesta todo el proceso

#### `clasificacionPlantelComponents.js` (HTML)
- `generateMethodologySection()`: Sección de metodología
- `generateGroupSelectors()`: Selectores de cohortes
- `generateResultsContainer()`: Contenedor de resultados

#### `clasificacionPlantelScripts.js` (JavaScript)
- `updateClasificacionComparison()`: Actualiza comparación
- `generateComparisonHTML()`: Genera HTML de resultados
- `createClasificacionCharts()`: Crea gráficos Chart.js

#### `clasificacionPlantel.js` (Orquestador)
- `generateClasificacionPlantelSection()`: Función principal que ensambla todo

## Integración con el Sistema

### HTMLReportGenerator.js

```javascript
// Import
import { generateClasificacionPlantelSection } from './htmlSections/clasificacionPlantel.js';

// Uso (solo en reportes multi-año)
if (isMultiYear && comparisonAnalyses.length > 0) {
  sections.push(generateClasificacionPlantelSection(allAnalyses, sectionNumber++));
}
```

## Consideraciones de Diseño

### Colores Consistentes

Los colores utilizados siguen el sistema de diseño existente:
- **Emerald/Teal** para la sección principal
- **Verde** para clasificaciones altas (A+, A)
- **Amarillo** para clasificación media (B)
- **Naranja/Rojo** para clasificaciones bajas (C, D)

### Responsividad

- Grid de 2 columnas en pantallas medianas/grandes
- 1 columna en móviles
- Gráficos responsivos con Chart.js

### Accesibilidad

- Contraste adecuado de colores
- Etiquetas descriptivas
- Tooltips informativos

## Ejemplo de Uso

### Caso de Uso: Comparar 2022-2023 vs 2024-2025

1. Usuario selecciona en Grupo A: 2022, 2023
2. Usuario selecciona en Grupo B: 2024, 2025
3. Sistema calcula:
   - Grupo A: Combina estudiantes sin PIAR de 2022 y 2023
   - Grupo B: Combina estudiantes sin PIAR de 2024 y 2025
4. Sistema muestra:
   - Clasificación de cada grupo
   - Índice global de cada grupo
   - Diferencia entre grupos
   - Tabla comparativa por áreas
   - Gráficos visuales

## Validaciones y Casos Especiales

### Sin datos suficientes
- Si un grupo no tiene estudiantes sin PIAR, se muestra mensaje de error
- Si un área no tiene estudiantes válidos, el índice es 0

### División por cero
- El denominador `(1 - Varianza)` nunca es cero en la práctica
- La varianza poblacional siempre es menor que 1 para datos válidos

### Redondeo
- Índices se muestran con 4 decimales para precisión
- Porcentajes con 2 decimales

## Mantenimiento y Extensiones Futuras

### Posibles Mejoras

1. **Exportar resultados:**
   - Botón para descargar tabla de índices como CSV
   - Exportar gráficos como imágenes

2. **Comparación múltiple:**
   - Permitir más de 2 grupos
   - Gráfico de líneas para ver evolución temporal

3. **Filtros adicionales:**
   - Por grado
   - Por género
   - Por jornada

4. **Benchmarking:**
   - Comparar con promedios nacionales
   - Comparar con instituciones similares

## Preguntas Frecuentes

### ¿Por qué se excluyen los estudiantes con PIAR?
Para tener una muestra homogénea que refleje el desempeño típico del plantel sin ajustes especiales.

### ¿Por qué el top 80% y no el 100%?
Para enfocarse en el desempeño de los mejores estudiantes y reducir el impacto de valores atípicos extremadamente bajos.

### ¿Por qué Inglés tiene menor peso?
Porque las áreas fundamentales (MA, LC, CN, SC) son consideradas más críticas para el desempeño académico general.

### ¿Qué significa un índice de 0.65?
Significa que el plantel tiene un desempeño "Bueno" (categoría B), con un balance entre promedio y consistencia.

## Contacto y Soporte

Para preguntas o sugerencias sobre esta funcionalidad, contactar al equipo de desarrollo.

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0
