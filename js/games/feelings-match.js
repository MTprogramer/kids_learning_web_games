/* ============================================
   GAME: Feelings Theater
   Watch the puppet act it out, then drag the matching face mask onto it.
   ============================================ */

const FeelingsMatch = (() => {
    const id = 'feelings-match';
    const name = 'Feelings Theater';

    const feelings = [
        { key: 'happy', emoji: '😄', word: 'Happy' },
        { key: 'sad', emoji: '😢', word: 'Sad' },
        { key: 'angry', emoji: '😡', word: 'Angry' },
        { key: 'scared', emoji: '😱', word: 'Scared' },
        { key: 'sleepy', emoji: '😴', word: 'Sleepy' },
        { key: 'surprised', emoji: '😲', word: 'Surprised' },
    ];

    const scenarios = [
        { text: 'She got a brand new puppy! 🐶', feeling: 'happy' },
        { text: 'His ice cream fell on the ground. 🍦', feeling: 'sad' },
        { text: 'Someone broke his favorite toy. 🧸', feeling: 'angry' },
        { text: 'A loud thunder just crashed! ⛈️', feeling: 'scared' },
        { text: 'It is way past bedtime. 🌙', feeling: 'sleepy' },
        { text: 'A surprise party jumped out! 🎉', feeling: 'surprised' },
        { text: 'She won first place in the race! 🏆', feeling: 'happy' },
        { text: 'He lost his balloon in the sky. 🎈', feeling: 'sad' },
        { text: 'Her little brother messed up her drawing. 🎨', feeling: 'angry' },
        { text: 'A spider just crawled on the table! 🕷️', feeling: 'scared' },
        { text: 'It is naptime after a long day. 😪', feeling: 'sleepy' },
        { text: 'A magician pulled a rabbit from a hat! 🎩', feeling: 'surprised' },
    ];

    const levels = [{ rounds: 5 }, { rounds: 5 }, { rounds: 5 }];

    let container, callbacks, currentLevel, round, totalRounds, busy;
    let characterEl, trayEl;

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

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const target = feelings.find(f => f.key === scenario.feeling);
        const pool = feelings.filter(f => f.key !== target.key);
        const choices = [target];
        while (choices.length < 4) {
            const c = pool[Math.floor(Math.random() * pool.length)];
            if (!choices.includes(c)) choices.push(c);
        }
        choices.sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="discovery-progress">Round ${round}/${totalRounds}</div>
            <div class="stimulus-card">
                <div class="speech-bubble">${scenario.text}</div>
            </div>
            <div class="theater-stage">
                <span class="theater-curtain left"></span>
                <span class="theater-curtain right"></span>
                <div class="theater-character act-${target.key}" id="theater-character">🙂</div>
            </div>
            <div class="drag-tray" id="theater-tray"></div>
        `;

        characterEl = container.querySelector('#theater-character');
        trayEl = container.querySelector('#theater-tray');

        const dropZones = [{ element: characterEl, id: 'character' }];

        choices.forEach((f, i) => {
            const token = document.createElement('div');
            token.className = 'drag-token';
            token.style.animationDelay = `${i * 0.08}s`;
            token.dataset.key = f.key;
            token.textContent = f.emoji;
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
            characterEl.textContent = target.emoji;
            characterEl.classList.remove(`act-${target.key}`);
            characterEl.classList.add('masked');
            dragEl.classList.add('placed');
            DragSystem.resetPosition(dragEl);
            callbacks.onCorrect();
            AudioManager.play('chime');

            const rect = characterEl.getBoundingClientRect();
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
            setTimeout(() => dragEl.classList.remove('wrong-shake'), 400);
        }
    }

    function destroy() {
        DragSystem.cleanup();
        if (container) container.innerHTML = '';
    }

    return { id, name, levels, init, destroy };
})();
