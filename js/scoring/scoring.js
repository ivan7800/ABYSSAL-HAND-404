import { evaluateHand } from '../cards/poker.js';
import { corruptionBonus, entityBonus } from '../systems.js';
import { bossScoreModifier } from '../gameplay/bosses.js';

export function scoreSelection(cards, state = null) {
  const baseResult = evaluateHand(cards);
  if (!baseResult) return null;
  const corruption = corruptionBonus(cards, state?.pacts || []);
  const entity = entityBonus(cards, state?.entities || [], state?.pacts || []);
  const base = baseResult.base + corruption.baseBonus;
  const mult = baseResult.mult + entity.multBonus;
  const result={
    ...baseResult,
    base,
    mult,
    score: base * mult,
    corruption: corruption.corruption,
    madnessCost: corruption.madnessCost + entity.madnessCost,
    entityLabel: entity.label
  };
  return state?bossScoreModifier(cards,result,state):result;
}
