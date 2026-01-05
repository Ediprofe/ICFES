# Guía de Exportación a PDF

## 📄 Resumen
Los reportes HTML están optimizados para exportarse a PDF con excelente calidad y control sobre saltos de página.

## 🎯 Métodos de Exportación

### Método 1: Imprimir desde el Navegador (Recomendado)
1. Abre el reporte HTML en tu navegador
2. Presiona `Ctrl+P` (Windows/Linux) o `Cmd+P` (Mac)
3. Selecciona "Guardar como PDF" como destino
4. Ajusta configuración:
   - **Orientación**: Horizontal (Landscape) - ✅ **AUTOMÁTICO**
   - **Tamaño**: A4
   - **Márgenes**: Predeterminados
   - **Gráficos de fondo**: ✅ Activado (importante)
   - **Encabezados y pies**: ❌ Desactivado
5. Haz clic en "Guardar"

**Nota**: La orientación horizontal está configurada automáticamente en el CSS para optimizar presentaciones.

### Método 2: Navegadores Específicos

#### Google Chrome / Edge
- Mejor soporte para colores y gráficos
- Opción "Más configuraciones" → "Gráficos de fondo" ✅
- Escala: 100% (default)

#### Firefox
- Buena calidad general
- "Imprimir fondos" debe estar activado
- Puede requerir ajuste de escala

#### Safari
- Excelente para macOS
- "Imprimir fondos" en configuración avanzada

## 🎨 Características de Exportación

### Control de Saltos de Página
El sistema implementa control automático de saltos:

```css
/* Clases disponibles */
.page-break         /* Forzar salto ANTES del elemento */
.page-break-after   /* Forzar salto DESPUÉS del elemento */
.avoid-break        /* Evitar cortar el elemento */
```

### Elementos Optimizados

#### ✅ Se Exportan Correctamente
- ✅ Todos los gráficos (Chart.js)
- ✅ Tablas completas con encabezados repetidos
- ✅ Colores de fondo y gradientes
- ✅ Badges y etiquetas de colores
- ✅ Marca de agua "ediprofe.com"
- ✅ Sombras sutiles
- ✅ Bordes y estilos

#### ❌ Se Ocultan Automáticamente
- ❌ Botones interactivos
- ❌ Controles de filtros (clase `.no-print`)
- ❌ Elementos de navegación
- ❌ Tooltips y overlays
- ❌ Iconos SVG decorativos

### Ajustes Automáticos en PDF

#### Espaciado
- Márgenes reducidos para aprovechar espacio
- Padding optimizado (más compacto)
- Secciones con separación visual clara

#### Tipografía
- Fuentes escaladas apropiadamente:
  - Body: 10pt
  - H1: 18pt
  - H2: 16pt
  - H3: 14pt
  - H4: 12pt
  - Tablas: 9pt

#### Tablas
- Encabezados se repiten en cada página
- Filas no se cortan a la mitad
- Ancho optimizado para A4
- Padding reducido para más contenido

#### Gráficos
- Tamaño ajustado automáticamente
- No se cortan entre páginas
- Colores preservados
- Etiquetas legibles

## 🔧 Configuración Técnica

### @page CSS
```css
@page {
  size: A4 landscape;    /* Horizontal para presentaciones */
  margin: 1cm 1.5cm;     /* Márgenes optimizados */
}
```

### Preservación de Colores
```css
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
```

### Control de Cortes
```css
/* Evitar cortar elementos importantes */
.bg-white, .rounded-lg, .shadow-lg {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Tablas */
thead { display: table-header-group; }
tr { page-break-inside: avoid; }
```

## 💡 Mejores Prácticas

### Para Usuarios

1. **Usa Chrome o Edge** para mejor calidad
2. **Activa "Gráficos de fondo"** siempre
3. **Mantén escala al 100%** para mejor legibilidad
4. **Revisa vista previa** antes de guardar
5. **Desactiva encabezados/pies** del navegador

### Para Desarrolladores

#### Agregar Salto de Página Manual
```html
<!-- Forzar nueva página antes de esta sección -->
<div class="page-break">
  <h2>Nueva Sección</h2>
</div>
```

#### Evitar Corte de Elemento
```html
<!-- Este elemento no se cortará -->
<div class="avoid-break">
  <h3>Título</h3>
  <p>Contenido importante...</p>
</div>
```

#### Ocultar en Impresión
```html
<!-- No aparecerá en PDF -->
<button class="no-print">
  Exportar
</button>
```

#### Sección Grande con Subsecciones
```html
<div class="large-section">
  <!-- Puede cortarse entre páginas -->
  <div class="avoid-break">
    <!-- Pero cada subsección no se corta -->
    <h3>Subsección 1</h3>
    <p>Contenido...</p>
  </div>
  <div class="avoid-break">
    <h3>Subsección 2</h3>
    <p>Contenido...</p>
  </div>
</div>
```

## 🎯 Casos de Uso Específicos

### Reporte de Un Solo Año
- ~5-8 páginas típicamente
- Todos los gráficos se exportan correctamente
- Tabla de estudiantes puede ser larga (usa paginación)

### Reporte Multianual
- ~10-20 páginas dependiendo de años
- Gráficos de comparación optimizados
- Tablas con encabezados repetidos
- Secciones bien separadas

### Tabla de Estudiantes Larga
- ✅ **Se exporta COMPLETA automáticamente** si está visible
- ✅ Encabezados se repiten en cada página
- ✅ Filas no se cortan a la mitad
- ✅ Formato compacto optimizado para horizontal
- ✅ Controles de paginación se ocultan automáticamente
- ⚡ Si la tabla está colapsada (oculta), NO se exporta
- 💡 Tip: Despliega la tabla antes de imprimir para incluirla en el PDF

## 🐛 Solución de Problemas

### Los colores no se ven
**Solución**: Activa "Gráficos de fondo" en configuración de impresión

### Gráficos se cortan
**Solución**: Los gráficos tienen `page-break-inside: avoid` automático. Si persiste, reduce zoom del navegador antes de imprimir.

### Tablas muy anchas
**Solución**: Las tablas se ajustan automáticamente. Si es necesario, considera exportar en orientación horizontal (Landscape).

### Marca de agua muy visible
**Solución**: La marca de agua tiene opacidad 5% (casi invisible). Si necesitas cambiarla, edita `htmlCore.js` línea 110.

### Saltos de página en lugares incorrectos
**Solución**: Agrega clase `avoid-break` al elemento que no debe cortarse.

## 📊 Calidad Esperada

### Excelente ✅
- Gráficos de barras
- Gráficos de líneas
- Tablas de datos
- Badges y etiquetas
- Gradientes de fondo
- Textos y títulos

### Buena ⚠️
- Gráficos muy complejos (pueden tardar)
- Tablas muy anchas (pueden requerir landscape)
- Sombras (se simplifican)

### Limitada ❌
- Animaciones (no se exportan)
- Interactividad (tooltips, hover)
- Videos o contenido dinámico

## 🚀 Alternativas Avanzadas

### Para Control Total
Si necesitas control absoluto sobre el PDF, considera:

1. **Puppeteer** (Node.js)
```javascript
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('file:///path/to/report.html');
await page.pdf({
  path: 'report.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '1.5cm', bottom: '1cm', left: '1cm', right: '1cm' }
});
```

2. **wkhtmltopdf** (CLI)
```bash
wkhtmltopdf --enable-local-file-access \
            --print-media-type \
            report.html report.pdf
```

3. **Playwright** (Node.js)
```javascript
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///path/to/report.html');
await page.pdf({ path: 'report.pdf', format: 'A4' });
```

## 📝 Notas Finales

- Los estilos de impresión están en `/src/reports/html/htmlCore.js`
- Todos los reportes usan la misma configuración base
- Los ajustes son automáticos, no requieren configuración manual
- La marca de agua "ediprofe.com" es parte del branding

## 🔗 Referencias

- [MDN: @page](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)
- [MDN: page-break](https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-inside)
- [Chrome Print CSS](https://developers.google.com/web/fundamentals/printing)
