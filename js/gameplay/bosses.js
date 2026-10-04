import { zoneForEncounter } from './zones.js';

const SUIT_ROTATION={spade:'heart',heart:'diamond',diamond:'club',club:'spade'};
const SUIT_NAMES={spade:'Vacío',heart:'Sangre',diamond:'Ojo',club:'Raíz'};

export function activeBoss(state){
  const zone=zoneForEncounter(state.encounter,state.campaignVersion);
  return zone.isBoss?zone.boss:null;
}

export function bossScoreModifier(cards,result,state){
  const boss=activeBoss(state);
  if(!boss)return {...result,bossLabel:null};
  let mult=result.mult;
  let madnessCost=result.madnessCost;
  let label=null;
  if(boss.id==='blind-astronomer'&&cards.length<4){mult=Math.max(1,mult-1);label='El Astrónomo apaga 1 Resonancia';}
  if(boss.id==='mirror-saint'&&(result.name==='Pareja'||result.name==='Doble pareja')){mult=Math.max(1,mult-1);label='El espejo rompe 1 Resonancia';}
  if(boss.id==='black-choir'){
    const odd=cards.filter(c=>c.rank%2===1).length;
    madnessCost+=odd;
    if(odd)label=`El Coro susurra: +${odd} Locura`;
  }
  if(boss.id==='the-gate'){
    madnessCost*=2;
    label='La Puerta duplica la Locura';
  }
  return {...result,mult,score:result.base*mult,madnessCost,bossLabel:label};
}

export function onBossDiscard(state,discarded){
  const boss=activeBoss(state);
  if(!boss)return null;
  if(boss.id==='abyssal-mother'&&discarded.length){
    const card=discarded[0];
    card.corruption=Math.min(3,(card.corruption||0)+1);
    return `${card.rankLabel} de ${card.suitName} cae al descarte ya corrupta.`;
  }
  return null;
}

export function onBossHandResolved(state,playedCards){
  const boss=activeBoss(state);
  if(!boss)return null;
  if(boss.id==='faceless-king'){
    for(const card of playedCards){card.suit=SUIT_ROTATION[card.suit];card.suitName=SUIT_NAMES[card.suit];card.symbol={spade:'♠',heart:'♥',diamond:'♦',club:'♣'}[card.suit];}
    return 'El Rey Sin Rostro rota los palos de las cartas jugadas.';
  }
  if(boss.id==='devourer'&&state.discardPile.length){
    const [card]=state.discardPile.splice(0,1);
    return `El Devorador consume para siempre ${card.rankLabel} de ${card.suitName}.`;
  }
  return null;
}

export function bossBlocksMadnessReduction(state){
  return activeBoss(state)?.id==='sleeper';
}
