export const PLANNING_UNIVERSE = 7_000_000;

/** Three mutually exclusive planning buckets. Product totals may overlap. */
export function buildAudienceUniverse({ cleansingOnly, shared, poreCareOnly }) {
  const buckets = { cleansingOnly, shared, poreCareOnly };
  for (const [name, value] of Object.entries(buckets)) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError(`${name}: introduce un número entero de personas, mayor o igual a cero.`);
    }
  }
  const unique = cleansingOnly + shared + poreCareOnly;
  if (unique !== PLANNING_UNIVERSE) {
    throw new RangeError('Los tres grupos exclusivos deben sumar exactamente 7.000.000 de personas.');
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
