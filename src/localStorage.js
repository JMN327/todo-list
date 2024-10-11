export default function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

/* retrieve() */

/* const saveButton = document.querySelector(".save-button");
saveButton.addEventListener("click", store);

window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  return;
});

function retrieve() {
  //header

  document.querySelector(".location").textContent =
    localStorage["location"] || "location";

  //profiles
  document
    .querySelectorAll(".profile__title")
    .forEach(
      (x, index) =>
        (x.textContent =
          JSON.parse(localStorage["profile__title"])[index] || "Profile Title")
    );
}

function store() {
  //header
  localStorage["header__name"] =
    document.querySelector(".header__name").textContent;

  //Profiles
  localStorage.setItem(
    "profile__title",
    JSON.stringify(
      Array.from(document.querySelectorAll(".profile__title")).map(
        (x) => x.textContent
      )
    )
  );
}
 */