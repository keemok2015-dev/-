// Synthesizes a referee whistle and crowd roar chime using Web Audio API
export function playGoalWhistleSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First whistle burst (high pitch)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2600, now);
    osc1.frequency.exponentialRampToValueAtTime(2400, now + 0.12);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Second longer whistle burst
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2800, now + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(2500, now + 0.55);

    gain2.gain.setValueAtTime(0.001, now + 0.22);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.22);
    osc2.stop(now + 0.6);

    // Stadium chime harmony
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'sine';
    chime.frequency.setValueAtTime(523.25, now + 0.3); // C5
    chime.frequency.setValueAtTime(659.25, now + 0.5); // E5
    chime.frequency.setValueAtTime(783.99, now + 0.7); // G5
    chimeGain.gain.setValueAtTime(0.001, now + 0.3);
    chimeGain.gain.linearRampToValueAtTime(0.2, now + 0.4);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.3);
    chime.stop(now + 1.1);
  } catch (e) {
    console.warn('Audio alert error:', e);
  }
}
