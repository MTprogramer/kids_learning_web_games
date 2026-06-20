/* ============================================
   GAME: Sorting Conveyor Belt
   Items drift along the belt — tap the one that doesn't belong before it loops around.
   ============================================ */

const OddOneOut = (() => {
    const id = 'odd-one-out';
    const name = 'Sorting Conveyor Belt';

    const categories = [
        { key: 'fruits', label: 'fruits', items: ['🍎', '🍌', '🍊', '🍇', '🍉', '🍓', '🍍', '🥝'] },
        { key: 'vehicles', label: 'vehicles', items: ['🚗', '🚌', '🚲', '✈️', '🚀', '⛵', '🚂', '🚁'] },
        { key: 'animals', label: 'animals', items: ['🐶', '🐱', '🐰', '🦁', '🐸', '🐵', '🐼', '🦊'] },
        { key: 'shapes', label: 'shapes', items: ['🔵', '🔺', '⬛', '⭐', '🔶', '⬜', '🟣', '⚫'] },
        { key: 'instruments', label: 'musical instruments', items: ['🎸', '🎹', '🥁', '🎻', '🎺', '🪘'] },
        { key: 'weather', label: 'weather symbols', items: ['☀️', '🌧️', '❄️', '⛈️', '🌈', '☁️'] },
        { key: 'sports', label: 'sports balls', items: ['⚽', '🏀', '🏈', '🎾', '🏐', '🏓'] },
        { key: 'sea', label: 'sea animals', items: ['🐠', '🐙', '🐬', '🐳', '🦈', '🦀'] },
    ];

    const levels = [
        { rounds: 5, speed: 0.7 },
        { rounds: 5, speed: 1.0 },
        { rounds: 5, speed: 1.35 },
    ];

    let container, callbacks, currentLevel, round, totalRounds, busy;
    let beltEl, items, animTimer;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        currentLevel = levels[level - 1];
        round = 0;
        totalRounds = currentLevel.rounds;
        busy = false;
        GameEngine.setTotal(totalRounds);
        nextRound();
    }

    function pickUnique(arr, count) {
        const pool = [...arr];
        const picked = [];
        while (picked.length < count && pool.length > 0) {
            const idx = Math.floor(Math.random() * pool.length);
            picked.push(pool.splice(idx, 1)[0]);
        }
        return picked;
    }

    function nextRound() {
        round++;
        busy = false;
        clearAnimation();

        const catIdx = Math.floor(Math.random() * categories.length);
        let oddCatIdx = Math.floor(Math.random() * categories.length);
        while (oddCatIdx === catIdx) oddCatIdx = Math.floor(Math.random() * categories.length);

        const mainLabel = categories[catIdx].label;
        const main = pickUnique(categories[catIdx].items, 3);
        const odd = pickUnique(categories[oddCatIdx].items, 1)[0];
        const emojis = [...main, odd].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="discovery-progress">Round ${round}/${totalRounds}</div>
            <div class="stimulus-card">
                <div class="speech-bubble">🔍 These are all ${mainLabel}... tap the one that is NOT!</div>
            </div>
            <div class="conveyor-scene" id="conveyor-scene">
                <div class="conveyor-bin">🧺</div>
                <div class="conveyor-belt"></div>
            </div>
        `;

        beltEl = container.querySelector('#conveyor-scene');
        const sceneWidth = 460;
        const spacing = sceneWidth / emojis.length;

        items = emojis.map((emoji, i) => {
            const el = document.createElement('div');
            el.className = 'conveyor-item';
            el.innerHTML = `<span class="conveyor-item-inner">${emoji}</span>`;
            beltEl.appendChild(el);

            const item = { el, emoji, x: 70 + i * spacing };
            el.style.left = `${item.x}px`;

            el.addEventListener('click', () => handleTap(item, odd));
            return item;
        });

        animateBelt();
    }

    function animateBelt() {
        clearAnimation();
        const speed = currentLevel.speed;
        animTimer = setInterval(() => {
            if (!beltEl) return;
            const bounds = beltEl.getBoundingClientRect();
            const sceneWidth = bounds.width || 460;
            items.forEach(item => {
                if (item.collected) return;
                item.x -= speed;
                if (item.x < -60) item.x = sceneWidth + 10;
                item.el.style.left = `${item.x}px`;
            });
        }, 30);
    }

    function clearAnimation() {
        if (animTimer) {
            clearInterval(animTimer);
            animTimer = null;
        }
    }

    function handleTap(item, odd) {
        if (busy || item.collected) return;

        if (item.emoji === odd) {
            busy = true;
            item.collected = true;
            item.el.classList.add('collected');
            callbacks.onCorrect();

            const rect = item.el.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

            setTimeout(() => {
                if (round >= totalRounds) {
                    callbacks.onComplete();
                } else {
                    nextRound();
                }
            }, 700);
        } else {
            callbacks.onWrong();
            item.el.classList.add('wrong');
            setTimeout(() => item.el.classList.remove('wrong'), 350);
        }
    }

    function destroy() {
        clearAnimation();
        if (container) container.innerHTML = '';
    }

    return { id, name, levels, init, destroy };
})();
