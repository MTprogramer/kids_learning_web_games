/* ============================================
   GAME: Ladybug Spot Count
   ============================================ */

const CountingLadybugs = (() => {
    const id = 'counting-ladybugs';
    const name = 'Ladybug Spot Count';
    const numBugs = 4;
    const minCount = 1;
    const maxCount = 8;

    const bugColors = ['#FF6B6B', '#FF8FA3', '#FF7F50', '#E74C3C', '#FF4D6D'];

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

        const target = minCount + Math.floor(Math.random() * maxCount);

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = `🐞 Tap the ladybug with <strong>${target}</strong> spot${target === 1 ? '' : 's'}!`;
        container.appendChild(header);

        const garden = document.createElement('div');
        garden.className = 'ladybug-garden';
        container.appendChild(garden);

        buildCounts(target).forEach((count, idx) => {
            const leaf = document.createElement('div');
            leaf.className = 'ladybug-leaf';

            const bug = document.createElement('button');
            bug.className = 'ladybug';
            bug.type = 'button';
            bug.style.setProperty('--bug-color', bugColors[idx % bugColors.length]);

            const head = document.createElement('span');
            head.className = 'ladybug-head';

            const body = document.createElement('span');
            body.className = 'ladybug-body';

            const wingL = document.createElement('span');
            wingL.className = 'ladybug-wing';
            const wingR = document.createElement('span');
            wingR.className = 'ladybug-wing';

            for (let i = 0; i < count; i++) {
                const spot = document.createElement('span');
                spot.className = 'ladybug-spot';
                (i % 2 === 0 ? wingL : wingR).appendChild(spot);
            }

            body.appendChild(wingL);
            body.appendChild(wingR);
            bug.appendChild(head);
            bug.appendChild(body);
            bug.addEventListener('click', () => handleChoice(count, target, bug));
            leaf.appendChild(bug);
            garden.appendChild(leaf);
        });
    }

    function buildCounts(target) {
        const choices = new Set([target]);
        while (choices.size < numBugs) {
            choices.add(minCount + Math.floor(Math.random() * maxCount));
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    }

    function handleChoice(count, target, el) {
        if (busy) return;

        if (count === target) {
            busy = true;
            el.classList.add('correct');
            el.disabled = true;
            callbacks.onCorrect();
            AudioManager.play('pop');

            const rect = el.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

            setTimeout(() => {
                busy = false;
                render();
            }, 600);
        } else {
            el.classList.add('wrong');
            callbacks.onWrong();
            setTimeout(() => el.classList.remove('wrong'), 400);
        }
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
