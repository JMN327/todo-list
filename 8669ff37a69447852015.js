import "./styles.css";
/* import "./shadingTry.css" */
import Todo from "./Todo.js";
import Project from "./Project.js";
import storageAvailable from "./localStorage.js";
import { displayProjectList } from "./UI_Display.js";

console.log("Index.js initiated");
console.log("Storage Available: " + storageAvailable("localStorage"));

displayProjectList();
