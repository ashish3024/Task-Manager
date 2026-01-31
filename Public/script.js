const API_URL = 'http://localhost:3000/api/tasks';


async function fetchTasks() {
    const statusFilter = document.getElementById('filterStatus').value;
   
    const url = statusFilter === 'All' ? API_URL : `${API_URL}?status=${statusFilter}`;
    
    try {
        const res = await fetch(url);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        console.error("Error loading tasks:", err);
    }
}

function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-details">
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
            </div>
            <div class="actions">
                <span class="status-badge ${task.status.replace(' ', '.')}" 
                      onclick="cycleStatus(${task.id}, '${task.status}')">
                      ${task.status}
                </span>
                <button onclick="deleteTask(${task.id})" style="background:#dc3545; padding:5px 10px;">X</button>
            </div>
        `;
        list.appendChild(li);
    });
}


async function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;

    if (!title) return alert("Title is required!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    fetchTasks();
}


async function deleteTask(id) {
    if (confirm("Delete this task?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    }
}


async function cycleStatus(id, currentStatus) {
    const statuses = ['Pending', 'In Progress', 'Completed'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
    });
    fetchTasks();
}


fetchTasks();