# Análisis de Percentiles y Niveles de Desempeño

## 📋 Resumen de Cambios

Se ha agregado una nueva sección al informe HTML de un solo cohorte que incluye:

1. **Gráfico de barras**: Promedio de percentiles por área académica
2. **Desviación estándar**: Tarjetas informativas debajo del gráfico de barras
3. **Gráficos circulares**: Distribución de niveles de desempeño por área

## 🎯 Características Implementadas

### 1. Gráfico de Barras de Percentiles

- Muestra el promedio de percentiles para cada área académica
- Soporta toggle entre "Sin PIAR" y "Con PIAR"
- Colores consistentes con la paleta del sistema:
  - **Lectura crítica**: Azul (#3b82f6)
  - **Matemáticas**: Rojo (#ef4444)
  - **Sociales**: Naranja (#f97316)
  - **Naturales**: Verde (#22c55e)
  - **Inglés**: Morado (#a855f7)

### 2. Desviación Estándar por Área

- Tarjetas visuales con gradientes de color por área
- Muestra desviación estándar para "Sin PIAR" y "Con PIAR"
- Se actualiza dinámicamente según el toggle seleccionado
- Diseño responsivo con grid adaptativo

### 3. Gráficos Circulares de Niveles

- Un gráfico circular por cada área académica
- Muestra la distribución porcentual de estudiantes por nivel
- Colores progresivos del rojo (nivel bajo) al azul (nivel alto)
- Tooltips informativos con cantidad de estudiantes
- Se actualiza según el toggle "Sin PIAR" / "Con PIAR"

## 📊 Estructura de Datos

### Columnas Requeridas

El sistema espera las siguientes columnas en el Excel:

**Obligatorias (en amarillo en la imagen):**
- `¿PIAR?`
- `Grupo`
- `Nombre`
- `Apellido`
- `Lectura crítica`
- `Matemáticas`
- `Sociales`
- `Naturales`
- `Inglés`
- `Global`

**Percentiles:**
- `% LC` (Percentil Lectura Crítica)
- `% MAT` (Percentil Matemáticas)
- `% SOC` (Percentil Sociales)
- `% NAT` (Percentil Naturales)
- `% ING` (Percentil Inglés)

**Niveles:**
- `Nivel LC` (Nivel Lectura Crítica)
- `Nivel MAT` (Nivel Matemáticas)
- `Nivel SOC` (Nivel Sociales)
- `Nivel NAT` (Nivel Naturales)
- `Nivel ING` (Nivel Inglés)

## 🎨 Estilos y Buenas Prácticas

### Colores Consistentes

Los colores utilizados son los mismos definidos en `columnConfig.js`:

```javascript
ACADEMIC_AREAS = [
  { id: 'lectura', color: '#3b82f6', lightColor: '#dbeafe', icon: '📖' },
  { id: 'matematicas', color: '#ef4444', lightColor: '#fee2e2', icon: '🔢' },
  { id: 'sociales', color: '#f97316', lightColor: '#ffedd5', icon: '🌍' },
  { id: 'naturales', color: '#22c55e', lightColor: '#dcfce7', icon: '🔬' },
  { id: 'ingles', color: '#a855f7', lightColor: '#f3e8ff', icon: '🗣️' }
]
```

### Animaciones

- Transiciones suaves de 750ms con easing `easeInOutQuart`
- Efectos hover en botones con `transform: scale(1.05)`
- Actualización dinámica de gráficos con animación

### Responsividad

- Grid adaptativo: 2 columnas en móvil, 3 en tablet, 5 en desktop
- Gráficos con `maintainAspectRatio: false` para mejor control
- Alturas fijas para consistencia visual

## 📁 Archivos Modificados

### Nuevos Archivos

1. **`src/reports/html/htmlSections/percentileAnalysis.js`**
   - Sección completa de análisis de percentiles y niveles
   - Funciones de cálculo de promedios y distribuciones
   - Generación de gráficos Chart.js

### Archivos Modificados

1. **`src/reports/html/HTMLReportGenerator.js`**
   - Importación de la nueva sección
   - Integración en el flujo de generación de reportes de un solo año
   - Posición: después de "Estadísticas Globales" y antes de "Top Performers"

## 🔧 Funciones Principales

### `calculatePercentileAverages(data, excludePIAR)`

Calcula el promedio y desviación estándar de percentiles por área.

**Parámetros:**
- `data`: Array de estudiantes
- `excludePIAR`: Boolean para excluir estudiantes con PIAR

**Retorna:**
```javascript
{
  averages: { 'Lectura crítica': 75.5, ... },
  stdDevs: { 'Lectura crítica': 12.3, ... }
}
```

### `calculatePerformanceLevels(data, excludePIAR)`

Calcula la distribución de niveles de desempeño por área.

**Parámetros:**
- `data`: Array de estudiantes
- `excludePIAR`: Boolean para excluir estudiantes con PIAR

**Retorna:**
```javascript
{
  'Lectura crítica': {
    counts: { '1': 5, '2': 15, '3': 30, '4': 20 },
    percentages: { '1': 7.14, '2': 21.43, '3': 42.86, '4': 28.57 },
    total: 70
  },
  ...
}
```

## 🎯 Interactividad

### Toggle Sin PIAR / Con PIAR

Los usuarios pueden alternar entre:
- **Sin PIAR**: Excluye estudiantes con PIAR del análisis
- **Con PIAR**: Incluye todos los estudiantes

Al cambiar el toggle:
1. Se actualizan los gráficos de barras de percentiles
2. Se muestran/ocultan las desviaciones estándar correspondientes
3. Se actualizan los gráficos circulares de niveles

### Tooltips Informativos

- **Gráfico de barras**: Muestra valor exacto del percentil
- **Gráficos circulares**: Muestra porcentaje y cantidad de estudiantes

## 📈 Orden de Secciones en el Reporte

Para un reporte de **un solo cohorte**, el orden es:

1. **Portada**
2. **Tabla de Estudiantes**
3. **Estadísticas Globales** (promedio y desviación estándar)
4. **✨ Análisis de Percentiles y Niveles** (NUEVA)
5. **Top Performers**
6. **Gráficos Interactivos**
7. **Outliers**

## 🚀 Próximos Pasos

Para usar esta nueva funcionalidad:

1. Asegúrate de que tu archivo Excel incluya las columnas de percentiles (`% LC`, `% MAT`, etc.) y niveles (`Nivel LC`, `Nivel MAT`, etc.)
2. Carga el archivo en el sistema
3. Genera el reporte HTML de un solo cohorte
4. La nueva sección aparecerá automáticamente después de "Estadísticas Globales"

## ⚠️ Notas Importantes

- Si una columna de percentil o nivel no existe, esa área no se mostrará en los gráficos
- Los niveles deben ser valores numéricos (1, 2, 3, 4, etc.)
- Los percentiles deben estar entre 0 y 100
- El sistema maneja automáticamente valores nulos o vacíos

## 🎨 Ejemplo Visual

```
┌─────────────────────────────────────────────────┐
│  📊 Análisis de Percentiles y Niveles           │
├─────────────────────────────────────────────────┤
│  [Sin PIAR] [Con PIAR]                          │
├─────────────────────────────────────────────────┤
│  Promedio de Percentiles por Área              │
│  ┌─────────────────────────────────────┐       │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │       │
│  │  Lectura  Mat  Soc  Nat  Ing        │       │
│  └─────────────────────────────────────┘       │
├─────────────────────────────────────────────────┤
│  Desviación Estándar por Área                   │
│  [📖 LC] [🔢 MAT] [🌍 SOC] [🔬 NAT] [🗣️ ING]  │
├─────────────────────────────────────────────────┤
│  Niveles de Desempeño por Área                  │
│  [🥧 LC] [🥧 MAT] [🥧 SOC] [🥧 NAT] [🥧 ING]  │
└─────────────────────────────────────────────────┘
```

---

**Fecha de implementación**: Octubre 22, 2025
**Versión**: 1.0.0
