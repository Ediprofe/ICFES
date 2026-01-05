# Test de Branding en Reportes HTML

## Checklist de Verificación

### ✅ Elementos Visuales

- [ ] **Header aparece correctamente**
  - Logo/nombre "ediprofe.com" visible
  - Tagline "Guía Educativa para Ciencias y Matemáticas"
  - Descripción del servicio
  - Iconos de redes sociales (YouTube, TikTok, Web)
  - Gradiente azul-índigo de fondo

- [ ] **Barra de información del reporte**
  - Icono de documento
  - Texto "Reporte Académico ICFES"
  - Año del análisis
  - Crédito "Generado con tecnología ediprofe.com"

- [ ] **Footer completo**
  - Información de la marca
  - Cards de redes sociales con iconos
  - Enlaces funcionando correctamente
  - Copyright y fecha de generación
  - Frase inspiradora

### ✅ Interactividad

- [ ] **Enlaces funcionan**
  - Click en "ediprofe.com" del header abre sitio web
  - Click en YouTube abre canal @ProfeEdi
  - Click en TikTok abre perfil @ediprofe
  - Click en Web del footer abre ediprofe.com

- [ ] **Efectos hover**
  - Header: cambio de color en hover
  - Cards de redes sociales: scale y brillo
  - Flechas en cards se mueven al hover

### ✅ Responsive Design

- [ ] **Desktop (>768px)**
  - Grid de 2 columnas en footer
  - Header horizontal
  - Espaciado correcto

- [ ] **Mobile (<768px)**
  - Grid de 1 columna en footer
  - Header apilado verticalmente
  - Iconos centrados

### ✅ Impresión/PDF

- [ ] **Al imprimir (Ctrl/Cmd + P)**
  - Marca de agua "ediprofe.com" visible en diagonal
  - Header simplificado (sin iconos)
  - Footer simplificado
  - Colores preservados
  - Botón "Exportar a PDF" oculto

### ✅ Contenido

- [ ] **Textos correctos**
  - URLs correctas (ediprofe.com, YouTube, TikTok)
  - Tagline correcto
  - Descripción completa del servicio
  - Año dinámico en copyright

## Pasos para Probar

### 1. Generar Reporte HTML
1. Abrir la aplicación en el navegador
2. Cargar un archivo Excel de prueba
3. Hacer click en "Exportar HTML"
4. Abrir el archivo HTML generado

### 2. Verificar Header
- Scroll al inicio del documento
- Verificar que todos los elementos están presentes
- Probar hover en iconos de redes sociales
- Hacer click en cada enlace

### 3. Verificar Footer
- Scroll al final del documento
- Verificar grid de 2 columnas
- Probar hover en cards de redes sociales
- Verificar fecha de generación

### 4. Probar Responsive
- Redimensionar ventana del navegador
- Verificar que el diseño se adapta
- Probar en móvil si es posible

### 5. Probar Impresión
- Abrir vista previa de impresión (Ctrl/Cmd + P)
- Verificar marca de agua
- Verificar que header y footer están simplificados
- Verificar que colores se mantienen

## Resultados Esperados

### Header
```
┌─────────────────────────────────────────────────────┐
│ [Azul-Índigo]                                       │
│ ediprofe.com                    [YT] [TT] [Web]    │
│ Guía Educativa para Ciencias y Matemáticas         │
│ Explora lecciones estructuradas...                 │
└─────────────────────────────────────────────────────┘
```

### Footer
```
┌─────────────────────────────────────────────────────┐
│ [Azul-Índigo-Púrpura]                               │
│                                                      │
│ ediprofe.com          🌐 Síguenos                   │
│ Guía Educativa...     [YouTube Card]                │
│                       [TikTok Card]                 │
│ Herramienta...        [Web Card]                    │
│                                                      │
│ © 2025 ediprofe.com                                 │
│ Reporte generado el...                              │
│ "Simplificando el aprendizaje..."                   │
└─────────────────────────────────────────────────────┘
```

## Problemas Comunes y Soluciones

### Problema: Iconos no se ven
**Solución**: Verificar conexión a internet (Tailwind CSS se carga desde CDN)

### Problema: Colores no se ven en impresión
**Solución**: Verificar que el navegador permite imprimir colores de fondo

### Problema: Enlaces no funcionan
**Solución**: Verificar que las URLs en `visualConfig.js` son correctas

### Problema: Diseño roto en móvil
**Solución**: Verificar que Tailwind CSS se cargó correctamente

## Notas Adicionales

- El branding se aplica automáticamente a todos los reportes HTML
- No requiere configuración adicional por parte del usuario
- Los colores y URLs se pueden personalizar en `src/config/visualConfig.js`
- El diseño es responsive y se adapta a cualquier dispositivo
- La marca de agua en impresión es semi-transparente para no interferir con el contenido

## Métricas de Éxito

- ✅ Header visible y atractivo
- ✅ Footer completo con información de contacto
- ✅ Enlaces funcionando correctamente
- ✅ Diseño responsive
- ✅ Impresión con marca de agua
- ✅ Experiencia de usuario profesional

---

**Fecha de prueba**: _________________

**Probado por**: _________________

**Resultado**: ⭕ Aprobado / ❌ Requiere ajustes

**Comentarios**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
