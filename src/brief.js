import { MARKET } from './market.js';
export const project = {
  name: 'PADS Audience Lab',
  brand: 'JGB',
  market: 'Colombia',
  planningUniverse: MARKET.planningUniverse,
  universeSource: 'Base nacional de comunicación: población DANE 2027 y estimación propia con tasas TIC 2025; compradores por validar.',
  allocation: null,
  geographyAllocation: null,
  tribeAllocation: null,
  budget: null,
  visualDirection: 'A · Skin Lab',
  source: 'Estrategia de comunicación PADs JGB V2(1).pdf',
};

export const products = [
  {
    id: 'limpieza',
    name: 'Pads',
    step: '01',
    role: 'Limpiar',
    description: 'Pads de algodón para el paso de limpieza y desmaquillado.',
    territory: 'Quitarme el día de encima',
    assets: ['assets/pads-redondos.png', 'assets/pads-cuadrados.png'],
    briefPages: [22, 23, 24],
  },
  {
    id: 'control-poros',
    name: 'Pads Control Poros',
    step: '02',
    role: 'Tratar',
    description: 'Un paso específico para el cuidado de los poros, después de la limpieza.',
    territory: 'Lo esencial de la rutina',
    assets: ['assets/pads-control-poros.png'],
    briefPages: [17, 18, 19, 22, 23, 24],
  },
];

// Editorial planning hypotheses based on the brief. They are not measured
// audiences or guaranteed selectable advertising-platform interests.
export const audiences = [
  { id: 'productivas', name: 'Vida laboral', context: 'Trabajo y ritmo cotidiano', need: 'Practicidad y un momento propio', message: 'El cuidado también tiene un lugar en tu día.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'madres', name: 'Madres y padres', context: 'Equilibrio entre responsabilidades y autocuidado', need: 'Confianza y sencillez', message: 'Un momento para cuidar de ti.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'deportistas', name: 'Deportistas', context: 'Una vida activa', need: 'Una rutina que acompañe su ritmo', message: 'Tu día se mueve. Tu cuidado te acompaña.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'viajeras', name: 'Viajes', context: 'Cambios de entorno y rutinas fuera de casa', need: 'Practicidad y continuidad', message: 'Tu momento de cuidado, donde estés.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'estudiantes', name: 'Estudiantes', context: 'Construcción de hábitos y exploración de tendencias', need: 'Comprender el producto y su lugar en la rutina', message: 'Conoce el paso que estás sumando a tu rutina.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
];

export const channels = [
  { id: 'meta', name: 'Meta', role: 'Demostración de los dos pasos y momentos cotidianos', format: 'Video corto y carrusel educativo' },
  { id: 'youtube', name: 'YouTube', role: 'Explicar diferencias y construir comprensión', format: 'Video de demostración y piezas breves' },
  { id: 'tiktok', name: 'TikTok', role: 'Descubrimiento con creadores y contenido de rutina', format: 'Video vertical de uso contextual' },
  { id: 'pinterest', name: 'Pinterest', role: 'Inspiración y organización de rutinas', format: 'Piezas guardables' },
  { id: 'ctv', name: 'CTV', role: 'Construcción de conocimiento del portafolio', format: 'Video de marca' },
];
