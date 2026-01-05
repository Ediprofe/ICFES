/**
 * React Components for Longitudinal HTML Export
 * 
 * Contains the inline React component definitions as strings
 */

/**
 * Generates the Icons, SortableHeader, ChartCard, and BarChart components
 * @returns {string} - JavaScript code for components
 */
export function generateComponents() {
    return `
// ============================================
// ICONOS
// ============================================
const Icons = {
    Sort: () => React.createElement('svg', { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M7 15l5 5 5-5" }), React.createElement('path', { d: "M7 9l5-5 5 5" })),
    SortAsc: () => React.createElement('svg', { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M12 19V5" }), React.createElement('path', { d: "M5 12l7 7 7-7" })),
    SortDesc: () => React.createElement('svg', { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M12 5v14" }), React.createElement('path', { d: "M19 12l-7-7-7 7" }))
};

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function SortableHeader({ label, field, sortConfig, onSort }) {
    const isActive = sortConfig.key === field;
    return React.createElement('th', { 
        className: 'px-2 py-2 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none',
        onClick: () => onSort(field)
    }, 
        React.createElement('div', { className: 'flex items-center justify-between gap-1' },
            label,
            isActive 
                ? (sortConfig.direction === 'asc' ? React.createElement(Icons.SortAsc) : React.createElement(Icons.SortDesc))
                : React.createElement(Icons.Sort, { className: 'text-gray-300' })
        )
    );
}

function ChartCard({ title, children, showPIAR, onTogglePIAR }) {
    return React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6' },
        React.createElement('div', { className: 'flex items-center justify-between mb-6' },
            React.createElement('h3', { className: 'text-lg font-bold text-gray-800' }, title),
            onTogglePIAR && React.createElement('button', {
                onClick: onTogglePIAR,
                className: 'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ' +
                    (showPIAR ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            },
                showPIAR ? '📊 Ver impacto PIAR' : '👁️ Ver impacto PIAR'
            )
        ),
        React.createElement('div', { className: 'chart-container' }, children)
    );
}

// ============================================
// COMPONENTES DE GRÁFICOS
// ============================================

function BarChart({ data, options, id }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        
        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, options]);

    return React.createElement('canvas', { ref: canvasRef, id: id });
}
`;
}
