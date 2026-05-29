/* ============================================
   GAME: Shape Puzzle
   ============================================ */

const ShapePuzzle = (() => {
    const id = 'shape-puzzle';

    const shapeData = [
        {
            name: 'Circle', color: '#E74C3C',
            svg: '<circle cx="50" cy="50" r="40"/>',
            outline: '<circle cx="50" cy="50" r="40" class="shape-outline"/>',
        },
        {
            name: 'Square', color: '#3498DB',
            svg: '<rect x="15" y="15" width="70" height="70" rx="4"/>',
            outline: '<rect x="15" y="15" width="70" height="70" rx="4" class="shape-outline"/>',
        },
        {
            name: 'Triangle', color: '#2ECC71',
            svg: '<polygon points="50,10 90,85 10,85"/>',
            outline: '<polygon points="50,10 90,85 10,85" class="shape-outline"/>',
        },
        {
            name: 'Star', color: '#F1C40F',
            svg: '<polygon points="50,5 61,35 95,35 68,55 78,88 50,68 22,88 32,55 5,35 39,35"/>',
            outline: '<polygon points="50,5 61,35 95,35 68,55 78,88 50,68 22,88 32,55 5,35 39,35" class="shape-outline"/>',
        },
        {
            name: 'Heart', color: '#E91E63',
            svg: '<path d="M50 85 C20 60 5 40 15 25 C25 10 45 15 50 30 C55 15 75 10 85 25 C95 40 80 60 50 85Z"/>',
            outline: '<path d="M50 85 C20 60 5 40 15 25 C25 10 45 15 50 30 C55 15 75 10 85 25 C95 40 80 60 50 85Z" class="shape-outline"/>',
        },
        {
            name: 'Rhombus', color: '#9B59B6',
            svg: '<polygon points="50,10 90,50 50,90 10,50"/>',
            outline: '<polygon points="50,10 90,50 50,90 10,50" class="shape-outline"/>',
        },
    ];

    const levels = [
        { shapeCount: 3 },
        { shapeCount: 5 },
        { shapeCount: 6 },
    ];

    let container = null;
    let callbacks = null;
    let placedCount = 0;
    let totalShapes = 0;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        placedCount = 0;

        const config = levels[level - 1];
        totalShapes = config.shapeCount;
        GameEngine.setTotal(totalShapes);

        const shuffled = [...shapeData].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, config.shapeCount);

        // Instruction
        const instruction = document.createElement('div');
        instruction.className = 'game-instruction';
        instruction.textContent = i18n.instructions[id];
        container.appendChild(instruction);

        // Main area
        const mainArea = document.createElement('div');
        mainArea.style.cssText = 'display:flex;gap:24px;align-items:center;justify-content:center;flex-wrap:wrap;width:100%;max-width:700px';

        // Outlines (drop zone)
        const outlineArea = document.createElement('div');
        outlineArea.style.cssText = 'display:flex;flex-wrap:wrap;gap:16px;justify-content:center;flex:1';

        // Shapes (draggable) - shuffle
        const pieceArea = document.createElement('div');
        pieceArea.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;justify-content:center;flex:1';

        const dropZones = [];
        const shuffledPieces = [...selected].sort(() => Math.random() - 0.5);

        selected.forEach((shape, i) => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.style.cssText = 'width:80px;height:80px;display:flex;align-items:center;justify-content:center';
            zone.dataset.shape = shape.name;
            zone.innerHTML = `<svg viewBox="0 0 100 100" width="60" height="60">${shape.outline}</svg>`;
            outlineArea.appendChild(zone);
            dropZones.push({ element: zone, id: shape.name });
        });

        shuffledPieces.forEach((shape, i) => {
            const piece = document.createElement('div');
            piece.className = 'draggable-item';
            piece.dataset.shape = shape.name;
            piece.style.cssText = `width:70px;height:70px;display:flex;align-items:center;justify-content:center;background:white;border-radius:16px;border:2px solid ${shape.color};box-shadow:0 3px 10px rgba(0,0,0,0.1)`;
            piece.innerHTML = `<svg viewBox="0 0 100 100" width="50" height="50"><g fill="${shape.color}">${shape.svg}</g></svg>`;

            // Tap-to-select fallback
            piece.addEventListener('click', () => handleTapSelect(piece, shape.name, dropZones));

            DragSystem.makeDraggable(piece);
            pieceArea.appendChild(piece);
        });

        DragSystem.setDropZones(dropZones);
        DragSystem.setOnDrop((dragEl, dropEl, dropId) => {
            handleDrop(dragEl, dropEl, dropId);
        });

        mainArea.appendChild(outlineArea);
        mainArea.appendChild(pieceArea);
        container.appendChild(mainArea);
    }

    let selectedPiece = null;

    function handleTapSelect(piece, shapeName, dropZones) {
        if (piece.classList.contains('placed')) return;

        if (selectedPiece === piece) {
            piece.style.outline = '';
            selectedPiece = null;
            return;
        }

        if (selectedPiece) selectedPiece.style.outline = '';
        selectedPiece = piece;
        piece.style.outline = '3px solid #3498DB';
    }

    function handleDrop(dragEl, dropEl, dropId) {
        const shapeName = dragEl.dataset.shape;

        if (shapeName === dropId) {
            // Correct match
            dropEl.classList.add('filled');
            dropEl.querySelector('.shape-outline')?.classList.add('filled');

            // Place shape in zone
            dragEl.classList.add('placed');
            dragEl.style.position = 'absolute';
            dragEl.style.opacity = '0';
            dragEl.style.pointerEvents = 'none';

            // Put colored shape inside zone
            const shape = shapeData.find(s => s.name === shapeName);
            if (shape) {
                const filledSvg = document.createElement('div');
                filledSvg.innerHTML = `<svg viewBox="0 0 100 100" width="60" height="60"><g fill="${shape.color}">${shape.svg}</g></svg>`;
                filledSvg.style.animation = 'pop 0.3s var(--ease-spring) both';
                dropEl.innerHTML = '';
                dropEl.appendChild(filledSvg);
            }

            placedCount++;
            callbacks.onCorrect();

            const rect = dropEl.getBoundingClientRect();
            Particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);

            AudioManager.play('pop');

            if (placedCount >= totalShapes) {
                setTimeout(() => callbacks.onComplete(), 600);
            }
        } else {
            // Wrong match
            callbacks.onWrong();
            DragSystem.resetPosition(dragEl);
        }
    }

    function destroy() {
        DragSystem.cleanup();
        selectedPiece = null;
        if (container) container.innerHTML = '';
    }

    return { id, levels, init, destroy };
})();
