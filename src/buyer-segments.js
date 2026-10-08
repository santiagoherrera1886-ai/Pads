import { MARKET } from './market.js';

// A visible illustration, not a measured category penetration rate.
export const CATEGORY_BUYER_UNIVERSE = 13_000_000; // Editable planning base; not measured category penetration.
export const BUYER_EXAMPLE = Object.freeze({ currentShare: 6_000_000 / CATEGORY_BUYER_UNIVERSE * 100 });
export const BUYER_REACH_OVERLAP_PERCENT = 10;

// Additional planning sensitivity between media strategies, not buyer status.
// The denominator is A + B BEFORE this overlap adjustment.
export function projectBuyerReach({ reach, currentShare }) {
  if (!Number.isFinite(reach) || reach < 0 || reach > MARKET.adults) {
    throw new RangeError('El alcance base debe estar entre cero y la población adulta nacional.');
  }
  if (!Number.isFinite(currentShare) || currentShare < 10 || currentShare > 90) {
    throw new RangeError('Para una intersección del 10%, cada audiencia debe aportar al menos el 10% del alcance base. Ajusta el reparto entre 10% y 90%.');
  }
  const currentReach = reach * currentShare / 100;
  const newReach = reach - currentReach;
  const reachOverlap = reach * BUYER_REACH_OVERLAP_PERCENT / 100;
  return { grossReach: reach, currentReach, newReach, reachOverlap,
    uniqueReach: reach - reachOverlap, currentOnly: currentReach - reachOverlap,
    newOnly: newReach - reachOverlap, overlapPercent: BUYER_REACH_OVERLAP_PERCENT };
}

export function applyBuyerReachOverlap(result, currentShare) {
  const rows = result.rows.map(row => {
    const b = projectBuyerReach({ reach: row.unique, currentShare });
    return { ...row, baseUnique: row.unique, baseFrequency: row.frequency,
      currentAudienceReach: b.currentReach, newAudienceReach: b.newReach,
      reachOverlap: b.reachOverlap, unique: b.uniqueReach,
      coverage: b.uniqueReach / result.population.unique,
      frequency: b.uniqueReach ? row.impressions / b.uniqueReach : 0 };
  });
  return { ...result, rows, final: rows.at(-1) };
}

export function roundedBuyerReach(reach, currentShare) {
  projectBuyerReach({ reach, currentShare });
  const gross = Math.round(reach), current = Math.round(gross * currentShare / 100);
  const overlap = Math.round(gross * BUYER_REACH_OVERLAP_PERCENT / 100);
  return { gross, current, fresh: gross - current, overlap, unique: gross - overlap };
}

export function restoreBuyerSplit(value) {
  return Number.isFinite(value?.currentShare) && value.currentShare >= 0 && value.currentShare <= 100
    ? { currentShare: value.currentShare } : { ...BUYER_EXAMPLE };
}

export function splitBuyerAudience({ universe, currentShare, reach = universe }) {
  if (!Number.isSafeInteger(universe) || universe <= 0 || universe > MARKET.adults) {
    throw new RangeError('El universo debe ser un número entero de adultos dentro de la base nacional.');
  }
  if (!Number.isFinite(currentShare) || currentShare < 0 || currentShare > 100) {
    throw new RangeError('Usa un porcentaje de compradores actuales entre 0 y 100.');
  }
  if (!Number.isFinite(reach) || reach < 0 || reach > universe) {
    throw new RangeError('El alcance debe estar entre cero y el universo del escenario.');
  }
  const current = Math.round(universe * currentShare / 100);
  const newAudience = universe - current;
  // Uniform reach across the two cohorts is an additional planning assumption.
  const currentReach = reach * current / universe;
  const newReach = reach - currentReach;
  return { universe, currentShare, newShare: 100 - currentShare, current, newAudience,
    overlap: 0, reach, currentReach, newReach, reachOverlap: 0 };
}

export function buyerExportRows(universe, currentShare, reach) {
  const s = splitBuyerAudience({ universe, currentShare, reach: reach ?? universe });
  const projected = reach !== undefined;
  const r = projected ? roundedBuyerReach(reach, currentShare) : null;
  return [
    ['Clasificación', projected ? 'Audiencia orientada a compradores actuales / prospección de nueva audiencia; con cruce de pauta supuesto' : 'Compradores actuales de la categoría pads / audiencia nueva en la base, excluyentes'],
    ['Estado del reparto', 'Ejemplo editable; sin estudio de compradores ni CRM conectado'],
    ['Compradores actuales (%) · supuesto', s.currentShare],
    ['Audiencia nueva (%) · complemento supuesto', s.newShare],
    ['Universo único de referencia', universe],
    ['Compradores actuales en la base · supuesto', s.current],
    ['Audiencia nueva en la base · supuesto', s.newAudience],
    ['Intersección entre estados de compra en la base', 0],
    ...(projected ? [['Alcance base antes del cruce de pauta', r.gross],
    ['Audiencia de compradores actuales alcanzada · supuesto', r.current],
    ['Prospección de nueva audiencia alcanzada · supuesto', r.fresh],
    ['Intersección de pauta (%)', BUYER_REACH_OVERLAP_PERCENT],
    ['Denominador del 10%', 'Suma de ambos alcances antes de descontar la intersección'],
    ['Intersección de alcance entre audiencias · supuesto', r.overlap],
    ['Alcance único ajustado', r.unique],
    ['Método', 'Sensibilidad adicional: alcance base del modelo por producto repartido entre estrategias, menos 10% de cruce. No es deduplicación observada.'],
    ['Prospección', 'Puede incluir compradores actuales; no mide nuevos compradores obtenidos.']] : []),
    ['Límite', 'CRM de JGB no equivale a compradores de toda la categoría. Validar fuente, período y cobertura.']
  ];
}
