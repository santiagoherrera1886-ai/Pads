import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,EXAMPLE} from '../src/simulation.js';
test('all 101 mixes keep unique reach bounded, deduplicated and monotonic',()=>{
 for(let cleansingShare=0;cleansingShare<=100;cleansingShare++){
  const r=simulate({...EXAMPLE,cleansingShare});let previous=0;
  for(const row of r.rows){assert.ok(row.unique>=previous);assert.ok(row.unique<=7000000);assert.ok(Math.abs(row.cleanReach+row.poreReach-row.overlap-row.unique)<1e-6);assert.ok(row.overlap<=Math.min(row.cleanReach,row.poreReach));previous=row.unique;}
  if(cleansingShare===0)assert.equal(r.final.cleanReach,0);
  if(cleansingShare===100)assert.equal(r.final.poreReach,0);
 }
});
test('zero budget gives zero impressions, reach and frequency',()=>{const f=simulate({...EXAMPLE,budget:0}).final;assert.equal(f.unique,0);assert.equal(f.frequency,0);assert.equal(f.impressions,0);});
test('frequency uses total impressions over deduplicated reach',()=>{const f=simulate(EXAMPLE).final;assert.equal(f.frequency,f.impressions/f.unique);});
test('invalid financial inputs and spend on an empty product are rejected',()=>{for(const patch of [{cpm:0},{cpm:NaN},{budget:-1},{budget:Infinity},{cleansingShare:101},{cleansingOnly:0,shared:0,poreCareOnly:7000000}])assert.throws(()=>simulate({...EXAMPLE,...patch}),RangeError);});
