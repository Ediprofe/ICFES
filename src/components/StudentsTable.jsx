import { useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';

export default function StudentsTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Global', direction: 'desc' });

  // Filtrar por búsqueda (nombre o apellido)
  const filteredData = data.filter(student => 
    student.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.Apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Para columnas con espacios (ej: "Lectura crítica")
    if (sortConfig.key === 'Lectura') aValue = a['Lectura crítica'];
    if (sortConfig.key === 'Lectura') bValue = b['Lectura crítica'];

    // Ordenar strings
    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Ordenar números
    return sortConfig.direction === 'asc' 
      ? aValue - bValue 
      : bValue - aValue;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Listado de estudiantes</h2>
          <p className="text-sm text-gray-600">
            Mostrando {sortedData.length} de {data.length} estudiantes
          </p>
        </div>
        
        {/* Búsqueda por nombre o apellido */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Pos</th>
            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Nombre')}>
              <div className="flex items-center gap-1">
                Nombre <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Apellido')}>
              <div className="flex items-center gap-1">
                Apellido <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Grupo')}>
              <div className="flex items-center gap-1">
                Grado <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-left">PIAR</th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Lectura')}>
              <div className="flex items-center justify-end gap-1">
                Lectura crítica <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Matemáticas')}>
              <div className="flex items-center justify-end gap-1">
                Matemáticas <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Sociales')}>
              <div className="flex items-center justify-end gap-1">
                Sociales y ciudadanas <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Naturales')}>
              <div className="flex items-center justify-end gap-1">
                Ciencias naturales <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Inglés')}>
              <div className="flex items-center justify-end gap-1">
                Inglés <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort('Global')}>
              <div className="flex items-center justify-end gap-1 font-bold">
                Global <ArrowUpDown size={14} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((student, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2 text-gray-500">{index + 1}</td>
              <td className="p-2">{student.Nombre}</td>
              <td className="p-2">{student.Apellido}</td>
              <td className="p-2">{student.Grupo}</td>
              <td className="p-2">
                {student['¿PIAR?'] === 'Sí' && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">PIAR</span>
                )}
              </td>
              <td className="p-2 text-right">{student['Lectura crítica']?.toFixed(2)}</td>
              <td className="p-2 text-right">{student.Matemáticas?.toFixed(2)}</td>
              <td className="p-2 text-right">{student.Sociales?.toFixed(2)}</td>
              <td className="p-2 text-right">{student.Naturales?.toFixed(2)}</td>
              <td className="p-2 text-right">{student.Inglés?.toFixed(2)}</td>
              <td className="p-2 text-right font-bold text-primary">{student.Global?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron estudiantes con ese nombre o apellido
        </div>
      )}
    </div>
  );
}
