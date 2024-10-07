import Todo from "./Todo.js";
import Project from "./Project.js";
import storageAvailable from "./localStorageCheck.js"

console.log("Index.js initiated");
console.log("Storage Available: " +storageAvailable("localStorage"))
let testProject1 = new Project();

testProject1.title = "Project1";
testProject1.description = "test Project Object1";
testProject1.dueDate = new Date(2024, 0, 1);
testProject1.priority = 3;
testProject1.completed = false;
testProject1.todoArr = ["test1", "test2"];
console.log(testProject1.jsonData(), typeof testProject1.jsonData())

localStorage.setItem("test1", JSON.stringify(testProject1.jsonData()));

let storedProject1 = JSON.parse(localStorage.getItem("test1"));

/* console.log(storedProject1, typeof storedProject1, storedProject1.description) */

let testProject2 = new Project();

testProject2.title = "Project2";
testProject2.description = "test Project Object2";
testProject2.dueDate = new Date(2024, 1, 5);
testProject2.priority = 4;
testProject2.completed = false;
testProject2.todoArr = ["test3", "test4"];
console.log(testProject2.jsonData(), typeof testProject2.jsonData());

localStorage.setItem("test2", JSON.stringify(testProject2.jsonData()));

let storedProject2 = JSON.parse(localStorage.getItem("test2"));

console.log(storedProject1, storedProject2);
