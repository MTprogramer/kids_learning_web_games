/* ============================================
   GAME: Syllable Merging
   ============================================ */

const SyllableMerging = (() => {
  const id = 'syllable-merging';

  // Word pool: [syllables, image_path, distractors(optional)]
  const IMG = 'assets/images/words/';
  const WORDS_L1 = [
    // 3 syllable words
    [['to','ma','to'], IMG+'domates.png'],
    [['po','ta','to'], IMG+'patates.png'],
    [['but','ter','fly'], IMG+'kelebek.png'],
    [['cal','en','dar'], IMG+'takvim.png'],
    [['an','i','mal'], IMG+'hayvanlar.png'],
    [['com','pu','ter'], IMG+'bilgisayar.png'],
    [['sun','flow','er'], IMG+'cicekler.png'],
    [['en','gi','neer'], IMG+'muhendis.png'],
    [['li','bra','ry'], IMG+'kutüphane.png'],
    [['or','an','ges'], IMG+'portakal.png'],
  ];
  const WORDS_L2 = [
    // 4 syllable words + 1 distractor
    [['hel','i','cop','ter'], IMG+'helikopter.png', ['ing']],
    [['tel','e','vi','sion'], IMG+'televizyon.png', ['er']],
    [['au','to','mo','bile'], IMG+'araba.png', ['ly']],
    [['math','e','ma','tics'], IMG+'matematik.png', ['al']],
    [['cat','er','pil','lar'], IMG+'karinca.png', ['tion']],
    [['al','li','ga','tor'], IMG+'kurbaga.png', ['ed']],
    [['dic','tion','ar','y'], IMG+'kutüphane.png', ['ic']],
  ];
  const WORDS_L3 = [
    // 5 syllable words + 2 distractors
    [['u','ni','ver','si','ty'], IMG+'universite.png', ['ly','ing']],
    [['im','ag','i','na','tion'], IMG+'muhendis.png', ['er','al']],
    [['com','mu','ni','ca','tion'], IMG+'televizyon.png', ['ic','ous']],
    [['e','lec','tri','ci','ty'], IMG+'televizyon.png', ['tion','ed']],
    [['re','frig','er','a','tor'], IMG+'camasir.png', ['ous','re']],
  ];

  const levels = [
    { words: WORDS_L1, rounds: 6 },
    { words: WORDS_L2, rounds: 6 },
    { words: WORDS_L3, rounds: 4 },
  ];

  let container, callbacks, currentLevel, round, totalRounds, usedIndices;

  function init(gameArea, level, cbs) {
    container = gameArea;
    callbacks = cbs;
    currentLevel = levels[level - 1];
    round = 0;
    totalRounds = Math.min(currentLevel.rounds, currentLevel.words.length);
    usedIndices = [];
    GameEngine.setTotal(totalRounds);
    nextRound();
  }

  function pickWord() {
    const pool = currentLevel.words;
    let idx;
    let attempts = 0;
    do {
      idx = Math.floor(Math.random() * pool.length);
      attempts++;
    } while (usedIndices.includes(idx) && attempts < 30);
    usedIndices.push(idx);
    return pool[idx];
  }

  function nextRound() {
    round++;
    const wordData = pickWord();
    const syllables = wordData[0];
    const imgSrc = wordData[1];
    const distractors = wordData[2] || [];
    const allSyllables = [...syllables, ...distractors];
    const shuffled = allSyllables.sort(() => Math.random() - 0.5);
    let selected = [];

    // Localized strings
    const instruction = (typeof i18n !== 'undefined' && i18n.instructions) ? i18n.instructions['syllable-merging'] : 'Merge the syllables to form the word!';
    const wordLabel = (typeof i18n !== 'undefined' && i18n.kodMacerasi) ? i18n.kodMacerasi.round : 'Word';
    const resetText = (typeof i18n !== 'undefined' && i18n.kodMacerasi) ? i18n.kodMacerasi.reset : 'Reset';

    container.innerHTML = `
      <div class="hece-game">
        <div class="hece-progress">${wordLabel} ${round}/${totalRounds}</div>
        <div class="hece-target">
          <img class="hece-emoji-img" src="${imgSrc}" alt="hint" draggable="false">
          <span class="hece-hint">${instruction}</span>
        </div>
        <div class="hece-answer-area" id="hece-answer">
          ${syllables.map(() => '<div class="hece-slot"></div>').join('')}
        </div>
        <div class="hece-syllables" id="hece-pool">
          ${shuffled.map((s, i) => `<button class="hece-btn" data-syl="${s}" data-idx="${i}">${s}</button>`).join('')}
        </div>
      </div>`;

    const pool = container.querySelector('#hece-pool');
    const answerArea = container.querySelector('#hece-answer');

    pool.querySelectorAll('.hece-btn').forEach(btn => {
      btn.onclick = () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.classList.add('hece-used');
        selected.push(btn.dataset.syl);

        const slots = answerArea.querySelectorAll('.hece-slot');
        const slot = slots[selected.length - 1];
        if (slot) {
          slot.textContent = btn.dataset.syl;
          slot.classList.add('hece-filled');
        }

        AudioManager.play('tap');

        if (selected.length === syllables.length) {
          setTimeout(() => checkAnswer(selected, syllables, imgSrc), 400);
        }
      };
    });

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'hece-reset-btn';
    resetBtn.textContent = '↺ ' + resetText;
    resetBtn.onclick = () => {
      selected = [];
      pool.querySelectorAll('.hece-btn').forEach(b => { b.disabled = false; b.classList.remove('hece-used'); });
      answerArea.querySelectorAll('.hece-slot').forEach(s => { s.textContent = ''; s.classList.remove('hece-filled'); });
    };
    container.querySelector('.hece-game').appendChild(resetBtn);
  }

  function checkAnswer(selected, correct, imgSrc) {
    const isCorrect = selected.join('') === correct.join('');
    const answerArea = container.querySelector('#hece-answer');

    if (isCorrect) {
      answerArea.classList.add('hece-success');
      callbacks.onCorrect();
      AudioManager.play('success');

      // Show full word with image
      const word = correct.join('');
      while (answerArea.firstChild) answerArea.removeChild(answerArea.firstChild);
      const reveal = document.createElement('div');
      reveal.className = 'hece-word-reveal';
      const revealImg = document.createElement('img');
      revealImg.src = imgSrc;
      revealImg.alt = word;
      revealImg.className = 'hece-reveal-img';
      reveal.appendChild(revealImg);
      reveal.appendChild(document.createTextNode(word));
      answerArea.appendChild(reveal);

      const rect = answerArea.getBoundingClientRect();
      if (typeof Particles !== 'undefined') Particles.sparkle(rect.left + rect.width / 2, rect.top, 8);

      setTimeout(() => {
        if (round >= totalRounds) callbacks.onComplete();
        else nextRound();
      }, 1200);
    } else {
      answerArea.classList.add('hece-wrong');
      callbacks.onWrong();
      AudioManager.play('error');

      setTimeout(() => {
        answerArea.classList.remove('hece-wrong');
        const pool = container.querySelector('#hece-pool');
        if (pool) {
          pool.querySelectorAll('.hece-btn').forEach(b => { b.disabled = false; b.classList.remove('hece-used'); });
        }
        answerArea.querySelectorAll('.hece-slot').forEach(s => { s.textContent = ''; s.classList.remove('hece-filled'); });
        selected.length = 0;
      }, 800);
    }
  }

  function destroy() { if (container) container.innerHTML = ''; }

  return { id, levels, init, destroy };
})();
