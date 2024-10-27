import Project from "./Project.js";
import Todo from "./Todo.js";

export default function Component_Enter_Key_Saving() {
  console.log("Component_Enter_Key_Saving Initiated");
  const list = document.querySelectorAll(".enter-key-saving");
  const array = [...list];

  array.forEach((div) => {
    makeEnterKeySaving(div);
  });

  function makeEnterKeySaving(div) {
    div.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (div.textContent === "") {
          div.textContent = "Project Title";
        }
        let storageId = div.dataset.storageId;
        if (storageId.substring(0, 1) === "P") {
          let pj = Project.retrieveSingleFromLocalStorage(storageId);
          pj.title = div.textContent;
          Project.saveToLocalStorage(pj);
        }
        if (storageId.substring(0, 1) === "T") {
          let td = Todo.retrieveSingleFromLocalStorage(storageId);
          td.title = div.textContent;
          Todo.saveToLocalStorage(td);
        }
        div.blur(); 
        // Do a screen update after this to update info over DOM > displayProjectList() 

      }
    });
  }
}
