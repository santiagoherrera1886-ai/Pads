import { calculateProductAudiences, PREMIUM_CLUSTERS } from './product-audiences.js';

// Primary planning assignment across five editorial profiles, NOT demographic reach,
// interest size or a measurement of actual purchases. Each cohort column adds to 100%.
export const CLUSTER_SHARES = Object.freeze({
  productivas: Object.freeze({ padsCurrent:25, padsNew:23, poreCurrent:25, poreNew:24 }),
  madres: Object.freeze({ padsCurrent:22, padsNew:19, poreCurrent:20, poreNew:17 }),
  deportistas: Object.freeze({ padsCurrent:18, padsNew:18, poreCurrent:18, poreNew:19 }),
  viajeras: Object.freeze({ padsCurrent:15, padsNew:16, poreCurrent:15, poreNew:15 }),
  estudiantes: Object.freeze({ padsCurrent:20, padsNew:24, poreCurrent:22, poreNew:25 }),
});

export const COHORT_INFO = Object.freeze([
 {key:'padsCurrent',product:'Pads normales',status:'Compradores actuales',short:'Pads · actuales',flag:'Retención · recompra',media:'Meta Ads · audiencias propias; YouTube · tutorial',mechanics:'Clientes o eventos de compra consentidos, cuando existan. Contenido sobre calidad del ritual y formatos de algodón.',creative:'Mi primer paso beauty, cada día.',tone:'Rutina de limpieza y fidelización'},
 {key:'padsNew',product:'Pads normales',status:'Audiencia nueva',short:'Pads · nuevos',flag:'Descubrimiento · prospecting',media:'Meta Ads · video; TikTok · creators; Pinterest · inspiración',mechanics:'Prospección amplia y señales de beauty, sin asumir que los intereses sean categorías disponibles en la plataforma.',creative:'El ritual de belleza comienza al limpiar.',tone:'Demostración de uso y contenido de entrada'},
 {key:'poreCurrent',product:'Pads Control Poros',status:'Compradores actuales',short:'Poros · actuales',flag:'Rutina · retención',media:'Meta Ads · remarketing consentido; YouTube · rutina',mechanics:'Audiencias propias de compradores verificables, si existen, con cuidado de no inferir condiciones dermatológicas.',creative:'Tu siguiente paso de skincare.',tone:'Uso contextual e ingredientes cosméticos'},
 {key:'poreNew',product:'Pads Control Poros',status:'Audiencia nueva',short:'Poros · nuevos',flag:'Educación · consideración',media:'TikTok · skin education; YouTube · intención; Meta Ads · video',mechanics:'Contenido educativo sobre rutinas y fórmulas, apoyado en señales que la plataforma permita seleccionar.',creative:'Conoce el paso de tratamiento en tu ritual.',tone:'Educar antes de pedir la compra'},
]);

export const CLUSTER_CONTENT = Object.freeze({
 productivas:{occasion:'De la jornada laboral a la rutina facial nocturna.',desire:'Belleza funcional, sofisticada y fácil de incorporar.',searches:['rutina facial después del trabajo','double cleansing de noche','skin cycling por la noche'],angle:'Transición visual oficina → baño → rutina. Separar limpiar de tratar.',channels:'Meta · reels de rutina / YouTube · demostración / Pinterest · night ritual'},
 madres:{occasion:'Un momento individual de autocuidado en casa.',desire:'Cuidado sensorial sin reducir a las personas a su rol familiar.',searches:['spa facial en casa','skincare como autocuidado','rutina facial sensorial'],angle:'Momento beauty propio, sin promesas clínicas ni estereotipos.',channels:'Meta · storytelling / YouTube · ritual / Pinterest · self-care'},
 deportistas:{occasion:'Después del entrenamiento, en el regreso a la rutina.',desire:'Skincare compatible con un estilo de vida activo.',searches:['rutina facial después del gimnasio','skincare post workout','limpieza facial deportistas'],angle:'Neceser gym → pads de limpieza → cuidado posterior.',channels:'TikTok · wellness / Meta · video corto / YouTube · tutorial'},
 viajeras:{occasion:'El neceser de viaje y la continuidad de los hábitos.',desire:'Beauty essentials y un ritual ordenado también fuera de casa.',searches:['skincare de viaje','neceser beauty','pads faciales travel essentials'],angle:'Packing beauty en destinos distintos: limpieza y control poros.',channels:'Pinterest · travel beauty / Instagram · creadores / TikTok · packing'},
 estudiantes:{occasion:'Explorar tendencias y aprender el orden de los productos, 18+.',desire:'Beauty discovery, cultura K-beauty y educación de ingredientes.',searches:['qué es double cleansing','rutina K-beauty básica','AHA BHA en cosmética'],angle:'GRWM educativo: algodón no es lo mismo que pad de tratamiento.',channels:'TikTok · beauty creators / YouTube · how-to / Meta · Reels'},
});

function proportionalSplit(total, weights) {
  if (!Number.isSafeInteger(total) || total < 0 || weights.some(w=>!Number.isFinite(w)||w<0)) throw new RangeError('Distribución inválida.');
  const wTotal=weights.reduce((a,b)=>a+b,0);
  if(!wTotal)return weights.map(()=>0);
  const exact=weights.map(w=>total*w/wTotal);
  const bases=exact.map(v=>Math.floor(v));
  const remainder=total-bases.reduce((a,b)=>a+b,0);
  const order=exact.map((v,i)=>({i,rem:v-bases[i]})).sort((a,b)=>b.rem-a.rem||a.i-b.i);
  for(let i=0;i<remainder;i++)bases[order[i].i]+=1;
  return bases;
}

// The cross-product overlap is assigned once among five primary clusters.
// Interests may overlap in practice; do not sum interests as unique people.
export function clusterAudiencePlan(input) {
  const model=calculateProductAudiences(input);
  const names=PREMIUM_CLUSTERS.map(c=>c.id);
  const counts={};
  for(const cohort of COHORT_INFO){
    const weights=names.map(id=>CLUSTER_SHARES[id][cohort.key]);
    if(weights.reduce((a,b)=>a+b,0)!==100)throw new Error('Los porcentajes deben sumar 100 por universo.');
    const parts=proportionalSplit(input[cohort.key],weights);
    names.forEach((id,i)=>{counts[id]??={};counts[id][cohort.key]=parts[i];});
  }
  const weights=names.map(id=>Math.min(
    counts[id].padsCurrent+counts[id].padsNew,
    counts[id].poreCurrent+counts[id].poreNew
  ));
  const overlapParts=proportionalSplit(model.overlap,weights);
  const groups=PREMIUM_CLUSTERS.map((profile,i)=>{
    const segments=counts[profile.id];
    const pads=segments.padsCurrent+segments.padsNew;
    const pore=segments.poreCurrent+segments.poreNew;
    const overlap=overlapParts[i];
    if(overlap>Math.min(pads,pore))throw new RangeError('El cruce por perfil supera su base de producto.');
    return {...profile,shares:CLUSTER_SHARES[profile.id],segments,pads,pore,
      overlap,unique:pads+pore-overlap,editorial:CLUSTER_CONTENT[profile.id]};
  });
  if(groups.reduce((s,g)=>s+g.unique,0)!==model.unique)throw new Error('El reparto no coincide con el universo único.');
  return {model,groups};
}

export function clusterExportRows(input) {
 const p=clusterAudiencePlan(input);
 return [
  [],
  ['Asignación primaria de clústeres: hipótesis de planeación, no tamaño de intereses ni de plataforma'],
  ['Perfil','Territorio beauty','Pads actuales (% de su cohorte)','Pads actuales (personas)',
  'Pads nuevos (%)','Pads nuevos (personas)','Poros actuales (%)','Poros actuales (personas)',
  'Poros nuevos (%)','Poros nuevos (personas)','Pads total (personas)','Poros total (personas)',
  'Overlap asignado (personas)','Únicos asignados (personas)','Intereses Pads actuales',
  'Intereses Pads nuevos','Intereses Poros actuales','Intereses Poros nuevos',
  'Búsquedas ilustrativas','Canales sugeridos','Mensaje creativo'],
  ...p.groups.map(g=>[
   g.name,g.insight,
   g.shares.padsCurrent,g.segments.padsCurrent,
   g.shares.padsNew,g.segments.padsNew,
   g.shares.poreCurrent,g.segments.poreCurrent,
   g.shares.poreNew,g.segments.poreNew,
   g.pads,g.pore,g.overlap,g.unique,
   g.padsCurrent.join(' | '),g.padsNew.join(' | '),
   g.poreCurrent.join(' | '),g.poreNew.join(' | '),
   g.editorial.searches.join(' | '),g.editorial.channels,g.editorial.angle
  ]),
  ['Totales asignados','',100,p.model.pads.current,100,p.model.pads.fresh,100,p.model.pore.current,
   100,p.model.pore.fresh,p.model.pads.total,p.model.pore.total,p.model.overlap,p.model.unique],
  ['Limitación','Un interés puede estar en varios perfiles; las cantidades asignadas NO miden usuarios de cada interés.'],
 ];
}
