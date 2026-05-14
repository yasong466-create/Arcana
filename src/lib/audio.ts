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

/** Quieter cloth / table shuffle */
export function playShuffleTick(): void {
  const c = getCtx();
  const t = c.currentTime;
  const noise = c.createBufferSource();
  const buffer = c.createBuffer(1, c.sampleRate * 0.06, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.22;
  noise.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  const gain = c.createGain();
  gain.gain.value = 0.035;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  noise.start(t);
  noise.stop(t + 0.07);
}

/** Kellet-style pink noise → 低频低通，像远处风声，不做刺耳音程。 */
function createPinkNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const out = buffer.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    out[i] = pink * 0.11;
  }
  return buffer;
}

type Ambient = {
  src: AudioBufferSourceNode;
  gain: GainNode;
  master: GainNode;
};

let ambient: Ambient | null = null;

const AMBIENT_BASE = 0.012;

export function startAmbientDrone(): void {
  if (ambient) return;
  const c = getCtx();
  const t = c.currentTime;
  const buf = createPinkNoiseBuffer(c, 5.2);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(420, t);
  lp.Q.setValueAtTime(0.4, t);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(AMBIENT_BASE, t + 4);

  const master = c.createGain();
  master.gain.value = 1;

  src.connect(lp);
  lp.connect(gain);
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
