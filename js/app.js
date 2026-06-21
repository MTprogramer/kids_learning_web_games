/* ============================================
   CHILDS PLAY LOGIC - App Controller
   ============================================ */

// Requirement 2: Standardize 'Report to Host' Bridge
window.reportToHost = (action, data) => {
    if (window.AndroidInterface && window.AndroidInterface.onGameEvent) {
        window.AndroidInterface.onGameEvent(action, JSON.stringify(data));
    } else {
        console.log(`[HostReport] ${action}:`, data);
    }
};

// When embedded in the Android app, the native screen already shows its
// own "Exit to Hub" button, so hide the web page's duplicate home button.
if (window.AndroidInterface && window.AndroidInterface.onGameEvent) {
    document.documentElement.classList.add('is-native-host');
}

const App = (() => {
    // Bump this whenever hub icon SVGs change so WebView/native caches don't
    // keep serving stale artwork under the same file name.
    const ICON_VERSION = 2;

    // Registry of all game modules
    const GameRegistry = {
        'alphabet-runner': AlphabetRunner,
        'alphabet-train': AlphabetTrain,
        'alphabet-balloons': AlphabetBalloons,
        'alphabet-fishing': AlphabetFishing,
        'letter-recognition': LetterRecognition,
        'eat-fruit': EatFruit,
        'letter-case-connect': LetterCaseConnect,
        'counting': Counting,
        'math': MathGame,
        'bubble-buster': BubbleBuster,
        'math-fusion': MathFusion,
        'counting-cupcakes': CountingCupcakes,
        'counting-ladybugs': CountingLadybugs,
        'counting-treasure': CountingTreasure,
        'counting-balloons': CountingBalloons,
        'counting-hop': CountingHop,
        'alphabet-picture-connect': AlphabetPictureConnect,
        'number-word-connect': NumberWordConnect,
        'count-connect': CountConnect,
        'memory-cards': MemoryCards,
        'animal-sounds': AnimalSounds,
        'opposites': Opposites,
        'feelings-match': FeelingsMatch,
        'weather-match': WeatherMatch,
        'number-sequence': NumberSequence,
        'odd-one-out': OddOneOut,
        'color-matching': ColorMatching,
        'shape-puzzle': ShapePuzzle,
        'coloring': Coloring,
        'sorting': Sorting,
        'syllable-merging': SyllableMerging,
        'pattern': Pattern,
        'penalty': Penalty,
        'emoji-maker': EmojiMaker,
    };

    const IconMap = {
        'memory-cards': 'hafiza-kartlari',
        'color-matching': 'renk-eslestirme',
        'counting': 'sayi-sayma',
        'letter-recognition': 'harf-tanima',
        'eat-fruit': 'eat-fruit',
        'alphabet-runner': 'alphabet-runner',
        'alphabet-train': 'alphabet-train',
        'alphabet-balloons': 'alphabet-balloons',
        'alphabet-fishing': 'alphabet-fishing',
        'shape-puzzle': 'sekil-bulmaca',
        'coloring': 'boyama',
        'sorting': 'siralama',
        'math': 'matematik',
        'bubble-buster': 'bubble-buster',
        'math-fusion': 'math-fusion',
        'syllable-merging': 'hece-birlestirme',
        'pattern': 'desen',
        'penalty': 'penalti',
        'emoji-maker': 'emoji-yapici',
        'counting-cupcakes': 'counting-cupcakes',
        'counting-ladybugs': 'counting-ladybugs',
        'counting-treasure': 'counting-treasure',
        'counting-balloons': 'counting-balloons',
        'counting-hop': 'counting-hop',
        'alphabet-picture-connect': 'alphabet-picture-connect',
        'letter-case-connect': 'letter-case-connect',
        'number-word-connect': 'number-word-connect',
        'count-connect': 'count-connect',
        'animal-sounds': 'animal-sounds',
        'opposites': 'opposites',
        'feelings-match': 'feelings-match',
        'weather-match': 'weather-match',
        'number-sequence': 'number-sequence',
        'odd-one-out': 'odd-one-out',
    };

    const Categories = [
        { id: 'all', name: 'All Games', icon: '🎮' },
        { id: 'logic', name: 'Logic & Puzzle', icon: '🧩', games: ['memory-cards', 'shape-puzzle', 'sorting', 'odd-one-out', 'jigsaw', 'pattern', 'tetris'] },
        { id: 'math', name: 'Math & Numbers', icon: '🔢', games: ['counting', 'math', 'bubble-buster', 'math-fusion', 'number-sequence', 'counting-cupcakes', 'counting-ladybugs', 'counting-treasure', 'counting-balloons', 'counting-hop', 'number-word-connect', 'count-connect'] },
        { id: 'language', name: 'Language', icon: '🔤', games: ['letter-recognition', 'alphabet-runner', 'alphabet-train', 'alphabet-balloons', 'alphabet-fishing', 'syllable-merging', 'alphabet-picture-connect', 'letter-case-connect', 'animal-sounds', 'opposites'] },
        { id: 'discovery', name: 'Discovery', icon: '🔍', games: ['feelings-match', 'weather-match'] },
        { id: 'creative', name: 'Creativity', icon: '🎨', games: ['coloring', 'emoji-maker'] },
        { id: 'action', name: 'Action & Sport', icon: '🏃', games: ['penalty', 'eat-fruit', 'jump-collect', 'fire-ice', 'space-waves', 'slope', 'gold-hunt', 'ice-tower'] },
        { id: 'strategy', name: 'Strategy', icon: '♟️', games: ['chess', 'coding-adventure', 'lego-adventure', 'lego-world'] }
    ];

    let currentCategory = 'all';

    function init() {
        console.log("App Initializing...");
        setupEventListeners();

        const params = new URLSearchParams(window.location.search);
        const gameId = params.get('gameId');

        if (gameId && GameRegistry[gameId]) {
            console.log("Direct launch for:", gameId);
            updateStarCounter();
            applyGameTheme(gameId);

            const appContainer = document.getElementById('app');
            const hubLoader = document.getElementById('hub-loader');
            const splashScreen = document.getElementById('splash-screen');

            // 1. Show App immediately and explicitly hide splash screen
            // Adding .hidden to splashScreen prevents it from showing up when is-game-direct is removed later
            appContainer.classList.remove('hidden');
            if (splashScreen) splashScreen.classList.add('hidden');
            if (hubLoader) hubLoader.classList.remove('hidden');

            // 2. Prepare hub navigation
            renderNav();

            // 3. Start Game with a delay to ensure loader is seen
            setTimeout(() => {
                startGame(gameId);

                // 4. Cleanup loading flags and hide direct-launch loader
                setTimeout(() => {
                    if (hubLoader) hubLoader.classList.add('hidden');
                    document.documentElement.classList.remove('is-game-direct');
                }, 800);
            }, 500);

        } else {
            // Normal launch flow: prepare hub and wait for splash start
            renderNav();
            renderHub();
            updateStarCounter();

            const splashBtn = document.getElementById('splash-start');
            if (splashBtn) {
                splashBtn.addEventListener('click', () => {
                    AudioManager.play('tap');
                    document.getElementById('splash-screen').classList.add('hidden');
                    document.getElementById('app').classList.remove('hidden');
                });
            }
        }
    }

    function setupEventListeners() {
        document.getElementById('btn-home').addEventListener('click', () => {
            window.reportToHost('UI_ACTION', { type: 'HOME' });
            goHome();
        });
        document.getElementById('game-home').addEventListener('click', () => {
            window.reportToHost('UI_ACTION', { type: 'HOME' });
            goHome();
        });

        // Floating Game Exit Button
        const gameExitBtn = document.getElementById('btn-game-exit');
        if (gameExitBtn) {
            gameExitBtn.addEventListener('click', () => {
                window.reportToHost('UI_ACTION', { type: 'HOME' });
                goHome();
            });
        }

        document.getElementById('btn-sound').addEventListener('click', () => {
            const isMuted = AudioManager.toggleMute();
            document.querySelector('.sound-on').classList.toggle('hidden', isMuted);
            document.querySelector('.sound-off').classList.toggle('hidden', !isMuted);
        });

        document.getElementById('btn-settings').addEventListener('click', () => {
            alert("Settings coming soon!");
        });

        document.getElementById('btn-replay').addEventListener('click', () => {
            window.reportToHost('UI_ACTION', { type: 'RETRY' });
            GameEngine.replay();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            window.reportToHost('UI_ACTION', { type: 'NEXT_LEVEL' });
            GameEngine.nextLevel();
        });

//        document.getElementById('btn-hub').addEventListener('click', () => {
//            window.reportToHost('UI_ACTION', { type: 'HOME' });
//            goHome();
//        });

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
            const title = i18n.games[gameId] || game.name || gameId;

            card.innerHTML = `
                <div class="game-card-icon">
                    <img src="assets/images/hub/${iconName}.svg?v=${ICON_VERSION}" alt="${title}" onerror="this.src='assets/images/hub/default.svg'">
                </div>
                <div class="game-card-info">
                    <h3 class="game-card-title">${title}</h3>
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
            'chess': '#8B4513',
            'coding-adventure': '#00BCD4',
            'memory-cards': '#A55EEA',
            'color-matching': '#16A085',
            'counting': '#F39C12',
            'letter-recognition': '#3498DB',
            'eat-fruit': '#FF4757',
            'shape-puzzle': '#F7B731',
            'coloring': '#FF78C4',
            'sorting': '#26DE81',
            'math': '#FF9800',
            'bubble-buster': '#D63031',
            'math-fusion': '#0F3460',
            'syllable-merging': '#00897B',
            'pattern': '#E040FB',
            'penalty': '#27AE60',
            'emoji-maker': '#FFB703',
            'alphabet-runner': '#9B59B6',
            'alphabet-train': '#E8590C',
            'alphabet-balloons': '#FF6FAE',
            'alphabet-fishing': '#00B4D8',
            'counting-cupcakes': '#FF6F91',
            'counting-ladybugs': '#E63946',
            'counting-treasure': '#D4A017',
            'counting-balloons': '#5DADE2',
            'counting-hop': '#52C41A',
            'alphabet-picture-connect': '#2E9E45',
            'letter-case-connect': '#4D96FF',
            'number-word-connect': '#7C5CFC',
            'count-connect': '#FFB627',
            'animal-sounds': '#FFA726',
            'opposites': '#26C6DA',
            'feelings-match': '#FF6FAE',
            'weather-match': '#42A5F5',
            'number-sequence': '#66BB6A',
            'odd-one-out': '#AB47BC'
        };
        return colors[id] || '#4AABE0';
    }

    function getGameTheme(id) {
        const themes = {
            'alphabet-runner': 'linear-gradient(135deg, #F9E5FF 0%, #F3C7FF 45%, #B983FF 100%)',
            'counting': 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFD54F 100%)',
            'letter-recognition': 'linear-gradient(135deg, #E8F4FE 0%, #D2E9FF 55%, #A7D7FF 100%)',
            'eat-fruit': 'linear-gradient(180deg, #FF9AA2 0%, #FFB7B2 100%)',
            'color-matching': 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
            'memory-cards': 'linear-gradient(135deg, #F3E8FF 0%, #E0C3FC 50%, #C9A8FF 100%)',
            'shape-puzzle': 'linear-gradient(135deg, #FFF9E6 0%, #FFE9B0 50%, #FFD27A 100%)',
            'coloring': 'linear-gradient(135deg, #FFF0F7 0%, #FFD6EC 50%, #FFB8E0 100%)',
            'sorting': 'linear-gradient(135deg, #E8FFF3 0%, #C3F9DD 50%, #9FF0C7 100%)',
            'math': 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)',
            'bubble-buster': 'linear-gradient(135deg, #87CEEB 0%, #5DADE2 100%)',
            'math-fusion': 'linear-gradient(135deg, #16213E 0%, #0F3460 50%, #1A1A2E 100%)',
            'syllable-merging': 'linear-gradient(135deg, #E0FFFA 0%, #B2F5EA 50%, #80E8D8 100%)',
            'pattern': 'linear-gradient(135deg, #FCE9FF 0%, #F3C6FF 50%, #E59BFF 100%)',
            'penalty': 'linear-gradient(135deg, #E8FFE9 0%, #C8F7C5 50%, #9DEB9B 100%)',
            'emoji-maker': 'linear-gradient(135deg, #FFFBE6 0%, #FFF0B3 50%, #FFE082 100%)',
            'alphabet-train': 'linear-gradient(135deg, #FFF4E0 0%, #FFD3A8 50%, #FF9F5A 100%)',
            'alphabet-balloons': 'linear-gradient(135deg, #FFF0F5 0%, #FFD6E8 50%, #FFADD2 100%)',
            'alphabet-fishing': 'linear-gradient(135deg, #E0FBFF 0%, #B8F0FF 50%, #7FE0F5 100%)',
            'counting-cupcakes': 'linear-gradient(135deg, #FFF0F5 0%, #FFD3E2 50%, #FF9EBB 100%)',
            'counting-ladybugs': 'linear-gradient(135deg, #F0FFE9 0%, #D4F7C5 50%, #FF9999 100%)',
            'counting-treasure': 'linear-gradient(135deg, #FFF8E1 0%, #FFE0A3 50%, #FFC247 100%)',
            'counting-balloons': 'linear-gradient(135deg, #E8F6FF 0%, #C2E9FB 50%, #8ED1FC 100%)',
            'counting-hop': 'linear-gradient(135deg, #E6FFFB 0%, #BAF2D8 50%, #7FE0A8 100%)',
            'alphabet-picture-connect': 'linear-gradient(135deg, #EFFFE9 0%, #C8F7C5 50%, #8CE89A 100%)',
            'letter-case-connect': 'linear-gradient(135deg, #E8F4FF 0%, #D6E9FF 50%, #FFE3F0 100%)',
            'number-word-connect': 'linear-gradient(135deg, #4B3F8C 0%, #3A3578 50%, #2A2D5C 100%)',
            'count-connect': 'linear-gradient(135deg, #FFF8E1 0%, #FFEFC2 50%, #C8F7C5 100%)',
            'animal-sounds': 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFB74D 100%)',
            'opposites': 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #4DD0E1 100%)',
            'feelings-match': 'linear-gradient(135deg, #FFF0F7 0%, #FFD6EC 50%, #FFB8E0 100%)',
            'weather-match': 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 50%, #42A5F5 100%)',
            'number-sequence': 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #81C784 100%)',
            'odd-one-out': 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)'
        };
        return themes[id] || 'linear-gradient(180deg, #E8F4FD 0%, #F0F8FF 100%)';
    }

    function applyGameTheme(gameId) {
        const bg = getGameTheme(gameId);
        document.documentElement.style.setProperty('--hub-loader-bg', bg);
        document.documentElement.style.setProperty('--game-bg', bg);
        const hubLoader = document.getElementById('hub-loader');
        if (hubLoader) {
            hubLoader.style.background = bg;
        }
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.background = bg;
        }
    }

    function startGame(gameId) {
        const game = GameRegistry[gameId];
        if (!game) return;

        applyGameTheme(gameId);

        // Hide Hub and show Game Container
        document.getElementById('hub').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('top-bar').classList.remove('hidden');

        const level = Progress.getLastUnlockedLevel(gameId);
        GameEngine.startGame(game, level);
    }

    function goHome() {
        AudioManager.play('tap');
        GameEngine.destroy();

        // Ensure flags are cleared
        document.documentElement.classList.remove('is-game-direct');
        document.body.classList.remove('is-game');

        document.getElementById('hub').classList.remove('hidden');
        document.getElementById('hub-loader').classList.add('hidden');
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('level-complete').classList.add('hidden');
        document.getElementById('top-bar').classList.remove('in-game');

        // Ensure hub content is rendered if it was skipped during direct launch
        if (document.getElementById('hub-grid').innerHTML === '') {
            renderNav();
            renderHub();
        } else {
            renderHub();
        }
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

    function getGameManifest() {
        const games = Object.keys(GameRegistry).map(id => ({
            id: id,
            name: i18n.games[id] || id,
            iconPath: `assets/images/hub/${IconMap[id] || id}.svg?v=${ICON_VERSION}`
        }));
        return JSON.stringify({ games });
    }

    return { init, updateStarCounter, startGame, getGameManifest };
})();

window.getGameManifest = () => App.getGameManifest();

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
