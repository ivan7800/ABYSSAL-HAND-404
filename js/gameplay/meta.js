import { SHOP_ITEMS, PACTS, EVENTS } from '../economy/content.js';
import { applyMadness } from '../systems.js';
import { advanceEncounter } from './progression.js';
import { bossBlocksMadnessReduction } from './bosses.js';
import { zoneForEncounter, finalEncounterForVersion } from './zones.js';

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
  if(state.screenMode!=='event')return {ok:false,message:'No hay un presagio pendiente.'};
  if(state.campaignVersion<2&&['open','ignore'].includes(choice)){
    if(choice==='open'){applyMadness(state,12);state.echoes+=14;state.rituals.push({id:'salt-circle',name:'CÍRCULO DE SAL'});return {ok:true,message:'Abriste la puerta: +14 Ecos, Círculo de Sal, +12 Locura.'};}
    applyMadness(state,-5);return {ok:true,message:'Ignoraste el presagio. Recuperas 5 de Locura.'};
  }
  const event=EVENTS.find(x=>x.id===state.currentNode?.eventId)||EVENTS[zoneForEncounter(state.encounter,state.campaignVersion).zoneIndex%EVENTS.length];
  const selected=event.choices.find(x=>x.id===choice);
  if(!selected)return {ok:false,message:'Esa decisión no pertenece a este presagio.'};
  const effect=selected.effect;
  if(effect.echoes){state.echoes+=effect.echoes;state.runStats.echoesEarned+=effect.echoes;}
  if(effect.madness)applyMadness(state,effect.madness);
  if(effect.ritual&&!state.rituals.some(x=>x.id===effect.ritual)){const item=SHOP_ITEMS.find(x=>x.id===effect.ritual);state.rituals.push({id:effect.ritual,name:item?.name||effect.ritual});}
  return {ok:true,message:`${event.name}: ${selected.label}.`};
}

export function resolveSanctuary(state,choice){
  if(state.screenMode!=='sanctuary')return {ok:false,message:'No hay refugio disponible.'};
  if(choice==='rest'){applyMadness(state,-18);return {ok:true,message:'Descansas bajo la piedra. Recuperas 18 de Locura.'};}
  if(choice==='purify'){
    const cards=[...state.hand,...state.deck,...state.discardPile].filter(c=>(c.corruption||0)>0).sort((a,b)=>b.corruption-a.corruption);
    if(cards.length){cards[0].corruption=Math.max(0,cards[0].corruption-1);return {ok:true,message:`Purificas una carta: ahora tiene ${cards[0].corruption} de corrupción.`};}
    applyMadness(state,-8);return {ok:true,message:'No hay cartas corruptas. El refugio calma 8 de Locura.'};
  }
  if(choice==='bargain'){state.echoes+=20;state.runStats.echoesEarned+=20;applyMadness(state,8);return {ok:true,message:'Aceptas el trato: +20 Ecos y +8 Locura.'};}
  return {ok:false,message:'Decisión de refugio desconocida.'};
}

export function resolveCache(state,choice){
  if(state.screenMode!=='cache')return {ok:false,message:'No hay Ecos perdidos en esta senda.'};
  if(choice==='gather'){state.echoes+=24;state.runStats.echoesEarned+=24;applyMadness(state,10);return {ok:true,message:'Reúnes 24 Ecos. Algo te sigue desde el fondo: +10 Locura.'};}
  if(choice==='listen'){state.echoes+=10;state.runStats.echoesEarned+=10;applyMadness(state,-12);return {ok:true,message:'Escuchas antes de tocar. Recuperas 12 de Locura y encuentras 10 Ecos.'};}
  return {ok:false,message:'No reconoces esa decisión entre los Ecos.'};
}

export function continueFromNode(state) {
  advanceEncounter(state);
  if(state.encounter>=finalEncounterForVersion(state.campaignVersion))return {ok:false,message:'La última puerta ya está abierta.'};
  const zone=zoneForEncounter(state.encounter,state.campaignVersion);
  const threat=zone.isBoss?` BOSS: ${zone.boss.name}.`:zone.isElite?' Presencia ÉLITE detectada.':'';
  return {ok:true,message:`SECTOR ${zone.zoneIndex+1} · ${zone.name}. ENCUENTRO ${state.encounter}. El umbral asciende a ${state.targetScore}.${threat}`};
}
