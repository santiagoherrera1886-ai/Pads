import test from 'node:test';
import assert from 'node:assert/strict';
import {MARKET,DIGITAL_COHORTS,DIGITAL_POTENTIAL,ECONOMIC_PROXY,marketScenario} from '../src/market.js';
import {PRODUCT_AUDIENCE_DEFAULT} from '../src/product-audiences.js';
import {daneAudienceAudit,daneAuditExportRows,PROVENANCE} from '../src/dane-audience-math.js';
import {daneMiniBridge,daneMathPanel} from '../src/dane-audience-view.js';

test('DANE adult male+female and age group totals reconcile to exact 2027 projected adults',()=>{
 const a=daneAudienceAudit();
 assert.equal(a.adults,39721750);
 assert.equal(a.men+a.women,a.adults);
 assert.equal(a.ageCohorts.reduce((s,c)=>s+c.population,0),a.adults);
 assert.equal(a.residualGender,0);
 assert.equal(a.ageCohorts.length,3);
});
test('digital potential by age is weighted sum of observed 2025 rates, with proxy 12–24 documented',()=>{
 const a=daneAudienceAudit();
 assert.ok(Math.abs(a.rawDigital-33274171.1595196)<.001);
 assert.equal(a.rawDigital,DIGITAL_POTENTIAL);
 assert.equal(a.ageCohorts[0].observedAge,'12–24');
 for(const c of a.ageCohorts)assert.ok(Math.abs(c.estimatedDigital-c.population*c.internetRate)<.001);
 assert.ok(a.lowDigitalRateScenario < a.rawDigital);
 assert.ok(a.highDigitalRateScenario > a.rawDigital);
 assert.ok(a.highDigitalRateScenario <= a.adults);
});
test('planning coefficient is an inverse ratio, never implied DANE measurement of category sales',()=>{
 const a=daneAudienceAudit();
 assert.equal(a.planning,30000000);
 assert.equal(a.category,6750000);
 assert.equal(a.categoryFraction,.225);
 assert.ok(Math.abs(a.rawDigital*a.planningFraction-a.planning)<1e-7);
 assert.equal(a.category,a.planning*a.categoryFraction);
 assert.equal(a.outsideCategoryPlanning,23250000);
 assert.match(a.status.category,/estratégico|Objetivo/i);
});
test('class middle-high proxy has mathematical intersection bounds without assuming independence',()=>{
 const a=daneAudienceAudit();
 assert.equal(a.socioeconomic,16405083);
 assert.equal(a.digitalEconomicLower,9957504.159519598);
 assert.equal(a.digitalEconomicUpper,16405083);
 assert.ok(a.projectEconomicLower <= a.projectEconomicUpper);
 assert.ok(a.digitalEconomicUpper <= a.adults);
});
test('COP 70,000 is fixed basket ticket and does not resize 6.75M category',()=>{
 const a=daneAudienceAudit();
 assert.equal(MARKET.price,70000);
 assert.equal(a.priceModel.ticket,70000);
 assert.equal(a.priceModel.monthlyCost,70000);
 assert.equal(a.priceModel.threshold,1400000);
 assert.ok(Math.abs(a.priceModel.burden-70000/943791)<1e-12);
 const alt=daneAudienceAudit(PRODUCT_AUDIENCE_DEFAULT,{qualification:80,months:2,budgetShare:10});
 assert.equal(alt.priceModel.monthlyCost,35000);
 assert.equal(alt.priceModel.threshold,350000);
 assert.equal(alt.category,a.category);
 assert.throws(()=>marketScenario({price:80000}),RangeError);
});
test('math view and CSV include DANE provenance, 3 age groups and non-measured assumptions',()=>{
 const panel=daneMathPanel(PRODUCT_AUDIENCE_DEFAULT,{months:1,qualification:35,budgetShare:5});
 assert.match(panel,/39,72 M/);
 assert.match(panel,/33,27 M/);
 assert.match(panel,/6,75 M/);
 assert.match(panel,/70.000/);
 assert.match(panel,/DANE/);
 assert.match(panel,/no es una tasa observada/i);
 assert.doesNotMatch(panel,/data-market="price"/);
 const mini=daneMiniBridge(PRODUCT_AUDIENCE_DEFAULT);
 assert.match(mini,/Ver fórmulas/);
 const rows=daneAuditExportRows(PRODUCT_AUDIENCE_DEFAULT);
 assert.ok(rows.some(r=>r[0]==='Ticket medio fijo COP por transacción'&&r[1]===70000));
 assert.ok(rows.some(r=>r[0]==='Coeficiente implícito categoría vs base comunicación'&&r[1]===.225));
 assert.ok(rows.some(r=>r[0]==='SUMA DIGITAL PROPIA'&&r[1]===DIGITAL_POTENTIAL));
 assert.equal(Object.keys(PROVENANCE).length,3);
});