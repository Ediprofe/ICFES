/**
 * ✅ Estilos, colores, tamaños para gráficos y tablas
 * Compartido entre HTML y PDF
 */

import { ACADEMIC_AREAS } from './columnConfig.js';

export const COLORS = {
  // Brand colors
  primary: '#2563eb',     // blue-600
  secondary: '#6366f1',   // indigo-500
  accent: '#f59e0b',      // amber-500
  
  // Status colors
  success: '#22c55e',     // green-500
  warning: '#f59e0b',     // amber-500
  error: '#ef4444',       // red-500
  info: '#3b82f6',        // blue-500
  
  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  
  // PIAR comparison colors
  withPIAR: {
    main: '#9ca3af',      // gray-400
    light: '#f3f4f6',     // gray-100
    dark: '#6b7280'       // gray-500
  },
  withoutPIAR: {
    main: '#22c55e',      // green-500
    light: '#dcfce7',     // green-100
    dark: '#166534'       // green-800
  }
};

export const CHART_CONFIG = {
  // Tamaños
  sizes: {
    html: {
      height: 300,
      width: '100%',
      barThickness: 40
    },
    pdf: {
      height: 70,
      width: 170, // pageWidth - 40 (margins)
      barThickness: 15,
      spacing: 95
    }
  },
  
  // Fuentes
  fonts: {
    html: {
      family: 'system-ui, -apple-system, sans-serif',
      size: {
        title: 16,
        label: 12,
        value: 11
      }
    },
    pdf: {
      family: 'helvetica',
      size: {
        title: 12,
        label: 9,
        value: 8
      }
    }
  },
  
  // Animaciones (solo HTML)
  animations: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  
  // Leyendas
  legend: {
    position: 'top',
    labels: {
      withPIAR: 'Con PIAR',
      withoutPIAR: 'Sin PIAR'
    }
  },
  
  // Grid
  grid: {
    color: COLORS.gray[200],
    lineWidth: 1
  }
};

export const TABLE_CONFIG = {
  // Estilos de tabla
  styles: {
    header: {
      fillColor: COLORS.primary,
      textColor: '#ffffff',
      fontStyle: 'bold',
      fontSize: 10
    },
    body: {
      fontSize: 9,
      textColor: COLORS.gray[800]
    },
    alternateRow: {
      fillColor: COLORS.gray[50]
    }
  },
  
  // Ancho de columnas (PDF)
  columnWidths: {
    position: 15,
    name: 40,
    lastName: 40,
    grade: 25,
    score: 25
  },
  
  // Límites
  maxRowsPerPage: {
    html: Infinity,
    pdf: 30
  }
};

export const LAYOUT_CONFIG = {
  // Márgenes
  margins: {
    html: {
      x: 20,
      y: 20
    },
    pdf: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  },
  
  // Espaciado
  spacing: {
    sectionGap: 30,
    elementGap: 15,
    paragraphGap: 10
  },
  
  // Grid
  grid: {
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1
    }
  }
};

export const BRANDING = {
  name: 'ediprofe.com',
  url: 'https://ediprofe.com',
  social: {
    youtube: 'https://www.youtube.com/@ProfeEdi',
    tiktok: 'https://www.tiktok.com/@ediprofe',
    web: 'https://ediprofe.com'
  },
  colors: {
    primary: COLORS.primary,
    text: COLORS.gray[700]
  }
};

// Helper functions
export const getColorForArea = (areaId) => {
  const area = ACADEMIC_AREAS.find(a => a.id === areaId);
  return area ? area.color : COLORS.gray[500];
};

export const getChartConfig = (format) => {
  return {
    ...CHART_CONFIG,
    ...CHART_CONFIG.sizes[format],
    ...CHART_CONFIG.fonts[format]
  };
};
