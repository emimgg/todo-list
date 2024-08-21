import './style.css';
import { ToDo, createProject, deleteTodo, toggleTaskIsDone, editTask } from './createToDo.js';
import { renderComponents, renderEditForm, renderNewTodoForm, renderProjectForm, renderProjects } from './renderTodos.js'
import { UI } from "./UI.js";
import { loadTasks, saveTasks } from './storage.js';
import { showSelected } from './showSelectedTodoList.js';

const toDos = loadTasks();
let currentProject = "All";

document.addEventListener("DOMContentLoaded", () => {
    renderComponents(showSelected(toDos, currentProject), UI.contentDiv);
    if (toDos.length === 0) {
        const defaultProject = createProject("Personal", "#e4e4e4");
        toDos.push(defaultProject);
        saveTasks(toDos);

    }
    renderProjects(toDos, UI.sideNav, currentProject);
});

UI.newToDoBtn.addEventListener("click", () => renderNewTodoForm(toDos, UI.contentDiv, currentProject));


document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
        let index = event.target.dataset.key;
        deleteTodo(toDos, index);
        saveTasks(toDos);
        renderComponents(showSelected(toDos, currentProject), UI.contentDiv);
    }
});

document.addEventListener("click", (event) => {
    if (event.target.type === "checkbox") {
        let index = event.target.dataset.key;
        toggleTaskIsDone(toDos, index);
        saveTasks(toDos);
        renderComponents(showSelected(toDos, currentProject), UI.contentDiv);
        console.log("Updated toDos:", toDos);
    }
})

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
        const taskId = event.target.dataset.key; 
        const projectName = event.target.dataset.project; 

        if (projectName && taskId) {
            // Find the project in toDos
            const project = toDos.find(proj => proj.title === projectName);
            if (project) {
                const task = project.getTasks().find(t => t.id === parseInt(taskId));
                if (task) {
                    renderEditForm(UI.contentDiv, toDos, projectName, task, currentProject);
                } else {
                    console.error('Task not found!');
                }
            } else {
                console.error('Project not found!');
            }
        } else {
            console.error('Project name or task ID missing!');
        }
    }
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("side-project")) {
        currentProject = event.target.value;
        renderComponents(showSelected(toDos, currentProject), UI.contentDiv);
    }
})

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-project-btn")) {
        renderProjectForm(UI.contentDiv, toDos, currentProject, UI.sideNav);
        saveTasks(toDos);
        console.log(toDos);
    }
})

// update sidebar display with projects DONE
// Assign default project to Personal ###
// edit and delete projects ###
// fix priority color DONE
// sort by dates ###
// sort by importance ###
// get better dates, with times as well ###

//finish UI ###
//make it responsive ###
//done?