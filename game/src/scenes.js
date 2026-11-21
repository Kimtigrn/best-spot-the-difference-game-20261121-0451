// Odd Twin — the pictures: three original scenes, each painted twice.
// One job: draw level `levelIndex` in variant 0 (left picture) or variant 1
// (right picture). Every difference is one small branch; the rest is shared.
// All coordinates are in the 560 x 480 panel space.

import { PANEL_WIDTH, PANEL_HEIGHT } from './config.js';

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * rad;
    const py = y + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, scale, fill) {
  circle(ctx, x, y, 20 * scale, fill);
  circle(ctx, x + 18 * scale, y - 6 * scale, 15 * scale, fill);
  circle(ctx, x + 36 * scale, y, 18 * scale, fill);
  ellipse(ctx, x + 18 * scale, y + 8 * scale, 34 * scale, 12 * scale, fill);
}

function pine(ctx, x, y, scale, fill) {
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(x - 3 * scale, y - 6 * scale, 6 * scale, 26 * scale);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - 58 * scale);
  ctx.lineTo(x - 22 * scale, y - 6 * scale);
  ctx.lineTo(x + 22 * scale, y - 6 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - 78 * scale);
  ctx.lineTo(x - 16 * scale, y - 38 * scale);
  ctx.lineTo(x + 16 * scale, y - 38 * scale);
  ctx.closePath();
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Level 1 — Sunny Park
// ---------------------------------------------------------------------------
function drawPark(ctx, variant) {
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#6ec1f5');
  sky.addColorStop(1, '#d8f2fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_WIDTH, 320);

  // Sun, top left. Variant 1 wears sunglasses.
  circle(ctx, 82, 72, 34, '#ffd93b');
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(82 + Math.cos(a) * 42, 72 + Math.sin(a) * 42);
    ctx.lineTo(82 + Math.cos(a) * 52, 72 + Math.sin(a) * 52);
    ctx.stroke();
  }
  if (variant === 1) {
    roundRect(ctx, 62, 64, 18, 12, 5, '#22242e');
    roundRect(ctx, 86, 64, 18, 12, 5, '#22242e');
    ctx.strokeStyle = '#22242e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 70);
    ctx.lineTo(86, 70);
    ctx.stroke();
  } else {
    circle(ctx, 74, 70, 3, '#7a5b00');
    circle(ctx, 92, 70, 3, '#7a5b00');
    ctx.strokeStyle = '#7a5b00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(83, 78, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // Clouds. Variant 1 has one extra cloud in the middle.
  cloud(ctx, 190, 52, 0.9, '#ffffff');
  cloud(ctx, 392, 96, 0.7, '#ffffff');
  if (variant === 1) cloud(ctx, 292, 62, 0.85, '#ffffff');

  // The little bird, top right — gone in variant 1.
  if (variant === 0) {
    ctx.strokeStyle = '#2d3a4a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(418, 66);
    ctx.quadraticCurveTo(426, 56, 434, 66);
    ctx.quadraticCurveTo(442, 56, 450, 66);
    ctx.stroke();
  }

  // Hills and grass.
  ctx.fillStyle = '#7cc46a';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(160, 250, 330, 300);
  ctx.quadraticCurveTo(450, 330, PANEL_WIDTH, 290);
  ctx.lineTo(PANEL_WIDTH, PANEL_HEIGHT);
  ctx.lineTo(0, PANEL_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#69b455';
  ctx.beginPath();
  ctx.moveTo(0, 360);
  ctx.quadraticCurveTo(200, 320, 420, 360);
  ctx.quadraticCurveTo(500, 375, PANEL_WIDTH, 350);
  ctx.lineTo(PANEL_WIDTH, PANEL_HEIGHT);
  ctx.lineTo(0, PANEL_HEIGHT);
  ctx.closePath();
  ctx.fill();

  // Big tree, left. Variant 1 is missing one apple.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(112, 210, 18, 110);
  circle(ctx, 122, 168, 52, '#3f9e4d');
  circle(ctx, 84, 196, 36, '#4cb45c');
  circle(ctx, 160, 196, 36, '#4cb45c');
  circle(ctx, 100, 190, 7, '#e8443a');
  circle(ctx, 150, 178, 7, '#e8443a');
  if (variant === 0) circle(ctx, 122, 208, 7, '#e8443a');

  // Kite, upper right. Variant 1 lost its tail.
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(482, 190);
  ctx.quadraticCurveTo(500, 250, 470, 320);
  ctx.stroke();
  ctx.fillStyle = '#e84a7a';
  ctx.beginPath();
  ctx.moveTo(482, 128);
  ctx.lineTo(508, 158);
  ctx.lineTo(482, 188);
  ctx.lineTo(456, 158);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.moveTo(482, 128);
  ctx.lineTo(508, 158);
  ctx.lineTo(482, 158);
  ctx.closePath();
  ctx.fill();
  if (variant === 0) {
    ctx.strokeStyle = '#e84a7a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(482, 188);
    ctx.lineTo(478, 214);
    ctx.stroke();
    circle(ctx, 478, 222, 5, '#ffd93b');
    ctx.beginPath();
    ctx.moveTo(478, 230);
    ctx.lineTo(482, 252);
    ctx.stroke();
    circle(ctx, 482, 260, 5, '#4a90e8');
  }

  // Bench, centre.
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(228, 372, 96, 10);
  ctx.fillRect(228, 388, 96, 10);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(236, 398, 8, 34);
  ctx.fillRect(308, 398, 8, 34);

  // Pond, bottom right, with the duck.
  ellipse(ctx, 440, 420, 92, 34, '#4aa8de');
  ellipse(ctx, 440, 414, 78, 24, '#6fc3ee');
  if (variant === 0) {
    ellipse(ctx, 428, 408, 20, 12, '#ffffff');
    circle(ctx, 412, 398, 9, '#ffffff');
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(404, 398);
    ctx.lineTo(394, 401);
    ctx.lineTo(404, 403);
    ctx.closePath();
    ctx.fill();
    circle(ctx, 409, 396, 2, '#22242e');
  } else {
    ellipse(ctx, 428, 408, 20, 12, '#ffffff');
    circle(ctx, 444, 398, 9, '#ffffff');
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(452, 398);
    ctx.lineTo(462, 401);
    ctx.lineTo(452, 403);
    ctx.closePath();
    ctx.fill();
    circle(ctx, 447, 396, 2, '#22242e');
  }

  // Flower bed, bottom left. One flower changes colour.
  const flowerSpots = [60, 104, 148, 192, 232];
  for (let i = 0; i < flowerSpots.length; i += 1) {
    const fx = flowerSpots[i];
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, 430);
    ctx.lineTo(fx, 404);
    ctx.stroke();
    const petal = fx === 148 && variant === 1 ? '#9b59d0' : '#ef4b6b';
    for (let p = 0; p < 5; p += 1) {
      const a = (p * Math.PI * 2) / 5 - Math.PI / 2;
      circle(ctx, fx + Math.cos(a) * 9, 398 + Math.sin(a) * 9, 6, petal);
    }
    circle(ctx, fx, 398, 6, '#ffd93b');
  }
}

// ---------------------------------------------------------------------------
// Level 2 — Cozy Kitchen
// ---------------------------------------------------------------------------
function drawKitchen(ctx, variant) {
  ctx.fillStyle = '#f7e7c8';
  ctx.fillRect(0, 0, PANEL_WIDTH, 360);
  ctx.fillStyle = '#c89b6a';
  ctx.fillRect(0, 360, PANEL_WIDTH, 120);
  ctx.fillStyle = '#b98a58';
  for (let x = 0; x < PANEL_WIDTH; x += 56) ctx.fillRect(x, 360, 3, 120);

  // Window, top left. Variant 1 draws the curtain across it.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(52, 44, 96, 104);
  ctx.fillStyle = '#aee3f5';
  ctx.fillRect(60, 52, 80, 88);
  circle(ctx, 120, 78, 14, '#ffd93b');
  cloud(ctx, 78, 108, 0.35, '#ffffff');
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(96, 52, 6, 88);
  ctx.fillRect(60, 92, 80, 6);
  if (variant === 0) {
    ctx.fillStyle = '#e84a7a';
    ctx.beginPath();
    ctx.moveTo(52, 44);
    ctx.lineTo(76, 44);
    ctx.lineTo(66, 148);
    ctx.lineTo(52, 148);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(148, 44);
    ctx.lineTo(124, 44);
    ctx.lineTo(134, 148);
    ctx.lineTo(148, 148);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = '#e84a7a';
    ctx.fillRect(52, 44, 96, 104);
    ctx.fillStyle = '#c73a66';
    ctx.fillRect(52, 44, 96, 10);
    ctx.fillRect(96, 44, 4, 104);
  }

  // Wall clock. Variant 1 reads half past four, not three o'clock.
  circle(ctx, 468, 72, 30, '#ffffff');
  ctx.strokeStyle = '#2d3a4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(468, 72, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(468, 72);
  ctx.lineTo(468, 52);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(468, 72);
  if (variant === 0) ctx.lineTo(488, 72);
  else ctx.lineTo(482, 84);
  ctx.stroke();
  circle(ctx, 468, 72, 3, '#2d3a4a');

  // Shelf with the cookie jar. Variant 1 leaves it half empty.
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(420, 226, 120, 10);
  ctx.fillStyle = '#dfeef5';
  roundRect(ctx, 458, 172, 48, 54, 8, '#dfeef5');
  ctx.fillStyle = '#c9a06a';
  ctx.fillRect(458, 200, 48, 26);
  circle(ctx, 470, 216, 7, '#7a4a21');
  circle(ctx, 488, 210, 7, '#7a4a21');
  if (variant === 0) circle(ctx, 494, 220, 7, '#7a4a21');
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(454, 166, 56, 8);

  // Table.
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(110, 300, 340, 14);
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(130, 314, 12, 66);
  ctx.fillRect(418, 314, 12, 66);

  // Teapot. Its lid knob changes colour.
  ctx.fillStyle = '#4a90e8';
  ellipse(ctx, 282, 282, 42, 26, '#4a90e8');
  ctx.beginPath();
  ctx.moveTo(244, 272);
  ctx.quadraticCurveTo(222, 262, 226, 244);
  ctx.lineTo(238, 250);
  ctx.quadraticCurveTo(240, 264, 250, 270);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(322, 272);
  ctx.quadraticCurveTo(344, 268, 340, 252);
  ctx.quadraticCurveTo(330, 262, 320, 266);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 282, 248, 12, variant === 0 ? '#e8443a' : '#2e6fd0');

  // Two cups.
  ellipse(ctx, 210, 292, 16, 10, '#ffffff');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(198, 280, 24, 14);
  ellipse(ctx, 352, 292, 16, 10, '#ffffff');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(340, 280, 24, 14);
  ctx.fillStyle = '#7a4a21';
  ellipse(ctx, 210, 283, 10, 3, '#7a4a21');
  ellipse(ctx, 352, 283, 10, 3, '#7a4a21');

  // Fruit bowl. Variant 1 holds three oranges, not four.
  ellipse(ctx, 402, 336, 40, 14, '#e84a7a');
  circle(ctx, 380, 322, 12, '#f5a623');
  circle(ctx, 402, 314, 12, '#f5a623');
  circle(ctx, 424, 322, 12, '#f5a623');
  if (variant === 0) circle(ctx, 402, 332, 12, '#f5a623');

  // Chair with the sleeping cat — gone in variant 1.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(84, 356, 56, 10);
  ctx.fillRect(88, 366, 8, 40);
  ctx.fillRect(128, 366, 8, 40);
  ctx.fillRect(84, 320, 8, 40);
  if (variant === 0) {
    ellipse(ctx, 112, 348, 26, 14, '#e8a34a');
    circle(ctx, 132, 338, 10, '#e8a34a');
    ctx.beginPath();
    ctx.moveTo(126, 330);
    ctx.lineTo(128, 320);
    ctx.lineTo(134, 328);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(136, 330);
    ctx.lineTo(138, 320);
    ctx.lineTo(144, 328);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e8a34a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(88, 352);
    ctx.quadraticCurveTo(76, 344, 82, 334);
    ctx.stroke();
  }

  // Rug. Variant 1 loses its gold stripe.
  roundRect(ctx, 200, 420, 170, 42, 10, '#c0392b');
  if (variant === 0) {
    ctx.fillStyle = '#ffd93b';
    ctx.fillRect(200, 436, 170, 8);
  }
}

// ---------------------------------------------------------------------------
// Level 3 — Night Camp
// ---------------------------------------------------------------------------
function drawCamp(ctx, variant, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, 330);
  sky.addColorStop(0, '#0d1836');
  sky.addColorStop(1, '#2a4d80');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_WIDTH, 330);

  // Stars. Variant 1 is missing one of the three in the cluster.
  const starSpots = [
    [60, 40], [110, 90], [200, 40], [260, 100], [330, 50], [400, 110], [520, 40], [500, 140],
  ];
  for (const [sx, sy] of starSpots) star(ctx, sx, sy, 5, '#ffffff');
  star(ctx, 140, 54, 5, '#ffffff');
  star(ctx, 164, 70, 5, '#ffffff');
  if (variant === 0) star(ctx, 152, 62, 5, '#ffffff');

  // Moon. Variant 1 is a crescent.
  circle(ctx, 482, 72, 28, '#fdf6d8');
  if (variant === 1) circle(ctx, 494, 64, 24, '#2a4d80');
  circle(ctx, 474, 66, 3, '#d8cfa8');
  circle(ctx, 488, 80, 4, '#d8cfa8');

  // Mountains.
  ctx.fillStyle = '#1d2f52';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.lineTo(120, 220);
  ctx.lineTo(240, 330);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(180, 330);
  ctx.lineTo(330, 200);
  ctx.lineTo(480, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#eef3fb';
  ctx.beginPath();
  ctx.moveTo(108, 232);
  ctx.lineTo(120, 220);
  ctx.lineTo(134, 234);
  ctx.lineTo(122, 240);
  ctx.lineTo(112, 238);
  ctx.closePath();
  ctx.fill();

  // Ground.
  ctx.fillStyle = '#1e4d2b';
  ctx.fillRect(0, 330, PANEL_WIDTH, 150);

  // Pines on the left ridge. Variant 1 has two, not three.
  pine(ctx, 40, 320, 0.9, '#12351d');
  pine(ctx, 90, 326, 1.0, '#12351d');
  if (variant === 0) pine(ctx, 62, 302, 0.8, '#12351d');
  pine(ctx, 510, 322, 0.9, '#12351d');

  // Tent.
  ctx.fillStyle = '#e8703a';
  ctx.beginPath();
  ctx.moveTo(170, 400);
  ctx.lineTo(240, 300);
  ctx.lineTo(310, 400);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c65a2a';
  ctx.beginPath();
  ctx.moveTo(240, 300);
  ctx.lineTo(310, 400);
  ctx.lineTo(268, 400);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.moveTo(228, 400);
  ctx.lineTo(240, 352);
  ctx.lineTo(252, 400);
  ctx.closePath();
  ctx.fill();

  // Campfire. Variant 1 burns low.
  const flicker = 1 + 0.08 * Math.sin(time * 6);
  ctx.fillStyle = '#6b4423';
  ctx.save();
  ctx.translate(282, 392);
  ctx.rotate(0.5);
  ctx.fillRect(-26, -6, 52, 10);
  ctx.restore();
  ctx.save();
  ctx.translate(282, 392);
  ctx.rotate(-0.5);
  ctx.fillRect(-26, -6, 52, 10);
  ctx.restore();
  const flameHeight = variant === 0 ? 46 * flicker : 24 * flicker;
  ctx.fillStyle = '#f5a623';
  ctx.beginPath();
  ctx.moveTo(282, 392 - flameHeight);
  ctx.quadraticCurveTo(302, 372, 296, 392);
  ctx.quadraticCurveTo(282, 400, 268, 392);
  ctx.quadraticCurveTo(262, 372, 282, 392 - flameHeight);
  ctx.fill();
  ctx.fillStyle = '#e8443a';
  ctx.beginPath();
  ctx.moveTo(282, 392 - flameHeight * 0.6);
  ctx.quadraticCurveTo(294, 378, 290, 392);
  ctx.quadraticCurveTo(282, 397, 274, 392);
  ctx.quadraticCurveTo(270, 378, 282, 392 - flameHeight * 0.6);
  ctx.fill();

  // Marshmallow stick. Variant 1 has no marshmallow.
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(352, 410);
  ctx.lineTo(336, 372);
  ctx.stroke();
  if (variant === 0) {
    roundRect(ctx, 328, 358, 16, 20, 6, '#ffffff');
    ctx.fillStyle = '#d8c9a8';
    ctx.fillRect(328, 372, 16, 4);
  }

  // Lantern. Variant 1 is unlit.
  ctx.fillStyle = '#2d3a4a';
  ctx.fillRect(414, 356, 16, 8);
  if (variant === 0) {
    const glow = ctx.createRadialGradient(422, 382, 4, 422, 382, 44);
    glow.addColorStop(0, 'rgba(255, 220, 120, 0.55)');
    glow.addColorStop(1, 'rgba(255, 220, 120, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(378, 338, 88, 88);
    roundRect(ctx, 410, 364, 24, 34, 8, '#ffd93b');
  } else {
    roundRect(ctx, 410, 364, 24, 34, 8, '#5a6472');
  }
  ctx.strokeStyle = '#2d3a4a';
  ctx.lineWidth = 3;
  ctx.strokeRect(410, 364, 24, 34);

  // Backpack. Variant 1 has no bedroll on top.
  roundRect(ctx, 96, 392, 52, 40, 10, '#4a7a3a');
  ctx.fillStyle = '#3a6330';
  ctx.fillRect(110, 392, 24, 40);
  if (variant === 0) {
    roundRect(ctx, 100, 380, 44, 14, 7, '#b98a58');
    ctx.fillStyle = '#8a5a2e';
    ctx.fillRect(100, 386, 44, 3);
  }
}

// ---------------------------------------------------------------------------
/** Paint one level into the context, variant 0 or 1. `time` is seconds, for flicker. */
export function drawScene(ctx, levelIndex, variant, time) {
  ctx.save();
  if (levelIndex === 0) drawPark(ctx, variant);
  else if (levelIndex === 1) drawKitchen(ctx, variant);
  else drawCamp(ctx, variant, time);
  ctx.restore();
}
