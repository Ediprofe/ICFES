# 🎯 ICFES Analyzer

Aplicación React 100% cliente-side para procesar archivos Excel con resultados académicos y generar dashboards interactivos + informes PDF.

## 📋 Stack Tecnológico

- **Framework**: React 18+ con Vite
- **Excel**: xlsx (SheetJS)
- **PDF**: jspdf + jspdf-autotable
- **Charts**: recharts
- **Styling**: Tailwind CSS
- **Icons**: lucide-react

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Desarrollo

```bash
# Instalar dependencias (ya instaladas)
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173/
```

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── FileUploader.jsx          # Subir archivos Excel
│   ├── StudentsTable.jsx         # Tabla ordenada de estudiantes
│   ├── ChartsPanel.jsx           # Gráficos dinámicos
│   ├── MetricsPanel.jsx          # Métricas calculadas
│   ├── FilterControls.jsx        # Filtros interactivos
│   └── PDFGenerator.jsx          # Exportación a PDF
├── utils/
│   ├── excelParser.js            # Leer y validar Excel
│   ├── calculations.js           # Cálculos estadísticos
│   ├── percentiles.js            # Método Hazen
│   └── pdfBuilder.js             # Generador de PDF multipágina
├── App.jsx                       # Componente principal
└── main.jsx                      # Punto de entrada
```

## 📊 Formato del Archivo Excel

El archivo Excel debe contener las siguientes columnas obligatorias:

- `¿PIAR?` - Indica si el estudiante tiene PIAR (Sí/No)
- `Grupo` - Grado o grupo del estudiante
- `Nombre` - Nombre completo del estudiante
- `Lectura crítica` - Puntaje en Lectura crítica
- `Matemáticas` - Puntaje en Matemáticas
- `Sociales` - Puntaje en Sociales y ciudadanas
- `Naturales` - Puntaje en Ciencias naturales
- `Inglés` - Puntaje en Inglés
- `Global` - Puntaje global

**Formato soportado**: `.xlsx`, `.xlsm`

## ✨ Características

### 📈 Análisis Estadístico
- Cálculo de percentiles usando el método Hazen
- Promedio y desviación estándar por área
- Identificación de outliers (±3σ)
- Z-scores para desempeño excepcional

### 🎯 Visualizaciones
- Gráficos de barras por área
- Comparación de desviación estándar
- Tablas ordenables y filtradas

### 🔍 Filtros Interactivos
- Excluir estudiantes con PIAR
- Filtrar por grado
- Rango de puntajes (mínimo/máximo)

### 📊 Métricas Destacadas
- Top 5 estudiantes por área
- Top 3 estudiantes por grado
- Estudiantes con desempeño excepcional
- Métricas globales del grupo

### 📄 Exportación a PDF
El PDF generado incluye:
1. **Portada** con fecha y total de estudiantes
2. **Listado completo** ordenado por puntaje global
3. **Métricas por área** (promedio, desviación)
4. **Top 5 por área**
5. **Top 3 por grado**
6. **Outliers** con Z-scores

## 🎨 Interfaz de Usuario

- Diseño responsive (móvil, tablet, desktop)
- Tema moderno con Tailwind CSS
- Iconos intuitivos con Lucide React
- Experiencia de usuario fluida

## 🧮 Cálculos Implementados

### Percentiles (Método Hazen)
```javascript
percentil = ((rango - 0.5) / n) × 100
```

### Desviación Estándar
```javascript
σ = √(Σ(xi - μ)² / n)
```

### Z-Score
```javascript
z = (x - μ) / σ
```

### Outliers
Estudiantes con |z| ≥ 3σ

## 📝 Uso de la Aplicación

1. **Cargar archivo**: Haz clic en "Seleccionar archivo Excel" y elige tu archivo `.xlsx` o `.xlsm`
2. **Explorar datos**: La aplicación procesará automáticamente el archivo y mostrará todas las métricas
3. **Aplicar filtros**: Usa los controles de filtro para refinar los datos visualizados
4. **Descargar PDF**: Haz clic en el botón flotante "Descargar PDF" para generar el informe completo

## ✅ Checklist de Funcionalidades

- [x] Carga y valida Excel correctamente
- [x] Calcula percentiles con método Hazen
- [x] Muestra tabla ordenada por Global (mayor a menor)
- [x] Filtros funcionales (PIAR, grado, rango)
- [x] Gráficos se actualizan con filtros
- [x] Métricas correctas (promedio, SD, percentiles)
- [x] Top 5 por área funcional
- [x] Top 3 por grado funcional
- [x] Outliers ±3σ detectados
- [x] PDF multipágina genera correctamente
- [x] Diseño responsive
- [x] Sin errores en consola

## 🐛 Solución de Problemas

### El archivo no se carga
- Verifica que el archivo tenga todas las columnas obligatorias
- Asegúrate de que el formato sea `.xlsx` o `.xlsm`
- Revisa que los datos numéricos no contengan texto

### Los gráficos no se muestran
- Verifica que haya datos después de aplicar filtros
- Asegúrate de que los puntajes sean numéricos

### El PDF no se genera
- Verifica que haya datos cargados
- Revisa la consola del navegador para errores

## 📚 Recursos

- [SheetJS Documentation](https://docs.sheetjs.com/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/)

## 🚀 Deploy

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Subir la carpeta dist/
```

### GitHub Pages
```bash
npm run build
# Configurar GitHub Pages para usar la carpeta dist/
```

---

**¡Listo para analizar tus resultados ICFES!** 🎓📊
