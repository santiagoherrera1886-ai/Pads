import { calculateProductAudiences, PREMIUM_CLUSTERS, MAX_CATEGORY_UNIQUE } from './product-audiences.js';
import { clusterAudiencePlan } from './cluster-intelligence.js';

const fm = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(n / 1_000_000) + ' M';
const fp = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(n) + '%';
const tags = arr => arr.map(s => '<span class="pa-chip">' + s + '</span>').join('');

function scopeClusterCard(c, filter, g) {
  const columns = [
    { id: 'padsCurrent', product: 'Pads normales', status: 'Compradores actuales', interest: c.padsCurrent },
    { id: 'padsNew', product: 'Pads normales', status: 'Audiencia nueva', interest: c.padsNew },
    { id: 'poreCurrent', product: 'Control Poros', status: 'Compradores actuales', interest: c.poreCurrent },
    { id: 'poreNew', product: 'Control Poros', status: 'Audiencia nueva', interest: c.poreNew },
  ].filter(x => filter === 'all' || (filter === 'limpieza' ? x.id.startsWith('pads') : x.id.startsWith('pore')));
  return `<details class="pa-cluster-card">
    <summary><span class="pa-cluster-index">0${PREMIUM_CLUSTERS.indexOf(c) + 1}</span><span><b>${c.name}</b><small>${c.insight}</small></span><span class="pa-cluster-volume">${fm(g.unique)} únicos estimados</span><span class="pa-arrow">+</span></summary>
    <div class="pa-interests">${columns.map(x => `<article><span class="pa-eyebrow">${x.product} · ${x.status}</span><strong class="pa-cluster-count">${fm(g.segments[x.id])} · ${g.shares[x.id]}% del universo de origen</strong><div class="pa-chip-list">${tags(x.interest)}</div></article>`).join('')}</div>
    <div class="pa-cluster-foot"><button class="text-link" type="button" data-action="audience" data-value="${c.id}">Ver perfil, creatividad y canales ↗</button></div>
  </details>`;
}

function audienceCard(label, number, current, product) {
  return `<article class="pa-cohort ${product} ${current ? 'existing' : 'fresh'}">
    <div class="pa-cohort-meta"><span>${label}</span><i aria-hidden="true"></i></div>
    <strong>${fm(number)}</strong>
    <small>${current ? 'Compradores actuales · hipótesis' : 'Personas nuevas para esta línea · hipótesis'}</small>
  </article>`;
}

export function productAudiencePanel(state, { scope = 'audiences', filter = 'all' } = {}) {
  const m = calculateProductAudiences(state);
  const id = 'pa-' + scope;
  return `<section class="panel pa-panel" id="${id}" aria-label="Universos por producto, compradores, prospectos y superposición">
    <div class="pa-heading">
      <div><span class="eyebrow">PADS AUDIENCE LAB · BELLEZA Y SKINCARE</span><h2>Dos productos. Cuatro audiencias. Un universo único.</h2>
      <p>Separamos Pads normales y Pads Control Poros. Cada uno tiene sus compradores actuales y sus oportunidades de descubrimiento. Las dos líneas pueden convivir en una misma persona.</p></div>
      <span class="pa-scope">Toda Colombia · 18+ · todos los géneros</span>
    </div>
    <div class="pa-flag"><b>HIPÓTESIS EDITABLE</b> Los tamaños de categoría y el overlap no son mediciones de JGB, Meta ni DANE. Los <strong>30 M</strong> nacionales son la base amplia de comunicación, no compradores de pads. <strong>Tope conjunto de categoría: 7 M únicos después del overlap.</strong></div>
    <div class="pa-products">
      <div class="pa-product-card">
        <div class="pa-product-head"><img src="assets/pads-redondos.png" alt="Pads de algodón de JGB" loading="lazy"><div><span>01 · RITUAL DE LIMPIEZA</span><h3>Pads normales</h3><p>Algodón, limpieza, desmaquillado y rutinas beauty.</p></div><strong>${fm(m.pads.total)}</strong></div>
        <div class="pa-cohorts">
          ${audienceCard('Ya compran Pads', m.pads.current, true, 'normal')}
          ${audienceCard('Por conquistar', m.pads.fresh, false, 'normal')}
        </div>
        <div class="pa-editors">
          <label>Compradores actuales <span>millones</span><input type="number" min="0" max="7" step="0.05" value="${state.padsCurrent / 1e6}" data-product-audience-key="padsCurrent"></label>
          <label>Audiencia nueva <span>millones</span><input type="number" min="0" max="7" step="0.05" value="${state.padsNew / 1e6}" data-product-audience-key="padsNew"></label>
        </div>
      </div>
      <div class="pa-product-card pore">
        <div class="pa-product-head"><img src="assets/pads-control-poros.png" alt="Pads Control Poros de JGB" loading="lazy"><div><span>02 · SKINCARE DE TRATAMIENTO</span><h3>Pads Control Poros</h3><p>Skin education, poros y descubrimiento de rutinas.</p></div><strong>${fm(m.pore.total)}</strong></div>
        <div class="pa-cohorts">
          ${audienceCard('Ya compran Control Poros', m.pore.current, true, 'pore')}
          ${audienceCard('Por conquistar', m.pore.fresh, false, 'pore')}
        </div>
        <div class="pa-editors">
          <label>Compradores actuales <span>millones</span><input type="number" min="0" max="7" step="0.05" value="${state.poreCurrent / 1e6}" data-product-audience-key="poreCurrent"></label>
          <label>Audiencia nueva <span>millones</span><input type="number" min="0" max="7" step="0.05" value="${state.poreNew / 1e6}" data-product-audience-key="poreNew"></label>
        </div>
      </div>
    </div>
    <div class="pa-overlap-grid">
      <div class="pa-diagram">
        <div class="pa-caption">OVERLAP ENTRE PRODUCTOS · NO DUPLICAMOS PERSONAS</div>
        <svg viewBox="0 0 650 344" role="img" aria-label="Pads normales ${fm(m.pads.total)}, Pads Control Poros ${fm(m.pore.total)}, comparten ${fm(m.overlap)}. Universo deduplicado ${fm(m.unique)}. Círculos ilustrativos, no a escala.">
          <defs><linearGradient id="${id}-blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7ab8ff"/><stop offset="1" stop-color="#235df2"/></linearGradient>
          <linearGradient id="${id}-violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c48dfb"/><stop offset="1" stop-color="#7a18df"/></linearGradient>
          <clipPath id="${id}-clip"><circle cx="404" cy="166" r="148"/></clipPath></defs>
          <circle cx="248" cy="166" r="148" fill="url(#${id}-blue)"/>
          <circle cx="404" cy="166" r="148" fill="url(#${id}-violet)"/>
          <circle cx="248" cy="166" r="148" fill="#39239e" clip-path="url(#${id}-clip)" stroke="#ece2ff" stroke-width="1.5"/>
          <g fill="white" text-anchor="middle" font-family="Inter,Arial,sans-serif">
            <text x="176" y="144" font-size="43" font-weight="800">${fm(m.pads.total)}</text>
            <text x="176" y="172" font-size="16" font-weight="650">Pads normales</text>
            <text x="484" y="144" font-size="43" font-weight="800">${fm(m.pore.total)}</text>
            <text x="484" y="172" font-size="16" font-weight="650">Control Poros</text>
            <text x="326" y="150" font-size="29" font-weight="800">${fm(m.overlap)}</text>
            <text x="326" y="174" font-size="13" font-weight="650">comparten</text>
            <text x="326" y="196" font-size="17" font-weight="800">${fp(m.overlapRate)}</text>
          </g>
          <text x="326" y="339" text-anchor="middle" fill="#8b779c" font-size="11">Overlap referido a la audiencia menor · áreas ilustrativas, no a escala</text>
        </svg>
        <div class="pa-slider-box"><label for="${id}-overlap">Overlap entre líneas <strong>${fp(m.overlapRate)}</strong></label>
          <input id="${id}-overlap" type="range" min="0" max="10" step="0.5" value="${m.overlapRate}" data-product-overlap>
          <div><span>0% · sin cruce</span><span>10% · máximo supuesto</span></div>
        </div>
      </div>
      <div class="pa-dedup">
        <span class="pa-caption">UNIVERSO ÚNICO ENTRE LOS DOS PRODUCTOS · MÁXIMO 7 M</span><strong>${fm(m.unique)}</strong><p class="pa-max-note">Techo conjunto: ${fm(MAX_CATEGORY_UNIQUE)} de personas únicas.</p>
        <p>Personas sin doble conteo entre Pads normales y Control Poros.</p>
        <div class="pa-formula"><span>+ Pads normales <b>${fm(m.pads.total)}</b></span><span>+ Control Poros <b>${fm(m.pore.total)}</b></span><span>− Personas compartidas <b>${fm(m.overlap)}</b></span></div>
        <div class="pa-balance"><span>Dentro del escenario de categoría</span><b>${fp(m.unique / m.national * 100)} de 30 M</b></div>
        <div class="pa-progress" role="img" aria-label="${fp(m.unique / MAX_CATEGORY_UNIQUE * 100)} del máximo conjunto de 7 millones"><i style="width:${m.unique / MAX_CATEGORY_UNIQUE * 100}%"></i></div>
        <small>${fm(m.remaining)} del universo general quedan fuera de estas dos bases supuestas. No los clasificamos automáticamente como compradores.</small>
      </div>
    </div>
    <details class="pa-overlap-explain">
      <summary>¿Cómo conviven los cuatro públicos dentro del overlap? <span>Ver cruce ↗</span></summary>
      <p>Comprador y audiencia nueva son excluyentes <strong>solo dentro del mismo producto</strong>. Quien ya compra pads de algodón puede ser audiencia nueva para Control Poros. Distribuimos el cruce proporcionalmente como ejemplo, sin afirmar que exista esa composición medida.</p>
      <div class="pa-matrix">${m.cells.map(x => `<div><span>${x.label}</span><b>${fm(x.people)}</b></div>`).join('')}</div>
      <p><strong>Fórmula:</strong> únicos = ${fm(m.pads.total)} + ${fm(m.pore.total)} − ${fm(m.overlap)} = ${fm(m.unique)}. El porcentaje de overlap se aplica a la base menor, nunca supera el 10% y no se resta dos veces.</p>
    </details>
    ${scope === 'audiences' ? `<div class="pa-clusters">
      <div class="pa-clusters-head"><span class="pa-caption">BEAUTY INTELLIGENCE · CINCO CONTEXTOS</span><h3>Intereses premium donde conviven los productos.</h3>
        <p>Elige un perfil para ver cuatro territorios distintos: comprador actual y audiencia nueva de cada línea. Son afinidades e ideas de contenido por validar en cada plataforma, no intereses garantizados de pauta ni grupos con tamaños medidos.</p></div>
      <div class="pa-cluster-list">${clusterAudiencePlan(state).groups.map(g => scopeClusterCard(g, filter, g)).join('')}</div>
    </div>` : '<p class="pa-more">La matriz de intereses premium por perfil está en <a href="#audiences">Audiencias ↗</a>. Este módulo de producto no altera el modelo independiente de inversión, CPM y 12 olas.</p>'}
    <div class="pa-actions"><button class="button" data-action="reset-product-audiences">Restablecer escenarios ↺</button><button class="button primary" data-action="export-product-audiences">Exportar universos y overlap ↓</button></div>
    <p class="pa-footnote">Base de planeación editorial limitada a 7 millones únicos entre las líneas, no dato de penetración, compra o reach medido. Para activar se deben validar categoría, disponibilidad comercial, audiencias y datos de ventas. La comunicación nacional permanece en 30 M.</p>
  </section>`;
}
export function premiumAudienceDetail(audience, filter = 'all') {
  const c = PREMIUM_CLUSTERS.find(item => item.id === audience);
  if (!c) return '';
  const groups = [
    ['Pads normales · compradores actuales', c.padsCurrent, 'limpieza'],
    ['Pads normales · audiencia nueva', c.padsNew, 'limpieza'],
    ['Control Poros · compradores actuales', c.poreCurrent, 'control-poros'],
    ['Control Poros · audiencia nueva', c.poreNew, 'control-poros'],
  ].filter(group => filter === 'all' || group[2] === filter);
  return `<section class="pa-profile-detail"><span class="pa-caption">BEAUTY TERRITORIES · ${c.name}</span>
    <h3>Intereses de este clúster por producto y relación de compra</h3>
    <p class="small muted">${c.insight} Son territorios editoriales premium, no categorías garantizadas de las plataformas ni compradores medidos.</p>
    <div class="pa-interests">${groups.map(([name, interests]) =>
      `<article><span class="pa-eyebrow">${name}</span><div class="pa-chip-list">${tags(interests)}</div></article>`).join('')}</div>
  </section>`;
}