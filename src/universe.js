import { MARKET } from './market.js';
/** Three mutually exclusive planning buckets. Product totals may overlap. */
export function buildAudienceUniverse({ cleansingOnly, shared, poreCareOnly }) {
  const buckets = { cleansingOnly, shared, poreCareOnly };
  for (const [name, value] of Object.entries(buckets)) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError(`${name}: introduce un número entero de personas, mayor o igual a cero.`);
    }
  }
  const unique = cleansingOnly + shared + poreCareOnly;
  if (!Number.isSafeInteger(unique) || unique <= 0 || unique > MARKET.adults) {
    throw new RangeError(`El total debe ser mayor que cero y no superar ${formatPeople(MARKET.adults)} adultos (DANE ${MARKET.year}, Colombia 18+).`);
  }
  return Object.freeze({
    ...buckets,
    cleansing: cleansingOnly + shared,
    poreCare: poreCareOnly + shared,
    unique,
    grossProductSum: cleansingOnly + poreCareOnly + 2 * shared,
    status: 'planning-scenario',
  });
}

export function formatPeople(value) {
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
}
