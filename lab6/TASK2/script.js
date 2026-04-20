// Початковий стан
let state = {
    todos: [],
    sortBy: 'created'
};

// --- Pure Functions (Чисті функції)  ---

const createTodo = (text, dueDate, isCompleted) => ({
    id: Date.now(),
    text,
    dueDate,
    completed: isCompleted === 'true',
    createdAt: Date.now(),
    updatedAt: Date.now()
});

const addTodo = (todos, newTodo) => [...todos, newTodo];

const toggleStatus = (todos, id) => todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
);

const removeTask = (todos, id) => todos.filter(t => t.id !== id);

const sortTasks = (todos, criteria) => {
    const list = [...todos];
    switch(criteria) {
        case 'date': return list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        case 'status': return list.sort((a, b) => a.completed - b.completed);
        case 'created': return list.sort((a, b) => b.createdAt - a.createdAt);
        default: return list;
    }
};

// --- Rendering & Events ---

const render = () => {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    sortTasks(state.todos, state.sortBy).forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'todo-info';
        infoDiv.onclick = () => {
            state.todos = toggleStatus(state.todos, todo.id);
            render();
        };

        const title = document.createElement('span');
        title.className = 'todo-text';
        title.textContent = todo.text;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-date';
        dateSpan.textContent = `Дедлайн: ${todo.dueDate}`;

        infoDiv.append(title, dateSpan);

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-del';
        delBtn.textContent = 'Видалити';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            state.todos = removeTask(state.todos, todo.id);
            render();
        };

        li.append(infoDiv, delBtn);
        list.appendChild(li);
    });
};

document.getElementById('todo-form').onsubmit = (e) => {
    e.preventDefault();
    const text = document.getElementById('todo-input').value;
    const date = document.getElementById('todo-date').value;
    const status = document.getElementById('todo-status').value;

    const newTask = createTodo(text, date, status);
    state.todos = addTodo(state.todos, newTask);
    
    e.target.reset();
    render();
};

window.setSort = (criteria) => {
    state.sortBy = criteria;
    render();
};

render();