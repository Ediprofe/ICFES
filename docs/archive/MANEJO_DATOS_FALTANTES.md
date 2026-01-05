# Manejo de Datos Faltantes (Valores Null)

## 🔧 Problema resuelto

El programa se quedaba en blanco cuando algunos estudiantes no tenían puntajes en ciertas materias (por ejemplo, Inglés). Ahora el sistema maneja correctamente los **valores faltantes** y continúa funcionando sin problemas.

---

## ✅ Cambios implementados

### 1. **Parser de Excel (`excelParser.js`)**

**Antes:**
- Asumía que todos los valores numéricos estaban presentes
- No validaba valores vacíos o null

**Ahora:**
- ✅ Limpia y normaliza todos los datos al cargar
- ✅ Convierte valores vacíos (`''`, `undefined`, `null`) a `null`
- ✅ Valida que los valores sean numéricos antes de aceptarlos
- ✅ Filtra filas completamente vacías
- ✅ Asegura que Nombre, Apellido y Grupo sean strings válidos

**Código:**
```javascript
// Convertir valores numéricos y manejar valores faltantes
subjects.forEach(subject => {
  const value = row[subject];
  if (value === undefined || value === null || value === '' || isNaN(Number(value))) {
    cleanRow[subject] = null; // ← Asignar null en lugar de dejar undefined
  } else {
    cleanRow[subject] = Number(value);
  }
});
```

---

### 2. **Funciones estadísticas (`calculations.js`)**

#### `mean()` y `stdDev()`
**Antes:**
- Filtraba solo por `typeof v === 'number'`
- No eliminaba valores `null`

**Ahora:**
- ✅ Filtra `null`, `undefined`, y `NaN`
- ✅ Solo usa valores numéricos válidos

```javascript
const nums = values.filter(v => 
  v !== null && 
  v !== undefined && 
  typeof v === 'number' && 
  !isNaN(v)
);
```

#### `calculateAreaMetrics()`
**Antes:**
- Calculaba promedios sin validar valores
- Podía retornar `NaN` si había datos faltantes

**Ahora:**
- ✅ Filtra valores válidos antes de calcular
- ✅ Retorna `'N/A'` si no hay datos para esa materia
- ✅ Incluye `cantidadDatos` para transparencia

**Ejemplo de salida:**
```javascript
{
  area: "Inglés",
  promedio: "65.50",  // O "N/A" si no hay datos
  desviacion: "12.34",
  percentil: "55.20",
  cantidadDatos: 25    // ← Número de estudiantes con datos válidos
}
```

#### `getTop5BySubject()`
**Ahora:**
- ✅ Filtra estudiantes que NO tienen puntaje en esa materia
- ✅ Solo incluye estudiantes con valores válidos en el Top 5

#### `getTop3ByGrade()`
**Ahora:**
- ✅ Filtra estudiantes sin puntaje global
- ✅ Solo ranquea estudiantes con `Global` válido

#### `getMetricsByGrade()`
**Ahora:**
- ✅ Calcula métricas solo con valores válidos por materia
- ✅ Incluye contador de estudiantes con datos
- ✅ Retorna `'N/A'` si no hay suficientes datos

#### `getGradeAverages()`
**Ahora:**
- ✅ Filtra valores válidos de `Global` antes de calcular
- ✅ Retorna `0` si no hay datos (en lugar de `NaN`)

#### `findOutliers()`
**Ahora:**
- ✅ Solo analiza estudiantes con puntaje global válido
- ✅ No incluye estudiantes sin `Global` en el análisis de outliers

---

### 3. **Percentiles (`percentiles.js`)**

**Antes:**
- Calculaba percentiles incluso con valores null
- No validaba si el estudiante tenía puntaje

**Ahora:**
- ✅ Solo calcula percentil si el estudiante tiene puntaje en esa materia
- ✅ Asigna `null` si el estudiante no tiene puntaje
- ✅ Filtra valores válidos del conjunto completo antes de calcular

```javascript
if (studentValue !== null && studentValue !== undefined && !isNaN(studentValue)) {
  // Calcular percentil solo con valores válidos de todos los estudiantes
  const values = data
    .map(s => s[subject])
    .filter(v => v !== null && v !== undefined && typeof v === 'number' && !isNaN(v))
    .sort((a, b) => a - b);
  
  const percentile = calculatePercentile(studentValue, values);
  withPercentiles[newPercentileKey] = percentile !== null ? percentile.toFixed(2) : null;
} else {
  withPercentiles[newPercentileKey] = null; // ← No tiene puntaje, no tiene percentil
}
```

---

### 4. **Tabla de estudiantes (`StudentsTable.jsx`)**

**Antes:**
- Mostraba valores vacíos o `undefined`
- Ordenamiento podía fallar con valores null

**Ahora:**
- ✅ Muestra **"N/A"** (en gris) cuando un valor es null
- ✅ Ordenamiento maneja null correctamente (los pone al final)

**Visual:**
```
┌──────────────────────────────────────┐
│ Nombre  │ Inglés  │ Global │         │
├──────────────────────────────────────┤
│ Juan    │  65.00  │ 280.00 │         │
│ María   │  N/A    │ 245.00 │  ← Sin Inglés
│ Pedro   │  70.00  │ 290.00 │         │
└──────────────────────────────────────┘
```

**Código de ordenamiento:**
```javascript
// Manejar valores null/undefined - ponerlos al final
const aIsNull = aValue === null || aValue === undefined;
const bIsNull = bValue === null || bValue === undefined;

if (aIsNull && bIsNull) return 0;
if (aIsNull) return 1;  // null al final
if (bIsNull) return -1; // null al final
```

---

## 📊 Comportamiento con datos faltantes

### Escenario: Estudiante sin puntaje de Inglés

**Datos del estudiante:**
```
Nombre: Juan Pérez
Lectura crítica: 65
Matemáticas: 70
Sociales: 60
Naturales: 55
Inglés: null  ← Sin datos
Global: 250
```

**Resultado:**

1. **Tabla de estudiantes:**
   - Inglés muestra: `N/A` (en gris)
   - Otras materias muestran valores normales

2. **Top 5 Inglés:**
   - Juan NO aparece en el Top 5 de Inglés
   - Solo aparecen estudiantes con puntaje

3. **Métricas por área:**
   - Lectura crítica: Promedio incluye a Juan ✅
   - Inglés: Promedio NO incluye a Juan ✅
   - Se calcula con los estudiantes que SÍ tienen puntaje

4. **Percentil Inglés:**
   - Juan: `null` (no tiene percentil de Inglés)
   - No afecta el cálculo de percentiles de otros

5. **Gráficos:**
   - Promedios de Inglés: Solo con estudiantes con datos
   - Barras muestran el promedio correcto

6. **PDF:**
   - Mismos cálculos que la web
   - Valores N/A se omiten de tablas o se marcan claramente

---

## 🎯 Ventajas del nuevo sistema

### ✅ Robustez
- El programa NO se rompe con datos faltantes
- Maneja cualquier combinación de valores null

### ✅ Precisión estadística
- Los promedios se calculan solo con datos válidos
- No se "contaminan" con ceros o valores falsos

### ✅ Transparencia
- Muestra cuántos estudiantes tienen datos (`cantidadDatos`)
- El usuario sabe exactamente qué se está calculando

### ✅ Flexibilidad
- Funciona con cualquier materia faltante
- Funciona con cualquier número de datos faltantes
- Funciona incluso si TODO un grado no tiene Inglés

---

## 📋 Ejemplos de casos manejados

### Caso 1: Un estudiante sin Inglés
```
30 estudiantes, 29 con Inglés, 1 sin Inglés

Resultado:
- Promedio Inglés: Calculado con 29 estudiantes
- Top 5 Inglés: 5 estudiantes (el que no tiene, no aparece)
- Tabla: Muestra "N/A" para ese estudiante
```

### Caso 2: Grado completo sin Inglés
```
Grado 10A: 25 estudiantes, ninguno con Inglés
Grado 11A: 30 estudiantes, todos con Inglés

Resultado:
- Métricas por grado 10A - Inglés: "N/A"
- Métricas por grado 11A - Inglés: Promedio calculado
- Gráfico de Inglés por grado: Solo muestra 11A
```

### Caso 3: Algunos sin Global
```
28 estudiantes con Global completo
2 estudiantes sin Global (null)

Resultado:
- Tabla: Los 2 muestran "N/A" en Global
- Ordenar por Global: Los 2 van al final
- Outliers: Solo analiza los 28 con Global
- Top 3 por grado: Solo incluye los con Global
```

---

## 🔍 Verificación en el código

### ¿Cómo saber si un valor es válido?

**Patrón usado en todo el código:**
```javascript
// Verificar si un valor es válido
if (value !== null && value !== undefined && !isNaN(value)) {
  // Usar el valor
} else {
  // Manejar como faltante
}
```

### ¿Cómo filtrar valores válidos de un array?

```javascript
const validValues = array.filter(v => 
  v !== null && 
  v !== undefined && 
  typeof v === 'number' && 
  !isNaN(v)
);
```

---

## 📝 Notas importantes

### 1. **Diferencia entre null y 0**
- `null` = Dato faltante (no se evaluó)
- `0` = Puntaje real de cero (se evaluó y sacó 0)

### 2. **Percentiles**
- Solo se calculan si hay puntaje
- Un estudiante puede tener percentil en Matemáticas pero no en Inglés

### 3. **Promedios**
- Se calculan con los datos disponibles
- No se asume 0 para datos faltantes

### 4. **Ordenamiento**
- Valores null van al final de la tabla
- No afectan el orden de valores válidos

---

## ✅ Archivos modificados

1. ✅ `src/utils/excelParser.js` - Limpieza de datos
2. ✅ `src/utils/calculations.js` - Funciones estadísticas robustas
3. ✅ `src/utils/percentiles.js` - Cálculo seguro de percentiles
4. ✅ `src/components/StudentsTable.jsx` - Visualización de N/A

---

## 🚀 Listo para usar

Ahora puedes subir archivos de Excel con:
- ✅ Estudiantes sin puntaje en Inglés
- ✅ Estudiantes sin puntaje en cualquier materia
- ✅ Grados completos sin alguna materia
- ✅ Cualquier combinación de datos faltantes

El programa funcionará correctamente y mostrará los cálculos apropiados para los datos disponibles.

---

## 🎉 Resultado

**Antes:** ❌ Pantalla en blanco si faltaba Inglés

**Ahora:** ✅ Funciona perfectamente, muestra "N/A" donde corresponde y calcula estadísticas precisas con los datos disponibles
