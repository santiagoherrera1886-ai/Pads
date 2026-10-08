import test from 'node:test';
import assert from 'node:assert/strict';
import { MARKET } from '../src/market.js';
import {
  PRODUCT_AUDIENCE_DEFAULT, PREMIUM_CLUSTERS, calculateProductAudiences,
  restoreProductAudiencePlan, productAudienceExportRows,
} from '../src/product-audiences.js';
import { productAudiencePanel, premiumAudienceDetail } from '../src/product-audience-view.js';

test('normal Pads 6M buyers + 7M new, and 10%-capped cross-product deduplication', () => {
  const p = calculateProductAudiences(PRODUCT_AUDIENCE_DEFAULT);
  assert.equal(p.pads.current, 6_000_000);
  assert.equal(p.pads.fresh, 7_000_000);
  assert.equal(p.pads.total, 13_000_000);
  assert.equal(p.pore.current, 1_500_000);
  assert.equal(p.pore.fresh, 4_500_000);
  assert.equal(p.pore.total, 6_000_000);
  assert.equal(p.overlap, 600_000);
  assert.equal(p.unique, 18_400_000);
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
  assert.match(h, /13 M/);
  assert.match(h, /18,4 M/);
  assert.match(h, /600/); // 600 000 shared represented as 0,6 M
  assert.match(h, /Pads normales/);
  assert.match(h, /Control Poros/);
  assert.match(h, /Beauty after work/);
  assert.match(h, /K-beauty/);
  assert.doesNotMatch(h, /data-buyer-share/);
  const profile = premiumAudienceDetail('estudiantes', 'control-poros');
  assert.match(profile, /Control Poros/);
  assert.doesNotMatch(profile, /Pads normales/);
  const rows = productAudienceExportRows(PRODUCT_AUDIENCE_DEFAULT);
  assert.ok(rows.some(row => row[0] === 'Audiencia única · ambas líneas' && row[1] === 18_400_000));
  assert.ok(rows.some(row => row[0] === 'Overlap entre productos (%) · sobre la base menor' && row[1] === 10));
});