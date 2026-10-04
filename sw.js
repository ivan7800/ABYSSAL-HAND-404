const CACHE='abyssal-hand-404-v1.0.0-rc.8-art-pwa-update';
const CORE=[
  './','./index.html','./css/core.css?v=1.0.0-rc.8','./css/core.css','./manifest.webmanifest',
  './js/app.bundle.js?v=1.0.0-rc.8','./js/app.bundle.js','./js/persistence/storage.js','./js/app.js','./js/systems.js','./js/cards/deck.js','./js/cards/poker.js',
  './js/core/game.js','./js/core/rng.js','./js/core/state.js','./js/economy/content.js',
  './js/gameplay/bosses.js','./js/gameplay/meta.js','./js/gameplay/progression.js','./js/gameplay/zones.js',
  './js/meta/codex.js','./js/persistence/meta-store.js','./js/persistence/run-store.js',
  './js/scoring/scoring.js','./js/ui/render.js','./js/ui/effects.js','./js/audio/audio.js','./js/pwa/pwa.js',
  './assets/icons/icon-192.png','./assets/icons/icon-512.png',
  './assets/art/entities/abyss-eye.webp','./assets/art/entities/drowned-oracle.webp','./assets/art/entities/star-parasite.webp','./assets/art/entities/void-saint.webp',
  './assets/art/sectors/drowned-port.webp','./assets/art/sectors/drowned-port-wide.png','./assets/art/sectors/sunken-library.webp','./assets/art/sectors/moonless-forest.webp','./assets/art/sectors/black-observatory.webp',
 './assets/art/sectors/impossible-city.png','./assets/art/sectors/ash-sea.png','./assets/art/sectors/abyssal-temple.png','./assets/art/sectors/beyond-gate.png',
 './assets/art/entities/blind-astronomer.svg','./assets/art/entities/abyssal-mother.svg','./assets/art/entities/faceless-king.svg','./assets/art/entities/devourer.svg','./assets/art/entities/sleeper.svg','./assets/art/entities/mirror-saint.svg','./assets/art/entities/black-choir.svg','./assets/art/entities/the-gate.svg',
 './assets/art/scenes/route-map.svg','./assets/art/scenes/drowned-market.svg','./assets/art/scenes/nameless-altar.svg','./assets/art/scenes/wall-less-door.svg','./assets/art/scenes/beyond-the-gate.svg','./assets/art/scenes/the-last-signal.svg'
];
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')void self.skipWaiting();});
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('abyssal-hand-404-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  // Network-first evita que JS/CSS antiguos dejen controles sin listener tras una actualización.
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
    return response;
  }).catch(async()=>{
    const hit=await (await caches.open(CACHE)).match(event.request);
    if(hit)return hit;
    if(event.request.mode==='navigate')return (await caches.open(CACHE)).match('./index.html');
    return Response.error();
  }));
});
