# Guía de configuración: Imágenes y plantilla Excel

## Fecha: 10 de octubre de 2025

## 1. Configurar el link de Google Drive para la plantilla

### Ubicación en el código:
**Archivo:** `src/components/FileUploader.jsx`  
**Línea aproximada:** 18-20

```javascript
const handleDownloadTemplate = () => {
  // Abrir link de Google Drive (reemplazar con tu URL real)
  window.open('TU_LINK_DE_GOOGLE_DRIVE_AQUI', '_blank');
};
```

### Pasos para configurar:

1. **Sube tu archivo Excel a Google Drive**
   - Ve a Google Drive (drive.google.com)
   - Sube tu archivo `plantilla_icfes.xlsx`

2. **Obtén el link de descarga directa**
   - Haz clic derecho en el archivo → "Compartir"
   - Cambia los permisos a "Cualquier persona con el enlace"
   - Copia el link
   - El link debe tener este formato:
     ```
     https://drive.google.com/file/d/[ID_DEL_ARCHIVO]/view
     ```
   - Para descarga directa, cámbialo a:
     ```
     https://drive.google.com/uc?export=download&id=[ID_DEL_ARCHIVO]
     ```

3. **Reemplaza en el código**
   ```javascript
   const handleDownloadTemplate = () => {
     window.open('https://drive.google.com/uc?export=download&id=TU_ID_AQUI', '_blank');
   };
   ```

### Ejemplo completo:
```javascript
const handleDownloadTemplate = () => {
  window.open('https://drive.google.com/uc?export=download&id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456', '_blank');
};
```

---

## 2. Agregar imágenes de ejemplo

### 📁 Ubicación de las imágenes:
**Carpeta:** `public/`

Debes colocar dos imágenes en la carpeta `public/` del proyecto:

```
icfes-analyzer/
  public/
    columnas-excel.png         ← Imagen 1: Muestra las columnas
    ejemplo-datos-excel.png    ← Imagen 2: Muestra datos llenados
    vite.svg
```

### 🖼️ Imagen 1: `columnas-excel.png`

**Descripción:**
- Captura de pantalla de las columnas del Excel
- Debe mostrar los encabezados (primera fila)
- Los campos obligatorios deben tener fondo amarillo
- Campos opcionales sin fondo de color

**Contenido a capturar:**
```
┌──────────┬──────────┬───────┬────────┬─────────────────┬─────────────┬──────────┬───────────┬────────┬────────┬───────────────────────────┬────────────────────────┬─────────────────────┬──────────────────────┬───────────────────┐
│ Nombre   │ Apellido │ Grupo │ ¿PIAR? │ Lectura crítica │ Matemáticas │ Sociales │ Naturales │ Inglés │ Global │ Percentil Lectura crítica │ Percentil Matemáticas  │ Percentil Sociales  │ Percentil Naturales  │ Percentil Inglés  │
│ (amarillo)│(amarillo)│(amar.)│(amar.) │   (amarillo)    │ (amarillo)  │(amarillo)│(amarillo) │(amar.) │(amar.) │      (sin color)          │     (sin color)        │    (sin color)      │     (sin color)      │   (sin color)     │
└──────────┴──────────┴───────┴────────┴─────────────────┴─────────────┴──────────┴───────────┴────────┴────────┴───────────────────────────┴────────────────────────┴─────────────────────┴──────────────────────┴───────────────────┘
```

**Dimensiones recomendadas:**
- Ancho: 1200-1400 px
- Alto: 100-150 px
- Formato: PNG con fondo blanco
- Calidad: Alta resolución

### 🖼️ Imagen 2: `ejemplo-datos-excel.png`

**Descripción:**
- Captura de pantalla de las primeras 3-5 filas con datos de ejemplo
- Debe incluir los encabezados (primera fila)
- Debe mostrar cómo se llenan los datos correctamente
- Debe ser fácil de leer

**Contenido a capturar:**
```
┌──────────┬──────────┬───────┬────────┬─────────────────┬─────────────┬──────────┬───────────┬────────┬────────┬───────────────────────────┬────────────────────────┬─────────────────────┬──────────────────────┬───────────────────┐
│ Nombre   │ Apellido │ Grupo │ ¿PIAR? │ Lectura crítica │ Matemáticas │ Sociales │ Naturales │ Inglés │ Global │ Percentil Lectura crítica │ Percentil Matemáticas  │ Percentil Sociales  │ Percentil Naturales  │ Percentil Inglés  │
├──────────┼──────────┼───────┼────────┼─────────────────┼─────────────┼──────────┼───────────┼────────┼────────┼───────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────┼───────────────────┤
│ Juan     │ Pérez    │ 11A   │        │       65        │     70      │    68    │    72     │   60   │  335   │            75             │           80           │         78          │          82          │        70         │
├──────────┼──────────┼───────┼────────┼─────────────────┼─────────────┼──────────┼───────────┼────────┼────────┼───────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────┼───────────────────┤
│ María    │ González │ 11A   │  Sí    │       58        │     62      │    60    │    65     │   55   │  300   │            60             │           65           │         63          │          68          │        58         │
├──────────┼──────────┼───────┼────────┼─────────────────┼─────────────┼──────────┼───────────┼────────┼────────┼───────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────┼───────────────────┤
│ Carlos   │ Rodríguez│ 11B   │        │       72        │     75      │    70    │    78     │   68   │  363   │            85             │           88           │         82          │          90          │        80         │
└──────────┴──────────┴───────┴────────┴─────────────────┴─────────────┴──────────┴───────────┴────────┴────────┴───────────────────────────┴────────────────────────┴─────────────────────┴──────────────────────┴───────────────────┘
```

**Dimensiones recomendadas:**
- Ancho: 1200-1400 px
- Alto: 200-300 px
- Formato: PNG con fondo blanco
- Calidad: Alta resolución

---

## 3. Cómo capturar las imágenes

### Opción A: Desde Excel/Google Sheets

1. Abre tu plantilla Excel
2. Ajusta el zoom para que se vea bien
3. Usa la herramienta de captura de pantalla:
   - **Windows:** `Windows + Shift + S`
   - **Mac:** `Command + Shift + 4`
4. Selecciona el área que quieres capturar
5. Guarda la imagen con el nombre correcto

### Opción B: Crear las imágenes programáticamente

Si prefieres no usar capturas de pantalla, puedes:
- Usar herramientas de diseño (Figma, Canva, etc.)
- Crear tablas HTML y capturarlas
- Usar bibliotecas de generación de imágenes

---

## 4. Verificar que las imágenes funcionen

### Prueba local:

1. Coloca las imágenes en la carpeta `public/`
2. Inicia el servidor de desarrollo: `npm run dev`
3. Abre la aplicación en el navegador
4. Verifica que las imágenes se muestren correctamente

### Si las imágenes no se muestran:

El código tiene un fallback automático que muestra texto en lugar de la imagen:

```jsx
<img 
  src="/columnas-excel.png" 
  alt="Columnas requeridas en Excel" 
  className="w-full rounded border border-gray-300"
  onError={(e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'block';
  }}
/>
<div style={{display: 'none'}} className="...">
  {/* Texto alternativo cuando la imagen no existe */}
</div>
```

Esto significa que la aplicación seguirá funcionando aunque las imágenes no estén disponibles.

---

## 5. Ubicación en el código donde se usan las imágenes

**Archivo:** `src/components/FileUploader.jsx`  
**Líneas aproximadas:** 85-120

### Imagen de columnas:
```jsx
<img 
  src="/columnas-excel.png" 
  alt="Columnas requeridas en Excel" 
  className="w-full rounded border border-gray-300"
/>
```

### Imagen de datos de ejemplo:
```jsx
<img 
  src="/ejemplo-datos-excel.png" 
  alt="Ejemplo de datos en Excel" 
  className="w-full rounded border border-gray-300"
/>
```

---

## 6. Checklist de configuración

### ✅ Configuración del link de Google Drive:
- [ ] Subir archivo Excel a Google Drive
- [ ] Configurar permisos públicos
- [ ] Obtener link de descarga directa
- [ ] Reemplazar en `FileUploader.jsx` línea 18-20
- [ ] Probar que el link funcione

### ✅ Imágenes:
- [ ] Crear/capturar imagen `columnas-excel.png`
- [ ] Crear/capturar imagen `ejemplo-datos-excel.png`
- [ ] Colocar ambas imágenes en la carpeta `public/`
- [ ] Verificar que se vean en la aplicación
- [ ] Optimizar tamaño si es necesario (< 500 KB cada una)

### ✅ Pruebas:
- [ ] Botón "Descargar plantilla" funciona
- [ ] Imagen de columnas se muestra correctamente
- [ ] Imagen de ejemplo se muestra correctamente
- [ ] Texto alternativo aparece si faltan imágenes
- [ ] La aplicación funciona en móvil

---

## 7. Resultado final esperado

Al abrir la aplicación, los usuarios verán:

1. **Banner principal**: "Analiza los resultados ICFES de tu colegio"
2. **Zona de carga**: Botón para seleccionar archivo Excel (ARRIBA)
3. **Instrucciones**: Panel con 3 pasos:
   - Paso 1: Botón para descargar plantilla (abre Google Drive)
   - Paso 2: Dos imágenes mostrando cómo debe ser el Excel
   - Paso 3: Advertencia sobre no agregar datos extra

---

## 8. Notas adicionales

### Alternativas si no quieres usar imágenes:

Si prefieres no agregar las imágenes, puedes:
1. Eliminar los bloques `<img>` del código
2. El texto alternativo se mostrará automáticamente
3. O simplemente dejar que se muestre el texto cuando no haya imagen

### Optimización de imágenes:

Para reducir el tamaño de las imágenes:
- Usa herramientas como TinyPNG o Squoosh
- Formato PNG con compresión
- Objetivo: < 200 KB por imagen

### Actualización futura:

Si en el futuro quieres cambiar las imágenes:
1. Reemplaza los archivos en `public/`
2. Mantén los mismos nombres
3. No necesitas modificar el código
