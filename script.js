// 模擬 API 資料庫 (使用 LocalStorage)
let db = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const logContainer = document.getElementById('log-container');
const todoCount = document.getElementById('todo-count');

// --- 核心功能 (模擬後端 API 邏輯) ---

function render() {
    todoList.innerHTML = db.map(item => `
        <li class="todo-item ${item.completed ? 'completed' : ''}">
            <span onclick="toggleTodo('${item.id}')">${item.content}</span>
            <button class="btn-danger" onclick="deleteTodo('${item.id}')">刪除</button>
        </li>
    `).join('');
    todoCount.innerText = `${db.length} 項目`;
    localStorage.setItem('todos', JSON.stringify(db));
}

// 模擬 POST /todos
addBtn.onclick = () => {
    const content = todoInput.value.trim();
    if (!content) return addLog('400 Bad Request', '內容不能為空', 'error');

    const newTodo = {
        id: crypto.randomUUID().split('-')[0], // 產生簡短 ID
        content,
        completed: false
    };
    db.push(newTodo);
    addLog('201 Created', `新增成功: ${content}`, 'post');
    todoInput.value = '';
    render();
};

// 模擬 PATCH /todos/:id
window.toggleTodo = (id) => {
    const item = db.find(t => t.id === id);
    item.completed = !item.completed;
    addLog('200 OK', `修改狀態 ID: ${id}`, 'patch');
    render();
};

// 模擬 DELETE /todos/:id
window.deleteTodo = (id) => {
    db = db.filter(t => t.id !== id);
    addLog('200 OK', `刪除成功 ID: ${id}`, 'delete');
    render();
};

// 模擬日誌紀錄系統
function addLog(status, message, type) {
    const logItem = document.createElement('div');
    logItem.className = `log-item ${type}`;
    const time = new Date().toLocaleTimeString();
    logItem.innerHTML = `<strong>[${time}] ${status}</strong><br>${message}`;
    
    const placeholder = document.querySelector('.log-placeholder');
    if (placeholder) placeholder.remove();
    
    logContainer.appendChild(logItem);
}

// 初始化
render();