export function Add_Component_Update_Storage_triggers(div) {
  div.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Do a screen update after this to update info over DOM > displayProjectList()
      //return div.dispatchEvent(new Event("updateNeeded"));
      div.childNodes.forEach((child) => {
        child.blur();
      });
    }
  });

  div.addEventListener("focusout", (event) => {
    clearSelection()
    return div.dispatchEvent(new Event("updateNeeded"));
  });
}

function clearSelection()
{
 if (window.getSelection) {window.getSelection().removeAllRanges();}
 else if (document.selection) {document.selection.empty();}
}
