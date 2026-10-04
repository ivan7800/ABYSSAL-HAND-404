export function hashSeed(seed='ABYSS-404') {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeSeededRandom(seed='ABYSS-404') {
  let a = hashSeed(String(seed)) || 0x6d2b79f5;
  return function random() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalizeSeed(seed) {
  const clean = String(seed ?? '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
  return clean || createSeed();
}

export function createSeed(random=Math.random) {
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out='ABYSS-';
  for(let i=0;i<8;i++) out+=chars[Math.floor(random()*chars.length)];
  return out;
}
