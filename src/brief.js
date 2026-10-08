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
  { id: 'productivas', name: 'Vida laboral', context: 'Beauty after work · rutinas faciales y bienestar sofisticado', need: 'Un ritual de belleza al final del día', message: 'Tu rutina de skincare también tiene su momento.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'madres', name: 'Madres y padres', context: 'Self-care sofisticado · cuidado personal sin estereotipos', need: 'Una pausa propia, con intención y bienestar', message: 'El autocuidado también es un ritual personal.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'deportistas', name: 'Deportistas', context: 'Active beauty · fitness, wellness y cuidado facial', need: 'Belleza en movimiento y limpieza postentrenamiento', message: 'Después del movimiento, vuelve a tu ritual.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'viajeras', name: 'Viajes', context: 'Beauty on the go · neceseres, cosmética y viajes', need: 'Conservar el ritual beauty en cualquier destino', message: 'Tu ritual de belleza también viaja contigo.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
  { id: 'estudiantes', name: 'Estudiantes', context: 'Beauty discovery 18+ · creadores, K-beauty y tutoriales', need: 'Explorar ingredientes y nuevos pasos del skincare', message: 'Descubre el cuidado detrás de cada paso.', products: ['limpieza', 'control-poros'], briefPages: [13, 20, 26] },
];

export const channels = [
  { id: 'meta', name: 'Meta', role: 'Demostración de los dos pasos y momentos cotidianos', format: 'Video corto y carrusel educativo' },
  { id: 'youtube', name: 'YouTube', role: 'Explicar diferencias y construir comprensión', format: 'Video de demostración y piezas breves' },
  { id: 'tiktok', name: 'TikTok', role: 'Descubrimiento con creadores y contenido de rutina', format: 'Video vertical de uso contextual' },
  { id: 'pinterest', name: 'Pinterest', role: 'Inspiración y organización de rutinas', format: 'Piezas guardables' },
  { id: 'ctv', name: 'CTV', role: 'Construcción de conocimiento del portafolio', format: 'Video de marca' },
];
