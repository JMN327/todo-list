import Todo from "./Todo.js";
import Project from "./Project.js";
import storageAvailable from "./localStorage.js";

console.log("Index.js initiated");
console.log("Storage Available: " + storageAvailable("localStorage"));

const newTodo1 = new Todo;

newTodo1.title = "one"

Todo.saveToLocalStorage(newTodo1)

const newTodo2 = new Todo;

newTodo2.title = "two"

Todo.saveToLocalStorage(newTodo2)

const allTodos = Todo.retrieveAllFromLocalStorage()




const newProject1 = new Project;

newProject1.title = "one"

Project.saveToLocalStorage(newProject1)

const newProject2 = new Project;

newProject2.title = "two"

Project.saveToLocalStorage(newProject2)

const allProjects = Project.retrieveAllFromLocalStorage()

console.log(allTodos.length, allProjects.length)