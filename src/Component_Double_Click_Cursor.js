export function Add_Component_Double_Click_Cursor(div) {
  div.addEventListener("dblclick", (event) => {
    //exit if the title was clicked on as this double click is treated as normal text
    if (event.target.hasAttribute("contenteditable")) {
      return;
    }
    //move the cursor to the end of the text
    let item = event.target
      .parentNode
      .querySelector(".editable");
    let sel = document.getSelection();
    sel.selectAllChildren(item);
    sel.collapseToEnd();
    return div.dispatchEvent(new Event("doubleClickCursor"));
  });
}
