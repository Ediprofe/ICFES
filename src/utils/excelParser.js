import * as XLSX from 'xlsx';

export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        // Validar columnas obligatorias
        const requiredColumns = [
          '¿PIAR?', 'Grupo', 'Nombre', 'Apellido',
          'Lectura crítica', 'Matemáticas', 
          'Sociales', 'Naturales', 'Inglés', 'Global'
        ];
        
        const missingColumns = requiredColumns.filter(
          col => !Object.keys(data[0] || {}).includes(col)
        );
        
        if (missingColumns.length > 0) {
          reject(new Error(`Faltan columnas: ${missingColumns.join(', ')}`));
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
