import thingy from "./todoItem.js"

console.log("hi")
let testItem = new thingy;

testItem.title = "Hi",
testItem.description = "Wow",
testItem.dueDate = new Date(2024,0,1),
testItem.priority = 0,
testItem.completed = false,
testItem.project = "test"

console.log(testItem.info())