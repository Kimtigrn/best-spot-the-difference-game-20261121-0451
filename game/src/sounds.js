// Odd Twin — sounds: tiny WebAudio bleeps, generated, no audio files.
// One job: a pleasant chirp on a find, a dull thud on a miss, a fanfare on a win.

/** Create the sound player. Nothing sounds until a gesture unlocks audio. */
export function createSounds() {
  let audio = null;
  let muted = false;

  function context() {
    if (audio === null) {
      const Ctor = window.AudioContext ?? window.webkitAudioContext;
      if (!Ctor) return null;
      audio = new Ctor();
    }
    if (audio.state === 'suspended') void audio.resume();
    return audio;
  }

  function tone(frequency, startAt, length, type, volume) {
    if (muted) return;
    const ctx = context();
    if (ctx === null) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + length);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime + startAt);
    oscillator.stop(ctx.currentTime + startAt + length + 0.05);
  }

  return {
    unlock() {
      context();
    },
    setMuted(value) {
      muted = value;
    },
    isMuted() {
      return muted;
    },
    click() {
      tone(520, 0, 0.07, 'sine', 0.12);
    },
    found() {
      tone(660, 0, 0.12, 'sine', 0.22);
      tone(880, 0.09, 0.14, 'sine', 0.22);
      tone(1320, 0.18, 0.2, 'sine', 0.16);
    },
    miss() {
      tone(140, 0, 0.18, 'sawtooth', 0.1);
    },
    hint() {
      tone(990, 0, 0.1, 'triangle', 0.16);
      tone(1180, 0.1, 0.12, 'triangle', 0.16);
    },
    levelDone() {
      [523, 659, 784, 1047].forEach((note, i) => tone(note, i * 0.11, 0.18, 'triangle', 0.2));
    },
    won() {
      [523, 659, 784, 1047, 1319, 1568].forEach((note, i) => tone(note, i * 0.12, 0.24, 'triangle', 0.2));
    },
    lost() {
      [392, 330, 262].forEach((note, i) => tone(note, i * 0.16, 0.22, 'sine', 0.16));
    },
  };
}
