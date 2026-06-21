/* ============================================
   GAME: Balloon Pop ABC
   ============================================ */

const AlphabetBalloons = (() => {
    const id = 'alphabet-balloons';
    const name = 'Balloon Pop ABC';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const letterEmojis = {
        A: '🍎', B: '🐝', C: '🐱', D: '🐶', E: '🥚', F: '🐸',
        G: '🦒', H: '🏠', I: '🍦', J: '🧃', K: '🦘', L: '🦁',
        M: '🌝', N: '🌙', O: '🐙', P: '🍕', Q: '👑', R: '🤖',
        S: '🐍', T: '🌮', U: '☂️', V: '🎻', W: '🍉', X: '❌',
        Y: '🛹', Z: '⚡'
    };

    const balloonPalette = [
        { base: '#FF6F91', light: '#FFC2D1' },
        { base: '#4D96FF', light: '#AFD3FF' },
        { base: '#6BCB77', light: '#C2F0C2' },
        { base: '#FFC75F', light: '#FFE3A3' },
        { base: '#A66CFF', light: '#DCC2FF' },
        { base: '#FF9F45', light: '#FFD1A8' },
        { base: '#54D6C4', light: '#B8F2EA' }
    ];

    const fireColors = ['#e74c3c', '#e67e22', '#f1c40f', '#c0392b'];
    const maxBalloons = 9;
    const spawnChance = 0.025;
    const targetSpawnBias = 0.35;

    let container = null;
    let board = null;
    let canvas = null;
    let ctx = null;
    let header = null;
    let callbacks = null;
    let targetChar = '';
    let balloons = [];
    let particles = [];
    let rafId = null;
    let resizeHandler = null;

    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    class Balloon {
        constructor() {
            const forceTarget = Math.random() < targetSpawnBias;
            this.letter = forceTarget ? targetChar : letters[randomInt(0, letters.length - 1)];
            this.radius = Math.min(46, Math.max(30, canvas.width / 14));
            this.x = randomInt(this.radius, Math.max(this.radius, canvas.width - this.radius));
            this.y = canvas.height + this.radius + randomInt(0, 100);
            this.speed = Math.random() * 1 + 0.7;
            const palette = balloonPalette[randomInt(0, balloonPalette.length - 1)];
            this.color = palette.base;
            this.light = palette.light;
            this.isPopped = false;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.04 + 0.015;
        }

        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.4;
            if (this.y < -this.radius * 2) this.isPopped = true;
        }

        draw() {
            if (this.isPopped) return;
            ctx.save();
            ctx.translate(this.x, this.y);

            const grad = ctx.createRadialGradient(-this.radius * 0.3, -this.radius * 0.35, this.radius * 0.1, 0, 0, this.radius);
            grad.addColorStop(0, this.light);
            grad.addColorStop(1, this.color);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.bezierCurveTo(this.radius, -this.radius, this.radius, this.radius, 0, this.radius);
            ctx.bezierCurveTo(-this.radius, this.radius, -this.radius, -this.radius, 0, -this.radius);
            ctx.fill();

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-5, this.radius - 2);
            ctx.lineTo(5, this.radius - 2);
            ctx.lineTo(0, this.radius + 10);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.ellipse(-this.radius / 2, -this.radius / 2, this.radius / 3, this.radius / 2, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.font = `bold ${Math.round(this.radius)}px 'Fredoka', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.35)';
            ctx.shadowBlur = 4;
            ctx.fillText(this.letter, 0, 0);

            ctx.restore();
        }

        checkHit(px, py) {
            if (this.isPopped) return false;
            return Math.hypot(px - this.x, py - this.y) < this.radius;
        }
    }

    class Particle {
        constructor(x, y, options) {
            this.x = x;
            this.y = y;
            this.isPopped = false;
            this.vx = options.vx || (Math.random() - 0.5) * 10;
            this.vy = options.vy || (Math.random() - 0.5) * 10;
            this.radius = options.radius || Math.random() * 5 + 2;
            this.color = options.color || 'white';
            this.alpha = 1;
            this.decay = options.decay || 0.02;
            this.gravity = options.gravity || 0;
            this.grow = options.grow || 0;
        }

        update() {
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.radius += this.grow;
            if (this.radius < 0) this.radius = 0;
            this.alpha -= this.decay;
            if (this.alpha <= 0) this.isPopped = true;
        }

        draw() {
            if (this.isPopped) return;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function createPopEffect(x, y, color) {
        for (let i = 0; i < 25; i++) {
            particles.push(new Particle(x, y, {
                color: color,
                radius: Math.random() * 4 + 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                decay: 0.015,
                gravity: 0.05
            }));
        }
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(x, y, {
                color: 'white',
                radius: Math.random() * 10 + 5,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                decay: 0.08,
                grow: 0.5
            }));
        }
    }

    function createFireBlastEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle(x, y, {
                color: fireColors[randomInt(0, fireColors.length - 1)],
                radius: Math.random() * 15 + 10,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                decay: 0.04,
                gravity: -0.05,
                grow: 1
            }));
        }
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(x, y, {
                color: fireColors[randomInt(1, 2)],
                radius: Math.random() * 4 + 1,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                decay: 0.01,
                gravity: 0.1,
                grow: -0.02
            }));
        }
        particles.push(new Particle(x, y, {
            color: '#fff',
            radius: 30,
            vx: 0, vy: 0,
            decay: 0.1,
            grow: 2
        }));
    }

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        balloons = [];
        particles = [];
        GameEngine.setTotal(0);
        render();
        pickNewTarget();
        rafId = requestAnimationFrame(animate);
    }

    function render() {
        container.innerHTML = '';

        header = document.createElement('div');
        header.className = 'game-instruction';
        container.appendChild(header);

        board = document.createElement('div');
        board.className = 'ab-board';
        container.appendChild(board);

        canvas = document.createElement('canvas');
        canvas.className = 'ab-canvas';
        board.appendChild(canvas);
        ctx = canvas.getContext('2d');

        resizeCanvas();
        resizeHandler = () => resizeCanvas();
        window.addEventListener('resize', resizeHandler);

        canvas.addEventListener('pointerdown', handlePointer);
    }

    function resizeCanvas() {
        if (!canvas || !board) return;
        canvas.width = board.clientWidth;
        canvas.height = board.clientHeight;
    }

    function pickNewTarget() {
        let next = targetChar;
        while (next === targetChar) {
            next = letters[randomInt(0, letters.length - 1)];
        }
        targetChar = next;
        header.innerHTML = `Pop the balloon with the letter <strong>${targetChar}</strong>! ${letterEmojis[targetChar] || ''}`;
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < spawnChance && balloons.length < maxBalloons) {
            balloons.push(new Balloon());
        }

        balloons = balloons.filter(b => !b.isPopped);
        balloons.forEach(b => {
            b.update();
            b.draw();
        });

        particles = particles.filter(p => !p.isPopped);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        rafId = requestAnimationFrame(animate);
    }

    function handlePointer(e) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            if (b.checkHit(px, py)) {
                b.isPopped = true;
                if (b.letter === targetChar) {
                    createPopEffect(b.x, b.y, b.color);
                    callbacks.onCorrect();
                    pickNewTarget();
                } else {
                    createFireBlastEffect(b.x, b.y);
                    callbacks.onWrong();
                }
                break;
            }
        }
    }

    function destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
        if (canvas) canvas.removeEventListener('pointerdown', handlePointer);
        container.innerHTML = '';
        container = null;
        board = null;
        canvas = null;
        ctx = null;
    }

    return { id, name, init, destroy };
})();
