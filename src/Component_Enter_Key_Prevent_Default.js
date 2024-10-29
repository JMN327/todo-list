export function Add_Component_Enter_Key_Prevent_default(div) {
  div.classList.add("enter-key-saving");

  const preventEnterKeyEvent = new Event("preventEnterKey");

  div.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Do a screen update after this to update info over DOM > displayProjectList()
      return div.dispatchEvent(preventEnterKeyEvent);
    }
  });

  
}
