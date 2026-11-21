// Odd Twin — the game state: screens, clock, score and finds.
// One job: the rules, with no drawing and no DOM in it.

import {
  DIFFERENCES_PER_LEVEL,
  HINTS_PER_LEVEL,
  LEVEL_TIME_SECONDS,
  POINTS_PER_FIND,
  POINTS_WRONG_CLICK,
  TIME_BONUS_PER_SECOND,
  WRONG_CLICK_TIME_PENALTY,
} from './config.js';
import { differenceAt, differencesForLevel } from './differences.js';

/** Screen names the renderer and the HUD read. */
export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_WON = 'won';
export const SCREEN_LOST = 'lost';

/** A fresh state, sitting on the title screen of level 1. */
export function createGameState() {
  return {
    screen: SCREEN_TITLE,
    level: 0,
    found: new Set(),
    score: 0,
    timeLeft: LEVEL_TIME_SECONDS[0],
    hintsLeft: HINTS_PER_LEVEL,
    hint: null, // { id, until } while a hint ring is showing
    misses: [], // { x, y, at } wrong-click ripples, in scene units
    levelBonus: 0,
    totalFound: 0,
    startedAt: 0,
    muted: false,
  };
}

/** Begin a level: fresh finds, a full clock and full hints. */
export function startLevel(state, levelIndex) {
  state.level = levelIndex;
  state.found = new Set();
  state.timeLeft = LEVEL_TIME_SECONDS[levelIndex];
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hint = null;
  state.misses = [];
  state.levelBonus = 0;
  state.screen = SCREEN_PLAY;
  state.startedAt = Date.now();
}

/** How many differences the level hides, and how many are found. */
export function foundCount(state) {
  return state.found.size;
}

export function remainingCount(state) {
  return DIFFERENCES_PER_LEVEL - state.found.size;
}

/** Advance the clock by `dt` seconds; the level is lost at zero. */
export function tick(state, dt) {
  if (state.screen !== SCREEN_PLAY) return;
  state.timeLeft -= dt;
  if (state.hint && Date.now() > state.hint.until) state.hint = null;
  state.misses = state.misses.filter((miss) => Date.now() - miss.at < 900);
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_LOST;
  }
}

/**
 * Click at scene coordinates (`x`, `y`, panel-local). Returns an object
 * describing what happened: { kind: 'found'|'miss'|'already', difference? }.
 */
export function clickAt(state, x, y) {
  if (state.screen !== SCREEN_PLAY) return { kind: 'ignored' };
  const difference = differenceAt(state.level, x, y);
  if (difference === null) {
    state.score = Math.max(0, state.score + POINTS_WRONG_CLICK);
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_TIME_PENALTY);
    state.misses.push({ x, y, at: Date.now() });
    return { kind: 'miss' };
  }
  if (state.found.has(difference.id)) return { kind: 'already', difference };
  state.found.add(difference.id);
  state.totalFound += 1;
  state.score += POINTS_PER_FIND;
  if (state.found.size === DIFFERENCES_PER_LEVEL) {
    state.levelBonus = Math.round(state.timeLeft) * TIME_BONUS_PER_SECOND;
    state.score += state.levelBonus;
    state.screen = state.level === 2 ? SCREEN_WON : SCREEN_LEVEL_DONE;
  }
  return { kind: 'found', difference };
}

/** Spend a hint: point at a random difference still unfound. Returns it or null. */
export function useHint(state) {
  if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return null;
  const unfound = differencesForLevel(state.level).filter((item) => !state.found.has(item.id));
  if (unfound.length === 0) return null;
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintsLeft -= 1;
  state.hint = { id: pick.id, until: Date.now() + 2500 };
  return pick;
}

/** The difference a hint is pointing at right now, or null. */
export function hintedDifference(state) {
  if (!state.hint || Date.now() > state.hint.until) return null;
  return differencesForLevel(state.level).find((item) => item.id === state.hint.id) ?? null;
}
