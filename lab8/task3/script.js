const tasks = document.querySelectorAll('.task');
const columns = document.querySelectorAll('.column');

let dragged = null;

tasks.forEach(task => {
  task.addEventListener('dragstart', (e) => {
    dragged = task;
    setTimeout(() => {
      task.style.display = 'none';
    }, 0);
  });

  task.addEventListener('dragend', () => {
    setTimeout(() => {
      task.style.display = 'block';
      dragged = null;
    }, 0);
  });
});

columns.forEach(column => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault(); // дозволяє drop
    column.classList.add('over');
  });

  column.addEventListener('dragleave', () => {
    column.classList.remove('over');
  });

  column.addEventListener('drop', () => {
    column.classList.remove('over');

    if (dragged) {
      column.appendChild(dragged);
    }
  });
});