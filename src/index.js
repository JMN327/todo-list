import Todo from "./Todo.js"
import Project from "./Project.js"

console.log("Index.js initiated")
let testItem = new Project;

testItem.title = "Project1",
testItem.description = "test Project Object",
testItem.dueDate = new Date(2024,0,1),
testItem.priority = 3,
testItem.completed = false,
testItem.todoArr = ["test1", "test2"]
console.log(testItem.jsonData())

localStorage.setItem = ("test1", testItem.jsonData());

let testItem2 = new Todo;

testItem2.title = "My Project",
testItem2.description = "Test Project",
testItem2.dueDate = new Date(2024,1,2),
testItem2.priority = 0,
testItem2.completed = false,
testItem2.project = testItem.title

console.log(testItem2.jsonData())