import { createDeck, shuffle, draw } from '../cards/deck.js';
import { createInitialState } from './state.js';
import { scoreSelection } from '../scoring/scoring.js';
import { applyMadness, corruptCard, madnessTier } from '../systems.js';
import { makeRouteOptions, rewardForEncounter, advanceEncounter, targetForEncounter } from '../gameplay/progression.js';
import { activeBoss, onBossDiscard, onBossHandResolved } from '../gameplay/bosses.js';
import { zoneForEncounter, FINAL_ENCOUNTER } from '../gameplay/zones.js';
import { makeSeededRandom, normalizeSeed } from './rng.js';

export const HAND_SIZE = 8;

export function newRun(randomOrSeed = Math.random) {
  const state = createInitialState();
  let random=randomOrSeed;
  if(typeof randomOrSeed==='string'){state.seed=normalizeSeed(randomOrSeed);random=makeSeededRandom(state.seed);}else{state.seed=normalizeSeed();}
  state.targetScore=targetForEncounter(1);
  state.deck = shuffle(createDeck(), random);
  state.hand = draw(state.deck, HAND_SIZE);
  return state;
}
export function selectedCards(state) { return state.hand.filter(card => state.selectedIds.has(card.id)); }
export function preview(state) { return scoreSelection(selectedCards(state), state); }
export function toggleCard(state, id) {
  if (state.status !== 'playing' || state.screenMode !== 'battle') return { ok:false, message:'Ahora debes resolver el nodo actual.' };
  if (!state.hand.some(card => card.id === id)) return { ok:false, message:'Carta inexistente.' };
  if (state.selectedIds.has(id)) { state.selectedIds.delete(id); return {ok:true}; }
  if (state.selectedIds.size >= 5) return {ok:false,message:'Solo puedes seleccionar hasta 5 cartas.'};
  state.selectedIds.add(id); return {ok:true};
}
function refillHand(state) {
  let missing=HAND_SIZE-state.hand.length;
  if(missing>state.deck.length && state.discardPile.length){state.deck.push(...shuffle(state.discardPile));state.discardPile=[];}
  missing=HAND_SIZE-state.hand.length; if(missing>0) state.hand.push(...draw(state.deck,missing));
}
function removeSelected(state) {
  const removed=state.hand.filter(card=>state.selectedIds.has(card.id));
  state.discardPile.push(...removed);
  state.hand=state.hand.filter(card=>!state.selectedIds.has(card.id)); state.selectedIds.clear(); refillHand(state);
  return removed;
}
function resolveEnd(state) {
  if (state.totalScore >= state.targetScore) {
    const zone=zoneForEncounter(state.encounter);
    if(zone.isBoss)state.bossesDefeated+=1;
    state.status='choice'; state.screenMode='reward'; state.pendingReward=rewardForEncounter(state);
    return `${zone.isBoss?'ENTIDAD VENCIDA':'UMBRAL SUPERADO'}. Recompensa disponible: ${state.pendingReward} Ecos.`;
  }
  if (state.handsLeft <= 0) { state.status='lost'; return 'EXPEDICIÓN PERDIDA. El mar reclama lo que queda de tu memoria.'; }
  if (state.madness >= 100) { state.status='lost'; return 'RUPTURA TOTAL. La geometría deja de obedecer.'; }
  return null;
}
export function claimReward(state) {
  if(state.screenMode!=='reward') return {ok:false,message:'No hay recompensa pendiente.'};
  const voidBonus=state.pacts.some(p=>p.id==='void-pact')?Math.ceil(state.pendingReward*.2):0;
  const boneBonus=state.relics.some(r=>r.id==='bone-die')?12:0;
  const amount=state.pendingReward+voidBonus+boneBonus;
  state.echoes+=amount; state.runStats.echoesEarned+=amount; state.pendingReward=0;
  if(state.encounter>=FINAL_ENCOUNTER){
    state.status='won';state.screenMode='victory';state.routeOptions=[];
    return {ok:true,message:`LA PUERTA CEDE. Has completado los 8 sectores y derrotado ${state.bossesDefeated} entidades.`};
  }
  state.screenMode='route'; state.routeOptions=makeRouteOptions(state);
  return {ok:true,message:`Recoges ${amount} Ecos. Elige tu siguiente senda.`};
}
export function chooseRoute(state, routeId) {
  if(state.screenMode!=='route') return {ok:false,message:'No puedes elegir ruta ahora.'};
  const node=state.routeOptions.find(x=>x.id===routeId); if(!node) return {ok:false,message:'Ruta desconocida.'};
  state.currentNode=node; state.screenMode=node.type;
  if(node.type==='battle') {
    advanceEncounter(state);
    if(state.pacts.some(p=>p.id==='void-pact')) applyMadness(state,8);
    const zone=zoneForEncounter(state.encounter);
    const threat=zone.isBoss?` BOSS: ${zone.boss.name}.`:zone.isElite?' Presencia ÉLITE detectada.':'';
    return {ok:true,message:`SECTOR ${zone.zoneIndex+1} · ${zone.name}. ENCUENTRO ${state.encounter}.${threat}`};
  }
  if(node.type==='shop') return {ok:true,message:'El Mercado Sumergido abre sus postigos.'};
  if(node.type==='ritual') return {ok:true,message:'Un altar antiguo exige una decisión.'};
  return {ok:true,message:'Algo llama desde detrás de una puerta sin muro.'};
}
export function playSelection(state) {
  const cards=selectedCards(state);
  const result=preview(state);
  if(!result||state.handsLeft<=0||state.status!=='playing'||state.screenMode!=='battle') return {ok:false,message:'No hay una mano válida seleccionada.'};
  state.totalScore+=result.score; state.handsLeft-=1; state.turn+=1; state.runStats.handsPlayed+=1;
  const zone=zoneForEncounter(state.encounter);
  applyMadness(state,result.madnessCost+(zone.isElite?1:0)); state.runStats.maxMadness=Math.max(state.runStats.maxMadness,state.madness); state.lastResult=result;
  const removed=removeSelected(state);
  const bossEffect=onBossHandResolved(state,removed);
  let corruptionMessage='';
  if(state.turn%2===0){const corrupted=corruptCard(state);if(corrupted){state.runStats.cardsCorrupted+=1;corruptionMessage=` · ${corrupted.rankLabel} de ${corrupted.suitName} ha sido marcada.`;}}
  const endMessage=resolveEnd(state); const tier=madnessTier(state.madness); const entityText=result.entityLabel?` · ${result.entityLabel}.`:''; const bossText=result.bossLabel?` · ${result.bossLabel}.`:''; const aftermath=bossEffect?` · ${bossEffect}`:'';
  return {ok:true,result,message:endMessage??`${result.name}: ${result.base} Ecos × ${result.mult} Resonancia = ${result.score}.${entityText}${bossText} Locura ${state.madness}% [${tier}]${corruptionMessage}${aftermath}`};
}
export function discardSelection(state) {
  if(state.selectedIds.size===0||state.discardsLeft<=0||state.status!=='playing'||state.screenMode!=='battle') return {ok:false,message:'No puedes descartar ahora.'};
  const count=state.selectedIds.size;
  const discarded=state.hand.filter(card=>state.selectedIds.has(card.id));
  const bossEffect=onBossDiscard(state,discarded);
  state.discardsLeft-=1;removeSelected(state);
  return {ok:true,message:`${count} carta${count===1?'':'s'} descartada${count===1?'':'s'}.${bossEffect?` ${bossEffect}`:''}`};
}
