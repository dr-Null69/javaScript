'use strict';

// DOM Elements
const menuSection = document.querySelector('.game-menu');
const wrapper = document.querySelector('.wrapper');
const gameScreen = document.querySelector('.game-screen');
const gamePanels = document.querySelector('.game-panels'); 
const gunmanElement = document.querySelector('.gunman');
const messageBox = document.querySelector('.message');
const btnStart = document.querySelector('.button-start-game');

// Audio setup
const sfxIntro = new Audio('sfx/intro.m4a');
const sfxWait = new Audio('sfx/wait.m4a');
const sfxFire = new Audio('sfx/fire.m4a');
const sfxShot = new Audio('sfx/shot.m4a');
const sfxShotFall = new Audio('sfx/shot-fall.m4a');
const sfxDeath = new Audio('sfx/death.m4a');
const sfxWin = new Audio('sfx/win.m4a');
const sfxFoul = new Audio('sfx/foul.m4a');

let enemyTimer;
let fireTimer;

const getRandomCharacter = () => Math.floor(Math.random() * 2) + 1;

const createInitialState = () => ({
    level: 1,
    score: 0,
    character: getRandomCharacter(),
    gunmanState: 'walk',
    isRoundActive: false,
    fireStartTime: null
});

const getReadyState = (currentState) => ({
    ...currentState,
    gunmanState: 'wait'
});

const getFireState = (state, startTime) => ({
    ...state,
    gunmanState: 'ready',
    isRoundActive: true,
    fireStartTime: startTime
});

const getPlayerWinState = (state, reactTime) => ({
    ...state,
    gunmanState: 'dead',
    isRoundActive: false,
    score: state.score + 100,
    reactionTime: reactTime
});

const getEnemyWinState = (state) => ({
    ...state,
    gunmanState: 'shooting',
    isRoundActive: false
});

const getNextLevelState = (state) => ({
    ...state,
    level: state.level + 1,
    character: getRandomCharacter(),
    gunmanState: 'walk',
    isRoundActive: false,
    fireStartTime: null
});

let gameState = createInitialState();


function startGame() {
    gameState = createInitialState();

    menuSection.style.display = 'none';
    wrapper.style.display = 'block';
    gameScreen.style.display = 'block';
    gamePanels.style.display = 'block';

    void gunmanElement.offsetWidth;
    
    sfxIntro.play();
    moveGunman();
}

function moveGunman() {
    gunmanElement.className = `gunman gunman-char-${gameState.character} moving`;
    
    setTimeout(() => {
        prepareForDuel();
    }, 5000);
}

function prepareForDuel() {
    gameState = getReadyState(gameState);
    
    gunmanElement.className = `gunman gunman-char-${gameState.character} gunman-char-${gameState.character}__standing standing`;
    sfxWait.play();
    
    timeCounter();
}

function timeCounter() {
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;

    fireTimer = setTimeout(() => {
        const now = Date.now();
        gameState = getFireState(gameState, now);

        messageBox.classList.add('message--fire');
        gunmanElement.className = `gunman gunman-char-${gameState.character} gunman-char-${gameState.character}__ready standing`;
        sfxFire.play();

        const enemyReflex = Math.max(1000 - (gameState.level * 100), 300);
        
        enemyTimer = setTimeout(gunmanShootsPlayer, enemyReflex);
    }, randomDelay);
}

function playerShootsGunman() {
    if (!gameState.isRoundActive && gameState.gunmanState === 'wait') {
        clearTimeout(fireTimer);
        sfxFoul.play();
        messageBox.textContent = 'FOUL!';
        messageBox.className = 'message message--dead';
        document.querySelector('.button-restart').style.display = 'block';
        return;
    }

    if (!gameState.isRoundActive) return;

    clearTimeout(enemyTimer);
    const reactTime = Date.now() - gameState.fireStartTime;

    gameState = getPlayerWinState(gameState, reactTime);

    sfxShotFall.play();
    setTimeout(() => sfxWin.play(), 1000);

    gunmanElement.className = `gunman gunman-char-${gameState.character} gunman-char-${gameState.character}__death`;
    messageBox.className = 'message message--win';
    messageBox.textContent = 'YOU WON!';

    document.querySelector('.time-panel__you').textContent = (reactTime / 1000).toFixed(2);
    document.querySelector('.score-panel__score_num').textContent = gameState.score;

    document.querySelector('.button-next-level').style.display = 'block';
}

function gunmanShootsPlayer() {
    if (!gameState.isRoundActive) return;

    gameState = getEnemyWinState(gameState);

    sfxShot.play();
    sfxDeath.play();

    gunmanElement.className = `gunman gunman-char-${gameState.character} gunman-char-${gameState.character}__shooting standing`;
    messageBox.className = 'message message--dead';
    messageBox.textContent = 'YOU DIED!';

    document.querySelector('.game-screen').classList.add('game-screen--death');
    document.querySelector('.button-restart').style.display = 'block';
}

function nextLevel() {
    gameState = getNextLevelState(gameState);

    clearTimeout(fireTimer);
    clearTimeout(enemyTimer);

    document.querySelector('.button-next-level').style.display = 'none';
    messageBox.className = 'message';
    messageBox.textContent = '';
    
    document.querySelector('.score-panel__level').textContent = `Level ${gameState.level}`;

    gunmanElement.className = `gunman gunman-char-${gameState.character}`;

    void gunmanElement.offsetWidth;

    moveGunman();
}

function restartGame() {
    gameState = createInitialState();

    clearTimeout(fireTimer);
    clearTimeout(enemyTimer);

    document.querySelector('.button-restart').style.display = 'none';
    document.querySelector('.game-screen').classList.remove('game-screen--death');
    messageBox.className = 'message';
    messageBox.textContent = '';
    
    document.querySelector('.score-panel__score_num').textContent = gameState.score;
    document.querySelector('.score-panel__level').textContent = `Level ${gameState.level}`;
    document.querySelector('.time-panel__you').textContent = '0.00';

    gunmanElement.className = `gunman gunman-char-${gameState.character}`;
    void gunmanElement.offsetWidth; 

    moveGunman();
}

btnStart.addEventListener('click', startGame);
gunmanElement.addEventListener('mousedown', playerShootsGunman);
document.querySelector('.button-next-level').addEventListener('click', nextLevel);
document.querySelector('.button-restart').addEventListener('click', restartGame);