# Corrección: Gráficas colapsadas en PDF

## 🐛 Problema identificado

Las gráficas de **promedios y desviación estándar por grado** en el PDF se mostraban **colapsadas** porque usaban escalas fijas inadecuadas:

- **Promedios por grado**: Escala fija 0-100
  - ❌ Los valores reales están en rango ~200-500 (puntajes Global)
  - ❌ Las barras se veían muy pequeñas y comprimidas en la parte inferior
  
- **Desviación estándar por grado**: Escala fija 0-30
  - ❌ Los valores reales pueden variar
  - ❌ No se aprovechaba el espacio vertical del gráfico

## ✅ Solución implementada

Se actualizó la función `drawBarChart` en `src/utils/pdfBuilder.js` para soportar **escalas dinámicas**, igual que en la vista web.

### Cambios realizados:

#### 1. Nuevo parámetro `useDynamicScale`

```javascript
const drawBarChart = (doc, data, x, y, width, height, title, yAxisMax = 100, showComparison = true, useDynamicScale = false)
```

- `false` (por defecto): Usa escala fija (para gráficos por área)
- `true`: Calcula escala dinámica basada en los datos reales

#### 2. Cálculo de escala dinámica

```javascript
if (useDynamicScale) {
  const allValues = data.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v !== undefined && v > 0);
  if (allValues.length > 0) {
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.15; // 15% de padding
    dynamicMin = Math.max(0, Math.floor(minValue - padding));
    dynamicMax = Math.ceil(maxValue + padding);
  }
}
```

**Lógica:**
- Extrae todos los valores (con PIAR y sin PIAR)
- Encuentra el mínimo y máximo
- Agrega 15% de padding arriba y abajo
- Redondea para obtener valores limpios

#### 3. Etiquetas del eje Y actualizadas

```javascript
const label = (scaleMin + ((scaleMax - scaleMin) / 5) * i).toFixed(0);
```

Antes usaba valores fijos `(yAxisMax / 5) * i`, ahora calcula proporcionalmente según la escala dinámica.

#### 4. Altura de barras normalizada

```javascript
const normalizedConPIAR = (item.conPIAR - scaleMin) / (scaleMax - scaleMin);
const barHeightConPIAR = normalizedConPIAR * chartHeight;
```

Las barras se normalizan según la escala calculada, no según el máximo fijo.

#### 5. Activación en gráficos de grado

```javascript
// Promedios globales por grado - CON escala dinámica
drawBarChart(doc, chartDataByGrade, 20, yPos, pageWidth - 40, 70, 
  'Promedios globales por grado', 100, true, true);
                                                      ↑ useDynamicScale = true

// Desviación estándar por grado - CON escala dinámica  
drawBarChart(doc, chartDataDesviacionByGrade, 20, yPos, pageWidth - 40, 70, 
  'Desviación estándar por grado', 30, true, true);
                                                ↑ useDynamicScale = true
```

#### 6. Gráficos por área mantienen escala fija

Los gráficos de promedios, desviación y percentiles **por área** siguen usando escala fija (0-100, 0-30) porque están diseñados así:

```javascript
// Promedios por área - escala fija 0-100 (sin último parámetro)
drawBarChart(doc, chartData, 20, yPos, pageWidth - 40, 70, 'Promedios por área', 100, true);

// Desviación por área - escala fija 0-30
drawBarChart(doc, chartDataDesviacion, 20, yPos, pageWidth - 40, 70, 'Desviación estándar por área', 30, true);

// Percentiles por área - escala fija 0-100
drawBarChart(doc, chartDataPercentiles, 20, yPos, pageWidth - 40, 70, 'Percentiles promedio por área', 100, true);
```

## 📊 Resultado

### Antes (colapsadas):
```
┌──────────────────────────┐
│ Promedios por grado      │
├──────────────────────────┤
│ 100                      │ ← Escala fija 0-100
│  80                      │
│  60                      │
│  40                      │
│  20                      │
│   0  ▂▂ ▂▂ ▂▂           │ ← Barras muy pequeñas (~48-54)
│    11A 11B 11C           │
└──────────────────────────┘
```

### Después (escala dinámica):
```
┌──────────────────────────┐
│ Promedios por grado      │
├──────────────────────────┤
│  56  ← Máximo dinámico   │
│  54                      │
│  52                      │
│  50                      │
│  48                      │
│  46  ← Mínimo dinámico   │
│      ████ ████ ████      │ ← Barras visibles y proporcionadas
│      11A  11B  11C       │
└──────────────────────────┘
```

## 🎯 Beneficios

✅ **Gráficas visibles**: Las barras ahora ocupan todo el espacio vertical  
✅ **Escala adecuada**: Se ajusta automáticamente a los datos reales  
✅ **Consistencia**: Mismo comportamiento que la vista web  
✅ **Etiquetas correctas**: Los valores del eje Y reflejan el rango real  
✅ **Sin afectar otras gráficas**: Solo aplica a gráficos de grado  

## 🧪 Testing

Para probar:

1. Cargar datos con estudiantes de diferentes grados
2. Generar PDF (botón "Generar PDF")
3. Revisar **Sección 8: Gráficos comparativos por grado**
4. Verificar que las barras sean visibles y proporcionales
5. Verificar que las etiquetas del eje Y muestren valores correctos (ej: 46-56 en lugar de 0-100)

## 📝 Archivos modificados

- ✅ `src/utils/pdfBuilder.js`
  - Función `drawBarChart()`: Agregado parámetro `useDynamicScale`
  - Cálculo de escala dinámica
  - Normalización de alturas de barras
  - Etiquetas de eje Y dinámicas
  - Llamadas a `drawBarChart` para gráficos de grado actualizadas

## 🔄 Comparación con implementación web

La corrección en PDF replica la lógica ya implementada en `src/components/ChartsPanel.jsx`:

**Web:**
```javascript
const allPromedios = chartDataByGrade.flatMap(d => [d['Con PIAR'], d['Sin PIAR']]).filter(v => v > 0);
const minPromedio = Math.min(...allPromedios);
const maxPromedio = Math.max(...allPromedios);
const paddingPromedio = (maxPromedio - minPromedio) * 0.15;
const domainMinPromedio = Math.max(0, Math.floor(minPromedio - paddingPromedio));
const domainMaxPromedio = Math.ceil(maxPromedio + paddingPromedio);

<YAxis domain={[domainMinPromedio, domainMaxPromedio]} />
```

**PDF (ahora corregido):**
```javascript
const allValues = data.flatMap(d => [d.conPIAR, d.sinPIAR]).filter(v => v !== undefined && v > 0);
const minValue = Math.min(...allValues);
const maxValue = Math.max(...allValues);
const padding = (maxValue - minValue) * 0.15;
dynamicMin = Math.max(0, Math.floor(minValue - padding));
dynamicMax = Math.ceil(maxValue + padding);

// Usar dynamicMin y dynamicMax para calcular posiciones
```

**Misma lógica, diferentes implementaciones según la tecnología (Recharts vs jsPDF)**

## ✨ Estado actual

- ✅ Vista web: Gráficas con escala dinámica (ya estaba correcto)
- ✅ PDF: Gráficas con escala dinámica (CORREGIDO)
- ✅ Consistencia completa entre web y PDF

---

**Fecha de corrección:** 10 de octubre de 2025  
**Issue:** Gráficas colapsadas en PDF  
**Estado:** ✅ RESUELTO
