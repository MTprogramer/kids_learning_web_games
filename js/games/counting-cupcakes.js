/* ============================================
   GAME: Cupcake Counting
   ============================================ */

const CountingCupcakes = (() => {
    const id = 'counting-cupcakes';
    const name = 'Cupcake Counting';
    const numCupcakes = 4;
    const minCount = 1;
    const maxCount = 9;

    const cupcakePalette = [
        { frosting: '#FFADC9', wrapper: '#FF6F91' },
        { frosting: '#A8D8FF', wrapper: '#4D96FF' },
        { frosting: '#C8F7C5', wrapper: '#6BCB77' },
        { frosting: '#FFE3A3', wrapper: '#FFB347' },
        { frosting: '#E0C2FF', wrapper: '#A66CFF' }
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
        header.innerHTML = `🎂 Find the cupcake with <strong>${target}</strong> candle${target === 1 ? '' : 's'}!`;
        container.appendChild(header);

        const shelf = document.createElement('div');
        shelf.className = 'cupcake-shelf';
        container.appendChild(shelf);

        buildCounts(target).forEach((count, idx) => {
            const palette = cupcakePalette[idx % cupcakePalette.length];

            const cupcake = document.createElement('button');
            cupcake.className = 'cupcake';
            cupcake.type = 'button';

            const frosting = document.createElement('span');
            frosting.className = 'cupcake-frosting';
            frosting.style.background = palette.frosting;
            for (let i = 0; i < count; i++) {
                const candle = document.createElement('span');
                candle.className = 'candle';
                frosting.appendChild(candle);
            }

            const wrapper = document.createElement('span');
            wrapper.className = 'cupcake-wrapper';
            wrapper.style.background = palette.wrapper;

            cupcake.appendChild(frosting);
            cupcake.appendChild(wrapper);
            cupcake.addEventListener('click', () => handleChoice(count, target, cupcake));
            shelf.appendChild(cupcake);
        });
    }

    function buildCounts(target) {
        const choices = new Set([target]);
        while (choices.size < numCupcakes) {
            choices.add(minCount + Math.floor(Math.random() * maxCount));
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    }

    function handleChoice(count, target, el) {
        if (busy) return;

        if (count === target) {
            busy = true;
            el.classList.add('correct');
            el.disabled = true;
            callbacks.onCorrect();
            AudioManager.play('pop');

            const rect = el.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

            setTimeout(() => {
                busy = false;
                render();
            }, 600);
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
