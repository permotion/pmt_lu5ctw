/**
 * LU5CTW RF Lab — Presets de frecuencia
 * Valores en Hz para conversión interna.
 */

export const FREQUENCY_PRESETS = [
  { id: 'custom', label: 'Custom', frequencyHz: null },
  { id: 'meshtastic-lf', label: 'Meshtastic Argentina LongFast', frequencyHz: 918.125e6 },
  { id: 'meshtastic-mf', label: 'Meshtastic Argentina MediumFast', frequencyHz: 926.125e6 },
  { id: 'meshtastic-center', label: 'Centro Meshtastic Argentina', frequencyHz: 922.125e6 },
  { id: 'lora-eu', label: 'LoRa EU (868 MHz)', frequencyHz: 868e6 },
  { id: 'lora-us', label: 'LoRa US (915 MHz)', frequencyHz: 915e6 },
  { id: 'ads-b', label: 'ADS-B (1090 MHz)', frequencyHz: 1090e6 },
  { id: 'aprs', label: 'APRS (144.39 MHz)', frequencyHz: 144.39e6 },
  { id: 'vhf-145', label: 'VHF 145 MHz', frequencyHz: 145e6 },
  { id: 'uhf-433', label: 'UHF 433 MHz', frequencyHz: 433e6 },
  { id: 'gps-l1', label: 'GPS L1 (1575.42 MHz)', frequencyHz: 1575.42e6 },
  { id: 'bluetooth', label: 'Bluetooth (2.4 GHz)', frequencyHz: 2.4e9 },
  { id: 'wifi', label: 'WiFi (2.45 GHz)', frequencyHz: 2.45e9 },
];

/**
 * Convierte un valor de frecuencia a Hz según la unidad indicada.
 * @param {number} value
 * @param {string} unit - Hz | kHz | MHz | GHz
 * @returns {number}
 */
export function toHertz(value, unit) {
  const factors = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };
  return value * (factors[unit] ?? 1);
}

/**
 * Convierte Hz a la unidad más legible para mostrar.
 * @param {number} hz
 * @returns {{ value: number, unit: string }}
 */
export function fromHertz(hz) {
  if (hz >= 1e9) return { value: hz / 1e9, unit: 'GHz' };
  if (hz >= 1e6) return { value: hz / 1e6, unit: 'MHz' };
  if (hz >= 1e3) return { value: hz / 1e3, unit: 'kHz' };
  return { value: hz, unit: 'Hz' };
}
