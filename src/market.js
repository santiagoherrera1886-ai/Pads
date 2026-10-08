// Population: DANE national Total, 2027, both sexes, ages 18–100+.
// Digital: own estimate holding 2025 internet use rates constant through 2027.
export const DIGITAL_COHORTS = Object.freeze([
 {age:'18–24',population:6151801,internetRate:.9381837570611629,observedAge:'12–24'},
 {age:'25–54',population:22490699,internetRate:.9112847255015205,observedAge:'25–54'},
 {age:'55+',population:11079250,internetRate:.6324634718139461,observedAge:'55+'}
].map(Object.freeze));
export const DIGITAL_POTENTIAL=DIGITAL_COHORTS.reduce((sum,c)=>sum+c.population*c.internetRate,0);
export const MARKET=Object.freeze({year:2027,adults:39721750,men:19166107,women:20555643,planningUniverse:30000000,middleHighShare:.413,middleLowerMonthly:943791,price:70000,sourceYear:2025,sourceDate:'12 agosto 2026',reviewed:'2026-10-07',populationUrl:'https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx',incomeUrl:'https://www.dane.gov.co/files/operaciones/PM/cp-PMClasesSociales-2025.pdf',internetUrl:'https://www.dane.gov.co/files/operaciones/TICH/anex-TICH-2025.xlsx'});
// Applies the all-age 2025 share to 2027 adults; NOT an age × income cross-tab.
export const ECONOMIC_PROXY=Math.round(MARKET.adults*MARKET.middleHighShare);
export function marketScenario({qualification=35,price=MARKET.price,months=1,budgetShare=5}={}){
 if(!Number.isFinite(qualification)||qualification<0||qualification>100)throw new RangeError('La afinidad conjunta debe estar entre 0% y 100%.');
 if(price!==MARKET.price)throw new RangeError('El ticket medio del proyecto es fijo: $70.000 COP.');
 if(!Number.isFinite(months)||months<1||months>24||!Number.isFinite(budgetShare)||budgetShare<=0||budgetShare>100)throw new RangeError('Revisa intervalo de recompra (1–24 meses) y proporción del ingreso.');
 return {ticket:MARKET.price,proxy:ECONOMIC_PROXY,qualified:Math.round(ECONOMIC_PROXY*qualification/100),monthlyCost:MARKET.price/months,threshold:MARKET.price/months/(budgetShare/100),burden:MARKET.price/months/MARKET.middleLowerMonthly,qualification};
}
