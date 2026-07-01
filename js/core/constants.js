/**
 * LU5CTW RF Lab — Constantes físicas fundamentales
 * Valores exactos según el Sistema Internacional.
 */

/** Velocidad de la luz en el vacío (m/s) — valor exacto */
export const SPEED_OF_LIGHT = 299_792_458;

/** Unidades de frecuencia y su factor de conversión a Hz */
export const FREQUENCY_UNITS = {
  Hz: 1,
  kHz: 1e3,
  MHz: 1e6,
  GHz: 1e9,
};

/** Fracciones de longitud de onda para la tabla de resultados */
export const WAVELENGTH_FRACTIONS = [
  { label: '1/32 λ', value: 1 / 32 },
  { label: '1/16 λ', value: 1 / 16 },
  { label: '1/8 λ', value: 1 / 8 },
  { label: '3/16 λ', value: 3 / 16 },
  { label: '1/4 λ', value: 1 / 4 },
  { label: '5/16 λ', value: 5 / 16 },
  { label: '3/8 λ', value: 3 / 8 },
  { label: '7/16 λ', value: 7 / 16 },
  { label: '1/2 λ', value: 1 / 2 },
  { label: '9/16 λ', value: 9 / 16 },
  { label: '5/8 λ', value: 5 / 8 },
  { label: '11/16 λ', value: 11 / 16 },
  { label: '3/4 λ', value: 3 / 4 },
  { label: '13/16 λ', value: 13 / 16 },
  { label: '7/8 λ', value: 7 / 8 },
  { label: '15/16 λ', value: 15 / 16 },
  { label: '1 λ', value: 1 },
  { label: '1.5 λ', value: 1.5 },
  { label: '2 λ', value: 2 },
  { label: '2.5 λ', value: 2.5 },
  { label: '3 λ', value: 3 },
  { label: '4 λ', value: 4 },
  { label: '5 λ', value: 5 },
];

/** Márgenes de construcción predefinidos (%) */
export const CONSTRUCTION_MARGINS = [0, 3, 5, 10, 15];

/** Margen de construcción por defecto (%) */
export const DEFAULT_CONSTRUCTION_MARGIN = 10;
