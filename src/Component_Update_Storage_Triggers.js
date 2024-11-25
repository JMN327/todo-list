export function Add_Component_Update_Storage_triggers(div) {
  div.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      clearSelection();
      return div.dispatchEvent(new Event("updateNeeded"));
    }
  });

  div.addEventListener("focusout", (event) => {
    clearSelection();
    return div.dispatchEvent(new Event("updateNeeded"));
  });
}

function clearSelection() {
  if (document.getSelection) {
    document.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}
