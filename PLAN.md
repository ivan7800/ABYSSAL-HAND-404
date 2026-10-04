# Estado de entrega — 1.0.0-rc.10

## rc.10 — escenas específicas

- [x] Dar una imagen propia a cada uno de los ocho presagios.
- [x] Evitar la repetición del mapa en la recompensa.
- [x] Mantener la imagen y acciones de eventos en saves antiguos.
- [x] Precargar recursos en la PWA y comprobar correspondencia de escenas.
- [ ] Recorrer manualmente los 32 encuentros para afinar ritmo y dificultad.

## rc.9 — campaña larga y decisiones

- [x] Ampliar a 32 encuentros y respetar saves con el mapa antiguo de 24.
- [x] Ofrecer cuatro rutas por cruce, ocho eventos y tres acciones en refugios.
- [x] Ampliar tienda con reliquias y efectos conectados a las reglas.
- [x] Validar pruebas automatizadas y rebuild del bundle.
- [ ] Jugar campaña completa y ajustar dificultad según duración real.
- [ ] Probar Safari/iPhone e instalación PWA nativa.

## rc.8 — arte y ciclo de actualización PWA

- Conserva el arte y los finales claros añadidos en rc.7.
- Añade una acción para activar una versión PWA pendiente y recargar de forma controlada.
- Revalida el botón y los recursos cacheados.

## rc.7 — pase visual y finales

- Ocho retratos de jefe sin reutilización y seis escenas de nodo y finales.
- Guía de primer uso de una sola vez, con persistencia segura si el almacenamiento está permitido.
- Acciones de nueva expedición disponibles al terminar en victoria o derrota.
- Pruebas de integración para unicidad, rutas, guía, reinicio y caché offline.
- Pendiente tras subir: probar la web publicada en navegador y recorrer una campaña completa antes de certificar el equilibrio.

## rc.6 — guía rápida integrada

- [x] Añadir reglas desplegables y tabla de puntuación.
- [x] Versionar CSS, JS y caché de Service Worker para GitHub Pages/PWA.
- [x] Pasar suite funcional y añadir comprobación de la guía.
- [ ] Repetir batería de navegador Chromium cuando exista un ejecutable local disponible.
- [ ] Certificar la campaña completa y probar Safari/iPhone e instalación PWA nativa.


## Completado
- [x] Reproducir rc.4 en Chromium: file:// bloquea módulos; nueva expedición repite semilla; fondos dan 404.
- [x] Corregir arranque portable, nueva partida, persistencia, rituales y guardado tras cambio de palo.
- [x] Crear e integrar cinco ilustraciones, con ocho fondos de sector distintos.
- [x] Ejecutar 30 comprobaciones de navegador con interacción real.
- [x] Verificar actualización desde rc.4 con SW existente.
- [x] Inspeccionar capturas de escritorio y móvil de 390 px.
- [x] Incluir pruebas, capturas y documentación de resultados.

## Límites pendientes
- [ ] Safari/iOS y dispositivos físicos.
- [ ] Instalación mediante diálogo nativo del sistema operativo.
- [ ] Recorrido manual completo de campaña para validar equilibrio.

Estado: RC reparada con evidencia de navegador. No se declara perfección ni certificación universal.
