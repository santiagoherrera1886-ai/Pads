// DANE population workbook: national Total, 2026, sum single ages 18–100+.
// Socioeconomic proxy applies the 2025 all-age share to 2026 adults.
// It is NOT an observed age × income cross-tab or a count of buyers.
export const MARKET={year:2026,adults:39236663,men:18919748,women:20316915,middleHighShare:.413,middleLowerMonthly:943791,price:80000,sourceYear:2025,sourceDate:'12 agosto 2026',populationUrl:'https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx',incomeUrl:'https://www.dane.gov.co/files/operaciones/PM/cp-PMClasesSociales-2025.pdf'};
export const ECONOMIC_PROXY=Math.round(MARKET.adults*MARKET.middleHighShare);
export function marketScenario({qualification=35,price=80000,months=1,budgetShare=5}={}){
 if(!Number.isFinite(qualification)||qualification<0||qualification>100)throw new RangeError('La afinidad conjunta debe estar entre 0% y 100%.');
 if(!Number.isFinite(price)||price<=0||!Number.isFinite(months)||months<=0||!Number.isFinite(budgetShare)||budgetShare<=0||budgetShare>100)throw new RangeError('Revisa precio, intervalo de recompra y proporción del ingreso.');
 return {proxy:ECONOMIC_PROXY,qualified:Math.round(ECONOMIC_PROXY*qualification/100),monthlyCost:price/months,threshold:price/months/(budgetShare/100),burden:price/months/MARKET.middleLowerMonthly};
}
