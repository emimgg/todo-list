export function showSelected(array, listName) {
    if (listName === "All") {
        return array;
    } else {
        const filteredArray = array.filter(project => project.title === listName);
        return filteredArray;    
    }
}