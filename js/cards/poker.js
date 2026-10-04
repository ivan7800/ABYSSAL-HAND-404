export const HAND_RULES = {
  high_card:      { name: 'Carta alta', base: 5, mult: 1 },
  pair:           { name: 'Pareja', base: 10, mult: 2 },
  two_pair:       { name: 'Doble pareja', base: 20, mult: 2 },
  three_kind:     { name: 'Trío', base: 30, mult: 3 },
  straight:       { name: 'Escalera', base: 40, mult: 4 },
  flush:          { name: 'Color', base: 35, mult: 4 },
  full_house:     { name: 'Full', base: 60, mult: 5 },
  four_kind:      { name: 'Póquer', base: 100, mult: 7 },
  straight_flush: { name: 'Escalera de color', base: 120, mult: 8 }
};

function isStraight(ranks) {
  const unique = [...new Set(ranks)].sort((a,b)=>a-b);
  if (unique.length !== 5) return false;
  if (unique.join(',') === '2,3,4,5,14') return true;
  return unique.every((rank, i) => i === 0 || rank === unique[i - 1] + 1);
}

export function evaluateHand(cards) {
  if (!Array.isArray(cards) || cards.length === 0 || cards.length > 5) {
    return null;
  }

  const ranks = cards.map(c => c.rank);
  const counts = new Map();
  for (const rank of ranks) counts.set(rank, (counts.get(rank) || 0) + 1);
  const groups = [...counts.values()].sort((a,b)=>b-a);
  const fiveCards = cards.length === 5;
  const flush = fiveCards && cards.every(c => c.suit === cards[0].suit);
  const straight = fiveCards && isStraight(ranks);

  let key = 'high_card';
  if (straight && flush) key = 'straight_flush';
  else if (groups[0] === 4) key = 'four_kind';
  else if (groups[0] === 3 && groups[1] === 2) key = 'full_house';
  else if (flush) key = 'flush';
  else if (straight) key = 'straight';
  else if (groups[0] === 3) key = 'three_kind';
  else if (groups[0] === 2 && groups[1] === 2) key = 'two_pair';
  else if (groups[0] === 2) key = 'pair';

  const rule = HAND_RULES[key];
  const cardPoints = cards.reduce((sum, c) => sum + Math.min(c.rank, 10), 0);
  const base = rule.base + cardPoints;
  return { key, name: rule.name, base, mult: rule.mult, score: base * rule.mult };
}
