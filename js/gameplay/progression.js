import { zoneForEncounter, FINAL_ENCOUNTER } from './zones.js';

export const NODE_TYPES = {
  battle: { name: 'ENCUENTRO', icon: '◆' },
  shop: { name: 'MERCADO', icon: '¤' },
  ritual: { name: 'RITUAL', icon: '✦' },
  event: { name: 'PRESAGIO', icon: '?' }
};

const ROUTE_TABLE = [
  ['battle','shop','event'],
  ['battle','ritual','shop'],
  ['event','battle','ritual'],
  ['shop','battle','event']
];

export function targetForEncounter(encounter) {
  const zone=zoneForEncounter(encounter);
  const base=300 + Math.max(0, encounter - 1) * 125;
  return Math.round(base * (zone.isBoss?1.35:zone.isElite?1.15:1));
}

export function makeRouteOptions(state) {
  if(state.encounter>=FINAL_ENCOUNTER)return [];
  const row = ROUTE_TABLE[(state.encounter - 1) % ROUTE_TABLE.length];
  return row.map((type, index) => ({
    id: `${state.encounter}-${index}-${type}`,
    type,
    ...NODE_TYPES[type]
  }));
}

export function rewardForEncounter(state) {
  const zone=zoneForEncounter(state.encounter);
  const base = 8 + state.encounter * 3;
  const madnessBonus = state.madness >= 50 ? 3 : 0;
  const dangerBonus=zone.isBoss?10:zone.isElite?4:0;
  return base + madnessBonus + dangerBonus;
}

export function advanceEncounter(state) {
  state.encounter += 1;
  state.totalScore = 0;
  state.targetScore = targetForEncounter(state.encounter);
  state.handsLeft = 4;
  state.discardsLeft = 4 + (state.relics.some(r => r.id === 'salt-lamp') ? 1 : 0) + (state.pacts.some(p=>p.id==='root-pact')?1:0);
  state.selectedIds.clear();
  state.status = 'playing';
  state.screenMode = 'battle';
  state.routeOptions = [];
  state.currentNode = null;
}
