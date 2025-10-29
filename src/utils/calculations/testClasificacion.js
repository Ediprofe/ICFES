/**
 * Script de prueba para verificar el cálculo de clasificación de plantel
 * Usa el ejemplo del documento ICFES
 */

import { calculateFRAStatistics } from './clasificacionPlantel.js';

// Ejemplo del documento ICFES (página 18-19)
const testValues = [43, 43, 44, 45, 45, 45, 48, 49, 49, 99];

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║  PRUEBA CON EJEMPLO DEL DOCUMENTO ICFES               ║');
console.log('╠════════════════════════════════════════════════════════╣');
console.log(`║  Valores: [${testValues.join(', ')}]              ║`);
console.log('╚════════════════════════════════════════════════════════╝\n');

// DEBUG MANUAL COMPLETO (según Claude)
console.log('=== DEBUG CLASIFICACIÓN (MANUAL) ===');
console.log('Puntajes originales:', testValues);
console.log('Total estudiantes:', testValues.length);

// Tabla de frecuencias
const freq = new Array(101).fill(0);
testValues.forEach(p => freq[Math.round(p)]++);
console.log('\nFrecuencias (solo no-cero):');
freq.forEach((f, i) => {
  if (f > 0) console.log(`  Puntaje ${i}: ${f}`);
});

// Frecuencias relativas
const freqRel = freq.map(f => f / testValues.length);
const sumaFreqRel = freqRel.reduce((a,b) => a+b, 0);
console.log('\nSuma Freq Rel:', sumaFreqRel.toFixed(6), '(debe ser 1.0)');

// FRA (acumulando de 100 hacia 0)
const FRA = new Array(101);
let cum = 0;
for (let i = 100; i >= 0; i--) {
  cum += freqRel[i];
  FRA[i] = cum;
}
console.log('\nFRA (algunos valores):');
console.log('  FRA[100]:', FRA[100].toFixed(4));
console.log('  FRA[99]:', FRA[99].toFixed(4));
console.log('  FRA[50]:', FRA[50].toFixed(4));
console.log('  FRA[49]:', FRA[49].toFixed(4));
console.log('  FRA[48]:', FRA[48].toFixed(4));
console.log('  FRA[45]:', FRA[45].toFixed(4));
console.log('  FRA[44]:', FRA[44].toFixed(4));
console.log('  FRA[43]:', FRA[43].toFixed(4));
console.log('  FRA[0]:', FRA[0].toFixed(4), '(debe ser 1.0)');

// Promedio
const sumFRA = FRA.reduce((a,b) => a+b, 0);
const promFRA = sumFRA / 101;
console.log('\nSuma FRA:', sumFRA.toFixed(6));
console.log('Promedio FRA:', promFRA.toFixed(6));
console.log('Promedio esperado:', 0.5149);

// Varianza
const sumCuadrados = FRA.reduce((sum, fra) => sum + Math.pow(fra - promFRA, 2), 0);
const varianzaManual = sumCuadrados / 101;
console.log('\nSuma cuadrados:', sumCuadrados.toFixed(6));
console.log('Varianza:', varianzaManual.toFixed(6));
console.log('Varianza esperada:', 0.2387);

// Índice
const indiceManual = promFRA / (1 - varianzaManual);
console.log('\nÍndice:', indiceManual.toFixed(6));
console.log('Índice esperado:', 0.6363);
console.log('=== FIN DEBUG MANUAL ===\n');

const { promedio, varianza } = calculateFRAStatistics(testValues, true);
const indice = promedio / (1 - varianza);

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  VALORES ESPERADOS (del documento)                    ║');
console.log('╠════════════════════════════════════════════════════════╣');
console.log('║  Promedio: 0.5149                                      ║');
console.log('║  Varianza: 0.2387                                      ║');
console.log('║  Índice:   0.6363                                      ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║  VALORES OBTENIDOS                                     ║');
console.log('╠════════════════════════════════════════════════════════╣');
console.log(`║  Promedio: ${promedio.toFixed(4)}                                      ║`);
console.log(`║  Varianza: ${varianza.toFixed(4)}                                      ║`);
console.log(`║  Índice:   ${indice.toFixed(4)}                                      ║`);
console.log('╚════════════════════════════════════════════════════════╝\n');

// Verificar si los valores coinciden (con tolerancia de 0.0001)
const tolerance = 0.0001;
const promedioOK = Math.abs(promedio - 0.5149) < tolerance;
const varianzaOK = Math.abs(varianza - 0.2387) < tolerance;
const indiceOK = Math.abs(indice - 0.6363) < tolerance;

if (promedioOK && varianzaOK && indiceOK) {
  console.log('✅ ¡TODOS LOS VALORES COINCIDEN! El cálculo es CORRECTO.\n');
} else {
  console.log('❌ ERROR: Los valores NO coinciden con el documento ICFES:\n');
  if (!promedioOK) console.log(`   - Promedio: esperado 0.5149, obtenido ${promedio.toFixed(4)}`);
  if (!varianzaOK) console.log(`   - Varianza: esperado 0.2387, obtenido ${varianza.toFixed(4)}`);
  if (!indiceOK) console.log(`   - Índice: esperado 0.6363, obtenido ${indice.toFixed(4)}`);
  console.log('');
}
