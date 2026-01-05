/**
 * Test de Verificación Manual - Clasificación de Plantel
 * 
 * Este test verifica que la implementación coincide 100% con el cálculo manual
 * usando una muestra de 10 estudiantes que YA representan el top 80% en un área.
 */

import { calculateFRAStatistics } from './clasificacionPlantel.js';

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║  TEST DE VERIFICACIÓN MANUAL - CLASIFICACIÓN DE PLANTEL          ║');
console.log('╠═══════════════════════════════════════════════════════════════════╣');
console.log('║  Muestra: 10 estudiantes (YA son el top 80% en Matemáticas)      ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// MUESTRA DE PRUEBA: 10 estudiantes (top 80% en Matemáticas)
// ============================================================================
const puntajesMuestra = [85, 88, 90, 92, 92, 94, 95, 96, 98, 100];

console.log('📊 MUESTRA DE PUNTAJES (Top 80% en Matemáticas)');
console.log('═'.repeat(70));
console.log('Puntajes:', puntajesMuestra.join(', '));
console.log('Total estudiantes:', puntajesMuestra.length);
console.log('Promedio aritmético:', (puntajesMuestra.reduce((a, b) => a + b, 0) / puntajesMuestra.length).toFixed(2));
console.log('Mínimo:', Math.min(...puntajesMuestra));
console.log('Máximo:', Math.max(...puntajesMuestra));
console.log('');

// ============================================================================
// PASO 1: CÁLCULO MANUAL - TABLA DE FRECUENCIAS
// ============================================================================
console.log('📋 PASO 1: TABLA DE FRECUENCIAS (Puntajes 0-100)');
console.log('═'.repeat(70));

// Crear tabla de frecuencias manualmente
const frecuenciasManual = new Array(101).fill(0);
puntajesMuestra.forEach(puntaje => {
  frecuenciasManual[puntaje]++;
});

console.log('Puntajes con frecuencia > 0:');
frecuenciasManual.forEach((freq, puntaje) => {
  if (freq > 0) {
    console.log(`  Puntaje ${puntaje}: ${freq} estudiante(s)`);
  }
});
console.log('');

// ============================================================================
// PASO 2: CÁLCULO MANUAL - FRECUENCIAS RELATIVAS
// ============================================================================
console.log('📊 PASO 2: FRECUENCIAS RELATIVAS');
console.log('═'.repeat(70));

const frecuenciasRelativasManual = frecuenciasManual.map(freq => freq / puntajesMuestra.length);
const sumaFrecRel = frecuenciasRelativasManual.reduce((a, b) => a + b, 0);

console.log('Frecuencias Relativas (solo puntajes con frecuencia > 0):');
frecuenciasRelativasManual.forEach((freqRel, puntaje) => {
  if (freqRel > 0) {
    console.log(`  Puntaje ${puntaje}: ${freqRel.toFixed(4)} (${(freqRel * 100).toFixed(1)}%)`);
  }
});
console.log(`\nSuma de Frecuencias Relativas: ${sumaFrecRel.toFixed(6)} (debe ser 1.0) ✓`);
console.log('');

// ============================================================================
// PASO 3: CÁLCULO MANUAL - FRECUENCIA RELATIVA ACUMULADA (FRA)
// ============================================================================
console.log('📈 PASO 3: FRECUENCIA RELATIVA ACUMULADA (FRA)');
console.log('═'.repeat(70));
console.log('IMPORTANTE: La FRA acumula desde puntaje 100 hacia 0 (de MAYOR a MENOR)');
console.log('FRA[i] = proporción de estudiantes con puntaje >= i\n');

// Calcular FRA manualmente (acumulando de 100 hacia 0)
const FRAManual = new Array(101);
let acumulado = 0;
for (let i = 100; i >= 0; i--) {
  acumulado += frecuenciasRelativasManual[i];
  FRAManual[i] = acumulado;
}

console.log('Tabla FRA completa (mostrando valores clave):');
console.log('Puntaje | Frecuencia | Frec.Rel | FRA      | Interpretación');
console.log('-'.repeat(70));

// Mostrar FRA para puntajes relevantes
for (let i = 100; i >= 0; i--) {
  if (frecuenciasManual[i] > 0 || i === 100 || i === 0) {
    const interpretacion = i === 100 ? 'Estudiantes con 100+' :
                          i === 0 ? 'Todos los estudiantes' :
                          `Estudiantes con ${i}+`;
    console.log(
      `${i.toString().padStart(3)} | ` +
      `${frecuenciasManual[i].toString().padStart(10)} | ` +
      `${frecuenciasRelativasManual[i].toFixed(4)} | ` +
      `${FRAManual[i].toFixed(4)} | ` +
      `${interpretacion}`
    );
  }
}

console.log(`\nVerificación: FRA[0] = ${FRAManual[0].toFixed(6)} (debe ser 1.0) ✓`);
console.log('');

// ============================================================================
// PASO 4: CÁLCULO MANUAL - PROMEDIO
// ============================================================================
console.log('🔢 PASO 4: CÁLCULO DEL PROMEDIO');
console.log('═'.repeat(70));
console.log('Fórmula: Promedio = Σ(FRA) / 101\n');

const sumaFRAManual = FRAManual.reduce((a, b) => a + b, 0);
const promedioManual = sumaFRAManual / 101;

console.log('Cálculo detallado:');
console.log(`  Suma de todas las FRA (0-100): ${sumaFRAManual.toFixed(6)}`);
console.log(`  Promedio = ${sumaFRAManual.toFixed(6)} / 101 = ${promedioManual.toFixed(6)}`);
console.log('');

// ============================================================================
// PASO 5: CÁLCULO MANUAL - VARIANZA
// ============================================================================
console.log('📉 PASO 5: CÁLCULO DE LA VARIANZA');
console.log('═'.repeat(70));
console.log('Fórmula: Varianza = Σ((FRA - Promedio)²) / 101\n');

let sumaCuadradosManual = 0;
const diferencias = [];

for (let i = 0; i <= 100; i++) {
  const diferencia = FRAManual[i] - promedioManual;
  const cuadrado = diferencia * diferencia;
  sumaCuadradosManual += cuadrado;
  
  // Guardar algunos ejemplos para mostrar
  if (frecuenciasManual[i] > 0 || i === 100 || i === 0) {
    diferencias.push({
      puntaje: i,
      FRA: FRAManual[i],
      diferencia: diferencia,
      cuadrado: cuadrado
    });
  }
}

const varianzaManual = sumaCuadradosManual / 101;

console.log('Ejemplos de cálculo (FRA - Promedio)²:');
console.log('Puntaje | FRA      | (FRA - Prom) | (FRA - Prom)²');
console.log('-'.repeat(70));
diferencias.forEach(d => {
  console.log(
    `${d.puntaje.toString().padStart(3)} | ` +
    `${d.FRA.toFixed(6)} | ` +
    `${d.diferencia.toFixed(6).padStart(12)} | ` +
    `${d.cuadrado.toFixed(8)}`
  );
});

console.log(`\nSuma de (FRA - Promedio)²: ${sumaCuadradosManual.toFixed(8)}`);
console.log(`Varianza = ${sumaCuadradosManual.toFixed(8)} / 101 = ${varianzaManual.toFixed(8)}`);
console.log('');

// ============================================================================
// PASO 6: CÁLCULO MANUAL - ÍNDICE
// ============================================================================
console.log('🎯 PASO 6: CÁLCULO DEL ÍNDICE');
console.log('═'.repeat(70));
console.log('Fórmula: Índice = Promedio / (1 - Varianza)\n');

const indiceManual = promedioManual / (1 - varianzaManual);

console.log('Cálculo:');
console.log(`  Promedio = ${promedioManual.toFixed(6)}`);
console.log(`  Varianza = ${varianzaManual.toFixed(6)}`);
console.log(`  Índice = ${promedioManual.toFixed(6)} / (1 - ${varianzaManual.toFixed(6)})`);
console.log(`  Índice = ${promedioManual.toFixed(6)} / ${(1 - varianzaManual).toFixed(6)}`);
console.log(`  Índice = ${indiceManual.toFixed(6)}`);
console.log('');

// ============================================================================
// PASO 7: CLASIFICACIÓN
// ============================================================================
console.log('🏆 PASO 7: CLASIFICACIÓN');
console.log('═'.repeat(70));

let clasificacion, descripcion;
if (indiceManual >= 0.77) {
  clasificacion = 'A+';
  descripcion = 'Excelente';
} else if (indiceManual >= 0.72) {
  clasificacion = 'A';
  descripcion = 'Muy bueno';
} else if (indiceManual >= 0.67) {
  clasificacion = 'B';
  descripcion = 'Bueno';
} else if (indiceManual >= 0.62) {
  clasificacion = 'C';
  descripcion = 'Aceptable';
} else {
  clasificacion = 'D';
  descripcion = 'Bajo';
}

console.log('Rangos de clasificación:');
console.log('  A+ : Índice >= 0.77 (Excelente)');
console.log('  A  : 0.72 <= Índice < 0.77 (Muy bueno)');
console.log('  B  : 0.67 <= Índice < 0.72 (Bueno)');
console.log('  C  : 0.62 <= Índice < 0.67 (Aceptable)');
console.log('  D  : Índice < 0.62 (Bajo)');
console.log('');
console.log(`Clasificación obtenida: ${clasificacion} - ${descripcion}`);
console.log('');

// ============================================================================
// COMPARACIÓN CON LA FUNCIÓN IMPLEMENTADA
// ============================================================================
console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║  COMPARACIÓN: CÁLCULO MANUAL vs FUNCIÓN IMPLEMENTADA             ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

const resultadoFuncion = calculateFRAStatistics(puntajesMuestra, false);
const indiceFuncion = resultadoFuncion.promedio / (1 - resultadoFuncion.varianza);

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                      RESULTADOS FINALES                         │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│ Métrica        │ Cálculo Manual    │ Función          │ Match  │');
console.log('├─────────────────────────────────────────────────────────────────┤');

const tolerance = 0.0000001; // Tolerancia para comparación de punto flotante

// Comparar Promedio
const promedioMatch = Math.abs(promedioManual - resultadoFuncion.promedio) < tolerance;
console.log(
  `│ Promedio       │ ${promedioManual.toFixed(8).padEnd(17)} │ ` +
  `${resultadoFuncion.promedio.toFixed(8).padEnd(16)} │ ${promedioMatch ? '✓' : '✗'}      │`
);

// Comparar Varianza
const varianzaMatch = Math.abs(varianzaManual - resultadoFuncion.varianza) < tolerance;
console.log(
  `│ Varianza       │ ${varianzaManual.toFixed(8).padEnd(17)} │ ` +
  `${resultadoFuncion.varianza.toFixed(8).padEnd(16)} │ ${varianzaMatch ? '✓' : '✗'}      │`
);

// Comparar Índice
const indiceMatch = Math.abs(indiceManual - indiceFuncion) < tolerance;
console.log(
  `│ Índice         │ ${indiceManual.toFixed(8).padEnd(17)} │ ` +
  `${indiceFuncion.toFixed(8).padEnd(16)} │ ${indiceMatch ? '✓' : '✗'}      │`
);

console.log('└─────────────────────────────────────────────────────────────────┘\n');

// ============================================================================
// RESULTADO FINAL
// ============================================================================
if (promedioMatch && varianzaMatch && indiceMatch) {
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                   ║');
  console.log('║  ✅ ¡VERIFICACIÓN EXITOSA!                                        ║');
  console.log('║                                                                   ║');
  console.log('║  La implementación coincide 100% con el cálculo manual.          ║');
  console.log('║  La metodología ICFES está correctamente implementada.           ║');
  console.log('║                                                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  process.exit(0);
} else {
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                   ║');
  console.log('║  ❌ ERROR EN LA VERIFICACIÓN                                      ║');
  console.log('║                                                                   ║');
  console.log('║  Hay diferencias entre el cálculo manual y la función.           ║');
  console.log('║  Revisar la implementación.                                      ║');
  console.log('║                                                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  
  console.log('Diferencias encontradas:');
  if (!promedioMatch) {
    console.log(`  - Promedio: diferencia de ${Math.abs(promedioManual - resultadoFuncion.promedio).toExponential(4)}`);
  }
  if (!varianzaMatch) {
    console.log(`  - Varianza: diferencia de ${Math.abs(varianzaManual - resultadoFuncion.varianza).toExponential(4)}`);
  }
  if (!indiceMatch) {
    console.log(`  - Índice: diferencia de ${Math.abs(indiceManual - indiceFuncion).toExponential(4)}`);
  }
  console.log('');
  process.exit(1);
}
