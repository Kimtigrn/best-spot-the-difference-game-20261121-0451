// Odd Twin — a tiny seeded random generator (mulberry32).
// One job: deterministic decoration (stars, petals, sparkles) from a seed,
// so the same seed always paints the same picture.

/** A small, fast seeded RNG. `seed` is any 32-bit integer. */
export function createRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** An integer in [min, max] from the generator. */
export function randomInt(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}
