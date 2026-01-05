/**
 * Main Generator/Orchestrator for Longitudinal HTML Export
 * 
 * Assembles all modular pieces into a complete HTML document
 */

import { prepareExportData, generateHtmlHead, generateHtmlFooter, generateDataScript } from './longitudinalCore';
import { generateStyles } from './longitudinalStyles';
import { generateComponents } from './longitudinalComponents';
import { generateChartConfig, generateDatasetHelpers } from './longitudinalCharts';
import { generateAppState } from './longitudinalAppState';
import { generateGradeEvolutionTab } from './gradeEvolutionTab';
import { generateGroupComparisonTab } from './groupComparisonTab';
import { generateStudentEvolutionTab } from './studentEvolutionTab';

/**
 * Generates the complete Longitudinal HTML report
 * @param {LongitudinalAnalysis} analysis - The analysis model
 * @returns {string} - Complete HTML document
 */
export function generateLongitudinalHTML(analysis) {
    const data = prepareExportData(analysis);
    const dataJSON = JSON.stringify(data);

    return [
        // Document head
        generateHtmlHead(data.grado),

        // Styles
        generateStyles(),

        // Embedded data
        generateDataScript(dataJSON),

        // Main script block
        '<script>',
        'const { useState, useEffect, useRef, useMemo } = React;',
        '',

        // Components
        generateComponents(),

        // Chart configuration
        generateChartConfig(),

        // App component
        generateAppFunction(),

        // React render
        "ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));",
        '</script>',

        // Footer
        generateHtmlFooter()
    ].join('\n');
}

/**
 * Generates the main App function
 * @returns {string} - App function code
 */
function generateAppFunction() {
    return `
// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function App() {
    const [activeTab, setActiveTab] = useState('grade');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    const [includePIAR, setIncludePIAR] = useState(true);
    const [filterCompleto, setFilterCompleto] = useState('all');
    const [selectedPrueba, setSelectedPrueba] = useState(DATA.pruebas.length > 0 ? DATA.pruebas[DATA.pruebas.length - 1].id : 'promedio');
    const [showPIAR, setShowPIAR] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'global', direction: 'desc' });

    // Alternar vista PIAR para un gráfico específico
    const togglePIAR = (chartId) => {
        setShowPIAR(prev => ({ ...prev, [chartId]: !prev[chartId] }));
    };

    // Función para obtener valor según prueba seleccionada
    const getValorActual = (student, campo) => {
        if (selectedPrueba === 'promedio') {
            if (campo === 'global') return student.promedioGlobal;
            return student.areasPromedio[campo];
        } else {
            const datosPrueba = student.datosPorPrueba[selectedPrueba];
            if (!datosPrueba) return null;
            return datosPrueba[campo];
        }
    };

    // KPIs
    const first = DATA.gradeMetricsSinPIAR[0];
    const last = DATA.gradeMetricsSinPIAR[DATA.gradeMetricsSinPIAR.length - 1];
    const cambio = DATA.gradeMetricsSinPIAR.length >= 2 ? last.promedioGlobal - first.promedioGlobal : 0;

    // Manejar ordenamiento
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    // Filtrar y ordenar estudiantes
    const filteredStudents = useMemo(() => {
        let data = [...DATA.students];
        
        // Filtros
        if (!includePIAR) data = data.filter(s => s.piar !== 'Sí');
        if (groupFilter) data = data.filter(s => s.grupo === groupFilter);
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            data = data.filter(s =>
                s.nombre.toLowerCase().includes(search) ||
                s.apellido.toLowerCase().includes(search) ||
                s.codigo.toLowerCase().includes(search)
            );
        }
        if (filterCompleto === 'completo') data = data.filter(s => s.todasLasPruebas);
        else if (filterCompleto === 'incompleto') data = data.filter(s => !s.todasLasPruebas);
        
        // Ordenamiento dinámico
        data.sort((a, b) => {
            let valA, valB;

            switch (sortConfig.key) {
                case 'codigo': valA = a.codigo; valB = b.codigo; break;
                case 'apellido': valA = a.apellido; valB = b.apellido; break;
                case 'nombre': valA = a.nombre; valB = b.nombre; break;
                case 'grupo': valA = a.grupo; valB = b.grupo; break;
                case 'piar': valA = a.piar; valB = b.piar; break;
                case 'pruebas': valA = a.pruebasPresentes; valB = b.pruebasPresentes; break;
                case 'completo': valA = a.todasLasPruebas; valB = b.todasLasPruebas; break;
                case 'global': 
                    valA = getValorActual(a, 'global') ?? -Infinity; 
                    valB = getValorActual(b, 'global') ?? -Infinity; 
                    break;
                default:
                    // Es un área
                    valA = getValorActual(a, sortConfig.key) ?? -Infinity;
                    valB = getValorActual(b, sortConfig.key) ?? -Infinity;
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        return data;
    }, [searchTerm, groupFilter, includePIAR, filterCompleto, selectedPrueba, sortConfig]);

    // Título del ranking
    const rankingTitle = selectedPrueba === 'promedio' 
        ? '🏆 Ranking Promedio General'
        : '🏆 Ranking: ' + (DATA.pruebas.find(p => p.id === selectedPrueba)?.nombre || selectedPrueba);

    // Estudiante seleccionado
    const studentData = useMemo(() => {
        if (!selectedStudent) return null;
        return DATA.students.find(s => s.codigo === selectedStudent);
    }, [selectedStudent]);

${generateDatasetHelpers()}

    // ============================================
    // RENDER
    // ============================================

    return React.createElement('div', { className: 'max-w-7xl mx-auto p-4 md:p-6' },
        // Header
        ${generateHeader()},

        // Tabs
        ${generateTabs()},

        // TAB: Evolución del Grado
        ${generateGradeEvolutionTabContent()},

        // TAB: Comparativa de Grupos
        ${generateGroupComparisonTabContent()},

        // TAB: Por Estudiante
        ${generateStudentEvolutionTabContent()},

        // Footer
        React.createElement('div', { className: 'text-center text-gray-400 text-sm mt-8 pb-8' },
            '📊 Generado el ' + new Date().toLocaleString('es-CO')
        )
    );
}
`;
}

function generateHeader() {
    return `React.createElement('div', { className: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-6 text-white' },
            React.createElement('div', { className: 'flex items-center gap-4' },
                React.createElement('span', { className: 'text-5xl' }, '📊'),
                React.createElement('div', null,
                    React.createElement('h1', { className: 'text-3xl font-bold' }, 'Análisis Longitudinal'),
                    React.createElement('p', { className: 'text-purple-100 text-lg' }, DATA.grado)
                )
            ),
            React.createElement('div', { className: 'flex flex-wrap gap-4 mt-6' },
                React.createElement('div', { className: 'bg-white/15 backdrop-blur px-5 py-3 rounded-xl' },
                    React.createElement('p', { className: 'text-3xl font-bold' }, DATA.pruebas.length),
                    React.createElement('p', { className: 'text-sm text-purple-100' }, 'Pruebas')
                ),
                React.createElement('div', { className: 'bg-white/15 backdrop-blur px-5 py-3 rounded-xl' },
                    React.createElement('p', { className: 'text-3xl font-bold' }, DATA.students.length),
                    React.createElement('p', { className: 'text-sm text-purple-100' }, 'Estudiantes')
                ),
                React.createElement('div', { className: 'bg-white/15 backdrop-blur px-5 py-3 rounded-xl' },
                    React.createElement('p', { className: 'text-3xl font-bold' }, DATA.grupos.length),
                    React.createElement('p', { className: 'text-sm text-purple-100' }, 'Grupos')
                )
            ),
            React.createElement('p', { className: 'mt-4 text-sm text-purple-200' }, 
                '📅 ' + DATA.pruebas.map(p => p.nombre).join(' → ')
            )
        )`;
}

function generateTabs() {
    return `React.createElement('div', { className: 'flex bg-white rounded-xl shadow-lg mb-6 overflow-hidden' },
            ['grade', 'groups', 'students'].map(tab => 
                React.createElement('button', {
                    key: tab,
                    onClick: () => setActiveTab(tab),
                    className: 'flex-1 py-4 px-6 font-semibold transition-all ' + 
                        (activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50')
                }, tab === 'grade' ? '📈 Evolución del Grado' : tab === 'groups' ? '👥 Comparativa de Grupos' : '👤 Por Estudiante')
            )
        )`;
}

// Placeholder functions - in a full refactor these would import from separate files
function generateGradeEvolutionTabContent() {
    return `// Content moved to gradeEvolutionTab module`;
}

function generateGroupComparisonTabContent() {
    return `// Content moved to groupComparisonTab module`;
}

function generateStudentEvolutionTabContent() {
    return `// Content moved to studentEvolutionTab module`;
}
