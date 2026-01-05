# Plantilla de Excel para ICFES Analyzer

## Creación del archivo plantilla_icfes.xlsx

Para que la aplicación funcione correctamente, necesitas crear un archivo Excel de plantilla llamado `plantilla_icfes.xlsx` en la carpeta `public/`.

### Estructura del archivo Excel:

#### Columnas OBLIGATORIAS (marcar con fondo amarillo):

1. **Nombre** - Nombre del estudiante
2. **Apellido** - Apellido del estudiante
3. **Grupo** - Grado o grupo del estudiante (ejemplo: 11A, 11B, etc.)
4. **¿PIAR?** - Responder "Sí" si el estudiante tiene PIAR, o dejar vacío
5. **Lectura crítica** - Puntaje en Lectura crítica (número)
6. **Matemáticas** - Puntaje en Matemáticas (número)
7. **Sociales** - Puntaje en Sociales (número)
8. **Naturales** - Puntaje en Naturales (número)
9. **Inglés** - Puntaje en Inglés (número)
10. **Global** - Puntaje global del estudiante (número)

#### Columnas OPCIONALES (sin fondo amarillo):

11. **Percentil Lectura crítica** - Percentil en Lectura crítica (opcional)
12. **Percentil Matemáticas** - Percentil en Matemáticas (opcional)
13. **Percentil Sociales** - Percentil en Sociales (opcional)
14. **Percentil Naturales** - Percentil en Naturales (opcional)
15. **Percentil Inglés** - Percentil en Inglés (opcional)

### Formato del archivo:

- **Fila 1**: Encabezados de columnas
- **Fila 2 en adelante**: Datos de estudiantes (ejemplo)
- **Celdas de encabezados obligatorios**: Fondo amarillo (#FFFF00)
- **No agregar filas adicionales debajo de los datos**

### Ejemplo de datos (2-3 estudiantes de ejemplo):

| Nombre | Apellido | Grupo | ¿PIAR? | Lectura crítica | Matemáticas | Sociales | Naturales | Inglés | Global | Percentil Lectura crítica | Percentil Matemáticas | Percentil Sociales | Percentil Naturales | Percentil Inglés |
|--------|----------|-------|--------|-----------------|-------------|----------|-----------|--------|--------|---------------------------|----------------------|-------------------|---------------------|------------------|
| Juan   | Pérez    | 11A   |        | 65              | 70          | 68       | 72        | 60     | 335    | 75                        | 80                   | 78                | 82                  | 70               |
| María  | González | 11A   | Sí     | 58              | 62          | 60       | 65        | 55     | 300    | 60                        | 65                   | 63                | 68                  | 58               |
| Carlos | Rodríguez| 11B   |        | 72              | 75          | 70       | 78        | 68     | 363    | 85                        | 88                   | 82                | 90                  | 80               |

### Pasos para crear el archivo:

1. Abre Microsoft Excel, Google Sheets o LibreOffice Calc
2. Crea un nuevo libro
3. En la primera fila, escribe los encabezados exactamente como aparecen arriba
4. Marca con fondo amarillo las columnas obligatorias (Nombre hasta Global)
5. Agrega 2-3 filas de datos de ejemplo
6. Guarda el archivo como `plantilla_icfes.xlsx`
7. Copia el archivo a la carpeta `public/` del proyecto

### Notas importantes:

- ⚠️ Los nombres de las columnas deben ser **exactamente** como se especifican
- ⚠️ No usar espacios adicionales ni tildes diferentes
- ⚠️ Las columnas de percentiles son opcionales
- ⚠️ No agregar totales, promedios ni comentarios debajo de la tabla
- ⚠️ Asegúrate de que el archivo esté guardado como `.xlsx`

### Alternativa: Descargar plantilla

Si prefieres, puedes encontrar una plantilla de ejemplo en este enlace:
[Descargar plantilla_icfes.xlsx](#)

O puedes crear la plantilla siguiendo los pasos anteriores.
