import test from 'node:test';
import assert from 'node:assert/strict';
import {MARKET} from '../src/market.js';
import {EXAMPLE,simulate} from '../src/simulation.js';
import {BUYER_EXAMPLE,CATEGORY_BUYER_UNIVERSE,restoreBuyerSplit,splitBuyerAudience,buyerExportRows,projectBuyerReach,applyBuyerReachOverlap,roundedBuyerReach} from '../src/buyer-segments.js';

test('6M current + 7M new is an explicit category example separate from the 30M national base',()=>{
 const r=splitBuyerAudience({universe:CATEGORY_BUYER_UNIVERSE,...BUYER_EXAMPLE});
 assert.equal(r.current,6e6);assert.equal(r.newAudience,7e6);assert.equal(r.overlap,0);
 assert.equal(MARKET.planningUniverse,30e6);
 assert.equal(r.current+r.newAudience,r.universe);
});
test('all shares give exclusive counts and conserve projected reach across budget levels',()=>{
 for(const universe of [3,5741779,30e6]) for(let currentShare=0;currentShare<=100;currentShare++) for(const budget of [0,100e6,1e12]){
  const p=simulate({...EXAMPLE,shared:universe,budget});
  const s=splitBuyerAudience({universe,currentShare,reach:p.final.unique});
  assert.equal(s.current+s.newAudience,universe);
  assert.equal(s.overlap,0);assert.equal(s.reachOverlap,0);
  assert(s.currentReach>=0&&s.currentReach<=s.current);
  assert(s.newReach>=0&&s.newReach<=s.newAudience);
  assert(Math.abs(s.currentReach+s.newReach-p.final.unique)<1e-6);
 }
});
test('zero budget has no reached buyers or new audience, while the potential base stays intact',()=>{
 const r=splitBuyerAudience({universe:30e6,currentShare:20,reach:simulate({...EXAMPLE,budget:0}).final.unique});
 assert.equal(r.currentReach,0);assert.equal(r.newReach,0);assert.equal(r.current,6e6);assert.equal(r.newAudience,24e6);
});
test('invalid shares or model inputs cannot turn into a credible-looking audience',()=>{
 for(const currentShare of [undefined,null,'20',-1,101,NaN,Infinity])assert.throws(()=>splitBuyerAudience({universe:30e6,currentShare}));
 for(const universe of [0,0.5,NaN,MARKET.adults+1])assert.throws(()=>splitBuyerAudience({universe,currentShare:20}));
 for(const reach of [-1,NaN,30000001])assert.throws(()=>splitBuyerAudience({universe:30e6,currentShare:20,reach}));
 assert.deepEqual(restoreBuyerSplit(null),BUYER_EXAMPLE);assert.deepEqual(restoreBuyerSplit({currentShare:101}),BUYER_EXAMPLE);
 assert.deepEqual(restoreBuyerSplit({currentShare:0}),{currentShare:0});assert.deepEqual(restoreBuyerSplit({currentShare:100}),{currentShare:100});
});
test('exports label assumptions and never label the potential universe as reached people',()=>{
 const base=buyerExportRows(30e6,20),reach=buyerExportRows(30e6,20,10222781.44);
 assert(base.some(([k,v])=>k==='Estado del reparto'&&v.includes('sin estudio')));
 assert(!base.some(([k])=>k==='Alcance único ajustado'));
 const values=Object.fromEntries(reach);
 assert.equal(values['Audiencia de compradores actuales alcanzada · supuesto']+values['Prospección de nueva audiencia alcanzada · supuesto']-values['Intersección de alcance entre audiencias · supuesto'],values['Alcance único ajustado']);
 assert.equal(values['Intersección de pauta (%)'],10);
});

test('10% means the sum of both reaches, matching the 18.3/81.7 screenshot scenario',()=>{
 const r=projectBuyerReach({reach:10222781.44,currentShare:18.3});
 assert(Math.abs(r.reachOverlap-1022278.144)<1e-8);
 assert(Math.abs(r.uniqueReach-9200503.296)<1e-8);
 assert(Math.abs(r.currentReach+r.newReach-r.reachOverlap-r.uniqueReach)<1e-8);
 assert(r.reachOverlap<=Math.min(r.currentReach,r.newReach));
});

test('overlap remains possible at the 10/90 boundaries and impossible splits are rejected',()=>{
 for(const currentShare of [10,18.3,20,50,90]) for(const reach of [0,1,10222781.44,30e6]){
  const r=projectBuyerReach({reach,currentShare});
  assert(r.currentOnly>=-1e-8&&r.newOnly>=-1e-8);
  const b=roundedBuyerReach(reach,currentShare);
  assert.equal(b.current+b.fresh-b.overlap,b.unique);
  assert(b.overlap<=Math.min(b.current,b.fresh));
 }
 for(const currentShare of [0,9.9,90.1,100,NaN,Infinity])assert.throws(()=>projectBuyerReach({reach:1e6,currentShare}));
 for(const reach of [-1,NaN,Infinity,MARKET.adults+1])assert.throws(()=>projectBuyerReach({reach,currentShare:20}));
});

test('each wave, coverage and frequency use the same adjusted reach without changing budget or universe',()=>{
 for(const budget of [0,100e6,1e12]){
  const base=simulate({...EXAMPLE,budget});
  const adjusted=applyBuyerReachOverlap(base,18.3);
  assert.equal(adjusted.population.unique,30e6);
  for(let i=0;i<12;i++){
   const before=base.rows[i],after=adjusted.rows[i];
   assert.equal(after.baseUnique,before.unique);assert.equal(after.spend,before.spend);assert.equal(after.impressions,before.impressions);
   assert(Math.abs(after.reachOverlap-before.unique*.1)<1e-7);
   assert(Math.abs(after.unique-before.unique*.9)<1e-7);
   assert.equal(after.frequency,after.unique?after.impressions/after.unique:0);
   assert.equal(after.coverage,after.unique/30e6);
  }
 }
});
