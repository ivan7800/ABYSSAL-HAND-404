import { SHOP_ITEMS, PACTS } from '../economy/content.js';
import { applyMadness } from '../systems.js';
import { advanceEncounter } from './progression.js';
import { bossBlocksMadnessReduction } from './bosses.js';
import { zoneForEncounter } from './zones.js';

export function buyItem(state, itemId) {
  const item = SHOP_ITEMS.find(x => x.id === itemId);
  if (!item) return {ok:false,message:'Objeto desconocido.'};
  if(item.type==='relic'&&state.relics.some(r=>r.id===item.id))return {ok:false,message:'Ya posees esta reliquia.'};
  if (state.echoes < item.cost) return {ok:false,message:'No tienes Ecos suficientes.'};
  state.echoes -= item.cost;
  if (item.type === 'relic') {
    if (!state.relics.some(r => r.id === item.id)) state.relics.push({id:item.id,name:item.name});
  } else {
    state.rituals.push({id:item.id,name:item.name});
  }
  return {ok:true,message:`${item.name} adquirido.`};
}

export function useRitual(state, ritualId) {
  const index = state.rituals.findIndex(r => r.id === ritualId);
  if (index < 0) return {ok:false,message:'No posees ese Ritual.'};
  if (ritualId === 'salt-circle') {
    if (bossBlocksMadnessReduction(state)) return {ok:false,message:'EL DURMIENTE impide reducir la Locura durante este combate.'};
    applyMadness(state,-18);
  }
  if (ritualId === 'red-key') {
    const card = state.hand.find(c => (c.corruption || 0) < 3);
    if (card) card.corruption = Math.min(3,(card.corruption || 0)+2);
  }
  const [used] = state.rituals.splice(index,1);
  return {ok:true,message:`Ritual ${used.name} consumido.`};
}

export function acceptPact(state, pactId) {
  const pact = PACTS.find(x => x.id === pactId);
  if (!pact) return {ok:false,message:'Pacto desconocido.'};
  if (!state.pacts.some(p => p.id === pact.id)) state.pacts.push({id:pact.id,name:pact.name});
  return {ok:true,message:`Has aceptado ${pact.name}.`};
}

export function resolveEvent(state, choice) {
  if (choice === 'open') {
    applyMadness(state,12);
    state.echoes += 14;
    state.rituals.push({id:'salt-circle',name:'CÍRCULO DE SAL'});
    return {ok:true,message:'Abriste la puerta: +14 Ecos, Círculo de Sal, +12 Locura.'};
  }
  applyMadness(state,-5);
  return {ok:true,message:'Ignoraste el presagio. Recuperas 5 de Locura.'};
}

export function continueFromNode(state) {
  advanceEncounter(state);
  const zone=zoneForEncounter(state.encounter);
  const threat=zone.isBoss?` BOSS: ${zone.boss.name}.`:zone.isElite?' Presencia ÉLITE detectada.':'';
  return {ok:true,message:`SECTOR ${zone.zoneIndex+1} · ${zone.name}. ENCUENTRO ${state.encounter}. El umbral asciende a ${state.targetScore}.${threat}`};
}

