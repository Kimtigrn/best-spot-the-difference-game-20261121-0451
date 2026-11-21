// Odd Twin — input: mouse clicks on the panels and the keyboard shortcuts.
// One job: turn a pointer or a key into a game action, nothing else.

import { panelRects, toScene } from './render.js';

/** The keyboard actions the game understands. */
export const ACTION_HINT = 'hint';
export const ACTION_PAUSE = 'pause';
export const ACTION_MUTE = 'mute';
export const ACTION_CONFIRM = 'confirm';
export const ACTION_RESTART = 'restart';

/**
 * Wire the canvas and the keyboard.
 * `onPanelClick(x, y)` gets scene coordinates of a click inside a panel.
 * `onKey(action)` gets one of the ACTION_* names. Returns a detach function.
 */
export function createInput(canvas, onPanelClick, onKey) {
  function onPointerDown(event) {
    const rect = canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const panels = panelRects(canvas.width, canvas.height);
    for (const panel of [panels.left, panels.right]) {
      const scene = toScene(panel, px, py);
      if (scene !== null) {
        onPanelClick(scene.x, scene.y);
        return;
      }
    }
  }

  function onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === 'h') onKey(ACTION_HINT);
    else if (key === 'p' || key === 'escape') onKey(ACTION_PAUSE);
    else if (key === 'm') onKey(ACTION_MUTE);
    else if (key === 'r') onKey(ACTION_RESTART);
    else if (key === 'enter' || key === ' ') onKey(ACTION_CONFIRM);
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('keydown', onKeyDown);
  return function detach() {
    canvas.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('keydown', onKeyDown);
  };
}
