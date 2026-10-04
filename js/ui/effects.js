const timers=new WeakMap();
export function pulseEffect(name,{body=globalThis.document?.body,duration=260,enabled=true}={}){
  if(!body||!enabled)return false;
  const cls=`fx-${name}`;body.classList.remove(cls);void body.offsetWidth;body.classList.add(cls);
  const old=timers.get(body);if(old){clearTimeout(old.timer);body.classList.remove(old.cls);}
  const timer=setTimeout(()=>body.classList.remove(cls),duration);timers.set(body,{timer,cls});return true;
}
export function setFxMode(enabled,{body=globalThis.document?.body}={}){if(!body)return;body.dataset.fx=enabled?'on':'off';}
