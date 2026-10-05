import { evaluateHand } from '../cards/poker.js';
import { corruptionBonus, entityBonus } from '../systems.js';
import { bossScoreModifier } from '../gameplay/bosses.js';

export function scoreSelection(cards, state = null) {
  const baseResult = evaluateHand(cards);
  if (!baseResult) return null;
  const corruption = corruptionBonus(cards, state?.pacts || []);
  const entity = entityBonus(cards, state?.entities || [], state?.pacts || []);
  const relics=state?.relics||[];
  const hasRelic=id=>relics.some(relic=>relic.id===id);
  const lensBonus=hasRelic('pearl-lens')&&['straight','flush','straight_flush'].includes(baseResult.key)?18:0;
  const hookBonus=hasRelic('ivory-hook')&&baseResult.key!=='high_card';
  const threadShield=hasRelic('black-thread')&&!state?.blackThreadUsed&&corruption.madnessCost>0?1:0;
  const base = baseResult.base + corruption.baseBonus + lensBonus;
  const mult = baseResult.mult + entity.multBonus + (hookBonus?1:0);
  const relicLabels=[];
  if(lensBonus)relicLabels.push('Lente de Nácar: +18 base');
  if(hookBonus)relicLabels.push('Anzuelo de Marfil: +1 Resonancia');
  if(threadShield)relicLabels.push('Hilo Negro: −1 Locura por corrupción');
  const result={
    ...baseResult,
    base,
    mult,
    score: base * mult,
    corruption: corruption.corruption,
    madnessCost: Math.max(0,corruption.madnessCost-threadShield) + entity.madnessCost + (hookBonus?2:0),
    entityLabel: entity.label,
    relicLabels,
    threadShield
  };
  return state?bossScoreModifier(cards,result,state):result;
}
