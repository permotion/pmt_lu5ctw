/**
 * LU5CTW RF Lab — Motor de cálculo: Línea de transmisión RF
 * Fórmulas físicas exactas. El margen de construcción NO altera la física.
 */

import { SPEED_OF_LIGHT, WAVELENGTH_FRACTIONS } from '../../core/constants.js';

/**
 * Calcula la longitud de onda en el aire (m).
 * λ_aire = c / f
 * @param {number} frequencyHz
 * @returns {number}
 */
export function wavelengthInAir(frequencyHz) {
  if (!frequencyHz || frequencyHz <= 0) return NaN;
  return SPEED_OF_LIGHT / frequencyHz;
}

/**
 * Calcula la longitud de onda en el cable (m).
 * λ_cable = λ_aire × VF
 * @param {number} wavelengthAir
 * @param {number} velocityFactor
 * @returns {number}
 */
export function wavelengthInCable(wavelengthAir, velocityFactor) {
  if (!Number.isFinite(wavelengthAir) || !velocityFactor) return NaN;
  return wavelengthAir * velocityFactor;
}

/**
 * Velocidad de propagación en el medio (m/s).
 * v = c × VF
 * @param {number} velocityFactor
 * @returns {number}
 */
export function propagationVelocity(velocityFactor) {
  return SPEED_OF_LIGHT * velocityFactor;
}

/**
 * Retardo de propagación por metro (ns/m).
 * @param {number} velocityFactor
 * @returns {number}
 */
export function delayPerMeter(velocityFactor) {
  const v = propagationVelocity(velocityFactor);
  if (!v) return NaN;
  return (1 / v) * 1e9;
}

/**
 * Retardo total para una longitud dada (ns).
 * @param {number} lengthMeters
 * @param {number} velocityFactor
 * @returns {number}
 */
export function totalDelay(lengthMeters, velocityFactor) {
  return delayPerMeter(velocityFactor) * lengthMeters;
}

/**
 * Grados eléctricos para una longitud física dada.
 * @param {number} lengthMeters
 * @param {number} wavelengthCable
 * @returns {number}
 */
export function electricalDegrees(lengthMeters, wavelengthCable) {
  if (!wavelengthCable || wavelengthCable <= 0) return NaN;
  return (lengthMeters / wavelengthCable) * 360;
}

/**
 * Aplica margen de construcción sobre un valor de ingeniería.
 * NO modifica fórmulas físicas; solo escala el resultado práctico.
 * @param {number} engineeringLength
 * @param {number} marginPercent
 * @returns {number}
 */
export function applyConstructionMargin(engineeringLength, marginPercent) {
  return engineeringLength * (1 + marginPercent / 100);
}

/**
 * Comentario técnico para cada fracción de λ.
 * @param {number} fraction
 * @returns {string}
 */
export function fractionComment(fraction) {
  const comments = {
    [1 / 32]: 'Longitud mínima; ajuste fino de sintonía',
    [1 / 16]: 'Stub muy corto; compensación de reactancia',
    [1 / 8]: 'Stub λ/8; transformador de impedancia',
    [3 / 16]: 'Longitud intermedia para ajuste de antena',
    [1 / 4]: 'λ/4 — resonancia; antena monopolo/dipolo cortado, stub en cortocircuito',
    [5 / 16]: 'Longitud común en antenas colineales',
    [3 / 8]: '3λ/8 — antena extended bazooka, stub intermedio',
    [7 / 16]: 'Longitud intermedia; diseño de arrays',
    [1 / 2]: 'λ/2 — dipolo resonante, repetidor de fase, antena Yagi elemento activo',
    [9 / 16]: 'Longitud intermedia para arrays direccionales',
    [5 / 8]: '5λ/8 — antena monopolo con mayor ganancia',
    [11 / 16]: 'Longitud intermedia; ajuste de hilos radiantes',
    [3 / 4]: '3λ/4 — antena monopolo λ/4 sobre plano de tierra, stub en circuito abierto',
    [13 / 16]: 'Longitud intermedia para antenas helicoidales',
    [7 / 8]: '7λ/8 — antena de alta ganancia en VHF/UHF',
    [15 / 16]: 'Casi una longitud completa; sintonía fina',
    [1]: '1λ — repetidor de onda, antena loop de perímetro completo',
    [1.5]: '1.5λ — elemento director Yagi, colineal de 2 elementos',
    [2]: '2λ — antena colineal, array de dipolos',
    [2.5]: '2.5λ — array direccional de múltiples elementos',
    [3]: '3λ — antena colineal de 3 elementos (ganancia ~7 dBi)',
    [4]: '4λ — array colineal extendido',
    [5]: '5λ — array colineal de alta ganancia',
  };
  return comments[fraction] ?? 'Fracción de longitud de onda en el cable';
}

/**
 * Genera la tabla completa de fracciones de λ.
 * @param {number} wavelengthCable - λ en el cable (m)
 * @param {number} marginPercent - margen de construcción (%)
 * @returns {Array}
 */
export function generateFractionTable(wavelengthCable, marginPercent) {
  return WAVELENGTH_FRACTIONS.map(({ label, value }) => {
    const exactLength = value * wavelengthCable;
    const constructionLength = applyConstructionMargin(exactLength, marginPercent);
    const degrees = value * 360;
    return {
      label,
      fraction: value,
      exactLength,
      constructionLength,
      degrees,
      comment: fractionComment(value),
    };
  });
}

/**
 * Análisis inverso: dado una longitud física, calcula parámetros eléctricos.
 * @param {number} lengthMeters
 * @param {number} wavelengthCable
 * @returns {object}
 */
export function analyzeLength(lengthMeters, wavelengthCable) {
  if (!lengthMeters || lengthMeters <= 0 || !wavelengthCable || wavelengthCable <= 0) {
    return null;
  }

  const electricalLength = lengthMeters / wavelengthCable;
  const degrees = electricalLength * 360;

  // Encontrar fracción más cercana de la tabla estándar
  let closestFraction = WAVELENGTH_FRACTIONS[0];
  let minError = Math.abs(electricalLength - closestFraction.value);

  for (const frac of WAVELENGTH_FRACTIONS) {
    const error = Math.abs(electricalLength - frac.value);
    if (error < minError) {
      minError = error;
      closestFraction = frac;
    }
  }

  // Múltiplo entero de λ más cercano
  const nearestMultiple = Math.round(electricalLength);
  const errorFromMultiple = electricalLength - nearestMultiple;
  const errorPercent = (errorFromMultiple / (nearestMultiple || 1)) * 100;

  return {
    electricalLength,
    degrees,
    closestFraction: closestFraction.label,
    closestFractionValue: closestFraction.value,
    errorFromClosestFraction: electricalLength - closestFraction.value,
    nearestMultiple,
    errorFromMultiple,
    errorPercent,
  };
}

/**
 * Calcula pérdidas en el cable.
 * @param {number} attenuationDbPerM
 * @param {number} lengthMeters
 * @returns {object|null}
 */
export function calculateLosses(attenuationDbPerM, lengthMeters) {
  if (!lengthMeters || lengthMeters <= 0) return null;
  if (!attenuationDbPerM || attenuationDbPerM <= 0) return null;

  const totalLossDb = attenuationDbPerM * lengthMeters;
  const powerDeliveredPercent = Math.pow(10, -totalLossDb / 10) * 100;
  const powerLostPercent = 100 - powerDeliveredPercent;

  return {
    totalLossDb,
    powerDeliveredPercent,
    powerLostPercent,
  };
}

/**
 * Calcula parámetros de impedancia: Γ, RL, VSWR.
 * Z_L = R + jX
 * @param {number} z0 - impedancia característica
 * @param {number} r - parte real de la carga
 * @param {number} x - parte imaginaria de la carga
 * @returns {object|null}
 */
export function calculateImpedance(z0, r, x) {
  if (!z0 || z0 <= 0) return null;
  if (!Number.isFinite(r) || !Number.isFinite(x)) return null;

  const numeratorReal = r - z0;
  const numeratorImag = x;
  const denominatorReal = r + z0;
  const denominatorImag = x;

  const denomMagSq =
    denominatorReal * denominatorReal + denominatorImag * denominatorImag;

  if (denomMagSq === 0) return null;

  const gammaReal =
    (numeratorReal * denominatorReal + numeratorImag * denominatorImag) / denomMagSq;
  const gammaImag =
    (numeratorImag * denominatorReal - numeratorReal * denominatorImag) / denomMagSq;

  const gammaMag = Math.sqrt(gammaReal * gammaReal + gammaImag * gammaImag);

  let returnLossDb = Infinity;
  let vswr = 1;

  if (gammaMag < 1) {
    returnLossDb = -20 * Math.log10(gammaMag);
    vswr = (1 + gammaMag) / (1 - gammaMag);
  } else if (gammaMag > 1) {
    // Onda viajante reflejada mayor que incidente (ganancia activa no física en pasivo)
    vswr = (gammaMag + 1) / (gammaMag - 1);
    returnLossDb = 0;
  }

  return {
    gammaReal,
    gammaImag,
    gammaMag,
    gammaAngleDeg: (Math.atan2(gammaImag, gammaReal) * 180) / Math.PI,
    returnLossDb,
    vswr,
  };
}

/**
 * Cálculo principal: combina todos los parámetros básicos.
 * @param {object} params
 * @returns {object}
 */
export function calculate(params) {
  const { frequencyHz, velocityFactor, marginPercent } = params;

  const lambdaAir = wavelengthInAir(frequencyHz);
  const lambdaCable = wavelengthInCable(lambdaAir, velocityFactor);
  const velocity = propagationVelocity(velocityFactor);
  const delayNsPerM = delayPerMeter(velocityFactor);

  const fractionTable = generateFractionTable(lambdaCable, marginPercent);

  return {
    lambdaAir,
    lambdaCable,
    velocity,
    delayNsPerM,
    fractionTable,
  };
}

/**
 * Ejemplo educativo con valores por defecto (922.125 MHz, RG-316 PTFE).
 * @returns {object}
 */
export function getEducationalExample() {
  const frequencyHz = 922.125e6;
  const vf = 0.695;
  const lambdaAir = wavelengthInAir(frequencyHz);
  const lambdaCable = wavelengthInCable(lambdaAir, vf);
  const quarterWave = lambdaCable / 4;
  const quarterConstruction = applyConstructionMargin(quarterWave, 10);

  return {
    frequencyHz,
    frequencyMHz: 922.125,
    vf,
    lambdaAir,
    lambdaCable,
    quarterWave,
    quarterConstruction,
  };
}
