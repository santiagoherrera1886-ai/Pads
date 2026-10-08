import { MARKET, DIGITAL_COHORTS, DIGITAL_POTENTIAL, ECONOMIC_PROXY, marketScenario } from './market.js';
import { PRODUCT_AUDIENCE_DEFAULT, calculateProductAudiences } from './product-audiences.js';

export const DANE_MATH_VERSION='DANE 2018–2070 · TIC 2025 · GEIH 2025 · planeación 2027';
export const PROVENANCE=Object.freeze({
 population:{label:'DANE · Serie nacional 2018–2070 por área, sexo y edad',url:'https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/proyecciones-de-poblacion',
   dataset:MARKET.populationUrl,year:2027,category:'Población proyectada · no consumos'},
 digital:{label:'DANE · TIC Hogares 2025, ECV',url:'https://www.dane.gov.co/index.php/estadisticas-por-tema/tecnologia-e-innovacion/tecnologias-de-la-informacion-y-las-comunicaciones-tic/indicadores-basicos-de-tic-en-hogares',
   dataset:MARKET.internetUrl,year:2025,category:'Tasas observadas 2025 · extrapolación propia a 2027'},
 social:{label:'DANE · Clases sociales 2025 basadas en GEIH',url:'https://www.dane.gov.co/files/operaciones/PM/cp-PMClasesSociales-2025.pdf',
   dataset:MARKET.incomeUrl,year:2025,category:'Porcentaje todas las edades · aproximación propia a 18+'},
});
const constrain=(n,l,u)=>Math.min(u,Math.max(l,n));

export function daneAudienceAudit(state=PRODUCT_AUDIENCE_DEFAULT,scenario={}) {
 const adults=MARKET.adults;
 const ageCohorts=DIGITAL_COHORTS.map(c=>({
  ...c,estimatedDigital:c.population*c.internetRate,shareOfAdults:c.population/adults,
  reachRate2025:c.internetRate
 }));
 const byAgeTotal=ageCohorts.reduce((a,c)=>a+c.population,0);
 const rawDigital=ageCohorts.reduce((a,c)=>a+c.estimatedDigital,0);
 const socioeconomic=ECONOMIC_PROXY;
 const model=calculateProductAudiences(state);
 if(byAgeTotal!==adults||Math.abs(rawDigital-DIGITAL_POTENTIAL)>1e-5)
  throw Error('Las cohortes por edad no cierran con la serie DANE cargada.');
 const planning=MARKET.planningUniverse, category=model.unique;
 if(category>planning)throw Error('El universo de categoría no puede superar al de comunicación.');
 const priceModel=marketScenario(scenario);
 // Mathematically valid Fréchet bounds, conditional on proxies sharing adult population.
 const digitalEconomicLower=Math.max(0,rawDigital+socioeconomic-adults);
 const digitalEconomicUpper=Math.min(rawDigital,socioeconomic);
 const projectEconomicLower=Math.max(0,planning+socioeconomic-adults);
 const projectEconomicUpper=Math.min(planning,socioeconomic);
 const ageRateStress=(delta)=>ageCohorts.reduce((a,c)=>a+c.population*constrain(c.internetRate+delta,0,1),0);
 return {
  adults,men:MARKET.men,women:MARKET.women,ageCohorts,rawDigital,planning,category,
  plusOfAdultDigital:rawDigital/adults,
  planningFraction:planning/rawDigital,
  categoryFraction:category/planning,
  categoryOfDigital:category/rawDigital,
  categoryOfAdults:category/adults,
  unassignedDigital:rawDigital-planning,
  outsideCategoryPlanning:planning-category,
  priceModel,socioeconomic,
  economicShare:MARKET.middleHighShare,
  socioeconomicRateParts:{middle:0.38,high:0.033},
  digitalEconomicLower,digitalEconomicUpper,
  projectEconomicLower,projectEconomicUpper,
  lowDigitalRateScenario:ageRateStress(-.05),
  highDigitalRateScenario:ageRateStress(+.05),
  residualGender:adults-MARKET.men-MARKET.women,
  provenance:PROVENANCE,
  status:{population:'DANE · proyección',digital:'Extrapolación DANE TIC',planning:'Coeficiente de planeación',category:'Objetivo estratégico fijado; tasa reconstruida a posteriori',price:'Ticket comercial fijo 70.000, no es dato DANE'},
 };
}

export function daneAuditExportRows(state=PRODUCT_AUDIENCE_DEFAULT,scenario={}) {
 const m=daneAudienceAudit(state,scenario),rate=x=>x*100;
 return [
  ['CADENA MATEMÁTICA Y FUENTES | DANE + HIPÓTESIS PADS JGB'],
  ['Año demográfico',MARKET.year],['Año TIC',MARKET.sourceYear],
  ['Población 18+ proyección DANE',m.adults],['Hombres (sexo en serie DANE)',m.men],['Mujeres (sexo en serie DANE)',m.women],
  ['Igualdad de totales','P18+ = suma_edad P(2027,edad) = suma grupos = hombres + mujeres'],
  ['Tasa de internet por edad','r_a(2025) = personas usuarias internet / personas totales, DANE ECV/TIC 2025'],
  ['18-24 advertencia','Se usa tasa 12-24 DANE 2025 por ausencia de tasa 18-24 compatible'],
  [],['Grupo de edad','Población 2027 DANE','Edad observada TIC 2025','Uso internet 2025 (%)','Digital calculado 2027 (personas)'],
  ...m.ageCohorts.map(c=>[c.age,c.population,c.observedAge,rate(c.internetRate),c.estimatedDigital]),
  ['SUMA P18+',m.adults],['SUMA DIGITAL PROPIA',m.rawDigital],
  ['Fórmula digital','D2027 = Σ_a P2027(a) × r2025(a); tasas de 2025 constantes, sin calibración 2027'],
  ['Digital / adulto (%)',rate(m.plusOfAdultDigital)],
  ['Sensibilidad -5 puntos porcentuales (NO IC)',m.lowDigitalRateScenario],
  ['Sensibilidad +5 puntos porcentuales (NO IC)',m.highDigitalRateScenario],
  ['Base nacional comunicación hipotética',m.planning],
  ['Coeficiente planificación (30M / digital potencial)',m.planningFraction],
  ['Fórmula de planeación','C = D × k_comunicacion; k_comunicacion fue elegido por planeación, NO DANE'],
  ['Potencial digital excluido por decisión de planeación',m.unassignedDigital],
  ['Universo categoría fijo (ambos productos deduplicados)',m.category],
  ['Coeficiente implícito categoría vs base comunicación',m.categoryFraction],
  ['Advertencia del factor','k_categoria = U_categoria / C es implícito por construcción, NO deducido del DANE'],
  ['Fórmula categoría','U = Pads_total + Poros_total - 0.10 × min(Pads_total,Poros_total)'],
  ['Pads normales',m.category&&calculateProductAudiences(state).pads.total],
  ['Control Poros',calculateProductAudiences(state).pore.total],
  ['Overlap productos',calculateProductAudiences(state).overlap],
  ['Población de comunicación fuera de categoría fija',m.outsideCategoryPlanning],
  ['Clase media 2025, total nacional (%)',38],['Clase alta 2025, total nacional (%)',3.3],
  ['Proxy económico independiente','E = P18+(2027) × (0.38 + 0.033), sin cruce observado edad ingreso'],
  ['Referencia económica proxy (personas)',m.socioeconomic],
  ['Cota mínima E ∩ D usando solo tamaños',m.digitalEconomicLower],
  ['Cota máxima E ∩ D usando solo tamaños',m.digitalEconomicUpper],
  ['No multiplicar tasas','Sin tabla edad × internet × ingreso no se conoce el tamaño real de la intersección'],
  ['Ticket medio fijo COP por transacción',MARKET.price],
  ['Ticket medio no es precio por SKU','Se usa valor promedio por transacción; no prueba el costo de cada producto'],
  ['Meses entre transacciones · escenario',scenario.months??1],
  ['Gasto mensual equivalente','TicketMedio/meses',m.priceModel.monthlyCost],
  ['Presupuesto como % ingreso · escenario',scenario.budgetShare??5],
  ['Ingreso mínimo aritmético','(Ticket/meses) / (%Ingreso/100)',m.priceModel.threshold],
  ['Porcentaje del umbral de clase media 2025','(Ticket/meses)/943791',m.priceModel.burden],
  ['Sensibilidad comercial % sin medición',scenario.qualification??35],
  ['Grupo ilustrativo económico condicionado, no demanda',m.priceModel.qualified],
  ['MÁS FUENTE POBLACIÓN',m.provenance.population.url],
  ['MÁS FUENTE TICH',m.provenance.digital.url],
  ['MÁS FUENTE SOCIOECONOMÍA',m.provenance.social.url],
  ['Nota final','Los 6.75 M NO resultan estadísticamente de DANE; el DANE define el marco y el universo PADS es un supuesto estratégico fijo.'],
 ];
}