import test from 'node:test';
import assert from 'node:assert/strict';
import {MARKET,DIGITAL_COHORTS,DIGITAL_POTENTIAL,ECONOMIC_PROXY,marketScenario} from '../src/market.js';
import {simulate,EXAMPLE} from '../src/simulation.js';
test('demographic sums and distinct affordability/qualification calculations',()=>{
 assert.equal(MARKET.men+MARKET.women,MARKET.adults);
 assert.equal(ECONOMIC_PROXY,16405083);
 const base=marketScenario(), twice=marketScenario({months:2});
 assert.equal(base.ticket,70000);assert.equal(base.threshold,1400000);assert.equal(twice.threshold,700000);
 assert.equal(base.qualified,twice.qualified); // No invented demand elasticity.
 assert.equal(marketScenario({qualification:0}).qualified,0);
 assert.equal(marketScenario({qualification:100}).qualified,ECONOMIC_PROXY);
 for(const qualification of [-1,101,NaN])assert.throws(()=>marketScenario({qualification}));
});
test('transferred one-product market scenario stays bounded and counts people once',()=>{
 const n=marketScenario({qualification:20}).qualified;
 const r=simulate({...EXAMPLE,cleansingOnly:0,shared:0,poreCareOnly:n,cleansingShare:0});
 assert.equal(r.population.unique,3281017);
 for(const row of r.rows){assert.equal(row.overlap,0);assert.equal(row.cleanReach,0);assert.ok(row.unique<=n);}
});

test('national communication base is justified separately from economic and purchase scenarios',()=>{
 assert.equal(MARKET.year,2027);assert.equal(MARKET.adults,39721750);
 assert.equal(DIGITAL_COHORTS.reduce((sum,c)=>sum+c.population,0),MARKET.adults);
 assert.ok(Math.abs(DIGITAL_POTENTIAL-33274171.1595196)<.01);
 assert.equal(DIGITAL_COHORTS[0].observedAge,'12–24');
 assert.ok(MARKET.planningUniverse<DIGITAL_POTENTIAL&&DIGITAL_POTENTIAL<MARKET.adults);
 assert.equal(simulate(EXAMPLE).population.unique,6750000); // fixed PADS category; national 30M is a separate market reference
 assert.throws(()=>marketScenario({price:160000}),RangeError);
 assert.equal(MARKET.price,70000);
 assert.equal(marketScenario({months:2}).monthlyCost,35000);
 for(const patch of [{price:0},{months:0},{months:25},{budgetShare:0},{budgetShare:101}])assert.throws(()=>marketScenario(patch));
});
