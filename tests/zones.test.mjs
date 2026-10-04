import assert from 'node:assert/strict';
import { ZONES, FINAL_ENCOUNTER, zoneForEncounter, battleLabel } from '../js/gameplay/zones.js';
import { targetForEncounter } from '../js/gameplay/progression.js';
import { newRun, toggleCard, playSelection, discardSelection, claimReward } from '../js/core/game.js';
import { bossScoreModifier, onBossDiscard, onBossHandResolved, bossBlocksMadnessReduction } from '../js/gameplay/bosses.js';
import { useRitual } from '../js/gameplay/meta.js';

assert.equal(ZONES.length,8);
assert.equal(FINAL_ENCOUNTER,24);
assert.equal(zoneForEncounter(1).name,'PUERTO AHOGADO');
assert.equal(zoneForEncounter(2).isElite,true);
assert.equal(zoneForEncounter(3).isBoss,true);
assert.equal(zoneForEncounter(4).name,'BIBLIOTECA SUMERGIDA');
assert.equal(zoneForEncounter(24).boss.id,'the-gate');
assert.match(battleLabel(3),/BOSS/);
assert.ok(targetForEncounter(2)>targetForEncounter(1));
assert.ok(targetForEncounter(3)>targetForEncounter(2));

const base={base:20,mult:2,score:40,madnessCost:1,name:'Pareja'};
let state=newRun(()=>0.2);
state.encounter=3;
let mod=bossScoreModifier(state.hand.slice(0,3),base,state);
assert.equal(mod.mult,1);
state.encounter=18;
mod=bossScoreModifier(state.hand.slice(0,5),base,state);
assert.equal(mod.mult,1);

state.encounter=21;
mod=bossScoreModifier([{rank:3},{rank:4},{rank:7}],{base:20,mult:2,score:40,madnessCost:0,name:'Carta alta'},state);
assert.equal(mod.madnessCost,2);

state.encounter=24;
mod=bossScoreModifier(state.hand.slice(0,5),base,state);
assert.equal(mod.madnessCost,2);

state.encounter=6;
const discarded=[state.hand[0]];discarded[0].corruption=0;
assert.ok(onBossDiscard(state,discarded));
assert.equal(discarded[0].corruption,1);

state.encounter=9;
const played=[state.hand[0]];const oldSuit=played[0].suit;
assert.ok(onBossHandResolved(state,played));
assert.notEqual(played[0].suit,oldSuit);

state.encounter=12;state.discardPile=[state.hand[0]];
assert.ok(onBossHandResolved(state,[state.hand[1]]));
assert.equal(state.discardPile.length,0);

state.encounter=15;
assert.equal(bossBlocksMadnessReduction(state),true);
state.rituals=[{id:'salt-circle',name:'CÍRCULO DE SAL'}];state.madness=50;
assert.equal(useRitual(state,'salt-circle').ok,false);
assert.equal(state.madness,50);
assert.equal(state.rituals.length,1);

state=newRun(()=>0.1);state.encounter=FINAL_ENCOUNTER;state.targetScore=1;state.totalScore=1;state.screenMode='reward';state.status='choice';state.pendingReward=10;state.bossesDefeated=8;
assert.equal(claimReward(state).ok,true);
assert.equal(state.status,'won');
assert.equal(state.screenMode,'victory');
console.log('PASS: 25 comprobaciones de zonas/bosses/final de run');
