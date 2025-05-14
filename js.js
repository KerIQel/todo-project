/**
 Обработчик события, который срабатывает, когда полностью загружена HTML-структура страницы (DOM).
  Инициализирует приложение, загружая сохраненные задачи из localStorage.
  
 * });
 */
 document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

/**
 * Кнопка для открытия формы добавления новой задачи.
 * @type {HTMLButtonElement}
 */
 const addTaskBtn = document.getElementById('addTaskBtn');

 /**
  * Модальное окно формы для добавления/редактирования задачи.
  * @type {HTMLDivElement}
  */
 const taskForm = document.getElementById('taskForm');
 
 /**
  * Кнопка закрытия модального окна формы.
  * @type {HTMLButtonElement}
  */
 const closeBtn = document.querySelector('.close');
 
 /**
  * Контейнер с содержимым формы (полями ввода и кнопками).
  * @type {HTMLFormElement}
  */
 const taskFormContent = document.getElementById('taskFormContent');
 
 /**
  * DOM-элемент, содержащий список всех задач.
  * @type {HTMLDivElement}
  */
 const taskListElement = document.getElementById('taskList');
 
 /**
  * Поле ввода для поиска задач по названию, описанию или тегам.
  * @type {HTMLInputElement}
  */
 const searchInput = document.getElementById('searchInput');

let tasks = [];

/**
 * Загружает сохраненные задачи из localStorage в приложение.
 * Если в localStorage есть данные, парсит их из JSON и обновляет список задач.
 * После загрузки вызывает рендеринг задач через функцию renderTasks().

 */
 function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

/**
 * Сохраняет текущий массив задач в localStorage браузера.
 * Перед сохранением преобразует массив в JSON-строку.
 * Функция должна вызываться после любого изменения массива задач.
 *
 */
 function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
/**
 * Рендерит список задач в DOM-элементе taskListElement.
 * Может отображать как все задачи, так и отфильтрованный список.
 * Для каждой задачи создает карточку с полной информацией и кнопками управления.
 * Функция выполняет следующие действия:
 * 1. Очищает контейнер taskListElement
 * 2. Для каждой задачи создает DOM-элемент карточки
 * 3. Заполняет карточку данными задачи:
 *    - Заголовок
 *    - Описание
 *    - Дедлайн
 *    - Теги (разделенные запятыми)
 *    - Статус
 * 4. Добавляет кнопки управления:
 *    - Редактировать (вызывает editTask)
 *    - Удалить (вызывает deleteTask)
 * 5. Добавляет готовую карточку в DOM
 */
function renderTasks(filteredTasks) {
    const tasksToRender = filteredTasks || tasks;
    taskListElement.innerHTML = ''; 

    for (let i = 0; i < tasksToRender.length; i++) {
        const task = tasksToRender[i]; 
        
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
        editButton.addEventListener('click', function () {
            editTask(i); 
        });
        taskCard.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', function () {
            deleteTask(i); 
        });
        taskCard.appendChild(deleteButton);

        taskListElement.appendChild(taskCard);
    }
}

/**
 * Добавляет новую задачу в список задач
 * 
 * @function
 * @param {string} title - Название задачи
 * @param {string} description - Описание задачи
 * @param {string} deadline - Срок выполнения задачи (в формате строки)
 * @param {string} tags - Теги задачи (разделенные запятыми)
 * @param {string} status - Текущий статус задачи
 * @returns {void}
 *
 * @throws {TypeError} Если обязательные параметры не являются строками
 * @throws {Error} Если не удалось сохранить задачи в localStorage
 *
 * @description
 * Создает новый объект задачи со следующими свойствами:
 * - Уникальный ID (на основе текущего времени)
 * - Переданные параметры (title, description и т.д.)
 * - Даты создания и обновления (текущая дата)
 * - Пустую историю изменений
 *
 * После создания задачи:
 * 1. Добавляет задачу в массив tasks
 * 2. Сохраняет обновленный список через saveTasks()
 * 3. Обновляет интерфейс через renderTasks()
 *
 * @see {@link saveTasks} Функция сохранения задач
 * @see {@link renderTasks} Функция отрисовки задач
 */
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

/**
 * Редактирует существующую задачу по указанному индексу
 * 
 * @function
 * @param {number} index - Индекс задачи в массиве tasks для редактирования
 * @returns {void}
 *
 * @throws {RangeError} Если индекс выходит за пределы массива задач
 * @throws {TypeError} Если элемент формы не найден в DOM
 * @throws {Error} Если не удалось сохранить изменения
 *
 * @description
 * Функция выполняет следующие действия:
 * 1. Находит задачу по индексу в массиве tasks
 * 2. Заполняет форму редактирования текущими значениями задачи:
 *    - Название (title)
 *    - Описание (description)
 *    - Дедлайн (deadline)
 *    - Теги (tags)
 *    - Статус (status)
 * 3. Отображает форму редактирования
 * 4. Устанавливает обработчик отправки формы, который:
 *    - Обновляет данные задачи из формы
 *    - Устанавливает текущую дату как дату изменения
 *    - Сохраняет изменения через saveTasks()
 *    - Обновляет интерфейс через renderTasks()
 *    - Скрывает форму
 *    - Удаляет обработчик события
 *
 * @see {@link saveTasks} Функция сохранения задач
 * @see {@link renderTasks} Функция отрисовки задач
 */
 function editTask(index) {
    const task = tasks[index];
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('deadline').value = task.deadline;
    document.getElementById('tags').value = task.tags;
    document.getElementById('status').value = task.status;
    taskForm.style.display = 'block';

    const submitHandler = function (e) {
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
        taskFormContent.removeEventListener('submit', submitHandler);
    };

    taskFormContent.addEventListener('submit', submitHandler);
}

/**
 * Удаляет задачу из списка по указанному индексу после подтверждения пользователя
 * 
 * @function
 * @param {number} index - Индекс удаляемой задачи в массиве tasks
 * @returns {void}
 *
 * @throws {RangeError} Если индекс выходит за пределы массива задач
 * @throws {Error} Если не удалось сохранить изменения после удаления
 *
 * @description
 * Функция выполняет следующие действия:
 * 1. Запрашивает подтверждение удаления у пользователя через диалоговое окно
 * 2. Если пользователь подтвердил удаление:
 *    - Удаляет задачу из массива tasks методом splice()
 *    - Сохраняет обновленный список задач через saveTasks()
 *    - Обновляет интерфейс через renderTasks()
 * 3. Если пользователь отменил удаление - не выполняет никаких действий
 *
 * @see {@link saveTasks} Функция сохранения задач
 * @see {@link renderTasks} Функция отрисовки задач
 */
 function deleteTask(index) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}
/**
 * Обработчик клика по кнопке добавления новой задачи
 * 
 * @listens click
 * @function
 * @returns {void}
 *
 * @throws {TypeError} Если элементы формы не найдены в DOM
 * @throws {Error} Если не удалось добавить или сохранить задачу
 *
 * @description
 * Выполняет следующие действия при клике на кнопку добавления:
 * 1. Отображает форму добавления задачи (taskForm)
 * 2. Сбрасывает значения полей формы
 * 3. Устанавливает обработчик отправки формы (submit), который:
 *    - Отменяет стандартное поведение формы
 *    - Получает значения из полей формы:
 *      - Название (title)
 *      - Описание (description)
 *      - Дедлайн (deadline)
 *      - Теги (tags)
 *      - Статус (status)
 *    - Вызывает функцию addTask() с полученными значениями
 *    - Скрывает форму после добавления
 *    - Удаляет обработчик события во избежание дублирования
 *
 * @see {@link addTask} Функция добавления новой задачи
 * @see {@link taskForm} DOM-элемент формы
 * @see {@link taskFormContent} DOM-элемент содержимого формы
 */

 addTaskBtn.addEventListener('click', function () {
    taskForm.style.display = 'block';
    taskFormContent.reset();
    
    const submitHandler = function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;
        const tags = document.getElementById('tags').value;
        const status = document.getElementById('status').value;
        addTask(title, description, deadline, tags, status);
        taskForm.style.display = 'none';
        taskFormContent.removeEventListener('submit', submitHandler);
    };

    taskFormContent.addEventListener('submit', submitHandler);
});

closeBtn.addEventListener('click', function () {
    taskForm.style.display = 'none';
});

document.addEventListener('click', function(event) {
    if (event.target === taskForm) {
        taskForm.style.display = 'none';
    }
});

/**
  Обрабатывает ввод в поле поиска и фильтрует задачи по введенному тексту.
 * Поиск выполняется по:
 * - Названию задачи (`title`)
 * - Описанию задачи (`description`)
 * - Тегам (`tags`)
 * После фильтрации обновляет отображение списка задач.
 * 
 * @listens input - Событие ввода в поле поиска (`searchInput`).
 * @function
 * @returns {void}
 */
 searchInput.addEventListener('input', function() {
    /** 
     * Текст поиска, приведенный к нижнему регистру для регистронезависимого поиска.
     * @type {string} 
     */
    const searchText = searchInput.value.toLowerCase();

    /** 
     * Отфильтрованный массив задач, соответствующих поисковому запросу.
     * @type {Array<Object>}
     */
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchText) || 
        task.description.toLowerCase().includes(searchText) ||
        task.tags.toLowerCase().includes(searchText)
    );

    // Обновление DOM с отфильтрованными задачами
    renderTasks(filteredTasks);
});
