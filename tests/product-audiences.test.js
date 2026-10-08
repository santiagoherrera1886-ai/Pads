import test from 'node:test';
import assert from 'node:assert/strict';
import { MARKET } from '../src/market.js';
import {
  PRODUCT_AUDIENCE_DEFAULT, PREMIUM_CLUSTERS, calculateProductAudiences,
  restoreProductAudiencePlan, productAudienceExportRows,
} from '../src/product-audiences.js';
import { productAudiencePanel, premiumAudienceDetail } from '../src/product-audience-view.js';

test('combined Pads and Control Poros stay under 7M with 10%-capped overlap', () => {
  const p = calculateProductAudiences(PRODUCT_AUDIENCE_DEFAULT);
  assert.equal(p.pads.current, 2_100_000);
  assert.equal(p.pads.fresh, 2_400_000);
  assert.equal(p.pads.total, 4_500_000);
  assert.equal(p.pore.current, 600_000);
  assert.equal(p.pore.fresh, 1_900_000);
  assert.equal(p.pore.total, 2_500_000);
  assert.equal(p.overlap, 250_000);
  assert.equal(p.unique, 6_750_000);
  assert.ok(p.unique <= 7_000_000);
  assert.equal(p.remaining, MARKET.planningUniverse - p.unique);
  assert.equal(p.cells.reduce((s, c) => s + c.people, 0), p.overlap);
});

test('overlap can be 0 to 10% of smaller product group but never larger', () => {
  for (const overlapRate of [0, 1.5, 5, 10]) {
    const p = calculateProductAudiences({ ...PRODUCT_AUDIENCE_DEFAULT, overlapRate });
    assert.ok(p.overlap >= 0);
    assert.ok(p.overlap <= .1 * Math.min(p.pads.total, p.pore.total));
    assert.equal(p.unique, p.pads.total + p.pore.total - p.overlap);
    assert.ok(p.unique <= 30_000_000);
  }
  for (const overlapRate of [-1, 10.1, Infinity, NaN]) {
    assert.throws(() => calculateProductAudiences({ ...PRODUCT_AUDIENCE_DEFAULT, overlapRate }), RangeError);
  }
});

test('oversized or malformed cohorts are rejected and broken saved data resets', () => {
  for (const bad of [
    { padsCurrent: -1 }, { padsNew: 0.25 }, { poreCurrent: Infinity },
    { padsNew: 28_000_000 }, { poreNew: 0, poreCurrent: 0 },
  ]) {
    const scenario = { ...PRODUCT_AUDIENCE_DEFAULT, ...bad };
    assert.throws(() => calculateProductAudiences(scenario), RangeError);
    assert.deepEqual(restoreProductAudiencePlan(scenario), PRODUCT_AUDIENCE_DEFAULT);
  }
  assert.deepEqual(restoreProductAudiencePlan(null), PRODUCT_AUDIENCE_DEFAULT);
  assert.deepEqual(restoreProductAudiencePlan(PRODUCT_AUDIENCE_DEFAULT), PRODUCT_AUDIENCE_DEFAULT);
});

test('all five beauty clusters contain four distinct cohort interest sets', () => {
  assert.equal(PREMIUM_CLUSTERS.length, 5);
  for (const c of PREMIUM_CLUSTERS) {
    for (const key of ['padsCurrent', 'padsNew', 'poreCurrent', 'poreNew']) {
      assert.ok(Array.isArray(c[key]) && c[key].length >= 3);
    }
  }
});

test('rendered panel shows both product bases, overlapping calculation and filters', () => {
  const h = productAudiencePanel(PRODUCT_AUDIENCE_DEFAULT, { scope: 'audiences', filter: 'all' });
  assert.match(h, /4,5 M/);
  assert.match(h, /6,75 M/);
  assert.match(h, /0,25 M/); // 250 000 shared represented as 0,25 M
  assert.match(h, /Pads normales/);
  assert.match(h, /Control Poros/);
  assert.match(h, /Beauty after work/);
  assert.match(h, /K-beauty/);
  assert.doesNotMatch(h, /data-buyer-share/);
  assert.doesNotMatch(h, /data-product-audience-key|data-product-overlap|reset-product-audiences/);
  assert.doesNotMatch(h, /<input[\\s>]/);
  assert.match(h, /ESCENARIO FIJO/);
  assert.match(h, /Overlap fijo entre las dos líneas/);
  assert.match(h, /2,1 M actuales/);
  assert.match(h, /1,9 M nuevos/);

  const profile = premiumAudienceDetail('estudiantes', 'control-poros');
  assert.match(profile, /Control Poros/);
  assert.doesNotMatch(profile, /Pads normales/);
  const rows = productAudienceExportRows(PRODUCT_AUDIENCE_DEFAULT);
  assert.ok(rows.some(row => row[0] === 'Audiencia única · ambas líneas' && row[1] === 6_750_000));
  assert.ok(rows.some(row => row[0] === 'Overlap entre productos (%) · sobre la base menor' && row[1] === 10));
});
test('strict 7M unique cap rejects excessive combined product bases and resets invalid saved data', () => {
  const excessive = { ...PRODUCT_AUDIENCE_DEFAULT, padsNew: 3_000_000 };
  assert.throws(() => calculateProductAudiences(excessive), /7 millones/);
  assert.deepEqual(restoreProductAudiencePlan(excessive), PRODUCT_AUDIENCE_DEFAULT);
  assert.ok(calculateProductAudiences(PRODUCT_AUDIENCE_DEFAULT).unique < 7_000_000);
});
