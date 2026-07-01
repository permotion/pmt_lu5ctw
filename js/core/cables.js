/**
 * LU5CTW RF Lab — Base de datos de cables coaxiales
 * Z0 en Ω, VF adimensional (0–1), atenuación típica en dB/m a ~1 GHz.
 * Los valores son aproximaciones de catálogo; el usuario puede editarlos.
 */

export const CABLE_TYPES = [
  {
    id: 'rg58',
    label: 'RG-58',
    z0: 50,
    vf: 0.66,
    attenuationDbPerM: 0.25,
    dielectric: 'PE sólido',
  },
  {
    id: 'rg174',
    label: 'RG-174',
    z0: 50,
    vf: 0.66,
    attenuationDbPerM: 0.55,
    dielectric: 'PE sólido',
  },
  {
    id: 'rg213',
    label: 'RG-213',
    z0: 50,
    vf: 0.66,
    attenuationDbPerM: 0.12,
    dielectric: 'PE sólido',
  },
  {
    id: 'rg316',
    label: 'RG-316 PTFE',
    z0: 50,
    vf: 0.695,
    attenuationDbPerM: 0.35,
    dielectric: 'PTFE',
  },
  {
    id: 'lmr195',
    label: 'LMR-195',
    z0: 50,
    vf: 0.83,
    attenuationDbPerM: 0.22,
    dielectric: 'Espuma PE',
  },
  {
    id: 'lmr240',
    label: 'LMR-240',
    z0: 50,
    vf: 0.84,
    attenuationDbPerM: 0.14,
    dielectric: 'Espuma PE',
  },
  {
    id: 'lmr400',
    label: 'LMR-400',
    z0: 50,
    vf: 0.85,
    attenuationDbPerM: 0.07,
    dielectric: 'Espuma PE',
  },
  {
    id: 'rg6',
    label: 'RG-6',
    z0: 75,
    vf: 0.83,
    attenuationDbPerM: 0.10,
    dielectric: 'Espuma PE',
  },
  {
    id: 'rg59',
    label: 'RG-59',
    z0: 75,
    vf: 0.66,
    attenuationDbPerM: 0.20,
    dielectric: 'PE sólido',
  },
  {
    id: 'heliax',
    label: 'Heliax (½")',
    z0: 50,
    vf: 0.88,
    attenuationDbPerM: 0.03,
    dielectric: 'Espuma PE / aire',
  },
  {
    id: 'custom',
    label: 'Custom',
    z0: 50,
    vf: 0.66,
    attenuationDbPerM: 0,
    dielectric: 'Personalizado',
  },
];

/**
 * Busca un cable por su id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getCableById(id) {
  return CABLE_TYPES.find((c) => c.id === id);
}
