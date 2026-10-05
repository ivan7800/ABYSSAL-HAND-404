# QA — ABYSSAL HAND 404 1.0.1

## 1.0.1 — verificación de sinergias

- `npm run build` correcto; bundle clásico regenerado.
- `npm test` correcto; incluye cobertura nueva de Lente de Nácar, Anzuelo de Marfil y activación/restablecimiento de Hilo Negro.
- Campaña determinista completa de 32 encuentros y ocho jefes pasa.
- La revisión manual exhaustiva en Safari/iPhone sigue pendiente.

## 1.0.0 — lanzamiento

- Compilación local y suite `npm test` pasan antes de publicar.
- Recorrido determinista simulado: 32 encuentros, ocho jefes y cinco decisiones de nodo más combate.
- 24 SVG de escena válidos; eventos y rutas comprobados en la suite automatizada.
- La prueba interactiva de navegador no se pudo ejecutar: el entorno bloquea el servidor local con `listen EPERM`.
- Safari/iPhone, instalación PWA nativa y recorrido manual completo siguen sin validación.

## rc.12 — relatos y sendas

- Ocho presagios ilustrados adicionales; dos relatos distintos están disponibles en cada sector.
- Cuatro rutas en cada cruce, con opciones distintas según el sector y el encuentro; el combate y el refugio siguen disponibles.
- Nueva ruta de Ecos con elección entre más recompensa con riesgo o menos Ecos con alivio de Locura.
- Saves existentes conservan eventos y decisiones pendientes; se añadió prueba para guardar/restaurar una ruta de Ecos.
- `npm test`: PASS (incluye cinco tipos de decisión, restauración de una senda de Ecos y campaña completa). `npm run build`: PASS (21 módulos).
- Falta jugar la campaña manualmente en un teléfono/navegador real.

## rc.11 — ritmo y jugabilidad

- La curva anterior pedía 5636 Ecos en el jefe final; en una muestra de 40 partidas reforzadas con pacto y una mano extra, ninguna superó ese objetivo.
- La curva nueva pide 992 en el jefe final. Una ruta determinista con manos y decisiones normales completó los 32 encuentros y venció a los ocho jefes.
- En 100 simulaciones con estrategia simple y aleatoriedad repetible, 18 llegaron a la victoria. Es una señal de viabilidad, no una tasa de victoria humana.
- La migración de saves recalcula objetivos de la campaña extendida anterior y conserva objetivos de la campaña de 24 encuentros.
- `npm test`: PASS (incluye recorrido completo y migración de saves). `npm run build`: PASS (21 módulos).
- Falta un recorrido manual completo y prueba en Safari/iPhone; la ejecución local de Playwright no pudo abrir su servidor en este entorno.

## rc.10 — escenas de presagio

- Ocho eventos nuevos tienen ocho SVG diferentes; recompensa y rutas usan escenas distintas.
- El evento de la campaña antigua conserva el arte clásico.
- Los nuevos SVG se validan como XML, están integrados en el render y figuran en el precache offline.
- `npm test`: PASS; `npm run build`: PASS (21 módulos). Los 16 SVG de escena se analizaron como XML válido.
- El recorrido visual completo y el equilibrio de los 32 encuentros siguen pendientes de juego manual.

## rc.9 — campaña expandida

- La versión nueva usa 32 encuentros; el guardado versionado conserva el esquema de 24 encuentros para partidas anteriores.
- Las rutas presentan cuatro elecciones; ocho eventos aplican recompensas/costes; el refugio valida descanso, purificación y trato.
- Las reliquias Corazón de Coral, Brújula de Tinta y Sello del Despertar modifican manos, descartes y recuperación.
- `npm test`: PASS (suite completa de lógica, guardado, UX estática, arte y regresiones).
- `npm run build`: PASS (21 módulos empaquetados).
- Pendiente: Playwright visual de esta revisión y recorrido manual de los 32 encuentros para validar balance y ritmo.

## rc.8 — actualización PWA

- El botón **ACTUALIZAR** solo se muestra cuando `registration.waiting` existe.
- Su acción manda `SKIP_WAITING`; el cambio de controlador recarga la página.
- Si el Service Worker se activa solo, el cambio de controlador también recarga.
- `npm run build`: PASS, bundle de 21 módulos.
- `npm test`: PASS; 36 comprobaciones de botones/acciones, experiencia, arte y caché PWA incluidas.
- Validación visual directa de rc.7 en GitHub Pages: guía abierta en primera visita, mesa y fondo cargados, sin errores de la app visibles en consola.
- La prueba Playwright completa de campaña y la interacción del botón de actualización en navegador quedan pendientes; no se marca como certificada.

## rc.7 — cambios y verificaciones de esta entrega

- Ocho IDs de jefe apuntan a ocho SVG diferentes; seis pantallas narrativas tienen ilustraciones dedicadas.
- El conjunto de SVG se valida como XML correcto y queda por debajo de 30 KB.
- La guía rápida se abre en la primera visita y permite continuar sin `localStorage`.
- Victoria y derrota presentan una pantalla final y una acción para crear otra expedición.
- Los 14 SVG se incluyen en el precache PWA y se genera un bundle actualizado.
- Se ejecutan `npm run build`, `npm test` y comprobaciones estáticas/XML de recursos.
- No se pudo ejecutar Playwright en Chromium en este entorno (falta el ejecutable); no se declara un recorrido manual completo ni certificación de móvil/Safari.
- La actualización de `main` se verificará por API. GitHub Pages puede tardar en reflejarla; solo se dará por publicada la página cuando se compruebe su URL.

## Límites conocidos

- No se certificó una campaña completa desde la primera mano hasta la victoria, ni se evaluó el equilibrio mediante varias partidas largas.
- El acabado visual en navegador y la instalación PWA siguen pendientes de validación en equipos reales.
- Las comprobaciones históricas de Chromium en rc.5 no se presentan como pruebas de esta RC.

## Cambios de esta revisión

- Se añadió una guía rápida desplegable en la pantalla principal con selección de cartas, diferencia entre jugar y descartar, derrota por falta de manos/locura y valores base de las combinaciones.
- Se conserva cerrada al inicio; usa `<details>/<summary>` nativos, texto semántico, foco visible y rejilla responsive.
- Se versionaron URLs de CSS/JS y caché PWA a rc.6 para evitar que el despliegue reciba estilos antiguos.

## Publicación rc.6

- Código subido a `main` en el commit `bcab0f1d6a9e43aa384260a8e2bde8074a169109`.
- GitHub API confirma `index.html` con la guía y los recursos `rc.6` y `sw.js` con caché nueva. La URL pública no se pudo comprobar con la herramienta web durante esta sesión.

## Verificación rc.6

- `npm run build`: PASS; generó el bundle desde 21 módulos locales.
- `npm test`: PASS; 14 comprobaciones de endurecimiento y guía, 34 comprobaciones de botones/acciones, suites de puntuación, progresión, guardado, PWA, arte y regresiones.
- Publicación rc.5: se probaron en Chrome selección, habilitación de JUGAR, jugar una carta (puntos 0→15, manos 4→3), descarte (5→4) y apertura de Códice.
- La automatización Playwright de esta rc.6 no pudo ejecutarse en el entorno de build: el servidor local solo arrancó con permiso ampliado y después faltó el ejecutable Chromium de Playwright. No se declara como prueba superada.
- No se probó la guía rc.6 en un navegador real desde esta build; su contenido y estructura se verifican mediante test de regresión y análisis estático.

# QA — ABYSSAL HAND 404 rc.5

Navegador: Chromium 131.0.6778.204. Ejecución: 2026-10-04T21:54:42.427Z.

## Resultado

- 30 comprobaciones de navegador PASS; clics reales mediante Playwright.
- Suite Node `npm test`: PASS; salida completa en `evidence/unit-tests.txt`.
- Actualización rc.4→rc.5 con un Service Worker previo: PASS para carga del código nuevo y nueva expedición.
- Cero errores de consola y recursos en los recorridos de la versión reparada.

## Causas y correcciones

| Fallo | Evidencia / efecto | Corrección |
|---|---|---|
| Doble clic no funciona | Chromium bloquea app.js ES Module por CORS bajo file://; cero cartas | Bundle clásico local, sin importaciones de red |
| Nueva expedición parece inactiva | Misma semilla y mano antes/después en rc.4 | Semilla aleatoria por defecto, repetir explícito, reinicio inmediato |
| Reinicio dependía del almacenamiento | await clearRun antes de render; transacción sin timeout | Se elimina esa espera, escrituras ordenadas y timeout/abort |
| Guardado de Rey Sin Rostro | Transformaba suit sin cambiar identidad; serialización rechazaba ID | Identidad física estable independiente del palo actual |
| Ritual equivocado | Handler tomaba rituals[0] para cualquier botón | Identificador propio en cada botón |
| Fondos con 404 | URL CSS relativa a hoja de estilos | Resolver recurso con base del documento |
| Restauración pisa interacción | Boot asíncrono sin comprobación de cambios | Revisión de estado antes de restaurar |
| Reliquia duplicada | Compra volvía a descontar moneda | Rechazo sin coste |
| hidden y animaciones | Reglas flex podían mostrar elementos ocultos; efectos persistían | hidden explícito y limpieza de clase previa |

Reproducción de rc.4: `evidence/before-fix.txt`. No se presupone cómo abrió la app el usuario: se reprodujeron tanto file:// como HTTP.

## Resultado por acción

| Comprobación | Resultado |
|---|---|
| HTTP subruta: arranque con 8 cartas | PASS |
| Nueva expedición: cambia semilla y mano | PASS |
| Semilla escrita y repetir semilla | PASS |
| Seleccionar/deseleccionar carta por ratón | PASS |
| Teclado Space/Enter conserva foco en carta | PASS |
| Jugar mano: puntos y contador | PASS |
| Descartar: contador y reposición | PASS |
| Códice abre y cierra visualmente | PASS |
| Audio ON/OFF | PASS |
| CRT ON/OFF | PASS |
| Exportar: descarga real JSON | PASS |
| Importar: selector real y restauración | PASS |
| Continuar autosave + recarga | PASS |
| Importación inválida preserva partida | PASS |
| Recompensa y ruta de combate | PASS |
| Ruta mercado, comprar, duplicado, salir | PASS |
| Aceptar pacto | PASS |
| Rechazar pacto y continuar | PASS |
| Evento open | PASS |
| Evento ignore | PASS |
| Cada botón de ritual consume el correcto | PASS |
| Rey Sin Rostro: jugar, guardar y recuperar | PASS |
| 8 fondos decodifican + retratos de jefes | PASS |
| Victoria y nueva expedición | PASS |
| Offline: recarga y jugar con SW real | PASS |
| Móvil 390px: botones, cartas y sin desborde | PASS |
| file://: nueva, jugar, descartar y códice | PASS |
| IDB bloqueado: clic temprano no se pierde al acabar boot | PASS |
| Storage denegado: controles operativos | PASS |
| Consola y recursos: cero errores | PASS |

## Método y límites

- Las pruebas de nodos avanzados importan partidas de prueba por el importador real y después pulsan los botones. No constituyen una campaña completa jugada desde cero.
- El test móvil configura y comprueba un viewport real de 390 px en Chromium; no es un iPhone físico.
- Offline usa un Service Worker real y una URL con query no precargada; el fallback solo consulta la caché rc.5.
- La prueba de actualización confirma nueva interfaz y semilla. Una petición antigua en vuelo puede recrear un nombre de caché rc.4; rc.5 no lo consulta como fallback.
- El botón Instalar depende de beforeinstallprompt. No se ha certificado el diálogo nativo de instalación ni Safari/iOS.
- Arte: 13 archivos (incluido un fondo de puerto antiguo conservado), 8 fondos activos distintos y retratos compartidos de arquetipos de jefe.
- No se ha publicado la app en la cuenta de GitHub del usuario.

## Capturas

- `evidence/desktop.png`
- `evidence/mobile.png`
