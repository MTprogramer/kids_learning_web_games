/* ============================================
   GAME: Treasure Chest Counting
   ============================================ */

const CountingTreasure = (() => {
    const id = 'counting-treasure';
    const name = 'Treasure Chest Counting';
    const minTarget = 3;
    const maxTarget = 9;

    let container = null;
    let callbacks = null;
    let busy = false;
    let target = 0;
    let collected = 0;
    let coinRow = null;
    let counterEl = null;
    let chestEl = null;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        busy = false;
        GameEngine.setTotal(0);
        render();
    }

    function render() {
        container.innerHTML = '';
        target = minTarget + Math.floor(Math.random() * (maxTarget - minTarget + 1));
        collected = 0;
        busy = false;

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `💰 Tap the chest to collect <strong>${target}</strong> coin${target === 1 ? '' : 's'}!`;
        container.appendChild(header);

        const scene = document.createElement('div');
        scene.className = 'treasure-scene';
        container.appendChild(scene);

        counterEl = document.createElement('div');
        counterEl.className = 'treasure-counter';
        scene.appendChild(counterEl);
        updateCounter();

        coinRow = document.createElement('div');
        coinRow.className = 'treasure-coins';
        scene.appendChild(coinRow);

        chestEl = document.createElement('button');
        chestEl.type = 'button';
        chestEl.className = 'treasure-chest';
        chestEl.innerHTML = `
            <span class="chest-lid"></span>
            <span class="chest-base"></span>
            <span class="chest-lock"></span>
        `;
        chestEl.addEventListener('click', handleTap);
        scene.appendChild(chestEl);
    }

    function updateCounter() {
        counterEl.textContent = `${collected} / ${target}`;
    }

    function handleTap() {
        if (busy) return;

        collected++;

        const coin = document.createElement('span');
        coin.className = 'treasure-coin';
        coin.textContent = '🪙';
        coinRow.appendChild(coin);

        chestEl.classList.remove('bounce');
        void chestEl.offsetWidth;
        chestEl.classList.add('bounce');

        updateCounter();

        if (collected >= target) {
            busy = true;
            chestEl.disabled = true;
            chestEl.classList.add('open');
            callbacks.onCorrect();

            const rect = chestEl.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top, 18);

            setTimeout(() => {
                busy = false;
                render();
            }, 1100);
        }
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
