/* ============================================
   GAME: Canvas - Pixel Coloring (Free Drawing)
   3 levels: 10x10, 15x15, 20x20
   Drag-to-paint, eraser, level transition
   ============================================ */

const Canvas = (() => {
    const id = 'canvas';
    const levels = [
        { gridSize: 10, name: 'Small Canvas' },
        { gridSize: 15, name: 'Medium Canvas' },
        { gridSize: 20, name: 'Large Canvas' },
    ];

    const COLORS = [
        '#E74C3C', '#3498DB', '#F1C40F', '#2ECC71',
        '#E67E22', '#9B59B6', '#FF69B4', '#8B4513',
        '#1ABC9C', '#000000', '#87CEEB', '#FFD700',
        '#FF6348', '#A55EEA', '#26DE81', '#FFFFFF',
    ];

    let container = null;
    let callbacks = null;
    let currentColor = '#E74C3C';
    let isEraser = false;
    let isPainting = false;
    let gridSize = 10;
    let currentLevel = 1;
    let grid = []; // 2D color array

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        currentLevel = level;
        gridSize = levels[level - 1].gridSize;
        currentColor = COLORS[0];
        isEraser = false;
        isPainting = false;
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('#FFFFFF'));

        GameEngine.setTotal(1);
        render();
    }

    function render() {
        container.innerHTML = '';

        // Level transition buttons
        const lvBar = document.createElement('div');
        lvBar.className = 'canvas-lvbar';
        levels.forEach((lv, idx) => {
            const btn = document.createElement('button');
            btn.className = `canvas-lv-btn ${idx + 1 === currentLevel ? 'active' : ''}`;
            btn.textContent = `Lv ${idx + 1}`;
            btn.addEventListener('click', () => {
                AudioManager.play('tap');
                currentLevel = idx + 1;
                gridSize = lv.gridSize;
                grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('#FFFFFF'));
                render();
            });
            lvBar.appendChild(btn);
        });
        container.appendChild(lvBar);

        // Canvas area
        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'canvas-wrap';

        const canvasEl = document.createElement('div');
        canvasEl.className = `canvas-grid canvas-${gridSize}`;
        canvasEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'canvas-cell';
                cell.style.background = grid[r][c];
                cell.dataset.r = r;
                cell.dataset.c = c;

                cell.addEventListener('pointerdown', (e) => {
                    isPainting = true;
                    paintCell(r, c, cell);
                    e.preventDefault();
                });
                cell.addEventListener('pointerenter', () => {
                    if (isPainting) paintCell(r, c, cell);
                });
                canvasEl.appendChild(cell);
            }
        }

        // Pointer up on document
        document.addEventListener('pointerup', stopPainting);

        canvasWrap.appendChild(canvasEl);
        container.appendChild(canvasWrap);

        // Color palette
        const paletteDiv = document.createElement('div');
        paletteDiv.className = 'canvas-palette';

        COLORS.forEach(color => {
            const swatch = document.createElement('button');
            swatch.className = `canvas-swatch ${color === currentColor && !isEraser ? 'active' : ''}`;
            swatch.style.background = color;
            if (color === '#FFFFFF') swatch.style.border = '2px solid #DDD';

            swatch.addEventListener('click', () => {
                currentColor = color;
                isEraser = false;
                updatePaletteActive(paletteDiv);
                AudioManager.play('tap');
            });
            paletteDiv.appendChild(swatch);
        });
        container.appendChild(paletteDiv);

        // Tools
        const tools = document.createElement('div');
        tools.className = 'canvas-tools';

        const eraserBtn = document.createElement('button');
        eraserBtn.className = `canvas-tool-btn ${isEraser ? 'active' : ''}`;
        eraserBtn.innerHTML = '🧹 Eraser';
        eraserBtn.addEventListener('click', () => {
            isEraser = true;
            updatePaletteActive(paletteDiv);
            eraserBtn.classList.add('active');
            AudioManager.play('tap');
        });
        tools.appendChild(eraserBtn);

        const clearBtn = document.createElement('button');
        clearBtn.className = 'canvas-tool-btn danger';
        clearBtn.innerHTML = '🗑️ Clear';
        clearBtn.addEventListener('click', () => {
            grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('#FFFFFF'));
            AudioManager.play('tap');
            render();
        });
        tools.appendChild(clearBtn);

        container.appendChild(tools);
    }

    function paintCell(r, c, cellEl) {
        const color = isEraser ? '#FFFFFF' : currentColor;
        grid[r][c] = color;
        cellEl.style.background = color;
    }

    function stopPainting() {
        isPainting = false;
    }

    function updatePaletteActive(paletteDiv) {
        paletteDiv.querySelectorAll('.canvas-swatch').forEach(s => s.classList.remove('active'));
        if (!isEraser) {
            paletteDiv.querySelectorAll('.canvas-swatch').forEach(s => {
                if (s.style.background === currentColor || rgbToHex(s.style.background) === currentColor.toLowerCase()) {
                    s.classList.add('active');
                }
            });
        }
    }

    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb.toLowerCase();
        const match = rgb.match(/\d+/g);
        if (!match) return rgb;
        return '#' + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    }

    function destroy() {
        document.removeEventListener('pointerup', stopPainting);
        if (container) container.innerHTML = '';
    }

    return { id, levels, init, destroy };
})();
