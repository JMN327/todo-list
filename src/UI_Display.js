import {
  Add_Component_Drag_Drop_Container,
  Add_Component_Drag_Drop_Item,
} from "./Component_Drag_Drop_List.js";
import { Add_Component_Enter_Key_Prevent_default } from "./Component_Enter_Key_Prevent_Default.js";
import {Add_Component_Selectable} from "./Component_Selectable.js"
import Component_Max_Length_30 from "./Component_Max_length.js";
import "./Drag_Drop_List.css";
import Project from "./Project.js";
import Todo from "./Todo.js";

export function displayProjectList2() {
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
    Add_Component_Enter_Key_Prevent_default(listItemContentDiv);
    listItemContentDiv.addEventListener("preventEnterKey", () => {
      console.log("Prevent Enter Key event fired");
      if (listItemContentDiv.textContent === "") {
        listItemContentDiv.textContent = "Project Title";
      }
      pj.title = listItemContentDiv.textContent;
      Project.saveToLocalStorage(pj);
      listItemContentDiv.childNodes.forEach((child)=>{child.blur()});
    });

    Add_Component_Selectable(listItemContentDiv)
    listItemContentDiv.addEventListener("selected", (event) => {
      console.log("Selection event fired");
      DisplayProjectDetail()
    })

    let listItemBorderDiv = document.createElement("div");
    listItemBorderDiv.classList.add("grid-item__border");

    let listItemTitleDiv = document.createElement("div");
    listItemTitleDiv.classList.add("grid-item__Title");
    listItemTitleDiv.classList.add("max-length-30");
    listItemTitleDiv.setAttribute("draggable", "false");
    listItemTitleDiv.setAttribute("contenteditable", "true");
    listItemTitleDiv.textContent = pj.title;

    gridContainerDiv.appendChild(listItemDiv);
    listItemDiv.appendChild(listItemContentDiv);
    listItemContentDiv.appendChild(listItemBorderDiv);
    listItemContentDiv.appendChild(listItemTitleDiv);

    //COMPONENT add "selected" CSS class to any list items clicked on

    //COMPONENT add double click functionality to put the cursor on the text for editing if empty space on list item is clicked

    //COMPONENT  max length is not exceeded

    //COMPONENT save project if enter key pressed when typing.  Also stop default enter key behavior

    //COMPONENT save project if it loses focus
  });
}

export function DisplayProjectDetail() {
  let selection = document.querySelector(".grid-item__content.selected");
  if (!selection) {
    return;
  }
  selection = selection.dataset.storageId;
  const detailsTitleTextDiv = document.querySelector(".details__title-text");
  const detailsDescriptionTextDiv = document.querySelector(
    ".details__description-text"
  );
  const projectTodosDetailsDiv = document.querySelector(
    ".project-todos__details"
  );
  projectTodosDetailsDiv.dataset.storageId = selection;
  const selectedProject = Project.retrieveSingleFromLocalStorage(selection);

  detailsTitleTextDiv.textContent = selectedProject.title;

  detailsDescriptionTextDiv.textContent = selectedProject.description;
}
