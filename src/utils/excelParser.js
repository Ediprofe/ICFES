import * as XLSX from 'xlsx';

export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        // Validar columnas obligatorias
        const requiredColumns = [
          '¿PIAR?', 'Grupo', 'Nombre', 'Apellido',
          'Lectura crítica', 'Matemáticas', 
          'Sociales', 'Naturales', 'Inglés', 'Global'
        ];
        
        const missingColumns = requiredColumns.filter(
          col => !Object.keys(rawData[0] || {}).includes(col)
        );
        
        if (missingColumns.length > 0) {
          reject(new Error(`Faltan columnas: ${missingColumns.join(', ')}`));
        }
        
        // Limpiar y normalizar datos
        const subjects = ['Lectura crítica', 'Matemáticas', 'Sociales', 'Naturales', 'Inglés'];
        
        const cleanedData = rawData.map(row => {
          const cleanRow = { ...row };
          
          // Convertir valores numéricos y manejar valores faltantes
          subjects.forEach(subject => {
            const value = row[subject];
            // Si el valor está vacío, es undefined, null o no es un número, asignar null
            if (value === undefined || value === null || value === '' || isNaN(Number(value))) {
              cleanRow[subject] = null;
            } else {
              cleanRow[subject] = Number(value);
            }
          });
          
          // Limpiar Global
          const globalValue = row['Global'];
          if (globalValue === undefined || globalValue === null || globalValue === '' || isNaN(Number(globalValue))) {
            cleanRow['Global'] = null;
          } else {
            cleanRow['Global'] = Number(globalValue);
          }
          
          // Asegurar que Nombre y Apellido sean strings
          cleanRow['Nombre'] = String(row['Nombre'] || '').trim();
          cleanRow['Apellido'] = String(row['Apellido'] || '').trim();
          cleanRow['Grupo'] = String(row['Grupo'] || '').trim();
          cleanRow['¿PIAR?'] = String(row['¿PIAR?'] || '').trim();
          
          return cleanRow;
        });
        
        // Filtrar filas completamente vacías
        const validData = cleanedData.filter(row => 
          row.Nombre && row.Apellido && row.Grupo
        );
        
        if (validData.length === 0) {
          reject(new Error('No se encontraron datos válidos en el archivo'));
        }
        
        resolve(validData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
