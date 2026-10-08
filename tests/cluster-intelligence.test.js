import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_AUDIENCE_DEFAULT, calculateProductAudiences, MAX_CATEGORY_UNIQUE } from '../src/product-audiences.js';
import { clusterAudiencePlan, clusterExportRows, CLUSTER_SHARES, COHORT_INFO } from '../src/cluster-intelligence.js';
import { clusterCardMetrics, clusterProfileDetails, clusterUniverseMatrix } from '../src/cluster-view.js';

test('five primary beauty clusters partition all four source universes exactly',()=>{
 const {model,groups}=clusterAudiencePlan(PRODUCT_AUDIENCE_DEFAULT);
 assert.equal(groups.length,5);
 assert.equal(model.unique,6_975_000);
 assert.ok(model.unique <= MAX_CATEGORY_UNIQUE);
 for(const key of ['padsCurrent','padsNew','poreCurrent','poreNew']){
  assert.equal(groups.reduce((sum,g)=>sum+g.segments[key],0),PRODUCT_AUDIENCE_DEFAULT[key]);
  assert.equal(groups.reduce((sum,g)=>sum+g.shares[key],0),100);
 }
 assert.equal(groups.reduce((sum,g)=>sum+g.overlap,0),model.overlap);
 assert.equal(groups.reduce((sum,g)=>sum+g.unique,0),model.unique);
 for(const g of groups){
  assert.equal(g.pads,g.segments.padsCurrent+g.segments.padsNew);
  assert.equal(g.pore,g.segments.poreCurrent+g.segments.poreNew);
  assert.ok(g.overlap<=Math.min(g.pads,g.pore));
  assert.equal(g.unique,g.pads+g.pore-g.overlap);
 }
});

test('assigned cluster cohorts adjust to changes without exceeding the combined cap',()=>{
 for(const data of [
  {...PRODUCT_AUDIENCE_DEFAULT,overlapRate:0},
  {...PRODUCT_AUDIENCE_DEFAULT,overlapRate:10},
  {...PRODUCT_AUDIENCE_DEFAULT,padsCurrent:1_500_000,padsNew:2_400_000},
  {...PRODUCT_AUDIENCE_DEFAULT,poreCurrent:100_000,poreNew:1_000_000},
 ]){
   const p=clusterAudiencePlan(data);
   assert.ok(p.model.unique<=MAX_CATEGORY_UNIQUE);
   assert.equal(p.groups.reduce((s,g)=>s+g.unique,0),calculateProductAudiences(data).unique);
   assert.equal(p.groups.reduce((s,g)=>s+g.overlap,0),p.model.overlap);
 }
});

test('each portrait summary, detail and matrix includes universe and interests',()=>{
 const cards=clusterCardMetrics('estudiantes',PRODUCT_AUDIENCE_DEFAULT);
 assert.match(cards,/Pads · actuales/);
 assert.match(cards,/Poros · nuevos/);
 assert.match(cards,/Únicos estimados/);
 const detail=clusterProfileDetails('estudiantes',PRODUCT_AUDIENCE_DEFAULT);
 assert.match(detail,/¿de dónde sale cada audiencia/);
 assert.match(detail,/K-beauty/);
 assert.match(detail,/porcentaje|% del universo|% de los/);
 const filtering=clusterProfileDetails('estudiantes',PRODUCT_AUDIENCE_DEFAULT,'control-poros');
 assert.doesNotMatch(filtering,/Pads normales ·/);
 assert.match(filtering,/Pads Control Poros/);
 const matrix=clusterUniverseMatrix(PRODUCT_AUDIENCE_DEFAULT);
 assert.match(matrix,/Total distribuido/);
 assert.match(matrix,/6,98 M/);
 const exportRows=clusterExportRows(PRODUCT_AUDIENCE_DEFAULT);
 const last=exportRows.find(row=>row[0]==='Totales asignados');
 assert.equal(last[13],6_975_000);
 assert.equal(last[12],275_000);
});