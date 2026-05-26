const API_URL = 'https://randomuser.me/api/?results=30';
const app = document.getElementById('app');

const login = () => localStorage.setItem('auth', 'true') || renderApp();
const logout = () => localStorage.removeItem('auth') || renderLogin();
const isAuth = () => localStorage.getItem('auth') === 'true';

const getFavs = () => JSON.parse(localStorage.getItem('favs') || '[]');
const toggleFav = (id) => {
    const favs = getFavs();
    const newFavs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem('favs', JSON.stringify(newFavs));
    renderUsers();
};

const debounce = (fn, ms) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
};

const updateURL = (params) => {
    const url = new URL(window.location);
    Object.entries(params).forEach(([k, v]) => v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    window.history.pushState({}, '', url);
};

let users = [];

const fetchUsers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    users = data.results;
    renderUsers();
};

const getParams = () => new URLSearchParams(window.location.search);

const filterSortUsers = (users) => {
    const params = getParams();
    const search = params.get('search')?.toLowerCase() || '';
    const sort = params.get('sort');

    let res = users.filter(u => 
        `${u.name.first} ${u.name.last}`.toLowerCase().includes(search) ||
        u.location.city.toLowerCase().includes(search)
    );

    if (sort === 'name-asc') res.sort((a, b) => a.name.first.localeCompare(b.name.first));
    if (sort === 'name-desc') res.sort((a, b) => b.name.first.localeCompare(a.name.first));
    if (sort === 'age') res.sort((a, b) => a.dob.age - b.dob.age);

    return res;
};

const renderUser = (u) => {
    const isFav = getFavs().includes(u.login.uuid);
    return `
        <div class="card">
            <img src="${u.picture.large}" alt="user">
            <h3>${u.name.first} ${u.name.last}</h3>
            <p>${u.dob.age} years old</p>
            <p>${u.location.city}, ${u.location.country}</p>
            <p>${u.email}</p>
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav('${u.login.uuid}')">
                ${isFav ? 'Remove from Friends' : 'Add to Friends'}
            </button>
        </div>`;
};

const renderUsers = () => {
    document.getElementById('grid').innerHTML = filterSortUsers(users).map(renderUser).join('');
};

const handleSearch = debounce(e => {
    updateURL({ search: e.target.value });
    renderUsers();
}, 300);

const handleSort = e => {
    updateURL({ sort: e.target.value });
    renderUsers();
};

const renderLogin = () => {
    app.innerHTML = `
        <div class="login-form">
            <h2>Sign In</h2>
            <input type="text" placeholder="Username">
            <input type="password" placeholder="Password">
            <button onclick="login()">Login</button>
        </div>`;
};

const renderApp = () => {
    app.innerHTML = `
        <div class="controls">
            <button onclick="logout()">Logout</button>
            <input type="text" placeholder="Search by name or city..." oninput="handleSearch(event)" value="${getParams().get('search') || ''}">
            <select onchange="handleSort(event)">
                <option value="">Sort...</option>
                <option value="name-asc" ${getParams().get('sort') === 'name-asc' ? 'selected' : ''}>Name (A-Z)</option>
                <option value="name-desc" ${getParams().get('sort') === 'name-desc' ? 'selected' : ''}>Name (Z-A)</option>
                <option value="age" ${getParams().get('sort') === 'age' ? 'selected' : ''}>Age</option>
            </select>
        </div>
        <div id="grid" class="grid"></div>
    `;
    fetchUsers();
};

window.addEventListener('popstate', renderUsers);
isAuth() ? renderApp() : renderLogin();