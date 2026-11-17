// Sistema de Áudio Retro Usando Web Audio API Nativo
// 100% autônomo, sem dependência de arquivos externos ou problemas de CORS!

class RetroAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmPlaying = false;
        this.bgmOscs = [];
        this.bgmTimeout = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBgm();
        } else if (this.bgmPlaying) {
            this.startBattleBgm();
        }
        return this.muted;
    }

    // Toca uma nota simples sintetizada
    playTone(freq, duration, type = 'square', volume = 0.15) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // Efeito sonoro de clique / seleção de menu
    playClick() {
        this.playTone(700, 0.04, 'square', 0.1);
    }

    // Efeito sonoro de golpe normal (Tackle/Investida)
    playHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 0.15);
    }

    // Efeito de golpe super efetivo (impacto pesado + ruído)
    playSuperEffectiveHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Tom grave descendente
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.3);

        // Ruído de impacto (White noise sintetizado)
        try {
            const bufferSize = this.ctx.sampleRate * 0.2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.25, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            noise.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);
        } catch (e) {}
    }

    // Som de derrota / desmaio do Pokémon
    playFaint() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 0.6);
    }

    // Fanfarra de Subida de Nível (Level Up)
    playLevelUp() {
        if (this.muted) return;
        const notes = [
            { f: 523.25, d: 0.1 },  // C5
            { f: 659.25, d: 0.1 },  // E5
            { f: 783.99, d: 0.1 },  // G5
            { f: 1046.50, d: 0.2 }, // C6
            { f: 987.77, d: 0.15 }, // B5
            { f: 1046.50, d: 0.4 }  // C6
        ];
        let delay = 0;
        notes.forEach(n => {
            setTimeout(() => {
                this.playTone(n.f, n.d, 'square', 0.2);
            }, delay * 1000);
            delay += n.d * 0.9;
        });
    }

    // Fanfarra de Vitória
    playVictory() {
        if (this.muted) return;
        const notes = [
            { f: 440.00, d: 0.12 }, // A4
            { f: 440.00, d: 0.12 }, // A4
            { f: 440.00, d: 0.12 }, // A4
            { f: 554.37, d: 0.25 }, // C#5
            { f: 659.25, d: 0.18 }, // E5
            { f: 880.00, d: 0.45 }  // A5
        ];
        let delay = 0;
        notes.forEach(n => {
            setTimeout(() => {
                this.playTone(n.f, n.d, 'triangle', 0.22);
            }, delay * 1000);
            delay += n.d;
        });
    }

    // Som de Captura bem sucedida da Pokébola
    playCatch() {
        if (this.muted) return;
        // Três 'clicks' e um som alegre
        setTimeout(() => this.playTone(600, 0.08, 'square', 0.2), 100);
        setTimeout(() => this.playTone(600, 0.08, 'square', 0.2), 500);
        setTimeout(() => this.playTone(600, 0.08, 'square', 0.2), 900);
        setTimeout(() => {
            this.playTone(880, 0.15, 'triangle', 0.25);
            setTimeout(() => this.playTone(1174, 0.35, 'triangle', 0.25), 150);
        }, 1300);
    }

    // Som de balanço da Pokébola
    playBallWobble() {
        if (this.muted) return;
        this.playTone(480, 0.08, 'triangle', 0.18);
    }

    // Som da Pokébola abrindo / Pokémon escapando
    playBallBreak() {
        if (this.muted) return;
        this.playTone(320, 0.12, 'sawtooth', 0.2);
    }

    // Som de compra no Shop / moeda
    playCoin() {
        if (this.muted) return;
        this.playTone(987.77, 0.07, 'square', 0.16);
        setTimeout(() => {
            this.playTone(1318.51, 0.22, 'square', 0.16);
        }, 70);
    }

    // Som de Evolução
    playEvolutionFanfare() {
        if (this.muted) return;
        const notes = [
            { f: 392.00, d: 0.15 }, // G4
            { f: 523.25, d: 0.15 }, // C5
            { f: 659.25, d: 0.15 }, // E5
            { f: 783.99, d: 0.2 },  // G5
            { f: 1046.50, d: 0.5 }  // C6
        ];
        let delay = 0;
        notes.forEach(n => {
            setTimeout(() => {
                this.playTone(n.f, n.d, 'sawtooth', 0.2);
            }, delay * 1000);
            delay += n.d;
        });
    }

    // Música de fundo estilo Batalha Pokémon Chiptune em Loop
    startBattleBgm() {
        if (this.muted || this.bgmPlaying) return;
        this.init();
        if (!this.ctx) return;
        this.bgmPlaying = true;

        const melody = [
            { f: 293.66, d: 0.15 }, // D4
            { f: 293.66, d: 0.15 },
            { f: 329.63, d: 0.15 }, // E4
            { f: 349.23, d: 0.15 }, // F4
            { f: 392.00, d: 0.25 }, // G4
            { f: 349.23, d: 0.15 }, // F4
            { f: 329.63, d: 0.25 }, // E4
            { f: 293.66, d: 0.35 }, // D4

            { f: 440.00, d: 0.15 }, // A4
            { f: 392.00, d: 0.15 }, // G4
            { f: 349.23, d: 0.2 },  // F4
            { f: 329.63, d: 0.2 },  // E4
            { f: 293.66, d: 0.4 }   // D4
        ];

        let index = 0;
        const playNextLoopNote = () => {
            if (!this.bgmPlaying || this.muted) return;
            const note = melody[index];
            this.playTone(note.f, note.d * 0.9, 'triangle', 0.04);
            index = (index + 1) % melody.length;
            this.bgmTimeout = setTimeout(playNextLoopNote, note.d * 1000);
        };

        playNextLoopNote();
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
    }
}

const audio = new RetroAudioEngine();

