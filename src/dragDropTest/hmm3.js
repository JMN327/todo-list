const gridContainer = document.querySelector(".grid-container");

let row = null;
let shiftY = null;
let startY = null;

gridContainer.addEventListener("dragstart", (event) => {
  event.preventDefault();
  return false;
});

gridContainer.addEventListener("mousedown", (event) => {
  if (!event.target.classList.contains("grid-item")) {
    return;
  }
  row = event.target;
  row.style.zIndex = 1000;
  /* row.style.position = absolute; */
  shiftY = event.offsetY;
  startY = row.getBoundingClientRect().top;
  console.log(event.offsetY);
});

gridContainer.addEventListener("mousemove", (event) => {
  if (!row) {
    return;
  }
  let mouseYRelToContainer = event.clientY - startY;
  row.style.top = mouseYRelToContainer - shiftY + "px";
  console.log(
    "Item: " +
      row.textContent +
      "Y Position: " +
      row.getBoundingClientRect().top
  );
});

gridContainer.addEventListener("mouseup", (event) => {
  row = null;
  shiftY = null;
  startY = null;
});
