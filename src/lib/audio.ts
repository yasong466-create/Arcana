"use client";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export async function resumeAudio(): Promise<void> {
  const c = getCtx();
  if (c.state === "suspended") await c.resume();
}

/** Softer “paper / wood” flip */
export function playFlipSound(): void {
  const c = getCtx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(520, t);
  bp.Q.setValueAtTime(0.9, t);
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.14);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.045, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  osc.connect(bp);
  bp.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.22);
}

/** 轻柔洗牌：短促、偏白噪质感 */
export function playShuffleTick(): void {
  const c = getCtx();
  const t = c.currentTime;
  const noise = c.createBufferSource();
  const buffer = c.createBuffer(1, c.sampleRate * 0.08, c.sampleRate);
  const data = buffer.getChannelData(0);
  let brown = 0;
  for (let i = 0; i < data.length; i++) {
    const white = (Math.random() * 2 - 1) * 0.18;
    brown = (brown + 0.04 * white) / 1.04;
    data[i] = brown * 0.6 + white * 0.15;
  }
  noise.buffer = buffer;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 120;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  const gain = c.createGain();
  gain.gain.value = 0.028;
  noise.connect(hp);
  hp.connect(lp);
  lp.connect(gain);
  gain.connect(c.destination);
  noise.start(t);
  noise.stop(t + 0.08);
}

/** 舒适放松向白噪音：棕噪 + 白噪混合，偏暖、不刺耳 */
function createComfortWhiteNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const out = buffer.getChannelData(0);
  let brown = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    brown = (brown + 0.018 * white) / 1.018;
    out[i] = brown * 0.55 + white * 0.12;
  }
  return buffer;
}

type Ambient = {
  src: AudioBufferSourceNode;
  gain: GainNode;
  master: GainNode;
};

let ambient: Ambient | null = null;

/** 环境白噪音基础音量（轻柔） */
const AMBIENT_BASE = 0.022;

export function startAmbientDrone(): void {
  if (ambient) return;
  const c = getCtx();
  const t = c.currentTime;
  const buf = createComfortWhiteNoiseBuffer(c, 8);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.setValueAtTime(55, t);

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(680, t);
  lp.Q.setValueAtTime(0.35, t);

  const shelf = c.createBiquadFilter();
  shelf.type = "highshelf";
  shelf.frequency.setValueAtTime(2800, t);
  shelf.gain.setValueAtTime(-8, t);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(AMBIENT_BASE, t + 3.5);

  const master = c.createGain();
  master.gain.value = 1;

  src.connect(hp);
  hp.connect(lp);
  lp.connect(shelf);
  shelf.connect(gain);
  gain.connect(master);
  master.connect(c.destination);
  src.start(t);
  ambient = { src, gain, master };
}

export function stopAmbientDrone(): void {
  if (!ambient) return;
  const c = getCtx();
  const t = c.currentTime;
  ambient.gain.gain.cancelScheduledValues(t);
  ambient.gain.gain.setValueAtTime(ambient.gain.gain.value, t);
  ambient.gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  const stopAt = t + 1.55;
  try {
    ambient.src.stop(stopAt);
  } catch {
    ambient.src.stop();
  }
  ambient = null;
}

export function setAmbientVolume(level: number): void {
  if (!ambient) return;
  const g = Math.min(1, Math.max(0, level));
  ambient.master.gain.value = g;
}
