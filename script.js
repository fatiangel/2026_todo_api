let todos = [];

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const historyContainer = document.getElementById('history-container');
const jsonResponse = document.getElementById('json-response');

// Tabs text span IDs
const countAll = document.getElementById('count-all');
const countPending = document.getElementById('count-pending');
const countDone = document.getElementById('count-done');

// Render initial state
function renderTodos() {
  countAll.textContent = todos.length;
  countPending.textContent = todos.length; // Simplified for this demo
  countDone.textContent = 0;
  
  if (todos.length === 0) {
    todoList.innerHTML = '<div class="empty-text">還沒有待辦事項，新增一筆吧！</div>';
    return;
  }
  
  todoList.innerHTML = todos.map(t => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #4b5563;">
      <span>${t.content}</span>
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
  if (!content) return;
  
  const newItem = {
    id: Date.now(),
    content: content,
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

// Setup mock initially
renderTodos();