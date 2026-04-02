let todos = [];
let currentTab = 'all';

const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const historyContainer = document.getElementById('history-container');
const jsonResponse = document.getElementById('json-response');

// Tabs text span IDs
const countAll = document.getElementById('count-all');
const countPending = document.getElementById('count-pending');
const countDone = document.getElementById('count-done');

if (todoDate) {
  todoDate.value = new Date().toISOString().split('T')[0];
}

// Render initial state
function renderTodos() {
  const pendingCount = todos.filter(t => !t.completed).length;
  const doneCount = todos.filter(t => t.completed).length;
  
  countAll.textContent = todos.length;
  countPending.textContent = pendingCount;
  countDone.textContent = doneCount;
  
  let filteredTodos = todos;
  if (currentTab === 'pending') filteredTodos = todos.filter(t => !t.completed);
  if (currentTab === 'done') filteredTodos = todos.filter(t => t.completed);
  
  if (filteredTodos.length === 0) {
    todoList.innerHTML = '<div class="empty-text">目前沒有待辦事項！</div>';
    return;
  }
  
  todoList.innerHTML = filteredTodos.map(t => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #4b5563;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTodo(${t.id})" style="cursor: pointer; width: 16px; height: 16px;">
        <span style="${t.completed ? 'text-decoration: line-through; color: #9ca3af;' : ''}">${t.content}</span>
        ${t.date ? `<span style="font-size: 12px; color: #6b7280; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${t.date}</span>` : ''}
      </div>
      <button onclick="deleteTodo(${t.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; display: flex; align-items: center; padding: 4px;"> <i class="fa-solid fa-xmark"></i> <span style="margin-left:4px;">刪除</span></button>
    </div>
  `).join('');
}

function updateAPIStatus(method, path, data, status) {
  // Update response JSON
  const jsonStr = JSON.stringify({ status: true, data: data }, null, 2);
  
  // Colorize JSON
  const coloredStr = jsonStr.replace(/"([^"]+)":/g, '<span style="color:#10b981">"$1"</span>:')
                            .replace(/: (true|false)/g, ': <span style="color:#60a5fa">$1</span>')
                            .replace(/\{|\}|\[|\]/g, match => `<span style="color:#d1d5db">${match}</span>`);
  jsonResponse.innerHTML = coloredStr;
  
  // Add History
  const time = Math.floor(Math.random() * 800) + 200;
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  const methodClass = method.toLowerCase();
  
  historyItem.innerHTML = `
    <span class="hist-method ${methodClass}">${method}</span>
    <span class="hist-path">${path}</span>
    <span class="hist-code">${status}</span>
    <span class="hist-time">${time}ms</span>
  `;
  historyContainer.prepend(historyItem);
  
  // Flash connection line
  const line = document.getElementById('connection-line');
  line.style.backgroundColor = '#60a5fa'; // Blue flash
  setTimeout(() => {
    line.style.backgroundColor = '#10b981';
  }, 300);

  // Update Endpoint block
  const currentMethod = document.getElementById('current-method');
  const currentPath = document.getElementById('current-path');
  currentMethod.textContent = method;
  currentMethod.className = `method ${methodClass}`;
  currentPath.textContent = path;
}

// Add Item
addBtn.addEventListener('click', () => {
  const content = todoInput.value.trim();
  const dateVal = todoDate ? todoDate.value : '';
  if (!content) return;
  
  const newItem = {
    id: Date.now(),
    content: content,
    date: dateVal,
    completed: false
  };
  
  todos.push(newItem);
  todoInput.value = '';
  
  updateAPIStatus('POST', '/todos/', newItem, 201);
  renderTodos();
});

// Delete Item
window.deleteTodo = (id) => {
  todos = todos.filter(t => t.id !== id);
  updateAPIStatus('DELETE', `/todos/${id}`, { message: '刪除成功' }, 200);
  renderTodos();
};

// Toggle Item
window.toggleTodo = (id) => {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    updateAPIStatus('PATCH', `/todos/${id}`, { completed: todo.completed }, 200);
    renderTodos();
  }
};

// Toggle switch
const toggleBg = document.getElementById('slow-mode-toggle-btn');
const toggleThumb = document.getElementById('slow-mode-thumb');
let slowMode = false;
toggleBg.addEventListener('click', () => {
  slowMode = !slowMode;
  if (slowMode) {
    toggleBg.style.backgroundColor = '#7b99ff';
    toggleThumb.style.transform = 'translateX(16px)';
  } else {
    toggleBg.style.backgroundColor = '#4b5563';
    toggleThumb.style.transform = 'translateX(0)';
  }
});

// Export to store.json
const exportBtn = document.getElementById('export-btn');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'store.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// Setup mock initially
renderTodos();

// Tabs switching logic
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.getAttribute('data-tab');
    renderTodos();
  });
});