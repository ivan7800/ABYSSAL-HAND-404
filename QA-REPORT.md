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
