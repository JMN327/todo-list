import Todo from "./Todo.js"
import Project from "./Project.js"

console.log("Index.js initiated")
let testItem = new Todo;

testItem.title = "My Todo",
testItem.description = "test Todo Object",
testItem.dueDate = new Date(2024,0,1),
testItem.priority = 0,
testItem.completed = false,
testItem.project = ["My Project"]

console.log(testItem.info())

let testItem2 = new Project;

testItem2.title = "My Project",
testItem2.description = "Test Project",
testItem2.dueDate = new Date(2024,1,2),
testItem2.priority = 0,
testItem2.completed = false,
testItem2.todoArr = ["test1", "test2"]

console.log(testItem2.info())