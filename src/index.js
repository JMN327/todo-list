import "./styles.css";
/* import "./shadingTry.css" */
import Todo from "./Todo.js";
import Project from "./Project.js";
import storageAvailable from "./localStorage.js";
import { displayProjectList } from "./UI_Display.js";

console.log("Index.js initiated");
console.log("Storage Available: " + storageAvailable("localStorage"));


/* const newProject1 = new Project();
Project.saveToLocalStorage(newProject1);
const newProject2 = new Project();
Project.saveToLocalStorage(newProject2);

const newTodo1 = new Todo();
newTodo1.project = "P2";
Todo.saveToLocalStorage(newTodo1);
const newTodo2 = new Todo();
newTodo2.project = "P2";
Todo.saveToLocalStorage(newTodo2); */




//displayProjectList();
displayProjectList();

//const pj = Project.retrieveSingleFromLocalStorage("P1")

/* const newProject1 = new Project();
newProject1.todoArr = ["T1","T2"]
Project.saveToLocalStorage(newProject1)
console.log(newProject1.todoArr) */
