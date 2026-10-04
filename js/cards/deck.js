export const SUITS = [
  { id: 'spade', symbol: '♠', name: 'Vacío' },
  { id: 'heart', symbol: '♥', name: 'Sangre' },
  { id: 'diamond', symbol: '♦', name: 'Ojo' },
  { id: 'club', symbol: '♣', name: 'Raíz' }
];

export const RANKS = [
  { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' },
  { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' },
  { value: 8, label: '8' }, { value: 9, label: '9' }, { value: 10, label: '10' },
  { value: 11, label: 'J' }, { value: 12, label: 'Q' }, { value: 13, label: 'K' },
  { value: 14, label: 'A' }
];

export function createDeck() {
  return SUITS.flatMap(suit => RANKS.map(rank => ({
    id: `${suit.id}-${rank.value}`,
    suit: suit.id,
    suitName: suit.name,
    symbol: suit.symbol,
    rank: rank.value,
    rankLabel: rank.label,
    corruption: 0
  })));
}

export function shuffle(deck, random = Math.random) {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function draw(deck, count) {
  return deck.splice(0, Math.min(count, deck.length));
}
