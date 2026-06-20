/* ============================================
   GAME: Dress the Weather Buddy
   Watch the weather scene, then drag the right outfit onto the buddy.
   ============================================ */

const WeatherMatch = (() => {
    const id = 'weather-match';
    const name = 'Dress the Weather Buddy';

    const weathers = [
        { key: 'sunny', emoji: '☀️', name: 'Sunny', wearEmoji: '🕶️', wearWord: 'Sunglasses', particle: '✨', particleClass: 'sun-ray', count: 1 },
        { key: 'rainy', emoji: '🌧️', name: 'Rainy', wearEmoji: '☔', wearWord: 'Umbrella', particle: '💧', particleClass: '', count: 7 },
        { key: 'snowy', emoji: '❄️', name: 'Snowy', wearEmoji: '🧣', wearWord: 'Scarf', particle: '❄️', particleClass: '', count: 7 },
        { key: 'windy', emoji: '💨', name: 'Windy', wearEmoji: '🪁', wearWord: 'Kite', particle: '🍃', particleClass: 'wind', count: 5 },
        { key: 'cloudy', emoji: '☁️', name: 'Cloudy', wearEmoji: '🧥', wearWord: 'Jacket', particle: '☁️', particleClass: '', count: 4 },
        { key: 'hot', emoji: '🌡️', name: 'Very Hot', wearEmoji: '🩴', wearWord: 'Sandals', particle: '✨', particleClass: 'sun-ray', count: 1 },
    ];

    const levels = [{ rounds: 5 }, { rounds: 5 }, { rounds: 5 }];

    let container, callbacks, currentLevel, round, totalRounds, busy;
    let buddyEl, trayEl;

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

    function buildParticles(target) {
        let html = '';
        for (let i = 0; i < target.count; i++) {
            const left = 5 + Math.random() * 85;
            const duration = (1.4 + Math.random() * 1.2).toFixed(2);
            const delay = (Math.random() * 1.5).toFixed(2);
            html += `<span class="weather-particle ${target.particleClass}" style="left:${left}%; animation-duration:${duration}s; animation-delay:${delay}s;">${target.particle}</span>`;
        }
        return html;
    }

    function nextRound() {
        round++;
        busy = false;
        DragSystem.cleanup();

        const target = weathers[Math.floor(Math.random() * weathers.length)];
        const pool = weathers.filter(w => w.key !== target.key);
        const choices = [target];
        while (choices.length < 4) {
            const c = pool[Math.floor(Math.random() * pool.length)];
            if (!choices.includes(c)) choices.push(c);
        }
        choices.sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="discovery-progress">Round ${round}/${totalRounds}</div>
            <div class="stimulus-card">
                <div class="speech-bubble">It's ${target.name} ${target.emoji}! Dress the buddy!</div>
            </div>
            <div class="weather-scene">
                ${buildParticles(target)}
                <div class="weather-buddy" id="weather-buddy">🧑</div>
            </div>
            <div class="drag-tray" id="weather-tray"></div>
        `;

        buddyEl = container.querySelector('#weather-buddy');
        trayEl = container.querySelector('#weather-tray');

        const dropZones = [{ element: buddyEl, id: 'buddy' }];

        choices.forEach((w, i) => {
            const token = document.createElement('div');
            token.className = 'drag-token';
            token.style.animationDelay = `${i * 0.08}s`;
            token.dataset.key = w.key;
            token.textContent = w.wearEmoji;
            trayEl.appendChild(token);
            DragSystem.makeDraggable(token);
        });

        DragSystem.setDropZones(dropZones);
        DragSystem.setOnDrop((dragEl) => handleDrop(dragEl, target));
    }

    function handleDrop(dragEl, target) {
        if (busy) return;

        if (dragEl.dataset.key === target.key) {
            busy = true;
            buddyEl.classList.add('dressed');
            const tag = document.createElement('span');
            tag.className = 'weather-item-tag';
            tag.textContent = target.wearEmoji;
            buddyEl.appendChild(tag);
            dragEl.classList.add('placed');
            DragSystem.resetPosition(dragEl);
            callbacks.onCorrect();

            const rect = buddyEl.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

            setTimeout(() => {
                if (round >= totalRounds) {
                    callbacks.onComplete();
                } else {
                    nextRound();
                }
            }, 900);
        } else {
            callbacks.onWrong();
            dragEl.classList.add('wrong-shake');
            DragSystem.resetPosition(dragEl);
            buddyEl.classList.add('shiver');
            setTimeout(() => {
                dragEl.classList.remove('wrong-shake');
                buddyEl.classList.remove('shiver');
            }, 400);
        }
    }

    function destroy() {
        DragSystem.cleanup();
        if (container) container.innerHTML = '';
    }

    return { id, name, levels, init, destroy };
})();
