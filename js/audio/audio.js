import { safeStorage, safeIndexedDB } from '../persistence/storage.js';
const SETTINGS_KEY='abyssal-hand-404-av-v1';
export const AUDIO_SEQUENCE=[110,146.83,164.81,130.81,98,146.83,123.47,82.41];
export const SFX_PATTERNS={
  select:[523.25,659.25],
  play:[220,329.63,493.88],
  discard:[196,146.83],
  reward:[392,523.25,659.25],
  danger:[82.41,77.78,73.42],
  node:[261.63,329.63],
  ritual:[174.61,261.63,349.23],
  error:[110,92.5]
};
export function loadAvSettings(storage=safeStorage()){
  const defaults={audio:false,fx:true,volume:.32};
  try{const raw=JSON.parse(storage?.getItem(SETTINGS_KEY)||'null');return {...defaults,...(raw&&typeof raw==='object'?raw:{})};}catch{return defaults;}
}
export function saveAvSettings(settings,storage=safeStorage()){try{storage?.setItem(SETTINGS_KEY,JSON.stringify(settings));return true;}catch{return false;}}
export function clampVolume(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(1,n)):.32;}
export function createAudioEngine({storage=safeStorage(),AudioContextImpl=globalThis.AudioContext||globalThis.webkitAudioContext}={}){
  const settings=loadAvSettings(storage);let ctx=null;let musicTimer=null;let step=0;
  const ensure=async()=>{try{if(!AudioContextImpl)return null;if(!ctx)ctx=new AudioContextImpl();if(ctx.state==='suspended')await ctx.resume();return ctx;}catch{return null;}};
  const tone=async(freq,duration=.08,type='square',gain=.06,offset=0)=>{if(!settings.audio)return false;const ac=await ensure();if(!ac)return false;const osc=ac.createOscillator(),g=ac.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,ac.currentTime+offset);g.gain.setValueAtTime(0.0001,ac.currentTime+offset);g.gain.exponentialRampToValueAtTime(Math.max(.0001,gain*clampVolume(settings.volume)),ac.currentTime+offset+.006);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+offset+duration);osc.connect(g).connect(ac.destination);osc.start(ac.currentTime+offset);osc.stop(ac.currentTime+offset+duration+.015);return true;};
  const sfx=async name=>{const pattern=SFX_PATTERNS[name]||SFX_PATTERNS.select;for(let i=0;i<pattern.length;i++)void tone(pattern[i],.055,'square',.09,i*.045);return settings.audio;};
  const musicTick=()=>{if(!settings.audio)return;const root=AUDIO_SEQUENCE[step++%AUDIO_SEQUENCE.length];void tone(root,.18,'triangle',.045);if(step%2===0)void tone(root*2,.07,'square',.025,.09);};
  const startMusic=async()=>{if(!settings.audio)return false;const ac=await ensure();if(!ac)return false;if(musicTimer)return true;musicTick();musicTimer=setInterval(musicTick,430);return true;};
  const stopMusic=()=>{if(musicTimer){clearInterval(musicTimer);musicTimer=null;}};
  const setAudio=async enabled=>{settings.audio=Boolean(enabled);saveAvSettings(settings,storage);if(settings.audio)await startMusic();else stopMusic();return settings.audio;};
  const setFx=enabled=>{settings.fx=Boolean(enabled);saveAvSettings(settings,storage);return settings.fx;};
  const setVolume=v=>{settings.volume=clampVolume(v);saveAvSettings(settings,storage);return settings.volume;};
  return {settings,sfx,tone,startMusic,stopMusic,setAudio,setFx,setVolume,isAvailable:Boolean(AudioContextImpl)};
}
