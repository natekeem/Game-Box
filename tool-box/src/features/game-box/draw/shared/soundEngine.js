/**
 * GAMEBOX RANDOM PLAY ZONE — Web Audio Procedural SFX Engine
 *
 * Adapted & extended from:
 * - alsatianco/spin-the-wheel (audio-engine.js, MIT License, Copyright (c) 2026 alsatianco)
 *
 * Provides zero-external-asset procedural sound effects for all 5 draw mini-games:
 * - Wheel ticks, fanfare, applause, chime
 * - Ladder step ticks, bomb fuse/explosion, safe arrival
 * - Lotto blower hum, ball pop/clack, bonus fanfare
 * - Team draft drumroll & card reveal
 * - Mystery box shake rattle, paper rustle/unfold
 */

class DrawSoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.volume = 0.65;
    this.noiseBuffer = null;
  }

  ensureContext() {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.volume;
        this.master.connect(this.ctx.destination);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.master && this.ctx) {
      this.master.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, Number(vol) || 0));
    if (this.master && this.ctx && !this.muted) {
      this.master.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  getNoiseBuffer() {
    const ctx = this.ensureContext();
    if (!ctx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;
    const len = Math.floor(ctx.sampleRate * 1.0);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }
    this.noiseBuffer = buf;
    return buf;
  }

  playTone({
    type = 'sine',
    freq = 440,
    endFreq = null,
    duration = 0.12,
    delay = 0,
    peak = 0.14,
  } = {}) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const start = ctx.currentTime + delay;
    const end = start + Math.max(0.02, duration);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq && endFreq > 0) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, end);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(start);
    osc.stop(end + 0.01);
  }

  playNoise({
    duration = 0.15,
    delay = 0,
    peak = 0.1,
    filterType = 'bandpass',
    filterFreq = 1200,
    q = 1.0,
  } = {}) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const buf = this.getNoiseBuffer();
    if (!buf) return;
    const start = ctx.currentTime + delay;
    const end = start + Math.max(0.03, duration);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, start);
    filter.Q.value = q;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    src.start(start);
    src.stop(end + 0.01);
  }

  // Wheel / Ladder tick
  playTick(speed = 0.25, variant = 'click') {
    if (variant === 'wooden') {
      this.playTone({ type: 'triangle', freq: 310 + Math.min(speed * 600, 650), duration: 0.055, peak: 0.14 });
    } else if (variant === 'pop') {
      this.playTone({ type: 'sine', freq: 480 + Math.min(speed * 900, 1000), endFreq: 240, duration: 0.05, peak: 0.13 });
    } else {
      this.playTone({ type: 'square', freq: 680 + Math.min(speed * 1500, 1400), duration: 0.045, peak: 0.1 });
    }
  }

  // Bomb Explosion for BOMB LADDER
  playExplosion() {
    this.playNoise({ duration: 0.42, peak: 0.28, filterType: 'lowpass', filterFreq: 380, q: 0.8 });
    this.playTone({ type: 'sawtooth', freq: 130, endFreq: 36, duration: 0.38, peak: 0.22 });
  }

  // Safe / Winner Fanfare
  playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      this.playTone({ type: 'triangle', freq, duration: 0.26, delay: i * 0.075, peak: 0.15 });
    });
  }

  // Ball Pop for LOTTO 6/45
  playBallExtract(isBonus = false) {
    if (isBonus) {
      this.playTone({ type: 'sine', freq: 587.33, endFreq: 1174.66, duration: 0.22, peak: 0.18 });
      this.playTone({ type: 'triangle', freq: 880, endFreq: 1318.5, duration: 0.28, delay: 0.09, peak: 0.16 });
    } else {
      this.playTone({ type: 'sine', freq: 420, endFreq: 860, duration: 0.14, peak: 0.16 });
    }
  }

  // Card draft reveal for TEAM DRAFT
  playDraftPick() {
    this.playTone({ type: 'triangle', freq: 440, endFreq: 660, duration: 0.1, peak: 0.13 });
  }

  // Box shake rattle for MYSTERY BOX
  playBoxShake() {
    for (let i = 0; i < 4; i += 1) {
      this.playNoise({
        duration: 0.07,
        delay: i * 0.085,
        peak: 0.12,
        filterType: 'bandpass',
        filterFreq: 950 + i * 160,
        q: 1.4,
      });
    }
  }

  // Paper slip unfold for MYSTERY BOX
  playPaperUnfold() {
    this.playNoise({
      duration: 0.2,
      peak: 0.11,
      filterType: 'highpass',
      filterFreq: 1800,
      q: 0.9,
    });
    this.playTone({ type: 'sine', freq: 660, endFreq: 880, duration: 0.18, delay: 0.06, peak: 0.11 });
  }
}

export const drawSound = new DrawSoundEngine();
