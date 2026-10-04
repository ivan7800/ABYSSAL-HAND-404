import { zoneForEncounter, finalEncounterForVersion } from './zones.js';
import { EVENTS } from '../economy/content.js';

export const NODE_TYPES = {
  battle: { name: 'ENCUENTRO', icon: '◆' },
  shop: { name: 'MERCADO', icon: '¤' },
  ritual: { name: 'RITUAL', icon: '✦' },
  event: { name: 'PRESAGIO', icon: '?', description:'Un relato del sector con una decisión de riesgo o alivio.' },
  sanctuary: { name: 'REFUGIO', icon: '✚', description:'Recupera Locura, purifica una carta o cambia seguridad por Ecos.' }
};

const ROUTE_TABLE = [
  ['battle','shop','event','sanctuary'],
  ['battle','ritual','shop','sanctuary'],
  ['event','battle','ritual','sanctuary'],
  ['shop','battle','event','sanctuary']
];

export function targetForEncounter(encounter,campaignVersion=2) {
  const zone=zoneForEncounter(encounter,campaignVersion);
  const base=300 + Math.max(0, encounter - 1) * 125;
  return Math.round(base * (zone.isBoss?1.35:zone.isElite?1.15:1));
}

export function makeRouteOptions(state) {
  if(state.encounter>=finalEncounterForVersion(state.campaignVersion))return [];
  const row = ROUTE_TABLE[(state.encounter - 1) % ROUTE_TABLE.length];
  const zone=zoneForEncounter(state.encounter,state.campaignVersion);
  return row.map((type,index)=>({id:`${state.encounter}-${index}-${type}`,type,...NODE_TYPES[type],...(type==='event'?{eventId:EVENTS[zone.zoneIndex%EVENTS.length].id}:{})}));
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
