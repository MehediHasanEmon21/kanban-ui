
const url = 'http://127.0.0.1:8000/api/v1/task';
const task_status = document.querySelectorAll('.task-status');
let draggableTodo = null;
const todo_task_wrapper = document.querySelector('.todo-task');
const textnode = document.createTextNode("Water");
async function fetchTasks() {
    let res = await fetch(`${url}`);
    let { data } = await res.json();
    displayTodoTask(data);
}

function displayTodoTask(tasks){
    todo_task_wrapper.innerHTML = `${tasks.map((task) => {
        return `<h4 class="todo" draggable="true">${task.name}</h4>`
    }).join("")}`
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        todo.addEventListener('dragstart',dragStart);
        todo.addEventListener('dragend',dragEnd);
    })
    
}
fetchTasks();

async function addTask(){
    const input_value = document.getElementById('input-form').value;
    if(input_value){
        const form_data = {name : input_value};
        try {
            let res = await fetch(`${url}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify( form_data ),
            })
            let { data } = await res.json();
            const h4 = document.createElement("h4");
            h4.classList.add('todo');
            h4.setAttribute('draggable',true);
            const text_node = document.createTextNode(`${data.name}`);
            h4.appendChild(text_node);
            todo_task_wrapper.appendChild(h4);
            document.getElementById('input-form').value = '';
        } catch (error) {
            console.log(error);
        }
        
    }else{
        alert('Please Enter Task Name');
    }
}




function dragStart(){
    draggableTodo = this;
    setTimeout(() => {
        this.style.display = "none";
      }, 0);

}
function dragEnd(){
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

function dragOver(e){
    e.preventDefault();
}

function dragEnter(){
    
}

function dragLeave(){
    
}

function dragDrop(){
    this.querySelector('.task-list').appendChild(draggableTodo);
}
