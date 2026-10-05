import { safeStorage, safeIndexedDB } from './storage.js';
import { sanitizeMeta } from './meta-store.js';
import { targetForEncounter } from '../gameplay/progression.js';

const DB_NAME='abyssal-hand-404';
const DB_VERSION=1;
const STORE='runs';
const SLOT='autosave';
const FALLBACK_KEY='abyssal-hand-404-run-v1';
export const RUN_SCHEMA_VERSION=1;

const SUIT_META={spade:{name:'Vacío',symbol:'♠'},heart:{name:'Sangre',symbol:'♥'},diamond:{name:'Ojo',symbol:'♦'},club:{name:'Raíz',symbol:'♣'}};
const RANK_LABELS={2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'J',12:'Q',13:'K',14:'A'};
function cloneCard(card){
  if(!card||typeof card!=='object')throw new Error('El save contiene una carta inválida.');
  const suit=typeof card.suit==='string'?card.suit:'';const rank=Number(card.rank);const meta=SUIT_META[suit];
  if(!meta||!Number.isInteger(rank)||rank<2||rank>14)throw new Error('El save contiene una carta con palo o rango inválido.');
  const expectedId=card.id;if(typeof expectedId!=='string'||!new RegExp(`^(spade|heart|diamond|club)-${rank}$`).test(expectedId))throw new Error('El save contiene un ID de carta inválido.');
  const corruption=Math.max(0,Math.min(3,Math.trunc(Number(card.corruption)||0)));
  return {id:expectedId,suit,suitName:meta.name,symbol:meta.symbol,rank,rankLabel:RANK_LABELS[rank],corruption};
}
function normalizeList(value,label='lista de cartas'){if(!Array.isArray(value))return [];if(value.length>52)throw new Error(`El save contiene demasiadas cartas en ${label}.`);return value.map(cloneCard);}
function safeNumber(value,fallback=0,min=-Infinity,max=Infinity){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;}
function safeStrings(value){return Array.isArray(value)?value.filter(x=>typeof x==='string').slice(0,64):[];}

export function serializeRun(state){
  if(!state||typeof state!=='object')throw new Error('Estado de run inválido.');
  return {
    schemaVersion:RUN_SCHEMA_VERSION,
    savedAt:new Date().toISOString(),
    state:{
      ...state,
      selectedIds:[...(state.selectedIds instanceof Set?state.selectedIds:new Set(safeStrings(state.selectedIds)))],
      deck:normalizeList(state.deck,'mazo'),hand:normalizeList(state.hand,'mano'),discardPile:normalizeList(state.discardPile,'descarte'),
      routeOptions:Array.isArray(state.routeOptions)?state.routeOptions.map(x=>({...x})):[],
      entities:Array.isArray(state.entities)?state.entities.map(x=>({...x})):[],
      relics:Array.isArray(state.relics)?state.relics.map(x=>({...x})):[],
      rituals:Array.isArray(state.rituals)?state.rituals.map(x=>({...x})):[],
      pacts:Array.isArray(state.pacts)?state.pacts.map(x=>({...x})):[],
      runStats:{...(state.runStats||{})}
    }
  };
}

export function restoreRun(payload){
  if(!payload||typeof payload!=='object')throw new Error('Save vacío o ilegible.');
  if(payload.schemaVersion!==RUN_SCHEMA_VERSION)throw new Error(`Versión de save no compatible: ${payload.schemaVersion??'desconocida'}.`);
  const raw=payload.state;
  if(!raw||typeof raw!=='object')throw new Error('El save no contiene un estado de partida.');
  if(typeof raw.seed!=='string'||!raw.seed.trim())throw new Error('Seed ausente en el save.');
  const state={...raw};
  state.version=safeNumber(raw.version,7,1,999);
  state.campaignVersion=safeNumber(raw.campaignVersion,state.version>=8?2:1,1,2);
  state.seed=raw.seed.slice(0,64);
  state.targetScore=safeNumber(raw.targetScore,300,1,1e12);
  state.totalScore=safeNumber(raw.totalScore,0,0,1e15);
  state.handsLeft=safeNumber(raw.handsLeft,4,0,99);
  state.discardsLeft=safeNumber(raw.discardsLeft,5,0,99);
  state.madness=safeNumber(raw.madness,0,0,100);
  state.turn=safeNumber(raw.turn,0,0,1e7);
  state.encounter=safeNumber(raw.encounter,1,1,32);
  if(state.campaignVersion>=2&&state.version<9){
    state.targetScore=targetForEncounter(state.encounter,state.campaignVersion);
    state.version=9;
  }
  state.bossesDefeated=safeNumber(raw.bossesDefeated,0,0,8);
  state.echoes=safeNumber(raw.echoes,0,0,1e12);
  state.pendingReward=safeNumber(raw.pendingReward,0,0,1e12);
  state.deck=normalizeList(raw.deck,'mazo'); state.hand=normalizeList(raw.hand,'mano'); state.discardPile=normalizeList(raw.discardPile,'descarte');
  if(state.hand.length>8)throw new Error('El save contiene demasiadas cartas en mano.');
  const cardIds=new Set([...state.deck,...state.hand,...state.discardPile].map(c=>c.id).filter(Boolean));
  if(cardIds.size!==state.deck.length+state.hand.length+state.discardPile.length)throw new Error('El save contiene IDs de carta duplicados.');
  state.selectedIds=new Set(safeStrings(raw.selectedIds).filter(id=>state.hand.some(c=>c.id===id)).slice(0,5));
  state.routeOptions=Array.isArray(raw.routeOptions)?raw.routeOptions.map(x=>({...x})).slice(0,8):[];
  state.entities=Array.isArray(raw.entities)?raw.entities.map(x=>({...x})).slice(0,16):[];
  state.relics=Array.isArray(raw.relics)?raw.relics.map(x=>({...x})).slice(0,32):[];
  state.rituals=Array.isArray(raw.rituals)?raw.rituals.map(x=>({...x})).slice(0,16):[];
  state.pacts=Array.isArray(raw.pacts)?raw.pacts.map(x=>({...x})).slice(0,16):[];
  state.runStats={handsPlayed:safeNumber(raw.runStats?.handsPlayed,0,0,1e7),echoesEarned:safeNumber(raw.runStats?.echoesEarned,0,0,1e12),maxMadness:safeNumber(raw.runStats?.maxMadness,0,0,100),cardsCorrupted:safeNumber(raw.runStats?.cardsCorrupted,0,0,9999)};
  state.status=['playing','choice','lost','won'].includes(raw.status)?raw.status:'playing';
  state.screenMode=['battle','reward','route','shop','ritual','event','sanctuary','victory'].includes(raw.screenMode)?raw.screenMode:'battle';
  state.metaCommitted=Boolean(raw.metaCommitted);
  return state;
}

function openDb(indexedDBImpl=safeIndexedDB(),timeoutMs=1800){
  if(!indexedDBImpl)return Promise.reject(new Error('IndexedDB no disponible.'));
  return new Promise((resolve,reject)=>{
    let settled=false;
    const done=(fn,value)=>{if(settled)return;settled=true;clearTimeout(timer);fn(value);};
    const timer=setTimeout(()=>done(reject,new Error('IndexedDB no respondió a tiempo.')),timeoutMs);
    let req;
    try{req=indexedDBImpl.open(DB_NAME,DB_VERSION);}catch(error){done(reject,error);return;}
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};
    req.onsuccess=()=>{if(settled){try{req.result.close();}catch{}return;}done(resolve,req.result);};
    req.onerror=()=>done(reject,req.error||new Error('No se pudo abrir IndexedDB.'));
    req.onblocked=()=>done(reject,new Error('IndexedDB está bloqueado por otra pestaña o versión.'));
  });
}
async function idbOperation(mode, operation, indexedDBImpl){
  const db=await openDb(indexedDBImpl);
  return new Promise((resolve,reject)=>{
    let settled=false,tx,value;
    const finish=(error)=>{if(settled)return;settled=true;clearTimeout(timer);db.close();error?reject(error):resolve(value);};
    const timer=setTimeout(()=>{try{tx?.abort();}catch{}finish(new Error('El guardado no respondió a tiempo.'));},1800);
    try{tx=db.transaction(STORE,mode);const req=operation(tx.objectStore(STORE));
      req.onsuccess=()=>{value=req.result??null;};
      tx.oncomplete=()=>finish();tx.onerror=()=>finish(tx.error||new Error('Error de almacenamiento.'));
      tx.onabort=()=>finish(tx.error||new Error('Transacción cancelada.'));
    }catch(error){finish(error);}
  });
}
const idbPut=(value,impl)=>idbOperation('readwrite',store=>store.put(value,SLOT),impl);
const idbGet=impl=>idbOperation('readonly',store=>store.get(SLOT),impl);
const idbDelete=impl=>idbOperation('readwrite',store=>store.delete(SLOT),impl);

export async function saveRun(state,{indexedDBImpl=safeIndexedDB(),storage=safeStorage()}={}){
  let payload;try{payload=serializeRun(state);}catch(error){return {ok:false,error:error.message};}
  try{await idbPut(payload,indexedDBImpl);try{storage?.removeItem(FALLBACK_KEY);}catch{}return {ok:true,backend:'indexedDB',savedAt:payload.savedAt};}
  catch(error){try{if(!storage)throw new Error('Almacenamiento no disponible');storage.setItem(FALLBACK_KEY,JSON.stringify(payload));return {ok:true,backend:'localStorage',savedAt:payload.savedAt,fallbackReason:error?.message||String(error)};}catch{return {ok:false,error:error?.message||String(error)};}}
}
export async function loadRun({indexedDBImpl=safeIndexedDB(),storage=safeStorage()}={}){
  let payload=null;let backend='indexedDB';
  try{payload=await idbGet(indexedDBImpl);}catch{backend='localStorage';try{payload=JSON.parse(storage?.getItem(FALLBACK_KEY)||'null');}catch{payload=null;}}
  if(!payload){try{const fallback=JSON.parse(storage?.getItem(FALLBACK_KEY)||'null');if(fallback){payload=fallback;backend='localStorage';}}catch{}}
  if(!payload)return {ok:true,state:null,backend:null};
  try{return {ok:true,state:restoreRun(payload),backend,savedAt:payload.savedAt||null};}
  catch(error){return {ok:false,state:null,backend,error:error?.message||String(error)};}
}
export async function clearRun({indexedDBImpl=safeIndexedDB(),storage=safeStorage()}={}){try{await idbDelete(indexedDBImpl);}catch{}try{storage?.removeItem(FALLBACK_KEY);}catch{}return true;}

export function exportSave(state,meta){return JSON.stringify({format:'abyssal-hand-404-save',schemaVersion:1,exportedAt:new Date().toISOString(),run:serializeRun(state),meta},null,2);}
export function importSaveText(text){let data;try{data=JSON.parse(text);}catch{throw new Error('El archivo no contiene JSON válido.');}if(data?.format!=='abyssal-hand-404-save'||data?.schemaVersion!==1)throw new Error('Formato de save no reconocido.');return {state:restoreRun(data.run),meta:data.meta&&typeof data.meta==='object'?sanitizeMeta(data.meta):null};}
