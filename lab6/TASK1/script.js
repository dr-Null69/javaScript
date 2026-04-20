'use strict';

// Стан додатку
let products = [];
let currentFilter = 'all';
let currentSort = null;

// Елементи DOM
const dom = {
    list: document.getElementById('product-list'),
    totalPrice: document.getElementById('total-price'),
    modal: document.getElementById('modal'),
    form: document.getElementById('product-form'),
    filterContainer: document.getElementById('filter-buttons'),
    snackbar: document.getElementById('snackbar')
};

// --- Pure Functions (Чисті функції) ---

const generateId = () => Date.now().toString();

const formatPrice = (price) => `${Number(price).toLocaleString()} грн`;

const calculateTotal = (items) => items.reduce((sum, item) => sum + Number(item.price), 0);

const getCategories = (items) => ['all', ...new Set(items.map(i => i.category))];

const filterItems = (items, category) => 
    category === 'all' ? items : items.filter(i => i.category === category);

const sortItems = (items, criteria) => {
    if (!criteria) return items;
    return [...items].sort((a, b) => {
        if (criteria === 'price') return a.price - b.price;
        return new Date(b[criteria]) - new Date(a[criteria]);
    });
};

// --- UI Logic ---

const showSnackbar = (message) => {
    dom.snackbar.textContent = message;
    dom.snackbar.className = "show";
    setTimeout(() => { dom.snackbar.className = dom.snackbar.className.replace("show", ""); }, 3000);
};

const render = () => {
    // Отримуємо відфільтровані та відсортовані дані
    let displayProducts = filterItems(products, currentFilter);
    displayProducts = sortItems(displayProducts, currentSort);

    // Відображення порожнього списку [cite: 7]
    if (products.length === 0) {
        dom.list.innerHTML = `<p class="empty-msg">Наразі список товарів пустий. Додайте новий товар.</p>`;
    } else {
        dom.list.innerHTML = '';
        displayProducts.forEach(product => {
            const card = createProductCard(product);
            dom.list.appendChild(card);
        });
    }

    // Оновлення категорій та ціни [cite: 16, 17]
    updateFilterButtons();
    dom.totalPrice.textContent = formatPrice(calculateTotal(products));
};

const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'product-card animate-in';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <small>ID: ${product.id}</small>
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <span class="badge">${product.category}</span>
            <div class="actions">
                <button onclick="openEditModal('${product.id}')" class="btn-edit">Редагувати</button>
                <button onclick="handleDelete('${product.id}')" class="btn-delete">Видалити</button>
            </div>
        </div>
    `;
    return card;
};

// --- Event Handlers ---

const handleFormSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const data = {
        name: document.getElementById('prod-name').value,
        price: document.getElementById('prod-price').value,
        category: document.getElementById('prod-category').value,
        image: document.getElementById('prod-img').value,
        updatedAt: new Date()
    };

    if (id) {
        // Редагування [cite: 13, 14, 15]
        products = products.map(p => p.id === id ? { ...p, ...data } : p);
        showSnackbar(`Оновлено: ${data.name} (ID: ${id})`);
    } else {
        // Створення [cite: 10]
        const newProd = { ...data, id: generateId(), createdAt: new Date() };
        products.push(newProd);
    }

    closeModal();
    render();
};

window.handleDelete = (id) => {
    const prod = products.find(p => p.id === id);
    products = products.filter(p => p.id !== id);
    showSnackbar(`Товар "${prod.name}" видалено`);
    render();
};

// --- Фільтрація та Сортування ---

const updateFilterButtons = () => {
    const cats = getCategories(products);
    dom.filterContainer.innerHTML = cats.map(cat => `
        <button class="btn ${currentFilter === cat ? 'active' : ''}"
                onclick="setFilter('${cat}')">${cat}</button>
    `).join('');
};

window.setFilter = (cat) => {
    currentFilter = cat;
    render();
};

window.openEditModal = (id) => {
    const prod = products.find(p => p.id === id);
    if (prod) {
        document.getElementById('modal-title').textContent = 'Редагувати товар';
        document.getElementById('edit-id').value = prod.id;
        document.getElementById('prod-name').value = prod.name;
        document.getElementById('prod-price').value = prod.price;
        document.getElementById('prod-category').value = prod.category;
        document.getElementById('prod-img').value = prod.image;
    } else {
        document.getElementById('modal-title').textContent = 'Додати товар';
        dom.form.reset();
        document.getElementById('edit-id').value = '';
    }
    dom.modal.style.display = 'flex';
};

const closeModal = () => { dom.modal.style.display = 'none'; };

// Ініціалізація
document.getElementById('add-product-btn').onclick = () => openEditModal();
document.getElementById('close-modal').onclick = closeModal;
dom.form.onsubmit = handleFormSubmit;
document.getElementById('reset-filter').onclick = () => setFilter('all');
document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.onclick = () => {
        currentSort = btn.dataset.sort;
        render();
    };
});
document.getElementById('reset-sort').onclick = () => {
    currentSort = null;
    render();
};

render();