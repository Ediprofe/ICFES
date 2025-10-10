# Gráficos de Barras en PDF

## 📊 Nueva funcionalidad agregada

Se han agregado **gráficos de barras visuales** al informe PDF, replicando la sección de gráficos de la interfaz web.

---

## 🎯 Características

### 1. **Gráfico de Promedios por Área**
- Compara promedios con PIAR (gris) vs sin PIAR (colores por área)
- Escala de 0 a 100
- Etiquetas con valores exactos sobre cada barra
- Leyenda explicativa

### 2. **Gráfico de Desviación Estándar por Área**
- Compara desviación estándar con PIAR vs sin PIAR
- Escala de 0 a 30
- Mismo formato visual que el gráfico de promedios

### 3. **Gráfico de Percentiles por Área**
- Muestra percentiles promedio por área
- Solo se incluye si hay datos de percentiles disponibles
- Escala de 0 a 100 (porcentaje)
- Valores mostrados con símbolo %

---

## 🎨 Diseño visual

### Colores por área:
- 🔵 **Lectura crítica**: Azul (#3b82f6)
- 🔴 **Matemáticas**: Rojo (#ef4444)
- 🟠 **Sociales**: Naranja (#f97316)
- 🟢 **Naturales**: Verde (#22c55e)
- 🟣 **Inglés**: Morado (#a855f7)

### Comparación con/sin PIAR:
- **Con PIAR**: Barras grises con menor opacidad
- **Sin PIAR**: Barras de colores según el área (resaltadas)

---

## 📄 Ubicación en el PDF

**Sección 7: "Gráficos comparativos por área"**

Se inserta justo después de la sección de "Valores atípicos" y antes del final del documento.

---

## 🔧 Implementación técnica

### Función principal: `drawBarChart()`

```javascript
drawBarChart(doc, data, x, y, width, height, title, yAxisMax, showComparison)
```

**Parámetros:**
- `doc`: Documento jsPDF
- `data`: Array de objetos con `{area, conPIAR, sinPIAR}`
- `x, y`: Posición de inicio del gráfico
- `width, height`: Dimensiones del gráfico
- `title`: Título del gráfico
- `yAxisMax`: Valor máximo del eje Y (100 para promedios, 30 para desviación)
- `showComparison`: `true` para mostrar ambas barras, `false` solo sin PIAR

### Características del renderizado:

1. **Ejes con líneas de referencia**: 5 líneas horizontales con valores
2. **Barras con bordes**: Cada barra tiene un borde más oscuro
3. **Etiquetas superiores**: Valores exactos sobre cada barra
4. **Etiquetas del eje X**: Nombres de áreas debajo de las barras
5. **Leyenda**: Diferencia entre "Con PIAR" y "Sin PIAR"

---

## 📐 Dimensiones

- **Ancho del gráfico**: Ancho de página - 40px (márgenes)
- **Alto del gráfico**: 70px cada uno
- **Espaciado vertical**: 95px entre gráficos
- **Ancho de barras**: Calculado dinámicamente según el número de áreas

---

## 🔄 Paginación inteligente

- Si el tercer gráfico (percentiles) no cabe en la página, se crea automáticamente una nueva página
- El encabezado de sección se repite en páginas adicionales
- Los pies de página se mantienen consistentes

---

## 📊 Datos mostrados

Los gráficos utilizan los mismos cálculos que la interfaz web:

1. **Promedios**: Calculados con `calculateAreaMetrics()`
2. **Desviación estándar**: Incluida en las métricas por área
3. **Percentiles**: Promedio de los percentiles de cada estudiante por área

---

## ✅ Ventajas

1. **Visualización completa**: El PDF ahora tiene toda la información de la web
2. **Sin interactividad necesaria**: Los gráficos son estáticos pero informativos
3. **Profesional**: Mantiene el diseño y colores consistentes
4. **Imprimible**: Los gráficos se ven bien en papel
5. **Comparativo**: Muestra claramente la diferencia con/sin PIAR

---

## 🎓 Uso

Al descargar el informe PDF, la sección 7 incluirá automáticamente:

1. ✅ Gráfico de promedios por área
2. ✅ Gráfico de desviación estándar por área
3. ✅ Gráfico de percentiles por área (si hay datos)

Cada gráfico muestra:
- Barras grises para valores "con PIAR"
- Barras de colores para valores "sin PIAR"
- Etiquetas con valores exactos
- Leyenda explicativa

---

## 🚀 Resultado

El PDF ahora es un **informe completo e independiente** que incluye:

1. ✅ Portada
2. ✅ Listado de estudiantes
3. ✅ Métricas por área (tablas)
4. ✅ Top 5 por área
5. ✅ Top 3 por grado
6. ✅ Métricas por grado
7. ✅ Valores atípicos
8. ✅ **Gráficos comparativos** ← NUEVO

---

## 📝 Notas técnicas

- Los gráficos se dibujan usando primitivas de jsPDF (rectángulos, líneas, texto)
- No se usa ninguna librería de gráficos externa
- El código es totalmente personalizado para máxima compatibilidad
- Los colores RGB se especifican manualmente para consistencia

---

## 🎉 Completado

¡El informe PDF ahora incluye visualizaciones gráficas profesionales con comparación PIAR!
