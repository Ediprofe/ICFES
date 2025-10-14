# 🎯 GUÍA PARA TRABAJAR CON WINDSURF - REFACTORIZACIÓN ICFES ANALYZER

## 📋 PREPARACIÓN INICIAL (30 minutos)

### 1. **Organiza tus archivos de documentación**

Crea esta estructura en la raíz de tu proyecto:

```
icfes-analyzer/
├── docs/
│   ├── AUDITORIA.md                    ← El archivo de auditoría detallada
│   ├── INSTRUCCIONES_WINDSURF.md       ← El archivo de instrucciones finales
│   ├── SPRINT_ACTUAL.md                ← Archivo que irás actualizando
│   └── PROGRESO.md                     ← Checklist de progreso
├── src/
├── package.json
└── ...
```

### 2. **Crea el archivo de progreso** (`docs/PROGRESO.md`)

```markdown
# 📊 PROGRESO DE REFACTORIZACIÓN

## ✅ COMPLETADO
- [ ] Sprint 1.1 - Estructura de carpetas
- [ ] Sprint 1.2 - columnConfig.js
- [ ] Sprint 1.3 - metricsConfig.js
...

## 🚧 EN PROGRESO
- Nada por ahora

## ⏳ PENDIENTE
- Todo lo demás

## ⚠️ BLOQUEADORES
- Ninguno por ahora

## 📝 NOTAS
- (Agregar notas según avances)
```

### 3. **Crea archivo de Sprint Actual** (`docs/SPRINT_ACTUAL.md`)

```markdown
# 🎯 SPRINT ACTUAL: Sprint 1 - Fundamentos

## 📋 TAREAS DEL SPRINT
1. [ ] Crear estructura de carpetas
2. [ ] Implementar columnConfig.js
3. [ ] Implementar metricsConfig.js
4. [ ] Implementar reportSections.js
5. [ ] Implementar visualConfig.js
6. [ ] Instalar Zustand
7. [ ] Crear Analysis.js
8. [ ] Crear MultiYearAnalysis.js
9. [ ] Crear analysisStore.js
10. [ ] Dividir calculations.js

## 🎯 TAREA ACTUAL
Ninguna - Listo para empezar

## ⏱️ TIEMPO ESTIMADO
2 semanas

## 📝 NOTAS
(Agregar según avances)
```

---

## 🚀 METODOLOGÍA DE TRABAJO CON WINDSURF

### **REGLA DE ORO: Una tarea a la vez, verificar antes de continuar**

### **Ciclo de trabajo (Repetir para cada tarea):**

```
1. Comunicar tarea → 2. Windsurf genera → 3. Verificar → 4. Commit → 5. Actualizar progreso
```

---

## 📝 CÓMO COMUNICARTE CON WINDSURF

### **FORMATO DE PROMPT EFECTIVO:**

```
# CONTEXTO
Estoy en Sprint [número], Tarea [número]: [nombre de la tarea]

# ARCHIVOS DE REFERENCIA
- Lee docs/INSTRUCCIONES_WINDSURF.md, sección "Sprint [X], Tarea [Y]"
- Lee docs/AUDITORIA.md si necesitas entender el problema actual

# OBJETIVO
[Descripción clara de lo que necesitas]

# REQUISITOS
- [Requisito 1]
- [Requisito 2]
- [Requisito 3]

# VALIDACIÓN
¿Cómo verifico que está correcto?
[Criterios de aceptación]

# EJEMPLO
[Si aplica, dar ejemplo de uso]
```

---

## 🎬 EJEMPLOS PRÁCTICOS DE PROMPTS

### **EJEMPLO 1: Crear estructura de carpetas**

```
# CONTEXTO
Estoy iniciando Sprint 1, Tarea 1: Crear estructura de carpetas completa

# ARCHIVOS DE REFERENCIA
Lee docs/INSTRUCCIONES_WINDSURF.md, sección "ESTRUCTURA DE CARPETAS FINAL"

# OBJETIVO
Crear TODAS las carpetas listadas en la estructura, SIN mover código todavía.
Solo preparar la estructura vacía.

# REQUISITOS
- Crear todas las carpetas de /src/config/
- Crear todas las carpetas de /src/stores/
- Crear todas las carpetas de /src/models/
- Crear todas las carpetas de /src/utils/calculations/
- Crear todas las carpetas de /src/utils/validation/
- Crear todas las carpetas de /src/utils/errors/
- Crear todas las carpetas de /src/reports/
- Crear carpeta /tests/
- NO crear archivos todavía, solo carpetas
- NO tocar código existente

# VALIDACIÓN
La estructura debe quedar exactamente como se muestra en INSTRUCCIONES_WINDSURF.md
```

---

### **EJEMPLO 2: Implementar columnConfig.js**

```
# CONTEXTO
Sprint 1, Tarea 1.2: Implementar archivo de configuración de columnas

# ARCHIVOS DE REFERENCIA
Lee docs/INSTRUCCIONES_WINDSURF.md, busca la sección "columnConfig.js" 
en Sprint 1, tarea 1.2

# OBJETIVO
Crear /src/config/columnConfig.js con toda la configuración de columnas del sistema

# REQUISITOS
Debe incluir exactamente:
1. COLUMN_TYPES (enum)
2. REQUIRED_COLUMNS (array de objetos con name, type, validation, errorMessage)
3. OPTIONAL_COLUMNS (array de objetos similar)
4. ACADEMIC_AREAS (array con 5 áreas: Lectura crítica, Matemáticas, Sociales, Naturales, Inglés)
   - Cada área debe tener: id, name, shortName, columnName, percentileColumn, color, lightColor, darkColor, icon
5. Helper functions: getAreaByColumnName(), getAreaById(), getAllColumnNames(), getRequiredColumnNames()

# COLUMNAS OBLIGATORIAS ACTUALES (del Excel)
Basándote en el archivo actual del proyecto:
- Año, ¿PIAR?, Grupo, Nombre, Apellido
- Lectura crítica, Matemáticas, Sociales, Naturales, Inglés, Global

# VALIDACIÓN
- El archivo debe exportar todas las constantes y funciones
- Las validaciones de REQUIRED_COLUMNS deben ser funciones que retornen boolean
- ACADEMIC_AREAS debe tener exactamente 5 elementos
- Los colores deben ser hexadecimales válidos

# NO TOCAR
- No modificar ningún otro archivo todavía
- No importar este archivo en ningún lugar todavía
```

---

### **EJEMPLO 3: Dividir calculations.js**

```
# CONTEXTO
Sprint 1, Tarea 1.6: Dividir calculations.js en módulos

# ARCHIVOS DE REFERENCIA
Lee docs/INSTRUCCIONES_WINDSURF.md, sección "Sprint 1, tarea 1.6"
Lee el archivo actual src/utils/calculations.js

# OBJETIVO
Dividir calculations.js en 4 módulos sin cambiar funcionalidad

# REQUISITOS
1. Crear /src/utils/calculations/basic.js
   - Mover: mean, stdDev, median, mode, min, max, sum, count
   - IMPORTANTE: Mantener la lógica EXACTA actual (filtrar nulls, usar n-1 en stdDev)

2. Crear /src/utils/calculations/statistical.js
   - Mover: zScore, findOutliers, calculatePercentile, calculateAllPercentiles
   - IMPORTANTE: findOutliers debe usar METRIC_LIMITS.OUTLIER_THRESHOLD_SIGMA de config

3. Crear /src/utils/calculations/metrics.js
   - Mover: calculateGlobalMetrics, calculateAreaMetrics, calculateGradeMetrics
   - Mover: getTopByArea, getTopByGrade, getAllTopByGrade
   - IMPORTANTE: Usar ACADEMIC_AREAS de columnConfig, no arrays hardcodeados

4. Crear /src/utils/calculations/comparative.js (NUEVO)
   - Ver funciones detalladas en docs/INSTRUCCIONES_WINDSURF.md

5. Crear /src/utils/calculations/index.js
   - Exportar TODO de los 4 módulos usando export * from './...'

# VALIDACIÓN
- Cada función debe tener el MISMO comportamiento que antes
- Los imports deben apuntar a los archivos de config
- NO debe haber strings mágicos hardcodeados
- El archivo calculations.js original se puede eliminar después

# ORDEN DE EJECUCIÓN
1. Crear los 4 módulos nuevos
2. Crear index.js
3. Verificar que todo exporta correctamente
4. NO eliminar calculations.js todavía (lo haremos después de migrar todo)
```

---

### **EJEMPLO 4: Crear Zustand store**

```
# CONTEXTO
Sprint 1, Tarea 1.5: Implementar Zustand store

# ARCHIVOS DE REFERENCIA
Lee docs/INSTRUCCIONES_WINDSURF.md, busca "analysisStore.js" en Sprint 1

# PREREQUISITOS
- MultiYearAnalysis.js debe existir
- Zustand debe estar instalado (npm install zustand immer)

# OBJETIVO
Crear /src/stores/analysisStore.js con gestión de estado completa

# REQUISITOS
El store debe tener:

ESTADO:
- multiYearAnalysis: instancia de MultiYearAnalysis
- comparisonMode: boolean
- loading: boolean
- error: string | null

SELECTORES (funciones que retornan valores):
- getActiveAnalysis()
- getAvailableYears()
- getBaseYear()
- getComparisonYears()
- getComparisonAnalyses()
- hasData()
- isYearLoaded(year)

ACTIONS (funciones que modifican estado):
- loadBaseYear(file) - ASYNC, llama a parseExcel y crea Analysis
- loadComparisonYear(file) - ASYNC, similar al anterior
- enableComparisonMode()
- disableComparisonMode()
- setBaseYear(year)
- toggleYearInComparison(year)
- updateFilters(year, filters)
- removeYear(year)
- clearError()
- reset()

MIDDLEWARE:
- persist: con name: 'icfes-analysis-storage'
- devtools: con name: 'ICFES Analysis Store'
- immer: para mutaciones inmutables

IMPORTANTE:
- El middleware persist debe llamar toJSON() al guardar
- El onRehydrateStorage debe llamar fromJSON() al cargar
- Usar immer para todas las mutaciones de estado

# VALIDACIÓN
- El store se puede importar: import { useAnalysisStore } from './stores/analysisStore'
- Los hooks funcionan: const hasData = useAnalysisStore(state => state.hasData())
- El persist guarda y recupera datos correctamente

# EJEMPLO DE USO
```javascript
const loadBaseYear = useAnalysisStore(state => state.loadBaseYear);
await loadBaseYear(file);
```
```

---

## 🔄 WORKFLOW DETALLADO PASO A PASO

### **INICIO DE CADA SPRINT:**

**1. Actualiza `docs/SPRINT_ACTUAL.md`:**
```markdown
# 🎯 SPRINT ACTUAL: Sprint [número] - [nombre]

## 📋 TAREAS DEL SPRINT
[Lista completa de tareas del sprint]

## 🎯 TAREA ACTUAL
Ninguna - Listo para empezar

## ⏱️ TIEMPO ESTIMADO
[X semanas]
```

**2. Prompt inicial a Windsurf:**
```
# INICIO DE SPRINT

Voy a iniciar Sprint [número]: [nombre del sprint]

Lee docs/INSTRUCCIONES_WINDSURF.md, sección "Sprint [número]"

Dame un resumen de:
1. Objetivos del sprint
2. Lista de tareas en orden
3. Archivos que se crearán
4. Archivos que se modificarán
5. Prerequisitos necesarios

NO generes código todavía, solo confirma que entendiste el sprint.
```

---

### **PARA CADA TAREA:**

**1. Actualiza `docs/SPRINT_ACTUAL.md`:**
```markdown
## 🎯 TAREA ACTUAL
Tarea [número]: [nombre]
Iniciada: [fecha y hora]
```

**2. Prompt a Windsurf (usa el formato de ejemplos arriba)**

**3. Windsurf genera el código**

**4. VERIFICACIÓN (CRÍTICO - NO SALTAR):**

```bash
# A. Verificar que archivos se crearon
ls -la src/config/  # (o la ruta correspondiente)

# B. Verificar sintaxis
npm run dev  # Debe iniciar sin errores

# C. Si hay tests
npm test  # Deben pasar

# D. Revisar el código generado
# - ¿Tiene imports correctos?
# - ¿Usa constantes de config?
# - ¿No hay strings mágicos?
# - ¿Está comentado adecuadamente?
```

**5. Si algo está mal:**
```
# PROBLEMA DETECTADO

En la tarea [número], encontré el siguiente problema:
[Descripción del problema]

Archivos afectados:
- [archivo 1]
- [archivo 2]

Error específico:
[Pegar error de consola o descripción detallada]

Por favor, corrige manteniendo todo lo demás intacto.
```

**6. Si todo está bien, COMMIT:**

```bash
git add .
git commit -m "feat: [descripción corta de la tarea]

- [Detalle 1]
- [Detalle 2]
- [Detalle 3]

Sprint [número], Tarea [número]"

# Ejemplo real:
git commit -m "feat: add columnConfig with all academic areas

- Created COLUMN_TYPES enum
- Defined REQUIRED_COLUMNS with validations
- Defined OPTIONAL_COLUMNS
- Configured 5 ACADEMIC_AREAS with colors and metadata
- Added helper functions

Sprint 1, Tarea 1.2"
```

**7. Actualiza `docs/PROGRESO.md`:**
```markdown
## ✅ COMPLETADO
- [x] Sprint 1.2 - columnConfig.js ✅ [fecha]
```

**8. Actualiza `docs/SPRINT_ACTUAL.md`:**
```markdown
## 📋 TAREAS DEL SPRINT
1. [x] Crear estructura de carpetas ✅
2. [x] Implementar columnConfig.js ✅
3. [ ] Implementar metricsConfig.js  ← SIGUIENTE
```

---

## 🚨 MANEJO DE PROBLEMAS COMUNES

### **Problema 1: Windsurf genera código pero tiene errores**

**NO hagas esto:**
```
❌ "Hay un error, arréglalo"  (Muy vago)
❌ Continuar sin arreglar el error
❌ Intentar arreglar manualmente sin entender
```

**HAZ esto:**
```
✅ Copia el error EXACTO de la consola
✅ Identifica el archivo y línea
✅ Prompt específico:

"En el archivo src/config/columnConfig.js, línea 45, 
obtengo este error:

[PEGAR ERROR COMPLETO]

El problema parece ser [tu diagnóstico].
Por favor corrige solo esa función/línea, manteniendo todo lo demás igual."
```

---

### **Problema 2: Windsurf genera código diferente al esperado**

```
El archivo [nombre] que generaste difiere de las especificaciones en 
docs/INSTRUCCIONES_WINDSURF.md

Específicamente:

ESPERADO (según docs):
- [Característica 1]
- [Característica 2]

GENERADO:
- [Lo que hizo diferente]

Por favor, ajusta para que coincida EXACTAMENTE con las instrucciones,
sección [Sprint X, Tarea Y].
```

---

### **Problema 3: No sabes si una tarea está completa**

```
# VERIFICACIÓN DE TAREA

Acabo de completar Sprint [X], Tarea [Y]: [nombre]

Según docs/INSTRUCCIONES_WINDSURF.md, los criterios de validación son:
[Listar criterios]

¿Puedes verificar si:
1. Todos los archivos necesarios fueron creados?
2. Los exports/imports son correctos?
3. No hay errores de sintaxis?
4. Cumple con todos los requisitos listados?

Si algo falta, dime QUÉ falta específicamente.
```

---

### **Problema 4: Perdiste el hilo de dónde vas**

```
# ESTADO ACTUAL

Necesito confirmar en qué punto estoy del proyecto.

Por favor:
1. Lee docs/PROGRESO.md
2. Dime qué sprint y tarea es la SIGUIENTE que debo hacer
3. Dame un resumen de 3 líneas de qué hace esa tarea
4. Lista los prerequisitos que deben existir

NO generes código todavía, solo ayúdame a orientarme.
```

---

## 📊 SISTEMA DE TRABAJO DIARIO

### **INICIO DEL DÍA (10 min):**

**1. Abre todos los archivos relevantes:**
```
- docs/INSTRUCCIONES_WINDSURF.md
- docs/PROGRESO.md
- docs/SPRINT_ACTUAL.md
```

**2. Prompt matutino a Windsurf:**
```
# INICIO DE SESIÓN

Buenos días. Vamos a continuar la refactorización.

Lee docs/PROGRESO.md y dime:
1. ¿Qué fue lo último que completé?
2. ¿Cuál es la siguiente tarea?
3. ¿Hay algún bloqueador conocido?

Luego dame un resumen de 5 líneas de qué hace la siguiente tarea.

NO generes código todavía.
```

---

### **DURANTE EL DÍA:**

**Trabaja en bloques de 1-2 horas:**

```
1 hora = 1-2 tareas pequeñas
```

**Entre tareas (5 min):**
- ✅ Verificar que el código funciona
- ✅ Commit
- ✅ Actualizar PROGRESO.md
- ✅ Break de 5-10 minutos

**Después de 2-3 tareas (15 min):**
- ✅ Revisar todos los commits del día
- ✅ Verificar que `npm run dev` funciona
- ✅ Verificar que `npm test` pasa (si hay tests)
- ✅ Push a GitHub

---

### **FIN DEL DÍA (15 min):**

**1. Actualiza `docs/SPRINT_ACTUAL.md`:**
```markdown
## 📝 NOTAS DE LA SESIÓN [fecha]

COMPLETADO HOY:
- Tarea X
- Tarea Y

PROBLEMAS ENCONTRADOS:
- [Problema 1 y cómo se resolvió]

SIGUIENTE SESIÓN:
- Continuar con Tarea Z
- [Nota especial si aplica]
```

**2. Commit final:**
```bash
git add docs/
git commit -m "docs: update progress after session [fecha]"
git push
```

**3. Prompt de cierre a Windsurf:**
```
# FIN DE SESIÓN

Hoy completé:
- [Tarea 1]
- [Tarea 2]

En la próxima sesión continuaré con:
- [Tarea siguiente]

¿Hay algo que deba tener en cuenta para la próxima vez?
¿Algún prerequisito que deba preparar?
```

---

## 🎯 ATAJOS Y TIPS PARA WINDSURF

### **Para generar código más rápido:**

```
# GENERACIÓN RÁPIDA

Genera [archivo] siguiendo EXACTAMENTE las especificaciones en
docs/INSTRUCCIONES_WINDSURF.md, sección [Sprint X, Tarea Y].

No me expliques qué hace, solo genera el código completo y funcional.

Después de generar, dame un checklist de 3 puntos de qué debo verificar.
```

---

### **Para revisar código generado:**

```
# REVISIÓN DE CÓDIGO

Acabas de generar [archivo].

Por favor revisa TÚ MISMO si:
1. Todos los imports son correctos
2. No hay strings mágicos hardcodeados
3. Usa constantes de config/ cuando debe
4. Tiene comentarios JSDoc en funciones públicas
5. Cumple con TODOS los requisitos de docs/INSTRUCCIONES_WINDSURF.md

Dame una tabla:
| Criterio | ✅/❌ | Comentario |
```

---

### **Para debugging:**

```
# DEBUG

Tengo este error:
[PEGAR ERROR]

Archivos involucrados:
- [archivo 1]
- [archivo 2]

Lo que intentaba hacer:
[Descripción]

Por favor:
1. Diagnostica la causa raíz
2. Propón una solución
3. Genera el código corregido
4. Explica qué causó el error (en 2 líneas)
```

---

### **Para refactorizar código existente:**

```
# REFACTOR SEGURO

Necesito refactorizar [archivo actual] según la nueva estructura.

Archivo actual: src/[ruta]
Archivo nuevo: src/[nueva ruta]

Instrucciones: docs/INSTRUCCIONES_WINDSURF.md, sección [...]

IMPORTANTE:
1. NO cambiar funcionalidad, solo ubicación y estructura
2. Mantener TODOS los tests pasando
3. Actualizar todos los imports en archivos que lo usan

Hazlo en estos pasos:
Step 1: Crear nuevo archivo
Step 2: Mover código
Step 3: Actualizar imports
Step 4: Verificar

Dame el código de Step 1 primero.
```

---

## 📱 PLANTILLAS DE PROMPTS GUARDADOS

### **Crea un archivo: `prompts-templates.md`**

```markdown
# PLANTILLAS DE PROMPTS PARA WINDSURF

## 1. INICIO DE TAREA
```
# CONTEXTO
Sprint [X], Tarea [Y]: [nombre]

# REFERENCIA
docs/INSTRUCCIONES_WINDSURF.md, sección "[...]"

# OBJETIVO
[...]

# REQUISITOS
- [...]

# VALIDACIÓN
[...]
```

## 2. REPORTAR PROBLEMA
```
# PROBLEMA

En [archivo], [descripción]

Error:
[pegar error]

Esperaba:
[...]

Obtuve:
[...]

Corrige solo [parte específica]
```

## 3. VERIFICAR TAREA
```
# VERIFICACIÓN

¿La tarea [nombre] está completa según 
docs/INSTRUCCIONES_WINDSURF.md?

Checklist de verificación:
[...]
```

## 4. GENERAR TESTS
```
# TESTS

Genera tests unitarios para [archivo]

Framework: Vitest
Ubicación: tests/unit/[...]

Casos a cubrir:
1. [...]
2. [...]
3. [...]
```
```

---

## ⚡ COMANDOS ÚTILES DURANTE REFACTORIZACIÓN

### **Terminal Commands (ejecutar frecuentemente):**

```bash
# Verificar que nada se rompió
npm run dev

# Correr tests
npm test

# Verificar imports rotos
npm run build

# Ver estado de Git
git status

# Ver qué cambió
git diff

# Ver estructura de archivos nuevos
tree src/config src/stores src/models -L 2

# Buscar TODOs pendientes
grep -r "TODO" src/

# Buscar console.logs que olvidaste
grep -r "console.log" src/

# Ver tamaño del bundle
npm run build && du -sh dist/
```

---

## 🎓 LECCIONES APRENDIDAS (Actualiza según avances)

**Crea: `docs/LECCIONES.md`**

```markdown
# LECCIONES APRENDIDAS

## ✅ QUÉ FUNCIONÓ BIEN
- [...]

## ❌ QUÉ NO FUNCIONÓ
- [...]

## 💡 TIPS DESCUBIERTOS
- [...]

## ⚠️ TRAMPAS A EVITAR
- [...]
```

---

## 🏁 CHECKLIST FINAL ANTES DE CADA COMMIT

```markdown
- [ ] El código compila sin errores (`npm run dev`)
- [ ] No hay console.logs olvidados
- [ ] Los imports son correctos
- [ ] No hay strings mágicos hardcodeados
- [ ] Uso constantes de config/ cuando debo
- [ ] El código tiene comentarios donde es necesario
- [ ] Actualicé docs/PROGRESO.md
- [ ] El mensaje de commit es descriptivo
```

---

## 🎯 RESUMEN: TU WORKFLOW IDEAL

```
1. Inicio del día:
   - Abrir docs/INSTRUCCIONES_WINDSURF.md
   - Revisar docs/PROGRESO.md
   - Prompt: "¿Cuál es la siguiente tarea?"

2. Para cada tarea:
   - Prompt específico con contexto claro
   - Windsurf genera código
   - Verificar con npm run dev / npm test
   - Commit si todo OK
   - Actualizar PROGRESO.md

3. Cada 2-3 tareas:
   - Break de 10 min
   - Push a GitHub
   - Revisar que todo compile

4. Fin del día:
   - Actualizar SPRINT_ACTUAL.md con notas
   - Commit de documentación
   - Push final
```

---

## 💎 REGLAS DE ORO

1. **Un commit = Una tarea completa y funcionando**
2. **Nunca continuar si hay errores**
3. **Documentar todo en PROGRESO.md**
4. **Verificar después de cada tarea**
5. **Push frecuente (cada 2-3 tareas)**
6. **Leer los errores completos antes de pedir ayuda**
7. **Usar los prompts de ejemplo como plantillas**
8. **Mantener SPRINT_ACTUAL.md actualizado**

---

## 🚀 ESTÁS LISTO

Con esta guía:
- ✅ Sabes cómo estructurar tus prompts
- ✅ Sabes cómo verificar el trabajo de Windsurf
- ✅ Tienes un workflow claro y repetible
- ✅ Sabes cómo manejar problemas
- ✅ Tienes plantillas listas para usar

**¡Adelante con la refactorización! Vas a tener éxito siguiendo este sistema.** 🎉