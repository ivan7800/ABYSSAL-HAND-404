# ABYSSAL HAND 404 — 1.0.0-rc.7 ABYSSAL ART PASS

Roguelike de cartas y horror cósmico. Frontend estático, sin servicios ni dependencias remotas durante el juego.

## Abrir y jugar

1. Extrae **todo** el ZIP en una carpeta nueva.
2. Abre `index.html` con doble clic. Esta versión funciona en `file://`.
3. Selecciona entre 1 y 5 cartas. Pulsa **JUGAR MANO** o **DESCARTAR**.
4. **NUEVA EXPEDICIÓN** empieza inmediatamente y genera una semilla diferente.
5. Para una partida reproducible, escribe una semilla antes de comenzar o pulsa **REPETIR SEMILLA**.

En la primera expedición, la guía se abre automáticamente. Al cerrarla, la elección se recuerda. Al ganar o perder aparece una pantalla final ilustrada con un botón para comenzar otra partida.

También puedes ejecutar `python server.py` o `INICIAR.bat` (Python necesario solo para ese servidor). Para instalar como PWA se necesita HTTPS o localhost. En modo local no hay instalación PWA; sí se puede jugar y exportar/importar.

El guardado depende de los permisos del navegador. Si el almacenamiento está bloqueado, se puede seguir jugando y exportar JSON. El mensaje de guardado muestra la situación real.

## Qué incluye rc.7

- Ocho retratos distintos, uno para cada jefe, y seis escenas ilustradas para rutas, mercado, altar, evento, victoria y derrota.
- Guía rápida visible al comienzo de la primera partida y recordada al cerrarla.
- Pantallas de victoria y derrota con salida clara para una nueva expedición.
- Arte SVG local, ligero y precargado por el Service Worker para funcionar sin conexión.

## Qué incluye rc.6

- Guía rápida desplegable dentro de la partida: reglas de selección, diferencia entre manos y descartes, condiciones de derrota y referencia de puntuación.
- La guía permanece cerrada al cargar para no reducir el espacio de juego; usa elementos HTML nativos y funciona con teclado/móvil.
- Nueva revisión de caché y rutas CSS para que GitHub Pages y la PWA recojan la guía al actualizar.

## Qué se reparó en rc.5

- Los módulos ES impedían el arranque desde `file://`: se entrega `js/app.bundle.js` clásico ya construido.
- Nueva expedición repetía las mismas cartas y esperaba al borrado de IndexedDB: ahora reinicia inmediatamente con una semilla nueva por defecto.
- La carga tardía del autosave podía pisar acciones recientes: protección por revisión y escritura ordenada.
- Timeouts y cancelaciones de transacciones IDB; acceso seguro a storage bloqueado.
- Cada ritual consume el objeto pulsado; antes todos usaban el primero.
- Las cartas transformadas por el Rey Sin Rostro se pueden guardar y restaurar.
- No se cobran reliquias duplicadas. Las capas ocultas respetan `hidden`.
- Rutas de fondos corregidas; foco de teclado conservado al seleccionar cartas.

## Arte

Cinco ilustraciones nuevas de 1536 × 1024: Puerto Ahogado panorámico, Ciudad Imposible, Mar de Ceniza, Templo Abisal y Más Allá de la Puerta. Los ocho sectores tienen fondos distintos. Los recursos se sirven localmente y están incluidos en el modo offline.

## Evidencia

`evidence/browser-results.json`: evidencia heredada de rc.5 con 30 comprobaciones ejecutadas mediante Playwright en Chromium 131.0.6778.204, con clics reales, descargas, selector de archivos, teclado, HTTP en subruta, file://, viewport móvil de 390 px, almacenamiento bloqueado y offline con Service Worker real. Cero errores de consola/recursos en esos recorridos.

`evidence/upgrade-results.json`: evidencia heredada de rc.5 para prueba adicional de actualización desde rc.4 con Service Worker existente. Capturas de escritorio y móvil incluidas. Detalle de causas y límites en `QA-REPORT.md`.

## Desarrollo

- `npm test`: lógica, persistencia y regresiones; requiere Node.js.
- `npm run build`: regenera el bundle con las fuentes locales. No necesita descargar paquetes.
- Para los tests de navegador: instala Playwright (`npm install --no-save playwright@1.62.1`), instala Chromium (`npx playwright install chromium`) y ejecuta `npm run test:browser`.
- `CHROMIUM_PATH` permite usar un ejecutable Chromium ya instalado. Las evidencias entregadas se obtuvieron con Chromium 131 y Playwright 1.62.1.

Al modificar `js/`, regenera siempre `js/app.bundle.js`. El empaquetador soporta los imports/exports con nombre utilizados por este proyecto y rechaza sintaxis no soportada.

## Publicar

Sube el **contenido de la carpeta** `abyssal-hand-404` a la raíz del repositorio. Activa GitHub Pages para la rama elegida y `/ (root)`. No publiques el ZIP como si fuera la página. Comprueba que el pie muestra `v1.0.0-rc.6 · QUICK GUIDE`.

## Alcance

Sigue siendo una RC: se ha verificado el funcionamiento descrito en Chromium, pero no se ha certificado Safari/iPhone ni el diálogo nativo de instalación PWA. La campaña completa y su equilibrio de dificultad no se han certificado mediante juego manual.
