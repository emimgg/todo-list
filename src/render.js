import { createProject } from "./objFactory.js";
import { saveTasks } from "./storage.js";
import { ToDo } from "./objFactory.js";
import { differenceInDays, format, isToday, isTomorrow } from "date-fns";

export const UI = (() => {
    const newToDoBtn = document.querySelector("#new-todo");
    const contentDiv = document.querySelector(".content");
    const modal = document.querySelector("#modal");
    const toDoForm = document.querySelector("#add-todo");
    const titleInput = document.querySelector("#input-title");
    const detailsInput = document.querySelector("#input-details");
    const dateInput = document.querySelector("#input-date");
    const sideNav = document.querySelector("#projects-sidebar");

    const getSelectedPriority = () => {
        const selected = document.querySelector('input[name="priority"]:checked');
        return selected ? selected.value : null;
    };

    const getSelectedProject = () => {
        const selectElement = document.querySelector('select[name="projects"]');
        return selectElement.value; 
    };

    return {
        newToDoBtn,
        contentDiv,
        modal,
        toDoForm,
        titleInput,
        detailsInput,
        dateInput,
        sideNav,
        getSelectedProject,
        getSelectedPriority
    };
})();

export function renderComponents(array, parent) {
    parent.innerHTML = ""; // Clear existing content
    
    // Flatten the tasks from all projects into a single array
    const tasks = array.flatMap(project => project.getTasks());

    tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("todo-item");
        
        if (task.priority === "High") {
            taskDiv.classList.add("red-bg");
        } else if (task.priority === "Medium") {
            taskDiv.classList.add("orange-bg"); 
        } else {
            taskDiv.classList.add("yellow-bg");
        }

        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkbox-container");

        const taskCheckbox = document.createElement("input");
        taskCheckbox.type = "checkbox";
        taskCheckbox.classList.add("checkbox-input");
        taskCheckbox.dataset.key = task.id;
        taskCheckbox.checked = task.taskIsDone;

        const checkbox = document.createElement("span");
        checkbox.classList.add("checkbox");

        checkboxContainer.append(taskCheckbox, checkbox);

        const taskCard = document.createElement("article");
        taskCard.classList.add("to-do");

        const taskTitle = document.createElement("h4");
        taskTitle.classList.add("todo-title");
        taskTitle.textContent = task.title;

        const taskDetails = document.createElement("p");
        taskDetails.classList.add("todo-description");
        taskDetails.textContent = task.description;

        const taskDueDate = document.createElement("span");
        taskDueDate.classList.add("date");
        taskDueDate.textContent = formatDeadline(task.dueDate);

        taskCard.append(taskTitle, taskDetails, taskDueDate);

        const taskDivRight = document.createElement("div");
        taskDivRight.classList.add("todo-item-rightside");

        const projectDiv = document.createElement("div");
        projectDiv.classList.add("tag-container");
        const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${task.color}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`;
        projectDiv.innerHTML = svgMarkup; 

        const projectTag = document.createElement("button");
        projectTag.classList.add("project-tag");
        projectTag.textContent = task.project;

        projectDiv.append(projectTag);

        const expandBtn = document.createElement("button");
        expandBtn.classList.add("expand-btn");
        expandBtn.textContent = "expandir";

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 delete" data-key="${task.id}"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
        deleteBtn.classList.add("delete");
        deleteBtn.dataset.key = task.id;

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit");
        editBtn.textContent = "Edit";
        editBtn.dataset.key = task.id;
        editBtn.dataset.project = task.id; 
        expandBtn.addEventListener('click', () => {
            taskDiv.classList.toggle("expanded");
            expandBtn.textContent = taskDiv.classList.contains("expanded") ? "Collapse" : "expandir";
        });

        if (task.taskIsDone) {
            taskDiv.classList.add("done");
            expandBtn.classList.add("hide");
        } else {
            taskDiv.classList.remove("done");
            expandBtn.classList.remove("hide");
        }

        taskDivRight.append(projectDiv, deleteBtn, editBtn, expandBtn);
        taskDiv.append(checkboxContainer, taskCard, taskDivRight);
        parent.appendChild(taskDiv);
    });
}

const LEVELS = ["High", "Medium", "Low"];
const today = new Date();

export function renderNewTodoForm(array, parent, currentProject) {

    const formattedToday = today.toISOString().split('T')[0];

    const todoModal = document.createElement("dialog");
    todoModal.classList.add("form-modal");

    const todoForm = document.createElement("form");

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title";
    const titleInput = document.createElement("input");
    titleInput.type = "text";

    const detailsLabel = document.createElement("label");
    detailsLabel.textContent = "Description";
    const detailsInput = document.createElement("textarea");

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Due date:";
    dateLabel.classList.add("date-input");
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.classList.add("date-input");
    dateInput.value = formattedToday;

    const timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.classList.add("date-input");

    const priorityLabel = document.createElement("label");
    priorityLabel.textContent = "Select a priority:";

    const priorityDiv = document.createElement("div");
    priorityDiv.append(priorityLabel);
    
    LEVELS.forEach(level => {
        const radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.value = level;
        radioBtn.name = "priority";
        const radioLabel = document.createElement("label");
        radioLabel.textContent = level;
        priorityDiv.append(radioBtn, radioLabel);
    });

    const projectListLabel = document.createElement("label");
    projectListLabel.textContent = "Project:";
    const projectSelect = document.createElement("select");
    projectSelect.name = "projects";
    projectSelect.id = "projects";

    array.forEach(project => {
        const projectOption = document.createElement("option");
        projectOption.value = project.title;
        projectOption.textContent = project.title;
        projectSelect.appendChild(projectOption);
    });

    const submitEditBtn = document.createElement("button");
    submitEditBtn.type = "submit";
    submitEditBtn.textContent = "Save";

    todoForm.append(
        titleLabel, 
        titleInput, 
        detailsLabel, 
        detailsInput, 
        dateLabel, 
        dateInput,
        timeInput,
        priorityDiv,
        projectListLabel,
        projectSelect,
        submitEditBtn);
    
    todoModal.appendChild(todoForm);
    parent.append(todoModal);
    todoModal.showModal();

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const getPriority = () => {
            let prior = document.querySelector('input[name="priority"]:checked');
            return prior.value;
        } 
        const getProjectName = () => {
            let proj = document.querySelector('select[name="projects"]');
            return proj.value;
        }

        const dateAndTime = `${dateInput.value} ${timeInput.value}`;
        console.log(dateAndTime);

        const priority = getPriority();
        const projectName = getProjectName();

        let project = array.find(proj => proj.title === projectName);    
        if (!project) {
            project = createProject(projectName);
            array.push(project);
        };
        
        const task = new ToDo(
            titleInput.value,
            detailsInput.value,
            dateAndTime,
            priority
        );
    
        project.addTask(task);
        console.log(array);
        saveTasks(array);
        renderComponents(showSelected(array, currentProject), parent);
    })
};

export function renderEditForm(parent, array, projectName, task, currentTab) {
    const formattedDate = task.dueDate.toISOString().split("T")[0];
    const editModal = document.createElement("dialog");
    editModal.classList.add("form-modal");

    const editForm = document.createElement("form");

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = task.title || "";

    const detailsLabel = document.createElement("label");
    detailsLabel.textContent = "Description";
    const detailsInput = document.createElement("textarea");
    detailsInput.innerText = task.description || "";

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Due date:";
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = formattedDate || today;

    const timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.classList.add("date-input");

    const submitEditBtn = document.createElement("button");
    submitEditBtn.type = "submit";
    submitEditBtn.textContent = "Save";

    editForm.append(titleLabel, titleInput, detailsLabel, detailsInput, dateLabel, dateInput, timeInput, submitEditBtn);
    editModal.appendChild(editForm);
    parent.appendChild(editModal);
    editModal.showModal();

    const dateAndTime = `${dateInput.value} ${timeInput.value}`;
    console.log(dateAndTime);

    editForm.addEventListener("submit", (e) => {

        const dateAndTime = `${dateInput.value} ${timeInput.value}`;
        console.log(dateAndTime);
        e.preventDefault();
        saveEdit(array, projectName, task.id, titleInput, detailsInput, dateAndTime);
        saveTasks(array);
        editModal.close();
        editModal.remove();
        renderComponents(showSelected(array, currentTab), parent);
    });
}

function saveEdit(array, projectName, taskId, newTitle, newDescription, newDate) {
    const project = array.find(proj => proj.title === projectName);
    if (project) {
        const task = project.getTasks().find(t => t.id === parseInt(taskId));
        if (task) {
            task.title = newTitle.value;
            task.description = newDescription.value;
            task.dueDate = new Date(newDate);
        } else {
            console.error('Task not found!');
        }
    } else {
        console.error('Project not found!');
    }
}

export function renderProjectForm(parent, array, currentTab, nav) {
    // const addProjectBtn = document.querySelector("#add-project-btn");
    const projectDialog = document.createElement("dialog");
    projectDialog.classList.add("form-modal");

    const projectForm = document.createElement("form");

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Pick label color:"
    const colorInput = document.createElement("input");
    colorInput.type = "color";

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.classList.add("submit-project");
    submitBtn.textContent = "Save";

    projectForm.append(nameLabel, nameInput, colorLabel, colorInput, submitBtn);
    projectDialog.appendChild(projectForm);
    parent.appendChild(projectDialog);

    projectDialog.showModal();

    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newProject = createProject(nameInput.value, colorInput.value);
        array.push(newProject);
        saveTasks(array);
        projectDialog.close();

        renderProjects(array, nav)
        renderComponents(showSelected(array, currentTab), parent);
    })
}

export function renderProjects(array, nav) {
    nav.innerHTML = "";

    array.forEach(project => {
        const itemList = document.createElement("li");
        itemList.classList.add("sidebar-option");
        const listBtn = document.createElement("button");
        listBtn.classList.add("side-project");
        listBtn.value = project.title;
        listBtn.textContent = project.title;
        itemList.appendChild(listBtn);
        nav.appendChild(itemList);
    })
}

function formatDeadline(deadline) {
    const now = new Date();

    let dayText;
    if (isToday(deadline)) {
        dayText = "Hoy";
    } else if (isTomorrow(deadline)) {
        dayText = "Mañana";
    } else {
        const diffDays = differenceInDays(deadline, now);
        dayText = `En ${diffDays} días`;
    }

    const timeText = format(deadline, "h:mm a");

    return `${dayText}, ${timeText}`;
}

export function showSelected(array, listName) {
    if (listName === "All") {
        return array;
    } else {
        const filteredArray = array.filter(project => project.title === listName);
        return filteredArray;    
    }
}