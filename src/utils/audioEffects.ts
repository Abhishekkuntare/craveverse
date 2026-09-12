// High-fidelity Web Audio API sound synthesizers for tactile cafe & hero interactions

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a crystalline ice cube clink sound
 */
export function playIceClinkSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // Randomize pitch slightly for natural variety
    const baseFreq = 1800 + Math.random() * 400;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.18);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, now);
    filter.Q.setValueAtTime(8, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  } catch (e) {
    // Audio contexts might be blocked before first user gesture
    console.debug('Audio not allowed yet', e);
  }
}

/**
 * Plays a cinematic deep bass whoosh / zoom sound for the coffee bean burst
 */
export function playCinematicWhoosh() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Sub-bass sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(45, now + 1.6);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.85);

    // Splash sizzle / shimmer
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, now + 0.7);
    noiseFilter.Q.setValueAtTime(3, now + 0.7);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.setValueAtTime(0.001, now + 0.7);
    noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.9);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.7);
    noise.stop(now + 1.4);
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Ambient cafe jazz chords loop generator
 */
class AmbientCafeSoundtrack {
  private ctx: AudioContext | null = null;
  private intervalId: number | null = null;
  public isPlaying = false;

  start() {
    if (this.isPlaying) return;
    this.ctx = getAudioContext();
    if (!this.ctx) return;
    this.isPlaying = true;

    // Chords: Dm9 -> G13 -> Cmaj9 -> A7alt (classic coffeehouse jazz cadence)
    const chords = [
      [146.83, 220.00, 261.63, 329.63, 392.00], // Dm9
      [98.00, 196.00, 246.94, 329.63, 440.00],  // G13
      [130.81, 196.00, 246.94, 293.66, 392.00], // Cmaj9
      [110.00, 220.00, 277.18, 349.23, 415.30]  // A7b13
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04 / (idx + 1), now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 3.5);
      });
    };

    playChord();
    this.intervalId = window.setInterval(playChord, 3600);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const ambientCafePlayer = new AmbientCafeSoundtrack();

/**
 * Plays a cheerful, crisp two-tone bicycle bell ring ("Ding Ding!")
 */
export function playBicycleBellSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First Ding (approx 2093 Hz - C7)
    const ding1Osc = ctx.createOscillator();
    const ding1Gain = ctx.createGain();
    ding1Osc.type = 'sine';
    ding1Osc.frequency.setValueAtTime(2093, now);
    ding1Gain.gain.setValueAtTime(0.18, now);
    ding1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    ding1Osc.connect(ding1Gain);
    ding1Gain.connect(ctx.destination);
    ding1Osc.start(now);
    ding1Osc.stop(now + 0.3);

    // Second Ding slightly higher (approx 2489 Hz - D#7) after 90ms
    const ding2Osc = ctx.createOscillator();
    const ding2Gain = ctx.createGain();
    ding2Osc.type = 'sine';
    ding2Osc.frequency.setValueAtTime(2489, now + 0.09);
    ding2Gain.gain.setValueAtTime(0.22, now + 0.09);
    ding2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    ding2Osc.connect(ding2Gain);
    ding2Gain.connect(ctx.destination);
    ding2Osc.start(now + 0.09);
    ding2Osc.stop(now + 0.46);
  } catch (e) {
    console.debug('Audio not allowed yet', e);
  }
}
