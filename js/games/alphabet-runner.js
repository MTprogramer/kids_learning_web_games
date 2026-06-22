/* ============================================
   GAME: Alphabet Runner
   ============================================ */

const AlphabetRunner = (() => {
    const id = 'alphabet-runner';
    const name = 'Alphabet Runner';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const baseOptions = 5;
    const baseSpeed = 2.4;
    const speedGain = 0.08;

    const letterEmojis = {
        A: '🍎', B: '🐝', C: '🐱', D: '🐶', E: '🥚', F: '🐸',
        G: '🦒', H: '🏠', I: '🍦', J: '🧃', K: '🦘', L: '🦁',
        M: '🌝', N: '🌙', O: '🐙', P: '🍕', Q: '👑', R: '🤖',
        S: '🐍', T: '🌮', U: '☂️', V: '🎻', W: '🍉', X: '❌',
        Y: '🛹', Z: '⚡'
    };

    const bubbleColors = [
        { bg: 'radial-gradient(circle, #FFFBCC 0%, #FFE07A 100%)', border: '#F1C40F' },
        { bg: 'radial-gradient(circle, #E8F8F5 0%, #7CE2D7 100%)', border: '#1ABC9C' },
        { bg: 'radial-gradient(circle, #FDE8FF 0%, #E79CFD 100%)', border: '#9B59B6' },
        { bg: 'radial-gradient(circle, #FFEBF0 0%, #FF8DA1 100%)', border: '#E84393' },
        { bg: 'radial-gradient(circle, #E5F7FF 0%, #6BC1FF 100%)', border: '#3498DB' },
        { bg: 'radial-gradient(circle, #E8FFE7 0%, #8DE88C 100%)', border: '#27AE60' }
    ];

    let container = null;
    let callbacks = null;
    let roundsPlayed = 0;
    let animationTimer = null;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        roundsPlayed = 0;
        GameEngine.setTotal(0);
        startRound();
    }

    function startRound() {
        clearAnimation();
        container.innerHTML = '';
        const targetLetter = letters[Math.floor(Math.random() * letters.length)];
        const currentSpeed = baseSpeed + Math.min(roundsPlayed, 30) * speedGain;
        const choices = new Set([targetLetter]);
        while (choices.size < baseOptions) {
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            if (!choices.has(randomLetter)) {
                choices.add(randomLetter);
            }
        }

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.textContent = `Catch the moving letter ${targetLetter}! Tap the correct bubble.`;
        container.appendChild(header);

        const board = document.createElement('div');
        board.className = 'alphabet-runner-board';
        container.appendChild(board);

        const bubbleItems = [];
        Array.from(choices)
            .sort(() => Math.random() - 0.5)
            .forEach((letter, index) => {
                const bubble = document.createElement('button');
                bubble.className = 'alphabet-bubble';
                bubble.innerHTML = `
                    <span class="bubble-emoji">${letterEmojis[letter] || '🔤'}</span>
                    <span class="bubble-letter">${letter}</span>
                `;
                bubble.setAttribute('type', 'button');
                const theme = bubbleColors[index % bubbleColors.length];
                bubble.style.background = theme.bg;
                bubble.style.borderColor = theme.border;
                bubble.style.color = '#2D3436';
                board.appendChild(bubble);

                const item = {
                    el: bubble,
                    letter,
                    x: Math.random() * 220,
                    y: Math.random() * 180,
                    vx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1) * currentSpeed,
                    vy: (Math.random() * 1.4 + 0.6) * (Math.random() < 0.5 ? 1 : -1) * currentSpeed
                };

                bubble.style.left = `${item.x}px`;
                bubble.style.top = `${item.y}px`;

                bubble.addEventListener('click', () => {
                    if (bubble.disabled) return;
                    if (letter === targetLetter) {
                        bubble.classList.add('correct');
                        bubble.disabled = true;
                        bubble.style.transform = 'scale(1.12)';
                        bubble.style.opacity = '0.95';
                        callbacks.onCorrect();
                        AudioManager.play('pop');
                        const rect = bubble.getBoundingClientRect();
                        Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
                        roundsPlayed++;
                        clearAnimation();
                        setTimeout(() => {
                            startRound();
                        }, 700);
                    } else {
                        bubble.classList.add('wrong');
                        callbacks.onWrong();
                        setTimeout(() => bubble.classList.remove('wrong'), 400);
                    }
                });

                bubbleItems.push(item);
            });

        animateBubbles(board, bubbleItems);
    }

    function animateBubbles(board, items) {
        clearAnimation();
        animationTimer = setInterval(() => {
            const bounds = board.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;
            items.forEach(item => {
                item.x += item.vx;
                item.y += item.vy;

                if (item.x <= 0 || item.x >= bounds.width - 96) {
                    item.vx *= -1;
                    item.x = Math.max(0, Math.min(item.x, bounds.width - 96));
                }
                if (item.y <= 0 || item.y >= bounds.height - 96) {
                    item.vy *= -1;
                    item.y = Math.max(0, Math.min(item.y, bounds.height - 96));
                }

                item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;
            });
        }, 50);
    }

    function clearAnimation() {
        if (animationTimer) {
            clearInterval(animationTimer);
            animationTimer = null;
        }
    }

    function destroy() {
        clearAnimation();
        if (container) container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
