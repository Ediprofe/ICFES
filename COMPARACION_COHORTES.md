# Comparación de Grupos de Cohortes

## Descripción
Nueva funcionalidad implementada en el reporte HTML multianual que permite comparar estadísticas entre grupos de cohortes (años).

## Ubicación
La funcionalidad se encuentra en la sección de **Curvas de distribución normal (Campana de Gauss)**, debajo de la gráfica de distribución normal.

## Características

### 1. Selección de Grupos
- **Grupo A** (azul): Selecciona uno o más años para el primer grupo
- **Grupo B** (verde): Selecciona uno o más años para el segundo grupo

### 2. Métricas Calculadas
Para cada grupo se calcula:
- **Promedio Global** (sin PIAR): Promedio de los promedios de los años seleccionados
- **Desviación Estándar**: Promedio de las desviaciones estándar de los años seleccionados

### 3. Comparación Automática
El sistema muestra:
- **Diferencia en Promedio**: Diferencia absoluta y porcentual entre grupos
- **Diferencia en Desviación Estándar**: Diferencia absoluta y porcentual entre grupos
- **Interpretación Automática**: Análisis textual de los resultados con códigos de color:
  - ✨ Verde: Grupo B mejor en ambas métricas
  - ⚡ Azul: Grupo B mejor promedio pero mayor dispersión
  - ⚖️ Naranja: Grupo B menor promedio pero más homogéneo
  - ⚠️ Rojo: Grupo A mejor en ambas métricas

## Diseño
- Mantiene el sistema de diseño actual con Tailwind CSS
- Usa colores consistentes con el resto del reporte
- Interfaz intuitiva con checkboxes y actualización en tiempo real
- Responsive design para dispositivos móviles

## Buenas Prácticas Implementadas
- ✅ Código modular y reutilizable
- ✅ Validación de datos (requiere al menos un año en cada grupo)
- ✅ Cálculos precisos con redondeo apropiado
- ✅ Feedback visual inmediato
- ✅ Interpretación automática de resultados
- ✅ Diseño responsive
- ✅ Accesibilidad con labels y controles claros

## Ejemplo de Uso
1. En el reporte multianual, navega a la sección "Curvas de distribución normal"
2. Desplázate hacia abajo hasta "Comparación de Grupos de Cohortes"
3. Selecciona uno o más años en el Grupo A (ej: 2023, 2024)
4. Selecciona uno o más años en el Grupo B (ej: 2025)
5. Los resultados se actualizan automáticamente mostrando la comparación

## Archivo Modificado
- `/src/reports/html/htmlSections/multiYearComparison.js`
  - Agregada sección HTML de comparación de grupos
  - Implementada función `updateCohortComparison()` para cálculos y visualización
