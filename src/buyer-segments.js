import { MARKET } from './market.js';

// A visible illustration, not a measured category penetration rate.
export const BUYER_EXAMPLE = Object.freeze({ currentShare: 20 });

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
  const roundedReach = Math.round(reach ?? universe), currentReached = Math.round(roundedReach * s.current / universe);
  return [
    ['Clasificación', 'Compradores actuales de la categoría pads / audiencia nueva, excluyentes'],
    ['Estado del reparto', 'Ejemplo editable; sin estudio de compradores ni CRM conectado'],
    ['Compradores actuales (%) · supuesto', s.currentShare],
    ['Audiencia nueva (%) · complemento supuesto', s.newShare],
    ['Universo único de referencia', universe],
    ['Compradores actuales en la base · supuesto', s.current],
    ['Audiencia nueva en la base · supuesto', s.newAudience],
    ['Intersección entre perfiles de compra', 0],
    ...(reach === undefined ? [] : [['Alcance único utilizado', roundedReach],
    ['Compradores actuales alcanzados · proyección', currentReached],
    ['Audiencia nueva alcanzada · proyección', roundedReach - currentReached],
    ['Reparto del alcance', 'Misma tasa de alcance para ambos perfiles; no mide adquisiciones ni compras']]),
    ['Límite', 'CRM de JGB no equivale a compradores de toda la categoría. Validar fuente, período y cobertura.']
  ];
}
