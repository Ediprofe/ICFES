# Cambios en Sección de Percentiles y Estilos

## ✅ Cambios Completados

### 1. Reubicación de Sección
- **Antes**: Análisis de Percentiles estaba después de "Estadísticas Globales"
- **Ahora**: Está después de "Gráficos Interactivos"

**Orden actual del reporte de un solo cohorte:**
1. Portada
2. Listado de estudiantes
3. Estadísticas globales
4. Top performers
5. Gráficos interactivos
6. **Análisis de percentiles y niveles de desempeño** ← MOVIDA AQUÍ
7. Outliers

### 2. Eliminación de Sección
- **Eliminada**: Sección "Desviación Estándar de Percentiles por Área"
- Se eliminaron las tarjetas visuales que mostraban desviación estándar
- Se eliminó la función JavaScript `updateStdDevDisplay()`

### 3. Corrección de Capitalización
Se corrigieron los títulos para que solo la primera palabra esté capitalizada:

**Archivos actualizados:**
- `percentileAnalysis.js`:
  - "Análisis de Percentiles y Niveles de Desempeño" → "Análisis de percentiles y niveles de desempeño"
  - "Promedio de Percentiles por Área Académica" → "Promedio de percentiles por área académica"
  - "Niveles de Desempeño por Área Académica" → "Niveles de desempeño por área académica"

- `globalStatistics.js`:
  - "Estadísticas Globales" → "Estadísticas globales"

## 📋 Títulos Pendientes de Corrección

Para mantener consistencia, los siguientes títulos también deberían corregirse:

### En archivos de un solo año:
- `studentsTable.js`: "Listado de estudiantes" ✓ (ya está correcto)
- `topPerformers.js`: "Top performers" ✓ (ya está correcto)
- `outliers.js`: Títulos internos están correctos

### En archivos multi-año (`multiYearComparison.js`):
- "Tabla de Métricas Combinadas" → "Tabla de métricas combinadas"
- "Seleccionar Años a Promediar" → "Seleccionar años a promediar"
- "Métricas Globales (sin PIAR)" → "Métricas globales (sin PIAR)"
- "Curvas de Distribución Normal (Campana de Gauss)" → "Curvas de distribución normal (campana de Gauss)"
- "Seleccionar Años para Visualizar" → "Seleccionar años para visualizar"
- "Comparación de Grupos de Cohortes" → "Comparación de grupos de cohortes"
- "Comparación de Métricas Globales" → "Comparación de métricas globales"
- "Sin PIAR (Metricas Principales)" → "Sin PIAR (métricas principales)"
- "Con PIAR (Todos los Estudiantes)" → "Con PIAR (todos los estudiantes)"
- "Comparación por Áreas Académicas" → "Comparación por áreas académicas"
- "Listado Completo de Estudiantes" → "Listado completo de estudiantes"
- "Tendencia de Promedios Globales" → "Tendencia de promedios globales"

## 🎨 Estilos de Gráficos de Barras

### Estilo Estándar (de globalStatistics.js)

El estilo de referencia para todos los gráficos de barras incluye:

```javascript
{
  type: 'bar',
  data: {
    datasets: [{
      backgroundColor: 'rgba(34, 197, 94, 0.8)',  // Color con opacidad
      borderColor: 'rgba(34, 197, 94, 1)',        // Borde sólido
      borderWidth: 2,                              // Borde de 2px
      borderRadius: 8,                             // Esquinas redondeadas
      barThickness: 70                             // Grosor de barra (opcional)
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 4,
        font: { size: 13, weight: 'bold' },
        color: '#374151',
        formatter: (value) => value.toFixed(2),
        clip: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
        ticks: { font: { size: 12 }, color: '#6B7280', padding: 8 }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { size: 14, weight: 'bold' }, color: '#374151', padding: 8 }
      }
    },
    layout: {
      padding: { top: 35, right: 20, bottom: 10, left: 10 }
    },
    interaction: { mode: 'index', intersect: false }
  },
  plugins: [ChartDataLabels]
}
```

### Características Clave:
1. **Bordes redondeados**: `borderRadius: 8`
2. **Bordes visibles**: `borderWidth: 2`
3. **Etiquetas de datos**: Plugin `datalabels` con formato consistente
4. **Animaciones suaves**: 750ms con easing `easeInOutQuart`
5. **Colores con opacidad**: Usar formato `rgba()` con opacidad 0.8 para fondo
6. **Padding superior**: 35px para espacio de etiquetas

### Gráficos que Necesitan Actualización:

#### En `multiYearComparison.js`:
1. Gráfico de comparación de promedio (línea ~955)
2. Gráfico de comparación de desviación (línea ~1043)
3. Gráficos de comparación por área - promedio (línea ~1425)
4. Gráficos de comparación por área - desviación (línea ~1482)
5. Gráfico de evolución del promedio global (línea ~1718)
6. Gráfico de evolución de la desviación estándar (línea ~1771)
7. Gráficos de evolución por área - promedio (línea ~2151)
8. Gráficos de evolución por área - desviación (línea ~2202)
9. Gráfico de tendencia (línea ~2897)

## 🎯 Sistema de Colores

### Colores por Área Académica:
- **Lectura crítica**: `#3b82f6` (azul)
- **Matemáticas**: `#ef4444` (rojo)
- **Sociales**: `#f97316` (naranja)
- **Naturales**: `#22c55e` (verde)
- **Inglés**: `#a855f7` (morado)

### Colores para Datasets:
- **Sin PIAR**: `rgba(34, 197, 94, 0.8)` (verde)
- **Con PIAR**: `rgba(107, 114, 128, 0.8)` (gris)

## 📝 Notas de Implementación

1. **Consistencia visual**: Todos los gráficos de barras deben tener el mismo estilo
2. **Capitalización**: Solo la primera palabra de los títulos debe estar capitalizada
3. **Colores**: Mantener la paleta de colores definida en `columnConfig.js`
4. **Animaciones**: Usar siempre 750ms con easing `easeInOutQuart`
5. **Etiquetas**: Plugin `datalabels` debe estar presente en todos los gráficos de barras

## 🔄 Próximos Pasos

Para completar la estandarización:

1. ✅ Corregir capitalización en todos los títulos H2, H3, H4
2. ⏳ Aplicar estilo estándar a todos los gráficos de barras en `multiYearComparison.js`
3. ⏳ Verificar que todos los gráficos usen el plugin `ChartDataLabels`
4. ⏳ Probar la generación de reportes para verificar cambios

---

**Fecha**: Octubre 22, 2025
**Archivos modificados**: 
- `HTMLReportGenerator.js`
- `percentileAnalysis.js`
- `globalStatistics.js`
