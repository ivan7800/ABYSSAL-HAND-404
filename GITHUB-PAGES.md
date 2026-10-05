# GitHub Pages

1. Extrae el ZIP. Sube el contenido de `abyssal-hand-404/` a la raíz del repositorio, incluidos `js/app.bundle.js`, `assets/`, `css/`, `sw.js` y `manifest.webmanifest`.
2. Settings → Pages → Deploy from a branch → rama elegida → `/ (root)`.
3. Abre la URL del repositorio y comprueba `v1.0.1 · MEJORAS` en el pie.
4. Si ves otra versión, recarga con Ctrl+F5. No borres los datos del navegador sin exportar antes la partida.

Las rutas son relativas y la prueba automatizada sirve la app en `/test-subpath/`. La actualización rc.4→rc.5 (evidencia de la versión base) se probó con un Service Worker previo. La versión 1.0.1 versiona CSS, JS y caché PWA, añade presagios y rutas sectoriales, y permite aplicar actualizaciones pendientes desde **ACTUALIZAR**. Comprueba que Pages muestre `v1.0.1` cuando termine de publicar.

El HTML carga el bundle clásico. Se puede jugar también por doble clic; instalación/offline PWA requieren HTTPS/localhost. Cada publicación futura debe regenerar el bundle y actualizar caché y referencias de versión.
