/**
 * LU5CTW RF Lab — Utilidades de formato numérico
 */

/**
 * Formatea un número con decimales controlados.
 * @param {number} value
 * @param {number} [decimals=4]
 * @returns {string}
 */
export function formatNumber(value, decimals = 4) {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
    return value.toExponential(decimals);
  }
  return value.toFixed(decimals).replace(/\.?0+$/, '') || '0';
}

/**
 * Formatea una longitud en metros con unidades automáticas.
 * @param {number} meters
 * @returns {string}
 */
export function formatLength(meters) {
  if (!Number.isFinite(meters)) return '—';
  if (meters >= 1) return `${formatNumber(meters, 4)} m`;
  if (meters >= 0.001) return `${formatNumber(meters * 100, 3)} cm`;
  return `${formatNumber(meters * 1000, 2)} mm`;
}

/**
 * Formatea grados eléctricos.
 * @param {number} degrees
 * @returns {string}
 */
export function formatDegrees(degrees) {
  if (!Number.isFinite(degrees)) return '—';
  return `${formatNumber(degrees, 2)}°`;
}

/**
 * Formatea dB.
 * @param {number} db
 * @returns {string}
 */
export function formatDb(db) {
  if (!Number.isFinite(db)) return '—';
  return `${formatNumber(db, 3)} dB`;
}

/**
 * Formatea porcentaje.
 * @param {number} pct
 * @returns {string}
 */
export function formatPercent(pct) {
  if (!Number.isFinite(pct)) return '—';
  return `${formatNumber(pct, 2)} %`;
}
