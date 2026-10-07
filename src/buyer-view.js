import { splitBuyerAudience } from './buyer-segments.js';

const buyerMillions = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(n / 1e6) + ' M';
const buyerPercent = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(n) + '%';

export function buyerVisual({ universe, currentShare, reach = universe, mode = 'universe', id = 'buyers' }) {
  const s = splitBuyerAudience({ universe, currentShare, reach });
  const projected = mode === 'reach';
  const current = projected ? s.currentReach : s.current;
  const fresh = projected ? s.newReach : s.newAudience;
  const total = projected ? s.reach : s.universe;
  return `<div class="buyer-visual-layout">
    <figure class="buyer-figure">
      <svg viewBox="0 0 580 300" role="img" aria-label="${projected ? 'Alcance proyectado' : 'Universo supuesto'}: compradores actuales ${buyerMillions(current)}; audiencia nueva ${buyerMillions(fresh)}; intersección cero; total ${buyerMillions(total)}">
        <defs><linearGradient id="${id}-current" x2=".4" y2="1"><stop stop-color="#83b6ff"/><stop offset="1" stop-color="#195af1"/></linearGradient><linearGradient id="${id}-new" x2=".3" y2="1"><stop stop-color="#c78afd"/><stop offset="1" stop-color="#7911e5"/></linearGradient></defs>
        <circle cx="139" cy="144" r="127" fill="url(#${id}-current)"/>
        <circle cx="441" cy="144" r="127" fill="url(#${id}-new)"/>
        <g fill="white" text-anchor="middle" font-family="Inter,Arial,sans-serif">
          <text x="139" y="135" class="buyer-svg-value">${buyerMillions(current)}</text>
          <text x="139" y="161" class="buyer-svg-label">Compradores</text><text x="139" y="180" class="buyer-svg-label">actuales de pads</text>
          <text x="441" y="135" class="buyer-svg-value">${buyerMillions(fresh)}</text>
          <text x="441" y="161" class="buyer-svg-label">Nueva audiencia</text><text x="441" y="180" class="buyer-svg-label">para la categoría</text>
        </g>
        <circle cx="290" cy="143" r="21" fill="white" stroke="#daceec"/>
        <text x="290" y="150" text-anchor="middle" fill="#735489" font-family="Inter,Arial,sans-serif" font-size="20" font-weight="700">0</text>
        <text x="290" y="293" text-anchor="middle" fill="#8a749b" font-family="Inter,Arial,sans-serif" font-size="11">Intersección: 0 · grupos excluyentes · áreas no proporcionales</text>
      </svg>
    </figure>
    <div class="buyer-total-panel"><p>${projected ? 'Alcance único' : 'Audiencia única'} =<br>compradores actuales +<br>audiencia nueva − intersección</p><div class="buyer-total"><strong>${buyerMillions(total)}</strong><span>${projected ? 'personas proyectadas al cierre de las 12 olas' : 'personas en el universo de planeación'}</span><small>${projected ? `Base del escenario: ${buyerMillions(universe)}. Reparto proporcional supuesto.` : 'El tamaño total no cambia al mover el reparto.'}</small></div></div>
  </div><div class="buyer-base-strip"><span><i class="buyer-dot current"></i>Base de compradores actuales: <b>${buyerMillions(s.current)}</b></span><span><i class="buyer-dot fresh"></i>Base de audiencia nueva: <b>${buyerMillions(s.newAudience)}</b></span>${projected ? '<small>La audiencia nueva alcanzada es exposición a la campaña; no son nuevos compradores obtenidos.</small>' : ''}</div>`;
}

export function buyerPanel({ universe, currentShare, reach = universe, mode = 'universe', id = 'buyers' }) {
  // Validate all inputs before rendering an apparently valid diagram.
  splitBuyerAudience({ universe, currentShare, reach });
  return `<section class="panel buyer-panel" id="${id}" data-buyer-panel data-buyer-universe="${universe}" data-buyer-reach="${reach}" data-buyer-mode="${mode}">
    <div class="buyer-heading"><div><span class="eyebrow">${mode === 'reach' ? 'AUDIENCIA ÚNICA ESTIMADA · 12 OLAS' : 'COMPOSICIÓN DEL UNIVERSO'}</span><h2>Compradores actuales + audiencia nueva.</h2></div><button class="buyer-info" data-action="buyer-method" aria-label="Cómo calculamos compradores actuales y audiencia nueva">i</button></div>
    <div class="buyer-assumption"><span>SUPUESTO EDITABLE</span><p>El ejemplo inicial es 20% / 80%. La proporción de compradores de pads <b>no está medida</b>; ajústala con datos de categoría.</p></div>
    <div data-buyer-visual aria-live="polite" aria-atomic="true">${buyerVisual({ universe, currentShare, reach, mode, id })}</div>
    <div class="buyer-controls"><label for="${id}-share">Compradores actuales <span class="buyer-number"><input id="${id}-share" type="number" min="0" max="100" step="0.1" value="${currentShare}" data-buyer-share aria-describedby="${id}-help"><span>% supuesto</span></span></label><div class="buyer-range"><input type="range" min="0" max="100" step="0.1" value="${currentShare}" data-buyer-share aria-label="Proporción supuesta de compradores actuales"><div><span><b data-buyer-current-share>${buyerPercent(currentShare)}</b> actuales</span><span><b data-buyer-new-share>${buyerPercent(100-currentShare)}</b> nueva audiencia</span></div></div><button class="button" data-action="export-buyers">Exportar reparto ↓</button></div>
    <p class="buyer-error" data-buyer-error role="status" hidden></p><p class="buyer-help" id="${id}-help">Los grupos se excluyen entre sí: una persona se cuenta una sola vez. ${mode === 'reach' ? 'El alcance usa el presupuesto y CPM del simulador, y supone la misma tasa de exposición en ambos perfiles.' : 'Este reparto describe la base potencial; el alcance se calcula con inversión en el simulador.'}</p>
    <div class="buyer-strategies"><article><span class="buyer-strategy-label current">YA COMPRAN PADS</span><h3>Profundizar el hábito.</h3><p>Reconocer su rutina de limpieza y explicar cómo se diferencian los pads de algodón y Control Poros.</p></article><article><span class="buyer-strategy-label fresh">NUEVA AUDIENCIA</span><h3>Hacer fácil el primer paso.</h3><p>Mostrar qué son los pads, cómo se usan y qué función cumple cada línea dentro de la rutina.</p></article></div>
  </section>`;
}
