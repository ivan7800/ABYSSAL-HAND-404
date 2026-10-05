# Historial

## 1.0.0 — LANZAMIENTO

- Primera versión estable de la campaña de 32 encuentros, ocho jefes y 16 presagios ilustrados.
- Incluye la senda de Ecos, rutas variables por sector, guardado portable y caché PWA versionada.
- Mejora el tamaño mínimo de etiquetas, botones, estados y descripciones para facilitar la lectura.
- Las pruebas automatizadas y la simulación de campaña pasan; Safari/iOS y la campaña manual siguen pendientes de prueba.

## 1.0.0-rc.12 — RELATOS Y SENDAS

- Ocho presagios e ilustraciones nuevas; dos encuentros narrativos distintos por sector.
- Las rutas cambian en cada sector y en cada cruce, manteniendo el encuentro de combate como una opción clara.
- Precache PWA actualizado para cargar las escenas nuevas sin conexión.

## 1.0.0-rc.11 — RITMO DE CAMPAÑA

- La curva de objetivos de la campaña de 32 encuentros se hizo alcanzable mediante juego normal; el jefe final pasa de 5636 a 992 Ecos.
- Un recorrido determinista de la campaña llega a la victoria con los ocho jefes y las decisiones de tienda, pacto, evento y refugio.
- Saves rc.9/rc.10 migran su objetivo al restaurarse sin perder puntuación ni estado; saves de 24 encuentros conservan su curva anterior.
- Se regeneran bundle, referencias y caché PWA para distribuir el ajuste.

## 1.0.0-rc.10 — ESCENAS DE PRESAGIO

- Ocho relatos de la campaña expandida tienen ahora una ilustración distinta, integrada por ID de evento.
- La pantalla de recompensa recibe una escena propia; la puerta sin muro permanece para eventos de partidas antiguas.
- Los nueve SVG se precargan sin conexión; versión de CSS, JS y Service Worker actualizada.
- Integración de arte comprobada en tests y SVG validados como XML.

## 1.0.0-rc.9 — CAMPAÑA EXPANDIDA

- La campaña nueva pasa a 32 encuentros distribuidos en cuatro por sector; los saves anteriores mantienen campaña de 24.
- Cada cruce presenta cuatro opciones con contexto y descripción.
- Ocho eventos sectoriales ofrecen decisiones narrativas con consecuencias distintas.
- Se añade un refugio con descanso, purificación y un trato de riesgo.
- Tres reliquias amplían las decisiones de construcción en el mercado.
- Suite funcional completa y empaquetado actualizados; recorrido manual de equilibrio sigue pendiente.

## 1.0.0-rc.8 — PWA UPDATE ACTION

- La inspección de GitHub Pages reveló que el aviso de actualización no ofrecía una acción.
- Se añadió el botón **ACTUALIZAR** cuando el Service Worker nuevo está esperando; al pulsarlo, activa la versión y recarga cuando cambia el controlador.
- Si la versión nueva se activa automáticamente, la página se recarga para no dejar una UI antigua bajo una caché nueva.
- Se versionaron referencias de CSS/JS y caché PWA para rc.8; se probaron el build, la suite funcional y el enlace del botón.


## 1.0.0-rc.7 — ABYSSAL ART PASS

- Se añadieron retratos SVG únicos para los ocho jefes; el peso total es inferior a 30 KB.
- Mercado, altar, rutas, evento, victoria y derrota tienen una ilustración de escena propia, también precargada para jugar sin conexión.
- La guía se abre una vez en una expedición nueva y recuerda cuando se cierra; no bloquea el juego si el almacenamiento está desactivado.
- Se añadió una pantalla de derrota y acciones claras para volver a empezar tras victoria o derrota.
- Se actualizó el bundle, las rutas con versión y la caché PWA para rc.7.
- Añadidas pruebas de integración para arte único, escenas, guía, reinicio y caché offline.


## 1.0.0-rc.6 — QUICK GUIDE

- Added an expandable Spanish rules guide beside the play controls.
- Explained selection, hands versus discards, objective/Locura loss conditions, encounter routes, and hand scoring values.
- Kept the guide collapsed by default; keyboard accessible and responsive, with no new runtime dependencies.
- Bumped asset URLs and Service Worker cache to rc.6 to avoid stale CSS and HTML after GitHub Pages updates.

## 1.0.0-rc.5 — REPAIRED + ART

- Primera entrega de esta sesión con evidencia de clics reales en Chromium.
- Bundle clásico para file:// y subrutas; nueva expedición inmediata y aleatoria; repetir semilla explícito.
- Prevención de restauración tardía, escrituras ordenadas, timeout/abort de IDB y storage bloqueado.
- Ritual correcto por botón, foco conservado, guardado de cartas con palo transformado y prevención de compras duplicadas.
- Recursos gráficos con rutas resueltas desde el documento; reglas hidden y precarga/fallback offline.
- Cinco nuevas ilustraciones de sector. Ocho fondos distintos. Controles principales junto a la mesa.
- 30 recorridos/comprobaciones de navegador, pruebas unitarias y prueba adicional de actualización rc.4→rc.5.

## rc.2 a rc.4

Versiones anteriores de esta sesión: añadieron comprobaciones de código/lógica y ocho recursos de arte. **No demostraron clics reales de navegador** y mantuvieron los errores de arranque local y semilla repetida. Los anteriores conteos nominales no se usan como evidencia de esta entrega.
