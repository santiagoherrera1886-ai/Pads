import test from 'node:test';
import assert from 'node:assert/strict';
import {MARKET} from '../src/market.js';
import {EXAMPLE,simulate} from '../src/simulation.js';
import {BUYER_EXAMPLE,restoreBuyerSplit,splitBuyerAudience,buyerExportRows} from '../src/buyer-segments.js';

test('20/80 is an explicit example and conserves the 30M national base',()=>{
 const r=splitBuyerAudience({universe:MARKET.planningUniverse,...BUYER_EXAMPLE});
 assert.equal(r.current,6e6);assert.equal(r.newAudience,24e6);assert.equal(r.overlap,0);
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
 assert(!base.some(([k])=>k==='Alcance único utilizado'));
 const values=Object.fromEntries(reach);
 assert.equal(values['Compradores actuales alcanzados · proyección']+values['Audiencia nueva alcanzada · proyección'],values['Alcance único utilizado']);
});
