const toggleBtn = document.getElementById('toggle');
const grid = document.getElementById('grid');

let editMode = false;
let dragged = null;
let placeholder = document.createElement('div');
placeholder.classList.add('placeholder');


toggleBtn.onclick = () => {
    editMode = !editMode;

    document.body.classList.toggle('edit-mode');
    toggleBtn.textContent = editMode ? 'Готово' : 'Редагувати';

    updateCards();
};


function updateCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {


    if (!card.querySelector('.delete')) {
        const btn = document.createElement('button');
        btn.classList.add('delete');
        btn.textContent = '✖';

        btn.onclick = () => card.remove();

        card.appendChild(btn);
    }


    card.draggable = editMode;

    card.addEventListener('dragstart', () => {
        if (!editMode) return;

        dragged = card;
        card.classList.add('dragging');

        setTimeout(() => {
        card.style.display = 'none';
        }, 0);
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        card.style.display = 'block';
        placeholder.remove();
        dragged = null;
    });
    });
}


grid.addEventListener('dragover', (e) => {
    e.preventDefault();

    if (!dragged) return;

    const afterElement = getDragAfterElement(grid, e.clientX, e.clientY);

    if (afterElement == null) {
    grid.appendChild(placeholder);
    } else {
    grid.insertBefore(placeholder, afterElement);
    }
});


grid.addEventListener('drop', () => {
    if (placeholder && dragged) {
    grid.insertBefore(dragged, placeholder);
    placeholder.remove();
    }
});

function getDragAfterElement(container, x, y) {
    const elements = [...container.querySelectorAll('.card:not(.dragging)')];

    return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();

    const offset =
        (y - box.top - box.height / 2) * 1000 +
        (x - box.left - box.width / 2);

    if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
    } else {
        return closest;
    }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


updateCards();