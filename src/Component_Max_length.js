export function Add_Component_Max_Length(div, length) {
  div.addEventListener("beforeinput", (event) => {
    let data = event.data ?? "";
    if (event.target.textContent.length + data.length > length) {
      event.preventDefault();
      return div.dispatchEvent(new Event("maxLengthReached"));
    }
  });
  
}
