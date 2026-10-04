export function corruptionBonus(cards, pacts = []) {
  const corruption = cards.reduce((sum, card) => sum + (card.corruption || 0), 0);
  const rooted = pacts.some(p => p.id === 'root-pact');
  return { corruption, baseBonus: corruption * (rooted ? 6 : 4), madnessCost: corruption };
}

export function entityBonus(cards, entities = [], pacts = []) {
  const hasEye = entities.some(entity => entity.id === 'watching-eye');
  const eyes = cards.filter(card => card.suit === 'diamond').length;
  const eyeBonus = hasEye && eyes >= 3 ? 1 : 0;
  const pactBonus = pacts.some(p => p.id === 'blood-pact') ? 1 : 0;
  return {
    multBonus: eyeBonus + pactBonus,
    madnessCost: (hasEye ? 1 : 0) + (pactBonus ? 2 : 0),
    label: eyeBonus ? 'El Ojo observa: +1 Resonancia' : null
  };
}

export function madnessTier(madness) {
  if (madness >= 100) return 'RUPTURA';
  if (madness >= 75) return 'FRACTURA';
  if (madness >= 50) return 'DISTORSIÓN';
  if (madness >= 25) return 'SUSURROS';
  return 'ESTABLE';
}

export function applyMadness(state, amount) {
  state.madness = Math.max(0, Math.min(100, state.madness + amount));
  return state.madness;
}

export function corruptCard(state) {
  const candidates = state.hand.filter(card => (card.corruption || 0) < 3);
  if (!candidates.length) return null;
  const card = candidates[(state.turn + state.totalScore) % candidates.length];
  card.corruption = Math.min(3, (card.corruption || 0) + 1);
  return card;
}
