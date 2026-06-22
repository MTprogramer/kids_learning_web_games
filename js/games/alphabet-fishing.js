/* ============================================
   GAME: Letter Fishing
   ============================================ */

const AlphabetFishing = (() => {
    const id = 'alphabet-fishing';
    const name = 'Letter Fishing';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numFish = 5;

    const letterEmojis = {
        A: '🍎', B: '🐝', C: '🐱', D: '🐶', E: '🥚', F: '🐸',
        G: '🦒', H: '🏠', I: '🍦', J: '🧃', K: '🦘', L: '🦁',
        M: '🌝', N: '🌙', O: '🐙', P: '🍕', Q: '👑', R: '🤖',
        S: '🐍', T: '🌮', U: '☂️', V: '🎻', W: '🍉', X: '❌',
        Y: '🛹', Z: '⚡'
    };

    const fishPalette = ['#FF8A65', '#4DD0E1', '#FFD54F', '#BA68C8', '#81C784', '#F06292'];

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

        const targetLetter = letters[Math.floor(Math.random() * letters.length)];

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `🎣 Catch the fish with the letter <strong>${targetLetter}</strong>! ${letterEmojis[targetLetter] || ''}`;
        container.appendChild(header);

        const pond = document.createElement('div');
        pond.className = 'fishing-pond';
        container.appendChild(pond);

        for (let i = 0; i < 4; i++) {
            const bubble = document.createElement('span');
            bubble.className = 'pond-bubble';
            bubble.style.left = `${8 + i * 24}%`;
            bubble.style.animationDelay = `${(i * 0.9).toFixed(2)}s`;
            bubble.style.animationDuration = `${(3 + i * 0.4).toFixed(2)}s`;
            pond.appendChild(bubble);
        }

        buildFishLetters(targetLetter).forEach((letter, idx) => {
            const color = fishPalette[idx % fishPalette.length];
            const fish = document.createElement('button');
            fish.className = 'pond-fish';
            fish.type = 'button';
            fish.style.background = color;
            fish.style.color = color;
            fish.style.top = `${10 + idx * 17}%`;
            const direction = idx % 2 === 0 ? 'swimRight' : 'swimLeft';
            if (direction === 'swimLeft') fish.classList.add('fish-flip');
            fish.style.animation = `${direction} ${(8 + idx * 1.4).toFixed(2)}s linear infinite`;
            fish.style.animationDelay = `${(-idx * 1.6).toFixed(2)}s`;
            fish.innerHTML = `<span class="fish-letter">${letter}</span>`;
            fish.addEventListener('click', () => handleCatch(letter, targetLetter, fish));
            pond.appendChild(fish);
        });
    }

    function buildFishLetters(targetLetter) {
        const choices = new Set([targetLetter]);
        while (choices.size < numFish) {
            choices.add(letters[Math.floor(Math.random() * letters.length)]);
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    }

    function handleCatch(letter, targetLetter, fishEl) {
        if (busy) return;

        if (letter === targetLetter) {
            busy = true;
            fishEl.disabled = true;
            // Pin the fish at its current swimming position before stopping the animation
            fishEl.style.left = getComputedStyle(fishEl).left;
            fishEl.style.animation = '';
            fishEl.classList.add('caught');
            callbacks.onCorrect();
            AudioManager.play('pop');

            const rect = fishEl.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

            setTimeout(() => {
                busy = false;
                render();
            }, 600);
        } else {
            fishEl.classList.add('splash');
            AudioManager.play('splash');
            callbacks.onWrong();
            setTimeout(() => fishEl.classList.remove('splash'), 400);
        }
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
