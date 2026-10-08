import { splitBuyerAudience, projectBuyerReach, BUYER_REACH_OVERLAP_PERCENT } from './buyer-segments.js';

const buyerMillions = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(n / 1e6) + ' M';
const buyerPercent = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(n) + '%';

export function buyerVisual({ universe, currentShare, reach = universe, mode = 'universe', id = 'buyers' }) {
  const s = splitBuyerAudience({ universe, currentShare, reach });
  const projected = mode === 'reach';
  const r = projected ? projectBuyerReach({ reach, currentShare }) : null;
  const current = projected ? r.currentReach : s.current;
  const fresh = projected ? r.newReach : s.newAudience;
  const overlap = projected ? r.reachOverlap : 0;
  const total = projected ? r.uniqueReach : s.universe;
  const left = projected ? 207 : 139, right = projected ? 373 : 441, radius = projected ? 154 : 127;
  const labelLeft = projected ? 133 : 139, labelRight = projected ? 447 : 441;
  return `<div class="buyer-visual-layout">
    <figure class="buyer-figure">
      <svg viewBox="0 0 580 ${projected ? 340 : 300}" role="img" aria-label="${projected ? 'Alcance de pauta supuesto' : 'Universo supuesto'}: compradores actuales ${buyerMillions(current)}; ${projected ? 'prospección de nueva audiencia' : 'audiencia nueva'} ${buyerMillions(fresh)}; intersección ${buyerMillions(overlap)}${projected ? ', 10% de la suma de alcances' : ''}; total único ${buyerMillions(total)}">
        <defs><linearGradient id="${id}-current" x2=".4" y2="1"><stop stop-color="#83b6ff"/><stop offset="1" stop-color="#195af1"/></linearGradient><linearGradient id="${id}-new" x2=".3" y2="1"><stop stop-color="#c78afd"/><stop offset="1" stop-color="#7911e5"/></linearGradient><clipPath id="${id}-cross"><circle cx="${right}" cy="${projected ? 159 : 144}" r="${radius}"/></clipPath></defs>
        <circle cx="${left}" cy="${projected ? 159 : 144}" r="${radius}" fill="url(#${id}-current)"/>
        <circle cx="${right}" cy="${projected ? 159 : 144}" r="${radius}" fill="url(#${id}-new)"/>
        ${projected ? `<circle cx="${left}" cy="159" r="${radius}" fill="#4d20ad" stroke="#e8dcff" stroke-width="1.2" clip-path="url(#${id}-cross)"/>` : ''}
        <g fill="white" text-anchor="middle" font-family="Inter,Arial,sans-serif">
          <text x="${labelLeft}" y="145" class="buyer-svg-value ${projected ? 'buyer-svg-reach-value' : ''}">${buyerMillions(current)}</text>
          <text x="${labelLeft}" y="172" class="buyer-svg-label">Compradores</text><text x="${labelLeft}" y="191" class="buyer-svg-label">actuales de pads</text>
          <text x="${labelRight}" y="145" class="buyer-svg-value ${projected ? 'buyer-svg-reach-value' : ''}">${buyerMillions(fresh)}</text>
          <text x="${labelRight}" y="172" class="buyer-svg-label">Nueva audiencia</text><text x="${labelRight}" y="191" class="buyer-svg-label">${projected ? 'Prospección' : 'para la categoría'}</text>
          ${projected ? `<text x="290" y="145" class="buyer-svg-overlap-value">${buyerMillions(overlap)}</text><text x="290" y="168" class="buyer-svg-overlap-label">intersección</text><text x="290" y="188" class="buyer-svg-overlap-rate">10%</text>` : ''}
        </g>
        ${projected ? '' : '<circle cx="290" cy="143" r="21" fill="white" stroke="#daceec"/><text x="290" y="150" text-anchor="middle" fill="#735489" font-family="Inter,Arial,sans-serif" font-size="20" font-weight="700">0</text>'}
        <text x="290" y="${projected ? 334 : 293}" text-anchor="middle" fill="#8a749b" font-family="Inter,Arial,sans-serif" font-size="11">${projected ? 'Cruce de pauta: 10% de la suma de alcances' : 'Base por estado de compra: grupos excluyentes'} · áreas no proporcionales</text>
      </svg>
    </figure>
    <div class="buyer-total-panel"><p>${projected ? 'Alcance único' : 'Audiencia única'} =<br>compradores actuales +<br>audiencia nueva − intersección</p><div class="buyer-total"><strong>${buyerMillions(total)}</strong><span>${projected ? 'personas proyectadas al cierre de las 12 olas, después del cruce' : 'personas en el universo de planeación'}</span><small>${projected ? `${buyerMillions(reach)} de alcance base − ${buyerMillions(overlap)} de intersección.` : 'Base de categoría supuesta (13 M), distinta del universo nacional de comunicación (30 M).'}</small></div></div>
  </div><div class="buyer-base-strip"><span><i class="buyer-dot current"></i>Base supuesta de compradores actuales: <b>${buyerMillions(s.current)}</b></span><span><i class="buyer-dot fresh"></i>Base supuesta de audiencia nueva: <b>${buyerMillions(s.newAudience)}</b></span>${projected ? '<small>El cruce es entre audiencias de pauta: la prospección puede incluir compradores actuales. No representa nuevos compradores obtenidos.</small>' : ''}</div>`;
}

export function buyerPanel({ universe, currentShare, reach = universe, mode = 'universe', id = 'buyers' }) {
  splitBuyerAudience({ universe, currentShare, reach });
  const projected = mode === 'reach', min = projected ? BUYER_REACH_OVERLAP_PERCENT : 0, max = 100-min;
  if (projected) projectBuyerReach({ reach, currentShare });
  return `<section class="panel buyer-panel" id="${id}" data-buyer-panel data-buyer-universe="${universe}" data-buyer-reach="${reach}" data-buyer-mode="${mode}">
    <div class="buyer-heading"><div><span class="eyebrow">${projected ? 'AUDIENCIA ÚNICA ESTIMADA · 12 OLAS' : 'COMPOSICIÓN DEL UNIVERSO'}</span><h2>Compradores actuales + audiencia nueva.</h2></div><button class="buyer-info" data-action="buyer-method" aria-label="Cómo calculamos compradores actuales y audiencia nueva">i</button></div>
    <div class="buyer-assumption"><span>${projected ? 'INTERSECCIÓN: 10%' : 'SUPUESTO EDITABLE'}</span><p>${projected ? 'Descontamos el <b>10% de la suma de ambos alcances</b> como cruce supuesto entre audiencias de pauta. El simulador usa su propio universo editable; el reparto es una hipótesis de pauta, no compradores medidos.' : 'Base de categoría supuesta de <b>13 M: 6 M compradores actuales y 7 M de audiencia nueva</b>. No es una medición; ajústala con datos de categoría. El universo nacional para comunicación sigue en 30 M.'}</p></div>
    <div data-buyer-visual aria-live="polite" aria-atomic="true">${buyerVisual({ universe, currentShare, reach, mode, id })}</div>
    <div class="buyer-controls"><label for="${id}-share">${projected ? 'Audiencia de compradores' : 'Compradores actuales'} <span class="buyer-number"><input id="${id}-share" type="number" min="${min}" max="${max}" step="any" value="${currentShare}" data-buyer-share aria-describedby="${id}-help"><span>% supuesto</span></span></label><div class="buyer-range"><input type="range" min="${min}" max="${max}" step="any" value="${currentShare}" data-buyer-share aria-label="Proporción supuesta de compradores actuales"><div><span><b data-buyer-current-share>${buyerPercent(currentShare)}</b> actuales</span><span><b data-buyer-new-share>${buyerPercent(100-currentShare)}</b> ${projected ? 'prospección' : 'nueva audiencia'}</span></div></div><button class="button" data-action="export-buyers">Exportar reparto ↓</button></div>
    <p class="buyer-error" data-buyer-error role="status" hidden></p><p class="buyer-help" id="${id}-help">${projected ? 'La intersección se resta una vez de la suma de estas dos audiencias. Para sostener el cruce del 10%, cada una debe aportar al menos el 10% del alcance base. Es un ajuste de planeación adicional al modelo por producto.' : 'Los estados de compra en la base se excluyen. El simulador incorpora un cruce supuesto del 10% entre audiencias de pauta; la prospección puede incluir compradores actuales.'}</p>
    <div class="buyer-strategies"><article><span class="buyer-strategy-label current">YA COMPRAN PADS</span><h3>Profundizar el hábito.</h3><p>Reconocer su rutina de limpieza y explicar cómo se diferencian los pads de algodón y Control Poros.</p></article><article><span class="buyer-strategy-label fresh">NUEVA AUDIENCIA</span><h3>Hacer fácil el primer paso.</h3><p>Mostrar qué son los pads, cómo se usan y qué función cumple cada línea dentro de la rutina.</p></article></div>
  </section>`;
}
