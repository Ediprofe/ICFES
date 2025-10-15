/**
 * ✅ Zustand store para gestión de estado global
 * Maneja múltiples análisis de años y modo comparativo
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MultiYearAnalysis } from '../models/MultiYearAnalysis.js';
import { parseExcel } from '../utils/excelParser.js';

const useAnalysisStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // Estado
        multiYearAnalysis: new MultiYearAnalysis(),
        comparisonMode: false,
        loading: false,
        error: null,
        
        // Selectores
        getActiveAnalysis: () => {
          const state = get();
          return state.multiYearAnalysis.getBaseAnalysis();
        },
        
        getAvailableYears: () => {
          const state = get();
          return state.multiYearAnalysis.getAvailableYears();
        },
        
        getBaseYear: () => {
          const state = get();
          return state.multiYearAnalysis.baseYear;
        },
        
        getComparisonYears: () => {
          const state = get();
          return state.multiYearAnalysis.comparisonYears;
        },
        
        getComparisonAnalyses: () => {
          const state = get();
          return state.multiYearAnalysis.getComparisonAnalyses();
        },
        
        hasData: () => {
          const state = get();
          // Verificar si multiYearAnalysis tiene analyses (array o Map)
          if (!state.multiYearAnalysis) return false;
          
          // Si es un objeto rehidratado de localStorage
          if (state.multiYearAnalysis.analyses && Array.isArray(state.multiYearAnalysis.analyses)) {
            return state.multiYearAnalysis.analyses.length > 0;
          }
          
          // Si es una instancia de MultiYearAnalysis
          if (state.multiYearAnalysis.getAvailableYears) {
            return state.multiYearAnalysis.getAvailableYears().length > 0;
          }
          
          return false;
        },
        
        isYearLoaded: (year) => {
          const state = get();
          return state.multiYearAnalysis.analyses.has(year);
        },
        
        // Actions
        loadBaseYear: async (file, yearLabel = null) => {
          set({ loading: true, error: null });
          
          try {
            const result = await parseExcel(file, yearLabel);
            const { year, data, warnings } = result;
            
            set((state) => {
              state.multiYearAnalysis.addAnalysis(year, data);
              state.loading = false;
            });
            
            return { success: true, year, warnings };
          } catch (error) {
            set({ 
              loading: false, 
              error: error.userMessage || error.message || 'Error al cargar el archivo' 
            });
            return { success: false, error: error.userMessage || error.message };
          }
        },
        
        loadComparisonYear: async (file, yearLabel = null) => {
          set({ loading: true, error: null });
          
          try {
            const result = await parseExcel(file, yearLabel);
            const { year, data, warnings } = result;
            
            // Verificar que no sea el año base
            const baseYear = get().multiYearAnalysis.baseYear;
            if (year === baseYear) {
              throw new Error('No se puede cargar el mismo año como comparación');
            }
            
            set((state) => {
              state.multiYearAnalysis.addAnalysis(year, data);
              state.multiYearAnalysis.addComparisonYear(year);
              state.loading = false;
            });
            
            return { success: true, year, warnings };
          } catch (error) {
            set({ 
              loading: false, 
              error: error.userMessage || error.message || 'Error al cargar el archivo de comparación' 
            });
            return { success: false, error: error.userMessage || error.message };
          }
        },
        
        enableComparisonMode: () => {
          set({ comparisonMode: true });
        },
        
        disableComparisonMode: () => {
          set({ comparisonMode: false });
        },
        
        setBaseYear: (year) => {
          set((state) => {
            try {
              state.multiYearAnalysis.setBaseYear(year);
            } catch (error) {
              state.error = error.message;
            }
          });
        },
        
        toggleYearInComparison: (year) => {
          set((state) => {
            try {
              state.multiYearAnalysis.toggleComparisonYear(year);
            } catch (error) {
              state.error = error.message;
            }
          });
        },
        
        updateFilters: (year, filters) => {
          set((state) => {
            const analysis = state.multiYearAnalysis.getAnalysis(year);
            if (analysis) {
              analysis.updateFilters(filters);
            }
          });
        },
        
        removeYear: (year) => {
          set((state) => {
            state.multiYearAnalysis.removeAnalysis(year);
          });
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        reset: () => {
          set({
            multiYearAnalysis: new MultiYearAnalysis(),
            comparisonMode: false,
            loading: false,
            error: null
          });
        }
      })),
      {
        name: 'icfes-analysis-storage',
        partialize: (state) => ({
          multiYearAnalysis: state.multiYearAnalysis.toJSON(),
          comparisonMode: state.comparisonMode
        }),
        onRehydrateStorage: () => (state) => {
          if (state && state.multiYearAnalysis) {
            try {
              state.multiYearAnalysis = MultiYearAnalysis.fromJSON(state.multiYearAnalysis);
            } catch {
              state.multiYearAnalysis = new MultiYearAnalysis();
            }
          }
        }
      }
    ),
    { name: 'ICFES Analysis Store' }
  )
);

// Hooks personalizados para facilitar el uso
export const useHasData = () => useAnalysisStore((state) => state.hasData());
export const useComparisonMode = () => useAnalysisStore((state) => state.comparisonMode);
export const useAvailableYears = () => useAnalysisStore((state) => state.getAvailableYears());
export const useActiveAnalysis = () => useAnalysisStore((state) => state.getActiveAnalysis());

export { useAnalysisStore };
export default useAnalysisStore;
