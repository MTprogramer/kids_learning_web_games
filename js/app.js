/* ============================================
   CHILDS PLAY LOGIC - App Controller
   ============================================ */

const App = (() => {
    // Registry of all game modules
    const GameRegistry = {
        'memory-cards': MemoryCards,
        'color-matching': ColorMatching,
        'counting': Counting,
        'letter-recognition': LetterRecognition,
        'shape-puzzle': ShapePuzzle,
        'coloring': Coloring,
        'sorting': Sorting,
        'coding-adventure': CodingAdventure,
        'chess': ChessGame,
        'math': MathGame,
        'syllable-merging': SyllableMerging,
        'jigsaw': Jigsaw,
        'pattern': Pattern,
        'lego-adventure': LegoAdventure,
        'lego-world': LegoWorld,
        'penalty': Penalty,
        'canvas': Canvas,
        'color-by-number': ColorByNumber,
        'emoji-maker': EmojiMaker,
        'jump-collect': JumpCollect,
        'space-waves': SpaceWaves,
        'slope': Slope,
        'ice-tower': IceTower,
        'tetris': Tetris
    };

    // Mapping game IDs to their SVG filenames in assets/images/hub/
    const IconMap = {
        'memory-cards': 'hafiza-kartlari',
        'color-matching': 'renk-eslestirme',
        'counting': 'sayi-sayma',
        'letter-recognition': 'harf-tanima',
        'shape-puzzle': 'sekil-bulmaca',
        'coloring': 'boyama',
        'sorting': 'siralama',
        'coding-adventure': 'kod-macerasi',
        'chess': 'satranc',
        'math': 'matematik',
        'syllable-merging': 'hece-birlestirme',
        'jigsaw': 'jigsaw',
        'pattern': 'desen',
        'lego-adventure': 'lego-macerasi',
        'lego-world': 'lego-world',
        'penalty': 'penalti',
        'canvas': 'tuval',
        'color-by-number': 'sayilarla-boyama',
        'emoji-maker': 'emoji-yapici',
        'jump-collect': 'zipla-topla',
        'space-waves': 'space-waves',
        'slope': 'egim',
        'ice-tower': 'buz-kulesi',
        'tetris': 'tetris'
    };

    // Categories for the hub
    const Categories = [
        { id: 'all', name: 'All Games', icon: '🎮' },
        { id: 'logic', name: 'Logic & Puzzle', icon: '🧩', games: ['memory-cards', 'shape-puzzle', 'sorting', 'jigsaw', 'pattern', 'tetris'] },
        { id: 'math', name: 'Math & Numbers', icon: '🔢', games: ['counting', 'math', 'color-by-number'] },
        { id: 'language', name: 'Language', icon: '🔤', games: ['letter-recognition', 'syllable-merging'] },
        { id: 'creative', name: 'Creativity', icon: '🎨', games: ['coloring', 'canvas', 'emoji-maker'] },
        { id: 'action', name: 'Action & Sport', icon: '🏃', games: ['penalty', 'jump-collect', 'fire-ice', 'space-waves', 'slope', 'gold-hunt', 'ice-tower'] },
        { id: 'strategy', name: 'Strategy', icon: '♟️', games: ['chess', 'coding-adventure', 'lego-adventure', 'lego-world'] }
    ];

    let currentCategory = 'all';

    function init() {
        console.log("App Initializing...");
        setupEventListeners();
        renderNav();
        renderHub();
        updateStarCounter();

        // Handle splash screen
        const splashBtn = document.getElementById('splash-start');
        if (splashBtn) {
            splashBtn.addEventListener('click', () => {
                AudioManager.play('tap');
                document.getElementById('splash-screen').classList.add('hidden');
                document.getElementById('app').cla
                ssList.remove('hidden');
            });
        }
    }

    function setupEventListeners() {
        document.getElementById('btn-home').addEventListener('click', goHome);
        document.getElementById('game-home').addEventListener('click', goHome);

        document.getElementById('btn-sound').addEventListener('click', () => {
            const isMuted = AudioManager.toggleMute();
            document.querySelector('.sound-on').classList.toggle('hidden', isMuted);
            document.querySelector('.sound-off').classList.toggle('hidden', !isMuted);
        });

        document.getElementById('btn-settings').addEventListener('click', () => {
            alert("Settings coming soon!");
        });

        document.getElementById('btn-replay').addEventListener('click', () => {
            GameEngine.replay();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            GameEngine.nextLevel();
        });

        document.getElementById('btn-hub').addEventListener('click', goHome);

        document.getElementById('game-fullscreen').addEventListener('click', toggleFullScreen);
    }

    function renderNav() {
        const navScroll = document.getElementById('hub-nav-scroll');
        if (!navScroll) return;

        navScroll.innerHTML = Categories.map(cat => `
            <button class="nav-item ${cat.id === currentCategory ? 'active' : ''}" data-cat="${cat.id}">
                <span class="nav-icon">${cat.icon}</span>
                <span class="nav-text">${cat.name}</span>
            </button>
        `).join('');

        navScroll.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCategory = btn.dataset.cat;
                renderNav();
                renderHub();
                AudioManager.play('tap');
            });
        });
    }

    function renderHub() {
        const grid = document.getElementById('hub-grid');
        if (!grid) return;

        grid.innerHTML = '';

        const gamesToRender = currentCategory === 'all'
            ? Object.keys(GameRegistry)
            : (Categories.find(c => c.id === currentCategory)?.games || []);

        gamesToRender.forEach(gameId => {
            const game = GameRegistry[gameId];
            if (!game) return;

            const card = document.createElement('div');
            card.className = 'game-card';
            card.style.setProperty('--card-color', getGameColor(gameId));

            const stars = Progress.getGameTotalStars(gameId);
            const totalLevels = game.levels ? game.levels.length : 1;
            const iconName = IconMap[gameId] || gameId;

            card.innerHTML = `
                <div class="game-card-icon">
                    <img src="assets/images/hub/${iconName}.svg" alt="${gameId}" onerror="this.src='assets/images/hub/default.svg'">
                </div>
                <div class="game-card-info">
                    <h3 class="game-card-title">${i18n.games[gameId] || gameId}</h3>
                    <div class="game-card-stars">
                        ${renderStars(stars, totalLevels * 3)}
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                AudioManager.play('tap');
                startGame(gameId);
            });

            grid.appendChild(card);
        });
    }

    function renderStars(earned, total) {
        if (total === 0) return '';
        return `<span class="star-text">⭐ ${earned}</span>`;
    }

    function getGameColor(id) {
        const colors = {
            'chess': '#8E44AD',
            'math': '#E67E22',
            'coding-adventure': '#2ECC71',
            'penalty': '#3498DB',
            'memory-cards': '#F1C40F'
        };
        return colors[id] || '#4AABE0';
    }

    function startGame(gameId) {
        const game = GameRegistry[gameId];
        if (!game) return;

        document.getElementById('hub').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('top-bar').classList.add('in-game');

        let level = Progress.getLastUnlockedLevel(gameId);

        // Safety check: cap level to total available levels
        if (game.levels && level > game.levels.length) {
            level = game.levels.length;
        }

        GameEngine.startGame(game, level);
    }

    function goHome() {
        AudioManager.play('tap');
        GameEngine.destroy();
        document.getElementById('hub').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('level-complete').classList.add('hidden');
        document.getElementById('top-bar').classList.remove('in-game');
        renderHub();
    }

    function updateStarCounter() {
        const total = Progress.getTotalStars();
        const starEl = document.getElementById('total-stars');
        if (starEl) starEl.textContent = total;
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    return { init, updateStarCounter, startGame };
})();

// Start the app when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
