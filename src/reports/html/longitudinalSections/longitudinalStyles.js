/**
 * CSS Styles for Longitudinal HTML Export
 */

/**
 * Generates the embedded CSS styles
 * @returns {string} - Style tag with CSS
 */
export function generateStyles() {
    return `
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; }
        .chart-container { position: relative; height: 350px; }
        .chart-container-small { position: relative; height: 280px; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-100 to-indigo-100 min-h-screen">
`;
}
