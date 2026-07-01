/**
 * LU5CTW RF Lab — Catálogo de herramientas
 * Cada herramienta es un módulo independiente.
 */

export const TOOLS = [
  {
    id: 'transmission-line',
    title: 'RF Transmission Line Calculator',
    description:
      'Calcula longitudes de onda, fracciones λ, pérdidas e impedancias en líneas de transmisión coaxiales.',
    icon: '📡',
    path: 'tools/transmission-line/',
    available: true,
  },
  {
    id: 'nanovna',
    title: 'NanoVNA Toolkit',
    description: 'Herramientas de medición y análisis con NanoVNA.',
    icon: '📊',
    available: false,
  },
  {
    id: 'smith-chart',
    title: 'Smith Chart Explorer',
    description: 'Explorador interactivo del diagrama de Smith.',
    icon: '⭕',
    available: false,
  },
  {
    id: 'antenna-designer',
    title: 'Antenna Designer',
    description: 'Diseño y simulación básica de antenas.',
    icon: '📶',
    available: false,
  },
  {
    id: 'balun',
    title: 'Balun Calculator',
    description: 'Cálculo de baluns y transformadores de impedancia.',
    icon: '🔄',
    available: false,
  },
  {
    id: 'coax-loss',
    title: 'Coax Loss Calculator',
    description: 'Pérdidas en cable coaxial según longitud y frecuencia.',
    icon: '📉',
    available: false,
  },
  {
    id: 'link-budget',
    title: 'Link Budget',
    description: 'Presupuesto de enlace para comunicaciones RF.',
    icon: '🔗',
    available: false,
  },
  {
    id: 'adsb',
    title: 'ADS-B Tools',
    description: 'Utilidades para recepción ADS-B en 1090 MHz.',
    icon: '✈️',
    available: false,
  },
  {
    id: 'meshtastic',
    title: 'Meshtastic Tools',
    description: 'Herramientas específicas para redes Meshtastic.',
    icon: '🌐',
    available: false,
  },
  {
    id: 'sdr',
    title: 'SDR Tools',
    description: 'Utilidades para radio definida por software.',
    icon: '📻',
    available: false,
  },
  {
    id: 'cheat-sheets',
    title: 'RF Cheat Sheets',
    description: 'Referencia rápida de fórmulas y tablas RF.',
    icon: '📋',
    available: false,
  },
];
