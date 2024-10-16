import "./styles.css";
import Todo from "./Todo.js";
import Project from "./Project.js";
import storageAvailable from "./localStorage.js";
import DragDropList from "./DragDropList.js";
import "./DragDropList.css";

console.log("Index.js initiated");
console.log("Storage Available: " + storageAvailable("localStorage"));

const newTodo1 = new Todo();
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
});

displayProjectList();

function displayProjectList() {
  const projectList = document.querySelector(".projects__project-list");
  const allProjects = Project.retrieveAllFromLocalStorage();
  let gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  projectList.appendChild(gridContainer);

  allProjects.forEach((pj) => {
    let gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    let gridItemContent = document.createElement("div");
    gridItemContent.classList.add("grid-item__content");
    

    let gridItemTitle = document.createElement("div");
    gridItemTitle.classList.add("grid-item__Title")
    gridItemTitle.textContent = pj.title;
    gridItemTitle.setAttribute("contenteditable", true);
    gridItemContent.appendChild(gridItemTitle);

    let gridItemBorder = document.createElement("div");
    gridItemBorder.classList.add("grid-item__border");
    gridItemContent.appendChild(gridItemBorder);

    gridItem.appendChild(gridItemContent);
    gridContainer.appendChild(gridItem);
  });
  DragDropList();
}
