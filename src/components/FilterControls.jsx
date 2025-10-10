import { Filter } from 'lucide-react';

export default function FilterControls({ filters, setFilters, grades }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold">Filtros</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Excluir PIAR */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="excludePIAR"
            checked={filters.excludePIAR}
            onChange={(e) => setFilters({ ...filters, excludePIAR: e.target.checked })}
            className="w-4 h-4 text-blue-600 accent-blue-600"
          />
          <label htmlFor="excludePIAR" className="text-sm">Excluir estudiantes con PIAR</label>
        </div>

        {/* Filtro por Grado */}
        <div>
          <label className="block text-sm font-medium mb-1">Grado</label>
          <select
            value={filters.selectedGrade}
            onChange={(e) => setFilters({ ...filters, selectedGrade: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Todos">Todos los grados</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        {/* Puntaje Mínimo */}
        <div>
          <label className="block text-sm font-medium mb-1">Puntaje mínimo</label>
          <input
            type="number"
            value={filters.minScore}
            onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg"
            min="0"
            max="500"
          />
        </div>

        {/* Puntaje Máximo */}
        <div>
          <label className="block text-sm font-medium mb-1">Puntaje máximo</label>
          <input
            type="number"
            value={filters.maxScore}
            onChange={(e) => setFilters({ ...filters, maxScore: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg"
            min="0"
            max="500"
          />
        </div>
      </div>
    </div>
  );
}
