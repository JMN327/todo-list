let lastSelectedID;

export function Add_Component_Selectable(div) {
  div.addEventListener("mousedown", (event) => {
    if (lastSelectedID == div.dataset.storageId) {
      return;
    }
    const localGridContainer = event.target.closest(".grid-container");
    const lastSelectedDiv = localGridContainer.querySelector(".selected");
    if (lastSelectedDiv) {
      lastSelectedDiv.classList.remove("selected");
    }
    const clickedItem = event.target.closest(".grid-item__content");
    clickedItem.classList.add("selected");
    lastSelectedID = div.dataset.storageId;
    return div.dispatchEvent(new Event("selected"));
  });
}
