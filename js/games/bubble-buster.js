/* ============================================
   GAME: Bubble Buster
   ============================================ */

const BubbleBuster = (() => {
    const id = 'bubble-buster';
    const name = 'Bubble Buster';
    const numPairs = 8;
    const minTarget = 10;
    const maxTarget = 20;

    let container = null;
    let board = null;
    let canvas = null;
    let ctx = null;
    let callbacks = null;
    let selected = [];
    let busy = false;
    let targetSum = 20;
    let fragments = [];
    let rafId = null;
    let resizeHandler = null;

    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    class Fragment {
        constructor(x, y, color, isConfetti) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * (isConfetti ? 15 : 6);
            this.vy = (Math.random() - 0.5) * (isConfetti ? 15 : 6);
            this.size = Math.random() * (isConfetti ? 10 : 8) + 4;
            this.life = 1.0;
            this.color = color;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15;
            this.life -= 0.015;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.restore();
        }
    }

    function blast(x, y, color) {
        for (let i = 0; i < 12; i++) fragments.push(new Fragment(x, y, color, false));
    }

    function celebrationBlast() {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        for (let i = 0; i < 200; i++) {
            fragments.push(new Fragment(cx, cy, `hsl(${Math.random() * 360}, 70%, 60%)`, true));
        }
    }

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        selected = [];
        busy = false;
        fragments = [];
        GameEngine.setTotal(0);
        render();
        rafId = requestAnimationFrame(animate);
    }

    function buildValues() {
        targetSum = randomInt(minTarget, maxTarget);
        const values = [];
        for (let i = 0; i < numPairs; i++) {
            const v1 = randomInt(1, targetSum - 1);
            values.push(v1, targetSum - v1);
        }
        return values.sort(() => Math.random() - 0.5);
    }

    function render() {
        container.innerHTML = '';
        selected = [];

        const values = buildValues();

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `🫧 Pop pairs that add up to <strong>${targetSum}</strong>!`;
        container.appendChild(header);

        board = document.createElement('div');
        board.className = 'bb-board';
        container.appendChild(board);

        values.forEach(value => {
            const bubble = document.createElement('button');
            bubble.className = 'bb-bubble';
            bubble.type = 'button';
            bubble.textContent = value;
            bubble.dataset.value = value;
            bubble.addEventListener('click', () => handlePick(bubble));
            board.appendChild(bubble);
        });

        canvas = document.createElement('canvas');
        canvas.className = 'bb-canvas';
        board.appendChild(canvas);
        ctx = canvas.getContext('2d');

        resizeCanvas();
        resizeHandler = () => resizeCanvas();
        window.addEventListener('resize', resizeHandler);
    }

    function resizeCanvas() {
        if (!canvas || !board) return;
        canvas.width = board.clientWidth;
        canvas.height = board.clientHeight;
    }

    function bubbleCenter(bubble) {
        const bubbleRect = bubble.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        return {
            x: bubbleRect.left - boardRect.left + bubbleRect.width / 2,
            y: bubbleRect.top - boardRect.top + bubbleRect.height / 2
        };
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fragments = fragments.filter(f => f.life > 0);
        fragments.forEach(f => {
            f.update();
            f.draw();
        });

        rafId = requestAnimationFrame(animate);
    }

    function handlePick(bubble) {
        if (busy || bubble.classList.contains('selected') || bubble.disabled) return;

        bubble.classList.add('selected');
        selected.push(bubble);

        if (selected.length === 2) checkMatch();
    }

    function checkMatch() {
        busy = true;
        const [a, b] = selected;
        const v1 = parseInt(a.dataset.value, 10);
        const v2 = parseInt(b.dataset.value, 10);

        if (v1 + v2 === targetSum) {
            callbacks.onCorrect();
            [a, b].forEach(bubble => {
                bubble.classList.add('pop');
                bubble.disabled = true;
                const center = bubbleCenter(bubble);
                blast(center.x, center.y, '#ff7675');
            });

            setTimeout(() => {
                a.remove();
                b.remove();
                selected = [];
                busy = false;

                if (board.children.length === 1) {
                    celebrationBlast();
                    setTimeout(render, 2000);
                }
            }, 400);
        } else {
            callbacks.onWrong();
            [a, b].forEach(bubble => bubble.classList.add('wrong'));

            setTimeout(() => {
                [a, b].forEach(bubble => bubble.classList.remove('selected', 'wrong'));
                selected = [];
                busy = false;
            }, 500);
        }
    }

    function destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
        if (container) container.innerHTML = '';
        container = null;
        board = null;
        canvas = null;
        ctx = null;
    }

    return { id, name, init, destroy };
})();
