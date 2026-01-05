# 📋 Contexto del Proyecto para Agentes de IA

> **Última actualización**: Enero 2026  
> **Proyecto**: ICFES Analyzer  
> **Propósito**: Guía de contexto para agentes de IA que trabajen en este proyecto

---

## 🎯 Descripción General

**ICFES Analyzer** es una aplicación React 100% cliente-side que procesa archivos Excel con resultados de pruebas tipo ICFES (simulacros Saber 11) y genera dashboards interactivos + informes HTML exportables.

### Casos de Uso Principales

| Modo | Propósito | Archivo HTML Generado |
|------|-----------|----------------------|
| **Cohorte** | Analizar UNA prueba específica (ideal para resultados Saber 11 oficiales) | `informe_GRADO.html` |
| **Multi-Cohorte** | Comparar rendimiento del colegio a través de años (histórico) | `comparacion_multiannual.html` |
| **Longitudinal** | Seguimiento de un mismo grado a lo largo del tiempo (estudiantes, grupos, asignaturas) | `analisis_longitudinal_GRADO.html` |

---

## 📁 Arquitectura del Proyecto

```
src/
├── App.jsx                    # Punto de entrada principal
├── components/
│   ├── AnalysisModeSelector   # Selector de modo (Cohorte/Multi/Longitudinal)
│   ├── FileUploader           # Carga de Excel
│   ├── MetricsPanel           # Dashboard de métricas
│   ├── ChartsPanel            # Gráficos interactivos
│   ├── StudentsTable          # Tabla de estudiantes
│   ├── ExportButtons          # Botones de exportación
│   └── longitudinal/          # Componentes específicos para modo longitudinal
│       ├── LongitudinalUploader.jsx
│       ├── LongitudinalDashboard.jsx
│       ├── GradeEvolution.jsx
│       ├── GroupComparison.jsx
│       └── StudentEvolution.jsx
│
├── models/
│   ├── Analysis.js            # Modelo para análisis de UNA cohorte
│   ├── MultiYearAnalysis.js   # Modelo para comparación multi-año
│   └── LongitudinalAnalysis.js # Modelo para seguimiento longitudinal
│
├── utils/
│   ├── excelParser.js         # Parser de archivos Excel
│   ├── calculations.js        # Cálculos estadísticos
│   ├── chartConfig.js         # Configuración de colores/áreas
│   ├── htmlExporter.js        # Exportador HTML (Cohorte + Multi-Cohorte)
│   └── longitudinalHtmlExporter.js # Exportador HTML (Longitudinal)
│
└── reports/
    └── html/
        ├── HTMLReportGenerator.js
        ├── htmlCore.js
        ├── htmlInteractivity.js
        └── htmlSections/      # Secciones modulares para Cohorte
```

---

## 🔄 Flujo de Datos

```
Excel → excelParser.js → Analysis Model → React Components → HTML Exporter
                              ↓
                    [Cálculos estadísticos]
                              ↓
                    Dashboard interactivo + Exportación HTML
```

### Formato de Excel Esperado

Columnas obligatorias:
- `Código` - Identificador único del estudiante
- `Nombre`, `Apellido` - Datos del estudiante
- `Grupo` - Grado/Curso (ej: "11-1", "10A")
- `¿PIAR?` - Indica si tiene PIAR ("Sí"/"No")
- `Lectura crítica`, `Matemáticas`, `Sociales`, `Naturales`, `Inglés` - Puntajes por área (0-100)
- `Global` - Puntaje global

---

## 🧩 Convenciones de Código

### Exportadores HTML

Los archivos HTML exportados son **Single Page Apps autocontenidas**:
- Usan React, Chart.js y TailwindCSS desde CDN
- Los datos se embeben como JSON en un `<script>`
- Funcionan 100% offline una vez descargados

### Colores y Áreas

Definidos en `src/utils/chartConfig.js`:
```javascript
export const AREA_NAMES = {
  lc: 'Lectura Crítica',
  ma: 'Matemáticas',
  sc: 'Sociales',
  cn: 'Naturales',
  in: 'Inglés'
};

export const COLORS = {
  areas: { lc: '#ef4444', ma: '#3b82f6', ... },
  pruebas: ['#6366f1', '#8b5cf6', ...],
  groups: ['#10b981', '#f59e0b', ...]
};
```

### Patrón de Toggle PIAR

Muchos gráficos tienen un botón "Ver impacto PIAR" que muestra/oculta barras de comparación gris indicando los promedios incluyendo estudiantes PIAR.

---

## ⚠️ Notas Importantes para Agentes

1. **Los HTML exportados deben ser autocontenidos** - No pueden depender de archivos externos

2. **El proyecto usa Chart.js 4.x** - Sintaxis específica para datasets y opciones

3. **Los datos personales de estudiantes están embebidos en el HTML** - Por eso se descarga localmente y no se sube a ningún servidor

4. **El modo longitudinal trabaja con MÚLTIPLES pruebas** - A diferencia del modo cohorte que es UNA prueba

5. **El README.md está desactualizado** - Solo describe el modo Cohorte original

---

## 🛠️ Comandos Útiles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Previsualizar build
```

---

## 📊 Pruebas e Informes

### Modo Cohorte
- Input: 1 archivo Excel con resultados de UNA prueba
- Output: Dashboard + HTML con análisis detallado

### Modo Multi-Cohorte
- Input: Múltiples archivos Excel de diferentes años
- Output: Comparación histórica del colegio

### Modo Longitudinal
- Input: Múltiples archivos Excel del MISMO grado en diferentes fechas
- Output: Seguimiento de evolución por estudiante/grupo/asignatura
