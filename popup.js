const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTask');
const addTaskBtn = document.getElementById('addTaskBtn');
const dateLabel = document.getElementById('dateLabel');

let currentDate = new Date();
let currentTasks = [];

// Load tasks for the current day
function loadTasks(date) {
  const dateString = formatDate(date);
  chrome.storage.local.get([dateString], function (result) {
    currentTasks = result[dateString] || [];
    updateTaskList();
  });
}

// Format date to string YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Update the UI with the task list
function updateTaskList() {
  taskList.innerHTML = '';
  currentTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item fade-in';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.backgroundColor = 'var(--secondary-color)';
    li.style.padding = '1rem';
    li.style.borderRadius = '8px';
    li.style.marginBottom = '1rem';
    li.style.transition = 'transform 0.3s ease';

    li.addEventListener('mouseenter', () => {
      li.style.transform = 'translateY(-3px)';
    });
    li.addEventListener('mouseleave', () => {
      li.style.transform = 'translateY(0)';
    });

    // Task text
    const taskText = document.createElement('span');
    taskText.textContent = task;
    taskText.style.flexGrow = '1';
    taskText.style.color = 'var(--text-color)';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.color = '#60a5fa'; // Tailwind blue-400
    editBtn.style.border = 'none';
    editBtn.style.background = 'none';
    editBtn.style.cursor = 'pointer';
    editBtn.style.marginRight = '0.5rem';
    editBtn.style.textDecoration = 'underline';

    editBtn.addEventListener('click', () => editTask(index));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.color = '#f87171'; // Tailwind red-400
    deleteBtn.style.border = 'none';
    deleteBtn.style.background = 'none';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.textDecoration = 'underline';

    deleteBtn.addEventListener('click', () => deleteTask(index));

    // Append to task item
    li.appendChild(taskText);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    // Add task item to task list
    taskList.appendChild(li);
  });
}

// Add a new task
addTaskBtn.addEventListener('click', function () {
  const task = newTaskInput.value.trim();
  if (task) {
    currentTasks.push(task);
    newTaskInput.value = '';
    saveTasks();
    updateTaskList();
  }
});

// Edit task
function editTask(index) {
  const newTask = prompt('Edit task:', currentTasks[index]);
  if (newTask !== null && newTask.trim() !== '') {
    currentTasks[index] = newTask;
    saveTasks();
    updateTaskList();
  }
}

// Delete task
function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    currentTasks.splice(index, 1);
    saveTasks();
    updateTaskList();
  }
}

// Save tasks to storage
function saveTasks() {
  const dateString = formatDate(currentDate);
  const tasksToSave = {};
  tasksToSave[dateString] = currentTasks;
  chrome.storage.local.set(tasksToSave);
}

// Navigate to the previous day
document.getElementById('prevDay').addEventListener('click', function () {
  currentDate.setDate(currentDate.getDate() - 1);
  dateLabel.textContent = formatDate(currentDate);
  loadTasks(currentDate);
});

// Navigate to the next day
document.getElementById('nextDay').addEventListener('click', function () {
  currentDate.setDate(currentDate.getDate() + 1);
  dateLabel.textContent = formatDate(currentDate);
  loadTasks(currentDate);
});

// Initialize the app by loading today's tasks
window.onload = function () {
  dateLabel.textContent = formatDate(currentDate);
  loadTasks(currentDate);
};
