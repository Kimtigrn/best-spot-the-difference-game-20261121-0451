// Odd Twin — the screenshot scenes behind ?shot=start|play|level2|win.
// One job: stage a fixed, honest frame of the real game for the screenshots.
// Each scene sets the state exactly as a player would have reached it, then
// the frame is painted twice and window.__shotReady is set for the camera.
// The timer is frozen in shot mode, so the frame never changes.

import { SHOT_SEEDS } from './config.js';
import { createGameState, startLevel, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WON } from './state.js';

/** Stage the named scene and return the state to paint. */
export function stageShot(name) {
  const state = createGameState();
  if (name === 'play') {
    startLevel(state, 0);
    state.found = new Set(['bird', 'sunshades', 'flower']);
    state.score = 300;
    state.timeLeft = 107;
    state.hintsLeft = 2;
    state.screen = SCREEN_PLAY;
    return { state, seed: SHOT_SEEDS.play };
  }
  if (name === 'level2') {
    startLevel(state, 1);
    state.found = new Set(['clock', 'cat', 'teapot-knob', 'orange']);
    state.score = 740;
    state.timeLeft = 72;
    state.hintsLeft = 1;
    state.screen = SCREEN_PLAY;
    return { state, seed: SHOT_SEEDS.level2 };
  }
  if (name === 'win') {
    startLevel(state, 2);
    state.found = new Set(['stars', 'moon', 'flame', 'lantern', 'bedroll', 'pine', 'marshmallow']);
    state.score = 2480;
    state.timeLeft = 64;
    state.hintsLeft = 1;
    state.screen = SCREEN_WON;
    state.levelBonus = 320;
    return { state, seed: SHOT_SEEDS.win };
  }
  state.screen = SCREEN_TITLE;
  return { state, seed: SHOT_SEEDS.start };
}
