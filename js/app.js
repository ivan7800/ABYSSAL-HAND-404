import { newRun, preview, toggleCard, playSelection, discardSelection, claimReward, chooseRoute } from './core/game.js';
import { buyItem, acceptPact, resolveEvent, continueFromNode, useRitual } from './gameplay/meta.js';
import { render, setMessage, renderMetaPanel } from './ui/render.js';
import { createSeed, normalizeSeed } from './core/rng.js';
import { loadMeta, saveMeta, commitRun, addUnlock } from './persistence/meta-store.js';
import { saveRun, loadRun, exportSave, importSaveText } from './persistence/run-store.js';
import { zoneForEncounter } from './gameplay/zones.js';
import { createAudioEngine } from './audio/audio.js';
import { pulseEffect, setFxMode } from './ui/effects.js';
import { registerPwa, isStandalone } from './pwa/pwa.js';

let meta=loadMeta();
let state=newRun(meta.lastSeed||createSeed());
const audio=createAudioEngine();
let installPrompt=null;
let revision=0;
let saveQueue=Promise.resolve();
const playBtn=document.querySelector('#playBtn'),discardBtn=document.querySelector('#discardBtn'),newRunBtn=document.querySelector('#newRunBtn'),continueRunBtn=document.querySelector('#continueRunBtn'),exportSaveBtn=document.querySelector('#exportSaveBtn'),importSaveBtn=document.querySelector('#importSaveBtn'),importSaveInput=document.querySelector('#importSaveInput'),saveStatus=document.querySelector('#saveStatus'),nodePanel=document.querySelector('#nodePanel'),powers=document.querySelector('#powers'),seedInput=document.querySelector('#seedInput'),metaPanel=document.querySelector('#metaPanel'),codexBtn=document.querySelector('#codexBtn'),audioBtn=document.querySelector('#audioBtn'),fxBtn=document.querySelector('#fxBtn'),installBtn=document.querySelector('#installBtn'),updateAppBtn=document.querySelector('#updateAppBtn'),pwaStatus=document.querySelector('#pwaStatus');
let updateRegistration=null,updateReloadRequested=false;
const hadServiceWorkerController=Boolean(navigator.serviceWorker?.controller);
navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(hadServiceWorkerController||updateReloadRequested)location.reload();});
const quickGuide=document.querySelector('.quick-guide');
let guideSeen=false;
try{guideSeen=localStorage.getItem('abyssal-quick-guide-seen-rc7')==='1';}catch{/* A blocked store should not hide first-run help. */}
if(quickGuide&&!guideSeen)quickGuide.open=true;
quickGuide?.addEventListener('toggle',()=>{if(!quickGuide.open){try{localStorage.setItem('abyssal-quick-guide-seen-rc7','1');}catch{/* Closing the guide must never block play. */}}});
seedInput.value='';

function unlockFromState(){for(const p of state.pacts)addUnlock(meta,`pact:${p.id}`);const zone=zoneForEncounter(state.encounter);if(state.screenMode==='reward'&&zone.isBoss)addUnlock(meta,`boss:${zone.boss.id}`);}
function setSaveStatus(text,kind='ok'){if(!saveStatus)return;saveStatus.textContent=text;saveStatus.dataset.state=kind;}
function persistRun(){
  const snapshot=JSON.parse(exportSave(state,meta)).run.state;
  const requestedRevision=revision;
  saveQueue=saveQueue.catch(()=>{}).then(()=>saveRun(snapshot)).then(result=>{
    if(requestedRevision!==revision)return result;
    if(result.ok)setSaveStatus(`GUARDADO · ${new Date(result.savedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`);
    else setSaveStatus('SIN GUARDADO · puedes exportar la partida','error');
    return result;
  }).catch(error=>{setSaveStatus('SIN GUARDADO · puedes exportar la partida','error');return {ok:false,error:error.message};});
  return saveQueue;
}
function maybeCommit(){if(state.metaCommitted)return; if(state.status==='won'||state.status==='lost'){unlockFromState();const fragments=commitRun(meta,state,{won:state.status==='won'});state.metaCommitted=true;saveMeta(meta);setMessage(`${state.status==='won'?'EXPEDICIÓN COMPLETA':'EXPEDICIÓN CERRADA'} · +${fragments} Fragmentos. Seed ${state.seed}`);}}
function refresh({autosave=true}={}){unlockFromState();maybeCommit();saveMeta(meta);render(state,preview(state),onToggle);renderMetaPanel(meta,state);if(autosave)void persistRun();}
function applyResult(result,{sound='node',fx='transition'}={}){revision++;if(result?.message)setMessage(result.message);if(result?.ok){void audio.sfx(sound);pulseEffect(fx,{enabled:audio.settings.fx});}else if(result?.ok===false){void audio.sfx('error');}refresh();}
function onToggle(id){applyResult(toggleCard(state,id),{sound:'select',fx:'select'});document.querySelector(`[data-card-id="${id}"]`)?.focus({preventScroll:true});}

playBtn.addEventListener('click',()=>applyResult(playSelection(state),{sound:zoneForEncounter(state.encounter).isBoss?'danger':'play',fx:zoneForEncounter(state.encounter).isBoss?'danger':'score'}));
discardBtn.addEventListener('click',()=>applyResult(discardSelection(state),{sound:'discard',fx:'discard'}));
function startNewExpedition(){
  revision++;
  const chosen=seedInput.value.trim();
  state=newRun(chosen?normalizeSeed(chosen):createSeed());
  seedInput.value='';
  setMessage(`NUEVA EXPEDICIÓN · ${state.seed}. Selecciona entre 1 y 5 cartas.`);
  refresh();
  void audio.sfx('node');
}
newRunBtn.addEventListener('click',startNewExpedition);
document.querySelector('#repeatSeedBtn').addEventListener('click',()=>{seedInput.value=state.seed;startNewExpedition();});
continueRunBtn.addEventListener('click',async()=>{
  const ticket=++revision;setMessage('Recuperando expedición…');
  await saveQueue;const result=await loadRun();if(ticket!==revision)return;
  if(!result.ok){setMessage(`No se pudo recuperar: ${result.error}`);return;}
  if(!result.state){setMessage('Todavía no hay una expedición guardada.');return;}
  state=result.state;seedInput.value='';
  setMessage(`Expedición recuperada · encuentro ${state.encounter} · ${state.seed}.`);refresh({autosave:false});
});
seedInput.addEventListener('change',()=>{if(seedInput.value.trim())seedInput.value=normalizeSeed(seedInput.value);});
codexBtn.addEventListener('click',()=>{metaPanel.hidden=!metaPanel.hidden;codexBtn.setAttribute('aria-expanded',String(!metaPanel.hidden));});
audioBtn.addEventListener('click',async()=>{const enabled=await audio.setAudio(!audio.settings.audio);audioBtn.textContent=`AUDIO: ${enabled?'ON':'OFF'}`;audioBtn.setAttribute('aria-pressed',String(enabled));if(enabled)void audio.sfx('reward');});
fxBtn.addEventListener('click',()=>{const enabled=audio.setFx(!audio.settings.fx);setFxMode(enabled);fxBtn.textContent=`CRT FX: ${enabled?'ON':'OFF'}`;fxBtn.setAttribute('aria-pressed',String(enabled));pulseEffect('transition',{enabled});});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installBtn.hidden=false;pwaStatus.textContent='PWA: LISTA PARA INSTALAR';});
installBtn.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();const choice=await installPrompt.userChoice;installPrompt=null;installBtn.hidden=true;pwaStatus.textContent=choice.outcome==='accepted'?'PWA: INSTALACIÓN ACEPTADA':'PWA: INSTALACIÓN CANCELADA';});
updateAppBtn.addEventListener('click',()=>{if(updateRegistration?.waiting){updateReloadRequested=true;pwaStatus.textContent='PWA: ACTUALIZANDO';updateRegistration.waiting.postMessage({type:'SKIP_WAITING'});}else location.reload();});
window.addEventListener('appinstalled',()=>{installBtn.hidden=true;pwaStatus.textContent='PWA: INSTALADA';});
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.stopMusic();else if(audio.settings.audio)void audio.startMusic();});
exportSaveBtn.addEventListener('click',()=>{const text=exportSave(state,meta);const blob=new Blob([text],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ABYSSAL-HAND-404_${state.seed}_E${state.encounter}.json`;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);setMessage('Save exportado. Incluye expedición y metaprogresión.');});
importSaveBtn.addEventListener('click',()=>importSaveInput.click());
importSaveInput.addEventListener('change',async()=>{const file=importSaveInput.files?.[0];importSaveInput.value='';if(!file)return;if(file.size>2_000_000){setMessage('Importación rechazada: el save supera 2 MB.');return;}try{const text=await file.text();const imported=importSaveText(text);revision++;state=imported.state;if(imported.meta){saveMeta(imported.meta);meta=loadMeta();}seedInput.value='';void persistRun();setMessage(`Save importado · encuentro ${state.encounter} · seed ${state.seed}.`);refresh({autosave:false});}catch(error){setSaveStatus('IMPORT: ERROR','error');setMessage(`No se pudo importar: ${error.message}`);}});
nodePanel.addEventListener('click',event=>{const b=event.target.closest('button[data-action]');if(!b)return;const a=b.dataset.action,v=b.dataset.value;if(a==='claim')applyResult(claimReward(state),{sound:'reward',fx:'reward'});else if(a==='route')applyResult(chooseRoute(state,v),{sound:'node',fx:'transition'});else if(a==='buy')applyResult(buyItem(state,v),{sound:'reward',fx:'reward'});else if(a==='pact'){const r=acceptPact(state,v);if(r.ok){addUnlock(meta,`pact:${v}`);saveMeta(meta);continueFromNode(state);if(v==='void-pact')state.madness=Math.min(100,state.madness+8);}applyResult(r,{sound:'ritual',fx:'reward'});}else if(a==='event'){const r=resolveEvent(state,v);if(r.ok)continueFromNode(state);applyResult(r,{sound:'danger',fx:'danger'});}else if(a==='continue')applyResult(continueFromNode(state),{sound:'node',fx:'transition'});else if(a==='restart')startNewExpedition();});
powers.addEventListener('click',event=>{const chip=event.target.closest('.power-chip.ritual');if(!chip)return;const ritual=state.rituals.find(r=>r.id===chip.dataset.ritualId);if(ritual)applyResult(useRitual(state,ritual.id),{sound:'ritual',fx:'reward'});});

setFxMode(audio.settings.fx);audioBtn.textContent=`AUDIO: ${audio.settings.audio?'ON':'OFF'}`;audioBtn.setAttribute('aria-pressed',String(audio.settings.audio));fxBtn.textContent=`CRT FX: ${audio.settings.fx?'ON':'OFF'}`;fxBtn.setAttribute('aria-pressed',String(audio.settings.fx));if(audio.settings.audio)void audio.startMusic();

// Render inmediato: los controles quedan enlazados antes de tocar IndexedDB/PWA.
refresh({autosave:false});
setMessage(`Inicializando expedición · seed ${state.seed}…`);

async function boot(){
  const ticket=revision;const loaded=await loadRun();
  if(ticket!==revision){/* A user action supersedes automatic restore. */}
  else if(loaded.ok&&loaded.state){state=loaded.state;seedInput.value='';setMessage(`Autosave recuperado · encuentro ${state.encounter} · seed ${state.seed}.`);setSaveStatus(`AUTOSAVE RECUPERADO · ${loaded.backend==='indexedDB'?'IDB':'LOCAL'}`,'ok');refresh({autosave:false});}
  else if(!loaded.ok){setMessage(`Autosave dañado o inaccesible: ${loaded.error}. Se mantiene una expedición segura nueva.`);setSaveStatus('AUTOSAVE NO DISPONIBLE','error');refresh();}
  else{setMessage(`La expedición comienza · seed ${state.seed}.`);refresh();}

  const pwa=await registerPwa({onUpdate:reg=>{if(reg?.waiting){updateRegistration=reg;updateAppBtn.hidden=false;pwaStatus.textContent='PWA: ACTUALIZACIÓN LISTA';}else pwaStatus.textContent='PWA: ACTUALIZADA';}});
  pwaStatus.textContent=isStandalone()?'PWA: INSTALADA':pwa.ok?'PWA: OFFLINE READY':location.protocol==='file:'?'MODO LOCAL':'PWA: NO DISPONIBLE';
}
document.body.dataset.ready='true';
void boot().catch(error=>setSaveStatus('SIN GUARDADO · '+error.message,'error'));
