/* ============================================
   GAME: Number Balloons
   ============================================ */

const CountingBalloons = (() => {
    const id = 'counting-balloons';
    const name = 'Number Balloons';
    const numBalloons = 5;
    const minCount = 1;
    const maxCount = 10;

    const balloonPalette = [
        { base: '#FF6F91', light: '#FFC2D1' },
        { base: '#4D96FF', light: '#AFD3FF' },
        { base: '#6BCB77', light: '#C2F0C2' },
        { base: '#FFC75F', light: '#FFE3A3' },
        { base: '#A66CFF', light: '#DCC2FF' },
        { base: '#54D6C4', light: '#B8F2EA' }
    ];

    let container = null;
    let callbacks = null;
    let busy = false;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        busy = false;
        GameEngine.setTotal(0);
        render();
    }

    function render() {
        container.innerHTML = '';

        const target = minCount + Math.floor(Math.random() * maxCount);

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `🎈 Pop the balloon with <strong>${target}</strong> dot${target === 1 ? '' : 's'}!`;
        container.appendChild(header);

        const board = document.createElement('div');
        board.className = 'alphabet-balloons-board';
        container.appendChild(board);

        buildCounts(target).forEach((count, idx) => {
            const palette = balloonPalette[idx % balloonPalette.length];

            const balloon = document.createElement('button');
            balloon.className = 'balloon';
            balloon.type = 'button';
            balloon.style.background = `radial-gradient(circle at 32% 28%, ${palette.light}, ${palette.base})`;
            balloon.style.color = palette.base;
            balloon.style.animationDuration = `${(2.6 + (idx % 3) * 0.5).toFixed(2)}s`;
            balloon.style.animationDelay = `${(idx * -0.4).toFixed(2)}s`;

            const dots = document.createElement('span');
            dots.className = 'balloon-dots';
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('span');
                dot.className = 'balloon-dot';
                dots.appendChild(dot);
            }

            const knot = document.createElement('span');
            knot.className = 'balloon-knot';

            balloon.appendChild(dots);
            balloon.appendChild(knot);
            balloon.addEventListener('click', () => handlePop(count, target, balloon));
            board.appendChild(balloon);
        });
    }

    function buildCounts(target) {
        const choices = new Set([target]);
        while (choices.size < numBalloons) {
            choices.add(minCount + Math.floor(Math.random() * maxCount));
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    }

    function handlePop(count, target, el) {
        if (busy) return;

        if (count === target) {
            busy = true;
            el.classList.add('pop');
            el.disabled = true;
            callbacks.onCorrect();
            AudioManager.play('pop');

            const rect = el.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

            setTimeout(() => {
                busy = false;
                render();
            }, 500);
        } else {
            el.classList.add('wrong');
            callbacks.onWrong();
            setTimeout(() => el.classList.remove('wrong'), 400);
        }
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
