// Стандартні налаштування часу (у секундах)
const defaultTimings = {
    red: 5,
    yellow: 3,
    green: 7,
};

let timings = { ...defaultTimings };
const blinkCount = 3;

let mainTimeout;    
let visualInterval; 
let phase = 0;     

const lamps = {
    red: document.getElementById('red'),
    yellow: document.getElementById('yellow'),
    green: document.getElementById('green')
};
const statusField = document.getElementById('status-text');
const timerField = document.getElementById('timer-text');


const resetLamps = () => {
    lamps.red.className = 'lamp-flat';
    lamps.yellow.className = 'lamp-flat';
    lamps.green.className = 'lamp-flat';
};


const updateTimerDisplay = (seconds) => {
    clearInterval(visualInterval);
    let left = seconds;
    timerField.textContent = `${left} с.`;

    visualInterval = setInterval(() => {
        left--;
        if (left > 0) {
            timerField.textContent = `${left} с.`;
        } else {
            timerField.textContent = "0 с.";
            clearInterval(visualInterval);
        }
    }, 1000);
};


const doBlinkingPhase = () => {
    resetLamps();
    statusField.textContent = "УВАГА";
    timerField.textContent = "--";

    let turns = 0;
    const maxTurns = blinkCount * 2;

    const blinker = setInterval(() => {
        lamps.yellow.classList.toggle('yellow-active');
        turns++;

        if (turns >= maxTurns) {
            clearInterval(blinker);
            phase = 0;
            startCycle();
        }
    }, 500);
};


const startCycle = () => {
    clearTimeout(mainTimeout);
    clearInterval(visualInterval);
    resetLamps();

    let currentDuration = 0;

    switch (phase) {
        case 0:
            lamps.red.classList.add('red-active');
            statusField.textContent = "СТОП";
            currentDuration = timings.red;
            phase = 1;
            break;
        case 1: 
            lamps.yellow.classList.add('yellow-active');
            statusField.textContent = "ГОТОВНІСТЬ";
            currentDuration = timings.yellow;
            phase = 2;
            break;
        case 2: 
            lamps.green.classList.add('green-active');
            statusField.textContent = "РУХ";
            currentDuration = timings.green;
            phase = 3;
            break;
        case 3: 
            doBlinkingPhase();
            return; 
    }

    updateTimerDisplay(currentDuration);

    mainTimeout = setTimeout(startCycle, currentDuration * 1000);
};

document.getElementById('next-btn').addEventListener('click', () => {
    startCycle();
});

document.getElementById('settings-btn').addEventListener('click', () => {
    const newRed = prompt("Час ЧЕРВОНОГО (сек):", timings.red);
    const newYellow = prompt("Час ЖОВТОГО (сек):", timings.yellow);
    const newGreen = prompt("Час ЗЕЛЕНОГО (сек):", timings.green);

    if (newRed && !isNaN(newRed) && newYellow && !isNaN(newYellow) && newGreen && !isNaN(newGreen)) {
        timings.red = parseInt(newRed);
        timings.yellow = parseInt(newYellow);
        timings.green = parseInt(newGreen);
        alert("Час змінено. Цикл перезапускається.");
        phase = 0; 
        startCycle();
    } else if (newRed || newYellow || newGreen) {
        alert("Помилка вводу. Залишено старі таймінги.");
    }
});

startCycle();