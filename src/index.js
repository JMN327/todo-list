import "./styles.css";
/* import "./shadingTry.css" */
import Todo from "./Todo.js";
import Project from "./Project.js";
import storageAvailable from "./localStorage.js";

import { displayProjectList, displayProjectDetail } from "./UI.js";

console.log("Index.js initiated");
console.log("Storage Available: " + storageAvailable("localStorage"));

/* const newTodo1 = new Todo();
Todo.saveToLocalStorage(newTodo1);
const newTodo2 = new Todo();
Todo.saveToLocalStorage(newTodo2);
const allTodos = Todo.retrieveAllFromLocalStorage();
const newProject1 = new Project();
Project.saveToLocalStorage(newProject1);
const newProject2 = new Project();
Project.saveToLocalStorage(newProject2);
const allProjects = Project.retrieveAllFromLocalStorage();
console.log(allTodos.length, allProjects.length);
allProjects.forEach((x) => {
  console.log(x.createdDate);
});
allTodos.forEach((x) => {
  console.log(x.createdDate);
}); */

displayProjectList();

