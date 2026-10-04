export const SHOP_ITEMS = [
  { id:'bone-die', type:'relic', name:'DADO DE HUESO', cost:12, text:'+12 Ecos al superar un encuentro.' },
  { id:'black-thread', type:'relic', name:'HILO NEGRO', cost:15, text:'La primera corrupción de cada encuentro cuesta 0 Locura.' },
  { id:'coral-heart', type:'relic', name:'CORAZÓN DE CORAL', cost:22, text:'+1 mano en cada encuentro.' },
  { id:'ink-compass', type:'relic', name:'BRÚJULA DE TINTA', cost:20, text:'+1 descarte en cada encuentro.' },
  { id:'waking-seal', type:'relic', name:'SELLO DEL DESPERTAR', cost:26, text:'Reduce 6 de Locura al vencer un élite o jefe.' },
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
  {id:'breathing-gate',name:'EL ALIENTO DE LA PUERTA',text:'La puerta exhala. Detrás de ti, el mundo inhala al mismo tiempo.',choices:[{id:'cross',label:'CRUZAR · +32 ECOS · +20 LOCURA',effect:{echoes:32,madness:20}},{id:'wait',label:'ESPERAR · +10 ECOS · −8 LOCURA',effect:{echoes:10,madness:-8}}]}
];
