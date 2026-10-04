export const PWA_CACHE='abyssal-hand-404-v1.0.0-rc.10-event-art';
export function supportsServiceWorker(nav=globalThis.navigator){return Boolean(nav&&'serviceWorker' in nav);}
export function isStandalone({matchMediaImpl=globalThis.matchMedia,navigatorObj=globalThis.navigator}={}){return Boolean(matchMediaImpl?.('(display-mode: standalone)')?.matches||navigatorObj?.standalone);}
export async function registerPwa({nav=globalThis.navigator,onUpdate=()=>{}}={}){
  if(globalThis.location?.protocol==='file:')return {ok:false,reason:'file'};
  if(!supportsServiceWorker(nav))return {ok:false,reason:'unsupported'};
  try{
    const reg=await nav.serviceWorker.register('./sw.js',{scope:'./'});
    if(reg.waiting)onUpdate(reg);
    reg.addEventListener?.('updatefound',()=>{const worker=reg.installing;worker?.addEventListener?.('statechange',()=>{if(worker.state==='installed'&&nav.serviceWorker.controller)onUpdate(reg);});});
    await Promise.race([nav.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('PWA aún no preparada')),8000))]);
    return {ok:true,registration:reg};
  }catch(error){return {ok:false,reason:error?.message||String(error)};}
}
