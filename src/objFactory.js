export class ToDo {
    constructor(title, description, dueDate, priority, project, id = Date.now()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate ? new Date(dueDate) : "";
        this.priority = priority;
        this.taskIsDone = false;
        this.project = project;  // Add this line
    }
}

export function createProject(title, color) {
    return {
        title,
        color,
        tasks: [],
        addTask(task) {
            task.project = this.title;
            task.color = this.color;
            this.tasks.push(task);
        },
        getTasks() {
            return this.tasks;
        },
    };
}

export function deleteTodo(toDos, taskId) {
    for (const project of toDos) {
        const taskIndex = project.tasks.findIndex(task => task.id === parseInt(taskId));
        if (taskIndex !== -1) {
            project.tasks.splice(taskIndex, 1);
            return; 
        }
    }
}

// export function setNewPriority(newPriority, task) {
//     task.priority = newPriority;
// }

export function toggleTaskIsDone(toDos, taskId) {
    for (const project of toDos) {
        const task = project.getTasks().find(task => task.id === parseInt(taskId));
        if (task) {
            task.taskIsDone = !task.taskIsDone;
            return; 
        }
    }
}

export function editTask(task, newTitle, newDescription, newDate, newPriority) {
    if (task) {
        task.title = newTitle;
        task.description = newDescription;
        task.dueDate = newDate;
        task.priority = newPriority;
    }
}

function sortByDueDateAscending(array) {
    return array.map(project => ({
        ...project,
        tasks: project.getTasks().sort((a, b) => compareAsc(a.dueDate, b.dueDate))
    }));
}