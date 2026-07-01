/**
 * LU5CTW RF Lab — UI del módulo: RF Transmission Line Calculator
 */

import { CABLE_TYPES } from '../../core/cables.js';
import { FREQUENCY_PRESETS, toHertz } from '../../core/frequency-presets.js';
import { DEFAULT_CONSTRUCTION_MARGIN, CONSTRUCTION_MARGINS } from '../../core/constants.js';
import { initExplainModal, createExplainButton } from '../../components/explain-modal.js';
import { formatLength, formatNumber, formatDegrees, formatDb, formatPercent } from '../../core/format.js';
import { EXPLANATIONS } from './explanations.js';
import {
  calculate,
  analyzeLength,
  calculateLosses,
  calculateImpedance,
  applyConstructionMargin,
  getEducationalExample,
} from './physics.js';

/** Estado actual de la calculadora */
const state = {
  mode: 'engineering',
  frequency: 922.125,
  frequencyUnit: 'MHz',
  frequencyPreset: 'meshtastic-center',
  cableId: 'rg316',
  z0: 50,
  vf: 0.695,
  attenuationDbPerM: 0.35,
  marginPercent: DEFAULT_CONSTRUCTION_MARGIN,
  customMargin: false,
  inputLength: '',
  inputLengthUnit: 'm',
  lossLength: '',
  impedanceR: 50,
  impedanceX: 0,
};

/** Referencias DOM cacheadas */
const dom = {};

/**
 * Inicializa el módulo de calculadora de línea de transmisión.
 */
export function initTransmissionLineApp() {
  cacheDom();
  initExplainModal();
  renderEducationalSection();
  bindEvents();
  loadCablePreset('rg316');
  loadFrequencyPreset('meshtastic-center');
  recalculate();
}

/** Cachea referencias a elementos del DOM. */
function cacheDom() {
  dom.modeBtns = document.querySelectorAll('.mode-toggle__btn');
  dom.marginSection = document.getElementById('margin-section');
  dom.marginChips = document.getElementById('margin-chips');
  dom.customMarginInput = document.getElementById('custom-margin');
  dom.frequencyInput = document.getElementById('frequency');
  dom.frequencyUnit = document.getElementById('frequency-unit');
  dom.frequencyPreset = document.getElementById('frequency-preset');
  dom.cableSelect = document.getElementById('cable-type');
  dom.z0Input = document.getElementById('z0');
  dom.vfInput = document.getElementById('vf');
  dom.attenuationInput = document.getElementById('attenuation');
  dom.resultsGrid = document.getElementById('results-grid');
  dom.fractionTable = document.getElementById('fraction-table-body');
  dom.reverseSection = document.getElementById('reverse-results');
  dom.lossSection = document.getElementById('loss-results');
  dom.impedanceSection = document.getElementById('impedance-results');
  dom.inputLength = document.getElementById('input-length');
  dom.inputLengthUnit = document.getElementById('input-length-unit');
  dom.lossLength = document.getElementById('loss-length');
  dom.impedanceR = document.getElementById('impedance-r');
  dom.impedanceX = document.getElementById('impedance-x');
}

/** Renderiza la sección educativa con el ejemplo paso a paso. */
function renderEducationalSection() {
  const container = document.getElementById('edu-example');
  if (!container) return;

  const ex = getEducationalExample();
  container.innerHTML = `
    <div class="edu-example__title">Ejemplo: 922.125 MHz + RG-316 PTFE (VF = 0.695)</div>
    <div class="edu-example__step">
      <span class="label">1. λ en aire = c / f = </span>
      299 792 458 / 922 125 000 = <strong>${formatLength(ex.lambdaAir)}</strong>
    </div>
    <div class="edu-example__step">
      <span class="label">2. λ en cable = λ<sub>aire</sub> × VF = </span>
      ${formatNumber(ex.lambdaAir * 100, 4)} cm × 0.695 = <strong>${formatLength(ex.lambdaCable)}</strong>
    </div>
    <div class="edu-example__step">
      <span class="label">3. Longitud λ/4 (ingeniería) = </span>
      ${formatLength(ex.lambdaCable)} / 4 = <strong>${formatLength(ex.quarterWave)}</strong>
    </div>
    <div class="edu-example__step">
      <span class="label">4. Longitud λ/4 (construcción +10%) = </span>
      ${formatLength(ex.quarterWave)} × 1.10 = <strong>${formatLength(ex.quarterConstruction)}</strong>
    </div>
  `;
}

/** Vincula todos los event listeners. */
function bindEvents() {
  // Modo ingeniería / construcción
  dom.modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      dom.modeBtns.forEach((b) => b.classList.toggle('mode-toggle__btn--active', b === btn));
      dom.marginSection.hidden = state.mode !== 'construction';
      recalculate();
    });
  });

  // Márgenes de construcción
  renderMarginChips();
  dom.customMarginInput.addEventListener('input', () => {
    state.marginPercent = parseFloat(dom.customMarginInput.value) || 0;
    state.customMargin = true;
    updateMarginChips();
    recalculate();
  });

  // Frecuencia
  dom.frequencyInput.addEventListener('input', () => {
    state.frequency = parseFloat(dom.frequencyInput.value) || 0;
    state.frequencyPreset = 'custom';
    dom.frequencyPreset.value = 'custom';
    recalculate();
  });
  dom.frequencyUnit.addEventListener('change', () => {
    state.frequencyUnit = dom.frequencyUnit.value;
    recalculate();
  });
  dom.frequencyPreset.addEventListener('change', () => {
    loadFrequencyPreset(dom.frequencyPreset.value);
    recalculate();
  });

  // Cable
  dom.cableSelect.addEventListener('change', () => {
    loadCablePreset(dom.cableSelect.value);
    recalculate();
  });
  [dom.z0Input, dom.vfInput, dom.attenuationInput].forEach((el) => {
    el.addEventListener('input', () => {
      state.z0 = parseFloat(dom.z0Input.value) || 50;
      state.vf = parseFloat(dom.vfInput.value) || 0.66;
      state.attenuationDbPerM = parseFloat(dom.attenuationInput.value) || 0;
      recalculate();
    });
  });

  // Análisis inverso, pérdidas, impedancia
  dom.inputLength.addEventListener('input', recalculate);
  dom.inputLengthUnit.addEventListener('change', recalculate);
  dom.lossLength.addEventListener('input', recalculate);
  dom.impedanceR.addEventListener('input', recalculate);
  dom.impedanceX.addEventListener('input', recalculate);

  // Botones de explicación estáticos en resultados principales
  attachExplainButtons();
}

/** Renderiza chips de margen de construcción. */
function renderMarginChips() {
  dom.marginChips.innerHTML = '';
  CONSTRUCTION_MARGINS.forEach((margin) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = `+${margin}%`;
    chip.dataset.margin = margin;
    if (margin === state.marginPercent) chip.classList.add('chip--active');
    chip.addEventListener('click', () => {
      state.marginPercent = margin;
      state.customMargin = false;
      dom.customMarginInput.value = margin;
      updateMarginChips();
      recalculate();
    });
    dom.marginChips.appendChild(chip);
  });

  const customChip = document.createElement('button');
  customChip.type = 'button';
  customChip.className = 'chip';
  customChip.textContent = 'Custom';
  customChip.addEventListener('click', () => {
    state.customMargin = true;
    dom.customMarginInput.focus();
    updateMarginChips();
  });
  dom.marginChips.appendChild(customChip);
}

/** Actualiza estado visual de los chips de margen. */
function updateMarginChips() {
  dom.marginChips.querySelectorAll('.chip').forEach((chip) => {
    const m = chip.dataset.margin;
    chip.classList.toggle('chip--active', !state.customMargin && m && parseInt(m) === state.marginPercent);
    if (chip.textContent === 'Custom') {
      chip.classList.toggle('chip--active', state.customMargin);
    }
  });
}

/** Carga un preset de frecuencia. */
function loadFrequencyPreset(presetId) {
  const preset = FREQUENCY_PRESETS.find((p) => p.id === presetId);
  if (!preset || preset.frequencyHz === null) return;

  state.frequencyPreset = presetId;
  const mhz = preset.frequencyHz / 1e6;
  state.frequency = mhz;
  state.frequencyUnit = 'MHz';
  dom.frequencyInput.value = mhz;
  dom.frequencyUnit.value = 'MHz';
  dom.frequencyPreset.value = presetId;
}

/** Carga parámetros de un tipo de cable. */
function loadCablePreset(cableId) {
  const cable = CABLE_TYPES.find((c) => c.id === cableId);
  if (!cable) return;

  state.cableId = cableId;
  state.z0 = cable.z0;
  state.vf = cable.vf;
  state.attenuationDbPerM = cable.attenuationDbPerM;
  dom.cableSelect.value = cableId;
  dom.z0Input.value = cable.z0;
  dom.vfInput.value = cable.vf;
  dom.attenuationInput.value = cable.attenuationDbPerM;
}

/** Adjunta botones "¿Qué significa?" a etiquetas de resultados. */
function attachExplainButtons() {
  const mappings = [
    ['explain-wavelength-air', EXPLANATIONS.wavelengthAir],
    ['explain-wavelength-cable', EXPLANATIONS.wavelengthCable],
    ['explain-velocity', EXPLANATIONS.propagationVelocity],
    ['explain-delay', EXPLANATIONS.delay],
    ['explain-degrees', EXPLANATIONS.electricalDegrees],
    ['explain-vf', EXPLANATIONS.velocityFactor],
    ['explain-reverse', EXPLANATIONS.reverseLength],
    ['explain-loss', EXPLANATIONS.cableLoss],
    ['explain-gamma', EXPLANATIONS.reflectionCoefficient],
    ['explain-rl', EXPLANATIONS.returnLoss],
    ['explain-vswr', EXPLANATIONS.vswr],
  ];

  mappings.forEach(([id, exp]) => {
    const el = document.getElementById(id);
    if (el) el.appendChild(createExplainButton(exp.title, exp.html));
  });
}

/** Ejecuta todos los cálculos y actualiza la UI. */
function recalculate() {
  const frequencyHz = toHertz(state.frequency, state.frequencyUnit);
  const margin = state.mode === 'construction' ? state.marginPercent : 0;

  const results = calculate({
    frequencyHz,
    velocityFactor: state.vf,
    marginPercent: margin,
  });

  renderMainResults(results, margin);
  renderFractionTable(results.fractionTable);
  renderReverseAnalysis(results.lambdaCable);
  renderLossAnalysis();
  renderImpedanceAnalysis();
}

/** Renderiza los resultados principales. */
function renderMainResults(results, margin) {
  const quarterWave = results.lambdaCable / 4;
  const quarterConstruction = applyConstructionMargin(quarterWave, margin);

  dom.resultsGrid.innerHTML = `
    <div class="result-item">
      <div class="result-item__label">Longitud de onda en aire</div>
      <div class="result-item__value">${formatLength(results.lambdaAir)}</div>
    </div>
    <div class="result-item">
      <div class="result-item__label">Longitud de onda en cable</div>
      <div class="result-item__value">${formatLength(results.lambdaCable)}</div>
    </div>
    <div class="result-item">
      <div class="result-item__label">Velocidad de propagación</div>
      <div class="result-item__value">${formatNumber(results.velocity / 1e6, 4)}</div>
      <div class="result-item__unit">× 10⁶ m/s (${formatPercent(state.vf * 100)} de c)</div>
    </div>
    <div class="result-item">
      <div class="result-item__label">Retardo por metro</div>
      <div class="result-item__value">${formatNumber(results.delayNsPerM, 3)}</div>
      <div class="result-item__unit">ns/m</div>
    </div>
    <div class="result-item">
      <div class="result-item__label">λ/4 eléctrico</div>
      <div class="result-item__value">${formatLength(quarterWave)}</div>
      <div class="result-item__unit">90° — ${state.mode === 'construction' ? `Construcción: ${formatLength(quarterConstruction)}` : 'Modo Ingeniería'}</div>
    </div>
    <div class="result-item">
      <div class="result-item__label">Grados por centímetro</div>
      <div class="result-item__value">${formatNumber((0.01 / results.lambdaCable) * 360, 2)}</div>
      <div class="result-item__unit">°/cm en el cable</div>
    </div>
  `;
}

/** Renderiza la tabla de fracciones de λ. */
function renderFractionTable(rows) {
  dom.fractionTable.innerHTML = rows
    .map(
      (row) => `
    <tr>
      <td class="col-fraction">${row.label}</td>
      <td>${formatLength(row.exactLength)}</td>
      <td>${state.mode === 'construction' ? formatLength(row.constructionLength) : '—'}</td>
      <td>${formatDegrees(row.degrees)}</td>
      <td class="col-comment">${row.comment}</td>
    </tr>
  `
    )
    .join('');
}

/** Renderiza el análisis inverso de longitud ingresada. */
function renderReverseAnalysis(lambdaCable) {
  const lengthValue = parseFloat(dom.inputLength.value);
  if (!lengthValue || lengthValue <= 0) {
    dom.reverseSection.innerHTML = '<p class="info-box">Ingresa una longitud para ver el análisis eléctrico.</p>';
    return;
  }

  const lengthMeters = convertToMeters(lengthValue, dom.inputLengthUnit.value);
  const analysis = analyzeLength(lengthMeters, lambdaCable);

  if (!analysis) {
    dom.reverseSection.innerHTML = '<p class="info-box">No se pudo analizar la longitud ingresada.</p>';
    return;
  }

  dom.reverseSection.innerHTML = `
    <div class="results-grid">
      <div class="result-item">
        <div class="result-item__label">Longitud eléctrica</div>
        <div class="result-item__value">${formatNumber(analysis.electricalLength, 4)} λ</div>
      </div>
      <div class="result-item">
        <div class="result-item__label">Grados eléctricos</div>
        <div class="result-item__value">${formatDegrees(analysis.degrees)}</div>
      </div>
      <div class="result-item">
        <div class="result-item__label">Fracción más cercana</div>
        <div class="result-item__value">${analysis.closestFraction}</div>
        <div class="result-item__unit">Error: ${formatNumber(analysis.errorFromClosestFraction * lambdaCable * 100, 2)} cm</div>
      </div>
      <div class="result-item">
        <div class="result-item__label">Múltiplo entero más cercano</div>
        <div class="result-item__value">${analysis.nearestMultiple} λ</div>
        <div class="result-item__unit">Error: ${formatNumber(analysis.errorFromMultiple, 4)} λ (${formatPercent(analysis.errorPercent)})</div>
      </div>
    </div>
  `;
}

/** Renderiza el análisis de pérdidas. */
function renderLossAnalysis() {
  const lengthValue = parseFloat(dom.lossLength.value);
  if (!lengthValue || lengthValue <= 0 || !state.attenuationDbPerM) {
    dom.lossSection.innerHTML =
      '<p class="info-box">Ingresa una longitud y asegúrate de que la atenuación del cable sea mayor a 0.</p>';
    return;
  }

  const losses = calculateLosses(state.attenuationDbPerM, lengthValue);
  if (!losses) return;

  dom.lossSection.innerHTML = `
    <div class="results-grid">
      <div class="result-item">
        <div class="result-item__label">Pérdida total</div>
        <div class="result-item__value">${formatDb(losses.totalLossDb)}</div>
        <div class="result-item__unit">${formatNumber(lengthValue, 2)} m × ${formatNumber(state.attenuationDbPerM, 3)} dB/m</div>
      </div>
      <div class="result-item">
        <div class="result-item__label">Potencia entregada</div>
        <div class="result-item__value">${formatPercent(losses.powerDeliveredPercent)}</div>
      </div>
      <div class="result-item">
        <div class="result-item__label">Potencia perdida</div>
        <div class="result-item__value">${formatPercent(losses.powerLostPercent)}</div>
      </div>
    </div>
  `;
}

/** Renderiza el análisis de impedancias. */
function renderImpedanceAnalysis() {
  const r = parseFloat(dom.impedanceR.value);
  const x = parseFloat(dom.impedanceX.value);

  const imp = calculateImpedance(state.z0, r, x);
  if (!imp) {
    dom.impedanceSection.innerHTML = '<p class="info-box">Ingresa valores de impedancia válidos.</p>';
    return;
  }

  const rlDisplay = Number.isFinite(imp.returnLossDb) && imp.returnLossDb < 100
    ? formatDb(imp.returnLossDb)
    : '∞ dB (acoplamiento perfecto)';

  dom.impedanceSection.innerHTML = `
    <div class="results-grid">
      <div class="result-item">
        <div class="result-item__label">Coeficiente de reflexión |Γ|</div>
        <div class="result-item__value">${formatNumber(imp.gammaMag, 4)}</div>
        <div class="result-item__unit">∠${formatDegrees(imp.gammaAngleDeg)}</div>
      </div>
      <div class="result-item">
        <div class="result-item__label">Return Loss</div>
        <div class="result-item__value">${rlDisplay}</div>
      </div>
      <div class="result-item">
        <div class="result-item__label">VSWR</div>
        <div class="result-item__value">${formatNumber(imp.vswr, 3)} : 1</div>
      </div>
    </div>
  `;
}

/**
 * Convierte longitud a metros.
 * @param {number} value
 * @param {string} unit
 * @returns {number}
 */
function convertToMeters(value, unit) {
  const factors = { m: 1, cm: 0.01, mm: 0.001 };
  return value * (factors[unit] ?? 1);
}

/** Puebla los selects de cable y frecuencia en el HTML. */
export function populateSelects() {
  const cableSelect = document.getElementById('cable-type');
  const freqPreset = document.getElementById('frequency-preset');

  if (cableSelect) {
    cableSelect.innerHTML = CABLE_TYPES.map(
      (c) => `<option value="${c.id}">${c.label}</option>`
    ).join('');
  }

  if (freqPreset) {
    freqPreset.innerHTML = FREQUENCY_PRESETS.map(
      (p) => `<option value="${p.id}">${p.label}</option>`
    ).join('');
  }
}
