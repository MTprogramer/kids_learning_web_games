/* ============================================
   GAME: Count & Connect
   ============================================ */

const CountConnect = (() => {
    const id = 'count-connect';
    const name = 'Count & Connect';
    const pairsPerRound = 4;
    const minCount = 1;
    const maxCount = 10;

    const emojis = ['🍓', '🍎', '⭐', '🐝', '🌼', '🍄', '🐠', '🎈', '🍪', '🦋'];
    const colors = ['#FF8FA3', '#52C41A', '#FFB627', '#4D96FF', '#9333D6', '#0D9488'];

    let container = null;
    let callbacks = null;

    function init(gameArea, level, cbs) {
        container = gameArea;
        callbacks = cbs;
        GameEngine.setTotal(0);
        render();
    }

    function render() {
        container.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'game-instruction';
        header.innerHTML = '🌻 Count the items and connect them to their number!';
        container.appendChild(header);

        const counts = ConnectBoard.shuffle(
            Array.from({ length: maxCount - minCount + 1 }, (_, i) => i + minCount)
        ).slice(0, pairsPerRound);

        const groupEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        const leftItems = ConnectBoard.shuffle(counts).map((count, idx) => ({
            id: count,
            color: colors[idx % colors.length],
            html: `<span class="connect-group">${groupEmoji.repeat(count)}</span>`
        }));

        const rightItems = ConnectBoard.shuffle(counts).map((count, idx) => ({
            id: count,
            color: colors[idx % colors.length],
            html: `<span class="connect-num">${count}</span>`
        }));

        ConnectBoard.render(container, {
            boardClass: 'connect-board--garden',
            leftLabel: '🧮 Count',
            rightLabel: '🔢 Number',
            leftItems,
            rightItems,
            isMatch: (a, b) => a === b,
            callbacks,
            onAllMatched: render
        });
    }

    function destroy() {
        container.innerHTML = '';
    }

    return { id, name, init, destroy };
})();
