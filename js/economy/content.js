export const SHOP_ITEMS = [
  { id:'bone-die', type:'relic', name:'DADO DE HUESO', cost:12, text:'+12 Ecos al superar un encuentro.' },
  { id:'black-thread', type:'relic', name:'HILO NEGRO', cost:15, text:'La primera corrupción de cada encuentro cuesta 0 Locura.' },
  { id:'coral-heart', type:'relic', name:'CORAZÓN DE CORAL', cost:22, text:'+1 mano en cada encuentro.' },
  { id:'ink-compass', type:'relic', name:'BRÚJULA DE TINTA', cost:20, text:'+1 descarte en cada encuentro.' },
  { id:'waking-seal', type:'relic', name:'SELLO DEL DESPERTAR', cost:26, text:'Reduce 6 de Locura al vencer un élite o jefe.' },
  { id:'pearl-lens', type:'relic', name:'LENTE DE NÁCAR', cost:22, text:'+18 base al formar Escalera o Color.' },
  { id:'ivory-hook', type:'relic', name:'ANZUELO DE MARFIL', cost:24, text:'Pareja o mejor: +1 Resonancia y +2 Locura.' },
  { id:'salt-circle', type:'ritual', name:'CÍRCULO DE SAL', cost:9, text:'Reduce 18 de Locura.' },
  { id:'red-key', type:'ritual', name:'LLAVE ROJA', cost:11, text:'Corrompe una carta dos niveles.' }
];

export const PACTS = [
  { id:'blood-pact', name:'PACTO DE SANGRE', text:'+1 Resonancia permanente · cada mano +2 Locura.' },
  { id:'void-pact', name:'PACTO DEL VACÍO', text:'+20% recompensa · comienzas cada encuentro con +8 Locura.' },
  { id:'root-pact', name:'PACTO DE LA RAÍZ', text:'+1 descarte · las cartas corruptas dan +2 Ecos extra.' }
];

export const EVENTS = [
  {id:'silent-bell',name:'LA CAMPANA MUDA',text:'Una campana sumergida vibra sin sonar. Algo bajo el agua responde a cada golpe.',choices:[{id:'hear',label:'ESCUCHAR · +14 ECOS · +12 LOCURA',effect:{echoes:14,madness:12,ritual:'salt-circle'}},{id:'silence',label:'SELLAR · +5 ECOS · −8 LOCURA',effect:{echoes:5,madness:-8}}]},
  {id:'living-book',name:'EL LIBRO VIVO',text:'Las páginas se cierran alrededor de una mano que no es la tuya.',choices:[{id:'read',label:'LEER · LLAVE ROJA · +10 LOCURA',effect:{echoes:8,madness:10,ritual:'red-key'}},{id:'burn',label:'QUEMAR · −12 LOCURA',effect:{madness:-12}}]},
  {id:'root-crown',name:'LA CORONA DE RAÍCES',text:'Bajo el árbol cuelga una corona que todavía conserva el calor de una cabeza.',choices:[{id:'wear',label:'PONÉRTELA · +24 ECOS · +14 LOCURA',effect:{echoes:24,madness:14}},{id:'bury',label:'ENTERRARLA · +8 ECOS · −10 LOCURA',effect:{echoes:8,madness:-10}}]},
  {id:'false-sun',name:'EL SOL FALSO',text:'El observatorio calcula un amanecer que sucederá dentro de un cadáver.',choices:[{id:'chart',label:'CALCULAR · CÍRCULO DE SAL · +8 LOCURA',effect:{echoes:12,madness:8,ritual:'salt-circle'}},{id:'blind',label:'APAGAR · +6 ECOS · −12 LOCURA',effect:{echoes:6,madness:-12}}]},
  {id:'folded-street',name:'LA CALLE PLEGADA',text:'La avenida regresa a su propio comienzo. En el centro, alguien ofrece un atajo.',choices:[{id:'shortcut',label:'ATAJO · +24 ECOS · +15 LOCURA',effect:{echoes:24,madness:15}},{id:'retrace',label:'VOLVER SOBRE TUS PASOS · −10 LOCURA',effect:{madness:-10}}]},
  {id:'bone-tide',name:'LA MAREA DE HUESOS',text:'La marea deposita costillas con los nombres de quienes aún respiran.',choices:[{id:'dive',label:'SUMERGIRTE · LLAVE ROJA · +12 LOCURA',effect:{echoes:14,madness:12,ritual:'red-key'}},{id:'shore',label:'QUEDARTE EN LA ORILLA · +5 ECOS · −8 LOCURA',effect:{echoes:5,madness:-8}}]},
  {id:'choir-well',name:'EL POZO DEL CORO',text:'Desde el pozo, muchas voces pronuncian una sola plegaria: la tuya.',choices:[{id:'answer',label:'RESPONDER · CÍRCULO DE SAL · +8 LOCURA',effect:{echoes:12,madness:8,ritual:'salt-circle'}},{id:'refuse',label:'CALLAR · −12 LOCURA',effect:{madness:-12}}]},
  {id:'breathing-gate',name:'EL ALIENTO DE LA PUERTA',text:'La puerta exhala. Detrás de ti, el mundo inhala al mismo tiempo.',choices:[{id:'cross',label:'CRUZAR · +32 ECOS · +20 LOCURA',effect:{echoes:32,madness:20}},{id:'wait',label:'ESPERAR · +10 ECOS · −8 LOCURA',effect:{echoes:10,madness:-8}}]},
  {id:'tide-accountant',name:'EL CONTABLE DE LA MAREA',text:'Una figura cuenta monedas que aún no han caído del barco. Cada cifra hace subir el agua.',choices:[{id:'pay',label:'PAGAR LA DEUDA · +28 ECOS · +12 LOCURA',effect:{echoes:28,madness:12}},{id:'erase',label:'ROMPER EL LIBRO · +6 ECOS · −10 LOCURA',effect:{echoes:6,madness:-10}}]},
  {id:'tooth-catalogue',name:'EL CATÁLOGO DE DIENTES',text:'En los estantes, cada diente lleva escrito el nombre de un libro que todavía no has leído.',choices:[{id:'borrow',label:'TOMAR PRESTADO · LLAVE ROJA · +12 LOCURA',effect:{echoes:10,madness:12,ritual:'red-key'}},{id:'return',label:'DEVOLVER UNO · +8 ECOS · −10 LOCURA',effect:{echoes:8,madness:-10}}]},
  {id:'hollow-stag',name:'EL CIERVO HUECO',text:'Un ciervo sin sombra bebe del charco. En su reflejo tiene demasiados ojos.',choices:[{id:'follow',label:'SEGUIRLO · +26 ECOS · +14 LOCURA',effect:{echoes:26,madness:14}},{id:'scatter',label:'AHUYENTARLO · CÍRCULO DE SAL · +8 LOCURA',effect:{echoes:8,madness:8,ritual:'salt-circle'}}]},
  {id:'star-eater',name:'EL DEVORADOR DE ESTRELLAS',text:'Una constelación se apaga punto por punto. Algo mastica detrás del vidrio.',choices:[{id:'calculate',label:'CALCULAR SU ÓRBITA · +30 ECOS · +16 LOCURA',effect:{echoes:30,madness:16}},{id:'shutter',label:'CERRAR LA CÚPULA · +10 ECOS · −8 LOCURA',effect:{echoes:10,madness:-8}}]},
  {id:'door-cab',name:'EL TAXI DE LAS PUERTAS',text:'Un taxi vacío espera en una calle que no estaba ahí hace un segundo. El taxímetro cuenta recuerdos.',choices:[{id:'ride',label:'SUBIR · +34 ECOS · +18 LOCURA',effect:{echoes:34,madness:18}},{id:'walk',label:'SEGUIR A PIE · +12 ECOS · −8 LOCURA',effect:{echoes:12,madness:-8}}]},
  {id:'ember-fisher',name:'EL PESCADOR DE BRASAS',text:'Desde la ceniza, alguien pesca luces con un anzuelo hecho de costilla.',choices:[{id:'take',label:'TOMAR LA BRASA · LLAVE ROJA · +12 LOCURA',effect:{echoes:16,madness:12,ritual:'red-key'}},{id:'cover',label:'APAGARLA · +7 ECOS · −10 LOCURA',effect:{echoes:7,madness:-10}}]},
  {id:'shell-pilgrim',name:'EL PEREGRINO DE CONCHAS',text:'Una concha camina sola por el templo. Desde dentro, una multitud pide refugio.',choices:[{id:'open',label:'ABRIRLA · CÍRCULO DE SAL · +10 LOCURA',effect:{echoes:18,madness:10,ritual:'salt-circle'}},{id:'leave',label:'DEJARLA EN PAZ · +9 ECOS · −12 LOCURA',effect:{echoes:9,madness:-12}}]},
  {id:'second-shadow',name:'LA SEGUNDA SOMBRA',text:'Tu sombra llega antes que tú y llama tres veces desde el otro lado de la puerta.',choices:[{id:'answer',label:'RESPONDER · +40 ECOS · +20 LOCURA',effect:{echoes:40,madness:20}},{id:'turn',label:'APARTAR LA MIRADA · +14 ECOS · −8 LOCURA',effect:{echoes:14,madness:-8}}]}
];
