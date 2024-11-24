import Project from "./Project.js";
import { format } from "date-fns";
import storageAvailable from "./localStorage.js";
const numberToText = require("number-to-text");
require("number-to-text/converters/en-us");

export default class Todo {
  #title;
  #description;
  #dueDate;
  #priority;
  #completed;
  #project;
  #storageId;
  #createdDate;
  static #idArray = JSON.parse(localStorage.getItem("todoIdArray")) || [];

  constructor({
    title = "Untitled", //numberToText.convertToText(parseInt(JSON.parse(localStorage.getItem("todoTicker") || 0)) + 1),
    description = "Add description here",
    dueDate = null,
    priority = 1,
    completed = false,
    project = "P1",
    storageId = "T" + Todo.#todoTicker,
    createdDate = Date.now(),
  } = {}) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#completed = completed;
    this.#project = project;
    this.#storageId = storageId;
    this.#createdDate = createdDate;
  }

  static get #todoTicker() {
    let x = parseInt(JSON.parse(localStorage.getItem("todoTicker") || 0));
    x++;
    localStorage.setItem("todoTicker", JSON.stringify(x));
    return x.toString();
  }

  static #saveIdArrayToLocalStorage() {
    localStorage.setItem("todoIdArray", JSON.stringify(Todo.#idArray));
  }

  static saveToLocalStorage(td, pjId) {
    if (!storageAvailable) {
      return;
    }

    let tdData = {
      title: td.#title,
      description: td.#description,
      dueDate: td.#dueDate,
      priority: td.#priority,
      completed: td.#completed,
      project: td.#project,
      storageId: td.#storageId,
      createdDate: td.#createdDate,
    };
    // write the todo data to storage
    localStorage.setItem(td.#storageId, JSON.stringify(tdData));

    // check if this todo already exists in storage.  If not add it to todoIdArray
    if (!Todo.#idArray.includes(td.#storageId)) {
      Todo.#idArray.unshift(td.#storageId);
      Todo.#saveIdArrayToLocalStorage();
    }

    Project.linkTodo(pjId, td.#storageId);
  }

  static retrieveSingleFromLocalStorage(tdId) {
    if (!storageAvailable) {
      return;
    }

    if (Todo.#idArray.includes(tdId)) {
      let tdData = JSON.parse(localStorage.getItem(tdId));
      return new Todo(tdData);
    }
  }

  static retrieveAllFromLocalStorage() {
    if (!storageAvailable) {
      return;
    }
    let todoArray = [];
    Todo.#idArray.forEach((tdId) => {
      todoArray.push(new Todo(JSON.parse(localStorage.getItem(tdId))));
    });
    return todoArray;
  }

  static deleteTodoInLocalStorage(tdId, pjId) {
    if (!Todo.#idArray.includes(tdId)) {
      return;
    }
    Todo.#idArray.splice(Todo.#idArray.indexOf(tdId), 1);
    localStorage.removeItem(tdId);
    localStorage.setItem("todoIdArray", JSON.stringify(Todo.#idArray));
    Todo.#saveIdArrayToLocalStorage();
    Project.removeTodoFromTodoArray(tdId, pjId);
  }

  set title(newTitle) {
    newTitle = newTitle.trim();
    if (newTitle === "") {
      //throw "The name cannot be empty";
    }
    this.#title = newTitle;
  }

  get title() {
    return this.#title;
  }

  set description(newDescription) {
    newDescription = newDescription.trim();
    if (newDescription === "") {
      //throw "The name cannot be empty";
    }
    this.#description = newDescription;
  }

  get description() {
    return this.#description;
  }

  set dueDate(newDueDate) {
    if (!newDueDate) {
      this.#dueDate = null;
    } else {
      newDueDate = format(newDueDate, "dd-MMM-yyyy");
      this.#dueDate = newDueDate;
    }
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

  set project(newProjectID) {
    //remove the todo from previous project todoArr...
    const oldProject = Project.retrieveSingleFromLocalStorage(this.#project);
    oldProject.todoArr.filter((x) => x !== this.#storageId);
    Project.saveToLocalStorage(oldProject);
    //add to new project todoArr
    const newProject = Project.retrieveSingleFromLocalStorage(newProjectID);
    if (newProject == undefined) {
      throw new Error("that project doesn't exist");
    }
    newProject.todoArr.push(this.#storageId);
    Project.saveToLocalStorage(newProject);

    this.#project = newProjectID;
  }

  get project() {
    return this.#project;
  }

  get storageId() {
    return this.#storageId;
  }

  get createdDate() {
    return format(this.#createdDate, "dd-MMM-yy hh:mm:ss");
  }
}
