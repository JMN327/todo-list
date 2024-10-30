export function Add_Component_Double_Click_Cursor(div) {
  div.addEventListener("dblclick", (event) => {
    //exit if the title was clicked on as this double click is treated as normal text
    if (event.target.classList.contains("grid-item__Title")) {
      return;
    }
    //move the cursor to the end of the text
    let item = event.target
      .closest(".grid-item")
      .querySelector(".grid-item__Title");
    let sel = document.getSelection();
    sel.selectAllChildren(item);
    sel.collapseToEnd();
    return div.dispatchEvent(new Event("doubleClickCursor"));
  });
}
