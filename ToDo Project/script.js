const btn = document.querySelector(".btn");
const mainDiv = document.querySelector(".mainDiv"); 
const input = document.querySelector(".task input"); 

let tasks = []; 
btn.addEventListener("click", () => {
    if (input.value.trim() === "") return; 
    tasks.push({ text: input.value, completed: false }) 
    input.value = ""; 
    saveTasks(); 
    renderTasks(); 
});

function saveTasks() { 
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
} 

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks"); 
    if (savedTasks) {
        tasks = JSON.parse(savedTasks); 
    } 
}

document.addEventListener("DOMContentLoaded", () => {
    loadTasks(); 
    renderTasks(); 
}); 

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { 
        btn.click(); 
    } 
}); 

function renderTasks() {
    mainDiv.innerHTML = ""; 
    tasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("addTask"); 
        taskDiv.style.border = "2px solid rgba(221, 217, 217, 1)";

        if (task.completed) { 
            taskDiv.classList.add("completed"); 
        }

        const leftDiv = document.createElement("div"); 
        leftDiv.classList.add("left");

        const checkBox = document.createElement("input"); 
        checkBox.type = "checkbox"; 
        checkBox.checked = task.completed; 

        const para = document.createElement("label"); 
        para.innerText = task.text; 

        checkBox.addEventListener("change", () => {
            task.completed = checkBox.checked; 
            saveTasks(); 
            
            if (task.completed) { 
                taskDiv.classList.add("completed"); 
            } else {
                taskDiv.classList.remove("completed"); 
            } 
        }); 

        leftDiv.appendChild(checkBox); 
        leftDiv.appendChild(para); 

        const editIcon = document.createElement("i"); 
        editIcon.classList.add("fa-solid", "fa-pen", "edit"); 

        const deleteIcon = document.createElement("i"); 
        deleteIcon.classList.add("fa-solid", "fa-trash", "delete"); 

        taskDiv.appendChild(leftDiv); 
        taskDiv.appendChild(editIcon); 
        taskDiv.appendChild(deleteIcon); 
        mainDiv.appendChild(taskDiv); 

        //edit logic 
        editIcon.addEventListener("click", ()=> {
            if(task.completed) return; 

            const editInput = document.createElement("input"); 
            editInput.type = "text"; editInput.value = task.text; 
            editInput.classList.add("edit-input"); 

            leftDiv.replaceChild(editInput, para); 
            editInput.focus(); 

            function saveEdit() {
                const newText = editInput.value.trim(); 
                if(newText !== "") { 
                    task.text = newText; saveTasks(); 
                } 
                renderTasks(); 
            } 

            editInput.addEventListener("blur", saveEdit); 
            editInput.addEventListener("keydown", (e) => {
                if(e.key === "Enter") saveEdit(); 
            }); 
        }); 

        //delete logic
        deleteIcon.addEventListener("click", ()=> { 
            tasks.splice(index, 1); 
            saveTasks(); 
            renderTasks(); 
        }); 
    }); 
    
    mainDiv.scrollTop = mainDiv.scrollHeight; 
}