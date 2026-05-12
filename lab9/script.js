// Перемикання табів [cite: 25]
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tabName}-form`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Логіка міст (динамічне поле) [cite: 37]
const cities = {
    ua: ['Kyiv', 'Lviv', 'Chernivtsi'],
    pl: ['Warsaw', 'Krakow', 'Wroclaw']
};

document.getElementById('country-select').addEventListener('change', function() {
    const citySelect = document.getElementById('city-select');
    citySelect.innerHTML = '<option value="">Select city</option>';
    
    if (this.value) {
        citySelect.disabled = false;
        cities[this.value].forEach(city => {
            let opt = document.createElement('option');
            opt.value = city.toLowerCase();
            opt.innerText = city;
            citySelect.appendChild(opt);
        });
    } else {
        citySelect.disabled = true;
    }
});

// Показати/приховати пароль [cite: 32, 41]
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
});

// Валідація [cite: 48]
const setError = (el, msg) => {
    const group = el.parentElement;
    const errorDisplay = group.querySelector('.error-msg');
    errorDisplay.innerText = msg;
    el.classList.add('invalid');
    el.classList.remove('valid');
};

const setSuccess = el => {
    const group = el.parentElement;
    const errorDisplay = group.querySelector('.error-msg');
    errorDisplay.innerText = '';
    el.classList.add('valid');
    el.classList.remove('invalid');
};

// Обробка реєстрації [cite: 27-37, 52]
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    const formData = new FormData(this); 

    
    // Валідація First/Last Name [cite: 28, 29]
    ['firstName', 'lastName'].forEach(name => {
        const val = formData.get(name).trim();
        if (val.length < 3 || val.length > 15) {
            setError(this[name], "Повинно бути від 3 до 15 символів");
            isValid = false;
        } else setSuccess(this[name]);
    });

    // Email (Regex) [cite: 30]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get('email'))) {
        setError(this['email'], "Невірний формат email");
        isValid = false;
    } else setSuccess(this['email']);

    // Password [cite: 31, 32]
    const pass = formData.get('password');
    const confirm = formData.get('confirmPassword');
    if (pass.length < 6) {
        setError(this['password'], "Мінімум 6 символів");
        isValid = false;
    } else setSuccess(this['password']);

    if (confirm !== pass || !confirm) {
        setError(this['confirmPassword'], "Паролі не збігаються");
        isValid = false;
    } else setSuccess(this['confirmPassword']);

    // Phone [cite: 33]
    if (!formData.get('phone').startsWith('+380') || formData.get('phone').length !== 13) {
        setError(this['phone'], "Формат: +380XXXXXXXXX");
        isValid = false;
    } else setSuccess(this['phone']);

    // Date Birth [cite: 34]
    const birth = new Date(formData.get('birthDate'));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (birth > today || !formData.get('birthDate')) {
        setError(this['birthDate'], "Дата не може бути у майбутньому");
        isValid = false;
    } else if (age < 12) {
        setError(this['birthDate'], "Вам має бути більше 12 років");
        isValid = false;
    } else setSuccess(this['birthDate']);

    // Selects [cite: 35, 36, 37]
    ['sex', 'country', 'city'].forEach(name => {
        if (!formData.get(name)) {
            setError(this[name], "Обов'язкове поле");
            isValid = false;
        } else setSuccess(this[name]);
    });

    if (isValid) {
        alert("Ви успішно зареєстровані!"); // [cite: 55]
        this.reset(); // 
        document.querySelectorAll('input, select').forEach(el => el.classList.remove('valid'));
    }
});

// Обробка логіну [cite: 38-42]
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    
    if (!this.username.value.trim()) {
        setError(this.username, "Введіть username");
        isValid = false;
    } else setSuccess(this.username);

    if (this.password.value.length < 6) {
        setError(this.password, "Мінімум 6 символів");
        isValid = false;
    } else setSuccess(this.password);

    if (isValid) {
        console.log("Login data:", Object.fromEntries(new FormData(this)));
        alert("Вхід виконано!");
        this.reset();
    }
});