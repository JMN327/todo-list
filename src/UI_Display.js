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

export function displayProjectList2() {
  console.log("displaying Project List");
  //Set up the Project list as a grid container
  let gridContainerDiv = document.querySelector(
    ".project-list__grid-container"
  );
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
      if (listItemContentDiv.textContent === "") {
        listItemContentDiv.textContent = "Project Title";
      }
      pj.title = listItemContentDiv.textContent;
      Project.saveToLocalStorage(pj);
      /*       listItemContentDiv.childNodes.forEach((child) => {
        child.blur();
      }); */
      //DisplayProjectDetail();
    });

    Add_Component_Selectable(listItemContentDiv);
    listItemContentDiv.addEventListener("selected", (event) => {
      console.log("Selection event fired");
      DisplayProjectDetail();
    });

    Add_Component_Double_Click_Cursor(listItemContentDiv);
    listItemContentDiv.addEventListener("doubleClickCursor", (event) => {
      console.log("doubleClickCursor event fired");
    });

    let listItemBorderDiv = document.createElement("div");
    listItemBorderDiv.classList.add("grid-item__border");

    let listItemTitleDiv = document.createElement("div");
    listItemTitleDiv.classList.add("grid-item__Title");
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
}

export function DisplayProjectDetail() {
  console.log("displaying Project Detail");
  const selection = document.querySelector(".grid-item__content.selected");
  if (!selection) {
    return;
  }
  const selectionID = selection.dataset.storageId;

  const projectTodosDetailsDiv = document.querySelector(
    ".project-todos__details"
  );
  removeAllChildNodes(projectTodosDetailsDiv)
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
  detailsDescriptionTextDiv.classList.add("details__description-text");
  detailsDescriptionTextDiv.setAttribute("contenteditable", "true")

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

  //problems due to non-general component
  /*   Add_Component_Double_Click_Cursor(detailsDescriptionTextDiv);
  detailsDescriptionTextDiv.addEventListener("doubleClickCursor", (event) => {
    console.log("doubleClickCursor event fired");
  }); */

  Add_Component_Max_Length(detailsDescriptionTextDiv, 120);
  detailsDescriptionTextDiv.addEventListener("maxLengthReached", () => {
    console.log("maxLengthReached event fired");
  });

  Add_Component_Update_Storage_triggers(detailsDescriptionDiv);
  detailsDescriptionDiv.addEventListener("updateNeeded", () => {
    console.log("Update storage trigger fired 2");
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent =
        "type project description here...";
    }
    selectedProject.description = detailsDescriptionTextDiv.textContent;
    Project.saveToLocalStorage(selectedProject);
  });
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
