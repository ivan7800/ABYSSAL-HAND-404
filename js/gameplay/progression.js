import { zoneForEncounter, finalEncounterForVersion } from './zones.js';
import { EVENTS } from '../economy/content.js';

export const NODE_TYPES = {
  battle: { name: 'ENCUENTRO', icon: '◆' },
  shop: { name: 'MERCADO', icon: '¤' },
  ritual: { name: 'RITUAL', icon: '✦' },
  event: { name: 'PRESAGIO', icon: '?', description:'Un relato del sector con una decisión de riesgo o alivio.' },
  sanctuary: { name: 'REFUGIO', icon: '✚', description:'Recupera Locura, purifica una carta o cambia seguridad por Ecos.' },
  cache: { name: 'ECO PERDIDO', icon: '◈', description:'Encuentra Ecos entre los restos: puedes arriesgarte o escuchar con cautela.' }
};

const LEGACY_ROUTE_TABLE = [
  ['battle','shop','event','sanctuary'],
  ['battle','ritual','shop','sanctuary'],
  ['event','battle','ritual','sanctuary'],
  ['shop','battle','event','sanctuary']
];

// Cada sector altera el equilibrio entre mercado, altar, presagio y refugio.
// Las dos ventanas narrativas ofrecen un presagio diferente en cada sector.
const ROUTES_BY_ZONE = [
  [['battle','shop','event','sanctuary'],['battle','ritual','shop','sanctuary'],['event','battle','ritual','sanctuary'],['shop','battle','cache','sanctuary']],
  [['battle','ritual','event','sanctuary'],['battle','shop','ritual','sanctuary'],['event','battle','cache','sanctuary'],['ritual','battle','cache','sanctuary']],
  [['event','battle','cache','sanctuary'],['battle','sanctuary','shop','cache'],['battle','event','ritual','sanctuary'],['sanctuary','battle','ritual','cache']],
  [['battle','event','shop','sanctuary'],['battle','sanctuary','ritual','cache'],['event','battle','cache','sanctuary'],['ritual','shop','battle','sanctuary']],
  [['battle','cache','event','sanctuary'],['battle','shop','ritual','sanctuary'],['event','battle','shop','sanctuary'],['sanctuary','ritual','battle','cache']],
  [['event','battle','ritual','sanctuary'],['battle','shop','cache','sanctuary'],['battle','cache','event','sanctuary'],['ritual','battle','shop','sanctuary']],
  [['battle','shop','event','sanctuary'],['battle','ritual','cache','sanctuary'],['sanctuary','event','battle','ritual'],['shop','battle','cache','sanctuary']],
  [['battle','event','cache','sanctuary'],['battle','shop','ritual','sanctuary'],['event','battle','shop','sanctuary'],['ritual','sanctuary','battle','cache']]
];
const EVENTS_BY_ZONE = [
  ['silent-bell','tide-accountant'],['living-book','tooth-catalogue'],
  ['root-crown','hollow-stag'],['false-sun','star-eater'],
  ['folded-street','door-cab'],['bone-tide','ember-fisher'],
  ['choir-well','shell-pilgrim'],['breathing-gate','second-shadow']
];

export function targetForEncounter(encounter,campaignVersion=2) {
  const zone=zoneForEncounter(encounter,campaignVersion);
  if(campaignVersion<2){
    const base=300+Math.max(0,encounter-1)*125;
    return Math.round(base*(zone.isBoss?1.35:zone.isElite?1.15:1));
  }
  // A 32-battle campaign needs a target a strong hand can actually reach.
  const base=300+Math.max(0,encounter-1)*17;
  return Math.round(base*(zone.isBoss?1.2:zone.isElite?1.1:1));
}

export function makeRouteOptions(state) {
  if(state.encounter>=finalEncounterForVersion(state.campaignVersion))return [];
  const zone=zoneForEncounter(state.encounter,state.campaignVersion);
  const row=state.campaignVersion<2
    ?LEGACY_ROUTE_TABLE[(state.encounter-1)%LEGACY_ROUTE_TABLE.length]
    :ROUTES_BY_ZONE[zone.zoneIndex][zone.battleInZone-1];
  const eventIndex=zone.battleInZone===3?1:0;
  return row.map((type,index)=>({id:`${state.encounter}-${index}-${type}`,type,...NODE_TYPES[type],...(type==='event'?{eventId:state.campaignVersion<2?EVENTS[0].id:EVENTS_BY_ZONE[zone.zoneIndex][eventIndex]}:{})}));
}

export function rewardForEncounter(state) {
  const zone=zoneForEncounter(state.encounter,state.campaignVersion);
  const base = 8 + state.encounter * 3;
  const madnessBonus = state.madness >= 50 ? 3 : 0;
  const dangerBonus=zone.isBoss?10:zone.isElite?4:0;
  return base + madnessBonus + dangerBonus;
}

export function advanceEncounter(state) {
  state.encounter += 1;
  state.totalScore = 0;
  state.targetScore = targetForEncounter(state.encounter,state.campaignVersion);
  state.handsLeft = 4 + (state.relics.some(r=>r.id==='coral-heart')?1:0);
  state.discardsLeft = 4 + state.relics.filter(r => ['salt-lamp','ink-compass'].includes(r.id)).length + (state.pacts.some(p=>p.id==='root-pact')?1:0);
  state.selectedIds.clear();
  state.status = 'playing';
  state.screenMode = 'battle';
  state.routeOptions = [];
  state.currentNode = null;
}
