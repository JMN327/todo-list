import DragDropList from "./DragDropList.js";
import "./DragDropList.css";
import Project from "./Project.js";

export function displayProjectList() {
  //get the static divs
  const projectListDiv = document.querySelector(".projects__project-list");
  const detailsTitleTextDiv = document.querySelector(".details__title-text");
  const projectTodosDetailsDiv = document.querySelector(
    ".project-todos__details"
  );
  const detailsDescriptionTextDiv = document.querySelector(
    ".details__description-text"
  );
  //make grid-container for drag-drop and append
  let gridContainerDiv = document.createElement("div");
  gridContainerDiv.classList.add("grid-container");
  projectListDiv.appendChild(gridContainerDiv);

  //add listener for custom dragDrop event to update ID array in local storage - saves order of projects in the list
  gridContainerDiv.addEventListener("dragDrop", () => {
    console.log("dragDrop event fired");
    let items = gridContainerDiv.querySelectorAll(".grid-item__content");
    let idArray = [];
    items.forEach((item) => {
      idArray.push(item.dataset.storageId);
    });
    Project.updateProjectIdArray(idArray);
  });

  //get the projects from local storage ready to display
  const allProjects = Project.retrieveAllFromLocalStorage();
  //make default project if no projects saved
  if (allProjects == null) {
    console.log("No projects in storage.  Creating default project");
    let defaultProject = new Project();
    defaultProject.title = "Default Project";
    defaultProject.description = "This is the default project";
    Project.saveToLocalStorage(defaultProject);
    allProjects = Project.retrieveAllFromLocalStorage();
  }
  // Loop through all projects in storage to create the project list and prescribe to event listeners
  allProjects.forEach((pj) => {
    //make dom elements, classes, attributes
    let gridItemDiv = document.createElement("div");
    gridItemDiv.classList.add("grid-item");

    let gridItemContentDiv = document.createElement("div");
    gridItemContentDiv.classList.add("grid-item__content");
    gridItemContentDiv.setAttribute("data-storage-id", pj.storageId);

    let gridItemBorderDiv = document.createElement("div");
    gridItemBorderDiv.classList.add("grid-item__border");

    let gridItemTitleDiv = document.createElement("div");
    gridItemTitleDiv.classList.add("grid-item__Title");
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
    gridItemTitleDiv.addEventListener("beforeinput", (event) => {
      let data = event.data ?? "";
      console.log(event.target.textContent.length + data.length);
      if (event.target.textContent.length + data.length > 30) {
        event.preventDefault();
      }
    });

    //save project if enter key pressed when typing.  Also stop default enter key behavior
    gridItemTitleDiv.addEventListener("keydown", (event) => {
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
    });

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

  /*   detailsDescriptionTextDiv.addEventListener("input", (event) => {
    console.log("input", projectTodosDetailsDiv.dataset.storageId);
    if (detailsDescriptionTextDiv.textContent === "") {
      detailsDescriptionTextDiv.textContent =
        "type project description here...";
    }
    let pj = Project.retrieveSingleFromLocalStorage(
      projectTodosDetailsDiv.dataset.storageId
    );
    pj.description = detailsDescriptionTextDiv.textContent;
    Project.saveToLocalStorage(pj);
    updateProjectDetail(event);
    
  }); */

  detailsDescriptionTextDiv.addEventListener("input", (event) => {
    console.log("keydown", projectTodosDetailsDiv.dataset.storageId);

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
    let x = event.target.closest(".grid-item__content");
    if (!x) {
      return;
    }
    x = x.dataset.storageId;
    projectTodosDetailsDiv.dataset.storageId = x;
    let selectedProject = Project.retrieveSingleFromLocalStorage(x);
    detailsTitleTextDiv.textContent = selectedProject.title;

    detailsDescriptionTextDiv.textContent = selectedProject.description;
  }

  DragDropList();
}
