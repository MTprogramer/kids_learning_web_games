/* ============================================
   GAME: Emoji Maker
   Select face parts (eyes, mouth, brows, accessories) and
   combine them to create a unique emoji/face. All parts
   are drawn with SVG (no pre-made emoji characters used).
   ============================================ */

const EmojiMaker = (() => {
    const id = 'emoji-maker';
    const levels = [{}];
    const svgNS = 'http://www.w3.org/2000/svg';
    const STROKE = '#2b2b2b';

    // Face color palette
    const COLORS = [
        '#FFD93D', '#FFB04D', '#FF8FAB', '#B5E48C',
        '#A0C4FF', '#BDB2FF', '#FF6B6B', '#7BDFF2',
        '#FF9F1C', '#06D6A0', '#EF476F', '#C77DFF',
        '#FFADAD', '#48CAE4', '#F15BB5', '#9EE493',
    ];

    // ---- SVG helper path generators ----
    function heartPath(cx, cy, s) {
        return `M${cx},${cy + s * 0.95} C${cx - s * 1.5},${cy - s * 0.5} ${cx - s * 0.55},${cy - s * 1.4} ${cx},${cy - s * 0.45} C${cx + s * 0.55},${cy - s * 1.4} ${cx + s * 1.5},${cy - s * 0.5} ${cx},${cy + s * 0.95} Z`;
    }
    function starPath(cx, cy, r) {
        let p = '';
        for (let i = 0; i < 10; i++) {
            const ang = -Math.PI / 2 + i * Math.PI / 5;
            const rr = i % 2 === 0 ? r : r * 0.45;
            const x = (cx + Math.cos(ang) * rr).toFixed(1);
            const y = (cy + Math.sin(ang) * rr).toFixed(1);
            p += (i === 0 ? 'M' : 'L') + x + ',' + y;
        }
        return p + 'Z';
    }

    // ---- Part sets ---- (each part: draw = [[tag, attrs], ...])
    const SHAPES = [
        { name: 'Round', draw: [['circle', { cx: 100, cy: 105, r: 78 }]] },
        { name: 'Oval', draw: [['ellipse', { cx: 100, cy: 104, rx: 66, ry: 82 }]] },
        { name: 'Wide', draw: [['ellipse', { cx: 100, cy: 108, rx: 84, ry: 70 }]] },
        { name: 'Square', draw: [['rect', { x: 28, y: 36, width: 144, height: 142, rx: 38 }]] },
        { name: 'Egg', draw: [['ellipse', { cx: 100, cy: 108, rx: 60, ry: 84 }]] },
        { name: 'Heart', draw: [['path', { d: 'M100,176 C44,134 32,82 58,58 C78,40 100,52 100,74 C100,52 122,40 142,58 C168,82 156,134 100,176 Z' }]] },
    ];

    const EYES = [
        { name: 'Dots', draw: [
            ['circle', { cx: 72, cy: 92, r: 8, fill: STROKE }],
            ['circle', { cx: 128, cy: 92, r: 8, fill: STROKE }],
        ]},
        { name: 'Big', draw: [
            ['circle', { cx: 72, cy: 92, r: 15, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 74, cy: 94, r: 8, fill: STROKE }],
            ['circle', { cx: 70, cy: 89, r: 3, fill: '#fff' }],
            ['circle', { cx: 128, cy: 92, r: 15, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 130, cy: 94, r: 8, fill: STROKE }],
            ['circle', { cx: 126, cy: 89, r: 3, fill: '#fff' }],
        ]},
        { name: 'Closed', draw: [
            ['path', { d: 'M60,94 Q72,84 84,94', fill: 'none', stroke: STROKE, 'stroke-width': 4, 'stroke-linecap': 'round' }],
            ['path', { d: 'M116,94 Q128,84 140,94', fill: 'none', stroke: STROKE, 'stroke-width': 4, 'stroke-linecap': 'round' }],
        ]},
        { name: 'Heart', draw: [
            ['path', { d: heartPath(72, 90, 9), fill: '#FF4D6D' }],
            ['path', { d: heartPath(128, 90, 9), fill: '#FF4D6D' }],
        ]},
        { name: 'Star', draw: [
            ['path', { d: starPath(72, 92, 12), fill: '#FFD93D', stroke: '#E0A800', 'stroke-width': 1 }],
            ['path', { d: starPath(128, 92, 12), fill: '#FFD93D', stroke: '#E0A800', 'stroke-width': 1 }],
        ]},
        { name: 'Surprised', draw: [
            ['circle', { cx: 72, cy: 92, r: 13, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 72, cy: 92, r: 5, fill: STROKE }],
            ['circle', { cx: 128, cy: 92, r: 13, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 128, cy: 92, r: 5, fill: STROKE }],
        ]},
        { name: 'Wink', draw: [
            ['circle', { cx: 72, cy: 92, r: 8, fill: STROKE }],
            ['path', { d: 'M116,92 Q128,84 140,92', fill: 'none', stroke: STROKE, 'stroke-width': 4, 'stroke-linecap': 'round' }],
        ]},
        { name: 'Sleepy', draw: [
            ['path', { d: 'M60,90 Q72,86 84,90', fill: 'none', stroke: STROKE, 'stroke-width': 3, 'stroke-linecap': 'round' }],
            ['circle', { cx: 72, cy: 95, r: 5, fill: STROKE }],
            ['path', { d: 'M116,90 Q128,86 140,90', fill: 'none', stroke: STROKE, 'stroke-width': 3, 'stroke-linecap': 'round' }],
            ['circle', { cx: 128, cy: 95, r: 5, fill: STROKE }],
        ]},
        { name: 'Cross', draw: [
            ['path', { d: 'M64,85 L80,99 M80,85 L64,99', fill: 'none', stroke: STROKE, 'stroke-width': 4, 'stroke-linecap': 'round' }],
            ['path', { d: 'M120,85 L136,99 M136,85 L120,99', fill: 'none', stroke: STROKE, 'stroke-width': 4, 'stroke-linecap': 'round' }],
        ]},
        { name: 'Crying', draw: [
            ['circle', { cx: 72, cy: 90, r: 13, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 72, cy: 92, r: 7, fill: STROKE }],
            ['path', { d: 'M70,104 Q67,118 72,119 Q77,118 74,104 Z', fill: '#7BDFF2' }],
            ['circle', { cx: 128, cy: 90, r: 13, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 128, cy: 92, r: 7, fill: STROKE }],
            ['path', { d: 'M126,104 Q123,118 128,119 Q133,118 130,104 Z', fill: '#7BDFF2' }],
        ]},
        { name: 'Huge', draw: [
            ['circle', { cx: 72, cy: 92, r: 18, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 73, cy: 94, r: 11, fill: STROKE }],
            ['circle', { cx: 68, cy: 88, r: 4, fill: '#fff' }],
            ['circle', { cx: 128, cy: 92, r: 18, fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['circle', { cx: 129, cy: 94, r: 11, fill: STROKE }],
            ['circle', { cx: 124, cy: 88, r: 4, fill: '#fff' }],
        ]},
    ];

    const MOUTHS = [
        { name: 'Smile', draw: [['path', { d: 'M72,132 Q100,154 128,132', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }]] },
        { name: 'Laughter', draw: [
            ['path', { d: 'M70,128 Q100,136 130,128 Q120,162 100,162 Q80,162 70,128 Z', fill: '#7a2233' }],
            ['path', { d: 'M80,131 Q100,134 120,131 Q112,141 100,141 Q88,141 80,131 Z', fill: '#fff' }],
        ]},
        { name: 'Sad', draw: [['path', { d: 'M72,146 Q100,128 128,146', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }]] },
        { name: 'Surprised', draw: [['ellipse', { cx: 100, cy: 142, rx: 13, ry: 17, fill: '#7a2233' }]] },
        { name: 'Tongue', draw: [
            ['path', { d: 'M74,130 Q100,150 126,130', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }],
            ['ellipse', { cx: 100, cy: 147, rx: 11, ry: 9, fill: '#FF7A99' }],
        ]},
        { name: 'Flat', draw: [['line', { x1: 76, y1: 140, x2: 124, y2: 140, stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }]] },
        { name: 'Grin', draw: [
            ['path', { d: 'M68,130 Q100,152 132,130 Q100,150 68,130 Z', fill: '#fff', stroke: STROKE, 'stroke-width': 2 }],
            ['line', { x1: 84, y1: 134, x2: 84, y2: 145, stroke: STROKE, 'stroke-width': 1.5 }],
            ['line', { x1: 100, y1: 136, x2: 100, y2: 148, stroke: STROKE, 'stroke-width': 1.5 }],
            ['line', { x1: 116, y1: 134, x2: 116, y2: 145, stroke: STROKE, 'stroke-width': 1.5 }],
        ]},
        { name: 'Kiss', draw: [['path', { d: 'M90,138 Q100,128 110,138 Q100,148 90,138 Z', fill: '#FF7A99' }]] },
        { name: 'Big Smile', draw: [
            ['path', { d: 'M66,127 Q100,172 134,127 Z', fill: '#7a2233' }],
            ['path', { d: 'M76,130 Q100,138 124,130 Q112,142 100,142 Q88,142 76,130 Z', fill: '#fff' }],
        ]},
        { name: 'Wavy', draw: [['path', { d: 'M70,138 Q82,131 94,138 Q106,145 118,138 Q126,133 132,137', fill: 'none', stroke: STROKE, 'stroke-width': 4, 'stroke-linecap': 'round' }]] },
        { name: 'Small O', draw: [['circle', { cx: 100, cy: 140, r: 8, fill: '#7a2233' }]] },
    ];

    const BROWS = [
        { name: 'None', draw: [] },
        { name: 'Flat', draw: [
            ['rect', { x: 60, y: 68, width: 26, height: 5, rx: 2, fill: STROKE }],
            ['rect', { x: 114, y: 68, width: 26, height: 5, rx: 2, fill: STROKE }],
        ]},
        { name: 'Happy', draw: [
            ['path', { d: 'M60,73 Q73,64 86,71', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }],
            ['path', { d: 'M114,71 Q127,64 140,73', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }],
        ]},
        { name: 'Angry', draw: [
            ['path', { d: 'M60,66 L86,75', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }],
            ['path', { d: 'M140,66 L114,75', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }],
        ]},
        { name: 'Thick', draw: [
            ['rect', { x: 58, y: 64, width: 30, height: 8, rx: 4, fill: STROKE }],
            ['rect', { x: 112, y: 64, width: 30, height: 8, rx: 4, fill: STROKE }],
        ]},
        { name: 'Worried', draw: [
            ['path', { d: 'M60,70 Q73,77 86,73', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }],
            ['path', { d: 'M114,73 Q127,77 140,70', fill: 'none', stroke: STROKE, 'stroke-width': 5, 'stroke-linecap': 'round' }],
        ]},
        { name: 'Thin', draw: [
            ['path', { d: 'M62,71 Q73,67 84,70', fill: 'none', stroke: STROKE, 'stroke-width': 3, 'stroke-linecap': 'round' }],
            ['path', { d: 'M116,70 Q127,67 138,71', fill: 'none', stroke: STROKE, 'stroke-width': 3, 'stroke-linecap': 'round' }],
        ]},
    ];

    const ACCESSORIES = [
        { name: 'None', draw: [] },
        { name: 'Glasses', draw: [
            ['circle', { cx: 72, cy: 92, r: 20, fill: 'none', stroke: '#3b3b3b', 'stroke-width': 3 }],
            ['circle', { cx: 128, cy: 92, r: 20, fill: 'none', stroke: '#3b3b3b', 'stroke-width': 3 }],
            ['line', { x1: 92, y1: 92, x2: 108, y2: 92, stroke: '#3b3b3b', 'stroke-width': 3 }],
        ]},
        { name: 'Sunglasses', draw: [
            ['rect', { x: 52, y: 80, width: 40, height: 24, rx: 8, fill: '#222' }],
            ['rect', { x: 108, y: 80, width: 40, height: 24, rx: 8, fill: '#222' }],
            ['line', { x1: 92, y1: 88, x2: 108, y2: 88, stroke: '#222', 'stroke-width': 4 }],
        ]},
        { name: 'Hat', draw: [
            ['path', { d: 'M42,54 Q100,18 158,54 L158,60 L42,60 Z', fill: '#E63946' }],
            ['rect', { x: 34, y: 57, width: 132, height: 9, rx: 4, fill: '#C1121F' }],
        ]},
        { name: 'Crown', draw: [
            ['path', { d: 'M55,54 L70,30 L85,48 L100,26 L115,48 L130,30 L145,54 Z', fill: '#FFD93D', stroke: '#E0A800', 'stroke-width': 2 }],
            ['circle', { cx: 100, cy: 26, r: 4, fill: '#FF6B6B' }],
        ]},
        { name: 'Pink Cheeks', draw: [
            ['circle', { cx: 56, cy: 120, r: 11, fill: '#FF8FAB', opacity: 0.55 }],
            ['circle', { cx: 144, cy: 120, r: 11, fill: '#FF8FAB', opacity: 0.55 }],
        ]},
        { name: 'Bow', draw: [
            ['path', { d: 'M100,42 L76,31 L79,53 Z', fill: '#FF5D8F' }],
            ['path', { d: 'M100,42 L124,31 L121,53 Z', fill: '#FF5D8F' }],
            ['circle', { cx: 100, cy: 42, r: 6, fill: '#E63973' }],
        ]},
        { name: 'Tear', draw: [['path', { d: 'M128,106 Q123,124 130,127 Q137,124 132,106 Z', fill: '#7BDFF2' }]] },
        { name: 'Sweat Drop', draw: [['path', { d: 'M150,52 Q144,68 152,71 Q160,68 154,52 Z', fill: '#7BDFF2' }]] },
        { name: 'Heart Cheek', draw: [['path', { d: heartPath(150, 112, 9), fill: '#FF4D6D' }]] },
        { name: 'Mask', draw: [
            ['path', { d: 'M58,116 Q100,106 142,116 L139,150 Q100,164 61,150 Z', fill: '#A0E7E5', stroke: '#5BC0C0', 'stroke-width': 2 }],
            ['path', { d: 'M58,120 L40,110', fill: 'none', stroke: '#5BC0C0', 'stroke-width': 2 }],
            ['path', { d: 'M142,120 L160,110', fill: 'none', stroke: '#5BC0C0', 'stroke-width': 2 }],
        ]},
    ];

    const CATEGORIES = [
        { key: 'shape', label: 'Face', items: SHAPES },
        { key: 'color', label: 'Color', items: COLORS },
        { key: 'brow', label: 'Brows', items: BROWS },
        { key: 'eyes', label: 'Eyes', items: EYES },
        { key: 'mouth', label: 'Mouth', items: MOUTHS },
        { key: 'accessory', label: 'Accessory', items: ACCESSORIES },
    ];

    // ---- State ----
    let container = null;
    let callbacks = null;
    let state = { shape: 0, color: 0, brow: 2, eyes: 1, mouth: 0, accessory: 0 };
    let activeCat = 'shape';
    let collection = [];
    let celebrated = false;
    let previewWrap = null;
    let optionsRow = null;
    let collectionRow = null;

    // ---- Helpers ----
    function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

    function el(tag, attrs) {
        const e = document.createElementNS(svgNS, tag);
        if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }

    // Create layered SVG face from state
    function buildFace(st, size) {
        const svg = el('svg', { viewBox: '0 0 200 200', width: size, height: size });
        svg.classList.add('ey-face-svg');
        // Base (color + stroke)
        SHAPES[st.shape].draw.forEach(([tag, attrs]) => {
            svg.appendChild(el(tag, Object.assign({}, attrs, { fill: COLORS[st.color], stroke: '#3a2e10', 'stroke-width': 3 })));
        });
        // Layers (bottom to top): brow → eyes → mouth → accessory
        [BROWS[st.brow], EYES[st.eyes], MOUTHS[st.mouth], ACCESSORIES[st.accessory]].forEach(part => {
            part.draw.forEach(([tag, attrs]) => svg.appendChild(el(tag, attrs)));
        });
        return svg;
    }

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs || {};
        state = { shape: 0, color: 0, brow: 2, eyes: 1, mouth: 0, accessory: 0 };
        activeCat = 'shape';
        collection = [];
        celebrated = false;
        try { GameEngine.setTotal(4); } catch (e) {}
        render();
    }

    function render() {
        clear(container);

        const wrap = document.createElement('div');
        wrap.className = 'ey-wrap';

        const title = document.createElement('div');
        title.className = 'game-instruction';
        title.textContent = 'Select parts, create your own emoji face!';
        wrap.appendChild(title);

        previewWrap = document.createElement('div');
        previewWrap.className = 'ey-preview';
        wrap.appendChild(previewWrap);
        renderPreview();

        const tabs = document.createElement('div');
        tabs.className = 'ey-tabs';
        CATEGORIES.forEach(cat => {
            const tab = document.createElement('button');
            tab.className = 'ey-tab' + (cat.key === activeCat ? ' active' : '');
            tab.textContent = cat.label;
            tab.addEventListener('click', () => {
                activeCat = cat.key;
                try { AudioManager.play('tap'); } catch (e) {}
                tabs.querySelectorAll('.ey-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderOptions();
            });
            tabs.appendChild(tab);
        });
        wrap.appendChild(tabs);

        optionsRow = document.createElement('div');
        optionsRow.className = 'ey-options';
        wrap.appendChild(optionsRow);
        renderOptions();

        const actions = document.createElement('div');
        actions.className = 'ey-actions';

        const surpriseBtn = document.createElement('button');
        surpriseBtn.className = 'ey-btn ey-btn-surprise';
        surpriseBtn.textContent = '🎲 Surprise';
        surpriseBtn.addEventListener('click', randomize);
        actions.appendChild(surpriseBtn);

        const addBtn = document.createElement('button');
        addBtn.className = 'ey-btn ey-btn-add';
        addBtn.textContent = '✓ Add to Collection';
        addBtn.addEventListener('click', addToCollection);
        actions.appendChild(addBtn);

        const resetBtn = document.createElement('button');
        resetBtn.className = 'ey-btn ey-btn-reset';
        resetBtn.textContent = '↺ Reset';
        resetBtn.addEventListener('click', () => {
            state = { shape: 0, color: 0, brow: 2, eyes: 1, mouth: 0, accessory: 0 };
            try { AudioManager.play('tap'); } catch (e) {}
            renderPreview();
            renderOptions();
        });
        actions.appendChild(resetBtn);

        wrap.appendChild(actions);

        const collTitle = document.createElement('div');
        collTitle.className = 'ey-coll-title';
        collTitle.textContent = 'My Collection';
        wrap.appendChild(collTitle);

        collectionRow = document.createElement('div');
        collectionRow.className = 'ey-collection';
        wrap.appendChild(collectionRow);
        renderCollection();

        container.appendChild(wrap);
    }

    function renderPreview() {
        if (!previewWrap) return;
        clear(previewWrap);
        const face = buildFace(state, 220);
        face.classList.add('ey-preview-face');
        previewWrap.appendChild(face);
    }

    function renderOptions() {
        if (!optionsRow) return;
        clear(optionsRow);

        if (activeCat === 'color') {
            COLORS.forEach((color, idx) => {
                const btn = document.createElement('button');
                btn.className = 'ey-color' + (idx === state.color ? ' active' : '');
                btn.style.background = color;
                btn.addEventListener('click', () => {
                    state.color = idx;
                    try { AudioManager.play('pop'); } catch (e) {}
                    renderPreview();
                    renderOptions();
                });
                optionsRow.appendChild(btn);
            });
            return;
        }

        const cat = CATEGORIES.find(c => c.key === activeCat);
        cat.items.forEach((item, idx) => {
            const btn = document.createElement('button');
            btn.className = 'ey-option' + (idx === state[activeCat] ? ' active' : '');
            const previewState = Object.assign({}, state);
            previewState[activeCat] = idx;
            btn.appendChild(buildFace(previewState, 54));
            btn.addEventListener('click', () => {
                state[activeCat] = idx;
                try { AudioManager.play('pop'); } catch (e) {}
                renderPreview();
                renderOptions();
            });
            optionsRow.appendChild(btn);
        });
    }

    function renderCollection() {
        if (!collectionRow) return;
        clear(collectionRow);
        if (collection.length === 0) {
            const hint = document.createElement('div');
            hint.className = 'ey-coll-empty';
            hint.textContent = 'No faces added yet. Create a face and press "Add to Collection"!';
            collectionRow.appendChild(hint);
            return;
        }
        collection.forEach(st => {
            const slot = document.createElement('div');
            slot.className = 'ey-coll-item';
            slot.appendChild(buildFace(st, 64));
            collectionRow.appendChild(slot);
        });
    }

    function randomize() {
        try { AudioManager.play('whoosh'); } catch (e) {}
        state.shape = Math.floor(Math.random() * SHAPES.length);
        state.color = Math.floor(Math.random() * COLORS.length);
        state.brow = Math.floor(Math.random() * BROWS.length);
        state.eyes = Math.floor(Math.random() * EYES.length);
        state.mouth = Math.floor(Math.random() * MOUTHS.length);
        state.accessory = Math.floor(Math.random() * ACCESSORIES.length);
        renderPreview();
        renderOptions();
    }

    function addToCollection() {
        collection.push(Object.assign({}, state));
        try { AudioManager.play('success'); } catch (e) {}
        renderCollection();
        if (collection.length >= 4 && !celebrated) {
            celebrated = true;
            try { AudioManager.play('levelComplete'); } catch (e) {}
            try { Particles.celebrate(); } catch (e) {}
            try { if (callbacks.onComplete) callbacks.onComplete(3); } catch (e) {}
        }
    }

    function destroy() {
        clear(container);
        previewWrap = optionsRow = collectionRow = null;
        collection = [];
    }

    return { id, levels, init, destroy };
})();
