/* ============================================
   GAME: Alphabet Train
   ============================================ */

const AlphabetTrain = (() => {
    const id = 'alphabet-train';
    const name = 'Alphabet Train';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numDistractors = 4;

    const letterEmojis = {
        A: '🍎', B: '🐝', C: '🐱', D: '🐶', E: '🥚', F: '🐸',
        G: '🦒', H: '🏠', I: '🍦', J: '🧃', K: '🦘', L: '🦁',
        M: '🌝', N: '🌙', O: '🐙', P: '🍕', Q: '👑', R: '🤖',
        S: '🐍', T: '🌮', U: '☂️', V: '🎻', W: '🍉', X: '❌',
        Y: '🛹', Z: '⚡'
    };

    const wagonColors = [
        { bg: 'linear-gradient(160deg, #FFE3CC 0%, #FFB37A 100%)', border: '#E8590C' },
        { bg: 'linear-gradient(160deg, #FFF3C4 0%, #FFD93C 100%)', border: '#E0A800' },
        { bg: 'linear-gradient(160deg, #D6F5D0 0%, #8CE89A 100%)', border: '#2E9E45' },
        { bg: 'linear-gradient(160deg, #D2ECFF 0%, #84C2FF 100%)', border: '#1E73C9' },
        { bg: 'linear-gradient(160deg, #F0D9FF 0%, #D49CFF 100%)', border: '#9333D6' },
        { bg: 'linear-gradient(160deg, #FFD6E5 0%, #FF8FB6 100%)', border: '#E8467E' }
    ];

    let container = null;
    let callbacks = null;
    let trackEl = null;
    let trackWrapEl = null;
    let currentIndex = 0;
    let busy = false;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        currentIndex = 0;
        busy = false;
        GameEngine.setTotal(0);
        render();
    }

    function render() {
        container.innerHTML = '';

        const targetLetter = letters[currentIndex];

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.textContent = currentIndex === 0
            ? `All aboard! Tap letter ${targetLetter} to start the alphabet train.`
            : 'Choo choo! Which letter comes next on the train?';
        container.appendChild(header);

        const board = document.createElement('div');
        board.className = 'alphabet-train-board';
        container.appendChild(board);

        trackWrapEl = document.createElement('div');
        trackWrapEl.className = 'train-track-wrap';
        board.appendChild(trackWrapEl);

        trackEl = document.createElement('div');
        trackEl.className = 'train-track';
        trackWrapEl.appendChild(trackEl);

        const engine = document.createElement('div');
        engine.className = 'train-engine';
        engine.textContent = '🚂';
        trackEl.appendChild(engine);

        for (let i = 0; i < currentIndex; i++) {
            trackEl.appendChild(createWagon(letters[i], i));
        }

        const progress = document.createElement('div');
        progress.className = 'train-progress';
        progress.textContent = `${currentIndex} / ${letters.length}`;
        board.appendChild(progress);

        const choicesWrap = document.createElement('div');
        choicesWrap.className = 'wagon-choices';
        board.appendChild(choicesWrap);

        buildChoices(targetLetter).forEach((letter, idx) => {
            const btn = document.createElement('button');
            btn.className = 'wagon-choice';
            btn.setAttribute('type', 'button');
            const theme = wagonColors[idx % wagonColors.length];
            btn.style.background = theme.bg;
            btn.style.borderColor = theme.border;
            btn.innerHTML = `
                <span class="wagon-emoji">${letterEmojis[letter] || '🔤'}</span>
                <span class="wagon-letter">${letter}</span>
            `;
            btn.addEventListener('click', () => handleChoice(letter, targetLetter, btn));
            choicesWrap.appendChild(btn);
        });

        scrollTrackToEnd();
    }

    function createWagon(letter, index) {
        const wagon = document.createElement('div');
        wagon.className = 'train-wagon placed';
        const theme = wagonColors[index % wagonColors.length];
        wagon.style.background = theme.bg;
        wagon.style.borderColor = theme.border;
        wagon.textContent = letter;
        return wagon;
    }

    function buildChoices(targetLetter) {
        const choices = new Set([targetLetter]);
        while (choices.size < numDistractors + 1) {
            choices.add(letters[Math.floor(Math.random() * letters.length)]);
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    }

    function handleChoice(letter, targetLetter, btn) {
        if (busy) return;

        if (letter === targetLetter) {
            busy = true;
            btn.classList.add('correct');
            btn.disabled = true;
            callbacks.onCorrect();
            AudioManager.play('snap');

            const rect = btn.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

            const newWagon = createWagon(targetLetter, currentIndex);
            newWagon.classList.add('train-wagon-pop');
            trackEl.appendChild(newWagon);
            scrollTrackToEnd();

            currentIndex++;

            setTimeout(() => {
                busy = false;
                if (currentIndex >= letters.length) {
                    showCelebration();
                } else {
                    render();
                }
            }, 700);
        } else {
            btn.classList.add('wrong');
            callbacks.onWrong();
            setTimeout(() => btn.classList.remove('wrong'), 400);
        }
    }

    function scrollTrackToEnd() {
        if (trackWrapEl) {
            trackWrapEl.scrollLeft = trackWrapEl.scrollWidth;
        }
    }

    function showCelebration() {
        AudioManager.play('levelComplete');
        container.innerHTML = '';
        const celebration = document.createElement('div');
        celebration.className = 'train-celebration';
        celebration.innerHTML = `
            <div class="train-celebration-emoji">🎉🚂🎉</div>
            <div class="train-celebration-text">All aboard! You finished the whole alphabet!</div>
        `;
        container.appendChild(celebration);

        setTimeout(() => {
            currentIndex = 0;
            render();
        }, 2200);
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
