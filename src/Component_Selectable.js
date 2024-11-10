let lastDivSelected;

export function Add_Component_Selectable(div) {
  div.addEventListener("mousedown", (event) => {
    if (lastDivSelected == div.dataset.storageId) {
      return;
    }
    let clickedItem = event.target.closest(".grid-item__content");
    const localGridContainer = event.target.closest(".grid-container");
    const allItems = localGridContainer.querySelectorAll(".grid-item__content");
    allItems.forEach((item) => {
      item.classList.remove("selected");
    });
    clickedItem.classList.add("selected");
    lastDivSelected = div.dataset.storageId;
    return div.dispatchEvent(new Event("selected"));
  });
}
