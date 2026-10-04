import { safeStorage, safeIndexedDB } from './storage.js';
const KEY='abyssal-hand-404-meta-v1';
export function defaultMeta(){return {version:1,fragments:0,runs:0,wins:0,bestScore:0,bestEncounter:1,totalHands:0,totalEchoes:0,totalMadness:0,lastSeed:'',unlocks:['start'],history:[]};}
function safeNumber(value,fallback=0,min=0,max=Number.MAX_SAFE_INTEGER){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):fallback;}
function safeSeed(value){return typeof value==='string'?value.slice(0,64):'';}
function safeUnlocks(value){return Array.isArray(value)?[...new Set(['start',...value.filter(x=>typeof x==='string'&&x.length<=96).slice(0,256)])]:['start'];}
function safeHistory(value){if(!Array.isArray(value))return [];return value.slice(0,12).map(x=>({seed:safeSeed(x?.seed),encounter:safeNumber(x?.encounter,1,1,24),score:safeNumber(x?.score,0,0,1e15),won:Boolean(x?.won),fragments:safeNumber(x?.fragments,0,0,1e9)}));}
export function sanitizeMeta(raw){const base=defaultMeta();if(!raw||typeof raw!=='object')return base;return {version:1,fragments:safeNumber(raw.fragments,0,0,1e9),runs:safeNumber(raw.runs,0,0,1e9),wins:safeNumber(raw.wins,0,0,1e9),bestScore:safeNumber(raw.bestScore,0,0,1e15),bestEncounter:safeNumber(raw.bestEncounter,1,1,24),totalHands:safeNumber(raw.totalHands,0,0,1e12),totalEchoes:safeNumber(raw.totalEchoes,0,0,1e15),totalMadness:safeNumber(raw.totalMadness,0,0,1e12),lastSeed:safeSeed(raw.lastSeed),unlocks:safeUnlocks(raw.unlocks),history:safeHistory(raw.history)};}
export function loadMeta(storage=safeStorage()){try{return sanitizeMeta(JSON.parse(storage?.getItem(KEY)||'null'));}catch{return defaultMeta();}}
export function saveMeta(meta,storage=safeStorage()){try{storage?.setItem(KEY,JSON.stringify(sanitizeMeta(meta)));return true;}catch{return false;}}
export function addUnlock(meta,id){if(typeof id==='string'&&id.length<=96&&!meta.unlocks.includes(id))meta.unlocks.push(id);}
export function commitRun(meta,state,{won=false}={}){
  meta.runs=safeNumber(meta.runs,0,0,1e9)+1;if(won)meta.wins=safeNumber(meta.wins,0,0,1e9)+1;
  meta.bestScore=Math.max(safeNumber(meta.bestScore,0,0,1e15),safeNumber(state.totalScore,0,0,1e15));meta.bestEncounter=Math.max(safeNumber(meta.bestEncounter,1,1,24),safeNumber(state.encounter,1,1,24));
  meta.totalHands=safeNumber(meta.totalHands,0,0,1e12)+safeNumber(state.runStats?.handsPlayed??state.turn,0,0,1e7);meta.totalEchoes=safeNumber(meta.totalEchoes,0,0,1e15)+safeNumber(state.runStats?.echoesEarned??state.echoes,0,0,1e12);meta.totalMadness=safeNumber(meta.totalMadness,0,0,1e12)+safeNumber(state.madness,0,0,100);
  const encounter=safeNumber(state.encounter,1,1,24),bosses=safeNumber(state.bossesDefeated,0,0,8);const fragments=Math.max(1,Math.floor(encounter/2)+(won?20:0)+bosses*2);meta.fragments=safeNumber(meta.fragments,0,0,1e9)+fragments;meta.lastSeed=safeSeed(state.seed);
  if(won)addUnlock(meta,'victory');
  meta.history.unshift({seed:safeSeed(state.seed),encounter,score:safeNumber(state.totalScore,0,0,1e15),won:Boolean(won),fragments});meta.history=safeHistory(meta.history);
  return fragments;
}
