const gridContainer = document.querySelector(".grid-container");

let block = null;

gridContainer.addEventListener("dragstart", (event) => {
  event.preventDefault();
  return false;
});

gridContainer.addEventListener("mousedown", (event) => {


  block = event.target;

  /* let shiftX = event.clientX - block.getBoundingClientRect().left; */
  let shiftY = event.clientY - block.getBoundingClientRect().top;

  block.style.position = "absolute";
  block.style.zIndex = 1000;
  document.body.append(block);

  moveAt(event.pageX, event.pageY);

  // moves the block at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    /*  block.style.left = pageX - shiftX + 'px'; */
    block.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the block on mousemove
  gridContainer.addEventListener("mousemove", onMouseMove);

  // drop the block, remove unneeded handlers
  block.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    block.onmouseup = null;
  };
});
