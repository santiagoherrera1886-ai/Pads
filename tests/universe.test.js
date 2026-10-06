import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAudienceUniverse } from '../src/universe.js';

test('counts shared people once in the universe and in both product totals', () => {
  const result = buildAudienceUniverse({ cleansingOnly: 3_500_000, shared: 1_400_000, poreCareOnly: 2_100_000 });
  assert.equal(result.cleansing, 4_900_000);
  assert.equal(result.poreCare, 3_500_000);
  assert.equal(result.unique, 7_000_000);
  assert.equal(result.cleansing + result.poreCare - result.shared, result.unique);
});

test('supports fully shared, disjoint and one-product universes', () => {
  for (const buckets of [
    { cleansingOnly: 0, shared: 7_000_000, poreCareOnly: 0 },
    { cleansingOnly: 3_000_000, shared: 0, poreCareOnly: 4_000_000 },
    { cleansingOnly: 7_000_000, shared: 0, poreCareOnly: 0 },
    { cleansingOnly: 0, shared: 0, poreCareOnly: 7_000_000 },
  ]) {
    const result = buildAudienceUniverse(buckets);
    assert.equal(result.unique, 7_000_000);
    assert.ok(result.cleansing <= result.unique);
    assert.ok(result.poreCare <= result.unique);
  }
});

test('rejects missing, nonnumeric, fractional, negative and nonfinite buckets', () => {
  for (const shared of [undefined, null, '', '1400000', -1, 0.5, NaN, Infinity]) {
    assert.throws(() => buildAudienceUniverse({ cleansingOnly: 3_500_000, shared, poreCareOnly: 2_100_000 }), RangeError);
  }
});

test('accepts editable universe totals and rejects empty or impossible national totals', () => {
  assert.equal(buildAudienceUniverse({cleansingOnly:100,shared:200,poreCareOnly:300}).unique,600);
  for(const n of [0,53399172]) assert.throws(()=>buildAudienceUniverse({cleansingOnly:0,shared:0,poreCareOnly:n}),RangeError);
});
