import {
  Add_Component_Drag_Drop_Container,
  Add_Component_Drag_Drop_Item,
} from "./Component_Drag_Drop_List.js";
import { Add_Component_Enter_Key_Prevent_default } from "./Component_Enter_Key_Prevent_Default.js";
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
    //make dom elements, classes, attributes
    let gridItemDiv = document.createElement("div");
    Add_Component_Drag_Drop_Item(gridItemDiv);

    let gridItemContentDiv = document.createElement("div");
    gridItemContentDiv.setAttribute("data-storage-id", pj.storageId);
    gridItemContentDiv.classList.add("grid-item__content");
    Add_Component_Enter_Key_Prevent_default(gridItemContentDiv);
    gridItemContentDiv.addEventListener("preventEnterKey", () => {
      console.log("Prevent Enter Key event fired");
      if (gridItemContentDiv.textContent === "") {
        gridItemContentDiv.textContent = "Project Title";
      }
      pj.title = gridItemContentDiv.textContent;
      Project.saveToLocalStorage(pj);
      gridItemContentDiv.childNodes.forEach((child)=>{child.blur()});
    });

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
  projectTodosDetailsDiv.dataset.storageId = selection;
  const selectedProject = Project.retrieveSingleFromLocalStorage(selection);

  detailsTitleTextDiv.textContent = selectedProject.title;

  detailsDescriptionTextDiv.textContent = selectedProject.description;
}
