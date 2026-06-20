/* ============================================
   GAME: Opposite See-Saw
   Drag the opposite item onto the empty pan to balance the seesaw.
   ============================================ */

const Opposites = (() => {
    const id = 'opposites';
    const name = 'Opposite See-Saw';

    const pairs = [
        { a: { emoji: '🔥', word: 'Hot' }, b: { emoji: '❄️', word: 'Cold' } },
        { a: { emoji: '🐘', word: 'Big' }, b: { emoji: '🐜', word: 'Small' } },
        { a: { emoji: '🐆', word: 'Fast' }, b: { emoji: '🐢', word: 'Slow' } },
        { a: { emoji: '😄', word: 'Happy' }, b: { emoji: '😢', word: 'Sad' } },
        { a: { emoji: '☀️', word: 'Day' }, b: { emoji: '🌙', word: 'Night' } },
        { a: { emoji: '⬆️', word: 'Up' }, b: { emoji: '⬇️', word: 'Down' } },
        { a: { emoji: '🔓', word: 'Open' }, b: { emoji: '🔒', word: 'Closed' } },
        { a: { emoji: '💧', word: 'Wet' }, b: { emoji: '🏜️', word: 'Dry' } },
        { a: { emoji: '🟢', word: 'Full' }, b: { emoji: '⚪', word: 'Empty' } },
        { a: { emoji: '📢', word: 'Loud' }, b: { emoji: '🤫', word: 'Quiet' } },
        { a: { emoji: '🆕', word: 'New' }, b: { emoji: '🕰️', word: 'Old' } },
        { a: { emoji: '😃', word: 'Clean' }, b: { emoji: '🤢', word: 'Dirty' } },
    ];

    const levels = [{ rounds: 5 }, { rounds: 5 }, { rounds: 5 }];

    let container, callbacks, currentLevel, round, totalRounds, busy;
    let beamEl, panRightEl, trayEl;

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

    function nextRound() {
        round++;
        busy = false;
        DragSystem.cleanup();

        const pairIdx = Math.floor(Math.random() * pairs.length);
        const pair = pairs[pairIdx];
        const showFirst = Math.random() < 0.5;
        const stimulus = showFirst ? pair.a : pair.b;
        const target = showFirst ? pair.b : pair.a;

        const otherWords = pairs
            .filter((_, i) => i !== pairIdx)
            .map(p => (Math.random() < 0.5 ? p.a : p.b));
        const wrongChoices = [];
        while (wrongChoices.length < 3) {
            const candidate = otherWords[Math.floor(Math.random() * otherWords.length)];
            if (!wrongChoices.includes(candidate) && candidate.word !== target.word) wrongChoices.push(candidate);
        }
        const choices = [target, ...wrongChoices].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="discovery-progress">Round ${round}/${totalRounds}</div>
            <div class="stimulus-card">
                <div class="speech-bubble">Balance the see-saw with the opposite of "${stimulus.word}"!</div>
            </div>
            <div class="seesaw-scene">
                <div class="seesaw-beam" id="seesaw-beam">
                    <div class="seesaw-pan seesaw-pan-left fixed">${stimulus.emoji}</div>
                    <div class="seesaw-pan seesaw-pan-right" id="seesaw-pan-right">?</div>
                </div>
                <div class="seesaw-fulcrum"></div>
            </div>
            <div class="drag-tray" id="seesaw-tray"></div>
        `;

        beamEl = container.querySelector('#seesaw-beam');
        panRightEl = container.querySelector('#seesaw-pan-right');
        trayEl = container.querySelector('#seesaw-tray');

        const dropZones = [{ element: panRightEl, id: 'pan' }];

        choices.forEach((item, i) => {
            const token = document.createElement('div');
            token.className = 'drag-token';
            token.style.animationDelay = `${i * 0.08}s`;
            token.dataset.word = item.word;
            token.textContent = item.emoji;
            trayEl.appendChild(token);
            DragSystem.makeDraggable(token);
        });

        DragSystem.setDropZones(dropZones);
        DragSystem.setOnDrop((dragEl) => handleDrop(dragEl, target));
    }

    function handleDrop(dragEl, target) {
        if (busy) return;

        if (dragEl.dataset.word === target.word) {
            busy = true;
            panRightEl.textContent = target.emoji;
            panRightEl.classList.add('filled');
            beamEl.classList.add('balanced');
            dragEl.classList.add('placed');
            DragSystem.resetPosition(dragEl);
            callbacks.onCorrect();

            const rect = panRightEl.getBoundingClientRect();
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
            beamEl.classList.add('tip');
            setTimeout(() => {
                dragEl.classList.remove('wrong-shake');
                beamEl.classList.remove('tip');
            }, 500);
        }
    }

    function destroy() {
        DragSystem.cleanup();
        if (container) container.innerHTML = '';
    }

    return { id, name, levels, init, destroy };
})();
