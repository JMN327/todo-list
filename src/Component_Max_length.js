import Project from "./Project.js";
import Todo from "./Todo.js";

export default function Component_Max_Length_30() {
  console.log("Component_Max_Length Initiated");
  const list = document.querySelectorAll(".max-length-30");
  const array = [...list];

  array.forEach((div) => {
    maxLength30(div);
  });

  function maxLength30(div) {
    div.addEventListener("beforeinput", (event) => {
        let data = event.data ?? "";
        if (event.target.textContent.length + data.length > 30) {
          event.preventDefault();
        }
      });
  }
}
