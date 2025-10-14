/**
 * ✅ Error Boundary para capturar errores de React
 * Muestra UI elegante cuando ocurre un error
 */

import { Component } from 'react';
import { ErrorHandler } from '../utils/errors/ErrorHandler.js';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Procesar el error con nuestro manejador
    const processedError = ErrorHandler.handle(error);
    
    this.setState({
      error,
      errorInfo: {
        ...processedError,
        componentStack: errorInfo.componentStack
      }
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Recargar la página si es necesario
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            {/* Icono de error */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              ¡Ups! Algo salió mal
            </h1>

            {/* Mensaje */}
            <p className="text-gray-600 text-center mb-6">
              {this.state.error?.userMessage || 
               ErrorHandler.formatForUser(this.state.error || new Error('Error desconocido'))}
            </p>

            {/* Sugerencias */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Qué puedes hacer:</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Intenta recargar la página</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Verifica que el archivo Excel tenga el formato correcto</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Si el problema persiste, contacta al soporte técnico</span>
                </li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Ir al inicio
              </button>
            </div>

            {/* Detalles técnicos (solo en desarrollo) */}
            {isDevelopment && this.state.errorInfo && (
              <details className="mt-8 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Detalles técnicos (modo desarrollo)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Error:</h4>
                    <pre className="text-xs bg-white p-3 rounded border border-gray-300 overflow-auto">
                      {this.state.error?.toString()}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Stack Trace:</h4>
                    <pre className="text-xs bg-white p-3 rounded border border-gray-300 overflow-auto max-h-64">
                      {this.state.error?.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo.componentStack && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Component Stack:</h4>
                      <pre className="text-xs bg-white p-3 rounded border border-gray-300 overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Desarrollado por{' '}
                <a 
                  href="https://ediprofe.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  ediprofe.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
