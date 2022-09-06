
const url = 'http://127.0.0.1:8000/api/v1/task';
const task_status = document.querySelectorAll('.task-status');
const todo_task_wrapper = document.querySelector('.todo-task');
const progress_task_wrapper = document.querySelector('.progress-task');
const done_wrapper = document.querySelector('.done-task');
let draggableTodo = null;

// fetch all task
async function fetchTasks() {
    try {
        let res = await fetch(`${url}`);
        let { data } = await res.json();
        const todo_tasks = data.filter(task => task.status == 0);
        const progress_tasks = data.filter(task => task.status == 1);
        const done_tasks = data.filter(task => task.status == 2);
        displayTask(todo_tasks, todo_task_wrapper);
        displayTask(progress_tasks, progress_task_wrapper);
        displayTask(done_tasks, done_wrapper);
    } catch (error) {
        console.log(error);
    }

}

function displayTask(tasks, wrapper) {
    wrapper.innerHTML = `${tasks.map((task) => {
        return `<h4 class="todo" draggable="true" data-id="${task.id}">${task.name}</h4>`
    }).join("")}`
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        todo.addEventListener('dragstart', dragStart);
        todo.addEventListener('dragend', dragEnd);
    })

}
fetchTasks();

// add task by api
async function addTask() {
    const input_value = document.getElementById('input-form').value;
    if (input_value) {
        const form_data = { name: input_value };
        try {
            let res = await fetch(`${url}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(form_data),
            })
            let { data } = await res.json();
            const h4 = document.createElement("h4");
            h4.classList.add('todo');
            h4.setAttribute('draggable', true);
            h4.setAttribute('data-id', data.id);
            const text_node = document.createTextNode(`${data.name}`);
            h4.appendChild(text_node);
            todo_task_wrapper.appendChild(h4);
            h4.addEventListener('dragstart', dragStart);
            h4.addEventListener('dragend', dragEnd);
            document.getElementById('input-form').value = '';
        } catch (error) {
            console.log(error);
        }

    } else {
        alert('Please Enter Task Name');
    }
}

function dragStart() {
    draggableTodo = this;
    setTimeout(() => {
        this.style.display = "none";
    }, 0);

}

function dragEnd() {
    draggableTodo = null;
    setTimeout(() => {
        this.style.display = "block";
    }, 0);

}

task_status.forEach((status) => {
    status.addEventListener("dragover", dragOver);
    status.addEventListener("dragenter", dragEnter);
    status.addEventListener("dragleave", dragLeave);
    status.addEventListener("drop", dragDrop);
});

function dragOver(e) {
    e.preventDefault();
}

function dragEnter() {

}

function dragLeave() {

}

// drop the task
async function dragDrop() {

    let status;
    const id = draggableTodo.getAttribute('data-id');
    this.querySelector('.task-list').appendChild(draggableTodo);
    const task_container = this.querySelector('.task-list');
    if (task_container.classList.contains('todo-task')) {
        status = 0;
    } else if (task_container.classList.contains('progress-task')) {
        status = 1;
    } else {
        status = 2;
    }
    const form_data = {
        id,
        status
    }
    try {
        let res = await fetch(`${url}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(form_data),
        })
        let { data } = await res.json();
    } catch (error) {
        console.log(error);
    }

}
