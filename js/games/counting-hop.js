/* ============================================
   GAME: Number Hop
   ============================================ */

const CountingHop = (() => {
    const id = 'counting-hop';
    const name = 'Number Hop';
    const stoneCount = 5;

    const positions = [
        { left: '12%', top: '64%' },
        { left: '30%', top: '24%' },
        { left: '50%', top: '68%' },
        { left: '70%', top: '22%' },
        { left: '88%', top: '58%' }
    ];

    let container = null;
    let callbacks = null;
    let busy = false;
    let next = 1;
    let rangeStart = 1;
    let rangeEnd = stoneCount;
    let frog = null;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        busy = false;
        GameEngine.setTotal(0);
        render();
    }

    function render() {
        container.innerHTML = '';
        rangeStart = 1 + Math.floor(Math.random() * 6);
        rangeEnd = rangeStart + stoneCount - 1;
        next = rangeStart;
        busy = false;

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `🐸 Help the frog cross! Tap the lily pads in order: <strong>${rangeStart} → ${rangeEnd}</strong>`;
        container.appendChild(header);

        const pond = document.createElement('div');
        pond.className = 'hop-pond';
        container.appendChild(pond);

        const start = document.createElement('div');
        start.className = 'hop-start';
        start.textContent = '🌳';
        pond.appendChild(start);

        const goal = document.createElement('div');
        goal.className = 'hop-goal';
        goal.textContent = '🏁';
        pond.appendChild(goal);

        shuffleNumbers().forEach((num, idx) => {
            const pos = positions[idx];
            const stone = document.createElement('button');
            stone.type = 'button';
            stone.className = 'hop-stone';
            stone.style.left = pos.left;
            stone.style.top = pos.top;
            stone.textContent = num;
            stone.addEventListener('click', () => handleTap(num, stone, pos));
            pond.appendChild(stone);
        });

        frog = document.createElement('span');
        frog.className = 'hop-frog';
        frog.textContent = '🐸';
        frog.style.left = '4%';
        frog.style.top = '50%';
        pond.appendChild(frog);
    }

    function shuffleNumbers() {
        const arr = Array.from({ length: stoneCount }, (_, i) => rangeStart + i);
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function handleTap(num, stoneEl, pos) {
        if (busy) return;

        if (num === next) {
            stoneEl.classList.add('hopped');
            stoneEl.disabled = true;

            frog.style.left = pos.left;
            frog.style.top = pos.top;
            frog.classList.remove('hop');
            void frog.offsetWidth;
            frog.classList.add('hop');

            const rect = stoneEl.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);

            if (next === rangeEnd) {
                busy = true;
                callbacks.onCorrect();
                setTimeout(() => {
                    busy = false;
                    render();
                }, 1100);
            } else {
                next++;
            }
        } else {
            stoneEl.classList.add('wrong');
            callbacks.onWrong();
            setTimeout(() => stoneEl.classList.remove('wrong'), 400);
        }
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
