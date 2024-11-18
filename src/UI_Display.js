import {
  Add_Component_Drag_Drop_Container,
  Add_Component_Drag_Drop_Item,
} from "./Component_Drag_Drop_List.js";
import { Add_Component_Update_Storage_triggers } from "./Component_Update_Storage_Triggers.js";
import { Add_Component_Selectable } from "./Component_Selectable.js";
import { Add_Component_Max_Length } from "./Component_Max_length.js";
import { Add_Component_Double_Click_Cursor } from "./Component_Double_Click_Cursor.js";
import "./Drag_Drop_List.css";
import Project from "./Project.js";
import Todo from "./Todo.js";

export function displayProjectList() {
  console.log("displaying Project List");
  //Set up the Project list as a grid container

  let projectList = document.querySelector(".projects__project-list");
  removeAllChildNodes(projectList);

  let gridContainerDiv = document.createElement("div");
  gridContainerDiv.classList.add("project-list__grid-container");
  projectList.appendChild(gridContainerDiv);

  Add_Component_Drag_Drop_Container(gridContainerDiv);
  //Update the order of stored projects to reflect a drag/drop event
  gridContainerDiv.addEventListener("dragDrop", () => {
    console.log("dragDrop event fired");
    let items = gridContainerDiv.querySelectorAll(".grid-item__content");
    let idArray = [];
    items.forEach((item) => {
      idArray.push(item.dataset.storageId);
    });
    Project.updateIdArray(idArray);
  });

  //get all projects from local storage ready to display
  const allProjects = Project.retrieveAllFromLocalStorage();

  // Loop through all projects in storage to create the project list
  allProjects.forEach((pj) => {
    //Make div and add drag drop item functionality
    let listItemDiv = document.createElement("div");
    Add_Component_Drag_Drop_Item(listItemDiv);

    //Add content div to list items
    let listItemContentDiv = document.createElement("div");
    listItemContentDiv.setAttribute("data-storage-id", pj.storageId);
    listItemContentDiv.classList.add("grid-item__content");

    //give content div behavior
    Add_Component_Update_Storage_triggers(listItemContentDiv);
    listItemContentDiv.addEventListener("updateNeeded", () => {
      console.log("Update storage trigger fired 1");
      if (listItemTitleDiv.textContent === "") {
        listItemTitleDiv.textContent = "Untitled";
      }
      pj.title = listItemTitleDiv.textContent;
      Project.saveToLocalStorage(pj);
      displayProjectDetail(pj.storageId);
    });

    Add_Component_Selectable(listItemContentDiv);
    listItemContentDiv.addEventListener("selected", (event) => {
      console.log("Selection event fired");
      displayProjectDetail(pj.storageId);
      const todosDetailsDiv = document.querySelector(".todo__todo-details");
      removeAllChildNodes(todosDetailsDiv);
      displayDeleteProjectButton();
    });

    Add_Component_Double_Click_Cursor(listItemContentDiv);
    listItemContentDiv.addEventListener("doubleClickCursor", (event) => {
      console.log("doubleClickCursor event fired");
    });

    let listItemBorderDiv = document.createElement("div");
    listItemBorderDiv.classList.add("grid-item__border");

    let listItemTitleDiv = document.createElement("div");
    listItemTitleDiv.classList.add("grid-item__Title", "editable");
    listItemTitleDiv.setAttribute("draggable", "false");
    listItemTitleDiv.setAttribute("contenteditable", "true");
    listItemTitleDiv.textContent = pj.title;
    Add_Component_Max_Length(listItemTitleDiv, 30);
    listItemTitleDiv.addEventListener("maxLengthReached", () => {
      console.log("maxLengthReached event fired");
    });

    gridContainerDiv.appendChild(listItemDiv);
    listItemDiv.appendChild(listItemContentDiv);
    listItemContentDiv.appendChild(listItemBorderDiv);
    listItemContentDiv.appendChild(listItemTitleDiv);
  });

  displayAddProjectButton();
}

export function displayProjectDetail(selectionID) {
  console.log("displaying Project Detail " + selectionID);

  const projectTodosDetailsDiv = document.querySelector(
    ".project-todos__details"
  );
  removeAllChildNodes(projectTodosDetailsDiv);
  if (!selectionID) {
    return;
  }
  const detailsTitleDiv = document.createElement("div");
  detailsTitleDiv.classList.add("details__title");
  const detailsTitleBorderDiv = document.createElement("div");
  detailsTitleBorderDiv.classList.add("details__title-border");
  const detailsTitleTextDiv = document.createElement("div");
  detailsTitleTextDiv.classList.add("details__title-text");
  const detailsDescriptionDiv = document.createElement("div");
  detailsDescriptionDiv.classList.add("details__description");
  const detailsDescriptionBorderDiv = document.createElement("div");
  detailsDescriptionBorderDiv.classList.add("details__description-border");
  const detailsDescriptionTextDiv = document.createElement("div");
  detailsDescriptionTextDiv.classList.add(
    "details__description-text",
    "editable"
  );
  detailsDescriptionTextDiv.setAttribute("contenteditable", "true");

  projectTodosDetailsDiv.appendChild(detailsTitleDiv);
  projectTodosDetailsDiv.appendChild(detailsDescriptionDiv);
  detailsTitleDiv.appendChild(detailsTitleBorderDiv);
  detailsTitleDiv.appendChild(detailsTitleTextDiv);
  detailsDescriptionDiv.appendChild(detailsDescriptionBorderDiv);
  detailsDescriptionDiv.appendChild(detailsDescriptionTextDiv);

  projectTodosDetailsDiv.dataset.storageId = selectionID;
  const selectedProject = Project.retrieveSingleFromLocalStorage(selectionID);

  detailsTitleTextDiv.textContent = selectedProject.title;

  detailsDescriptionTextDiv.textContent = selectedProject.description;

  Add_Component_Double_Click_Cursor(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("doubleClickCursor", (event) => {
    console.log("doubleClickCursor event fired");
  });

  Add_Component_Max_Length(detailsDescriptionTextDiv, 120);
  detailsDescriptionTextDiv.addEventListener("maxLengthReached", () => {
    console.log("maxLengthReached event fired");
  });

  Add_Component_Update_Storage_triggers(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("updateNeeded", () => {
    console.log("Update storage trigger fired 2");
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent = "Add description here";
    }
    selectedProject.description = detailsDescriptionTextDiv.textContent;
    Project.saveToLocalStorage(selectedProject);
  });

  displayTodoList(selectionID);
}

export function displayTodoList(projectID) {
  console.log("displaying Todo List " + projectID);
  //remove previous nodes in the list
  const todoListDiv = document.querySelector(".project-todos__todo-list");
  removeAllChildNodes(todoListDiv);
  //Set up the Todo list as a grid container
  const gridContainerDiv = document.createElement("div");
  gridContainerDiv.classList.add("todo-list__grid-container");
  todoListDiv.appendChild(gridContainerDiv);

  Add_Component_Drag_Drop_Container(gridContainerDiv);
  //Update the order of stored todos to reflect a drag/drop event
  gridContainerDiv.addEventListener("dragDrop", () => {
    console.log("dragDrop event fired");
    let items = gridContainerDiv.querySelectorAll(".grid-item__content");
    let idArray = [];
    items.forEach((item) => {
      idArray.push(item.dataset.storageId);
    });
    const currentProject = Project.retrieveSingleFromLocalStorage(projectID);
    currentProject.todoArr = idArray;
    Project.saveToLocalStorage(currentProject);
    //Todo.updateIdArray(idArray);
  });

  //get all todos from local storage ready to display
  const projectTodos = Project.retrieveTodos(projectID);
  if (!projectTodos) {
    displayAddTodoButton();
    return;
  }

  // Loop through all todos in storage to create the todo list
  projectTodos.forEach((td) => {
    const tdId = td.storageId;
    //Make div and add drag drop item functionality
    let listItemDiv = document.createElement("div");
    Add_Component_Drag_Drop_Item(listItemDiv);

    //Add content div to list items
    let listItemContentDiv = document.createElement("div");
    listItemContentDiv.setAttribute("data-storage-id", tdId);
    listItemContentDiv.classList.add("grid-item__content");

    //give content div behavior
    Add_Component_Update_Storage_triggers(listItemContentDiv);
    listItemContentDiv.addEventListener("updateNeeded", () => {
      console.log("Update storage trigger fired 3");
      if (listItemTitleDiv.textContent === "") {
        listItemTitleDiv.textContent = "Untitled";
      }
      td.title = listItemTitleDiv.textContent;
      Todo.saveToLocalStorage(td, projectID);
      DisplayTodoDetail(tdId, projectID);
    });

    Add_Component_Selectable(listItemContentDiv);
    listItemContentDiv.addEventListener("selected", (event) => {
      console.log("Selection event fired");
      DisplayTodoDetail(tdId, projectID);
      displayDeleteTodoButton(tdId)
    });

    Add_Component_Double_Click_Cursor(listItemContentDiv);
    listItemContentDiv.addEventListener("doubleClickCursor", (event) => {
      console.log("doubleClickCursor event fired");
    });

    let listItemBorderDiv = document.createElement("div");
    listItemBorderDiv.classList.add("grid-item__border");

    let listItemTitleDiv = document.createElement("div");
    listItemTitleDiv.classList.add("grid-item__Title", "editable");
    listItemTitleDiv.setAttribute("draggable", "false");
    listItemTitleDiv.setAttribute("contenteditable", "true");
    listItemTitleDiv.textContent = td.title;
    Add_Component_Max_Length(listItemTitleDiv, 36);
    listItemTitleDiv.addEventListener("maxLengthReached", () => {
      console.log("maxLengthReached event fired");
    });

    gridContainerDiv.appendChild(listItemDiv);
    listItemDiv.appendChild(listItemContentDiv);
    listItemContentDiv.appendChild(listItemBorderDiv);
    listItemContentDiv.appendChild(listItemTitleDiv);
  });

  displayAddTodoButton();
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function DisplayTodoDetail(selectionID, projectID) {
  console.log("displaying Todo Detail");

  //initiate
  const todosDetailsDiv = document.querySelector(".todo__todo-details");
  removeAllChildNodes(todosDetailsDiv);

  //title div
  const detailsTitleDiv = document.createElement("div");
  detailsTitleDiv.classList.add("details__title");
  detailsTitleDiv;
  const detailsTitleBorderDiv = document.createElement("div");
  detailsTitleBorderDiv.classList.add("details__title-border");
  const detailsTitleTextDiv = document.createElement("div");
  detailsTitleTextDiv.classList.add("details__title-text");

  //description div
  const detailsDescriptionDiv = document.createElement("div");
  detailsDescriptionDiv.classList.add("details__description");
  const detailsDescriptionBorderDiv = document.createElement("div");
  detailsDescriptionBorderDiv.classList.add("details__description-border");
  const detailsDescriptionTextDiv = document.createElement("div");
  detailsDescriptionTextDiv.classList.add(
    "details__description-text",
    "editable"
  );
  detailsDescriptionTextDiv.setAttribute("contenteditable", "true");

  const dueDiv = document.createElement("div");

  //adding to DOM
  todosDetailsDiv.appendChild(detailsTitleDiv);
  todosDetailsDiv.appendChild(detailsDescriptionDiv);
  detailsTitleDiv.appendChild(detailsTitleBorderDiv);
  detailsTitleDiv.appendChild(detailsTitleTextDiv);
  detailsDescriptionDiv.appendChild(detailsDescriptionBorderDiv);
  detailsDescriptionDiv.appendChild(detailsDescriptionTextDiv);

  todosDetailsDiv.dataset.storageId = selectionID;
  const selectedTodo = Todo.retrieveSingleFromLocalStorage(selectionID);

  detailsTitleTextDiv.textContent = selectedTodo.title;

  detailsDescriptionTextDiv.textContent = selectedTodo.description;

  Add_Component_Double_Click_Cursor(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("doubleClickCursor", (event) => {
    console.log("doubleClickCursor event fired");
  });

  Add_Component_Max_Length(detailsDescriptionTextDiv, 120);
  detailsDescriptionTextDiv.addEventListener("maxLengthReached", () => {
    console.log("maxLengthReached event fired");
  });

  Add_Component_Update_Storage_triggers(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("updateNeeded", () => {
    console.log("Update storage trigger fired 4");
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent = "Add description here";
    }
    selectedTodo.description = detailsDescriptionTextDiv.textContent;
    Todo.saveToLocalStorage(selectedTodo, projectID);
  });
}

function displayDeleteProjectButton() {
  const deleteProjectDiv = document.querySelector(".projects__delete-project");
  removeAllChildNodes(deleteProjectDiv);
  const btn = document.createElement("button");
  btn.classList.add("toolbar__button");
  btn.classList.add("tooltip");
  btn.textContent = "×";

  btn.addEventListener("mouseup", deleteProject);

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "delete the currently selected project";

  //btn.addEventListener("mouseup", );

  btn.append(tooltipText);
  deleteProjectDiv.appendChild(btn);
}

function displayDeleteTodoButton(tdId) {
  console.log("TdId for deleting: " + tdId)
  const deleteTodoDiv = document.querySelector(".project-todo__delete-todo");
  removeAllChildNodes(deleteTodoDiv);
  const btn = document.createElement("button");
  btn.classList.add("toolbar__button");
  btn.classList.add("tooltip");
  btn.setAttribute("data-storage-id", tdId);
  
  btn.textContent = "×";

  btn.addEventListener("mouseup", deleteTodo);

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "delete the currently selected to do";

  //btn.addEventListener("mouseup", );

  btn.append(tooltipText);
  deleteTodoDiv.appendChild(btn);
}

function displayAddProjectButton() {
  const newProjectDiv = document.querySelector(".projects__new-project");
  removeAllChildNodes(newProjectDiv);
  const btn = document.createElement("button");
  btn.classList.add("toolbar__button");
  btn.classList.add("tooltip");
  btn.textContent = "+";

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "add a new project to the list";

  btn.addEventListener("mouseup", addProject);

  btn.append(tooltipText);
  newProjectDiv.appendChild(btn);
}

function displayAddTodoButton() {
  const newTodoDiv = document.querySelector(".project-todos__new-todo");
  const pjId = document.querySelector(".project-todos__details").dataset
    .storageId;
  removeAllChildNodes(newTodoDiv);
  console.log("pjId " + pjId);
  if (!pjId) {
    return;
  }
  const btn = document.createElement("button");
  btn.classList.add("toolbar__button");
  btn.classList.add("tooltip");
  btn.textContent = "+";

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "add a new to do to the list";

  btn.addEventListener("mouseup", AddTodo);

  btn.append(tooltipText);
  newTodoDiv.appendChild(btn);
}

function addProject() {
  //create new project and update display
  const pj = new Project({ title: "" });
  Project.saveToLocalStorage(pj);
  displayProjectList();
  //focus on new Project
  const pjContentDiv = document.querySelector(
    `[data-storage-id = ${pj.storageId}] `
  );
  const pjTitleDiv = pjContentDiv.querySelector(".grid-item__Title");
  const dblClick = new MouseEvent("dblclick");
  pjTitleDiv.parentNode.dispatchEvent(dblClick);
}

function AddTodo() {
  const pjId = document.querySelector(".project-todos__details").dataset
    .storageId;
  //create new Todo and update display
  const td = new Todo({ title: "", project: pjId });
  Todo.saveToLocalStorage(td, pjId);
  displayTodoList(pjId);
  //focus on new Project
  const tdContentDiv = document.querySelector(
    `[data-storage-id = ${td.storageId}] `
  );
  const tdTitleDiv = tdContentDiv.querySelector(".grid-item__Title");
  const dblClick = new MouseEvent("dblclick");
  tdTitleDiv.parentNode.dispatchEvent(dblClick);
}

function deleteProject() {
  const projectTodosDetailsDiv = document.querySelector(".project-todos__details");
  const pjId = projectTodosDetailsDiv.dataset.storageId;
  Project.deleteProjectInLocalStorage(pjId);
  projectTodosDetailsDiv.removeAttribute("data-storage-id")
  displayProjectList();
  displayProjectDetail();
  displayTodoList();
}

function deleteTodo(event) {
  console.log(event.target)
  const projectTodosDetailsDiv = document.querySelector(".project-todos__details");
  const pjId = projectTodosDetailsDiv.dataset.storageId;
  const tdId = event.target.dataset.storageId;
  Todo.deleteTodoInLocalStorage(tdId, pjId);
  //displayProjectDetail();
}
