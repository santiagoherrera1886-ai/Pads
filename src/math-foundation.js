import { calculateProductAudiences, PREMIUM_CLUSTERS } from './product-audiences.js';
import { clusterAudiencePlan, CLUSTER_SHARES } from './cluster-intelligence.js';

// Auditable planning only. No reach or size is inferred from the names of interests.
export const MODEL_VERSION='2026-10-08 | modelo matemático v1';
export const DEFAULT_MEDIA_SCENARIO=Object.freeze({budget:100_000_000,cpm:8000,waves:12});
// Expert ratings [1..5], not empirical platform targeting sizes or conversion data.
export const MEDIA=Object.freeze([
 {id:'meta',name:'Meta Ads',fit:[5,5,4,4,4],kind:'Audiencias propias / intereses a validar',source:'https://www.facebook.com/business/ads'},
 {id:'youtube',name:'YouTube',fit:[4,4,4,3,5],kind:'Contenido / segmentos personalizados a validar',source:'https://support.google.com/google-ads/answer/9427120?hl=en'},
 {id:'tiktok',name:'TikTok',fit:[4,3,5,4,5],kind:'Categorías de interés disponibles en la cuenta',source:'https://ads.tiktok.com/resources/help/article/interest-targeting'},
 {id:'pinterest',name:'Pinterest',fit:[4,4,3,5,4],kind:'Búsquedas y palabras clave',source:'https://help.pinterest.com/en/business/article/targeting-options'},
 {id:'ctv',name:'CTV',fit:[3,3,3,3,3],kind:'Contextos e inventario a negociar, no intereses de usuario',source:''},
]);

export function categoryMath(state){
 const m=calculateProductAudiences(state),cluster=clusterAudiencePlan(state);
 const keys=['padsCurrent','padsNew','poreCurrent','poreNew'];
 const sums=Object.fromEntries(keys.map(k=>[k,cluster.groups.reduce((acc,g)=>acc+g.segments[k],0)]));
 if(keys.some(k=>sums[k]!==state[k])||cluster.groups.reduce((a,g)=>a+g.unique,0)!==m.unique)throw Error('La asignación de clústeres no cierra.');
 return {...m,clusters:cluster.groups,cohortSums:sums,consistent:true};
}
export function platformAllocation(state){
 const cat=categoryMath(state);
 const products=MEDIA.map(p=>({...p,score:cat.clusters.reduce((acc,g,i)=>acc+g.unique*p.fit[i],0)}));
 const denominator=products.reduce((acc,p)=>acc+p.score,0);
 return products.map(p=>({...p,weight:p.score/denominator,weightPercent:100*p.score/denominator}));
}
export function affinityMatrix(state){
 const category=categoryMath(state);
 return category.clusters.map((g,i)=>({
  id:g.id,name:g.name,unique:g.unique,
  cohorts:Object.fromEntries(['padsCurrent','padsNew','poreCurrent','poreNew'].map(k=>
    [k,{size:g.segments[k],weight:CLUSTER_SHARES[g.id][k],base:state[k],interests:g[k]}])),
  platforms:MEDIA.map(p=>({id:p.id,name:p.name,fit:p.fit[i],index:p.fit[i]/5*100}))
 }));
}
// I_j(t) = Budget x weight_j x (t / waves) x 1000 / assumedCPM
// R_j(t) = N * [1-exp(-I_j(t)/N)]. Full eligibility on each
// platform is ASSUMED for illustration, not measured or guaranteed.
// Cross-platform independence is illustrative; no observed ID deduplication.
export function reachByPlatform(state,scenario=DEFAULT_MEDIA_SCENARIO){
 const {budget,cpm,waves}=scenario;
 if(!Number.isFinite(budget)||budget<0||budget>1e12||!Number.isFinite(cpm)||cpm<=0||!Number.isInteger(waves)||waves<1||waves>52)throw RangeError('Presupuesto, CPM u olas inválidos.');
 const N=categoryMath(state).unique,media=platformAllocation(state);
 const rows=Array.from({length:waves+1},(_,i)=>{
  const frac=i/waves,spend=budget*frac,impressions=1000*spend/cpm;
  const channels=media.map(p=>{
   const imp=impressions*p.weight,reach=-N*Math.expm1(-imp/N);
   return {id:p.id,name:p.name,weight:p.weight,spend:spend*p.weight,impressions:imp,reach,coverage:reach/N,frequency:reach?imp/reach:0};
  });
  const lower=Math.max(...channels.map(c=>c.reach));
  const upper=Math.min(N,channels.reduce((a,c)=>a+c.reach,0));
  const independent=-N*Math.expm1(-impressions/N);
  if(independent<lower-1e-4||independent>upper+1e-4)throw Error('Los límites de unión no cierran.');
  return {wave:i,spend,impressions,channels,lower,upper,independent,
   frequency:independent?impressions/independent:0,coverage:independent/N};
 });
 return {N,scenario:{budget,cpm,waves},media,rows,final:rows.at(-1),classification:'simulación sin calibración ni medición por plataforma'};
}
export function mathExportRows(state,scenario=DEFAULT_MEDIA_SCENARIO){
 const model=categoryMath(state),forecast=reachByPlatform(state,scenario),matrix=affinityMatrix(state);
 return [
 ['AUDITORÍA MATEMÁTICA | SIMULACIÓN, NO DATOS CERTIFICADOS DE LAS PLATAFORMAS'],
 ['Versión',MODEL_VERSION],['Pads normales',model.pads.total],['Control Poros',model.pore.total],
 ['Intersección de producto',model.overlap],['Únicos',model.unique],
 ['Universo','U = Pads_actuales + Pads_nuevos + Poros_actuales + Poros_nuevos − 0,1 × min(Pads_total,Poros_total)'],
 ['Clúster','N(g,c) = redondeo controlado[N(c) × w(g,c)/Σ_g w(g,c)]; w son ponderaciones editoriales no medidas'],
 ['Cruce por clúster','O(g) = O_total × min(Pads(g),Poros(g)) / Σ_h min(Pads(h),Poros(h)); redondeo controlado'],
 ['Afinidad editorial','Índice(g,m) = 100 × adecuación experta(g,m)/5; no mide personas por interés'],
 ['Mix hipotético','W(m)=Σ_g [N_únicos(g) × fit(g,m)] / Σ_medios Σ_g[N_únicos(g) × fit(g,m)]'],
 ['Impresiones por ola','I(m,t) = inversión × W(m) × t/12 × 1000 / CPM global supuesto'],
 ['Saturación','R(m,t)=N × (1-exp(-I(m,t)/N)); supone elegibilidad completa por medio'],
 ['Unión independiente ilustrativa','R_ind=N × (1−Π_m(1−R_m/N)); no es deduplicación observada'],
 ['Límites condicionales','max(R_m) ≤ R_único ≤ min(N,Σ R_m), si se conocieran los R_m'],
 ['Frecuencia','F = impresiones / alcance modelado'],
 ['Presupuesto supuesto COP',scenario.budget],['CPM global supuesto COP',scenario.cpm],
 [],['Medio','Participación % escenario','Score ponderado editorial','Alcance modelado final','Impresiones supuestas'],
 ...forecast.media.map(p=>{const x=forecast.final.channels.find(c=>c.id===p.id);return[p.name,p.weightPercent,p.score,x.reach,x.impressions]}),
 [],['Ola','Inversión acumulada','Impresiones','Unión independiente supuesta','Límite inferior condicional','Límite superior condicional','Frecuencia','Meta','YouTube','TikTok','Pinterest','CTV'],
 ...forecast.rows.map(r=>[r.wave,r.spend,r.impressions,r.independent,r.lower,r.upper,r.frequency,...MEDIA.map(p=>r.channels.find(c=>c.id===p.id).reach)]),
 [],['Clúster','Cohorte','Participación editorial %','Personas asignadas','Intereses propuestos sin verificar','Fit Meta/5','Fit YouTube/5','Fit TikTok/5','Fit Pinterest/5','Fit CTV/5'],
 ...matrix.flatMap(g=>Object.entries(g.cohorts).map(([key,c])=>[g.name,key,c.weight,c.size,c.interests.join(' / '),...g.platforms.map(p=>p.fit)])),
 ['Requerido para calibración','Alcances e impresiones reales, CPM por plataforma, tamaños de audiencia en Ads Manager, medición cross-media, CRM con consentimiento y fecha/región.'],
 ['Google metodología','https://support.google.com/google-ads/answer/9427120?hl=en'],
 ['TikTok estimación de audiencia','https://ads.tiktok.com/resources/help/article/audience-size-estimation-overview?lang=es'],
 ['TikTok forecast','https://ads.tiktok.com/resources/help/article/reach-estimator-for-brand-auction?lang=es'],
 ];
}