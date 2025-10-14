# 📊 Guía de Uso - Análisis Multi-Año

## 🎯 Descripción General

El sistema ICFES Analyzer permite realizar análisis comparativos de múltiples años de manera sencilla. Los archivos **NO necesitan** tener una columna "Año" - el sistema te pedirá que etiquetes cada archivo al cargarlo.

---

## 📁 Formato de Archivos

### Columnas Requeridas

Los archivos Excel deben contener las siguientes columnas **obligatorias**:

- `¿PIAR?` - Indica si el estudiante tiene PIAR (Sí/No)
- `Grupo` - Grado del estudiante (ej: 11°1, 11°2)
- `Nombre` - Nombre del estudiante
- `Apellido` - Apellido del estudiante
- `Lectura crítica` - Puntaje en Lectura crítica
- `Matemáticas` - Puntaje en Matemáticas
- `Sociales` - Puntaje en Sociales
- `Naturales` - Puntaje en Naturales
- `Global` - Puntaje global

### Columnas Opcionales

Estas columnas son opcionales y el sistema las manejará correctamente si están vacías o ausentes:

- `Año` - Año de los datos (si no existe, se usa etiqueta manual)
- `Inglés` - Puntaje en Inglés (puede estar vacío para algunos estudiantes/años)
- `Percentil Lectura crítica` - Percentil de Lectura
- `Percentil Matemáticas` - Percentil de Matemáticas
- `Percentil Sociales` - Percentil de Sociales
- `Percentil Naturales` - Percentil de Naturales
- `Percentil Inglés` - Percentil de Inglés
- `Componente` - Componente evaluado
- `Competencia` - Competencia evaluada
- `% Acierto` - Porcentaje de acierto

**Nota importante sobre Inglés:**
- Es normal que algunos años tengan datos de Inglés vacíos
- Esto puede ocurrir especialmente para estudiantes con PIAR
- El sistema calculará las métricas de Inglés **solo con los estudiantes que tengan datos**
- Si ningún estudiante tiene datos de Inglés, esa área se omitirá en los análisis

### Ejemplo de Archivos

```
docs/
├── SJ2024.xlsx  (Datos del año 2024)
└── SJ2025.xlsx  (Datos del año 2025)
```

**Nota:** El nombre del archivo puede contener el año (ej: SJ2024.xlsx) y el sistema lo detectará automáticamente, pero puedes cambiarlo si es necesario.

---

## 🚀 Flujo de Trabajo

### 1️⃣ Cargar Archivo Principal

1. Arrastra o selecciona tu primer archivo Excel
2. El sistema mostrará un diálogo pidiendo la **etiqueta de año**
3. Si el nombre del archivo contiene un año (ej: SJ2024.xlsx), se pre-llenará automáticamente
4. Confirma o modifica el año según corresponda
5. Haz clic en "Confirmar"

**Ejemplo:**
```
Archivo: SJ2024.xlsx
Año detectado: 2024
→ Confirmar o cambiar a otro año
```

### 2️⃣ Activar Modo Comparativo (Opcional)

Después de cargar el primer archivo, el sistema preguntará:

```
¿Análisis Comparativo?
¿Deseas cargar datos de años anteriores para realizar 
un análisis comparativo multi-año?

[Sí, cargar más años]  [No, continuar]
```

- **Sí, cargar más años**: Activa el modo comparativo
- **No, continuar**: Trabaja solo con el año cargado

### 3️⃣ Cargar Años Adicionales

Si activaste el modo comparativo:

1. Aparecerá un nuevo componente: **"Cargar Año Adicional para Comparación"**
2. Arrastra o selecciona otro archivo Excel
3. Ingresa la etiqueta de año correspondiente
4. El sistema validará que no sea un año duplicado
5. Repite el proceso para todos los años que desees comparar

**Ejemplo:**
```
Años cargados: 2024
Nuevo archivo: SJ2025.xlsx
Año detectado: 2025
→ Confirmar (no está duplicado)
Años cargados: 2024, 2025 ✓
```

### 4️⃣ Exportar Análisis

Una vez cargados todos los años:

1. El sistema mostrará un resumen con todos los años cargados
2. Haz clic en **"Exportar PDF"** o **"Exportar HTML"**
3. El informe incluirá:
   - Análisis individual de cada año
   - Gráficos comparativos multi-año
   - Tendencias y evolución
   - Regresión lineal

---

## 📋 Validaciones del Sistema

### Validación de Año

- Debe ser un número entre 1900 y 2100
- No puede estar duplicado
- Se puede modificar manualmente si la detección automática falla

### Validación de Archivo

- Formato: `.xlsx` o `.xls`
- Debe contener todas las columnas requeridas
- Debe tener al menos un estudiante válido

### Prevención de Duplicados

El sistema **NO permite** cargar el mismo año dos veces:

```
❌ Error: El año 2024 ya está cargado. 
   Por favor, selecciona otro año.
```

---

## 💡 Consejos y Mejores Prácticas

### Nombrado de Archivos

Incluye el año en el nombre del archivo para facilitar la detección automática:

✅ **Recomendado:**
- `SJ2024.xlsx`
- `ICFES_2025.xlsx`
- `Resultados-2023.xlsx`

❌ **No recomendado:**
- `datos.xlsx`
- `archivo1.xlsx`
- `resultados.xlsx`

### Orden de Carga

No importa el orden en que cargues los años. El sistema los organizará automáticamente en los gráficos y análisis.

### Años Faltantes

Si tienes datos de 2022, 2024 y 2025 (sin 2023), no hay problema. El sistema manejará correctamente los años no consecutivos.

---

## 🔄 Flujo Completo - Ejemplo

```
1. Usuario carga "SJ2024.xlsx"
   → Sistema detecta año: 2024
   → Usuario confirma
   → Datos cargados ✓

2. Sistema pregunta: ¿Análisis comparativo?
   → Usuario: "Sí, cargar más años"
   → Modo comparativo activado ✓

3. Usuario carga "SJ2025.xlsx"
   → Sistema detecta año: 2025
   → Usuario confirma
   → Validación: 2025 ≠ 2024 ✓
   → Datos cargados ✓

4. Usuario carga "SJ2023.xlsx"
   → Sistema detecta año: 2023
   → Usuario confirma
   → Validación: 2023 ≠ 2024, 2025 ✓
   → Datos cargados ✓

5. Años disponibles: 2023, 2024, 2025
   → Usuario exporta PDF/HTML
   → Informe comparativo generado ✓
```

---

## 🛠️ Solución de Problemas

### El año no se detecta automáticamente

**Solución:** Ingresa manualmente el año en el diálogo. El sistema aceptará cualquier valor entre 1900 y 2100.

### Error: "El año XXXX ya está cargado"

**Solución:** Verifica que no estés intentando cargar el mismo año dos veces. Revisa la lista de "Años cargados" en la interfaz.

### El archivo no carga

**Solución:** Verifica que:
1. El archivo sea `.xlsx` o `.xls`
2. Contenga todas las columnas requeridas
3. Tenga al menos un estudiante con datos válidos

---

## 📊 Características del Análisis Multi-Año

Cuando cargas múltiples años, obtienes:

### Gráficos Comparativos
- Evolución de promedios por área
- Tendencias por grado
- Comparación año a año

### Análisis Estadístico
- Regresión lineal
- Identificación de tendencias
- Proyecciones

### Exportación
- PDF con todos los años
- HTML interactivo con filtros por año
- Tablas comparativas

---

## 🎓 Ejemplo Práctico

**Escenario:** Colegio San José quiere comparar resultados de 2024 y 2025

**Paso 1:** Cargar SJ2024.xlsx
```
📁 Archivo: SJ2024.xlsx
📅 Año: 2024 (detectado automáticamente)
✅ Confirmado
```

**Paso 2:** Activar modo comparativo
```
❓ ¿Análisis Comparativo?
✅ Sí, cargar más años
```

**Paso 3:** Cargar SJ2025.xlsx
```
📁 Archivo: SJ2025.xlsx
📅 Año: 2025 (detectado automáticamente)
✅ Confirmado
📊 Años cargados: 2024, 2025
```

**Paso 4:** Exportar
```
📄 Exportar PDF → informe-icfes-2025-comparativo-2025-10-14.pdf
🌐 Exportar HTML → analisis-icfes-2025-comparativo-2025-10-14.html
```

---

## ✅ Checklist de Uso

- [ ] Archivos tienen todas las columnas requeridas
- [ ] Nombres de archivos incluyen el año (recomendado)
- [ ] Primer archivo cargado correctamente
- [ ] Año etiquetado correctamente
- [ ] Modo comparativo activado (si se desea)
- [ ] Años adicionales cargados sin duplicados
- [ ] Exportación realizada exitosamente

---

## 📞 Soporte

Para más información o problemas, contacta a:
- **YouTube:** @ProfeEdi
- **TikTok:** @ediprofe
- **Web:** ediprofe.com

---

**Última actualización:** 14 de octubre de 2025
