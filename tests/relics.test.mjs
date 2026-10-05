import assert from 'node:assert/strict';
import {newRun,toggleCard,playSelection} from '../js/core/game.js';
import {advanceEncounter} from '../js/gameplay/progression.js';
import {evaluateHand} from '../js/cards/poker.js';
import {scoreSelection} from '../js/scoring/scoring.js';
import {serializeRun,restoreRun} from '../js/persistence/run-store.js';

const cards=(ranks,suits)=>ranks.map((rank,i)=>({id:`${suits[i]}-${rank}`,rank,suit:suits[i],corruption:0}));
const straight=cards([2,3,4,5,6],['heart','spade','diamond','club','heart']);
const lens=scoreSelection(straight,{relics:[{id:'pearl-lens'}]});
assert.equal(lens.key,'straight');
assert.equal(lens.base,evaluateHand(straight).base+18);
assert.equal(lens.relicLabels.length,1);

const pair=cards([8,8],['heart','spade']);
const hook=scoreSelection(pair,{relics:[{id:'ivory-hook'}]});
assert.equal(hook.mult,evaluateHand(pair).mult+1);
assert.equal(hook.madnessCost,2);
assert.equal(scoreSelection(pair,{relics:[{id:'ivory-hook'}]}).score,evaluateHand(pair).base*(evaluateHand(pair).mult+1));

const state=newRun('THREAD-TEST');
state.entities=[];state.relics.push({id:'black-thread'});state.hand[0].corruption=1;
assert.equal(toggleCard(state,state.hand[0].id).ok,true);
assert.equal(playSelection(state).result.madnessCost,0);
assert.equal(state.blackThreadUsed,true);
assert.equal(restoreRun(serializeRun(state)).blackThreadUsed,true);
state.hand[0].corruption=1;
assert.equal(toggleCard(state,state.hand[0].id).ok,true);
assert.equal(playSelection(state).result.madnessCost,1);
advanceEncounter(state);
assert.equal(state.blackThreadUsed,false);
const legacy=serializeRun(state);delete legacy.state.blackThreadUsed;
assert.equal(restoreRun(legacy).blackThreadUsed,false);
console.log('RELIC TESTS: nacre lens, ivory hook, black thread shield/reset PASS');
