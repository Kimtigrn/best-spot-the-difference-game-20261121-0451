// Odd Twin — the renderer: two picture panels, found markers and ripples.
// One job: paint the current state onto the canvas, nothing else.
// The panels sit side by side; each is the same scene in a different variant.

import { PANEL_WIDTH, PANEL_HEIGHT } from './config.js';
import { differencesForLevel } from './differences.js';
import { drawScene } from './scenes.js';
import { hintedDifference } from './state.js';

/** Where the two panels sit on a canvas of `width` x `height`. */
export function panelRects(width, height) {
  const margin = 24;
  const gap = 56;
  const panelWidth = Math.floor((width - margin * 2 - gap) / 2);
  const panelHeight = Math.floor((panelWidth * PANEL_HEIGHT) / PANEL_WIDTH);
  const y = Math.floor((height - panelHeight) / 2) + 8;
  return {
    left: { x: margin, y, w: panelWidth, h: panelHeight },
    right: { x: margin + panelWidth + gap, y, w: panelWidth, h: panelHeight },
    gap,
  };
}

/** Convert a canvas point to scene coordinates inside `panel`, or null. */
export function toScene(panel, px, py) {
  if (px < panel.x || px > panel.x + panel.w || py < panel.y || py > panel.y + panel.h) return null;
  return {
    x: ((px - panel.x) / panel.w) * PANEL_WIDTH,
    y: ((py - panel.y) / panel.h) * PANEL_HEIGHT,
  };
}

function drawPanelFrame(ctx, panel, label, accent) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(panel.x - 6, panel.y - 6, panel.w + 12, panel.h + 12, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = '700 15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, panel.x + 2, panel.y - 20);
  ctx.restore();
}

function drawMarker(ctx, panel, difference, time) {
  const x = panel.x + (difference.x / PANEL_WIDTH) * panel.w;
  const y = panel.y + (difference.y / PANEL_HEIGHT) * panel.h;
  const r = (difference.r / PANEL_WIDTH) * panel.w + 6 + 2 * Math.sin(time * 3);
  ctx.save();
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(x, y - r - 8, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.font = '700 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', x, y - r - 8);
  ctx.restore();
}

function drawMiss(ctx, panel, miss) {
  const age = Date.now() - miss.at;
  if (age > 900) return;
  const alpha = 1 - age / 900;
  const x = panel.x + (miss.x / PANEL_WIDTH) * panel.w;
  const y = panel.y + (miss.y / PANEL_HEIGHT) * panel.h;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#e8443a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const s = 10 + age / 60;
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
  ctx.restore();
}

function drawHintRing(ctx, panel, difference, time) {
  const x = panel.x + (difference.x / PANEL_WIDTH) * panel.w;
  const y = panel.y + (difference.y / PANEL_HEIGHT) * panel.h;
  const pulse = 1 + 0.12 * Math.sin(time * 6);
  const r = ((difference.r + 10) / PANEL_WIDTH) * panel.w * pulse;
  ctx.save();
  ctx.strokeStyle = '#7b61ff';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** Wrap a canvas so the loop can call `renderer.draw(state, time)`. */
export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  return {
    draw(state, time) {
      drawFrame(ctx, canvas.width, canvas.height, state, time);
    },
  };
}

/** Paint the whole frame: background, both panels, markers, ripples. */
export function drawFrame(ctx, width, height, state, time) {
  ctx.fillStyle = '#20242e';
  ctx.fillRect(0, 0, width, height);
  const rects = panelRects(width, height);
  const list = differencesForLevel(state.level);
  const hint = hintedDifference(state);

  for (const [panel, variant, label, accent] of [
    [rects.left, 0, 'PICTURE A', '#4a90e8'],
    [rects.right, 1, 'PICTURE B', '#e84a7a'],
  ]) {
    drawPanelFrame(ctx, panel, label, accent);
    ctx.save();
    ctx.beginPath();
    ctx.rect(panel.x, panel.y, panel.w, panel.h);
    ctx.clip();
    ctx.translate(panel.x, panel.y);
    ctx.scale(panel.w / PANEL_WIDTH, panel.h / PANEL_HEIGHT);
    drawScene(ctx, state.level, variant, time);
    ctx.restore();
    for (const difference of list) {
      if (state.found.has(difference.id)) drawMarker(ctx, panel, difference, time);
    }
    if (hint !== null) drawHintRing(ctx, panel, hint, time);
    for (const miss of state.misses) drawMiss(ctx, panel, miss);
  }

  // The "VS" badge between the panels.
  const cx = rects.left.x + rects.left.w + rects.gap / 2;
  const cy = rects.left.y + rects.left.h / 2;
  ctx.save();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#20242e';
  ctx.font = '800 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', cx, cy + 1);
  ctx.restore();
}
