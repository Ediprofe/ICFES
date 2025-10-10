# Actualización de nombres de columnas de percentiles

## Fecha: 10 de octubre de 2025

## Cambios Implementados

### 1. Nuevos nombres de columnas de percentiles

**Nombres anteriores:**
- `% Lectura crítica`
- `% Matemáticas`
- `% Sociales`
- `% Naturales`
- `% Inglés`

**Nuevos nombres:**
- `Percentil Lectura crítica`
- `Percentil Matemáticas`
- `Percentil Sociales`
- `Percentil Naturales`
- `Percentil Inglés`

### 2. Lógica de visualización mejorada

#### Comportamiento actualizado:
- ✅ **Sin datos de percentiles**: No se muestra el gráfico de percentiles
- ✅ **Con datos de percentiles**: Se muestra el gráfico con promedios por área

#### Comparación Con PIAR / Sin PIAR:
- ✅ Se calculan y muestran los promedios de percentiles **CON PIAR**
- ✅ Se calculan y muestran los promedios de percentiles **SIN PIAR**
- ✅ El toggle de comparación afecta también al gráfico de percentiles
- ✅ Los colores son consistentes con los demás gráficos:
  - Gris semi-transparente para "Con PIAR"
  - Colores por área para "Sin PIAR"

### 3. Archivos modificados

#### `src/components/ChartsPanel.jsx`
**Cambios realizados:**
- Actualizado el nombre de la clave de percentiles: `Percentil ${subject}` (antes era `% ${subject}`)
- Implementado cálculo de promedios con PIAR y sin PIAR por separado
- Actualizado el gráfico para mostrar ambas barras (Con PIAR / Sin PIAR)
- Modificado el título del gráfico de "Percentiles promedio por área (sin PIAR)" a "Percentiles promedio por área"
- Agregado el toggle showPIAR al gráfico de percentiles para mostrar/ocultar la comparación

**Código clave:**
```javascript
const percentileKey = `Percentil ${subject}`;

// Calcular promedio CON PIAR
const studentsWithPercentilesConPIAR = data.filter(s => 
  s[percentileKey] !== undefined && 
  s[percentileKey] !== null && 
  s[percentileKey] !== ''
);

// Calcular promedio SIN PIAR
const studentsWithPercentilesSinPIAR = dataSinPIAR.filter(s => 
  s[percentileKey] !== undefined && 
  s[percentileKey] !== null && 
  s[percentileKey] !== ''
);
```

#### `src/utils/calculations.js`
**Cambios realizados:**
- Actualizada la función `calculateAreaMetrics` para usar el nuevo nombre de columna
- Cambio de `% ${subject}` a `Percentil ${subject}`

**Antes:**
```javascript
percentil: mean(filtered.map(s => parseFloat(s[`% ${subject}`] || 0))).toFixed(2)
```

**Después:**
```javascript
percentil: mean(filtered.map(s => parseFloat(s[`Percentil ${subject}`] || 0))).toFixed(2)
```

### 4. Tabla comparativa (MetricsPanel)

La tabla en el panel de métricas ya mostraba los percentiles correctamente usando `calculateAreaMetrics`, por lo que automáticamente se actualizó con los nuevos nombres de columnas.

**Columnas mostradas:**
- Área
- Promedio (con PIAR)
- Promedio (sin PIAR)
- Desv. Est. (con PIAR)
- Desv. Est. (sin PIAR)
- **Percentil** (actualizado con nuevos nombres de columnas)

### 5. Comportamiento del gráfico de percentiles

#### Cuando showPIAR = true (Comparación activa):
```
[Gráfico de barras agrupadas]
- Barra gris: Con PIAR
- Barra de color: Sin PIAR
- Etiquetas con valores en formato: "XX.X%"
```

#### Cuando showPIAR = false (Comparación desactivada):
```
[Gráfico de barras simples]
- Solo barra de color: Sin PIAR
- Etiqueta con valor en formato: "XX.X%"
```

### 6. Validación de datos

El sistema verifica si hay datos de percentiles antes de mostrar el gráfico:
```javascript
const hasPercentileData = chartDataPercentiles.some(d => d.hasData);
```

Solo se muestra la sección de percentiles si `hasPercentileData === true`.

## Beneficios

### Claridad:
- ✅ Los nombres de columnas son más descriptivos y profesionales
- ✅ "Percentil" es más claro que el símbolo "%"
- ✅ Consistencia con la terminología estadística estándar

### Funcionalidad mejorada:
- ✅ Comparación visual entre estudiantes con y sin PIAR
- ✅ Toggle unificado controla todos los gráficos
- ✅ Colores consistentes en todas las visualizaciones

### Flexibilidad:
- ✅ El sistema maneja correctamente la ausencia de datos de percentiles
- ✅ Muestra solo las áreas que tienen datos disponibles
- ✅ Calcula promedios independientes para cada grupo

## Compatibilidad con archivos Excel

Para que los datos se muestren correctamente, el archivo Excel debe tener columnas con los siguientes nombres exactos:

**Obligatorias:**
- Nombre
- Apellido
- Grupo
- ¿PIAR?
- Lectura crítica
- Matemáticas
- Sociales
- Naturales
- Inglés
- Global

**Opcionales (para mostrar percentiles):**
- Percentil Lectura crítica
- Percentil Matemáticas
- Percentil Sociales
- Percentil Naturales
- Percentil Inglés

Si las columnas de percentiles no están presentes o están vacías, el gráfico de percentiles simplemente no se mostrará.

## Testing recomendado

1. **Archivo sin percentiles**:
   - [ ] Cargar archivo Excel sin columnas de percentiles
   - [ ] Verificar que NO se muestre el gráfico de percentiles
   - [ ] Verificar que los demás gráficos funcionan normalmente

2. **Archivo con percentiles**:
   - [ ] Cargar archivo Excel con las nuevas columnas "Percentil ..."
   - [ ] Verificar que se muestre el gráfico de percentiles
   - [ ] Verificar que muestra ambas barras (Con PIAR / Sin PIAR) cuando el toggle está activo
   - [ ] Verificar que los valores son correctos y están etiquetados

3. **Toggle de comparación**:
   - [ ] Activar/desactivar el toggle "Comparar con/sin PIAR"
   - [ ] Verificar que afecta a TODOS los gráficos (promedios, desviación, percentiles)
   - [ ] Verificar que los colores son consistentes

4. **Datos parciales**:
   - [ ] Cargar archivo con percentiles solo en algunas áreas
   - [ ] Verificar que solo se muestran las áreas con datos
   - [ ] Verificar el mensaje informativo

## Notas técnicas

- Las columnas de percentiles son opcionales y se detectan automáticamente
- Si una columna de percentil está presente pero vacía para todos los estudiantes, esa área no se incluye en el gráfico
- Los cálculos de promedio ignoran valores nulos, undefined o cadenas vacías
- El formato de visualización usa un decimal: "XX.X%"
- Los percentiles se calculan independientemente para cada grupo (con/sin PIAR)

## Próximos pasos sugeridos

1. Actualizar documentación de usuario con los nuevos nombres de columnas
2. Crear plantilla Excel de ejemplo con las columnas correctas
3. Agregar validación de nombres de columnas en el parser de Excel
4. Considerar agregar tooltips explicativos sobre qué son los percentiles
