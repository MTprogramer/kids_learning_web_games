/* ============================================
   SHARED: Connect-the-Dots Matching Board
   Used by alphabet/number "connect" games
   ============================================ */

const ConnectBoard = (() => {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function render(container, opts) {
        if (opts.leftLabel || opts.rightLabel) {
            const header = document.createElement('div');
            header.className = `connect-board-header ${opts.boardClass || ''}`.trim();
            header.innerHTML = `<span class="connect-col-label">${opts.leftLabel || ''}</span><span class="connect-col-label">${opts.rightLabel || ''}</span>`;
            container.appendChild(header);
        }

        const board = document.createElement('div');
        board.className = `connect-board ${opts.boardClass || ''}`.trim();

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'connect-lines');
        board.appendChild(svg);

        const colLeft = document.createElement('div');
        colLeft.className = 'connect-col connect-col-left';

        const colRight = document.createElement('div');
        colRight.className = 'connect-col connect-col-right';

        let selected = null;
        let matchedCount = 0;
        let busy = false;
        const total = opts.leftItems.length;

        function buildItem(item, side) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `connect-item ${item.className || ''}`.trim();
            if (item.color) btn.style.color = item.color;
            const node = '<span class="connect-node"></span>';
            btn.innerHTML = side === 'left'
                ? `${item.html}${node}`
                : `${node}${item.html}`;
            return btn;
        }

        opts.leftItems.forEach(item => {
            const btn = buildItem(item, 'left');
            btn.addEventListener('click', () => handleLeft(item, btn));
            colLeft.appendChild(btn);
        });

        opts.rightItems.forEach(item => {
            const btn = buildItem(item, 'right');
            btn.addEventListener('click', () => handleRight(item, btn));
            colRight.appendChild(btn);
        });

        board.appendChild(colLeft);
        board.appendChild(colRight);
        container.appendChild(board);

        function handleLeft(item, btn) {
            if (busy || btn.classList.contains('matched')) return;
            if (selected && selected.btn === btn) {
                btn.classList.remove('selected');
                selected = null;
                return;
            }
            if (selected) selected.btn.classList.remove('selected');
            selected = { item, btn };
            btn.classList.add('selected');
        }

        function handleRight(item, btn) {
            if (busy || !selected || btn.classList.contains('matched')) return;

            const leftBtn = selected.btn;
            const leftItem = selected.item;
            const leftNode = leftBtn.querySelector('.connect-node');
            const rightNode = btn.querySelector('.connect-node');

            if (opts.isMatch(leftItem.id, item.id)) {
                drawLine(svg, board, leftNode, rightNode, 'connect-line correct');
                leftBtn.classList.remove('selected');
                leftBtn.classList.add('matched');
                btn.classList.add('matched');
                btn.disabled = true;
                leftBtn.disabled = true;
                selected = null;
                matchedCount++;

                opts.callbacks.onCorrect();

                const r = btn.getBoundingClientRect();
                Particles.sparkle(r.left + r.width / 2, r.top + r.height / 2, 8);

                if (matchedCount >= total) {
                    busy = true;
                    board.classList.add('all-matched');
                    const boardRect = board.getBoundingClientRect();
                    Particles.sparkle(boardRect.left + boardRect.width / 2, boardRect.top + boardRect.height / 2, 18);
                    setTimeout(() => opts.onAllMatched(), 1100);
                }
            } else {
                const line = drawLine(svg, board, leftNode, rightNode, 'connect-line wrong');
                leftBtn.classList.remove('selected');
                leftBtn.classList.add('wrong');
                btn.classList.add('wrong');
                selected = null;

                opts.callbacks.onWrong();

                setTimeout(() => {
                    leftBtn.classList.remove('wrong');
                    btn.classList.remove('wrong');
                    line.remove();
                }, 450);
            }
        }

        return board;
    }

    function drawLine(svg, board, fromNode, toNode, className) {
        const boardRect = board.getBoundingClientRect();
        const r1 = fromNode.getBoundingClientRect();
        const r2 = toNode.getBoundingClientRect();

        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', r1.left + r1.width / 2 - boardRect.left);
        line.setAttribute('y1', r1.top + r1.height / 2 - boardRect.top);
        line.setAttribute('x2', r2.left + r2.width / 2 - boardRect.left);
        line.setAttribute('y2', r2.top + r2.height / 2 - boardRect.top);
        line.setAttribute('class', className);
        svg.appendChild(line);
        return line;
    }

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    return { render, shuffle };
})();
