import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const render=fs.readFileSync(new URL('../js/ui/render.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../css/core.css',import.meta.url),'utf8');
const files=[
 'assets/art/sectors/drowned-port-wide.png','assets/art/sectors/impossible-city.png','assets/art/sectors/ash-sea.png','assets/art/sectors/abyssal-temple.png','assets/art/sectors/beyond-gate.png',
 'assets/art/entities/abyss-eye.webp','assets/art/entities/drowned-oracle.webp','assets/art/entities/star-parasite.webp','assets/art/entities/void-saint.webp',
 'assets/art/sectors/drowned-port.webp','assets/art/sectors/sunken-library.webp','assets/art/sectors/moonless-forest.webp','assets/art/sectors/black-observatory.webp'
];
for(const file of files)assert.ok(fs.existsSync(new URL(`../${file}`,import.meta.url)),`missing art ${file}`);
assert.match(render,/--sector-image/);
assert.match(render,/boss-portrait/);
assert.match(css,/var\(--sector-image\)/);
console.log(`ART TESTS: ${files.length} assets + sector/boss integration PASS`);
