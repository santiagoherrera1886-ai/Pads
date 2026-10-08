import { clusterAudiencePlan, COHORT_INFO } from './cluster-intelligence.js';
const short=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:2}).format(n/1e6)+' M';
const fmt=n=>new Intl.NumberFormat('es-CO').format(n);
const share=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:1}).format(n)+'%';
const interests=arr=>arr.map(s=>'<span class="ci-tag">'+s+'</span>').join('');
const allowed=(filter,k)=>filter==='all'||(filter==='limpieza'?k.startsWith('pads'):k.startsWith('pore'));
const cohortBases=m=>({padsCurrent:m.pads.current,padsNew:m.pads.fresh,poreCurrent:m.pore.current,poreNew:m.pore.fresh});

function clusterBlocks(g,filter,bases) {
  return COHORT_INFO.filter(co=>allowed(filter,co.key)).map(co=>{
   const n=g.segments[co.key],pct=g.shares[co.key],terms=g[co.key];
   return `<article class="ci-cohort-detail ${co.key.startsWith('pads')?'ci-pads':'ci-pore'}">
     <div class="ci-cohort-head"><span>${co.product}</span><b>${co.status}</b></div>
     <div class="ci-cohort-stat"><strong>${short(n)}</strong><span>${share(pct)} de los <b>${short(bases[co.key])}</b> de esta cohorte nacional</span></div>
     <div class="ci-cohort-meter"><i style="width:${pct}%"></i></div>
     <p class="ci-label">Intereses y contextos premium asociados</p>
     <div class="ci-tags">${interests(terms)}</div>
     <p class="ci-label">${co.flag}</p>
     <p class="ci-small">${co.mechanics}</p>
     <p class="ci-label">Medios y ejecución sugeridos</p>
     <p class="ci-small">${co.media}</p>
     <p class="ci-label">Ángulo creativo</p><p class="ci-small">${co.creative}</p>
   </article>`;
  }).join('');
}

export function clusterCardMetrics(id,state,filter='all') {
 const p=clusterAudiencePlan(state),g=p.groups.find(x=>x.id===id);
 if(!g)return '';
 const entries=COHORT_INFO.filter(co=>allowed(filter,co.key));
 return `<div class="ci-card-metrics" aria-label="Audiencias estimadas en ${g.name}">
   <span class="ci-card-title">BASE POR PERFIL · HIPÓTESIS</span>
   <div class="ci-card-kpis">${entries.map(co=>`<span class="${co.key.startsWith('pads')?'ci-blue':'ci-violet'}"><small>${co.short}</small><b>${short(g.segments[co.key])}</b></span>`).join('')}</div>
   <div class="ci-card-total"><span>${filter==='all'?'Únicos estimados en el perfil':filter==='limpieza'?'Total Pads normales':'Total Control Poros'}</span><b>${short(filter==='all'?g.unique:filter==='limpieza'?g.pads:g.pore)}</b></div>
   <small class="ci-card-caveat">Asignación primaria; intereses no medidos</small>
 </div>`;
}

export function clusterProfileDetails(id,state,filter='all') {
 const p=clusterAudiencePlan(state),g=p.groups.find(x=>x.id===id);
 if(!g)return '';
 return `<section class="ci-profile-details" aria-label="Detalle de universos e intereses de ${g.name}">
   <div class="ci-headline"><span class="eyebrow">BEAUTY INTELLIGENCE · UNIVERSOS Y SEÑALES</span>
   <h3>${g.name}: ¿de dónde sale cada audiencia?</h3>
   <p>${g.editorial.occasion} ${g.editorial.desire}</p></div>
   <div class="ci-profile-top">
     <div><span>Base Pads normales</span><b>${short(g.pads)}</b></div>
     <div><span>Base Control Poros</span><b>${short(g.pore)}</b></div>
     <div><span>Overlap asignado entre líneas</span><b>− ${short(g.overlap)}</b></div>
     <div class="ci-profile-unique"><span>Únicos estimados del perfil</span><b>${short(g.unique)}</b></div>
   </div>
   <p class="ci-qualification">Cada bloque de abajo indica <strong>el universo de origen, su proporción del total y sus intereses sugeridos</strong>. No se atribuye un número de personas a cada interés: una persona puede tener varios intereses. El overlap entre líneas se asigna una sola vez y no implica duplicación de compradores.</p>
   <div class="ci-detail-grid">${clusterBlocks(g,filter,cohortBases(p.model))}</div>
   <div class="ci-activation">
      <div><span class="ci-label">Momento de activación</span><p>${g.editorial.occasion}</p></div>
      <div><span class="ci-label">Búsquedas y temas de contenido</span><div class="ci-tags">${interests(g.editorial.searches)}</div></div>
      <div><span class="ci-label">Canales y formatos</span><p>${g.editorial.channels}</p></div>
      <div><span class="ci-label">Territorio creativo</span><p>${g.editorial.angle}</p></div>
   </div>
   <p class="ci-disclaimer">Fuente: hipótesis de segmentación y asignación editorial sobre los universos editables de la categoría. Validar señales disponibles en Meta, Google, TikTok y Pinterest, además de estudios y datos propios antes de presentar alcances garantizados.</p>
 </section>`;
}

export function clusterUniverseMatrix(state,filter='all') {
 const p=clusterAudiencePlan(state),visible=COHORT_INFO.filter(co=>allowed(filter,co.key));
 return `<section class="ci-matrix-wrap" aria-label="Distribución de universos por perfil">
   <div class="ci-headline"><span class="eyebrow">DIMENSIONAMIENTO POR PERFIL · BASE EDITABLE</span>
    <h3>Los cinco clústeres conectados al universo.</h3>
    <p>Distribución primaria orientativa. Cada columna reparte el <strong>100% de su audiencia de origen</strong> entre cinco perfiles, para no sumar el mismo grupo cinco veces. El cruce entre productos se descuenta al calcular los únicos.</p>
   </div>
   <div class="ci-scroll">
    <table class="ci-matrix">
     <thead><tr><th>Perfil / universo</th>${visible.map(co=>`<th>${co.short}<small>Base ${short(state[co.key])}</small></th>`).join('')}<th>${filter==='all'?'Únicos sin duplicar':'Total del producto'}</th></tr></thead>
     <tbody>${p.groups.map(g=>`<tr><th><button data-action="audience" data-value="${g.id}">${g.name} ↗</button><small>${g.insight}</small></th>${visible.map(co=>`<td><b>${short(g.segments[co.key])}</b><small>${share(g.shares[co.key])} del universo</small></td>`).join('')}<td class="ci-grand">${short(filter==='all'?g.unique:filter==='limpieza'?g.pads:g.pore)}</td></tr>`).join('')}
     <tr class="ci-total-row"><th>Total distribuido <small>No se suma el mismo grupo cinco veces</small></th>${visible.map(co=>`<td><b>${short(state[co.key])}</b><small>100%</small></td>`).join('')}<td class="ci-grand">${short(filter==='all'?p.model.unique:filter==='limpieza'?p.model.pads.total:p.model.pore.total)}</td></tr></tbody>
    </table>
   </div>
   <p class="ci-disclaimer"><strong>Cómo leer:</strong> “Pads nuevos · 1,61 M” en un perfil representa una porción ilustrativa de los 7 M nuevos para Pads, no el tamaño de “GRWM” o “K-beauty”. Los intereses se pueden repetir entre perfiles y plataformas: no se suman como personas únicas.</p>
 </section>`;
}