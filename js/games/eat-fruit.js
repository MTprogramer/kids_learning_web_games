/* ============================================
   GAME: Eat Fruit
   ============================================ */

const EatFruit = (() => {
    const id = 'eat-fruit';
    const name = 'Eat Fruit';
    const fruits = ['🍎', '🍌', '🍇', '🍓', '🍍', '🍊'];
    const maxLives = 3;

    let container = null;
    let board = null;
    let canvas = null;
    let ctx = null;
    let scoreEl = null;
    let livesEl = null;
    let callbacks = null;
    let currentLevel = 1;

    let mouseX = 0;
    let monsterX = 0;
    let monsterSquash = 0;
    let food = null;
    let score = 0;
    let lives = maxLives;
    let particles = [];
    let rafId = null;
    let resizeHandler = null;
    let pointerHandler = null;
    let gameOver = false;

    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function spawnFood(initial) {
        const radius = 40;
        return {
            x: randomInt(radius, Math.max(radius, canvas.width - radius)),
            y: initial ? -50 : -50,
            type: fruits[randomInt(0, fruits.length - 1)]
        };
    }

    function createParticles(x, y) {
        for (let i = 0; i < 15; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1.0,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
    }

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        currentLevel = level;
        score = 0;
        lives = maxLives;
        particles = [];
        gameOver = false;
        GameEngine.setTotal(0);
        render();
        mouseX = canvas.width / 2;
        monsterX = canvas.width / 2;
        monsterSquash = 0;
        food = spawnFood(true);
        rafId = requestAnimationFrame(animate);
    }

    function render() {
        container.innerHTML = '';

        const topbar = document.createElement('div');
        topbar.className = 'ef-topbar';
        topbar.innerHTML = `
            <span class="ef-score-info">🍎 Fruits Eaten: <span id="ef-score">0</span></span>
            <span class="ef-lives-info" id="ef-lives">❤️❤️❤️</span>
        `;
        container.appendChild(topbar);
        scoreEl = topbar.querySelector('#ef-score');
        livesEl = topbar.querySelector('#ef-lives');

        board = document.createElement('div');
        board.className = 'ef-board';
        container.appendChild(board);

        canvas = document.createElement('canvas');
        canvas.className = 'ef-canvas';
        board.appendChild(canvas);
        ctx = canvas.getContext('2d');

        resizeCanvas();
        resizeHandler = () => resizeCanvas();
        window.addEventListener('resize', resizeHandler);

        pointerHandler = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
        };
        canvas.addEventListener('pointermove', pointerHandler);
        canvas.addEventListener('pointerdown', pointerHandler);
    }

    function resizeCanvas() {
        if (!canvas || !board) return;
        canvas.width = board.clientWidth;
        canvas.height = board.clientHeight;
    }

    function animate() {
        if (!ctx || gameOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        monsterX += (mouseX - monsterX) * 0.15;
        monsterSquash += (0 - monsterSquash) * 0.2;

        ctx.font = '80px Arial';
        ctx.textAlign = 'center';
        ctx.setTransform(1, 0, 0, 1 - (monsterSquash / 200), monsterX, canvas.height - 30);
        ctx.fillText('👹', 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        food.y += 6 + (score * 0.3);
        ctx.font = '50px Arial';
        ctx.fillText(food.type, food.x, food.y);

        if (food.y > canvas.height - 100 && Math.abs(food.x - monsterX) < 70) {
            score++;
            scoreEl.textContent = score;
            monsterSquash = 40;
            createParticles(food.x, food.y);
            AudioManager.play('coin');
            callbacks.onCorrect();
            food = spawnFood(false);
        } else if (food.y > canvas.height) {
            lives--;
            livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
            food = spawnFood(false);

            if (lives <= 0) {
                endGame();
                return;
            }
        }

        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.03;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();
        });

        rafId = requestAnimationFrame(animate);
    }

    function endGame() {
        gameOver = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;

        AudioManager.play('blast');
        callbacks.onWrong();

        if (window.reportToHost) {
            window.reportToHost('GAME_FAILED', { gameId: id, level: currentLevel, score: score });
        }

        const overlay = document.createElement('div');
        overlay.className = 'kod-gameover';
        overlay.innerHTML = `
            <div class="kod-gameover-card" style="background: linear-gradient(135deg, #fd79a8, #e17055);">
                <div class="kod-gameover-icon">😔</div>
                <h2 class="kod-gameover-title" style="color:white;">Game Over!</h2>
                <p class="kod-gameover-sub" style="color:rgba(255,255,255,0.85);">You ate ${score} fruits. Try again!</p>
                <button class="kod-gameover-btn" id="ef-retry">Try Again</button>
            </div>`;
        board.appendChild(overlay);
        overlay.querySelector('#ef-retry').addEventListener('click', () => {
            init(container, currentLevel, callbacks);
        });
    }

    function destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
        if (canvas && pointerHandler) {
            canvas.removeEventListener('pointermove', pointerHandler);
            canvas.removeEventListener('pointerdown', pointerHandler);
        }
        pointerHandler = null;
        if (container) container.innerHTML = '';
        container = null;
        board = null;
        canvas = null;
        ctx = null;
    }

    return { id, name, init, destroy };
})();
