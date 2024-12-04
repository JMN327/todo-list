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
import datepicker from "js-datepicker";
import "js-datepicker/dist/datepicker.min.css";
import { format } from "date-fns";
const rater = require("rater-js");

let selectedPjId;
let selectedTdId;

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function displayProjectList() {
  console.log(
    "displaying Project List"
  );

  let projectListWrapper = document.querySelector(
    ".projects__project-list-wrapper"
  );
  removeAllChildNodes(projectListWrapper);

  //make heading div to contain label and toolbar for project list
  const projectListHeadingDiv = document.createElement("div");
  projectListHeadingDiv.classList.add("heading");

  //make the label and its tooltip
  const headingLabelTextDiv = document.createElement("div");
  headingLabelTextDiv.classList.add("label-text");
  headingLabelTextDiv.textContent = "Projects";
  headingLabelTextDiv.classList.add("tooltip");
  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "Add and remove project items here";

  //make the toolbar
  const headingToolbarDiv = document.createElement("div");
  headingToolbarDiv.classList.add("toolbar");
  const toolbarDeleteProjectDiv = document.createElement("div");
  toolbarDeleteProjectDiv.classList.add("toolbar__delete-project");
  const toolbarAddProjectDiv = document.createElement("div");
  toolbarAddProjectDiv.classList.add("toolbar__add-project");

  //make the project list grid container
  const projectList = document.createElement("div");
  projectList.classList.add("projects__project-list");
  const gridContainerDiv = document.createElement("div");
  gridContainerDiv.classList.add("project-list__grid-container");
  projectList.appendChild(gridContainerDiv);

  //add to DOM
  headingLabelTextDiv.appendChild(tooltipText);
  headingToolbarDiv.appendChild(toolbarDeleteProjectDiv);
  headingToolbarDiv.appendChild(toolbarAddProjectDiv);
  projectListHeadingDiv.appendChild(headingLabelTextDiv);
  projectListHeadingDiv.appendChild(headingToolbarDiv);
  projectListWrapper.appendChild(projectListHeadingDiv);
  projectListWrapper.appendChild(projectList);

  Add_Component_Drag_Drop_Container(gridContainerDiv, [
    "grid-item__content",
    "grid-item__Title",
  ]);
  //Update the order of stored projects to reflect a drag/drop event
  gridContainerDiv.addEventListener("dragDrop", () => {
    console.log(
      "dragDrop event fired"
    );
    const items = gridContainerDiv.querySelectorAll(".grid-item__content");
    let newIdArray = [];
    items.forEach((item) => {
      newIdArray.push(item.dataset.storageId);
    });
    Project.replaceIdArray(newIdArray);
  });

  //get all projects from local storage ready to display
  const allProjects = Project.retrieveAllFromLocalStorage();

  // Loop through all projects in storage to create the project list
  allProjects.forEach((pj) => {
    //Make div and add drag drop item functionality
    const gridItemDiv = document.createElement("div");
    Add_Component_Drag_Drop_Item(gridItemDiv);

    //Add content div to list items
    const gridItemContentDiv = document.createElement("div");
    gridItemContentDiv.setAttribute("data-storage-id", pj.storageId);
    gridItemContentDiv.classList.add("grid-item__content");

    //give content div behavior
    Add_Component_Selectable(gridItemContentDiv);
    gridItemContentDiv.addEventListener("selected", (event) => {
      console.log(
        "project selection event fired"
      );
      console.log("pj.todoArr[0]: " + pj.todoArr[0]);
      selectedPjId = pj.storageId;
      displayProjectDetail();
      const todosDetailsDiv = document.querySelector(".todo");
      removeAllChildNodes(todosDetailsDiv);
    });

    Add_Component_Double_Click_Cursor(gridItemContentDiv);
    gridItemContentDiv.addEventListener("doubleClickCursor", (event) => {
      console.log(
        "doubleClickCursor event fired"
      );
    });

    const gridItemBorderDiv = document.createElement("div");
    gridItemBorderDiv.classList.add("grid-item__border");

    const gridItemTitleDiv = document.createElement("div");
    gridItemTitleDiv.classList.add("grid-item__Title", "editable");
    gridItemTitleDiv.setAttribute("draggable", "false");
    gridItemTitleDiv.setAttribute("contenteditable", "true");
    gridItemTitleDiv.textContent = pj.title;
    Add_Component_Max_Length(gridItemTitleDiv, 30);
    gridItemTitleDiv.addEventListener("maxLengthReached", () => {
      console.log(
        "maxLengthReached event fired"
      );
    });

    Add_Component_Update_Storage_triggers(gridItemTitleDiv);
    gridItemTitleDiv.addEventListener("updateNeeded", () => {
      console.log(
        "Update storage trigger fired 1"
      );

      console.log("Project todoArr[0]: " + pj.todoArr[0]);
      pj.title = gridItemTitleDiv.textContent;
      console.log("Project todoArr[0]: " + pj.todoArr[0]);
      Project.saveToLocalStorage(pj);
      displayProjectDetail();
    });

    const gridItemGrabber = makeGridItemGrabber();

    gridContainerDiv.appendChild(gridItemDiv);
    gridItemDiv.appendChild(gridItemContentDiv);
    gridItemContentDiv.appendChild(gridItemBorderDiv);
    gridItemContentDiv.appendChild(gridItemTitleDiv);
    gridItemContentDiv.appendChild(gridItemGrabber);
  });

  displayDeleteProjectButton();
  displayAddProjectButton();
}

export function displayProjectDetail() {
  console.log(
    "displaying Project Detail for: " + selectedPjId
  );

  const projectTodosDetailsDiv = document.querySelector(
    ".project-todos__details"
  );
  removeAllChildNodes(projectTodosDetailsDiv);
  if (!selectedPjId) {
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

  projectTodosDetailsDiv.dataset.storageId = selectedPjId;

  const pj = Project.retrieveSingleFromLocalStorage(selectedPjId);

  detailsTitleTextDiv.textContent = pj.title;

  detailsDescriptionTextDiv.textContent = pj.description;

  Add_Component_Double_Click_Cursor(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("doubleClickCursor", (event) => {
    console.log(
      "doubleClickCursor event fired"
    );
  });

  Add_Component_Max_Length(detailsDescriptionTextDiv, 120);
  detailsDescriptionTextDiv.addEventListener("maxLengthReached", () => {
    console.log(
      "maxLengthReached event fired"
    );
  });

  Add_Component_Update_Storage_triggers(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("updateNeeded", () => {
    console.log(
      "Update storage trigger fired 2"
    );
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent = "Add description here";
    }
    pj.description = detailsDescriptionTextDiv.textContent;
    Project.saveToLocalStorage(pj);
  });

  displayTodoList();
}

export function displayTodoList() {
  console.log(
    "displaying Todo List"
  );
  //remove previous nodes in the list
  const todoListWrapperDiv = document.querySelector(
    ".project-todos__todo-list-wrapper"
  );
  removeAllChildNodes(todoListWrapperDiv);

  if (!selectedPjId) {
    return;
  }

  //---
  //make heading div to contain label and toolbar for todo list
  const todoListHeadingDiv = document.createElement("div");
  todoListHeadingDiv.classList.add("heading");

  //make the label and its tooltip
  const headingLabelTextDiv = document.createElement("div");
  headingLabelTextDiv.classList.add("label-text");
  headingLabelTextDiv.textContent = "Todo List";
  headingLabelTextDiv.classList.add("tooltip");
  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "Add and remove Todo items here";

  //make the toolbar
  const headingToolbarDiv = document.createElement("div");
  headingToolbarDiv.classList.add("toolbar");
  const toolbarDeleteTodoDiv = document.createElement("div");
  toolbarDeleteTodoDiv.classList.add("toolbar__delete-todo");
  const toolbarAddProjectDiv = document.createElement("div");
  toolbarAddProjectDiv.classList.add("toolbar__add-todo");

  //make the todo list grid container
  const todoList = document.createElement("div");
  todoList.classList.add("project-todos__todo-list");
  const gridContainerDiv = document.createElement("div");
  gridContainerDiv.classList.add("todo-list__grid-container");
  todoList.appendChild(gridContainerDiv);

  //add to DOM
  headingLabelTextDiv.appendChild(tooltipText);
  headingToolbarDiv.appendChild(toolbarDeleteTodoDiv);
  headingToolbarDiv.appendChild(toolbarAddProjectDiv);
  todoListHeadingDiv.appendChild(headingLabelTextDiv);
  todoListHeadingDiv.appendChild(headingToolbarDiv);
  todoListWrapperDiv.appendChild(todoListHeadingDiv);
  todoListWrapperDiv.appendChild(todoList);
  //---

  Add_Component_Drag_Drop_Container(gridContainerDiv, [
    "grid-item__content",
    "grid-item__Title",
    "grid-item__completed",
  ]);
  //Update the order of stored todos to reflect a drag/drop event
  gridContainerDiv.addEventListener("dragDrop", () => {
    console.log(
      "dragDrop event fired"
    );
    let items = gridContainerDiv.querySelectorAll(".grid-item__content");
    let idArray = [];
    items.forEach((item) => {
      idArray.push(item.dataset.storageId);
    });
    const currentProject = Project.retrieveSingleFromLocalStorage(selectedPjId);
    currentProject.todoArr = idArray;
    Project.saveToLocalStorage(currentProject);
    //Todo.updateIdArray(idArray);
  });

  //get all todos from local storage ready to display
  let projectTodos = Project.retrieveTodos(selectedPjId);

  // Loop through all todos in storage to create the todo list
  projectTodos.forEach((td) => {
    const tdId = td.storageId;
    //Make div and add drag drop item functionality
    let gridItemDiv = document.createElement("div");
    Add_Component_Drag_Drop_Item(gridItemDiv);

    //Add content div to list items
    let gridItemContentDiv = document.createElement("div");
    gridItemContentDiv.setAttribute("data-storage-id", tdId);
    gridItemContentDiv.classList.add("grid-item__content");

    //give content div behavior
    Add_Component_Selectable(gridItemContentDiv);
    gridItemContentDiv.addEventListener("selected", (event) => {
      selectedTdId = td.storageId;
      console.log(
        "Todo selection event fired"
      );
      displayTodoDetail();
    });

    Add_Component_Double_Click_Cursor(gridItemContentDiv);
    gridItemContentDiv.addEventListener("doubleClickCursor", (event) => {
      console.log(
        "doubleClickCursor event fired"
      );
    });

    const gridItemBorderDiv = document.createElement("div");
    gridItemBorderDiv.classList.add("grid-item__border");

    const gridItemCheckboxDiv = document.createElement("div");
    gridItemCheckboxDiv.classList.add("grid-item__completed");
    const gridItemCompletedSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    gridItemCompletedSvg.classList.add("completed")
    const gridItemCompletedUse = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    gridItemCompletedUse.setAttribute("href", "#svg-check-circle");

    const gridItemIncompleteSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    gridItemIncompleteSvg.classList.add("incomplete")
    const gridItemIncompleteUse = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    gridItemIncompleteUse.setAttribute("href", "#svg-circle");

    if (td.completed) {
      //gridItemCompletedSvg.style.display = "inline"
      //gridItemIncompleteSvg.style.display = "none"
      gridItemCheckboxDiv.dataset.completed = true
    } else {
      //gridItemCompletedSvg.style.display = "none"
      //gridItemIncompleteSvg.style.display = "inline"
      gridItemCheckboxDiv.dataset.completed = false
    }
    

    gridItemCompletedSvg.appendChild(gridItemCompletedUse);
    gridItemIncompleteSvg.appendChild(gridItemIncompleteUse);
    gridItemCheckboxDiv.appendChild(gridItemCompletedSvg);
    gridItemCheckboxDiv.appendChild(gridItemIncompleteSvg);

    const gridItemTitleDiv = document.createElement("div");
    gridItemTitleDiv.classList.add("grid-item__Title", "editable");
    gridItemTitleDiv.setAttribute("draggable", "false");
    gridItemTitleDiv.setAttribute("contenteditable", "true");
    gridItemTitleDiv.textContent = td.title;
    Add_Component_Max_Length(gridItemTitleDiv, 100);
    gridItemTitleDiv.addEventListener("maxLengthReached", () => {
      console.log(
        "maxLengthReached event fired"
      );
    });
    Add_Component_Update_Storage_triggers(gridItemTitleDiv);
    gridItemTitleDiv.addEventListener("updateNeeded", () => {
      console.log(
        "Update storage trigger fired 3"
      );
      /* if (listItemTitleDiv.textContent === "") {
        listItemTitleDiv.textContent = "Untitled";
      } */
      td.title = gridItemTitleDiv.textContent;
      Todo.saveToLocalStorage(td, selectedPjId);
      displayTodoDetail();
    });

    const gridItemGrabber = makeGridItemGrabber();

    gridItemCheckboxDiv.addEventListener("mouseup", (event) => {
      console.log("selected todo " + selectedTdId)
      td = Todo.retrieveSingleFromLocalStorage(selectedTdId)
      td.completed ? td.completed = false : td.completed = true
      
      Todo.saveToLocalStorage(td, selectedPjId)
      displayTodoList();
      displayTodoDetail();
    })

    gridContainerDiv.appendChild(gridItemDiv);
    gridItemDiv.appendChild(gridItemContentDiv);
    gridItemContentDiv.appendChild(gridItemBorderDiv);
    gridItemContentDiv.appendChild(gridItemCheckboxDiv);
    gridItemContentDiv.appendChild(gridItemTitleDiv);
    gridItemContentDiv.appendChild(gridItemGrabber);
  });

  displayAddTodoButton();
  displayDeleteTodoButton();
}

function displayTodoDetail() {
  console.log(
    "displaying Todo Detail"
  );

  //initiate
  const todoDiv = document.querySelector(".todo");
  const todosHeaderDiv = document.createElement("div");
  todosHeaderDiv.classList.add("todo__header");
  removeAllChildNodes(todoDiv);
  if (!selectedTdId) {
    return;
  }

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

  //due date div
  const dueDateWrapperDiv = document.createElement("div");
  dueDateWrapperDiv.classList.add("details__due-date-wrapper");

  const dueDateLabelDiv = document.createElement("div");
  dueDateLabelDiv.classList.add("label-text");
  dueDateLabelDiv.textContent = "Due Date";
  dueDateWrapperDiv.appendChild(dueDateLabelDiv);

  const dueDateDiv = document.createElement("div");
  dueDateDiv.classList.add("details__due-date");
  dueDateDiv.classList.add("datePicker");
  dueDateWrapperDiv.appendChild(dueDateDiv);

  //priority rater div
  const priorityWrapperDiv = document.createElement("div");
  priorityWrapperDiv.classList.add("details__priority-wrapper");

  const priorityLabelDiv = document.createElement("div");
  priorityLabelDiv.classList.add("label-text");
  priorityLabelDiv.textContent = "Priority";
  priorityWrapperDiv.appendChild(priorityLabelDiv);

  const priorityDiv = document.createElement("div");
  priorityDiv.classList.add("details__priority");
  const priorityRaterDiv = document.createElement("div");
  priorityRaterDiv.classList.add("rater");
  priorityDiv.appendChild(priorityRaterDiv);
  priorityWrapperDiv.appendChild(priorityDiv);

  //adding to DOM
  todoDiv.appendChild(todosHeaderDiv);
  todoDiv.appendChild(dueDateWrapperDiv);
  todoDiv.appendChild(priorityWrapperDiv);
  todosHeaderDiv.appendChild(detailsTitleDiv);
  todosHeaderDiv.appendChild(detailsDescriptionDiv);
  detailsTitleDiv.appendChild(detailsTitleBorderDiv);
  detailsTitleDiv.appendChild(detailsTitleTextDiv);
  detailsDescriptionDiv.appendChild(detailsDescriptionBorderDiv);
  detailsDescriptionDiv.appendChild(detailsDescriptionTextDiv);

  const selectedTodo = Todo.retrieveSingleFromLocalStorage(selectedTdId);

  detailsTitleTextDiv.textContent = selectedTodo.title;

  detailsDescriptionTextDiv.textContent = selectedTodo.description;

  dueDateDiv.textContent = selectedTodo.dueDate;

  Add_Component_Double_Click_Cursor(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("doubleClickCursor", (event) => {
    console.log(
      "doubleClickCursor event fired"
    );
  });

  Add_Component_Max_Length(detailsDescriptionTextDiv, 120);
  detailsDescriptionTextDiv.addEventListener("maxLengthReached", () => {
    console.log(
      "maxLengthReached event fired"
    );
  });

  Add_Component_Update_Storage_triggers(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("updateNeeded", () => {
    console.log(
      "Update storage trigger fired 4"
    );
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent = "Add description here";
    }
    selectedTodo.description = detailsDescriptionTextDiv.textContent;
    Todo.saveToLocalStorage(selectedTodo, selectedPjId);
  });

  //date picker functionality for due date
  const picker = datepicker(".datePicker", {
    showAllDates: true,
    onSelect: (instance, date) => {
      if (!date) {
        return;
      }
      console.log(date.getDate());
      dueDateDiv.textContent = format(date, "EEEE do MMMM yyyy");
      selectedTodo.dueDate = date;
      Todo.saveToLocalStorage(selectedTodo, selectedPjId);
    },
  });

  const myRater = rater({
    element: document.querySelector(".rater"),
    starSize: 24,
    showToolTip: false,
    rateCallback: function rateCallback(rating, done) {
      selectedTodo.priority = rating;
      Todo.saveToLocalStorage(selectedTodo, selectedPjId);
      myRater.setRating(rating);
      done();
    },
  });
  myRater.setRating(selectedTodo.priority);
}

function displayDeleteProjectButton() {
  const deleteProjectDiv = document.querySelector(".toolbar__delete-project");
  removeAllChildNodes(deleteProjectDiv);
  const btn = document.createElement("button");
  btn.classList.add("toolbar__button");
  btn.classList.add("tooltip");
  btn.textContent = "×";

  btn.addEventListener("mouseup", deleteProject);

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "remove the currently selected project";

  //btn.addEventListener("mouseup", );

  btn.append(tooltipText);
  deleteProjectDiv.appendChild(btn);
}

function displayDeleteTodoButton() {

  const deleteTodoDiv = document.querySelector(".toolbar__delete-todo");
  removeAllChildNodes(deleteTodoDiv);
  
  const btn = document.createElement("button");
  btn.classList.add("toolbar__button");
  btn.classList.add("tooltip");

  btn.textContent = "×";

  btn.addEventListener("mouseup", deleteTodo);

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltip-text");
  tooltipText.textContent = "remove the currently selected to do";

  btn.append(tooltipText);
  deleteTodoDiv.appendChild(btn);
}

function displayAddProjectButton() {
  const newProjectDiv = document.querySelector(".toolbar__add-project");
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
  const newTodoDiv = document.querySelector(".toolbar__add-todo");
  removeAllChildNodes(newTodoDiv);
  if (!selectedPjId) {
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
  const mousedown = new MouseEvent("mousedown");

  pjTitleDiv.parentNode.dispatchEvent(dblClick);
  pjTitleDiv.parentNode.dispatchEvent(mousedown);
}

function AddTodo() {
  //create new Todo and update display
  const td = new Todo({ title: "", project: selectedPjId });
  Todo.saveToLocalStorage(td, selectedPjId);
  displayTodoList();
  displayProjectList();
  //focus on new Project
  const tdContentDiv = document.querySelector(
    `[data-storage-id = ${td.storageId}] `
  );
  const tdTitleDiv = tdContentDiv.querySelector(".grid-item__Title");
  const dblClick = new MouseEvent("dblclick");
  const mousedown = new MouseEvent("mousedown");
  tdTitleDiv.parentNode.dispatchEvent(mousedown);
  tdTitleDiv.parentNode.dispatchEvent(dblClick);
}

function deleteProject() {
  Project.deleteProjectInLocalStorage(selectedPjId);
  selectedPjId = "";
  displayProjectList();
  displayProjectDetail();
  displayTodoList();
}

function deleteTodo() {
  Todo.deleteTodoInLocalStorage(selectedTdId, selectedPjId);
  selectedTdId = "";
  displayTodoList();
  displayTodoDetail();
}

function makeGridItemGrabber() {
  const gig = document.createElement("div");
  gig.classList.add("grid-item-grabber");
  const gridItemGrabberSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  const gridItemGrabberUse = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );
  gridItemGrabberUse.setAttribute("href", "#svg-grab");
  gridItemGrabberSvg.appendChild(gridItemGrabberUse);
  gig.appendChild(gridItemGrabberSvg);

  return gig;
}
