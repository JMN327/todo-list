export default function Component_Drag_Drop_List() {
  console.log("Component_Drag_Drop_List Initiated");
  const gridContainerList = document.querySelectorAll(".grid-container");
  const gridContainerArray = [...gridContainerList];

  gridContainerArray.forEach((gridContainer) => {
    makeDragNDrop(gridContainer);
  });

  function makeDragNDrop(gridContainer) {
    const gridContainerStyles = getComputedStyle(gridContainer);
    let gap = parseInt(gridContainerStyles.getPropertyValue("gap"));
    let paddingTop = parseInt(
      gridContainerStyles.getPropertyValue("padding-top")
    );

    const dragDropEvent = new Event("dragDrop");

    let item = null;
    let itemAbove = null;
    let itemAboveBottomY = null;
    let itemBelow = null;
    let itemBelowTopY = null;
    let gridContainerTop = null;
    let pointerOffset = null;
    let initialItemPosY = null;
    let itemContainerTopY = null;
    let itemContainerBottomY = null;
    let itemLocalPosY = null;
    let switchOffset = 0;
    let animating = false;

    let sticky = false;

    gridContainer.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    gridContainer.addEventListener("mousedown", (event) =>
      pickUpGridItem(event)
    );
    gridContainer.addEventListener("mousemove", (event) => moveGridItem(event));
    gridContainer.addEventListener("mouseup", (event) =>
      releaseGridItem(event)
    );

    gridContainer.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    if (sticky) {
      gridContainer.addEventListener("mouseenter", (event) => {
        if (event.buttons !== 1) {
          releaseGridItem(event);
        }
      });
    } else {
      gridContainer.addEventListener("mouseleave", (event) => {
        if (event.buttons == 1) {
          releaseGridItem(event);
        }
      });
    }

    function pickUpGridItem(event) {
      if (event.target.classList.contains("grid-item__Title")) {
        return;
      }

      if (event.target.classList.contains("trash-button")) {
        return;
      }

      item = event.target.closest(".grid-item");

      if (!item) {
        return;
      }
      if (event.buttons !== 1) {
        return;
      }
      if (animating) {
        return;
      }

      /*       let parent = item.parentNode;
      for (const child of parent.children) {
        child.children[0].classList.remove("selected");
      }

      if (item.hasChildNodes()) {
        item.firstChild.classList.add("selected");
      } */

      item.style.zIndex = 1000;
      gridContainerTop = gridContainer.getBoundingClientRect().top;
      initialItemPosY = item.getBoundingClientRect().top;
      pointerOffset = event.clientY - initialItemPosY;
      getImmediateSiblings(item);
    }

    function moveGridItem(event) {
      event.preventDefault();
      if (!item) {
        return;
      }
      if (animating) {
        return;
      }
      if (event.buttons !== 1) {
        return;
      }
      item.classList.add("moving");
      itemContainerTopY = event.clientY - pointerOffset - gridContainerTop;
      itemContainerBottomY = itemContainerTopY + item.offsetHeight;

      //swap if higher than item above
      if (itemAbove) {
        if (itemContainerBottomY <= itemAboveBottomY) {
          let itemHeightSnapshot = itemAbove.offsetHeight;
          switchOffset += gap + itemHeightSnapshot;
          item.parentNode.insertBefore(item, itemAbove);
          getImmediateSiblings(item);

          animateSnap(itemBelow, -itemHeightSnapshot, 0, 150);
        }
      }

      //swap if lower than item below
      if (itemBelow) {
        if (itemContainerTopY >= itemBelowTopY) {
          let itemHeightSnapshot = itemBelow.offsetHeight;
          switchOffset -= gap + itemHeightSnapshot;
          item.parentNode.insertBefore(item, itemBelow.nextElementSibling);
          getImmediateSiblings(item);

          animateSnap(itemAbove, itemHeightSnapshot, 0, 150);
        }
      }

      itemLocalPosY =
        event.clientY - initialItemPosY + switchOffset - pointerOffset;

      //set the actual position of the grid-item
      if (itemContainerBottomY < item.offsetHeight) {
        /* item.parentNode.prepend(item); */
        itemLocalPosY = -paddingTop;
      } else if (
        itemContainerTopY >
        gridContainer.offsetHeight - item.offsetHeight
      ) {
        /* item.parentNode.append(item); */
        itemLocalPosY = paddingTop;
      }
      item.style.top = itemLocalPosY + "px";

      getImmediateSiblings(item);
    }

    function releaseGridItem(event) {
      if (!item) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      const snapAnimation = animateSnap(item, 0, -itemLocalPosY, 150);
      snapAnimation.onfinish = () => {
        item.style.top = null;
        item.style.zIndex = null;
        item.classList.remove("moving");
        item = null;
        itemAbove = null;
        itemAboveBottomY = null;
        itemBelow = null;
        itemBelowTopY = null;
        gridContainerTop = null;
        pointerOffset = null;
        initialItemPosY = null;
        itemContainerTopY = null;
        itemLocalPosY = null;
        switchOffset = 0;
        animating = false;
      };
      return gridContainer.dispatchEvent(dragDropEvent);
    }

    function getImmediateSiblings(currentItem) {
      itemAbove = currentItem.previousElementSibling;
      itemBelow = currentItem.nextElementSibling;
      if (itemAbove) {
        itemAboveBottomY =
          itemAbove.getBoundingClientRect().top +
          itemAbove.offsetHeight -
          gridContainerTop;
      }
      if (itemBelow) {
        itemBelowTopY =
          itemBelow.getBoundingClientRect().top - gridContainerTop;
      }
    }

    function animateSnap(thisItem, startPosition, endPosition, durationMS) {
      const snap = [
        { transform: `translate(0px, ${startPosition}px)` },
        { transform: `translate(0px, ${endPosition}px)` },
      ];
      const snapTiming = {
        duration: durationMS,
      };

      return thisItem.animate(snap, snapTiming);
    }
  }
}
