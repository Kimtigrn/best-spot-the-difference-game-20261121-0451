// Odd Twin — the differences: where each one hides, in scene units.
// One job: the truth table the scene painter and the click tester share.
// Coordinates are in the 560 x 480 panel space; `r` is the hit radius.

/**
 * One difference: `id` is stable, `x`/`y`/`r` is the hotspot,
 * `label` is the friendly name shown when it is found.
 */
export const DIFFERENCES = [
  // Level 1 — Sunny Park
  [
    { id: 'bird', x: 432, y: 66, r: 26, label: 'The little bird' },
    { id: 'sunshades', x: 82, y: 72, r: 38, label: 'The sun’s shades' },
    { id: 'flower', x: 148, y: 402, r: 18, label: 'The purple flower' },
    { id: 'duck', x: 428, y: 408, r: 26, label: 'The duck’s direction' },
    { id: 'cloud', x: 302, y: 62, r: 34, label: 'The extra cloud' },
    { id: 'kite-tail', x: 482, y: 158, r: 24, label: 'The kite’s tail' },
    { id: 'apple', x: 122, y: 208, r: 22, label: 'The missing apple' },
  ],
  // Level 2 — Cozy Kitchen
  [
    { id: 'clock', x: 468, y: 72, r: 30, label: 'The clock hands' },
    { id: 'cat', x: 112, y: 378, r: 30, label: 'The sleeping cat' },
    { id: 'teapot-knob', x: 282, y: 248, r: 20, label: 'The teapot knob' },
    { id: 'orange', x: 402, y: 332, r: 24, label: 'The fourth orange' },
    { id: 'curtain', x: 92, y: 92, r: 30, label: 'The drawn curtain' },
    { id: 'cookie-jar', x: 482, y: 202, r: 22, label: 'The cookie jar' },
    { id: 'rug-stripe', x: 282, y: 442, r: 20, label: 'The rug stripe' },
  ],
  // Level 3 — Night Camp
  [
    { id: 'stars', x: 152, y: 62, r: 22, label: 'The third star' },
    { id: 'moon', x: 482, y: 72, r: 34, label: 'The crescent moon' },
    { id: 'flame', x: 282, y: 348, r: 26, label: 'The campfire flame' },
    { id: 'lantern', x: 422, y: 382, r: 22, label: 'The lantern light' },
    { id: 'bedroll', x: 122, y: 402, r: 24, label: 'The bedroll' },
    { id: 'pine', x: 62, y: 302, r: 26, label: 'The third pine' },
    { id: 'marshmallow', x: 352, y: 382, r: 20, label: 'The marshmallow' },
  ],
];

/** The differences of one level, by its index. */
export function differencesForLevel(levelIndex) {
  return DIFFERENCES[levelIndex];
}

/** Find a difference whose hotspot contains the point, or null. */
export function differenceAt(levelIndex, x, y) {
  const list = DIFFERENCES[levelIndex];
  for (let index = 0; index < list.length; index += 1) {
    const item = list[index];
    const dx = x - item.x;
    const dy = y - item.y;
    if (dx * dx + dy * dy <= (item.r + 8) * (item.r + 8)) return item;
  }
  return null;
}
