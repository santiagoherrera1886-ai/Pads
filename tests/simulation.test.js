import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,EXAMPLE,restoreScenario} from '../src/simulation.js';
test('all 101 mixes keep unique reach bounded, deduplicated and monotonic',()=>{
 for(let cleansingShare=0;cleansingShare<=100;cleansingShare++){
  const r=simulate({...EXAMPLE,cleansingShare});let previous=0;
  for(const row of r.rows){assert.ok(row.unique>=previous);assert.ok(row.unique<=r.population.unique);assert.ok(Math.abs(row.cleanReach+row.poreReach-row.overlap-row.unique)<1e-6);assert.ok(row.overlap<=Math.min(row.cleanReach,row.poreReach));previous=row.unique;}
  if(cleansingShare===0)assert.equal(r.final.cleanReach,0);
  if(cleansingShare===100)assert.equal(r.final.poreReach,0);
 }
});
test('zero budget gives zero impressions, reach and frequency',()=>{const f=simulate({...EXAMPLE,budget:0}).final;assert.equal(f.unique,0);assert.equal(f.frequency,0);assert.equal(f.impressions,0);});
test('frequency uses total impressions over deduplicated reach',()=>{const f=simulate(EXAMPLE).final;assert.equal(f.frequency,f.impressions/f.unique);});
test('invalid financial inputs and spend on an empty product are rejected',()=>{for(const patch of [{cpm:0},{cpm:NaN},{budget:-1},{budget:Infinity},{cleansingShare:101},{cleansingOnly:0,shared:0,poreCareOnly:7000000}])assert.throws(()=>simulate({...EXAMPLE,...patch}),RangeError);});

test('old 30M and custom browser snapshots migrate to fixed 6.75M without losing valid financial inputs',()=>{
 const legacy={cleansingOnly:1500000,shared:600000,poreCareOnly:900000,budget:250e6,cpm:9500,cleansingShare:45};
 for(const saved of [legacy,{...legacy,shared:30e6},{...legacy,shared:700000}]){
  const restored=restoreScenario(saved,null);
  assert.equal(restored.shared,250000);
  assert.equal(restored.cleansingOnly,4250000);
  assert.equal(restored.poreCareOnly,2250000);
  assert.equal(restored.budget,250e6);
  assert.equal(restored.cpm,9500);
  assert.equal(restored.cleansingShare,45);
  assert.equal(simulate(restored).population.unique,6750000);
 }
 assert.deepEqual(restoreScenario(null,null),EXAMPLE);
});
test('fixed product reach is mathematically coherent, bounded and responds to investment',()=>{
 const base=simulate(EXAMPLE);
 assert.equal(base.population.cleansing,4500000);
 assert.equal(base.population.poreCare,2500000);
 assert.equal(base.population.shared,250000);
 assert.equal(base.population.unique,6750000);
 assert.ok(base.final.overlap<=250000);
 assert.ok(Math.abs(base.final.cleanReach+base.final.poreReach-base.final.overlap-base.final.unique)<1e-6);
 assert.ok(simulate({...EXAMPLE,budget:200e6}).final.unique>base.final.unique);
 for(const mix of [0,20,40,60,80,100]){
  const f=simulate({...EXAMPLE,cleansingShare:mix}).final;
  assert.ok(f.unique>=0&&f.unique<=6750000);
 }
});
