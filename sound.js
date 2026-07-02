// sound.js — tiny Web Audio synth for Science Claw arcade SFX.
// No assets/network — all sounds are synthesized so they work offline.
// Exposes window.sfx with named effects. AudioContext unlocks on first gesture.

(function () {
  let ctx = null;
  let master = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // one oscillator "blip"
  function tone(freq, t0, dur, type, peak) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak || 0.5, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(master);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // frequency sweep
  function sweep(f1, f2, t0, dur, type, peak) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "sawtooth";
    o.frequency.setValueAtTime(f1, t0);
    o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak || 0.4, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(master);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // noise burst (for "miss" thud)
  function noise(t0, dur, peak) {
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = peak || 0.3;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    src.connect(lp);
    lp.connect(g);
    g.connect(master);
    src.start(t0);
  }

  const C = (n) => 261.63 * Math.pow(2, n / 12); // semitone helper from middle C

  const lib = {
    click() { const t = ensure().currentTime; tone(520, t, 0.06, "square", 0.35); },
    move()  { const t = ensure().currentTime; tone(300, t, 0.04, "triangle", 0.18); },
    select(){ const t = ensure().currentTime; tone(C(4), t, 0.07, "square", 0.3); tone(C(9), t + 0.05, 0.08, "square", 0.3); },
    drop()  { const t = ensure().currentTime; sweep(700, 120, t, 0.35, "sawtooth", 0.4); },
    grab()  { const t = ensure().currentTime; [0, 4, 7, 12].forEach((s, i) => tone(C(s + 7), t + i * 0.07, 0.12, "square", 0.4)); },
    miss()  { const t = ensure().currentTime; sweep(220, 90, t, 0.3, "triangle", 0.35); noise(t, 0.2, 0.22); },
    correct(){ const t = ensure().currentTime; [0, 4, 7].forEach((s, i) => tone(C(s + 7), t + i * 0.08, 0.14, "triangle", 0.42)); },
    wrong() { const t = ensure().currentTime; tone(C(1), t, 0.18, "sawtooth", 0.3); tone(C(0), t + 0.12, 0.22, "sawtooth", 0.3); },
    coin()  { const t = ensure().currentTime; tone(C(16), t, 0.06, "square", 0.4); tone(C(21), t + 0.05, 0.14, "square", 0.4); },
    win()   { const t = ensure().currentTime; [0, 4, 7, 12, 16, 19].forEach((s, i) => tone(C(s + 7), t + i * 0.09, 0.18, "square", 0.42)); },
    enter() { const t = ensure().currentTime; sweep(180, 520, t, 0.4, "sawtooth", 0.32); tone(C(12), t + 0.4, 0.16, "square", 0.4); },
  };

  window.sfx = new Proxy(lib, {
    get(target, prop) {
      if (prop === "mute") return (v) => { muted = v; if (master) master.gain.value = v ? 0 : 0.32; };
      if (prop === "muted") return muted;
      const fn = target[prop];
      if (typeof fn !== "function") return undefined;
      return function () { if (muted) return; try { ensure(); fn(); } catch (e) {} };
    },
  });
})();
