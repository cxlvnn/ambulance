// Web Audio API emergency sounds generator
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Phone Ringing Tone (standard emergency dial tone)
export function playPhoneRing() {
  const ctx = getAudioContext();
  if (!ctx) return null;

  try {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Standard European/Uzbek ring cadence (425Hz)
    osc1.frequency.setValueAtTime(425, ctx.currentTime);
    osc2.frequency.setValueAtTime(450, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 1.2);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.4);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);

    return () => {
      try {
        osc1.stop();
        osc2.stop();
      } catch (e) {}
    };
  } catch (err) {
    console.warn('Audio play failed:', err);
    return null;
  }
}

// Connected chime / Dispatcher Answer beep
export function playConnectedBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.warn('Audio failed:', err);
  }
}

// Emergency Alert siren chime for dispatcher console
export function playDispatcherAlert() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}
