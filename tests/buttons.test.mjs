import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,toggleCard,playSelection,discardSelection,claimReward,chooseRoute} from '../js/core/game.js';
import {buyItem,acceptPact,resolveEvent,resolveSanctuary,resolveCache,continueFromNode,useRitual} from '../js/gameplay/meta.js';
import {saveRun,loadRun,exportSave,importSaveText} from '../js/persistence/run-store.js';
import {createAudioEngine} from '../js/audio/audio.js';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const render=fs.readFileSync(new URL('../js/ui/render.js',import.meta.url),'utf8');
let n=0; const t=async(name,fn)=>{await fn();n++;console.log(`PASS ${name}`)};

const boundIds=['playBtn','discardBtn','newRunBtn','continueRunBtn','codexBtn','audioBtn','fxBtn','installBtn','updateAppBtn','exportSaveBtn','importSaveBtn','importSaveInput','nodePanel','powers'];
for(const id of boundIds){t(`binding ${id}`,()=>{assert.match(html,new RegExp(`id=["']${id}["']`));assert.match(app,new RegExp(`${id}\\.addEventListener`));});}

await t('listeners se registran antes del boot async',()=>{assert.ok(app.indexOf("playBtn.addEventListener")<app.indexOf('void boot()'));});
await t('file:// usa bundle clásico',()=>assert.ok(html.includes('js/app.bundle.js')));

let s=newRun('BUTTON-TEST');
await t('seleccionar carta',()=>assert.equal(toggleCard(s,s.hand[0].id).ok,true));
await t('JUGAR MANO',()=>{const before=s.handsLeft;const r=playSelection(s);assert.equal(r.ok,true);assert.equal(s.handsLeft,before-1);});
await t('DESCARTAR',()=>{toggleCard(s,s.hand[0].id);const before=s.discardsLeft;const r=discardSelection(s);assert.equal(r.ok,true);assert.equal(s.discardsLeft,before-1);});
await t('NUEVA EXPEDICIÓN',()=>{const x=newRun('BUTTON-NEW');assert.equal(x.encounter,1);assert.equal(x.screenMode,'battle');assert.equal(x.hand.length,8);});
await t('CONTINUAR AUTOSAVE',async()=>{const bag=new Map();const storage={getItem:k=>bag.get(k)??null,setItem:(k,v)=>bag.set(k,v),removeItem:k=>bag.delete(k)};const brokenIdb={open(){const req={};queueMicrotask(()=>req.onerror?.());return req;}};const original=newRun('BUTTON-CONTINUE-SAVE');await saveRun(original,{indexedDBImpl:brokenIdb,storage});const loaded=await loadRun({indexedDBImpl:brokenIdb,storage});assert.equal(loaded.ok,true);assert.equal(loaded.state.seed,'BUTTON-CONTINUE-SAVE');});
await t('EXPORTAR / IMPORTAR SAVE',()=>{const text=exportSave(newRun('BUTTON-SAVE'),{fragments:0,runs:0,wins:0,bestEncounter:0,bestScore:0,totalHands:0,unlocks:[],history:[],lastSeed:''});const r=importSaveText(text);assert.equal(r.state.seed,'BUTTON-SAVE');});

await t('RECOGER RECOMPENSA',()=>{const x=newRun('BUTTON-REWARD');x.screenMode='reward';x.status='choice';x.pendingReward=20;const before=x.echoes;const r=claimReward(x);assert.equal(r.ok,true);assert.ok(x.echoes>before);assert.equal(x.screenMode,'route');});
await t('ELEGIR RUTA',()=>{const x=newRun('BUTTON-ROUTE');x.screenMode='route';x.status='choice';x.routeOptions=[{id:'test-battle',type:'battle',name:'TEST',icon:'X'}];const r=chooseRoute(x,'test-battle');assert.equal(r.ok,true);assert.equal(x.screenMode,'battle');});
await t('ELEGIR ECO PERDIDO',()=>{const x=newRun('BUTTON-ROUTE-CACHE');x.screenMode='route';x.status='choice';x.routeOptions=[{id:'test-cache',type:'cache',name:'ECO PERDIDO',icon:'◈'}];assert.equal(chooseRoute(x,'test-cache').ok,true);assert.equal(x.screenMode,'cache');});
await t('COMPRAR EN MERCADO',()=>{const x=newRun('BUTTON-BUY');x.echoes=99;const r=buyItem(x,'bone-die');assert.equal(r.ok,true);assert.ok(x.relics.some(v=>v.id==='bone-die'));});
await t('ACEPTAR PACTO',()=>{const x=newRun('BUTTON-PACT');const r=acceptPact(x,'blood-pact');assert.equal(r.ok,true);assert.ok(x.pacts.some(v=>v.id==='blood-pact'));});
await t('EVENTO ABRIR',()=>{const x=newRun('BUTTON-EVENT1');x.campaignVersion=1;x.screenMode='event';const e=x.echoes;const r=resolveEvent(x,'open');assert.equal(r.ok,true);assert.ok(x.echoes>e);});
await t('EVENTO IGNORAR',()=>{const x=newRun('BUTTON-EVENT2');x.campaignVersion=1;x.screenMode='event';x.madness=20;const r=resolveEvent(x,'ignore');assert.equal(r.ok,true);assert.equal(x.madness,15);});
await t('REFUGIO: descansar reduce Locura',()=>{const x=newRun('BUTTON-SANCTUARY');x.screenMode='sanctuary';x.madness=50;assert.equal(resolveSanctuary(x,'rest').ok,true);assert.equal(x.madness,32);});
await t('ECO PERDIDO: elegir riesgo o calma',()=>{const x=newRun('BUTTON-CACHE');x.screenMode='cache';x.madness=20;assert.equal(resolveCache(x,'listen').ok,true);assert.equal(x.echoes,10);assert.equal(x.madness,8);assert.equal(continueFromNode(x).ok,true);assert.equal(x.screenMode,'battle');});
await t('CONTINUAR NODO',()=>{const x=newRun('BUTTON-CONT');const e=x.encounter;const r=continueFromNode(x);assert.equal(r.ok,true);assert.equal(x.encounter,e+1);});
await t('USAR RITUAL',()=>{const x=newRun('BUTTON-RITUAL');x.madness=40;x.rituals.push({id:'salt-circle',name:'CÍRCULO DE SAL'});const r=useRitual(x,'salt-circle');assert.equal(r.ok,true);assert.equal(x.rituals.length,0);assert.ok(x.madness<40);});
await t('CÓDICE tiene listener de toggle',()=>assert.match(app,/codexBtn\.addEventListener\('click'/));
await t('AUDIO cambia setting incluso sin AudioContext',()=>{const mem={getItem:()=>null,setItem:()=>{}};const e=createAudioEngine({storage:mem,AudioContextImpl:null});return e.setAudio(true).then(v=>assert.equal(v,true));});
await t('CRT FX tiene listener y estado persistible',()=>{assert.match(app,/fxBtn\.addEventListener\('click'/);assert.match(app,/audio\.setFx/);});
await t('INSTALAR PWA es condicional a beforeinstallprompt',()=>{assert.match(app,/beforeinstallprompt/);assert.match(app,/installPrompt\.prompt/);});
await t('ACTUALIZAR PWA ofrece acción y recarga tras cambio de controlador',()=>{assert.match(app,/updateAppBtn\.addEventListener\('click'/);assert.match(app,/postMessage\(\{type:'SKIP_WAITING'\}\)/);assert.match(app,/controllerchange/);});
await t('botones dinámicos usan data-action + delegación',()=>{assert.match(render,/dataset\.action=action/);assert.match(app,/closest\('button\[data-action\]'\)/);});

console.log(`BUTTON/ACTION TESTS: ${n} PASS`);
