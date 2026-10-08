import { daneAudienceAudit, PROVENANCE } from './dane-audience-math.js';
import { MARKET } from './market.js';

const people=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:0}).format(n);
const million=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:2}).format(n/1e6)+' M';
const pc=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:1}).format(n*100)+'%';
const cop=n=>'$'+new Intl.NumberFormat('es-CO',{maximumFractionDigits:0}).format(n);

export function daneMiniBridge(state,scenario={}) {
 const m=daneAudienceAudit(state,scenario);
 return `<section class="dane-mini panel" aria-label="Trazabilidad matemática del universo">
 <div><span class="eyebrow">BASE AUDITADA · DANE → ESTIMACIÓN → ESCENARIO</span><h3>El universo se construye paso a paso.</h3><p>Proyección de adultos → tasas TIC por edad → marco nacional → audiencia PADS fija. El último filtro es <b>una hipótesis estratégica</b>, no penetración calculada por el DANE.</p></div>
 <div class="dane-mini-steps">
 <span><small>DANE 18+ · 2027</small><b>${million(m.adults)}</b></span>
 <i aria-hidden="true">→</i>
 <span><small>Potencial digital propio</small><b>${million(m.rawDigital)}</b></span>
 <i aria-hidden="true">→</i>
 <span><small>Comunicación · planeación</small><b>${million(m.planning)}</b></span>
 <i aria-hidden="true">→</i>
 <span class="dane-mini-final"><small>PADS · universo fijo</small><b>${million(m.category)}</b></span>
 </div>
 <div class="dane-mini-foot"><span>Ticket medio fijo: <strong>${cop(MARKET.price)}</strong> / transacción</span><a href="#market">Ver fórmulas, edades, fuentes y límites ↗</a></div>
 </section>`;
}

function stage(num,name,value,type,description){
 return `<article class="dane-stage ${type}"><div class="dane-stage-id">${num}</div><span>${name}</span><strong>${value}</strong><p>${description}</p></article>`;
}
export function daneMathPanel(state,scenario={}) {
 const m=daneAudienceAudit(state,scenario),age=m.ageCohorts,sc=m.priceModel;
 return `<section class="panel dane-math" aria-label="Modelo matemático desde el DANE hasta las audiencias PADS">
 <header class="dane-head"><div><span class="eyebrow">METODOLOGÍA COMPLETA · TRAZABILIDAD DEMOGRÁFICA</span>
 <h2>Del DANE a las audiencias. Cada número tiene una ecuación.</h2>
 <p>El DANE aporta población, tasas de uso de internet y distribución económica. Los universos nacionales y de PADS surgen de operaciones matemáticas <strong>más decisiones de planeación</strong>, identificadas por separado.</p></div>
 <span class="dane-locked">PADS · 6,75 M fijos</span></header>
 <div class="dane-stage-grid">
 ${stage('01','Proyección DANE · 18+',million(m.adults),'official','Suma 2027 de todas las edades ≥18 en la serie nacional por sexo y edad.')}
 ${stage('02','Potencial digital calculado',million(m.rawDigital),'derived','Σ población por edad × tasa TIC observada en 2025.')}
 ${stage('03','Universo de comunicación',million(m.planning),'assumed','Digital estimado × factor estratégico; no inventario publicitario observado.')}
 ${stage('04','Universo único de PADS',million(m.category),'fixed','Tamaño fijo de categoría, deduplicado entre Pads normales y Control Poros.')}
 </div>
 <div class="dane-formula-wide"><span>ECUACIÓN DE TRANSICIÓN · LA DIFERENCIA ENTRE DATO Y DECISIÓN</span>
  <code>D = Σ P(2027,edad) × r_internet(2025,edad)</code>
  <code>C = D × ${pc(m.planningFraction)} = ${million(m.planning)}</code>
  <code>U_PADS = C × ${pc(m.categoryFraction)} = ${million(m.category)}</code>
  <p>El coeficiente de comunicación (${pc(m.planningFraction)}) es una decisión de planeación. El último ${pc(m.categoryFraction)} es <strong>la relación matemática implícita</strong> necesaria para reproducir el escenario fijo de PADS; no es una tasa observada de compra, afinidad o interés del DANE. No se debe presentar como un cálculo causal que demuestra 6,75 M compradores.</p>
 </div>
 <div class="dane-two-col">
  <div class="dane-info-card"><span class="eyebrow">01 · VALIDACIÓN DE LA POBLACIÓN</span><h3>Adultos por sexo y edad</h3>
   <div class="dane-inline-eq"><code>19.166.107 + 20.555.643 = ${people(m.adults)}</code></div>
   <p>La fuente demográfica publica sexo. El plan de medios considera todos los géneros, sin excluir personas por esta desagregación.</p>
   <div class="dane-smallbar"><i style="width:${pc(m.men/m.adults)}"></i><b style="width:${pc(m.women/m.adults)}"></b></div>
   <div class="dane-bar-legend"><span>Hombres ${pc(m.men/m.adults)}</span><span>Mujeres ${pc(m.women/m.adults)}</span></div>
  </div>
  <div class="dane-info-card"><span class="eyebrow">02 · ESTIMACIÓN DIGITAL</span><h3>Potencial por edad · tasa 2025</h3>
   <p>La población 2027 proviene de la serie DANE. Las tasas TIC son de 2025; conservarlas constantes es un supuesto explícito.</p>
   <div class="dane-age-table"><div class="dane-age-head"><span>Edad</span><span>Población</span><span>Uso TIC</span><span>Digital estimado</span></div>
   ${age.map(c=>`<div class="dane-age-row"><b>${c.age}</b><span>${million(c.population)}</span><span>${pc(c.internetRate)}${c.age==='18–24'?'*':''}</span><strong>${million(c.estimatedDigital)}</strong></div>`).join('')}
   <div class="dane-age-row dane-age-total"><b>Total</b><span>${million(m.adults)}</span><span>—</span><strong>${million(m.rawDigital)}</strong></div></div>
   <p class="dane-footnote">* Para 18–24 se usa la tasa publicada de 12–24 como proxy. No existe un cruce exacto 18–24 en esta fuente para el escenario mostrado.</p>
  </div>
 </div>
 <div class="dane-two-col">
  <div class="dane-info-card"><span class="eyebrow">03 · MARGEN DE PLANIFICACIÓN</span><h3>De ${million(m.rawDigital)} a 30 M</h3>
   <div class="dane-inline-eq"><code>${million(m.rawDigital)} × ${pc(m.planningFraction)} = ${million(m.planning)}</code></div>
   <p><b>${million(m.unassignedDigital)}</b> de diferencia respecto al potencial digital calculado: reserva estratégica. No se han medido afinidad, elegibilidad o cobertura publicitaria real.</p>
   <div class="dane-gradient-meter"><i style="width:${pc(m.planningFraction)}"></i></div>
   <div class="dane-pair"><span>Marco demográfico → digital</span><b>${pc(m.plusOfAdultDigital)}</b></div>
   <div class="dane-pair"><span>Digital → comunicación de planeación</span><b>${pc(m.planningFraction)}</b></div>
  </div>
  <div class="dane-info-card"><span class="eyebrow">04 · AUDIENCIA DE CATEGORÍA</span><h3>Dos productos, sin doble conteo</h3>
   <div class="dane-inline-eq"><code>4,5 M + 2,5 M − 0,25 M = 6,75 M</code></div>
   <p>10% fijo de overlap sobre la línea menor. <b>Esto no lo entrega el DANE</b>: es una distribución estratégica que debe validarse con estudios y datos propios.</p>
   <div class="dane-pair"><span>PADS únicos / adultos proyectados</span><b>${pc(m.categoryOfAdults)}</b></div>
   <div class="dane-pair"><span>PADS únicos / digital calculado</span><b>${pc(m.categoryOfDigital)}</b></div>
   <div class="dane-pair"><span>PADS únicos / comunicación nacional</span><b>${pc(m.categoryFraction)}</b></div>
  </div>
 </div>
 <div class="dane-detailed-block">
  <span class="eyebrow">05 · AUDITORÍA DE SENSIBILIDAD · TIC 2025</span><h3>¿Y si las tasas de internet cambian?</h3>
  <p>Escenario hipotético de ±5 puntos porcentuales por grupo de edad, recortando cada tasa entre 0% y 100%. No es un intervalo de confianza ni una proyección oficial. El tamaño fijo de PADS **no cambia** por esta sensibilidad.</p>
  <div class="dane-sensitivity-grid"><div><span>−5 p.p.</span><strong>${million(m.lowDigitalRateScenario)}</strong></div>
  <div><span>Base de tasas 2025</span><strong>${million(m.rawDigital)}</strong></div>
  <div><span>+5 p.p.</span><strong>${million(m.highDigitalRateScenario)}</strong></div></div>
  <code>D(δ)=Σ P2027(a) × min[1,max(0,r2025(a)+δ)]</code>
 </div>
 <div class="dane-two-col">
  <div class="dane-info-card"><span class="eyebrow">06 · BASE ECONÓMICA · GEIH 2025</span><h3>Referencia de ingresos, no compradores</h3>
   <div class="dane-inline-eq"><code>${million(m.adults)} × (38,0% + 3,3%) = ${million(m.socioeconomic)}</code></div>
   <p>El 41,3% corresponde a clase media y alta nacional, todas las edades en 2025; aplicarlo a adultos de 2027 es un <b>proxy</b>. No existe aquí un cruce edad × internet × ingreso.</p>
   <p><b>Cotas de intersección sin asumir independencia:</b> al conocer solo los tamaños de digital y referencia económica, la intersección de ambos está entre ${million(m.digitalEconomicLower)} y ${million(m.digitalEconomicUpper)}, no necesariamente en su producto.</p>
   <code>max(0,D+E−P) ≤ |D∩E| ≤ min(D,E)</code>
  </div>
  <div class="dane-info-card dane-ticket"><span class="eyebrow">07 · TICKET MEDIO COMERCIAL</span><h3>Ticket promedio por transacción</h3><strong class="dane-big-price">${cop(MARKET.price)}</strong>
   <p>Ticket medio fijado por el proyecto, no precio observado por el DANE y no necesariamente precio de cada SKU.</p>
   <div class="dane-pair"><span>Gasto mensual equivalente (${scenario.months??1} mes/es)</span><b>${cop(sc.monthlyCost)}</b></div>
   <div class="dane-pair"><span>Ingreso teórico usando ${scenario.budgetShare??5}% del ingreso</span><b>${cop(sc.threshold)}</b></div>
   <div class="dane-pair"><span>Ticket mensual / umbral de clase media 2025</span><b>${pc(sc.burden)}</b></div>
   <code>Ingreso teórico = (70.000 / meses) / (porcentajeIngreso/100)</code>
   <p class="dane-footnote">El umbral es una operación de presupuesto ilustrativa, no prueba de demanda ni regla de asequibilidad. El análisis no obliga a segmentar únicamente por ingreso.</p>
  </div>
 </div>
 <details class="dane-proof-links"><summary>Ver fuentes oficiales, fechas y límites de inferencia</summary>
  <div class="dane-sources-list">
   ${Object.values(PROVENANCE).map(s=>`<div><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a><small>${s.category} · periodo ${s.year}</small></div>`).join('')}
  </div>
  <p>Un público de PADS, un interés de Meta/TikTok y una persona digital no son el mismo denominador. Sin microdatos cruzados, estudios de consumo, datos transaccionales y estimaciones comparables de Ads Manager, no se puede derivar penetración o audiencia por interés directamente de agregados DANE.</p>
 </details>
 <div class="dane-bottom-actions"><button class="button primary" data-action="export-dane-math">Exportar ruta DANE y fórmulas ↓</button>
 <a class="button secondary" href="https://github.com/santiagoherrera1886-ai/Pads/blob/main/docs/math-methodology.md" target="_blank" rel="noopener noreferrer">Documentación matemática completa ↗</a></div>
 </section>`;
}