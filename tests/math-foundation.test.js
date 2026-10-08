import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_AUDIENCE_DEFAULT } from '../src/product-audiences.js';
import { categoryMath, affinityMatrix, platformAllocation, reachByPlatform, mathExportRows } from '../src/math-foundation.js';
import { mathEvidencePanel, mathProfileExplanation } from '../src/math-view.js';

const fixed=PRODUCT_AUDIENCE_DEFAULT;
test('fixed product universe and cluster sums reconcile exactly',()=>{
 const m=categoryMath(fixed);
 assert.equal(m.unique,6750000);assert.equal(m.overlap,250000);
 assert.equal(m.pads.total,4500000);assert.equal(m.pore.total,2500000);
 assert.equal(m.clusters.reduce((a,g)=>a+g.unique,0),m.unique);
 for(const k of ['padsCurrent','padsNew','poreCurrent','poreNew'])assert.equal(m.cohortSums[k],fixed[k]);
});
test('platform mix is normalized from declared editorial adequacy scores',()=>{
 const media=platformAllocation(fixed),matrix=affinityMatrix(fixed);
 assert.equal(media.length,5);assert.equal(matrix.length,5);
 assert.ok(Math.abs(media.reduce((a,p)=>a+p.weight,0)-1)<1e-12);
 for(const medium of media)assert.ok(medium.weight>0&&medium.weight<1);
 for(const cluster of matrix)for(const p of cluster.platforms)assert.equal(p.index,100*p.fit/5);
});
test('reach model: 12 monotone waves, bounded overlaps, safe frequencies and correct zero budget',()=>{
 for(const budget of [0,10e6,100e6,200e6,1e9]){
  const m=reachByPlatform(fixed,{budget,cpm:8000,waves:12});
  assert.equal(m.N,6750000);assert.equal(m.rows.length,13);
  let last=0;
  for(const row of m.rows){
   assert.ok(row.independent>=last-1e-6&&row.independent<=6750000+1e-6);
   assert.ok(row.lower<=row.independent+1e-5&&row.independent<=row.upper+1e-5);
   assert.ok(Math.abs(row.channels.reduce((a,c)=>a+c.impressions,0)-row.impressions)<1e-5);
   assert.ok(Math.abs(row.channels.reduce((a,c)=>a+c.spend,0)-row.spend)<1e-5);
   assert.equal(row.frequency,row.independent?row.impressions/row.independent:0);
   for(const channel of row.channels)assert.ok(channel.reach>=0&&channel.reach<=m.N);
   last=row.independent;
  }
  if(!budget)assert.equal(m.final.independent,0);
 }
});
test('CPM and budget are explicit model inputs, no platform-published reach is claimed',()=>{
 assert.throws(()=>reachByPlatform(fixed,{budget:-1,cpm:8000,waves:12}),RangeError);
 assert.throws(()=>reachByPlatform(fixed,{budget:100e6,cpm:0,waves:12}),RangeError);
 assert.throws(()=>reachByPlatform(fixed,{budget:100e6,cpm:8000,waves:0}),RangeError);
 const m=reachByPlatform(fixed,{budget:100e6,cpm:8000,waves:12});
 const doubled=reachByPlatform(fixed,{budget:200e6,cpm:8000,waves:12});
 assert.ok(doubled.final.independent>m.final.independent);
 assert.ok(reachByPlatform(fixed,{budget:100e6,cpm:16000,waves:12}).final.independent<m.final.independent);
 assert.match(m.classification,/simulación/);
});
test('dashboard and CSV disclose assumptions, equations, full interest matrix and uncertainty',()=>{
 const html=mathEvidencePanel(fixed,{budget:100e6,cpm:8000,waves:12});
 assert.match(html,/6,75 M/);
 assert.match(html,/PENDIENTE DE MEDICIÓN|Pendiente de medición/);
 assert.match(html,/I\(m,t\)/);
 assert.match(html,/R\(m,t\)/);
 assert.match(html,/SIMULACIÓN NO CALIBRADA/);
 assert.match(html,/Exportar fórmulas/);
 const detail=mathProfileExplanation(fixed,'estudiantes');
 assert.match(detail,/100/);
 assert.match(detail,/Meta Ads/);
 const csv=mathExportRows(fixed,{budget:100e6,cpm:8000,waves:12});
 assert.ok(csv.some(row=>row[0]==='Saturación'));
 assert.ok(csv.some(row=>row[0]==='Límites condicionales'));
 assert.equal(csv.filter(row=>typeof row[0]==='number').length,13);
});