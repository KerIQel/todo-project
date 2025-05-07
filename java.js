
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});


const addTaskBtn = document.getElementById('addTaskBtn'); 
const taskForm = document.getElementById('taskForm'); 
const closeBtn = document.querySelector('.close'); 
const taskFormContent = document.getElementById('taskFormContent');
const taskListElement = document.getElementById('taskList'); 
const searchInput = document.getElementById('searchInput');

let tasks = [];


function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks() {
    taskList.innerHTML = ''; 

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]; 
        
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';

        
        const title = document.createElement('h3');
        title.textContent = task.title;
        taskCard.appendChild(title);

        
        const description = document.createElement('p');
        description.textContent = task.description;
        taskCard.appendChild(description);

   
        const deadline = document.createElement('p');
        deadline.className = 'deadline';
        deadline.textContent = `Дедлайн: ${task.deadline}`;
        taskCard.appendChild(deadline);

       
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags';

       
        const tags = task.tags.split(',');
        for (let j = 0; j < tags.length; j++) {
            const tag = tags[j].trim();
            if (tag) { 
                const tagElement = document.createElement('span');
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            }
        }

        taskCard.appendChild(tagsContainer);

    
        const status = document.createElement('div');
        status.className = 'status';
        status.textContent = `Статус: ${task.status}`;
        taskCard.appendChild(status);

        
        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.onclick = function () {
            editTask(i); 
        };
        taskCard.appendChild(editButton);

        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = function () {
            deleteTask(i); 
        };
        taskCard.appendChild(deleteButton);

        
        taskList.appendChild(taskCard);
    }
}


function addTask(title, description, deadline, tags, status) {
    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        deadline,
        tags,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: []
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}


function editTask(index) {
    const task = tasks[index];
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('deadline').value = task.deadline;
    document.getElementById('tags').value = task.tags;
    document.getElementById('status').value = task.status;
    taskForm.style.display = 'block';

    taskFormContent.onsubmit = function (e) {
        e.preventDefault();
        task.title = document.getElementById('title').value;
        task.description = document.getElementById('description').value;
        task.deadline = document.getElementById('deadline').value;
        task.tags = document.getElementById('tags').value;
        task.status = document.getElementById('status').value;
        task.updatedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
        taskForm.style.display = 'none';
    };
}


function deleteTask(index) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}


addTaskBtn.onclick = function () {
    taskForm.style.display = 'block';
    taskFormContent.reset();
    taskFormContent.onsubmit = function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;
        const tags = document.getElementById('tags').value;
        const status = document.getElementById('status').value;
        addTask(title, description, deadline, tags, status);
        taskForm.style.display = 'none';
    };
};


closeBtn.onclick = function () {
    taskForm.style.display = 'none';
};


document.addEventListener('click', function(event) {
    if (event.target === taskForm) {
        taskForm.style.display = 'none';
    }
});

function searchTasks() {
    const searchText = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchText)); 
    renderTasks(filteredTasks);
}


