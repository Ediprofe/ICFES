# 🎨 Leyenda de Dos Niveles: Áreas + Indicadores PIAR

## 📅 Fecha: 10 de octubre de 2025

## 🎯 Mejora de Leyenda

### Antes (Leyenda Jerárquica):
```
🔵 Lectura Crítica
  ↳ con PIAR (tenue)
🔴 Matemáticas
  ↳ con PIAR (tenue)
🟠 Sociales
  ↳ con PIAR (tenue)
🟢 Naturales
  ↳ con PIAR (tenue)
🟣 Inglés
  ↳ con PIAR (tenue)

❌ Leyenda muy larga
❌ Repetitivo (5 veces "con PIAR")
```

### Ahora (Leyenda de Dos Niveles):
```
Nivel 1 - ÁREAS:
🔵 Lectura   🔴 Matemáticas   🟠 Sociales   🟢 Naturales   🟣 Inglés

Nivel 2 - TIPO DE DATO:
⚪ Con PIAR   ⚫ Sin PIAR

✅ Leyenda compacta
✅ Información clara
✅ Fácil de entender
```

---

## 🎨 Visualización de la Leyenda

### Con Comparación PIAR Activa

**Gráfico:**
```
        100 ┃
            ┃   62.0 64.2  60.5 63.8  57.0 59.9  58.1 60.4  65.8 67.2
         80 ┃   ░░   ██    ░░   ██    ░░   ██    ░░   ██    ░░   ██
            ┃   ░░   ██    ░░   ██    ░░   ██    ░░   ██    ░░   ██
         60 ┃   ░░   ██    ░░   ██    ░░   ██    ░░   ██    ░░   ██
            ┃   ░░   ██    ░░   ██    ░░   ██    ░░   ██    ░░   ██
         40 ┃   ░░   ██    ░░   ██    ░░   ██    ░░   ██    ░░   ██
            ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               L    L     M    M     S    S     N    N     I    I
                  Grado 11°1
```

**Leyenda (debajo del gráfico):**
```
┌─────────────────────────────────────────────────────────────┐
│  Áreas:                                                     │
│  🔵 Lectura  🔴 Matemáticas  🟠 Sociales  🟢 Naturales  🟣 Inglés │
│                                                             │
│  Tipo de Dato:                                              │
│  ⚪ Con PIAR  ⚫ Sin PIAR                                    │
└─────────────────────────────────────────────────────────────┘
```

**Interpretación:**
- **Color** identifica el área (🔵 = Lectura, 🔴 = Matemáticas, etc.)
- **Opacidad** indica el tipo (⚪ tenue = con PIAR, ⚫ oscuro = sin PIAR)

**Ejemplo de lectura:**
- Barra azul claro (░) = Lectura con PIAR
- Barra azul oscuro (█) = Lectura sin PIAR
- Barra roja claro (░) = Matemáticas con PIAR
- Barra roja oscuro (█) = Matemáticas sin PIAR

---

### Sin Comparación PIAR (Toggle Desactivado)

**Gráfico:**
```
        100 ┃
            ┃   64.2  63.8  59.9  60.4  67.2
         80 ┃   ██    ██    ██    ██    ██
            ┃   ██    ██    ██    ██    ██
         60 ┃   ██    ██    ██    ██    ██
            ┃   ██    ██    ██    ██    ██
         40 ┃   ██    ██    ██    ██    ██
            ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
               L     M     S     N     I
                  Grado 11°1
```

**Leyenda (debajo del gráfico):**
```
┌─────────────────────────────────────────────────────────────┐
│  Áreas:                                                     │
│  🔵 Lectura  🔴 Matemáticas  🟠 Sociales  🟢 Naturales  🟣 Inglés │
└─────────────────────────────────────────────────────────────┘
```

**Interpretación:**
- Solo muestra colores de áreas
- No hay indicadores de PIAR (no aplica)
- Todas las barras son sólidas (sin PIAR)

---

## 🔧 Implementación Técnica

### Estructura de Leyenda Personalizada

```javascript
legend: {
  display: true,
  position: 'bottom',
  labels: {
    font: { size: 10, weight: 'bold' },
    padding: 8,
    usePointStyle: true,
    pointStyle: 'circle',  // ← Círculos en lugar de rectángulos
    generateLabels: function(chart) {
      const labels = [];
      
      // ═══════════════════════════════════════
      // NIVEL 1: COLORES POR ÁREA
      // ═══════════════════════════════════════
      
      const areas = ['Lectura', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
      const areaColors = {
        'Lectura': '#3b82f6',      // Azul
        'Matemáticas': '#ef4444',  // Rojo
        'Sociales': '#f97316',     // Naranja
        'Naturales': '#22c55e',    // Verde
        'Inglés': '#a855f7'        // Morado
      };
      
      areas.forEach(area => {
        labels.push({
          text: area,
          fillStyle: areaColors[area],      // Color del círculo
          strokeStyle: areaColors[area],    // Borde del círculo
          lineWidth: 2,
          hidden: false,
          pointStyle: 'circle'
        });
      });
      
      // ═══════════════════════════════════════
      // NIVEL 2: INDICADORES DE PIAR
      // ═══════════════════════════════════════
      
      if (showPIAR) {
        // Separador visual (espacio)
        labels.push({
          text: '  ',
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          hidden: true
        });
        
        // Indicador: Con PIAR (gris claro)
        labels.push({
          text: 'Con PIAR',
          fillStyle: 'rgba(156, 163, 175, 0.4)',  // ⚪ Gris claro
          strokeStyle: '#9ca3af',
          lineWidth: 2,
          hidden: false,
          pointStyle: 'circle'
        });
        
        // Indicador: Sin PIAR (gris oscuro)
        labels.push({
          text: 'Sin PIAR',
          fillStyle: 'rgba(71, 85, 105, 0.85)',  // ⚫ Gris oscuro
          strokeStyle: '#475569',
          lineWidth: 2,
          hidden: false,
          pointStyle: 'circle'
        });
      }
      
      return labels;
    }
  }
}
```

---

## 🎨 Colores de Indicadores PIAR

### Con PIAR (Barra Tenue)
```javascript
fillStyle: 'rgba(156, 163, 175, 0.4)'  // Gris claro, opacidad 40%
strokeStyle: '#9ca3af'                 // Borde gris medio
```

**Visual:**
```
⚪  ← Círculo gris muy claro (casi blanco)
```

**Representa:** Datos CON estudiantes PIAR incluidos (valores más bajos)

---

### Sin PIAR (Barra Sólida)
```javascript
fillStyle: 'rgba(71, 85, 105, 0.85)'  // Gris oscuro, opacidad 85%
strokeStyle: '#475569'                // Borde gris oscuro
```

**Visual:**
```
⚫  ← Círculo gris oscuro (casi negro)
```

**Representa:** Datos SIN estudiantes PIAR (valores más altos)

---

## 📊 Mapeo Visual Completo

### Ejemplo: Matemáticas en Grado 11°1

**Barras en el gráfico:**
```
   60.5  63.8  ← Valores visibles
   ░░    ██    ← Barras
   Rojas (Matemáticas)
```

**Cómo identificar:**

1. **Paso 1:** Buscar color en leyenda nivel 1
   ```
   🔴 Matemáticas  ← Rojo
   ```

2. **Paso 2:** Identificar opacidad en leyenda nivel 2
   ```
   ⚪ Con PIAR   → Barra roja clara (░░) = 60.5
   ⚫ Sin PIAR   → Barra roja oscura (██) = 63.8
   ```

3. **Conclusión:**
   - Matemáticas con PIAR = **60.5**
   - Matemáticas sin PIAR = **63.8**
   - Diferencia = **3.3 puntos**

---

## 🎯 Ventajas de la Nueva Leyenda

### 1. **Compacta** 📏

**Antes:**
```
10 líneas de leyenda
(5 áreas × 2 líneas cada una)
```

**Ahora:**
```
7 elementos de leyenda
(5 áreas + 2 indicadores)
Todo en formato horizontal
```

### 2. **Clara y Directa** 💡

**Información en dos niveles:**
- **¿Qué área?** → Mira el color (nivel 1)
- **¿Con o sin PIAR?** → Mira la opacidad (nivel 2)

### 3. **No Redundante** ♻️

**Antes:**
```
"con PIAR (tenue)" × 5 veces
```

**Ahora:**
```
"Con PIAR" × 1 vez (aplica a todas las áreas)
```

### 4. **Fácil de Leer en Presentaciones** 📊

```
Proyector → Leyenda compacta abajo → Más espacio para el gráfico
```

---

## 🔍 Casos de Uso

### Caso 1: Analizar una Área Específica

**Pregunta:** "¿Cómo está el desempeño en Naturales?"

**Proceso:**
1. Buscar en leyenda nivel 1: **🟢 Naturales** (verde)
2. Identificar barras verdes en el gráfico
3. Ver opacidad:
   - Verde claro (⚪) = con PIAR
   - Verde oscuro (⚫) = sin PIAR
4. Leer valores sobre las barras

**Resultado:**
```
Grado 11°1:
  58.1 (con PIAR) vs 60.4 (sin PIAR) → Diferencia: 2.3
Grado 11°2:
  56.7 (con PIAR) vs 58.2 (sin PIAR) → Diferencia: 1.5
```

---

### Caso 2: Comparar Áreas en un Grado

**Pregunta:** "¿Qué área tiene mejor desempeño en Grado 11°3?"

**Proceso:**
1. Ir a la sección de Grado 11°3 en el gráfico
2. Comparar alturas de las barras **oscuras** (sin PIAR)
3. Identificar colores:
   - Barra más alta = Morado (🟣) = **Inglés: 69.7**
   - Segunda más alta = Rojo (🔴) = **Matemáticas: 64.6**

**Resultado:**
```
Inglés lidera con 69.7 puntos (sin PIAR)
```

---

### Caso 3: Evaluar Impacto PIAR

**Pregunta:** "¿En qué área el PIAR tiene mayor impacto?"

**Proceso:**
1. Para cada color, comparar barra clara (⚪) vs barra oscura (⚫)
2. Calcular diferencias
3. Identificar mayor brecha

**Ejemplo en Grado 11°1:**
```
🔵 Lectura:     64.2 - 62.0 = 2.2
🔴 Matemáticas: 63.8 - 60.5 = 3.3  ← Mayor impacto
🟠 Sociales:    59.9 - 57.0 = 2.9
🟢 Naturales:   60.4 - 58.1 = 2.3
🟣 Inglés:      67.2 - 65.8 = 1.4
```

**Conclusión:**
```
Matemáticas tiene el mayor impacto PIAR (3.3 puntos)
→ Necesita mayor refuerzo para estudiantes PIAR
```

---

## 📐 Disposición Visual

### Layout de Leyenda

```
┌─────────────────────────────────────────────────────────────────┐
│                       GRÁFICO INTEGRADO                         │
│                                                                 │
│      [Barras agrupadas por grado y área]                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  LEYENDA (dos niveles):                                         │
│                                                                 │
│  ● Lectura  ● Matemáticas  ● Sociales  ● Naturales  ● Inglés   │  ← Nivel 1
│                                                                 │
│  ○ Con PIAR  ● Sin PIAR                                         │  ← Nivel 2
└─────────────────────────────────────────────────────────────────┘
```

**Espaciado:**
- Padding entre leyenda y gráfico: **8px**
- Tamaño de fuente: **10px bold**
- Círculos: Radio proporcional al texto

---

## ✅ Checklist de Verificación

### Leyenda de Áreas (Nivel 1)
- [x] 🔵 Lectura (azul)
- [x] 🔴 Matemáticas (rojo)
- [x] 🟠 Sociales (naranja)
- [x] 🟢 Naturales (verde)
- [x] 🟣 Inglés (morado)
- [x] Círculos con color sólido
- [x] Tamaño y espaciado consistente

### Leyenda de PIAR (Nivel 2)
- [x] ⚪ Con PIAR (gris claro, opacidad 0.4)
- [x] ⚫ Sin PIAR (gris oscuro, opacidad 0.85)
- [x] Solo visible cuando comparación PIAR está activa
- [x] Círculos representan opacidad correctamente

### Barras del Gráfico
- [x] Misma área = mismo color base
- [x] Con PIAR = opacidad 0.4 (tenue)
- [x] Sin PIAR = opacidad 0.85 (sólido)
- [x] Barras adyacentes (juntas por área)
- [x] Valores visibles sobre cada barra

### Funcionalidad
- [x] Toggle PIAR muestra/oculta barras claras
- [x] Leyenda nivel 2 aparece/desaparece con toggle
- [x] Colores consistentes entre barras y leyenda
- [x] Círculos clicables para ocultar/mostrar datos

---

## 🚀 Cómo Probar

### Paso 1: Recargar Aplicación
```bash
http://localhost:5176/
```

### Paso 2: Exportar HTML
1. Cargar datos con estudiantes PIAR
2. Exportar presentación HTML
3. Abrir archivo descargado

### Paso 3: Verificar Leyenda

**Con Comparación PIAR Activa:**
```
✅ Primera línea: 5 círculos de colores (áreas)
✅ Segunda línea: 2 círculos grises (con/sin PIAR)
✅ Total: 7 elementos en la leyenda
```

**Con Comparación PIAR Desactivada:**
```
✅ Solo 5 círculos de colores (áreas)
✅ Sin indicadores de PIAR
✅ Total: 5 elementos en la leyenda
```

### Paso 4: Verificar Barras

**Para cada grado, confirmar:**
```
1. Dos barras del mismo color (mismo área)
2. Primera barra = tenue (⚪ con PIAR)
3. Segunda barra = sólida (⚫ sin PIAR)
4. Valores sobre ambas barras
```

### Paso 5: Probar Toggle

1. **Clic en "Comparación con/sin PIAR"**
2. **Observar:**
   - ✅ Barras claras desaparecen
   - ✅ Indicadores PIAR desaparecen de leyenda
   - ✅ Solo quedan 5 elementos en leyenda (áreas)

---

## 💡 Interpretación Rápida

### Guía Visual de 3 Segundos

```
1. VER EL COLOR → Identificar área
   🔵 = Lectura
   🔴 = Matemáticas
   🟠 = Sociales
   🟢 = Naturales
   🟣 = Inglés

2. VER LA OPACIDAD → Identificar tipo
   ░ = Con PIAR (más bajo)
   █ = Sin PIAR (más alto)

3. LEER EL NÚMERO → Obtener valor exacto
   64.2 = Promedio
```

**Ejemplo completo:**
```
Barra: ░░ azul claro con 62.0 encima

Interpretación:
- Color azul (🔵) → Lectura Crítica
- Opacidad clara (⚪) → Con PIAR
- Valor 62.0 → Promedio de Lectura con PIAR
```

---

## 📚 Archivos Modificados

### `src/utils/htmlExporter.js`

**Sección modificada:** Líneas ~1497-1560

**Cambio principal:**
```javascript
// Antes: Leyenda jerárquica con sub-indicadores
generateLabels: function(chart) {
  // Lectura
  //   ↳ con PIAR (tenue)
  // Matemáticas
  //   ↳ con PIAR (tenue)
  // ...
}

// Ahora: Leyenda de dos niveles
generateLabels: function(chart) {
  // Nivel 1: Lectura | Matemáticas | Sociales | Naturales | Inglés
  // Nivel 2: Con PIAR | Sin PIAR
}
```

---

## 🎉 Resultado Final

### Leyenda Intuitiva

**Ventajas:**
- ✅ **Compacta:** 7 elementos vs 10
- ✅ **Clara:** Dos niveles de información
- ✅ **Visual:** Colores + opacidad
- ✅ **No redundante:** "Con PIAR" se dice 1 vez
- ✅ **Profesional:** Formato estándar de leyendas

### Barras Organizadas

**Estructura:**
```
Para cada grado:
  [ ░ █ ]  [ ░ █ ]  [ ░ █ ]  [ ░ █ ]  [ ░ █ ]
    L        M        S        N        I
    
  Cada par = misma área
  ░ = con PIAR (claro)
  █ = sin PIAR (oscuro)
```

### Interpretación Inmediata

**Usuario puede:**
1. Ver color → Identificar área
2. Ver opacidad → Identificar tipo (con/sin PIAR)
3. Leer valor → Obtener dato exacto
4. Comparar barras → Calcular impacto PIAR

---

**Desarrollado por:** [ediprofe.com](https://ediprofe.com)  
**Fecha:** 10 de octubre de 2025  
**Versión:** 3.4.0 - Leyenda de Dos Niveles + Círculos Indicadores  
**Estado:** ✅ **PERFECTO PARA PRESENTACIONES**

---

## 🎯 Resumen Ejecutivo

**Mejora Principal:**  
Leyenda de dos niveles con círculos de colores (áreas) y círculos grises (con/sin PIAR)

**Formato:**
```
Nivel 1: 🔵 🔴 🟠 🟢 🟣  (colores de áreas)
Nivel 2: ⚪ ⚫            (indicadores PIAR)
```

**Beneficio:**  
Leyenda compacta, clara y profesional. Información completa en mínimo espacio.

¡LISTA PARA COMPARTIR CON DIRECTIVOS! 🚀
