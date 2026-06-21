/* ============================================
   CHILDS PLAY LOGIC - Audio Manager
   ============================================ */

const AudioManager = (() => {
    let ctx = null;
    let masterGain = null;
    let enabled = true;
    let initialized = false;
    let volume = 1.0; // 0-1, 1.0 = 100%
    const buffers = {};

    // Simple sound effects generator (via Web Audio API)
    const tones = {
        tap: { freq: 600, duration: 0.08, type: 'sine', gain: 0.35 },
        success: { freq: 880, duration: 0.25, type: 'sine', gain: 0.45, seq: [523, 659, 784] },
        error: { freq: 200, duration: 0.2, type: 'triangle', gain: 0.3 },
        star: { freq: 1200, duration: 0.4, type: 'sine', gain: 0.35, seq: [784, 988, 1175] },
        complete: { freq: 523, duration: 0.6, type: 'sine', gain: 0.45, seq: [523, 659, 784, 1047] },
        pop: { freq: 400, duration: 0.1, type: 'sine', gain: 0.3 },
        whoosh: { freq: 300, duration: 0.15, type: 'sawtooth', gain: 0.18 },
        flip: { freq: 500, duration: 0.12, type: 'sine', gain: 0.25 },
    };

    function init() {
        if (initialized) return;
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = volume;
            masterGain.connect(ctx.destination);
            initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    function playTone(name) {
        if (!enabled || !ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const tone = tones[name];
        if (!tone) return;

        if (tone.seq) {
            // Sequence of notes
            tone.seq.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = tone.type;
                osc.frequency.value = freq;
                gain.gain.value = tone.gain;
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * 0.15);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + (i + 1) * 0.15 + 0.05);
            });
        } else {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = tone.type;
            osc.frequency.value = tone.freq;
            gain.gain.value = tone.gain;
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tone.duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + tone.duration + 0.05);
        }
    }

    function play(name) {
        if (!enabled) return;
        init();
        playTone(name);
    }

    function toggle() {
        enabled = !enabled;
        return enabled;
    }

    function isEnabled() {
        return enabled;
    }

    function setEnabled(val) {
        enabled = val;
    }

    function setVolume(val) {
        volume = Math.max(0, Math.min(1, val));
        if (masterGain) masterGain.gain.value = volume;
    }

    function getVolume() {
        return volume;
    }

    return { init, play, toggle, isEnabled, setEnabled, setVolume, getVolume };
})();
