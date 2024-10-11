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
    storageId = Date.now().toString(),
  } = {}) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#completed = completed;
    this.#todoArr = todoArr;
    this.#storageId = storageId;
  }

  static saveToLocalStorage(Project) {
    let data = {
      title: Project.#title,
      description: Project.#description,
      dueDate: format(Project.#dueDate, "dd-MMM-yyyy"),
      priority: Project.#priority,
      completed: Project.#completed,
      todoArr: Project.#todoArr,
    };
    localStorage.setItem(Project.#storageId, JSON.stringify(data));

    if (localStorage.getItem("projectIdArray") == null) {
      localStorage.setItem("projectIdArray", "[]");
    }

    let projectIdArray = Array.from(
      JSON.parse(localStorage.getItem("projectIdArray"))
    );

    if (!projectIdArray.includes(Project.#storageId)) {
      projectIdArray.push(Project.#storageId);
      localStorage.setItem("projectIdArray", JSON.stringify(projectIdArray));
    }
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
      let storedInfo = JSON.parse(localStorage.getItem(storageId));
      projects.push(new Project(storedInfo));
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
    /*     if (!(newTodoArr instanceof Array)) {
      throw "Variable not of type Array";
    } */
    this.#todoArr = newTodoArr;
  }

  get todoArr() {
    return this.#todoArr;
  }

  get storageId() {
    return this.#storageId;
  }
}
