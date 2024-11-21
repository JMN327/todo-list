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

  constructor({
    title = "Untitled",//numberToText.convertToText(parseInt(JSON.parse(localStorage.getItem("todoTicker") || 0)) + 1),
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

  static saveToLocalStorage(Todo, projectID) {
    let data = {
      title: Todo.#title,
      description: Todo.#description,
      dueDate: format(Todo.#dueDate, "dd-MMM-yyyy"),
      priority: Todo.#priority,
      completed: Todo.#completed,
      project: Todo.#project,
      storageId: Todo.#storageId,
      createdDate: Todo.#createdDate,
    };

    if (!storageAvailable) {
      return;
    }

    //check if array of keys are being stored in todoIdArray and initiate them if not
    if (localStorage.getItem("todoIdArray") == null) {
      localStorage.setItem("todoIdArray", "[]");
    }

    //retrieve todoIdArray
    let todoIdArray = Array.from(
      JSON.parse(localStorage.getItem("todoIdArray"))
    );

    // check if this todo already exists in storage.  If not add it to todoIdArray
    if (!todoIdArray.includes(Todo.#storageId)) {
      todoIdArray.push(Todo.#storageId);
      localStorage.setItem("todoIdArray", JSON.stringify(todoIdArray));
    }

    // write the todo data to storage
    localStorage.setItem(Todo.#storageId, JSON.stringify(data));

    Project.addTodo(projectID, Todo.#storageId)

  }

  static retrieveSingleFromLocalStorage(storageId) {
    if (!storageAvailable) {
      return;
    }

    let todoIdArray = [];
    Todo.#makeDefaultIfNull();
    todoIdArray = Array.from(JSON.parse(localStorage.getItem("todoIdArray")));

    if (todoIdArray.includes(storageId)) {
      let storedInfo = JSON.parse(localStorage.getItem(storageId));
      return new Todo(storedInfo);
    }
  }

  static retrieveAllFromLocalStorage() {
    if (!storageAvailable) {
      return;
    }

    let todoIdArray = [];
    Todo.#makeDefaultIfNull();
    todoIdArray = Array.from(JSON.parse(localStorage.getItem("todoIdArray")));

    let todos = [];
    todoIdArray.forEach((storageId) => {
      todos.push(new Todo(JSON.parse(localStorage.getItem(storageId))));
    });
    return todos;
  }

  static deleteTodoInLocalStorage(tdId, pjId) {
    console.log("deleting " + tdId)
    const todoIdArray = Array.from(
      JSON.parse(localStorage.getItem("todoIdArray"))
    );
    if (!todoIdArray.includes(tdId)) {
      return;
    }
    todoIdArray.splice(todoIdArray.indexOf(tdId), 1);
    localStorage.removeItem(tdId);
    localStorage.setItem("todoIdArray", JSON.stringify(todoIdArray));
    Project.removeTodoFromProjectsTodoArray(tdId, pjId)
  }

  static #makeDefaultIfNull() {
    if (localStorage.getItem("todoIdArray") == null) {
      let defaultTodo = new Todo();
      defaultTodo.title = "Default Todo";
      defaultTodo.project = "P1"
      defaultTodo.description = "This is the default todo";
      Todo.saveToLocalStorage(defaultTodo);
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

  set project(newProjectID) {
    //remove the todo from previous project todoArr...
    const oldProject = Project.retrieveSingleFromLocalStorage(this.#project)
    oldProject.todoArr.filter(x => x !== this.#storageId)
    Project.saveToLocalStorage(oldProject)
    //add to new project todoArr
    const newProject = Project.retrieveSingleFromLocalStorage(newProjectID)
    if (newProject == undefined) {
      throw new Error ("that project doesn't exist")
    }
    newProject.todoArr.push(this.#storageId)
    Project.saveToLocalStorage(newProject)

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
