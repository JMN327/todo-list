import Todo from "./Todo.js";
import { format } from "date-fns";
import storageAvailable from "./localStorage.js";
const numberToText = require("number-to-text");
require("number-to-text/converters/en-us");

export default class Project {
  #title;
  #description;
  #todoArr;
  #storageId;
  #createdDate;

  constructor({
    title = "type project Title here...", //numberToText.convertToText(parseInt(JSON.parse(localStorage.getItem("projectTicker") || 0))+1),
    description = "type project description here...",
    todoArr = [],
    storageId = "P" + Project.#projectTicker,
    createdDate = Date.now(),
  } = {}) {
    this.#title = title;
    this.#description = description;
    this.#todoArr = todoArr;
    this.#storageId = storageId;
    this.#createdDate = createdDate;
  }

  static get #projectTicker() {
    let x = parseInt(JSON.parse(localStorage.getItem("projectTicker") || 0));
    x++;
    localStorage.setItem("projectTicker", JSON.stringify(x));
    return x.toString();
  }

  static saveToLocalStorage(Project) {
    if (!storageAvailable) {
      return;
    }

    let data = {
      title: Project.#title,
      description: Project.#description,
      todoArr: Project.#todoArr,
      storageId: Project.#storageId,
      createdDate: Project.#createdDate,
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

  static updateIdArray(newIdArray) {
    localStorage.setItem("projectIdArray", JSON.stringify(newIdArray));
  }

  static retrieveTodos(projectId) {
    const todoIds = JSON.parse(localStorage.getItem(projectId)).todoArr;
    let todos = [];
    todoIds.forEach((id) => {
      todos.push(Todo.retrieveSingleFromLocalStorage(id))
    });
    return todos;
  }

  static retrieveSingleFromLocalStorage(storageId) {
    if (!storageAvailable) {
      return;
    }

    let projectIdArray = [];
    Project.#makeDefaultIfNull();
    projectIdArray = Array.from(
      JSON.parse(localStorage.getItem("projectIdArray"))
    );

    if (projectIdArray.includes(storageId)) {
      let storedInfo = JSON.parse(localStorage.getItem(storageId));
      return new Project(storedInfo);
    }
  }

  static retrieveAllFromLocalStorage() {
    if (!storageAvailable) {
      return;
    }

    let projectIdArray = [];
    Project.#makeDefaultIfNull();
    projectIdArray = Array.from(
      JSON.parse(localStorage.getItem("projectIdArray"))
    );

    let projects = [];
    projectIdArray.forEach((storageId) => {
      projects.push(new Project(JSON.parse(localStorage.getItem(storageId))));
    });
    return projects;
  }

  static #makeDefaultIfNull() {
    if (localStorage.getItem("projectIdArray") == null) {
      let defaultProject = new Project();
      defaultProject.title = "Default Project";
      defaultProject.description = "This is the default project";
      Project.saveToLocalStorage(defaultProject);
    }
  }

  static addTodo(projectId, todoID) {
    const pj = Project.retrieveSingleFromLocalStorage(projectId)
    console.log(projectId, pj)
    if (!pj.todoArr.includes(todoID)) {
      pj.todoArr.push(todoID)
      Project.saveToLocalStorage(pj)
    }

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

  get createdDate() {
    return format(this.#createdDate, "dd-MMM-yy hh:mm:ss");
  }
}
