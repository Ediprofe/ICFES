# Gráficos por Grado - Web y PDF

## 📊 Nueva funcionalidad agregada

Se han agregado **gráficos de barras por grado** tanto en la interfaz web como en el informe PDF, mostrando promedios y desviaciones estándar con comparación con/sin PIAR.

---

## 🎯 Gráficos agregados

### 1. **Promedios Globales por Grado**
- Compara el promedio global de cada grado
- **Con PIAR** (barras grises tenues)
- **Sin PIAR** (barras índigo resaltadas)
- Escala: 0 a 100
- Etiquetas con valores exactos sobre cada barra

### 2. **Desviación Estándar por Grado**
- Compara la desviación estándar de cada grado
- Mismo formato de comparación con/sin PIAR
- Escala: 0 a 30
- Muestra la variabilidad de rendimiento en cada grado

---

## 🌐 En la Interfaz Web

### Ubicación:
- **Sección nueva**: "Análisis por grado"
- Se muestra al final del panel de gráficos (ChartsPanel)
- Después de los gráficos por área (promedios, desviación estándar, percentiles)

### Características visuales:
- ✅ Borde superior índigo para distinguir la sección
- ✅ Título "Análisis por grado" en color índigo
- ✅ Subtítulos para cada gráfico
- ✅ Toggle "Comparar con/sin PIAR" funciona también en estos gráficos
- ✅ Color índigo (#6366f1) para todas las barras de grado (consistente)

### Diseño:
```
┌─────────────────────────────────────────┐
│  Análisis por grado                     │
├─────────────────────────────────────────┤
│  Promedios globales por grado           │
│  [Gráfico de barras con comparación]    │
│                                          │
│  Desviación estándar por grado          │
│  [Gráfico de barras con comparación]    │
└─────────────────────────────────────────┘
```

---

## 📄 En el Informe PDF

### Nueva Sección 8: "Gráficos comparativos por grado"

Se agrega después de:
1. Portada
2. Listado de estudiantes
3. Métricas por área
4. Top 5 por área
5. Top 3 por grado
6. Métricas por grado
7. Valores atípicos
8. Gráficos comparativos por área
9. **← Gráficos comparativos por grado (NUEVO)**

### Contenido:
- **Gráfico 1**: Promedios globales por grado
- **Gráfico 2**: Desviación estándar por grado

### Características:
- Mismo estilo visual que los gráficos por área
- Color índigo para todas las barras de grado
- Etiquetas de valores sobre cada barra
- Leyenda "Con PIAR" / "Sin PIAR"
- Paginación automática si no cabe en una página

---

## 🔧 Implementación Técnica

### Nueva función en `calculations.js`:

```javascript
getGradeAverages(data)
```

**Retorna:**
```javascript
[
  {
    grado: "11A",
    promedioConPIAR: 75.5,
    promedioSinPIAR: 76.2,
    desviacionConPIAR: 12.3,
    desviacionSinPIAR: 11.8
  },
  // ... más grados
]
```

### Actualización en `ChartsPanel.jsx`:

- Importa `getGradeAverages` desde `calculations`
- Calcula datos de grados: `const gradeAverages = getGradeAverages(data)`
- Genera dos nuevos gráficos usando Recharts
- Aplica color índigo consistente para todos los grados
- Respeta el toggle "Comparar con/sin PIAR"

### Actualización en `pdfBuilder.js`:

- Importa `getGradeAverages`
- Detecta automáticamente si es un gráfico de grado (comienza con "Grado")
- Aplica color índigo [99, 102, 241] en lugar de colores por área
- Crea nueva página con sección 8
- Dibuja los 2 gráficos usando `drawBarChart()`

---

## 🎨 Diseño Visual

### Color único para grados:
- 🟣 **Todos los grados**: Índigo (#6366f1 / RGB: 99, 102, 241)

### Por qué índigo:
- Diferencia visual clara de los colores por área
- Color profesional y neutro
- Representa bien la categorización por grado
- Consistente con el diseño de "Top 3 por grado"

### Comparación con/sin PIAR:
- **Con PIAR**: Barras grises (#9ca3af) con opacidad reducida
- **Sin PIAR**: Barras índigo brillantes y resaltadas

---

## 📊 Datos Calculados

### Promedio Global por Grado:
- Toma todos los estudiantes del grado
- Calcula el promedio del campo `Global`
- Separa automáticamente con/sin PIAR

### Desviación Estándar por Grado:
- Calcula la desviación estándar del campo `Global`
- Muestra la dispersión/variabilidad del rendimiento
- Útil para identificar grados con mayor heterogeneidad

---

## 💡 Casos de Uso

### Para directivos:
- ✅ Comparar rendimiento entre grados
- ✅ Identificar grados con mejor desempeño
- ✅ Ver impacto de estudiantes PIAR por grado
- ✅ Detectar grados con mayor variabilidad

### Para docentes:
- ✅ Entender el contexto de su grado vs otros
- ✅ Comparar homogeneidad de su grupo
- ✅ Planificar estrategias según la desviación

### Para análisis:
- ✅ Datos visuales complementarios a las tablas
- ✅ Comparación rápida y visual
- ✅ Información completa en el PDF

---

## 🔄 Interactividad Web

El toggle **"Comparar con/sin PIAR"** controla todos los gráficos:

- ✅ **Activo**: Muestra ambas barras (con PIAR en gris, sin PIAR en color)
- ✅ **Inactivo**: Muestra solo barras sin PIAR

Esto aplica a:
- Gráficos por área (promedios, desviación, percentiles)
- **Gráficos por grado (promedios, desviación)** ← NUEVO

---

## 📐 Especificaciones

### Web (ChartsPanel):
- Alto de cada gráfico: 300px
- Ancho: Responsive (100%)
- Librería: Recharts con BarChart
- Etiquetas: LabelList con formato `.toFixed(1)`

### PDF (pdfBuilder):
- Alto de cada gráfico: 70px
- Ancho: Ancho de página - 40px (márgenes)
- Espaciado vertical: 95px entre gráficos
- Dibujo manual con primitivas jsPDF

---

## ✅ Beneficios

1. **Análisis Completo**: Ahora hay gráficos tanto por área como por grado
2. **Comparación Visual**: Fácil identificar grados destacados o con dificultades
3. **Variabilidad**: La desviación muestra homogeneidad del grado
4. **PDF Completo**: El informe tiene toda la información visual
5. **Consistencia**: Mismo estilo y funcionamiento que gráficos por área

---

## 🎉 Resultado Final

### En la Web:
- Sección "Análisis por grado" con 2 gráficos interactivos
- Toggle funciona en todos los gráficos
- Color índigo consistente

### En el PDF:
- Nueva Sección 8: "Gráficos comparativos por grado"
- 2 gráficos estáticos profesionales
- Mismo estilo visual que gráficos por área

---

## 📝 Orden completo de secciones en PDF

1. ✅ Portada
2. ✅ Listado de estudiantes por puntaje global
3. ✅ Métricas por área (tablas comparativas)
4. ✅ Top 5 estudiantes por área
5. ✅ Top 3 estudiantes por grado
6. ✅ Métricas por grado (tablas por cada grado)
7. ✅ Valores atípicos (outliers)
8. ✅ Gráficos comparativos por área (3 gráficos)
9. ✅ **Gráficos comparativos por grado (2 gráficos)** ← NUEVO

---

## 🚀 Listo para usar

Los gráficos por grado están completamente integrados:
- ✅ Cálculos en `calculations.js`
- ✅ Visualización en `ChartsPanel.jsx`
- ✅ Renderizado en `pdfBuilder.js`
- ✅ Build actualizado en `dist/`
- ✅ Cambios subidos a GitHub

¡El análisis ahora es mucho más completo con información por área Y por grado! 🎓📊
