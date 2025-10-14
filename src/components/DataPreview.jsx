/**
 * ✅ Componente: Vista Previa de Datos
 * Muestra un resumen de los datos cargados
 */

import { Users, BookOpen, TrendingUp } from 'lucide-react';
import { useAnalysisStore } from '../stores/analysisStore.js';

export const DataPreview = () => {
  const activeAnalysis = useAnalysisStore((state) => state.getActiveAnalysis());
  
  if (!activeAnalysis) return null;
  
  const metrics = activeAnalysis.getGlobalMetrics(true);
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Resumen del Análisis - Año {activeAnalysis.year}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Estudiantes */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Estudiantes</p>
            <p className="text-2xl font-bold text-blue-600">
              {activeAnalysis.metadata.totalStudents}
            </p>
          </div>
        </div>
        
        {/* Promedio Global */}
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
          <div className="p-3 bg-green-600 rounded-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Promedio Global</p>
            <p className="text-2xl font-bold text-green-600">
              {metrics.promedio.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Grados */}
        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
          <div className="p-3 bg-purple-600 rounded-lg">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Grados</p>
            <p className="text-lg font-bold text-purple-600">
              {activeAnalysis.metadata.grades.join(', ')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Con PIAR</p>
            <p className="font-semibold text-gray-800">
              {activeAnalysis.metadata.studentsWithPIAR}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Sin PIAR</p>
            <p className="font-semibold text-gray-800">
              {activeAnalysis.metadata.studentsWithoutPIAR}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Desviación Est.</p>
            <p className="font-semibold text-gray-800">
              {metrics.desviacion.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Valores Atípicos</p>
            <p className="font-semibold text-gray-800">
              {metrics.outliers.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
