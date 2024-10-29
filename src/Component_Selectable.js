export function Add_Component_Selectable(div) {

  div.addEventListener("mousedown", (event) => {
    let clickedItem = event.target.closest(".grid-item__content");
    const localGridContainer = event.target.closest(".grid-container");
    const allItems = localGridContainer.querySelectorAll(".grid-item__content");
    allItems.forEach((item) => {
      item.classList.remove("selected");
    });
    clickedItem.classList.add("selected");
    return div.dispatchEvent(new Event("selected"));
  });
}
