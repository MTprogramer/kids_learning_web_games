/* ============================================
   GAME: Math Fusion
   ============================================ */

const MathFusion = (() => {
    const id = 'math-fusion';
    const name = 'Math Fusion';
    const operators = ['+', '-', '*', '/'];
    const maxBalls = 25;
    const blastValue = 500;
    const maxMismatchHits = 10;
    const hitCooldownFrames = 20;

    let container = null;
    let board = null;
    let canvas = null;
    let ctx = null;
    let scoreEl = null;
    let callbacks = null;

    let balls = [];
    let particles = [];
    let fusions = 0;
    let rafId = null;
    let resizeHandler = null;
    let pointerHandler = null;

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.alpha = 1;
            this.color = color;
            this.size = Math.random() * 5 + 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.02;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Ball {
        constructor(x, y, value) {
            this.x = x;
            this.y = y;
            this.value = value;
            this.op = operators[Math.floor(Math.random() * operators.length)];
            this.radius = 20 + Math.log2(Math.abs(value) + 2) * 8;
            this.vx = (Math.random() - 0.5) * 10 || 2;
            this.vy = (Math.random() - 0.5) * 10 || 2;
            this.color = `hsl(${(value * 45) % 360}, 70%, 60%)`;
            this.mismatchHits = 0;
            this.hitCooldown = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.font = `bold ${this.radius * 0.5}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${this.op}${Math.floor(this.value)}`, this.x, this.y + 5);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.hitCooldown > 0) this.hitCooldown--;

            if (this.x < this.radius) { this.x = this.radius + 1; this.vx = Math.abs(this.vx) + 0.1; }
            if (this.x > canvas.width - this.radius) { this.x = canvas.width - this.radius - 1; this.vx = -Math.abs(this.vx) - 0.1; }
            if (this.y < this.radius) { this.y = this.radius + 1; this.vy = Math.abs(this.vy) + 0.1; }
            if (this.y > canvas.height - this.radius) { this.y = canvas.height - this.radius - 1; this.vy = -Math.abs(this.vy) - 0.1; }
        }
    }

    function createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) particles.push(new Particle(x, y, color));
    }

    function resolveCollision(b1, b2) {
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const distance = Math.hypot(dx, dy);

        if (distance < b1.radius + b2.radius) {
            const angle = Math.atan2(dy, dx);
            const overlap = (b1.radius + b2.radius - distance) / 2;
            b1.x -= overlap * Math.cos(angle); b1.y -= overlap * Math.sin(angle);
            b2.x += overlap * Math.cos(angle); b2.y += overlap * Math.sin(angle);

            const tempVx = b1.vx, tempVy = b1.vy;
            b1.vx = b2.vx; b1.vy = b2.vy;
            b2.vx = tempVx; b2.vy = tempVy;

            if (b1.value === b2.value) {
                if (b1.op === '+') b1.value += b2.value;
                else if (b1.op === '-') b1.value -= b2.value;
                else if (b1.op === '*') b1.value *= b2.value;
                else if (b1.op === '/') b1.value /= b2.value;

                b1.radius = 20 + Math.log2(Math.abs(b1.value) + 2) * 8;
                b1.mismatchHits = 0;
                createExplosion(b2.x, b2.y, b2.color);
                AudioManager.play('pop');
                fusions++;
                scoreEl.textContent = fusions;
                callbacks.onCorrect();
                return true;
            } else if (b1.hitCooldown <= 0 && b2.hitCooldown <= 0) {
                b1.mismatchHits++;
                b2.mismatchHits++;
                b1.hitCooldown = hitCooldownFrames;
                b2.hitCooldown = hitCooldownFrames;
            }
        }
        return false;
    }

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        balls = [];
        particles = [];
        fusions = 0;
        GameEngine.setTotal(0);
        render();
        rafId = requestAnimationFrame(animate);
    }

    function render() {
        container.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `Tap to drop number balls — match equal numbers to fuse them!`;
        container.appendChild(header);

        const topbar = document.createElement('div');
        topbar.className = 'mf-topbar';
        topbar.innerHTML = `<span class="mf-score-info">🧪 Fusions: <span id="mf-score">0</span></span>`;
        container.appendChild(topbar);
        scoreEl = topbar.querySelector('#mf-score');

        board = document.createElement('div');
        board.className = 'mf-board';
        container.appendChild(board);

        canvas = document.createElement('canvas');
        canvas.className = 'mf-canvas';
        board.appendChild(canvas);
        ctx = canvas.getContext('2d');

        resizeCanvas();
        resizeHandler = () => resizeCanvas();
        window.addEventListener('resize', resizeHandler);

        pointerHandler = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (balls.length >= maxBalls) return;
            balls.push(new Ball(e.clientX - rect.left, e.clientY - rect.top, Math.floor(Math.random() * 4) + 1));
        };
        canvas.addEventListener('pointerdown', pointerHandler);
    }

    function resizeCanvas() {
        if (!canvas || !board) return;
        canvas.width = board.clientWidth;
        canvas.height = board.clientHeight;
    }

    function animate() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(15, 52, 96, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.alpha > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
            balls[i].draw();
            for (let j = i + 1; j < balls.length; j++) {
                if (resolveCollision(balls[i], balls[j])) {
                    if (balls[i].value <= 0) {
                        createExplosion(balls[i].x, balls[i].y, balls[i].color);
                        balls.splice(i, 1);
                        i--;
                    }
                    balls.splice(j, 1);
                    j--;
                }
            }
        }

        balls.forEach(b => {
            if (b.value >= blastValue || b.mismatchHits >= maxMismatchHits) {
                createExplosion(b.x, b.y, b.color);
                AudioManager.play('blast');
            }
        });
        balls = balls.filter(b => b.value < blastValue && b.mismatchHits < maxMismatchHits);

        rafId = requestAnimationFrame(animate);
    }

    function destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
        if (canvas && pointerHandler) canvas.removeEventListener('pointerdown', pointerHandler);
        pointerHandler = null;
        if (container) container.innerHTML = '';
        container = null;
        board = null;
        canvas = null;
        ctx = null;
    }

    return { id, name, init, destroy };
})();
