/* ============================================
   GAME: Big & Small Letters
   ============================================ */

const LetterCaseConnect = (() => {
    const id = 'letter-case-connect';
    const name = 'Big & Small Letters';
    const pairsPerRound = 4;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const colors = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFC75F', '#A66CFF', '#FF8FA3'];

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
        header.innerHTML = '🎈 Connect the BIG letter to its small letter!';
        container.appendChild(header);

        const round = ConnectBoard.shuffle(letters).slice(0, pairsPerRound);

        const leftItems = ConnectBoard.shuffle(round).map((letter, idx) => ({
            id: letter,
            color: colors[idx % colors.length],
            html: `<span class="connect-letter-big">${letter}</span>`
        }));

        const rightItems = ConnectBoard.shuffle(round).map((letter, idx) => ({
            id: letter,
            color: colors[idx % colors.length],
            html: `<span class="connect-letter-small">${letter.toLowerCase()}</span>`
        }));

        ConnectBoard.render(container, {
            boardClass: 'connect-board--clouds',
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
