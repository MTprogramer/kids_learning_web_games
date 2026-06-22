/* ============================================
   GAME: Letter Recognition
   ============================================ */

const LetterRecognition = (() => {
    const id = 'letter-recognition';

    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const commonConsonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

    const levels = [
        { letters: vowels, optionCount: 4, rounds: 5 },
        { letters: commonConsonants.slice(0, 8), optionCount: 4, rounds: 5 },
        { letters: [...vowels, ...commonConsonants], optionCount: 4, rounds: 6 },
    ];

    let container = null;
    let callbacks = null;
    let roundsPlayed = 0;
    let totalRounds = 5;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        roundsPlayed = 0;
        totalRounds = levels[level - 1].rounds;
        GameEngine.setTotal(totalRounds);
        startRound(level);
    }

    function startRound(level) {
        container.innerHTML = '';
        const config = levels[level - 1];

        // Filter letters that have images in i18n
        const availableLetters = config.letters.filter(l => i18n.letterImages[l] && i18n.letterImages[l].length > 0);
        if (availableLetters.length === 0) return;

        const targetLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

        // Instruction - using i18n with placeholder
        const instruction = document.createElement('div');
        instruction.className = 'game-instruction';
        const instrTemplate = i18n.instructions['letter-recognition'] || 'Find the picture starting with the letter "{letter}"!';
        instruction.textContent = instrTemplate.replace('{letter}', targetLetter);
        container.appendChild(instruction);

        // Letter display
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter-display';
        letterDiv.textContent = targetLetter;
        container.appendChild(letterDiv);

        // Options selection logic
        const options = [];

        // 1. Get all potential correct options for this letter
        const correctPool = i18n.letterImages[targetLetter];
        const shuffledCorrect = [...correctPool].sort(() => Math.random() - 0.5);

        // 2. Add at least one correct option, and possibly more if they fit
        // To keep the game challenging, we'll show 1 to 2 correct options
        const numCorrectToShow = Math.min(shuffledCorrect.length, Math.floor(Math.random() * 2) + 1);
        for (let i = 0; i < numCorrectToShow; i++) {
            options.push(shuffledCorrect[i]);
        }

        // 3. Fill the rest with wrong options from other letters
        const wrongLetters = availableLetters.filter(l => l !== targetLetter);
        const shuffledWrongLetters = [...wrongLetters].sort(() => Math.random() - 0.5);

        let wIdx = 0;
        while (options.length < config.optionCount && wIdx < shuffledWrongLetters.length) {
            const wLetter = shuffledWrongLetters[wIdx];
            const wPool = i18n.letterImages[wLetter];
            if (wPool && wPool.length > 0) {
                const wOption = wPool[Math.floor(Math.random() * wPool.length)];
                // Ensure this word doesn't actually start with target letter
                if (!wOption.word.toUpperCase().startsWith(targetLetter.toUpperCase())) {
                    options.push(wOption);
                }
            }
            wIdx++;
        }

        // Shuffle the final selection
        options.sort(() => Math.random() - 0.5);

        // Option cards
        const optionsDiv = document.createElement('div');
        optionsDiv.style.display = 'flex';
        optionsDiv.style.flexWrap = 'wrap';
        optionsDiv.style.gap = '16px';
        optionsDiv.style.justifyContent = 'center';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'game-option-btn';
            btn.style.flexDirection = 'column';
            btn.style.width = '110px';
            btn.style.height = '120px';
            btn.style.display = 'flex';
            btn.innerHTML = `
                <span style="font-size:2.5rem;margin-bottom:4px">${opt.emoji}</span>
                <span style="font-size:0.85rem;color:#666">${opt.word}</span>
            `;

            btn.addEventListener('click', () => {
                if (btn.disabled) return;

                // Source of truth: check if the word starts with the target letter
                const isCorrect = opt.word.toUpperCase().startsWith(targetLetter.toUpperCase());

                if (isCorrect) {
                    btn.classList.add('correct');
                    // Disable all buttons immediately
                    optionsDiv.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);

                    callbacks.onCorrect();
                    AudioManager.play('chime');

                    const rect = btn.getBoundingClientRect();
                    Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);

                    roundsPlayed++;
                    if (roundsPlayed >= totalRounds) {
                        setTimeout(() => callbacks.onComplete(), 600);
                    } else {
                        setTimeout(() => startRound(GameEngine.getCurrentLevel()), 800);
                    }
                } else {
                    btn.classList.add('wrong');
                    callbacks.onWrong();
                    setTimeout(() => btn.classList.remove('wrong'), 500);
                }
            });

            optionsDiv.appendChild(btn);
        });

        container.appendChild(optionsDiv);
    }

    function destroy() {
        if (container) container.innerHTML = '';
    }

    return { id, levels, init, destroy };
})();
