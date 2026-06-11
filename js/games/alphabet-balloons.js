/* ============================================
   GAME: Balloon Pop ABC
   ============================================ */

const AlphabetBalloons = (() => {
    const id = 'alphabet-balloons';
    const name = 'Balloon Pop ABC';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numBalloons = 6;

    const letterEmojis = {
        A: '🍎', B: '🐝', C: '🐱', D: '🐶', E: '🥚', F: '🐸',
        G: '🦒', H: '🏠', I: '🍦', J: '🧃', K: '🦘', L: '🦁',
        M: '🌝', N: '🌙', O: '🐙', P: '🍕', Q: '👑', R: '🤖',
        S: '🐍', T: '🌮', U: '☂️', V: '🎻', W: '🍉', X: '❌',
        Y: '🛹', Z: '⚡'
    };

    const balloonPalette = [
        { base: '#FF6F91', light: '#FFC2D1' },
        { base: '#4D96FF', light: '#AFD3FF' },
        { base: '#6BCB77', light: '#C2F0C2' },
        { base: '#FFC75F', light: '#FFE3A3' },
        { base: '#A66CFF', light: '#DCC2FF' },
        { base: '#FF9F45', light: '#FFD1A8' },
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

        const targetLetter = letters[Math.floor(Math.random() * letters.length)];

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `Pop the balloon with the letter <strong>${targetLetter}</strong>! ${letterEmojis[targetLetter] || ''}`;
        container.appendChild(header);

        const board = document.createElement('div');
        board.className = 'alphabet-balloons-board';
        container.appendChild(board);

        buildBalloonLetters(targetLetter).forEach((letter, idx) => {
            const palette = balloonPalette[idx % balloonPalette.length];
            const balloon = document.createElement('button');
            balloon.className = 'balloon';
            balloon.type = 'button';
            balloon.style.background = `radial-gradient(circle at 32% 28%, ${palette.light}, ${palette.base})`;
            balloon.style.color = palette.base;
            balloon.style.animationDuration = `${(2.6 + (idx % 3) * 0.5).toFixed(2)}s`;
            balloon.style.animationDelay = `${(idx * -0.4).toFixed(2)}s`;
            balloon.innerHTML = `
                <span class="balloon-letter">${letter}</span>
                <span class="balloon-knot"></span>
            `;
            balloon.addEventListener('click', () => handlePop(letter, targetLetter, balloon));
            board.appendChild(balloon);
        });
    }

    function buildBalloonLetters(targetLetter) {
        const choices = new Set([targetLetter]);
        while (choices.size < numBalloons) {
            choices.add(letters[Math.floor(Math.random() * letters.length)]);
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    }

    function handlePop(letter, targetLetter, balloonEl) {
        if (busy) return;

        if (letter === targetLetter) {
            busy = true;
            balloonEl.classList.add('pop');
            balloonEl.disabled = true;
            callbacks.onCorrect();

            const rect = balloonEl.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

            setTimeout(() => {
                busy = false;
                render();
            }, 500);
        } else {
            balloonEl.classList.add('wrong');
            callbacks.onWrong();
            setTimeout(() => balloonEl.classList.remove('wrong'), 400);
        }
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
