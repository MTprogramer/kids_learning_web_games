/* ============================================
   GAME: Coding Adventure - Single Player
   ============================================ */

const CodingAdventure = (() => {
    const id = 'coding-adventure';
    const levels = [
        { gridSize: 3, maxBlocks: 4, blocks: ['UP', 'DOWN', 'LEFT', 'RIGHT'], rounds: 3 },
        { gridSize: 4, maxBlocks: 6, blocks: ['UP', 'DOWN', 'LEFT', 'RIGHT', 'REPEAT'], rounds: 3 },
        { gridSize: 5, maxBlocks: 8, blocks: ['UP', 'DOWN', 'LEFT', 'RIGHT', 'REPEAT'], rounds: 3 },
    ];

    let container = null;
    let callbacks = null;
    let currentLevel = null;
    let currentRound = 0;
    let totalRounds = 0;
    let sequence = [];
    let puzzle = null;
    let usedPuzzleIndices = [];
    let isExecuting = false;
    let roundResults = []; // block count and optimal for each round

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        currentLevel = levels[level - 1];
        currentRound = 0;
        totalRounds = currentLevel.rounds;
        usedPuzzleIndices = [];
        roundResults = [];
        isExecuting = false;

        GameEngine.setTotal(totalRounds);
        document.addEventListener('keydown', spKeyHandler);
        nextRound();
    }

    function spKeyHandler(e) {
        const keyMap = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
        const move = keyMap[e.key];
        if (move && !isExecuting) {
            e.preventDefault();
            if (sequence.length < currentLevel.maxBlocks) {
                sequence.push(move);
                renderGame();
            }
        }
        if (e.key === 'Enter' && !isExecuting && sequence.length > 0) {
            e.preventDefault();
            onPlay();
        }
        if (e.key === 'Backspace' && !isExecuting) {
            e.preventDefault();
            sequence.pop();
            renderGame();
        }
    }

    function nextRound() {
        currentRound++;
        sequence = [];
        isExecuting = false;

        // Select puzzle
        const levelIdx = levels.indexOf(currentLevel) + 1;
        puzzle = CodingAdventureCore.getPuzzle(levelIdx, usedPuzzleIndices);
        const pidx = CodingAdventureCore.getPuzzleIndex(levelIdx, puzzle);
        if (pidx >= 0) usedPuzzleIndices.push(pidx);

        renderGame();
    }

    function renderGame() {
        container.innerHTML = '';

        // Instruction
        const instruction = document.createElement('div');
        instruction.className = 'game-instruction';
        instruction.textContent = i18n.instructions[id];
        container.appendChild(instruction);

        // Grid
        const gridEl = CodingAdventureCore.renderGrid(
            container, puzzle,
            { x: puzzle.start.x, y: puzzle.start.y }
        );

        // Program area
        CodingAdventureCore.renderProgramArea(
            container,
            currentLevel.maxBlocks,
            sequence,
            onRemoveBlock,
            onPlay,
            onReset
        );

        // Block palette
        CodingAdventureCore.renderBlockPalette(
            container,
            currentLevel.blocks,
            onBlockSelect
        );

        // Status
        const status = document.createElement('div');
        status.className = 'kod-status';
        status.innerHTML = `
            <span>${i18n.kodMacerasi.round}: ${currentRound}/${totalRounds}</span>
            <span>${i18n.kodMacerasi.blocksUsed}: ${sequence.length}/${currentLevel.maxBlocks}</span>
        `;
        container.appendChild(status);

        updatePaletteState();
    }

    function onBlockSelect(type) {
        if (isExecuting) return;
        if (sequence.length >= currentLevel.maxBlocks) return;

        sequence.push(type);
        renderGame();
    }

    function onRemoveBlock(index) {
        if (isExecuting) return;
        sequence.splice(index, 1);
        renderGame();
    }

    function onReset() {
        if (isExecuting) return;
        sequence = [];
        renderGame();
    }

    function onPlay() {
        if (isExecuting || sequence.length === 0) return;
        isExecuting = true;

        // Disable play button
        const playBtn = container.querySelector('.kod-play-btn');
        if (playBtn) playBtn.disabled = true;
        const resetBtn = container.querySelector('.kod-reset-btn');
        if (resetBtn) resetBtn.style.display = 'none';

        // Disable palette
        container.querySelectorAll('.kod-block-btn').forEach(b => b.classList.add('disabled'));

        // Execute sequence
        const result = CodingAdventureCore.executeSequence(
            puzzle, sequence,
            { x: puzzle.start.x, y: puzzle.start.y }
        );

        const gridEl = container.querySelector('.kod-grid');

        CodingAdventureCore.animateExecution(gridEl, result.path, puzzle,
            (step, p) => {
                // Sound on each step
                if (p.action === 'move') AudioManager.play('tap');
                else if (p.action === 'turn') AudioManager.play('flip');
            },
            (lastStep) => {
                if (result.success) {
                    // Success!
                    AudioManager.play('levelComplete');
                    const gridRect = gridEl.getBoundingClientRect();
                    Particles.sparkle(gridRect.left + gridRect.width / 2, gridRect.top + gridRect.height / 2, 8);

                    roundResults.push({
                        blocks: sequence.length,
                        optimal: puzzle.optimal,
                    });

                    callbacks.onCorrect();

                    if (currentRound >= totalRounds) {
                        // Level complete
                        const stars = calculateStars();
                        setTimeout(() => callbacks.onComplete(stars), 600);
                    } else {
                        // Next round
                        setTimeout(() => nextRound(), 1000);
                    }
                } else {
                    // Failure
                    AudioManager.play('error');
                    callbacks.onWrong();

                    // Show error message
                    const msg = document.createElement('div');
                    msg.className = 'game-instruction';
                    msg.style.color = 'var(--error)';
                    msg.style.fontWeight = '700';
                    msg.textContent = result.error === 'crashed'
                        ? i18n.kodMacerasi.crashed
                        : result.error === 'outOfBounds'
                        ? i18n.kodMacerasi.outOfBounds
                        : i18n.kodMacerasi.notReached;

                    const existing = container.querySelector('.game-instruction');
                    if (existing) existing.replaceWith(msg);

                    // Reset after 1.5s
                    setTimeout(() => {
                        isExecuting = false;
                        renderGame();
                    }, 1500);
                }
            }
        );
    }

    function updatePaletteState() {
        const full = sequence.length >= currentLevel.maxBlocks;
        container.querySelectorAll('.kod-block-btn').forEach(btn => {
            if (full) btn.classList.add('disabled');
            else btn.classList.remove('disabled');
        });
    }

    function calculateStars() {
        if (roundResults.length === 0) return 1;

        let totalExcess = 0;
        roundResults.forEach(r => {
            totalExcess += Math.max(0, r.blocks - r.optimal);
        });

        const avgExcess = totalExcess / roundResults.length;

        if (avgExcess <= 0) return 3;     // All rounds optimal
        if (avgExcess <= 1.5) return 2;   // Average 1-2 extra blocks
        return 1;                          // Too many blocks used
    }

    function destroy() {
        document.removeEventListener('keydown', spKeyHandler);
        if (container) container.innerHTML = '';
        sequence = [];
        isExecuting = false;
    }

    return { id, levels, init, destroy };
})();
