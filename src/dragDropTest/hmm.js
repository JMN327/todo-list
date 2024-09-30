let draggedItem = null;

const gridContainer = document.querySelector(".grid-container");

gridContainer.addEventListener("dragstart", function (event) {

/*   const dummyItem = document.createElement("div");
  dummyItem.textContent = "Dummy";
  dummyItem.classList.add("grid-item");
  gridContainer.insertBefore(dummyItem, event.target); */
  console.log(event.target)

  draggedItem = event.target;
  
/*   setTimeout(function () {
    event.target.style.display = "none";
  }, 0); */

});

gridContainer.addEventListener("dragover", function (event) {
  event.preventDefault();
});

gridContainer.addEventListener("dragenter", function (event) {
  if (event.target.classList.contains("grid-item")) {
    event.target.style.backgroundColor = "#e6e6e6";
  }
});

gridContainer.addEventListener("dragleave", function (event) {
  if (event.target.classList.contains("grid-item")) {
    event.target.style.backgroundColor = "#f2f2f2";
  }
});

gridContainer.addEventListener("drop", function (event) {
  event.preventDefault();
  if (event.target.classList.contains("grid-item")) {
    event.target.style.backgroundColor = "#f2f2f2";
    const parent = draggedItem.parentNode;
    parent.removeChild(draggedItem);
    event.target.parentNode.insertBefore(draggedItem, event.target);
  }
});

gridContainer.addEventListener("dragend", function (event) {
  event.target.style.display = "block";
  draggedItem = null;
});
