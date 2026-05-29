/* ============================================
   CHILDS PLAY LOGIC - Progress Tracking
   ============================================ */

const Progress = (() => {
    const STORAGE_KEY = 'childs_play_logic_progress';

    const defaultData = {
        version: 1,
        games: {},
        totalStars: 0,
        settings: {
            soundEnabled: true,
        }
    };

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn('Could not load progress:', e);
        }
        return JSON.parse(JSON.stringify(defaultData));
    }

    function save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }

    function getGameProgress(gameId) {
        const data = load();
        if (!data.games[gameId]) {
            data.games[gameId] = { levels: {}, totalStars: 0 };
        }
        return data.games[gameId];
    }

    function getLevelStars(gameId, level) {
        const game = getGameProgress(gameId);
        return game.levels[level]?.stars || 0;
    }

    function setLevelStars(gameId, level, stars) {
        const data = load();
        if (!data.games[gameId]) {
            data.games[gameId] = { levels: {}, totalStars: 0 };
        }
        const current = data.games[gameId].levels[level]?.stars || 0;
        if (stars > current) {
            data.games[gameId].levels[level] = {
                stars,
                ...(data.games[gameId].levels[level] || {}),
            };

            // Calculate game total stars
            let gameTotal = 0;
            for (const lv in data.games[gameId].levels) {
                gameTotal += data.games[gameId].levels[lv].stars || 0;
            }
            data.games[gameId].totalStars = gameTotal;

            // Calculate grand total
            let total = 0;
            for (const gId in data.games) {
                total += data.games[gId].totalStars || 0;
            }
            data.totalStars = total;

            save(data);
        }
        return stars;
    }

    function getLastUnlockedLevel(gameId) {
        const game = getGameProgress(gameId);
        let lastLevel = 1;
        for (const lv in game.levels) {
            if (game.levels[lv].stars > 0) {
                lastLevel = Math.max(lastLevel, parseInt(lv) + 1);
            }
        }
        return lastLevel;
    }

    function getTotalStars() {
        const data = load();
        return data.totalStars || 0;
    }

    function getGameTotalStars(gameId) {
        const game = getGameProgress(gameId);
        return game.totalStars || 0;
    }

    function getMaxStarsForGame(gameId) {
        const game = getGameProgress(gameId);
        let max = 0;
        for (const lv in game.levels) {
            max = Math.max(max, game.levels[lv].stars || 0);
        }
        return max;
    }

    function getSettings() {
        const data = load();
        return data.settings || defaultData.settings;
    }

    function saveSetting(key, value) {
        const data = load();
        if (!data.settings) data.settings = {};
        data.settings[key] = value;
        save(data);
    }

    function resetAll() {
        save(JSON.parse(JSON.stringify(defaultData)));
    }

    return {
        getLevelStars,
        setLevelStars,
        getLastUnlockedLevel,
        getTotalStars,
        getGameTotalStars,
        getMaxStarsForGame,
        getGameProgress,
        getSettings,
        saveSetting,
        resetAll,
    };
})();
