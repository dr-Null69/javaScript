const board = document.getElementById('game-board');

const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');

const difficultyEl = document.getElementById('difficulty');

const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');

const currentPlayerEl = document.getElementById('current-player');
const scoreEl = document.getElementById('score');
const roundEl = document.getElementById('round');

const symbolsBase = [
  '🍎','🍌','🍇','🍓','🍒','🍍',
  '🥝','🍑','🍉','🍋','🍐','🥥'
];

let cards = [];
let first = null;
let second = null;
let lock = false;

let moves = 0;
let timer = null;
let time = 0;

const gameState = {
  players: [],
  scores: [],
  currentPlayer: 0,
  rounds: 1,
  currentRound: 1,
  results: []
};

function initGameSettings() {
  const p1 = document.getElementById('player1').value || 'Player 1';
  const p2 = document.getElementById('player2').value;

  gameState.players = p2 ? [p1, p2] : [p1];
  gameState.scores = gameState.players.map(() => 0);
  gameState.currentPlayer = 0;

  gameState.rounds = parseInt(document.getElementById('rounds').value) || 1;
  gameState.currentRound = 1;

  gameState.results = [];
}

function getSettings() {
  const level = difficultyEl.value;

  if (level === 'easy') return { pairs: 6, cols: 4, time: 180 };
  if (level === 'normal') return { pairs: 8, cols: 4, time: 120 };
  if (level === 'hard') return { pairs: 12, cols: 6, time: 60 };
}

// ===== BOARD =====
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function createBoard() {
  board.innerHTML = '';

  const settings = getSettings();
  board.style.gridTemplateColumns = `repeat(${settings.cols}, 80px)`;

  const selected = symbolsBase.slice(0, settings.pairs);
  cards = shuffle([...selected, ...selected]);

  cards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = symbol;

    card.addEventListener('click', () => handleClick(card));

    board.appendChild(card);
  });
}

function handleClick(card) {
  if (lock || card === first || card.classList.contains('open')) return;

  card.classList.add('open');
  card.innerText = card.dataset.value;

  if (!first) {
    first = card;
    return;
  }

  second = card;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch() {
  if (first.dataset.value === second.dataset.value) {

    gameState.scores[gameState.currentPlayer]++;
    updateUI();

    reset();
    checkWin();

  } else {
    lock = true;

    setTimeout(() => {
      first.classList.remove('open');
      second.classList.remove('open');

      first.innerText = '';
      second.innerText = '';

      switchPlayer();
      updateUI();

      reset();
    }, 800);
  }
}

function reset() {
  first = null;
  second = null;
  lock = false;
}

function switchPlayer() {
  if (gameState.players.length > 1) {
    gameState.currentPlayer =
      (gameState.currentPlayer + 1) % gameState.players.length;
  }
}

function startTimer() {
  clearInterval(timer);

  const settings = getSettings();
  time = settings.time;

  timeEl.textContent = time;

  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time <= 0) {
      clearInterval(timer);
      alert('Час вийшов!');
    }
  }, 1000);
}

function updateUI() {
  currentPlayerEl.textContent =
    gameState.players[gameState.currentPlayer];

  scoreEl.textContent =
    gameState.scores.join(' : ');

  roundEl.textContent =
    `${gameState.currentRound}/${gameState.rounds}`;
}

function checkWin() {
  const allOpen = document.querySelectorAll('.card.open');

  if (allOpen.length === cards.length) {
    clearInterval(timer);

    gameState.results.push({
      scores: [...gameState.scores],
      moves,
      time
    });

    setTimeout(() => nextRound(), 500);
  }
}

function nextRound() {
  if (gameState.currentRound < gameState.rounds) {
    gameState.currentRound++;
    alert(`Раунд ${gameState.currentRound}`);
    startRound();
  } else {
    showWinner();
  }
}

function showWinner() {

  if (gameState.players.length === 1) {
    alert(`Ти виграв!\nХоди: ${moves}`);
    return;
  }

  const totalScores = gameState.players.map((_, i) =>
    gameState.results.reduce((sum, r) => sum + r.scores[i], 0)
  );

  if (totalScores[0] > totalScores[1]) {
    alert(`Переміг ${gameState.players[0]}`);
  } else if (totalScores[1] > totalScores[0]) {
    alert(`Переміг ${gameState.players[1]}`);
  } else {
    alert('Нічия');
  }
}

// ===== START =====
function startRound() {
  first = null;
  second = null;
  lock = false;

  moves = 0;
  movesEl.textContent = moves;

  createBoard();
  startTimer();
  updateUI();
}

function startGame() {
  initGameSettings();
  startRound();
}

function restartGame() {
  startGame();
}

// ===== EVENTS =====
startBtn.onclick = startGame;
restartBtn.onclick = restartGame;