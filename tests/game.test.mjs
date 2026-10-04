import assert from 'node:assert/strict';
import { newRun, toggleCard, discardSelection, playSelection, preview } from '../js/core/game.js';

const fixedRandom=()=>0.123456;
let state=newRun(fixedRandom);
assert.equal(state.hand.length,8); assert.equal(state.deck.length,44); assert.equal(state.handsLeft,4); assert.equal(state.discardsLeft,5); assert.equal(state.madness,0);
const first=state.hand[0].id; assert.equal(toggleCard(state,first).ok,true); assert.equal(state.selectedIds.size,1); assert.ok(preview(state));
assert.equal(discardSelection(state).ok,true); assert.equal(state.discardsLeft,4); assert.equal(state.hand.length,8); assert.equal(state.selectedIds.size,0);
const beforeScore=state.totalScore; const beforeHands=state.handsLeft; toggleCard(state,state.hand[0].id); const played=playSelection(state);
assert.equal(played.ok,true); assert.equal(state.handsLeft,beforeHands-1); assert.ok(state.totalScore>beforeScore); assert.equal(state.hand.length,8); assert.ok(state.madness>=1);
// Segundo turno debe marcar una carta.
toggleCard(state,state.hand[0].id); playSelection(state); assert.ok(state.hand.some(c=>c.corruption>0));
state=newRun(fixedRandom); for(let i=0;i<5;i++) assert.equal(toggleCard(state,state.hand[i].id).ok,true); assert.equal(toggleCard(state,state.hand[5].id).ok,false);
console.log('PASS: 20 comprobaciones del bucle de juego v0.2');
