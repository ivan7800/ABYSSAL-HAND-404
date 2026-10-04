export const CODEX_ENTRIES = [
  {id:'entity-watching-eye',kind:'ENTIDAD',name:'El Ojo que no duerme',unlock:'start',text:'Ve cada combinación antes de que exista. Tres cartas Ojo aumentan la Resonancia.'},
  {id:'zone-port',kind:'LUGAR',name:'Puerto Ahogado',unlock:'start',text:'Las campanas suenan bajo el agua aunque ninguna torre permanezca en pie.'},
  {id:'boss-astronomer',kind:'ENTIDAD',name:'El Astrónomo Ciego',unlock:'boss:blind-astronomer',text:'Castiga manos demasiado pequeñas. Cuenta estrellas que nadie más puede ver.'},
  {id:'boss-mother',kind:'ENTIDAD',name:'La Madre Abisal',unlock:'boss:abyssal-mother',text:'Todo descarte vuelve tocado por algo que vive bajo la mesa.'},
  {id:'boss-king',kind:'ENTIDAD',name:'El Rey Sin Rostro',unlock:'boss:faceless-king',text:'Niega a los palos una identidad estable y los obliga a girar.'},
  {id:'boss-devourer',kind:'ENTIDAD',name:'El Devorador',unlock:'boss:devourer',text:'No gana puntos: reduce tu futuro carta a carta.'},
  {id:'boss-sleeper',kind:'ENTIDAD',name:'El Durmiente',unlock:'boss:sleeper',text:'Mientras sueña, la Locura no retrocede.'},
  {id:'boss-mirror',kind:'ENTIDAD',name:'El Santo del Espejo',unlock:'boss:mirror-saint',text:'Las parejas son reflejos imperfectos y pagan por existir.'},
  {id:'boss-choir',kind:'ENTIDAD',name:'El Coro Negro',unlock:'boss:black-choir',text:'Los números impares cantan. Cada voz añade Locura.'},
  {id:'boss-gate',kind:'ENTIDAD',name:'La Puerta que Respira',unlock:'boss:the-gate',text:'No conduce a otro lugar: conduce a otra regla.'},
  {id:'relic-salt',kind:'RELIQUIA',name:'Lámpara de sal',unlock:'start',text:'Una luz pobre, pero suficiente para encontrar un descarte adicional.'},
  {id:'pact-blood',kind:'PACTO',name:'Pacto de Sangre',unlock:'pact:blood-pact',text:'Más Resonancia a cambio de una deuda pagada con cordura.'},
  {id:'pact-void',kind:'PACTO',name:'Pacto del Vacío',unlock:'pact:void-pact',text:'El Vacío paga bien. También llega antes a cada encuentro.'},
  {id:'pact-root',kind:'PACTO',name:'Pacto de la Raíz',unlock:'pact:root-pact',text:'La corrupción arraiga y devuelve poder.'},
  {id:'ending-gate',kind:'SECRETO',name:'Tras la Puerta',unlock:'victory',text:'La expedición termina. La mesa, no.'}
];

export function unlockedCodex(meta){
  return CODEX_ENTRIES.map(entry=>({...entry,unlocked:entry.unlock==='start'||meta.unlocks.includes(entry.unlock)}));
}
