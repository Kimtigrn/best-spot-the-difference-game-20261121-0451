// Odd Twin — boot and the one loop: read input, advance the clock, paint.
// The game moves between title, play, paused, level-done, won and lost.
// ?shot=start|play|level2|win (with &seed=N) stages that scene instead of
// running the loop, paints it twice and sets window.__shotReady for a screenshot.

import { BEST_KEY, DIFFERENCES_PER_LEVEL, LEVELS } from './config.js';
import { createGameState, clickAt, foundCount, remainingCount, startLevel, tick, useHint, SCREEN_LEVEL_DONE, SCREEN_LOST, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WON } from './state.js';
import { createInput, ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART } from './input.js';
import { createRenderer, drawFrame } from './render.js';
import { createSounds } from './sounds.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const hud = {
  level: document.getElementById('hud-level'),
  timerText: document.getElementById('hud-timer-text'),
  timerFill: document.getElementById('hud-timer-fill'),
  found: document.getElementById('hud-found'),
  score: document.getElementById('hud-score'),
  hints: document.getElementById('btn-hint'), // the button doubles as the hint counter
  message: document.getElementById('hud-message'),
  dots: document.getElementById('hud-dots'),
  overlay: document.getElementById('overlay'),
  btnHint: document.getElementById('btn-hint'),
  btnPause: document.getElementById('btn-pause'),
  btnSound: document.getElementById('btn-sound'),
};

const sounds = createSounds();
const renderer = createRenderer(canvas);
let state = createGameState();
let shotMode = false;
let frozenTime = 1.234;

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function levelStars(levelIndex) {
  return '★'.repeat(LEVELS[levelIndex].stars) + '☆'.repeat(3 - LEVELS[levelIndex].stars);
}

function setMessage(text) {
  if (hud.message.textContent !== text) hud.message.textContent = text;
}

/** The HUD, refreshed from the state. Cheap writes only when a value changed. */
const shown = {};
function paintHud() {
  const level = LEVELS[state.level];
  const values = {
    level: `Level ${state.level + 1} · ${level.name}`,
    timer: formatTime(state.timeLeft),
    found: `${foundCount(state)} / ${DIFFERENCES_PER_LEVEL} found`,
    score: String(state.score),
    hints: `Hint (${state.hintsLeft})`,
  };
  if (shown.level !== values.level) {
    hud.level.textContent = values.level;
    shown.level = values.level;
  }
  if (shown.timer !== values.timer) {
    hud.timerText.textContent = values.timer;
    shown.timer = values.timer;
  }
  const fraction = Math.max(0, state.timeLeft / level.seconds);
  hud.timerFill.style.width = `${(fraction * 100).toFixed(1)}%`;
  hud.timerFill.classList.toggle('low', fraction < 0.2 && state.screen === SCREEN_PLAY);
  if (shown.found !== values.found) {
    hud.found.textContent = values.found;
    shown.found = values.found;
  }
  if (shown.score !== values.score) {
    hud.score.textContent = values.score;
    shown.score = values.score;
  }
  if (shown.hints !== values.hints) {
    hud.hints.textContent = values.hints;
    shown.hints = values.hints;
  }
  hud.btnHint.disabled = state.hintsLeft <= 0 || state.screen !== SCREEN_PLAY;
  hud.btnPause.disabled = state.screen !== SCREEN_PLAY && state.screen !== SCREEN_PAUSED;
  const dots = Array.from({ length: DIFFERENCES_PER_LEVEL }, (_, i) => (i < foundCount(state) ? '●' : '○')).join(' ');
  if (shown.dots !== dots) {
    hud.dots.textContent = dots;
    shown.dots = dots;
  }
}

/** The overlay screens: title, level done, won, lost, paused. */
function showOverlay() {
  const best = readBest();
  if (state.screen === SCREEN_TITLE) {
    const cards = LEVELS.map(
      (level, i) =>
        `<button class="level-card" data-level="${i}"><b>${i + 1}. ${level.name}</b><span>${levelStars(i)}</span><small>${level.tagline}</small></button>`,
    ).join('');
    hud.overlay.innerHTML = `
      <div class="panel">
        <h1>ODD TWIN</h1>
        <p class="tagline">Spot the Difference — two pictures, seven secrets.</p>
        <p class="howto">Click a difference in either picture. Find all ${DIFFERENCES_PER_LEVEL} before the clock runs out. Wrong clicks cost 5 seconds. Press <b>H</b> for a hint.</p>
        <div class="levels">${cards}</div>
        <button class="big" id="btn-start">▶ &nbsp;Start the hunt</button>
        ${best > 0 ? `<p class="best">Best score: ${best}</p>` : ''}
      </div>`;
    hud.overlay.hidden = false;
    document.getElementById('btn-start').addEventListener('click', () => beginLevel(0));
    hud.overlay.querySelectorAll('.level-card').forEach((card) => {
      card.addEventListener('click', () => beginLevel(Number(card.dataset.level)));
    });
    return;
  }
  if (state.screen === SCREEN_LEVEL_DONE) {
    hud.overlay.innerHTML = `
      <div class="panel">
        <h1>LEVEL CLEAR!</h1>
        <p class="tagline">All ${DIFFERENCES_PER_LEVEL} differences found in ${LEVELS[state.level].name}.</p>
        <p class="stats">Time bonus <b>+${state.levelBonus}</b> · Score <b>${state.score}</b></p>
        <button class="big" id="btn-next">Next level: ${LEVELS[state.level + 1].name} →</button>
      </div>`;
    hud.overlay.hidden = false;
    document.getElementById('btn-next').addEventListener('click', () => beginLevel(state.level + 1));
    return;
  }
  if (state.screen === SCREEN_WON) {
    const isBest = state.score >= best && state.score > 0;
    if (isBest) saveBest(state.score);
    const stars = state.score >= 2400 ? '★★★' : state.score >= 1800 ? '★★☆' : '★☆☆';
    hud.overlay.innerHTML = `
      <div class="panel">
        <h1>YOU FOUND THEM ALL!</h1>
        <p class="tagline">Every difference in all three scenes — a true eagle eye.</p>
        <p class="stars">${stars}</p>
        <p class="stats">Final score <b>${state.score}</b> · Time bonus <b>+${state.levelBonus}</b></p>
        <p class="best">${isBest ? 'New best score!' : `Best score: ${Math.max(best, state.score)}`}</p>
        <button class="big" id="btn-again">↻ &nbsp;Play again</button>
      </div>`;
    hud.overlay.hidden = false;
    document.getElementById('btn-again').addEventListener('click', () => beginLevel(0));
    return;
  }
  if (state.screen === SCREEN_LOST) {
    hud.overlay.innerHTML = `
      <div class="panel">
        <h1>TIME'S UP!</h1>
        <p class="tagline">You found ${foundCount(state)} of ${DIFFERENCES_PER_LEVEL} in ${LEVELS[state.level].name} — ${remainingCount(state)} still hiding.</p>
        <p class="stats">Score <b>${state.score}</b></p>
        <button class="big" id="btn-retry">↻ &nbsp;Try this level again</button>
        <button class="ghost" id="btn-menu">Back to the menu</button>
      </div>`;
    hud.overlay.hidden = false;
    document.getElementById('btn-retry').addEventListener('click', () => beginLevel(state.level));
    document.getElementById('btn-menu').addEventListener('click', () => {
      state = createGameState();
      showOverlay();
    });
    return;
  }
  if (state.screen === SCREEN_PAUSED) {
    hud.overlay.innerHTML = `
      <div class="panel">
        <h1>PAUSED</h1>
        <p class="tagline">Take a breath. The differences will wait.</p>
        <button class="big" id="btn-resume">▶ &nbsp;Resume</button>
        <button class="ghost" id="btn-restart-level">Restart this level</button>
      </div>`;
    hud.overlay.hidden = false;
    document.getElementById('btn-resume').addEventListener('click', () => {
      state.screen = SCREEN_PLAY;
      showOverlay();
    });
    document.getElementById('btn-restart-level').addEventListener('click', () => beginLevel(state.level));
    return;
  }
  hud.overlay.hidden = true;
  hud.overlay.innerHTML = '';
}

function beginLevel(levelIndex) {
  sounds.unlock();
  sounds.click();
  startLevel(state, levelIndex);
  setMessage(`Find ${DIFFERENCES_PER_LEVEL} differences in ${LEVELS[levelIndex].name} — click one in either picture!`);
  showOverlay();
  paintHud();
}

function onPanelClick(x, y) {
  if (state.screen !== SCREEN_PLAY) return;
  const result = clickAt(state, x, y);
  if (result.kind === 'found') {
    sounds.found();
    const left = remainingCount(state);
    setMessage(
      left === 0
        ? `Found it — ${result.difference.label}!`
        : `Found it — ${result.difference.label}! ${left} to go.`,
    );
    if (state.screen === SCREEN_LEVEL_DONE) sounds.levelDone();
    if (state.screen === SCREEN_WON) sounds.won();
    showOverlay();
  } else if (result.kind === 'miss') {
    sounds.miss();
    setMessage('Not quite — that costs 5 seconds. Look closer!');
  }
  paintHud();
}

function onKey(action) {
  if (action === ACTION_CONFIRM) {
    if (state.screen === SCREEN_TITLE) beginLevel(0);
    else if (state.screen === SCREEN_LEVEL_DONE) beginLevel(state.level + 1);
    else if (state.screen === SCREEN_WON || state.screen === SCREEN_LOST) beginLevel(state.screen === SCREEN_WON ? 0 : state.level);
    else if (state.screen === SCREEN_PAUSED) {
      state.screen = SCREEN_PLAY;
      showOverlay();
    }
    return;
  }
  if (action === ACTION_HINT) {
    if (state.screen !== SCREEN_PLAY) return;
    const pick = useHint(state);
    if (pick !== null) {
      sounds.hint();
      setMessage(`Hint: something hides near the ${pick.label.toLowerCase()}…`);
    }
    paintHud();
    return;
  }
  if (action === ACTION_PAUSE) {
    if (state.screen === SCREEN_PLAY) {
      state.screen = SCREEN_PAUSED;
      showOverlay();
    } else if (state.screen === SCREEN_PAUSED) {
      state.screen = SCREEN_PLAY;
      showOverlay();
    }
    return;
  }
  if (action === ACTION_MUTE) {
    state.muted = !state.muted;
    sounds.setMuted(state.muted);
    hud.btnSound.textContent = state.muted ? '🔇 Sound off' : '🔊 Sound on';
    return;
  }
  if (action === ACTION_RESTART) {
    if (state.screen === SCREEN_PLAY || state.screen === SCREEN_PAUSED) beginLevel(state.level);
  }
}

createInput(canvas, onPanelClick, onKey);
hud.btnHint.addEventListener('click', () => onKey(ACTION_HINT));
hud.btnPause.addEventListener('click', () => onKey(ACTION_PAUSE));
hud.btnSound.addEventListener('click', () => onKey(ACTION_MUTE));

function resize() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width));
  canvas.height = Math.max(240, Math.floor(rect.height));
}
window.addEventListener('resize', resize);
resize();

function frame(now) {
  const time = shotMode ? frozenTime : now / 1000;
  if (!shotMode) {
    const dt = Math.min(0.1, (now - (frame.last ?? now)) / 1000);
    frame.last = now;
    const before = state.screen;
    tick(state, dt);
    if (before === SCREEN_PLAY && state.screen === SCREEN_LOST) {
      sounds.lost();
      showOverlay();
    }
  }
  renderer.draw(state, time);
  paintHud();
  requestAnimationFrame(frame);
}

if (shot !== null) {
  shotMode = true;
  const staged = stageShot(shot);
  state = staged.state;
  if (state.screen === SCREEN_WON || state.screen === SCREEN_TITLE) showOverlay();
  else {
    hud.overlay.hidden = true;
    hud.overlay.innerHTML = '';
  }
  setMessage(
    state.screen === SCREEN_PLAY
      ? `Find ${DIFFERENCES_PER_LEVEL} differences — ${remainingCount(state)} still hiding!`
      : 'Odd Twin — spot the difference.',
  );
  resize();
  paintHud();
  renderer.draw(state, frozenTime);
  renderer.draw(state, frozenTime);
  window.__shotReady = true;
} else {
  showOverlay();
  setMessage('Welcome, detective — pick a level and start the hunt!');
  requestAnimationFrame(frame);
}
