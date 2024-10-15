import { format } from "date-fns";

export default class Project {
  #title;
  #description;
  #dueDate;
  #priority;
  #completed;
  #todoArr;
  #storageId;

  constructor({
    title = "",
    description = "",
    dueDate = null,
    priority = 0,
    completed = false,
    todoArr = [],
    storageId = "P" + Project.#projectTicker,
  } = {}) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#completed = completed;
    this.#todoArr = todoArr;
    this.#storageId = storageId;
  }

  static get #projectTicker() {
    let x = parseInt(JSON.parse(localStorage.getItem("projectTicker") || 0));
    x++;
    localStorage.setItem("projectTicker", JSON.stringify(x));
    return x.toString();
  }

  static #initializeLocalStorage() {
    localStorage.setItem("projectIdArray", "[]");
  }

  static saveToLocalStorage(Project) {
    let data = {
      title: Project.#title,
      description: Project.#description,
      dueDate: format(Project.#dueDate, "dd-MMM-yyyy"),
      priority: Project.#priority,
      completed: Project.#completed,
      todoArr: Project.#todoArr,
      storageId: Project.#storageId,
    };

    //check if array of keys are being stored in projectIdArray and initiate them if not
    if (localStorage.getItem("projectIdArray") == null) {
      /*       Project.#initializeLocalStorage();
       */ localStorage.setItem("projectIdArray", "[]");
    }

    //retrieve projectIdArray
    let projectIdArray = Array.from(
      JSON.parse(localStorage.getItem("projectIdArray"))
    );

    // check if this project already exists in storage.  If not add it to projectIdArray
    if (!projectIdArray.includes(Project.#storageId)) {
      projectIdArray.push(Project.#storageId);
      localStorage.setItem("projectIdArray", JSON.stringify(projectIdArray));
    }

    // write the project data to storage
    localStorage.setItem(Project.#storageId, JSON.stringify(data));
  }

  static retrieveSingleFromLocalStorage(storageId) {
    let projectIdArray = [];
    if (localStorage.getItem("projectIdArray") == null) {
      throw "No Projects saved in Local Storage index";
    } else {
      projectIdArray = Array.from(
        JSON.parse(localStorage.getItem("projectIdArray"))
      );
    }
    if (projectIdArray.includes(storageId)) {
      let storedInfo = JSON.parse(localStorage.getItem(storageId));
      return new Project(storedInfo);
    }
  }

  static retrieveAllFromLocalStorage() {
    let projectIdArray = [];
    if (localStorage.getItem("projectIdArray") == null) {
      throw "No Projects saved in Local Storage index";
    } else {
      projectIdArray = Array.from(
        JSON.parse(localStorage.getItem("projectIdArray"))
      );
    }
    let projects = [];
    projectIdArray.forEach((storageId) => {
      projects.push(new Project(JSON.parse(localStorage.getItem(storageId))));
    });
    return projects;
  }

  set title(newTitle) {
    newTitle = newTitle.trim();
    if (newTitle === "") {
      throw "The name cannot be empty";
    }
    this.#title = newTitle;
  }

  get title() {
    return this.#title;
  }

  set description(newDescription) {
    newDescription = newDescription.trim();
    if (newDescription === "") {
      throw "The name cannot be empty";
    }
    this.#description = newDescription;
  }

  get description() {
    return this.#description;
  }

  set dueDate(newDueDate) {
    newDueDate = format(newDueDate, "dd-MMM-yyyy");
    this.#dueDate = newDueDate;
  }

  get dueDate() {
    return this.#dueDate;
  }

  set priority(newPriority) {
    this.#priority = newPriority;
  }

  get priority() {
    return this.#priority;
  }

  set completed(newCompleted) {
    this.#completed = newCompleted;
  }

  get completed() {
    return this.#completed;
  }

  set todoArr(newTodoArr) {
    if (!(newTodoArr instanceof Array)) {
      throw "Variable not of type Array";
    }
    this.#todoArr = newTodoArr;
  }

  get todoArr() {
    return this.#todoArr;
  }

  get storageId() {
    return this.#storageId;
  }
}
