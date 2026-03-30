// === 1. ЦИФРОВИЙ ГОДИННИК ===
const updateClock = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    const clockElement = document.getElementById('clock');
    clockElement.childNodes[0].textContent = h;
    clockElement.childNodes[2].textContent = m;
    clockElement.childNodes[4].textContent = s;

    document.querySelectorAll('.dots').forEach(dot => {
        dot.classList.toggle('hidden');
    });
};
setInterval(updateClock, 1000);

let countdownInterval;
const targetInput = document.getElementById('target-date');
const timerDisplay = document.getElementById('countdown-display');

const startCountdown = () => {
    clearInterval(countdownInterval);
    const targetDate = new Date(targetInput.value);

    if (isNaN(targetDate)) return;

    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            timerDisplay.textContent = "Час вийшов!";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        timerDisplay.textContent = `Днів: ${days}, Годин: ${hours}, Хвилин: ${mins}, Секунд: ${secs}`;
    }, 1000);
};
targetInput.addEventListener('change', startCountdown);

const monthInput = document.getElementById('month-select');
const calendarContainer = document.getElementById('calendar-container');

const generateCalendar = () => {
    if (!monthInput.value) return;
    
    const [year, month] = monthInput.value.split('-').map(Number);
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); 
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();

    let table = '<table><tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Нд</th></tr><tr>';
    
    let shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = 0; i < shift; i++) table += '<td></td>';

    for (let day = 1; day <= daysInMonth; day++) {
        if ((shift + day - 1) % 7 === 0 && day !== 1) table += '</tr><tr>';
        
        const isToday = today.getDate() === day && today.getMonth() === (month - 1) && today.getFullYear() === year;
        table += `<td class="${isToday ? 'today' : ''}">${day}</td>`;
    }

    table += '</tr></table>';
    calendarContainer.innerHTML = table;
};
monthInput.addEventListener('change', generateCalendar);

document.getElementById('birthday-btn').addEventListener('click', () => {
    if (!monthInput.value) {
        alert("Спочатку оберіть місяць та рік у календарі!");
        return;
    }

    const [selectedYear, selectedMonth] = monthInput.value.split('-').map(Number);
    const now = new Date();
    
    let bday = new Date(now.getFullYear(), selectedMonth - 1, 15); 
    if (bday < now) bday.setFullYear(now.getFullYear() + 1);

    const diff = bday - now;
    const monthsLeft = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    const daysLeft = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30.44);

    document.getElementById('birthday-result').textContent = 
        `До наступного 15-го числа цього місяця: ~${monthsLeft} міс. та ${daysLeft} дн.`;
});

const init = () => {
    const now = new Date();
    monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    generateCalendar();
};
init();