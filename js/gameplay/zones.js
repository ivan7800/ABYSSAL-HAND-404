export const ZONES = [
  {id:'drowned-port',name:'PUERTO AHOGADO',subtitle:'Las campanas suenan bajo el agua.',boss:{id:'blind-astronomer',name:'EL ASTRÓNOMO CIEGO',rule:'Las manos de menos de 4 cartas pierden 1 Resonancia.'}},
  {id:'sunken-library',name:'BIBLIOTECA SUMERGIDA',subtitle:'Los libros recuerdan a quien los abre.',boss:{id:'abyssal-mother',name:'LA MADRE ABISAL',rule:'Descartar corrompe una de las cartas arrojadas.'}},
  {id:'moonless-forest',name:'BOSQUE SIN LUNA',subtitle:'Las raíces crecen hacia las estrellas.',boss:{id:'faceless-king',name:'EL REY SIN ROSTRO',rule:'Después de cada mano los palos jugados rotan.'}},
  {id:'black-observatory',name:'OBSERVATORIO NEGRO',subtitle:'Aquí el cielo mira hacia abajo.',boss:{id:'devourer',name:'EL DEVORADOR',rule:'Cada mano jugada devora una carta del descarte.'}},
  {id:'impossible-city',name:'CIUDAD IMPOSIBLE',subtitle:'Las calles se cruzan consigo mismas.',boss:{id:'sleeper',name:'EL DURMIENTE',rule:'La Locura no puede disminuir durante el combate.'}},
  {id:'ash-sea',name:'MAR DE CENIZA',subtitle:'Cada ola trae un nombre olvidado.',boss:{id:'mirror-saint',name:'EL SANTO DEL ESPEJO',rule:'Parejas y dobles parejas pierden 1 Resonancia.'}},
  {id:'abyssal-temple',name:'TEMPLO ABISAL',subtitle:'Las plegarias responden desde abajo.',boss:{id:'black-choir',name:'EL CORO NEGRO',rule:'Cada carta impar jugada añade +1 Locura.'}},
  {id:'beyond-gate',name:'MÁS ALLÁ DE LA PUERTA',subtitle:'No queda cielo al que regresar.',boss:{id:'the-gate',name:'LA PUERTA QUE RESPIRA',rule:'La Locura generada por la mano se duplica.'}}
];

export const LEGACY_BATTLES_PER_ZONE = 3;
export const BATTLES_PER_ZONE = 4;
export const FINAL_ENCOUNTER = ZONES.length * BATTLES_PER_ZONE;
export const LEGACY_FINAL_ENCOUNTER = ZONES.length * LEGACY_BATTLES_PER_ZONE;

export function battlesPerZoneFor(campaignVersion=2){return campaignVersion<2?LEGACY_BATTLES_PER_ZONE:BATTLES_PER_ZONE;}
export function finalEncounterForVersion(campaignVersion=2){return ZONES.length*battlesPerZoneFor(campaignVersion);}
export function zoneForEncounter(encounter,campaignVersion=2){
  const battles=battlesPerZoneFor(campaignVersion);
  const zoneIndex=Math.min(ZONES.length-1,Math.floor((Math.max(1,encounter)-1)/battles));
  const battleInZone=((Math.max(1,encounter)-1)%battles)+1;
  const zone=ZONES[zoneIndex];
  return {...zone,zoneIndex,battleInZone,isElite:battleInZone===2,isBoss:battleInZone===battles,boss:battleInZone===battles?zone.boss:null};
}

export function battleLabel(encounter,campaignVersion=2){
  const z=zoneForEncounter(encounter,campaignVersion);
  if(z.isBoss)return `BOSS · ${z.boss.name}`;
  if(z.isElite)return 'ÉLITE';
  return 'ENCUENTRO';
}
