import { MARKET } from './market.js';
import { buildAudienceUniverse } from './universe.js';
export const EXAMPLE = Object.freeze({ cleansingOnly:0, shared:MARKET.planningUniverse, poreCareOnly:0, budget:100000000, cpm:8000, cleansingShare:60 });
export function simulate(input) {
  const population=buildAudienceUniverse(input);
  const {budget,cpm,cleansingShare}=input;
  if(!Number.isFinite(budget)||budget<0||budget>1e12) throw new RangeError('La inversión debe estar entre 0 y un billón de COP.');
  if(!Number.isFinite(cpm)||cpm<=0) throw new RangeError('El CPM debe ser mayor que cero.');
  if(!Number.isFinite(cleansingShare)||cleansingShare<0||cleansingShare>100) throw new RangeError('La mezcla debe estar entre 0% y 100%.');
  const cleanBudget=budget*cleansingShare/100, poreBudget=budget-cleanBudget;
  if((!population.cleansing&&cleanBudget>0)||(!population.poreCare&&poreBudget>0)) throw new RangeError('No asignes inversión a una línea cuya audiencia es cero.');
  const rows=Array.from({length:12},(_,i)=>{
    const period=i+1, spend=budget*period/12;
    const cleanImp=cleanBudget*period/12/cpm*1000, poreImp=poreBudget*period/12/cpm*1000;
    const cleanRate=population.cleansing?-Math.expm1(-cleanImp/population.cleansing):0;
    const poreRate=population.poreCare?-Math.expm1(-poreImp/population.poreCare):0;
    const cleanReach=population.cleansing*cleanRate, poreReach=population.poreCare*poreRate;
    const overlap=population.shared*cleanRate*poreRate;
    const unique=cleanReach+poreReach-overlap;
    const impressions=cleanImp+poreImp;
    return {period,spend,impressions,cleanReach,poreReach,overlap,unique,coverage:unique/population.unique,frequency:unique?impressions/unique:0};
  });
  return {population,rows,final:rows.at(-1)};
}

// Upgrade the old demonstration while retaining its financial inputs; keep custom scenarios.
export function restoreScenario(current, legacy) {
 const stored=current||legacy;
 if(!stored)return {...EXAMPLE};
 const candidate=!current&&stored.cleansingOnly===1500000&&stored.shared===600000&&stored.poreCareOnly===900000
  ? {...stored,cleansingOnly:0,shared:MARKET.planningUniverse,poreCareOnly:0} : {...stored};
 simulate(candidate);
 return candidate;
}
