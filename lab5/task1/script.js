const bulb = document.getElementById('bulb');
const typeSelect = document.getElementById('type-select');
const toggleBtn = document.getElementById('toggle-btn');
const brightnessBtn = document.getElementById('brightness-btn');

let autoOffTimer;

const resetTimer = () => {
    clearTimeout(autoOffTimer);
    autoOffTimer = setTimeout(() => {
        if (bulb.classList.contains('on')) {
            turnOff();
        }
    }, 10000); 
};

const turnOff = () => {
    bulb.classList.remove('on');
    bulb.style.opacity = 1; 
};

const toggleBulb = () => {
    const isOn = bulb.classList.toggle('on');
    if (!isOn) bulb.style.opacity = 1;
    resetTimer();
};

const changeBrightness = () => {
    if (!bulb.classList.contains('on')) return;

    const value = prompt("Введіть яскравість від 1 до 100:", "100");
    const brightness = parseInt(value);

    if (brightness >= 1 && brightness <= 100) {
        bulb.style.opacity = brightness / 100;
        resetTimer();
    } else {
        alert("Будь ласка, введіть коректне число від 1 до 100");
    }
};

const changeType = (event) => {
    const type = event.target.value;
    bulb.classList.remove('eco', 'led', 'regular');
    if (type !== 'regular') bulb.classList.add(type);
    resetTimer();
};

toggleBtn.addEventListener('click', toggleBulb);
brightnessBtn.addEventListener('click', changeBrightness);
typeSelect.addEventListener('change', changeType);

resetTimer();
