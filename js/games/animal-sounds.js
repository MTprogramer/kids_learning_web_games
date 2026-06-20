/* ============================================
   GAME: Sound Match Zoo
   Drag the animal that makes the sound into its cage.
   ============================================ */

const AnimalSounds = (() => {
    const id = 'animal-sounds';
    const name = 'Sound Match Zoo';

    const animals = [
        { emoji: '🐄', sound: 'Moo!' },
        { emoji: '🐶', sound: 'Woof!' },
        { emoji: '🐱', sound: 'Meow!' },
        { emoji: '🦆', sound: 'Quack!' },
        { emoji: '🐑', sound: 'Baa!' },
        { emoji: '🐔', sound: 'Cock-a-doodle-doo!' },
        { emoji: '🐸', sound: 'Croak!' },
        { emoji: '🦁', sound: 'Roar!' },
        { emoji: '🐷', sound: 'Oink!' },
        { emoji: '🐝', sound: 'Buzz!' },
        { emoji: '🐴', sound: 'Neigh!' },
        { emoji: '🦉', sound: 'Hoo!' },
    ];

    const levels = [{ rounds: 5 }, { rounds: 5 }, { rounds: 5 }];

    let container, callbacks, currentLevel, round, totalRounds, busy;
    let cageEl, trayEl;

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

    function pickChoices(target) {
        const pool = animals.filter(a => a !== target);
        const choices = [target];
        while (choices.length < 4) {
            const c = pool[Math.floor(Math.random() * pool.length)];
            if (!choices.includes(c)) choices.push(c);
        }
        return choices.sort(() => Math.random() - 0.5);
    }

    function nextRound() {
        round++;
        busy = false;
        DragSystem.cleanup();

        const target = animals[Math.floor(Math.random() * animals.length)];
        const choices = pickChoices(target);

        container.innerHTML = `
            <div class="discovery-progress">Round ${round}/${totalRounds}</div>
            <div class="stimulus-card">
                <div class="speech-bubble">Who says "${target.sound}"?</div>
            </div>
            <div class="zoo-scene">
                <div class="zoo-cage" id="zoo-cage">
                    <span class="zoo-cage-bars"></span>
                    <span class="zoo-cage-content">❓</span>
                </div>
            </div>
            <div class="drag-tray" id="zoo-tray"></div>
        `;

        cageEl = container.querySelector('#zoo-cage');
        trayEl = container.querySelector('#zoo-tray');

        const dropZones = [{ element: cageEl, id: 'cage' }];

        choices.forEach((animal, i) => {
            const token = document.createElement('div');
            token.className = 'drag-token';
            token.style.animationDelay = `${i * 0.08}s`;
            token.dataset.emoji = animal.emoji;
            token.textContent = animal.emoji;
            trayEl.appendChild(token);
            DragSystem.makeDraggable(token);
        });

        DragSystem.setDropZones(dropZones);
        DragSystem.setOnDrop((dragEl, dropEl, dropId) => handleDrop(dragEl, target));
    }

    function handleDrop(dragEl, target) {
        if (busy) return;

        if (dragEl.dataset.emoji === target.emoji) {
            busy = true;
            cageEl.classList.add('filled');
            cageEl.querySelector('.zoo-cage-content').textContent = target.emoji;
            dragEl.classList.add('placed');
            DragSystem.resetPosition(dragEl);
            callbacks.onCorrect();

            const rect = cageEl.getBoundingClientRect();
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
            cageEl.classList.add('shake-target');
            setTimeout(() => {
                dragEl.classList.remove('wrong-shake');
                cageEl.classList.remove('shake-target');
            }, 400);
        }
    }

    function destroy() {
        DragSystem.cleanup();
        if (container) container.innerHTML = '';
    }

    return { id, name, levels, init, destroy };
})();
