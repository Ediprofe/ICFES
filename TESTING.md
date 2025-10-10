# 📝 Guía de Testing - ICFES Analyzer

## Datos de Prueba

Para probar la aplicación, puedes crear un archivo Excel con el siguiente formato:

### Columnas Requeridas

| ¿PIAR? | Grupo | Nombre | Lectura crítica | Matemáticas | Sociales | Naturales | Inglés | Global |
|--------|-------|--------|-----------------|-------------|----------|-----------|--------|--------|
| No | 11A | Juan Pérez | 65 | 70 | 68 | 72 | 75 | 350 |
| No | 11A | María González | 80 | 85 | 82 | 88 | 90 | 425 |
| Sí | 11B | Carlos López | 45 | 50 | 48 | 52 | 55 | 250 |
| No | 11B | Ana Martínez | 75 | 78 | 76 | 80 | 82 | 391 |
| No | 11A | Luis Rodríguez | 90 | 92 | 88 | 95 | 98 | 463 |

### Notas Importantes:

1. **Columna ¿PIAR?**: Debe contener "Sí" o "No"
2. **Columna Grupo**: Identificador del grado (11A, 11B, etc.)
3. **Columna Nombre**: Nombre completo del estudiante
4. **Columnas de Puntajes**: Valores numéricos entre 0 y 100
5. **Columna Global**: Suma de todos los puntajes

### Características a Probar:

#### ✅ Carga de Archivo
- Arrastra y suelta un archivo `.xlsx` o `.xlsm`
- Verifica que aparezca el mensaje de error si faltan columnas
- Verifica que se carguen todos los estudiantes correctamente

#### ✅ Tabla de Estudiantes
- Verifica que los estudiantes aparezcan ordenados por Global (mayor a menor)
- Verifica que todas las columnas se muestren correctamente
- Verifica que los números tengan 2 decimales

#### ✅ Filtros
- **Excluir PIAR**: Activa el checkbox y verifica que los estudiantes con PIAR desaparezcan
- **Filtro por Grado**: Selecciona un grado y verifica que solo aparezcan estudiantes de ese grado
- **Rango de Puntajes**: Ajusta los valores mínimo y máximo y verifica el filtrado

#### ✅ Métricas
- Verifica que el **Promedio Global** sea correcto
- Verifica que el **Total de Estudiantes** coincida con los datos
- Verifica que los **Estudiantes Excepcionales** (outliers ±3σ) se identifiquen correctamente

#### ✅ Gráficos
- Verifica que aparezcan los gráficos de **Promedios por Área**
- Verifica que aparezcan los gráficos de **Desviación Estándar**
- Verifica que los gráficos se actualicen al aplicar filtros

#### ✅ Top 5 por Área
- Verifica que aparezcan los 5 mejores estudiantes por cada área
- Verifica que estén ordenados de mayor a menor

#### ✅ Top 3 por Grado
- Verifica que aparezcan los 3 mejores estudiantes por cada grado
- Verifica que estén ordenados de mayor a menor

#### ✅ Exportación a PDF
- Haz clic en el botón **Descargar PDF**
- Verifica que se descargue el archivo `informe-icfes.pdf`
- Abre el PDF y verifica que contenga:
  - Portada con fecha y total de estudiantes
  - Listado completo de estudiantes ordenado
  - Métricas por área
  - Top 5 por área
  - Top 3 por grado
  - Outliers (si existen)

## Casos de Prueba Adicionales

### 1. Archivo con Datos Faltantes
Prueba con un archivo donde algunos estudiantes tengan puntajes vacíos o null.

### 2. Archivo Grande
Prueba con 100+ estudiantes para verificar el rendimiento.

### 3. Múltiples Grados
Prueba con estudiantes de diferentes grados (11A, 11B, 11C, etc.).

### 4. Valores Extremos
Prueba con estudiantes que tengan puntajes muy altos (outliers positivos) o muy bajos (outliers negativos).

### 5. Sin PIAR
Prueba con un archivo donde ningún estudiante tenga PIAR.

### 6. Todos con PIAR
Prueba con un archivo donde todos tengan PIAR y verifica que al excluir PIAR no aparezcan datos.

## Escenarios de Error

### 1. Columnas Faltantes
- Carga un archivo sin alguna columna requerida
- Debe aparecer un mensaje de error especificando qué columnas faltan

### 2. Formato Incorrecto
- Intenta cargar un archivo `.csv` o `.txt`
- Debe rechazar el archivo

### 3. Datos No Numéricos
- Carga un archivo con texto en columnas numéricas
- Debe manejar el error correctamente

## Verificación Visual

### Responsive Design
- Prueba en diferentes tamaños de pantalla:
  - 📱 Móvil (< 768px)
  - 📱 Tablet (768px - 1024px)
  - 💻 Desktop (> 1024px)

### Interactividad
- Hover effects en botones
- Transiciones suaves
- Loading states (si aplican)

## Performance

### Tiempo de Carga
- El archivo debe cargarse en < 2 segundos (para archivos de ~100 estudiantes)
- Los filtros deben aplicarse instantáneamente

### Generación de PDF
- El PDF debe generarse en < 5 segundos (para archivos de ~100 estudiantes)

## Checklist de Testing ✅

- [ ] Carga correcta de archivo Excel
- [ ] Validación de columnas obligatorias
- [ ] Tabla ordenada por Global descendente
- [ ] Filtro "Excluir PIAR" funciona
- [ ] Filtro por grado funciona
- [ ] Filtro por rango de puntajes funciona
- [ ] Métricas globales correctas
- [ ] Gráficos se renderizan correctamente
- [ ] Top 5 por área correcto
- [ ] Top 3 por grado correcto
- [ ] Outliers detectados correctamente
- [ ] PDF se genera correctamente
- [ ] PDF contiene todas las secciones
- [ ] Responsive en móvil
- [ ] Responsive en tablet
- [ ] Responsive en desktop
- [ ] Sin errores en consola
- [ ] Sin warnings en consola
- [ ] Performance aceptable

## Reporte de Bugs

Si encuentras algún bug, repórtalo con:
1. Descripción del problema
2. Pasos para reproducir
3. Comportamiento esperado
4. Comportamiento actual
5. Screenshots (si aplica)
6. Archivo de prueba (si aplica)

---

**¡Happy Testing!** 🧪✨
