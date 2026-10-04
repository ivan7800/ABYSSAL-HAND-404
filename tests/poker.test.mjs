import assert from 'node:assert/strict';
import { evaluateHand } from '../js/cards/poker.js';

const c = (rank, suit='spade') => ({rank,suit});
const cases = [
  ['high_card', [c(2),c(5,'heart'),c(7,'club'),c(9,'diamond'),c(13)]],
  ['pair', [c(2),c(2,'heart'),c(5),c(7),c(9)]],
  ['two_pair', [c(2),c(2,'heart'),c(5),c(5,'club'),c(9)]],
  ['three_kind', [c(3),c(3,'heart'),c(3,'club'),c(8),c(11)]],
  ['straight', [c(2),c(3,'heart'),c(4),c(5,'club'),c(6)]],
  ['straight', [c(14),c(2,'heart'),c(3),c(4,'club'),c(5)]],
  ['flush', [c(2),c(5),c(7),c(9),c(12)]],
  ['full_house', [c(4),c(4,'heart'),c(4,'club'),c(9),c(9,'heart')]],
  ['four_kind', [c(10),c(10,'heart'),c(10,'club'),c(10,'diamond'),c(3)]],
  ['straight_flush', [c(6),c(7),c(8),c(9),c(10)]]
];
for (const [expected, hand] of cases) {
  assert.equal(evaluateHand(hand).key, expected, expected);
}
assert.equal(evaluateHand([]), null);
assert.equal(evaluateHand([c(2),c(3),c(4),c(5),c(6),c(7)]), null);
console.log(`PASS: ${cases.length + 2} evaluaciones de poker`);
