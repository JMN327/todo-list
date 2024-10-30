export function Add_Component_Update_Storage_triggers(div) {
  div.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Do a screen update after this to update info over DOM > displayProjectList()
      return div.dispatchEvent(new Event("updateNeeded"));
    }
  });

  div.addEventListener("focusout", (event) => {
    return div.dispatchEvent(new Event("updateNeeded"));
  });
}
