import { categoryMath, platformAllocation, affinityMatrix, reachByPlatform, MODEL_VERSION, MEDIA } from './math-foundation.js';
import { CLUSTER_SHARES } from './cluster-intelligence.js';

const fmt=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:0}).format(n);
const short=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:2}).format(n/1e6)+' M';
const p100=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:1}).format(n)+'%';
const money=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:0}).format(n);
const tags=arr=>arr.map(s=>'<span class="math-interest">'+s+'</span>').join('');
const COLORS=['#306de9','#9137d9','#f07798','#8c9a5f','#b47d69'];

function curveSvg(info) {
 const N=info.N,W=735,H=335,left=54,top=17,plotH=256,plotW=635;
 const x=t=>left+plotW*t/info.scenario.waves;
 const y=v=>top+plotH*(1-v/N);
 const path=k=>info.rows.map((r,i)=>`${i?'L':'M'}${x(r.wave).toFixed(2)},${y(k(r)).toFixed(2)}`).join(' ');
 const axes=[0,.25,.5,.75,1].map(q=>{
   const yy=y(q*N);return `<line x1="${left}" x2="${left+plotW}" y1="${yy}" y2="${yy}" stroke="#eadff1" stroke-dasharray="3 5"/><text x="5" y="${yy+4}" fill="#8c799b" font-size="11">${short(q*N)}</text>`;
 }).join('');
 const ticks=[0,3,6,9,12].map(t=>`<text x="${x(t)}" y="${top+plotH+25}" text-anchor="middle" fill="#8c799b" font-size="11">Ola ${t}</text>`).join('');
 const channelLines=info.media.map((p,i)=>`<path d="${path(r=>r.channels[i].reach)}" stroke="${COLORS[i]}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('');
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Curvas matemáticas ilustrativas de alcance para Meta, YouTube, TikTok, Pinterest, CTV y unión bajo hipótesis de independencia, 12 olas, techo máximo ${short(N)}">
 ${axes}<path d="${path(r=>r.upper)}" fill="none" stroke="#ab90ba" stroke-width="1.8" stroke-dasharray="5 6"/>
 <path d="${path(r=>r.lower)}" fill="none" stroke="#b7aabc" stroke-width="1.5" stroke-dasharray="4 6"/>
 ${channelLines}
 <path d="${path(r=>r.independent)}" fill="none" stroke="#36204d" stroke-width="3.8" stroke-linecap="round"/>
 ${ticks}<text x="${left+plotW/2}" y="${H-13}" text-anchor="middle" fill="#827290" font-size="11">Inversión acumulada en 12 olas iguales · escenario ilustrativo</text>
 </svg>`;
}

function clusterAffinityTable(state) {
 const matrix=affinityMatrix(state);
 return `<div class="math-overflow"><table class="math-affinity-table"><thead><tr><th>Clúster</th>${MEDIA.map(m=>`<th>${m.name}</th>`).join('')}</tr></thead><tbody>${matrix.map(c=>`<tr>
 <th>${c.name}<small>${short(c.unique)} únicos de categoría, hipotéticos</small></th>
 ${c.platforms.map((v,i)=>`<td><strong>${v.fit}/5</strong><small>${p100(v.index)} índice editorial</small><div class="math-fitbar"><i style="width:${v.index}%;background:${COLORS[i]}"></i></div></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function mathProfileExplanation(state,id){
 const a=affinityMatrix(state).find(c=>c.id===id);if(!a)return '';
 return `<section class="math-profile-method">
  <span class="eyebrow">CÓMO SE CALCULAN SUS AUDIENCIAS Y AFINIDADES</span>
  <p><strong>Origen:</strong> N(clúster,cohorte) = N(cohorte nacional) × peso editorial(clúster,cohorte) / Σ pesos. Los redondeos se compensan para que las cinco tarjetas sumen exactamente su universo de origen.</p>
  <div class="math-method-cohorts">${Object.entries(a.cohorts).map(([key,c])=>`<div><span>${key==='padsCurrent'?'Pads · comprador':key==='padsNew'?'Pads · nuevo':key==='poreCurrent'?'Control Poros · comprador':'Control Poros · nuevo'}</span><b>${short(c.base)} × ${c.weight}% = ${short(c.size)}</b></div>`).join('')}</div>
  <h3>Adecuación editorial por plataforma</h3>
  <p>Índice = (calificación editorial / 5) × 100. <strong>No es un porcentaje de usuarios con ese interés</strong> ni una cifra proporcionada por Ads Manager.</p>
  <div class="math-profile-media">${a.platforms.map((p,i)=>`<div><span>${p.name}</span><b>${p.fit}/5</b><i style="width:${p.index}%;background:${COLORS[i]}"></i></div>`).join('')}</div>
 </section>`;
}

export function mathEvidencePanel(state,scenario){
 const cat=categoryMath(state),sim=reachByPlatform(state,scenario),alloc=platformAllocation(state);
 const last=sim.final;
 return `<section class="panel math-proof" aria-label="Fundamento matemático de PADS">
  <div class="math-top"><div><span class="eyebrow">AUDIENCIA · FÓRMULAS · ALCANCE · VALIDACIÓN</span>
    <h2>La matemática detrás de cada audiencia.</h2>
    <p>Un modelo reproducible y trazable de universo, intersección, intereses y curvas de alcance. Distinguimos los <b>cálculos exactos</b> de las <b>hipótesis editoriales</b> y los <b>datos de plataforma pendientes</b>.</p></div>
    <span class="math-version">${MODEL_VERSION}</span></div>
  <div class="math-formula-hero">
    <div><span>BASE COMBINADA ANTES DE DEDUPLICAR</span><strong>${short(cat.pads.total+cat.pore.total)}</strong><small>${short(cat.pads.total)} Pads + ${short(cat.pore.total)} Control Poros</small></div>
    <div><span>OVERLAP SUPUESTO Y FIJO</span><strong>− ${short(cat.overlap)}</strong><small>10% × min(${short(cat.pads.total)}, ${short(cat.pore.total)})</small></div>
    <div><span>UNIVERSO ÚNICO DE CATEGORÍA</span><strong>${short(cat.unique)}</strong><small>Techo validado: 7 M, no audiencia de plataforma</small></div>
  </div>
  <div class="math-equation"><span>01 · FÓRMULA DE UNIVERSO</span><code>U = (2,1 + 2,4) + (0,6 + 1,9) − 0,10 × min(4,5; 2,5) = 6,75 M</code><p>Los grupos actuales/nuevos no se cruzan dentro de un producto. La misma persona sí puede pertenecer a ambas líneas.</p></div>
  <div class="math-equation"><span>02 · ASIGNACIÓN DE LOS CINCO CLÚSTERES</span><code>N(g,c) = redondeo[N(c) × w(g,c) / Σg w(g,c)]</code>
    <p><b>w(g,c)</b> son ponderaciones editoriales explícitas, no frecuencias observadas de intereses. La suma asignada de cada cohorte es siempre el 100%. Overlap por clúster proporcional a <code>min(Pads_g, Poros_g)</code>. La tabla de perfiles muestra los resultados.</p></div>
  <div class="math-section-head"><div><span class="eyebrow">PLATAFORMAS Y AFINIDAD</span><h3>Intereses: relevancia calculada, tamaño sin inventar.</h3></div></div>
  <p class="math-explanation">Para priorizar cada plataforma se asigna una valoración estratégica de 1 a 5 por clúster. El índice muestra <b>100 × calificación/5</b>; las búsquedas y etiquetas de skincare siguen siendo sugerencias pendientes de validación en los selectores de Meta, Google, TikTok y Pinterest. CTV se evalúa por contexto.</p>
  ${clusterAffinityTable(state)}
  <details class="math-reveal"><summary>Ver fórmula del mix y supuestos de las plataformas</summary>
    <p><code>Score(m) = Σg [N_únicos(g) × afinidad(g,m)]</code>, <code>Mix(m) = Score(m)/Σmedios Score(m)</code>. Son ponderaciones para un ejemplo de inversión, no performance, públicos efectivos ni intención de compra medida.</p>
    <div class="math-media-explain">${alloc.map(m=>`<div><b>${m.name}</b><span>${p100(m.weightPercent)} del presupuesto supuesto · Adecuación editorial</span><small>${m.kind}</small></div>`).join('')}</div>
  </details>
  <div class="math-section-head"><div><span class="eyebrow">SATURACIÓN · DOCE OLAS</span><h3>Curvas matemáticas de alcance por medio.</h3></div>
   <span class="math-simulation-pill">SIMULACIÓN NO CALIBRADA</span></div>
  <p class="math-explanation">Escenario del simulador: <strong>$${money(scenario.budget)} COP</strong> de inversión, <strong>$${money(scenario.cpm)} COP</strong> de CPM <em>único y supuesto</em> en todos los medios; distribución en 12 olas. Para cada plataforma suponemos, solo para ilustrar el cálculo, elegibilidad de toda la categoría: <b>N = ${short(cat.unique)}</b>. Este supuesto debe sustituirse por tamaños elegibles reales.</p>
  <div class="math-curve">${curveSvg(sim)}</div>
  <div class="math-legend">${[...sim.media.map((m,i)=>`<span><i style="background:${COLORS[i]}"></i>${m.name}</span>`),'<span><i style="background:#36204d"></i>Unión independiente hipotética</span>','<span><i style="background:#ab90ba"></i>Bandas condicionales</span>'].join('')}</div>
  <div class="math-results">
    <article><span>Alcance matemático independiente</span><strong>${short(last.independent)}</strong><small>No es un reach real ni garantizado</small></article>
    <article><span>Cota inferior condicional</span><strong>${short(last.lower)}</strong><small>Mayor alcance individual modelado</small></article>
    <article><span>Cota superior condicional</span><strong>${short(last.upper)}</strong><small>min(N, suma de los medios)</small></article>
    <article><span>Frecuencia matemática</span><strong>${new Intl.NumberFormat('es-CO',{maximumFractionDigits:2}).format(last.frequency)}</strong><small>Impresiones / alcance independiente</small></article>
  </div>
  <details class="math-reveal"><summary>Ver ecuaciones de saturación, deduplicación y cálculo por ola</summary>
    <div class="math-equations-detail">
      <div><strong>Impresiones</strong><code>I(m,t) = B × Mix(m) × t/12 × 1.000 / CPM</code><p>Presupuesto y CPM son supuestos. Sin costos reales por canal, el mix no es una optimización empírica.</p></div>
      <div><strong>Alcance teórico por canal</strong><code>R(m,t) = N × [1 − exp(−I(m,t)/N)]</code><p>Modelo de saturación tipo Poisson, requiere elegibilidad comparable y exposición uniforme dentro de su población.</p></div>
      <div><strong>Unión bajo independencia</strong><code>R_ind(t) = N × [1 − Πm(1 − R(m,t)/N)]</code><p>Escenario teórico, no medición de personas repetidas entre plataformas.</p></div>
      <div><strong>Límites de unión</strong><code>max(R_m) ≤ R_único ≤ min(N, ΣR_m)</code><p>Válidos como cotas únicamente condicionadas a los alcances de cada medio; aquí esos alcances son simulados.</p></div>
      <div><strong>Frecuencia</strong><code>F(t) = Impresiones_acumuladas(t) / R_ind(t)</code><p>La frecuencia de una plataforma real se obtiene de reportes de impresiones y alcance; no de intereses.</p></div>
    </div>
  </details>
  <div class="math-section-head"><div><span class="eyebrow">TRAZABILIDAD</span><h3>Qué información falta para calibrar el modelo.</h3></div></div>
  <div class="math-data-flags"><div><b>Determinístico</b><p>Suma de cohortes, overlap asumido, normalización, redondeos y límites.</p></div>
   <div><b>Supuesto explícito</b><p>Penetración por producto, pesos por clúster, adecuación por plataforma, CPM y curva de saturación.</p></div>
   <div><b>Pendiente de medición</b><p>Intereses realmente seleccionables, alcance potencial por medio, CPM observado, overlap entre medios y alcance real.</p></div></div>
  <div class="math-sources"><span>REFERENCIAS METODOLÓGICAS</span>
    <a href="https://support.google.com/google-ads/answer/9427120?hl=en" target="_blank" rel="noopener noreferrer">Google Ads · Reach Planner ↗</a>
    <a href="https://ads.tiktok.com/resources/help/article/audience-size-estimation-overview?lang=es" target="_blank" rel="noopener noreferrer">TikTok · Tamaño de audiencia ≠ alcance ↗</a>
    <a href="https://ads.tiktok.com/resources/help/article/reach-estimator-for-brand-auction?lang=es" target="_blank" rel="noopener noreferrer">TikTok · Estimador de alcance ↗</a>
    <a href="https://ads.tiktok.com/resources/help/article/interest-targeting" target="_blank" rel="noopener noreferrer">TikTok · Intereses disponibles ↗</a>
  </div>
  <div class="math-actions"><button class="button primary" data-action="export-math">Exportar fórmulas, afinidades y 12 olas ↓</button></div>
  <p class="math-disclaimer">Los intereses y ponderaciones son propuestas editoriales y no equivalen a una taxonomía verificada por Ads Manager. La curva muestra un escenario matemático bajo supuestos fuertes, no una predicción certificada por ninguna de las plataformas. Requiere calibración con información real de campañas para reportar un forecast.</p>
 </section>`;
}