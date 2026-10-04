import assert from 'node:assert/strict';
import { corruptionBonus, entityBonus, madnessTier, applyMadness } from '../js/systems.js';

const cards=[
  {suit:'diamond',corruption:1},{suit:'diamond',corruption:2},{suit:'diamond',corruption:0},{suit:'heart',corruption:0}
];
assert.deepEqual(corruptionBonus(cards),{corruption:3,baseBonus:12,madnessCost:3});
assert.equal(entityBonus(cards,[{id:'watching-eye'}]).multBonus,1);
assert.equal(entityBonus(cards,[]).multBonus,0);
assert.equal(madnessTier(0),'ESTABLE');
assert.equal(madnessTier(25),'SUSURROS');
assert.equal(madnessTier(50),'DISTORSIÓN');
assert.equal(madnessTier(75),'FRACTURA');
assert.equal(madnessTier(100),'RUPTURA');
const state={madness:98}; applyMadness(state,9); assert.equal(state.madness,100);
console.log('PASS: 9 comprobaciones de Locura/Entidades/Corrupción');
