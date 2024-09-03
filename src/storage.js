import { ToDo, createProject } from './objFactory.js';

// Save only the data in localStorage, not methods
export function saveTasks(tasks) {
    try {
        const data = tasks.map(project => ({
            title: project.title,
            color: project.color,
            tasks: project.getTasks().map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                taskIsDone: task.taskIsDone,
                project: task.project,
            }))
        }));
        localStorage.setItem("tasks", JSON.stringify(data));
    } catch (error) {
        console.error("Error saving tasks to localStorage", error);
    }
}

// Load tasks and reconstruct the project and task objects
export function loadTasks() {
    try {
        const data = JSON.parse(localStorage.getItem("tasks"));
        if (!Array.isArray(data)) return [];

        return data.map(projectData => {
            const project = createProject(projectData.title, projectData.color);

            projectData.tasks.forEach(taskData => {
                const task = new ToDo(
                    taskData.title,
                    taskData.description,
                    new Date(taskData.dueDate),
                    taskData.priority,
                    taskData.project,
                    taskData.id
                );
                task.taskIsDone = taskData.taskIsDone;
                project.addTask(task);
            });

            return project;
        });
    } catch (error) {
        console.error("Error loading tasks from localStorage", error);
        return [];
    }
}
