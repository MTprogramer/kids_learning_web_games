/* ============================================
   GAME GARDEN - English Language File
   ============================================ */

const EN = {
    appName: 'Childs Play Logic',
    splashSubtitle: 'Are You Ready to Learn?',
    splashStart: 'Start Playing!',

    // Game names
    games: {
        'memory-cards': 'Memory Cards',
        'color-matching': 'Color Matching',
        'counting': 'Counting Numbers',
        'letter-recognition': 'Letter Recognition',
        'alphabet-runner': 'Alphabet Runner',
        'alphabet-train': 'Alphabet Train',
        'alphabet-balloons': 'Balloon Pop ABC',
        'alphabet-fishing': 'Letter Fishing',
        'shape-puzzle': 'Shape Puzzle',
        'coloring': 'Coloring',
        'sorting': 'Sorting',
        'word-guess': 'Word Guess',
        'letter-guess': 'Letter Guess',
        'math': 'Math',
        'syllable-merging': 'Syllable Merging',
        'pattern': 'Pattern Completion',
        'penalty': 'Penalty Shootout',
        'emoji-maker': 'Emoji Maker',
        'counting-cupcakes': 'Cupcake Counting',
        'counting-ladybugs': 'Ladybug Spot Count',
        'counting-treasure': 'Treasure Chest Counting',
        'counting-balloons': 'Number Balloons',
        'counting-hop': 'Number Hop',
        'alphabet-picture-connect': 'Letter Safari Connect',
        'letter-case-connect': 'Big & Small Letters',
        'number-word-connect': 'Number Words',
        'count-connect': 'Count & Connect',
        'animal-sounds': 'Sound Match Zoo',
        'opposites': 'Opposite See-Saw',
        'feelings-match': 'Feelings Theater',
        'weather-match': 'Dress the Weather Buddy',
        'number-sequence': 'Rocket Number Climb',
        'odd-one-out': 'Sorting Conveyor Belt',
    },


    // Level complete
    complete: {
        perfect: 'Perfect!',
        great: 'Great!',
        good: 'Well Done!',
        tryAgain: 'Try Again!',
    },

    // Buttons
    buttons: {
        replay: 'Play Again',
        next: 'Next Level',
        hub: 'Games',
        back: 'Back',
    },

    // Game instructions
    instructions: {
        'memory-cards': 'Find the matching cards!',
        'color-matching': 'Tap the {color} object!',
        'counting': 'How many {object} are there? Count and press the correct number!',
        'letter-recognition': 'Find the picture starting with the letter "{letter}"!',
        'alphabet-runner': 'Run through the letters and reach the goal!',
        'alphabet-train': 'Build the alphabet train letter by letter!',
        'alphabet-balloons': 'Pop the balloon with the matching letter!',
        'alphabet-fishing': 'Catch the fish with the matching letter!',
        'shape-puzzle': 'Drag the shapes to the correct places!',
        'coloring': 'Pick a color and paint the picture!',
        'sorting': 'Sort the objects from smallest to largest!',
        'math': 'Add and subtract!',
        'syllable-merging': 'Merge the syllables!',
        'pattern': 'Complete the pattern!',
        'penalty': 'Shoot at the goal!',
        'emoji-maker': 'Select pieces, create your own emoji face!',
        'counting-cupcakes': 'Find the cupcake with the matching number of candles!',
        'counting-ladybugs': 'Tap the ladybug with the matching number of spots!',
        'counting-treasure': 'Tap the chest to count out the right number of coins!',
        'counting-balloons': 'Pop the balloon with the matching number of dots!',
        'counting-hop': 'Hop across the pond by tapping the numbers in order!',
        'alphabet-picture-connect': 'Connect each letter to its picture!',
        'letter-case-connect': 'Connect the BIG letter to its small letter!',
        'number-word-connect': 'Connect each number to its word!',
        'count-connect': 'Count the items and connect them to their number!',
        'animal-sounds': 'Listen to the sound and drag that animal into its cage!',
        'opposites': 'Drag the opposite item onto the see-saw to balance it!',
        'feelings-match': 'Watch the puppet act it out, then drag on the matching face!',
        'weather-match': 'Look at the weather and drag the right outfit onto the buddy!',
        'number-sequence': 'Drag the next number into the ladder to launch the rocket!',
        'odd-one-out': 'Three items share a group — tap the one on the belt that is different!',
    },

    // Coding Adventure strings
    kodMacerasi: {
        up: 'Up',
        down: 'Down',
        left: 'Left',
        right: 'Right',
        repeat: 'Repeat',
        play: 'Run',
        ready: 'Ready',
        reset: 'Reset',
        building: 'Writing code...',
        executing: 'Executing...',
        reached: 'Reached the Goal!',
        crashed: 'Hit an Obstacle!',
        outOfBounds: 'Went off the Grid!',
        notReached: 'Did not reach the goal!',
        blocksUsed: 'Block',
        round: 'Round',
        optimal: 'Min',
        gridSize: 'Grid Size',
        program: 'Your Program',
    },

    // Colors
    colors: {
        kirmizi: { name: 'Red', hex: '#E74C3C' },
        mavi: { name: 'Blue', hex: '#3498DB' },
        sari: { name: 'Yellow', hex: '#F1C40F' },
        yesil: { name: 'Green', hex: '#2ECC71' },
        turuncu: { name: 'Orange', hex: '#E67E22' },
        mor: { name: 'Purple', hex: '#9B59B6' },
        pembe: { name: 'Pink', hex: '#FF69B4' },
        kahverengi: { name: 'Brown', hex: '#8B4513' },
        beyaz: { name: 'White', hex: '#FFFFFF' },
        siyah: { name: 'Black', hex: '#2C3E50' },
    },

    // Alphabet
    alphabet: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ],

    // Letter-image matches
    letterImages: {
        'A': [
            { word: 'Apple', emoji: '🍎' },
            { word: 'Ant', emoji: '🐜' },
            { word: 'Alligator', emoji: '🐊' },
        ],
        'B': [
            { word: 'Ball', emoji: '⚽' },
            { word: 'Bear', emoji: '🐻' },
            { word: 'Balloon', emoji: '🎈' },
        ],
        'C': [
            { word: 'Cat', emoji: '🐱' },
            { word: 'Car', emoji: '🚗' },
            { word: 'Cake', emoji: '🍰' },
        ],
        'D': [
            { word: 'Dog', emoji: '🐶' },
            { word: 'Duck', emoji: '🦆' },
            { word: 'Dolphin', emoji: '🐬' },
        ],
        'E': [
            { word: 'Elephant', emoji: '🐘' },
            { word: 'Egg', emoji: '🥚' },
            { word: 'Eagle', emoji: '🦅' },
        ],
        'F': [
            { word: 'Fish', emoji: '🐟' },
            { word: 'Frog', emoji: '🐸' },
            { word: 'Flower', emoji: '🌸' },
        ],
        'G': [
            { word: 'Giraffe', emoji: '🦒' },
            { word: 'Goat', emoji: '🐐' },
            { word: 'Grapes', emoji: '🍇' },
        ],
        'H': [
            { word: 'Horse', emoji: '🐴' },
            { word: 'House', emoji: '🏠' },
            { word: 'Hat', emoji: '🎩' },
        ],
        'I': [
            { word: 'Ice Cream', emoji: '🍦' },
            { word: 'Igloo', emoji: '🛖' },
            { word: 'Island', emoji: '🏝️' },
        ],
        'J': [
            { word: 'Jellyfish', emoji: '🪼' },
            { word: 'Juice', emoji: '🥤' },
            { word: 'Jar', emoji: '🫙' },
        ],
        'K': [
            { word: 'Kangaroo', emoji: '🦘' },
            { word: 'Kite', emoji: '🪁' },
            { word: 'Key', emoji: '🔑' },
        ],
        'L': [
            { word: 'Lion', emoji: '🦁' },
            { word: 'Lemon', emoji: '🍋' },
            { word: 'Leaf', emoji: '🍃' },
        ],
        'M': [
            { word: 'Monkey', emoji: '🐒' },
            { word: 'Moon', emoji: '🌙' },
            { word: 'Mouse', emoji: '🐭' },
        ],
        'N': [
            { word: 'Nest', emoji: '🪹' },
            { word: 'Nose', emoji: '👃' },
            { word: 'Nut', emoji: '🥜' },
        ],
        'O': [
            { word: 'Orange', emoji: '🍊' },
            { word: 'Owl', emoji: '🦉' },
            { word: 'Octopus', emoji: '🐙' },
        ],
        'P': [
            { word: 'Panda', emoji: '🐼' },
            { word: 'Pear', emoji: '🍐' },
            { word: 'Penguin', emoji: '🐧' },
        ],
        'Q': [
            { word: 'Queen', emoji: '👸' },
            { word: 'Question', emoji: '❓' },
            { word: 'Quilt', emoji: '🧵' },
        ],
        'R': [
            { word: 'Rabbit', emoji: '🐰' },
            { word: 'Robot', emoji: '🤖' },
            { word: 'Rocket', emoji: '🚀' },
        ],
        'S': [
            { word: 'Sun', emoji: '☀️' },
            { word: 'Star', emoji: '⭐' },
            { word: 'Snake', emoji: '🐍' },
        ],
        'T': [
            { word: 'Tiger', emoji: '🐯' },
            { word: 'Train', emoji: '🚂' },
            { word: 'Tree', emoji: '🌳' },
        ],
        'U': [
            { word: 'Umbrella', emoji: '☂️' },
            { word: 'Unicorn', emoji: '🦄' },
            { word: 'Up', emoji: '⬆️' },
        ],
        'V': [
            { word: 'Van', emoji: '🚐' },
            { word: 'Vase', emoji: '🏺' },
            { word: 'Violin', emoji: '🎻' },
        ],
        'W': [
            { word: 'Whale', emoji: '🐋' },
            { word: 'Water', emoji: '💧' },
            { word: 'Watch', emoji: '⌚' },
        ],
        'X': [
            { word: 'Xylophone', emoji: '🪗' },
            { word: 'X-ray', emoji: '🩻' },
        ],
        'Y': [
            { word: 'Yo-yo', emoji: '🪀' },
            { word: 'Yak', emoji: '🐃' },
            { word: 'Yacht', emoji: '⛵' },
        ],
        'Z': [
            { word: 'Zebra', emoji: '🦓' },
            { word: 'Zero', emoji: '0️⃣' },
            { word: 'Zipper', emoji: '🤐' },
        ],
    },

    // Counting objects
    countingObjects: [
        { name: 'apple', emoji: '🍎' },
        { name: 'star', emoji: '⭐' },
        { name: 'flower', emoji: '🌸' },
        { name: 'fish', emoji: '🐟' },
        { name: 'butterfly', emoji: '🦋' },
        { name: 'heart', emoji: '❤️' },
        { name: 'balloon', emoji: '🎈' },
        { name: 'car', emoji: '🚗' },
        { name: 'bird', emoji: '🐦' },
        { name: 'orange', emoji: '🍊' },
    ],

    // Memory card emojis
    memoryEmojis: [
        '🐶', '🐱', '🐰', '🦊', '🐻', '🐼',
        '🦁', '🐸', '🐧', '🦋', 'TURTLE', '🐝',
        '🌸', '🌻', '⭐', '🍎', '🍌', '🚗',
        '✈️', '🚀', '🎈', '🌈', '🍓', '🎵',
    ],
    memoryImages: [
        'dog', 'cat', 'rabbit', 'fox', 'bear', 'panda',
        'lion', 'frog', 'penguin', 'butterfly', 'turtle', 'bee',
        'flower', 'sunflower', 'star', 'apple', 'banana', 'car',
        'airplane', 'rocket', 'balloon', 'rainbow', 'strawberry', 'music',
    ],

    // Shapes
    shapes: {
        daire: 'Circle',
        kare: 'Square',
        ucgen: 'Triangle',
        dikdortgen: 'Rectangle',
        yildiz: 'Star',
        kalp: 'Heart',
        oval: 'Oval',
        eskenar: 'Rhombus',
    },
};

/* ============================================
   OYUN BAHÇESİ - Türkçe Dil Dosyası
   ============================================ */

// Default language detection
let currentLang = 'en';
let i18n = EN;

function setLanguage(lang) {
    currentLang = lang;
    i18n = EN;
    document.documentElement.lang = lang;
}

// Check localStorage for saved preference or use browser language
const savedLang = localStorage.getItem('app_lang');
if (savedLang) {
    setLanguage(savedLang);
} else {
    const browserLang = navigator.language.split('-')[0];
    setLanguage(browserLang === 'tr' ? 'tr' : 'en');
}
