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