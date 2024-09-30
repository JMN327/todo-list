const gridContainer = document.querySelector(".grid-container");

let row = null;
let shiftY = null;
let startY = null;
let currentYPos = null;

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
  console.log("StartY: " + startY);

  const fxMove = `transform: translate(0px, 0px);`;
});

gridContainer.addEventListener("mousemove", (event) => {
  if (!row) {
    return;
  }
  let mouseYRelToContainer = event.clientY - startY;
  currentYPos = mouseYRelToContainer - shiftY;
  row.style.top = currentYPos + "px";
  console.log(
    "Item: " +
      row.textContent +
      "Y Position: " +
      row.getBoundingClientRect().top
  );
});

gridContainer.addEventListener("mouseup", (event) => {
  let endYPos = currentYPos;
  const snap = [{ transform: `translate(0px, ${-endYPos}px)` }];
  const snapTiming = {
    duration: 200,
    iterations: 1,
  };

  const snapAni = row.animate(snap, snapTiming);
  snapAni.onfinish = (event) => {
    row.style.top = 0 + "px";
    row = null;
    shiftY = null;
    startY = null;
  };
});
