/* ============================================
   GAME: Number Words
   ============================================ */

const NumberWordConnect = (() => {
    const id = 'number-word-connect';
    const name = 'Number Words';
    const pairsPerRound = 4;

    const words = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    const colors = ['#FFD166', '#06D6A0', '#EF476F', '#74C0FC', '#C084FC', '#FF9F5A'];

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
        header.innerHTML = '🚀 Connect each number to its word!';
        container.appendChild(header);

        const numbers = ConnectBoard.shuffle(
            Array.from({ length: words.length }, (_, i) => i + 1)
        ).slice(0, pairsPerRound);

        const leftItems = ConnectBoard.shuffle(numbers).map((num, idx) => ({
            id: num,
            color: colors[idx % colors.length],
            html: `<span class="connect-num">${num}</span>`
        }));

        const rightItems = ConnectBoard.shuffle(numbers).map((num, idx) => ({
            id: num,
            color: colors[idx % colors.length],
            html: `<span class="connect-num-word">${words[num - 1]}</span>`
        }));

        ConnectBoard.render(container, {
            boardClass: 'connect-board--space',
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
