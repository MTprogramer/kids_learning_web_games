/* ============================================
   GAME: Letter Safari Connect
   ============================================ */

const AlphabetPictureConnect = (() => {
    const id = 'alphabet-picture-connect';
    const name = 'Letter Safari Connect';
    const pairsPerRound = 4;

    const pool = [
        { letter: 'A', emoji: '🍎', word: 'Apple' },
        { letter: 'B', emoji: '⚽', word: 'Ball' },
        { letter: 'C', emoji: '🐱', word: 'Cat' },
        { letter: 'D', emoji: '🐶', word: 'Dog' },
        { letter: 'E', emoji: '🐘', word: 'Elephant' },
        { letter: 'F', emoji: '🐸', word: 'Frog' },
        { letter: 'G', emoji: '🍇', word: 'Grapes' },
        { letter: 'H', emoji: '🎩', word: 'Hat' },
        { letter: 'I', emoji: '🍦', word: 'Ice Cream' },
        { letter: 'J', emoji: '🧃', word: 'Juice' },
        { letter: 'K', emoji: '🔑', word: 'Key' },
        { letter: 'L', emoji: '🦁', word: 'Lion' },
        { letter: 'M', emoji: '🌙', word: 'Moon' },
        { letter: 'N', emoji: '👃', word: 'Nose' },
        { letter: 'O', emoji: '🐙', word: 'Octopus' },
        { letter: 'P', emoji: '🍕', word: 'Pizza' },
        { letter: 'Q', emoji: '👑', word: 'Queen' },
        { letter: 'R', emoji: '🌈', word: 'Rainbow' },
        { letter: 'S', emoji: '⭐', word: 'Star' },
        { letter: 'T', emoji: '🌳', word: 'Tree' },
        { letter: 'U', emoji: '☂️', word: 'Umbrella' },
        { letter: 'V', emoji: '🎻', word: 'Violin' },
        { letter: 'W', emoji: '🍉', word: 'Watermelon' },
        { letter: 'Y', emoji: '🪀', word: 'Yo-yo' },
        { letter: 'Z', emoji: '🦓', word: 'Zebra' }
    ];

    const colors = ['#2E9E45', '#1E73C9', '#E8590C', '#9333D6', '#E8467E', '#0D9488'];

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
        header.innerHTML = '🦁 Connect each letter to its picture!';
        container.appendChild(header);

        const round = ConnectBoard.shuffle(pool).slice(0, pairsPerRound);

        const leftItems = ConnectBoard.shuffle(round).map((entry, idx) => ({
            id: entry.letter,
            color: colors[idx % colors.length],
            html: `<span class="connect-letter-big">${entry.letter}</span>`
        }));

        const rightItems = ConnectBoard.shuffle(round).map((entry, idx) => ({
            id: entry.letter,
            color: colors[idx % colors.length],
            html: `<span class="connect-pic-emoji">${entry.emoji}</span><span class="connect-pic-word">${entry.word}</span>`
        }));

        ConnectBoard.render(container, {
            boardClass: 'connect-board--safari',
            leftLabel: '🔤 Letter',
            rightLabel: '🖼️ Picture',
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
