/* ============================================
   GAME: Rocket Number Climb
   Drag the correct number balloon into the missing rung to launch the rocket.
   ============================================ */

const NumberSequence = (() => {
    const id = 'number-sequence';
    const name = 'Rocket Number Climb';

    const levels = [
        { steps: [1], maxStart: 10, rounds: 5 },
        { steps: [1, 2], maxStart: 15, rounds: 5 },
        { steps: [1, 2, 3], maxStart: 25, rounds: 5 },
    ];

    let container, callbacks, currentLevel, round, totalRounds, busy;
    let unknownRungEl, rocketEl, trayEl;

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

    function generateSequence() {
        const { steps, maxStart } = currentLevel;
        const step = steps[Math.floor(Math.random() * steps.length)];
        const start = 1 + Math.floor(Math.random() * maxStart);
        const seq = [start, start + step, start + step * 2, start + step * 3];
        const answer = start + step * 4;
        return { seq, answer };
    }

    function generateChoices(answer) {
        const choices = new Set([answer]);
        while (choices.size < 4) {
            const offset = Math.floor(Math.random() * 7) - 3;
            const wrong = answer + (offset === 0 ? 4 : offset);
            if (wrong > 0 && wrong !== answer) choices.add(wrong);
        }
        return [...choices].sort(() => Math.random() - 0.5);
    }

    function nextRound() {
        round++;
        busy = false;
        DragSystem.cleanup();

        const { seq, answer } = generateSequence();
        const choices = generateChoices(answer);

        container.innerHTML = `
            <div class="discovery-progress">Round ${round}/${totalRounds}</div>
            <div class="stimulus-card">
                <div class="speech-bubble">Climb the ladder! What number comes next?</div>
            </div>
            <div class="rocket-scene">
                <div class="rocket-ladder">
                    ${seq.map((n, i) => `<div class="rocket-rung" style="animation-delay:${i * 0.08}s">${n}</div>`).join('')}
                    <div class="rocket-rung unknown" id="rocket-unknown">?</div>
                </div>
                <div class="rocket-pad" id="rocket-pad">🚀</div>
            </div>
            <div class="drag-tray" id="rocket-tray"></div>
        `;

        unknownRungEl = container.querySelector('#rocket-unknown');
        rocketEl = container.querySelector('#rocket-pad');
        trayEl = container.querySelector('#rocket-tray');

        const dropZones = [{ element: unknownRungEl, id: 'rung' }];

        choices.forEach((n, i) => {
            const token = document.createElement('div');
            token.className = 'drag-token';
            token.style.animationDelay = `${i * 0.08}s`;
            token.dataset.value = n;
            token.textContent = n;
            trayEl.appendChild(token);
            DragSystem.makeDraggable(token);
        });

        DragSystem.setDropZones(dropZones);
        DragSystem.setOnDrop((dragEl) => handleDrop(dragEl, answer));
    }

    function handleDrop(dragEl, answer) {
        if (busy) return;

        if (parseInt(dragEl.dataset.value, 10) === answer) {
            busy = true;
            unknownRungEl.textContent = answer;
            unknownRungEl.classList.add('filled');
            dragEl.classList.add('placed');
            DragSystem.resetPosition(dragEl);
            callbacks.onCorrect();

            rocketEl.classList.add('launching');
            const rect = rocketEl.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top, 16);

            setTimeout(() => {
                if (round >= totalRounds) {
                    callbacks.onComplete();
                } else {
                    nextRound();
                }
            }, 1100);
        } else {
            callbacks.onWrong();
            dragEl.classList.add('wrong-shake');
            DragSystem.resetPosition(dragEl);
            unknownRungEl.classList.add('shake-target');
            setTimeout(() => {
                dragEl.classList.remove('wrong-shake');
                unknownRungEl.classList.remove('shake-target');
            }, 400);
        }
    }

    function destroy() {
        DragSystem.cleanup();
        if (container) container.innerHTML = '';
    }

    return { id, name, levels, init, destroy };
})();
