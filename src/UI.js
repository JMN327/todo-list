import DragDropList from "./DragDropList.js";
import "./DragDropList.css";
import Project from "./Project.js";

export function displayProjectList() {
  const projectList = document.querySelector(".projects__project-list");
  const allProjects = Project.retrieveAllFromLocalStorage();
  let gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  projectList.appendChild(gridContainer);

  gridContainer.addEventListener("dragDrop", () => {
    console.log("dragDrop event fired");
    //make array of storage IDs
    let items = gridContainer.querySelectorAll(".grid-item__content");
    let idArray = [];
    items.forEach((item) => {
      idArray.push(item.dataset.storageId);
    });
    // call Project static function to update array to local storage (need to make this)
    Project.updateProjectIdArray(idArray);
  });

  allProjects.forEach((pj) => {
    let gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    let gridItemContent = document.createElement("div");
    gridItemContent.classList.add("grid-item__content");
    gridItemContent.setAttribute("data-storage-id", pj.storageId);
    gridItemContent.addEventListener("mousedown", (event) => {
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
    gridItemContent.addEventListener("dblclick", (event) => {
      console.log(event.target);
      if (event.target.classList.contains("grid-item__Title")) {
        return;
      }
      let item = event.target
        .closest(".grid-item")
        .querySelector(".grid-item__Title");
      let sel = document.getSelection();
      sel.selectAllChildren(item);
      sel.collapseToEnd();
    });

    let gridItemBorder = document.createElement("div");
    gridItemBorder.classList.add("grid-item__border");
    gridItemContent.appendChild(gridItemBorder);

    let gridItemTitle = document.createElement("div");
    gridItemTitle.classList.add("grid-item__Title");
    gridItemTitle.setAttribute("draggable", "false");
    gridItemTitle.textContent = pj.title;
    gridItemTitle.setAttribute("contenteditable", "true");
    gridItemTitle.addEventListener("beforeinput", (event) => {
      let data = event.data?? ''
      console.log(event.target.textContent.length + data.length);
      if (event.target.textContent.length + data.length > 20) {
        event.preventDefault();
      }
    });
    gridItemTitle.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (gridItemTitle.textContent === "") {
          gridItemTitle.textContent = "Project Title";
        }
        pj.title = gridItemTitle.textContent;
        Project.saveToLocalStorage(pj);
        updateProjectDetail(event);
        gridItemTitle.blur();
      }
    });
    gridItemTitle.addEventListener("focusout", (event) => {
      console.log("focusout");
      if (gridItemTitle.textContent === "") {
        gridItemTitle.textContent = "Project Title";
      }
      pj.title = gridItemTitle.textContent;
      Project.saveToLocalStorage(pj);
    });

    gridItemContent.appendChild(gridItemTitle);

    gridItem.appendChild(gridItemContent);
    gridContainer.appendChild(gridItem);
  });

  projectList.addEventListener("mousedown", (event) => {
    updateProjectDetail(event);
  });

  function updateProjectDetail(event) {
    let x = event.target.closest(".grid-item__content");
    if (!x) {
      return;
    }
    x = x.dataset.storageId;
    let selectedProject = Project.retrieveSingleFromLocalStorage(x);
    const projectDetails = document.querySelector(".project-todos__details");
    projectDetails.textContent = selectedProject.title;
  }

  DragDropList();
}
