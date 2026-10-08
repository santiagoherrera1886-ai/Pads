import { MARKET } from './market.js';

// Category-planning hypotheses, NOT observed market penetration or platform audience sizes.
// Pads cotton and Pads Control Poros can share people across products.
export const PRODUCT_AUDIENCE_DEFAULT = Object.freeze({
  padsCurrent: 2_100_000,
  padsNew: 2_400_000,
  poreCurrent: 600_000,
  poreNew: 1_900_000,
  overlapRate: 10,
});
export const MAX_PRODUCT_OVERLAP_PERCENT = 10;
export const MAX_CATEGORY_UNIQUE = 7_000_000; // Strict combined unique ceiling for both product lines.

export const PREMIUM_CLUSTERS = Object.freeze([
  {
    id: 'productivas', name: 'Beauty after work',
    insight: 'Del ritmo de la oficina a una rutina facial intencional.',
    padsCurrent: ['Agua micelar', 'Double cleansing', 'Ritual de noche'],
    padsNew: ['Beauty essentials', 'GRWM de noche', 'Skincare de autor'],
    poreCurrent: ['Exfoliación cosmética', 'Skin cycling', 'Textura de la piel'],
    poreNew: ['Skin education', 'AHA y BHA', 'Beauty editorial'],
  },
  {
    id: 'madres', name: 'Self-care sofisticado',
    insight: 'Autocuidado sensorial y pequeños rituales personales, sin estereotipos.',
    padsCurrent: ['Limpieza delicada', 'Cosmética facial', 'Beauty routine'],
    padsNew: ['Spa en casa', 'Rituales de bienestar', 'Slow beauty'],
    poreCurrent: ['Cuidado de textura', 'Activos cosméticos', 'Rutina consciente'],
    poreNew: ['Skincare discovery', 'Dermocosmética', 'Educación en belleza'],
  },
  {
    id: 'deportistas', name: 'Active beauty',
    insight: 'Una transición entre vida activa, limpieza y cuidado facial.',
    padsCurrent: ['Post-workout skincare', 'Limpieza facial', 'Neceser deportivo'],
    padsNew: ['Wellness lifestyle', 'Clean beauty', 'Skincare post gym'],
    poreCurrent: ['Cuidado de poros', 'Rutina facial', 'Exfoliación suave'],
    poreNew: ['Skin wellness', 'Textura y cuidado', 'Routine layering'],
  },
  {
    id: 'viajeras', name: 'Beauty on the go',
    insight: 'La estética del neceser y la continuidad de una rutina de cuidado.',
    padsCurrent: ['Travel skincare', 'Agua micelar', 'Beauty bag'],
    padsNew: ['Boutique beauty', 'Travel essentials', 'Ritual de viaje'],
    poreCurrent: ['Skincare minimalista', 'Rutina por pasos', 'Pads de tratamiento'],
    poreNew: ['K-beauty routines', 'Cosmética de viaje', 'Skin ritual'],
  },
  {
    id: 'estudiantes', name: 'Beauty discovery 18+',
    insight: 'Descubrimiento de belleza, contenidos tutoriales y curiosidad por ingredientes.',
    padsCurrent: ['Makeup removal', 'Beauty tutorials', 'Pads de algodón'],
    padsNew: ['Makeup artistry', 'GRWM', 'Beauty creators'],
    poreCurrent: ['Ingredientes cosméticos', 'Skincare layering', 'Pads exfoliantes'],
    poreNew: ['K-beauty', 'Glass skin aesthetic', 'AHA/BHA education'],
  },
]);

export function calculateProductAudiences(input) {
  if (!input || typeof input !== 'object') throw new RangeError('Escenario de audiencias inválido.');
  const fields = ['padsCurrent', 'padsNew', 'poreCurrent', 'poreNew'];
  for (const field of fields) {
    if (!Number.isSafeInteger(input[field]) || input[field] < 0) {
      throw new RangeError('Cada audiencia debe ser un número entero no negativo de personas.');
    }
  }
  if (!Number.isFinite(input.overlapRate) || input.overlapRate < 0 || input.overlapRate > MAX_PRODUCT_OVERLAP_PERCENT) {
    throw new RangeError('El overlap entre líneas debe estar entre 0% y 10%.');
  }
  const pads = { current: input.padsCurrent, fresh: input.padsNew, total: input.padsCurrent + input.padsNew };
  const pore = { current: input.poreCurrent, fresh: input.poreNew, total: input.poreCurrent + input.poreNew };
  if (pads.total <= 0 || pore.total <= 0 || pads.total > MARKET.planningUniverse || pore.total > MARKET.planningUniverse) {
    throw new RangeError('Cada producto necesita una audiencia positiva y no puede superar los 30 M del universo nacional.');
  }
  // The 10% maximum is measured against the smaller product universe, not the
  // sum: this guarantees that the common group exists in both product bases.
  const overlap = Math.round(Math.min(pads.total, pore.total) * input.overlapRate / 100);
  const unique = pads.total + pore.total - overlap;
  if (unique > MAX_CATEGORY_UNIQUE) {
    throw new RangeError('Los públicos únicos entre Pads normales y Pads Control Poros no pueden superar los 7 millones. Reduce una o varias audiencias (total después del overlap).');
  }
  // Cross-product 2×2 intersections. Buyer/new status is exclusive only WITHIN
  // a product. A Pads buyer may be a NEW prospect for Control Poros.
  const pc = Math.round(overlap * (pads.current / pads.total) * (pore.current / pore.total));
  const pn = Math.round(overlap * (pads.current / pads.total) * (pore.fresh / pore.total));
  const nc = Math.round(overlap * (pads.fresh / pads.total) * (pore.current / pore.total));
  const nn = overlap - pc - pn - nc;
  const cells = [
    { id: 'pc', label: 'Compradores de ambos', people: pc },
    { id: 'pn', label: 'Compran Pads · nuevos para Control Poros', people: pn },
    { id: 'nc', label: 'Nuevos para Pads · compran Control Poros', people: nc },
    { id: 'nn', label: 'Nuevos para ambas líneas', people: nn },
  ];
  return { pads, pore, overlap, overlapRate: input.overlapRate, unique,
    remaining: MARKET.planningUniverse - unique, national: MARKET.planningUniverse, cells,
    status: 'supuesto-de-planeacion' };
}

export function restoreProductAudiencePlan(value) {
  try {
    calculateProductAudiences(value);
    return { padsCurrent: value.padsCurrent, padsNew: value.padsNew,
      poreCurrent: value.poreCurrent, poreNew: value.poreNew, overlapRate: value.overlapRate };
  } catch {
    return { ...PRODUCT_AUDIENCE_DEFAULT };
  }
}

export function productAudienceExportRows(input) {
  const p = calculateProductAudiences(input);
  return [
    ['PADS JGB · planeación de dos productos, sin medición de compradores'],
    ['Cobertura', 'Toda Colombia · 18+ · todos los géneros'],
    ['Estado', 'Supuestos editables, no tamaños certificados por la plataforma'],
    ['Universo de comunicación nacional', p.national],
    ['Tope estricto combinado de categoría (únicos)', MAX_CATEGORY_UNIQUE],
    ['Pads normales · compradores actuales · supuesto', p.pads.current],
    ['Pads normales · audiencia nueva · supuesto', p.pads.fresh],
    ['Pads normales · universo total', p.pads.total],
    ['Pads Control Poros · compradores actuales · supuesto', p.pore.current],
    ['Pads Control Poros · audiencia nueva · supuesto', p.pore.fresh],
    ['Pads Control Poros · universo total', p.pore.total],
    ['Overlap entre productos (%) · sobre la base menor', p.overlapRate],
    ['Personas compartidas entre líneas', p.overlap],
    ['Audiencia única · ambas líneas', p.unique],
    ['Adultos del universo general fuera del escenario de categoría', p.remaining],
    ['Fórmula', 'Pads normales + Pads Control Poros - overlap entre líneas'],
    ['Coherencia', 'Compradores y nuevos son excluyentes dentro de cada línea; una persona puede estar en ambas líneas'],
    ...p.cells.map(c => [c.label + ' · overlap cruzado · hipótesis', c.people]),
    [],
    ['Clúster', 'Territorio beauty', 'Pads · compradores actuales', 'Pads · nuevos',
      'Control Poros · compradores actuales', 'Control Poros · nuevos'],
    ...PREMIUM_CLUSTERS.map(c => [c.name, c.insight, c.padsCurrent.join(' / '), c.padsNew.join(' / '),
      c.poreCurrent.join(' / '), c.poreNew.join(' / ')]),
    ['Validación', 'Intereses editoriales propuestos, no audiencias medidas ni taxonomías disponibles garantizadas'],
  ];
}