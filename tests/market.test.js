import test from 'node:test';
import assert from 'node:assert/strict';
import {MARKET,ECONOMIC_PROXY,marketScenario} from '../src/market.js';
import {simulate,EXAMPLE} from '../src/simulation.js';
test('demographic sums and distinct affordability/qualification calculations',()=>{
 assert.equal(MARKET.men+MARKET.women,MARKET.adults);
 assert.equal(ECONOMIC_PROXY,16204742);
 const base=marketScenario(), twice=marketScenario({months:2});
 assert.equal(base.threshold,1600000);assert.equal(twice.threshold,800000);
 assert.equal(base.qualified,twice.qualified); // No invented demand elasticity.
 assert.equal(marketScenario({qualification:0}).qualified,0);
 assert.equal(marketScenario({qualification:100}).qualified,ECONOMIC_PROXY);
 for(const qualification of [-1,101,NaN])assert.throws(()=>marketScenario({qualification}));
});
test('transferred one-product market scenario stays bounded and counts people once',()=>{
 const n=marketScenario({qualification:20}).qualified;
 const r=simulate({...EXAMPLE,cleansingOnly:0,shared:0,poreCareOnly:n,cleansingShare:0});
 assert.equal(r.population.unique,3240948);
 for(const row of r.rows){assert.equal(row.overlap,0);assert.equal(row.cleanReach,0);assert.ok(row.unique<=n);}
});
