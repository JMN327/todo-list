import { Add_Component_Drag_Drop_Container } from "./Component_Drag_Drop_List.js";
import {Add_Component_Enter_Key_Prevent_default} from "./Component_Enter_Key_Prevent_Default.js";
import Component_Max_Length_30 from "./Component_Max_length.js";
import "./Drag_Drop_List.css";
import Project from "./Project.js";
import Todo from "./Todo.js";

export function displayProjectList() {
  //get the static divs
  const projectListDiv = document.querySelector(".projects__project-list");
  const projectTodosDetailsDiv = document.querySelector(
    ".project-todos__details"
  );
  const detailsDescriptionTextDiv = document.querySelector(
    ".details__description-text"
  );

  //make grid-container for drag-drop and append
  let gridContainerDiv = document.querySelector(
    ".project-list__grid-container"
  );
  Add_Component_Drag_Drop_Container(gridContainerDiv);

  //add listener for custom dragDrop event to update ID array in local storage - saves order of projects in the list
  gridContainerDiv.addEventListener("dragDrop", () => {
    console.log("dragDrop event fired");
    let items = gridContainerDiv.querySelectorAll(".grid-item__content");
    let idArray = [];
    items.forEach((item) => {
      idArray.push(item.dataset.storageId);
    });
    Project.updateIdArray(idArray);
  });

  //get the projects from local storage ready to display
  const allProjects = Project.retrieveAllFromLocalStorage();

  // Loop through all projects in storage to create the project list and prescribe to event listeners
  allProjects.forEach((pj) => {
    //make dom elements, classes, attributes
    let gridItemDiv = document.createElement("div");
    gridItemDiv.classList.add("grid-item");

    let gridItemContentDiv = document.createElement("div");
    gridItemContentDiv.setAttribute("data-storage-id", pj.storageId);
    gridItemContentDiv.classList.add("grid-item__content");
    gridItemContentDiv.classList.add("enter-key-saving");

    let gridItemBorderDiv = document.createElement("div");
    gridItemBorderDiv.classList.add("grid-item__border");

    let gridItemTitleDiv = document.createElement("div");
    gridItemTitleDiv.classList.add("grid-item__Title");
    gridItemTitleDiv.classList.add("max-length-30");
    gridItemTitleDiv.setAttribute("draggable", "false");
    gridItemTitleDiv.setAttribute("contenteditable", "true");
    gridItemTitleDiv.textContent = pj.title;

    gridContainerDiv.appendChild(gridItemDiv);
    gridItemDiv.appendChild(gridItemContentDiv);
    gridItemContentDiv.appendChild(gridItemBorderDiv);
    gridItemContentDiv.appendChild(gridItemTitleDiv);

    //add "selected" CSS class to any list items clicked on
    gridItemContentDiv.addEventListener("mousedown", (event) => {
      let clickedItem = event.target.closest(".grid-item__content");
      const localGridContainer = event.target.closest(".grid-container");
      const allItems = localGridContainer.querySelectorAll(
        ".grid-item__content"
      );
      allItems.forEach((x) => {
        x.classList.remove("selected");
      });
      clickedItem.classList.add("selected");
    });

    // add double click functionality to put the cursor on the text for editing if empty space on list item is clicked
    gridItemContentDiv.addEventListener("dblclick", (event) => {
      //exit if the title was clicked on as this double click is treated as normal text
      if (event.target.classList.contains("grid-item__Title")) {
        return;
      }
      //move the cursor to the end of the text
      let item = event.target
        .closest(".grid-item")
        .querySelector(".grid-item__Title");
      let sel = document.getSelection();
      sel.selectAllChildren(item);
      sel.collapseToEnd();
    });

    //ensure max length is not exceeded
    /*     gridItemTitleDiv.addEventListener("beforeinput", (event) => {
      let data = event.data ?? "";
      console.log(event.target.textContent.length + data.length);
      if (event.target.textContent.length + data.length > 30) {
        event.preventDefault();
      }
    }); */

    //save project if enter key pressed when typing.  Also stop default enter key behavior
    /*     gridItemTitleDiv.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (gridItemTitleDiv.textContent === "") {
          gridItemTitleDiv.textContent = "Project Title";
        }
        pj.title = gridItemTitleDiv.textContent;
        Project.saveToLocalStorage(pj);
        updateProjectDetail(event);
        gridItemTitleDiv.blur();
      }
    }); */

    //save project if it loses focus
    gridItemTitleDiv.addEventListener("focusout", (event) => {
      console.log("focusout");
      if (gridItemTitleDiv.textContent === "") {
        gridItemTitleDiv.textContent = "Project Title";
      }
      pj.title = gridItemTitleDiv.textContent;
      Project.saveToLocalStorage(pj);
      updateProjectDetail(event);
      gridItemTitleDiv.blur();
    });
  });

  //update the project details section
  projectListDiv.addEventListener("mousedown", (event) => {
    updateProjectDetail(event);
  });

  detailsDescriptionTextDiv.addEventListener("input", (event) => {
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent =
        "type project description here...";
    }

    let pj = Project.retrieveSingleFromLocalStorage(
      projectTodosDetailsDiv.dataset.storageId
    );
    pj.description = detailsDescriptionTextDiv.textContent;
    Project.saveToLocalStorage(pj);
  });
  detailsDescriptionTextDiv.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      let pj = Project.retrieveSingleFromLocalStorage(
        projectTodosDetailsDiv.dataset.storageId
      );
      pj.description = detailsDescriptionTextDiv.textContent;
      Project.saveToLocalStorage(pj);
      detailsDescriptionTextDiv.blur();
    }
  });

  function updateProjectDetail(event) {
    //let selection = event.target.closest(".grid-item__content");
    let selection = document.querySelector(".grid-item__content.selected");
    const detailsTitleTextDiv = document.querySelector(".details__title-text");
    if (!selection) {
      return;
    }
    selection = selection.dataset.storageId;
    projectTodosDetailsDiv.dataset.storageId = selection;
    let selectedProject = Project.retrieveSingleFromLocalStorage(selection);
    detailsTitleTextDiv.textContent = selectedProject.title;

    detailsDescriptionTextDiv.textContent = selectedProject.description;
  }

  Component_Enter_Key_Saving();
  Component_Max_Length_30();
}

export function displayTodoList() {
  //get the static divs
  const todoListDiv = document.querySelector(".todos__todo-list");
  const detailsTitleTextDiv = document.querySelector(".details__title-text");
  const todoTodosDetailsDiv = document.querySelector(".todo-todos__details");
  const detailsDescriptionTextDiv = document.querySelector(
    ".details__description-text"
  );

  //make grid-container for drag-drop and append
  let gridContainerDiv = document.createElement("div");
  gridContainerDiv.classList.add("grid-container");
  todoListDiv.appendChild(gridContainerDiv);

  //add listener for custom dragDrop event to update ID array in local storage - saves order of todos in the list
  gridContainerDiv.addEventListener("dragDrop", () => {
    console.log("dragDrop event fired");
    let items = gridContainerDiv.querySelectorAll(".grid-item__content");
    let idArray = [];
    items.forEach((item) => {
      idArray.push(item.dataset.storageId);
    });
    Todo.updateIdArray(idArray);
  });

  //get the todos from local storage ready to display
  const allTodos = Todo.retrieveAllFromLocalStorage();
  //make default todo if no todos saved
  if (allTodos == null) {
    console.log("No todos in storage.  Creating default todo");
    let defaultTodo = new Todo();
    defaultTodo.title = "Default Todo";
    defaultTodo.description = "This is the default todo";
    Todo.saveToLocalStorage(defaultTodo);
    allTodos = Todo.retrieveAllFromLocalStorage();
  }
  // Loop through all todos in storage to create the todo list and prescribe to event listeners
  allTodos.forEach((td) => {
    //make dom elements, classes, attributes
    let gridItemDiv = document.createElement("div");
    gridItemDiv.classList.add("grid-item");

    let gridItemContentDiv = document.createElement("div");
    gridItemContentDiv.setAttribute("data-storage-id", td.storageId);
    gridItemContentDiv.classList.add("grid-item__content");
    gridItemContentDiv.classList.add("enter-key-saving");

    let gridItemBorderDiv = document.createElement("div");
    gridItemBorderDiv.classList.add("grid-item__border");

    let gridItemTitleDiv = document.createElement("div");
    gridItemTitleDiv.classList.add("grid-item__Title");
    gridItemTitleDiv.setAttribute("draggable", "false");
    gridItemTitleDiv.setAttribute("contenteditable", "true");
    gridItemTitleDiv.textContent = td.title;

    gridContainerDiv.appendChild(gridItemDiv);
    gridItemDiv.appendChild(gridItemContentDiv);
    gridItemContentDiv.appendChild(gridItemBorderDiv);
    gridItemContentDiv.appendChild(gridItemTitleDiv);

    //add "selected" CSS class to any list items clicked on
    gridItemContentDiv.addEventListener("mousedown", (event) => {
      let clickedItem = event.target.closest(".grid-item__content");
      const localGridContainer = event.target.closest(".grid-container");
      const allItems = localGridContainer.querySelectorAll(
        ".grid-item__content"
      );
      allItems.forEach((x) => {
        x.classList.remove("selected");
      });
      clickedItem.classList.add("selected");
    });

    // add double click functionality to put the cursor on the text for editing if empty space on list item is clicked
    gridItemContentDiv.addEventListener("dblclick", (event) => {
      //exit if the title was clicked on as this double click is treated as normal text
      if (event.target.classList.contains("grid-item__Title")) {
        return;
      }
      //move the cursor to the end of the text
      let item = event.target
        .closest(".grid-item")
        .querySelector(".grid-item__Title");
      let sel = document.getSelection();
      sel.selectAllChildren(item);
      sel.collapseToEnd();
    });

    //ensure max length is not exceeded
    gridItemTitleDiv.addEventListener("beforeinput", (event) => {
      let data = event.data ?? "";
      console.log(event.target.textContent.length + data.length);
      if (event.target.textContent.length + data.length > 30) {
        event.preventDefault();
      }
    });

    //save todo if enter key pressed when typing.  Also stop default enter key behavior
    /*     gridItemTitleDiv.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (gridItemTitleDiv.textContent === "") {
          gridItemTitleDiv.textContent = "Todo Title";
        }
        td.title = gridItemTitleDiv.textContent;
        Todo.saveToLocalStorage(td);
        updateTodoDetail(event);
        gridItemTitleDiv.blur();
      }
    }); */

    //save todo if it loses focus
    gridItemTitleDiv.addEventListener("focusout", (event) => {
      console.log("focusout");
      if (gridItemTitleDiv.textContent === "") {
        gridItemTitleDiv.textContent = "Todo Title";
      }
      td.title = gridItemTitleDiv.textContent;
      Todo.saveToLocalStorage(td);
      updateTodoDetail(event);
      gridItemTitleDiv.blur();
    });
  });

  //update the todo details section
  todoListDiv.addEventListener("mousedown", (event) => {
    updateTodoDetail(event);
  });

  /*   detailsDescriptionTextDiv.addEventListener("input", (event) => {
    console.log("input", todoTodosDetailsDiv.dataset.storageId);
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent =
        "type todo description here...";
    }
    let td = Todo.retrieveSingleFromLocalStorage(
      todoTodosDetailsDiv.dataset.storageId
    );
    td.description = detailsDescriptionTextDiv.textContent;
    Todo.saveToLocalStorage(td);
    updateTodoDetail(event);
    
  }); */

  detailsDescriptionTextDiv.addEventListener("input", (event) => {
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent = "type todo description here...";
    }

    let td = Todo.retrieveSingleFromLocalStorage(
      todoTodosDetailsDiv.dataset.storageId
    );
    td.description = detailsDescriptionTextDiv.textContent;
    Todo.saveToLocalStorage(td);
  });
  detailsDescriptionTextDiv.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      let td = Todo.retrieveSingleFromLocalStorage(
        todoTodosDetailsDiv.dataset.storageId
      );
      td.description = detailsDescriptionTextDiv.textContent;
      Todo.saveToLocalStorage(td);
      detailsDescriptionTextDiv.blur();
    }
  });

  function updateTodoDetail(event) {
    let x = event.target.closest(".grid-item__content");
    if (!x) {
      return;
    }
    x = x.dataset.storageId;
    todoTodosDetailsDiv.dataset.storageId = x;
    let selectedTodo = Todo.retrieveSingleFromLocalStorage(x);
    detailsTitleTextDiv.textContent = selectedTodo.title;

    detailsDescriptionTextDiv.textContent = selectedTodo.description;
  }

  Component_Drag_Drop_List();
  Component_Enter_Key_Saving();
  Component_Max_Length_30();
}
