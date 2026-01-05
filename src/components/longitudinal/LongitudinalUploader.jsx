/**
 * LongitudinalUploader - Componente para cargar Excel multi-hoja
 * para análisis longitudinal
 */

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { getExcelInfo, parseExcelMultiSheet } from '../../utils/excelParser.js';

/**
 * @param {Object} props
 * @param {function} props.onDataLoaded - Callback cuando los datos están listos
 */
export function LongitudinalUploader({ onDataLoaded }) {
    const [file, setFile] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gradoLabel, setGradoLabel] = useState('');
    const [step, setStep] = useState('upload'); // 'upload' | 'confirm' | 'processing'

    const handleFileChange = useCallback(async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setError(null);
        setLoading(true);

        try {
            const info = await getExcelInfo(selectedFile);
            setFileInfo(info);

            // Sugerir nombre del grado basado en el nombre del archivo
            const suggestedGrado = selectedFile.name
                .replace(/\.[^/.]+$/, '')
                .replace(/[_-]/g, ' ');
            setGradoLabel(suggestedGrado);

            if (info.sheetCount < 2) {
                setError('Este archivo tiene solo una hoja. Para análisis longitudinal necesitas un Excel con múltiples hojas (una por prueba).');
                setStep('upload');
            } else {
                setStep('confirm');
            }
        } catch (err) {
            setError(err.message || 'Error al leer el archivo');
            setStep('upload');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleConfirm = useCallback(async () => {
        if (!file || !gradoLabel.trim()) return;

        setStep('processing');
        setLoading(true);
        setError(null);

        try {
            const data = await parseExcelMultiSheet(file, gradoLabel.trim());
            onDataLoaded(data);
        } catch (err) {
            setError(err.message || 'Error al procesar el archivo');
            setStep('confirm');
        } finally {
            setLoading(false);
        }
    }, [file, gradoLabel, onDataLoaded]);

    const handleReset = () => {
        setFile(null);
        setFileInfo(null);
        setError(null);
        setGradoLabel('');
        setStep('upload');
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileSpreadsheet className="text-green-600" size={28} />
                Cargar Excel con Múltiples Pruebas
            </h2>

            {/* Error display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-red-800 font-medium">Error</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Step 1: Upload */}
            {step === 'upload' && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-green-400 transition-colors">
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="longitudinal-file-input"
                        disabled={loading}
                    />
                    <label
                        htmlFor="longitudinal-file-input"
                        className="cursor-pointer flex flex-col items-center gap-4"
                    >
                        {loading ? (
                            <Loader className="text-green-500 animate-spin" size={48} />
                        ) : (
                            <Upload className="text-gray-400" size={48} />
                        )}
                        <div>
                            <p className="text-lg font-semibold text-gray-700">
                                {loading ? 'Leyendo archivo...' : 'Selecciona un archivo Excel'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                El archivo debe tener <strong>múltiples hojas</strong>, una por cada prueba
                            </p>
                            <p className="text-xs text-amber-600 mt-2">
                                ⚠️ Cada hoja debe incluir la columna "Código" (obligatoria)
                            </p>
                        </div>
                    </label>
                </div>
            )}

            {/* Step 2: Confirm sheets */}
            {step === 'confirm' && fileInfo && (
                <div className="space-y-6">
                    {/* File info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-700 mb-2">Archivo: {fileInfo.fileName}</p>
                        <p className="text-sm text-gray-600">
                            {fileInfo.sheetCount} hojas detectadas (pruebas):
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {fileInfo.sheetNames?.map((name, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Grado input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del grado o cohorte:
                        </label>
                        <input
                            type="text"
                            value={gradoLabel}
                            onChange={(e) => setGradoLabel(e.target.value)}
                            placeholder="Ej: 11° 2025"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!gradoLabel.trim() || loading}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Confirmar y Analizar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Processing */}
            {step === 'processing' && (
                <div className="text-center py-10">
                    <Loader className="text-green-500 animate-spin mx-auto mb-4" size={48} />
                    <p className="text-lg font-medium text-gray-700">Procesando datos...</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Validando columnas y cruzando estudiantes entre pruebas
                    </p>
                </div>
            )}
        </div>
    );
}

export default LongitudinalUploader;
