
const catalog = new Map();
const categories = new Set();
const orders = new WeakMap();
const editedProducts = new WeakSet();

const currentUser = { name: "Ivan", id: 101 };

function addProduct(id, name, price, stock, category) {
    const product = { name, price, stock, category };
    catalog.set(id, product);
    if (category) categories.add(category);
    renderUI();
}

function deleteProduct(id) {
    catalog.delete(id);
    renderUI();
}

function updateProduct(id, newPrice, newStock) {
    if (catalog.has(id)) {
        const product = catalog.get(id);
        product.price = Number(newPrice);
        product.stock = Number(newStock);
        

        editedProducts.add(product);
        
        renderUI();
    }
}

function placeOrder(productId) {
    const product = catalog.get(productId);

    if (!product || product.stock <= 0) {
        alert("Товару немає в наявності!");
        return;
    }

    product.stock -= 1;

    let userPurchases = orders.get(currentUser) || [];
    userPurchases.push(product.name);
    orders.set(currentUser, userPurchases);

    console.log(`Замовлення для ${currentUser.name}:`, orders.get(currentUser));
    renderUI();
}

function renderUI() {
    const tbody = document.getElementById('catalog-body');
    const catList = document.getElementById('categories-list');
    tbody.innerHTML = '';

    catalog.forEach((p, id) => {
        const isEdited = editedProducts.has(p);
        const row = `
            <tr class="${isEdited ? 'highlight' : ''}">
                <td>${id}</td>
                <td>${p.name} <small>(${p.category})</small> ${isEdited ? '⭐' : ''}</td>
                <td>${p.price} грн</td>
                <td>${p.stock} шт</td>
                <td>
                    <button onclick="placeOrder('${id}')">Купити</button>
                    <button onclick="deleteProduct('${id}')">видалити</button>
                    <button onclick="promptUpdate('${id}')">змінити</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    catList.textContent = Array.from(categories).join(', ');
}

function handleAddProduct() {
    const id = Date.now().toString().slice(-4);
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const stock = document.getElementById('p-stock').value;
    const category = document.getElementById('p-category').value;

    if (name && price && stock) {
        addProduct(id, name, price, stock, category);
    }
}

function promptUpdate(id) {
    const p = catalog.get(id);
    const nPrice = prompt("Нова ціна:", p.price);
    const nStock = prompt("Нова кількість:", p.stock);
    if (nPrice !== null && nStock !== null) {
        updateProduct(id, nPrice, nStock);
    }
}

addProduct("001", "Laptop", 25000, 5, "Electronics");
addProduct("002", "Mouse", 800, 10, "Accessories");