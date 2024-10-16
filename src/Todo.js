import { format } from "date-fns";
import storageAvailable from "./localStorage.js";

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
    title = "",
    description = "",
    dueDate = null,
    priority = 0,
    completed = false,
    project = "default",
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

  static saveToLocalStorage(Todo) {
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
  }

  static retrieveSingleFromLocalStorage(storageId) {

    if (!storageAvailable) {
      return;
    }

    let todoIdArray = [];
    if (localStorage.getItem("todoIdArray") == null) {
      throw "No Todos saved in Local Storage index";
    } else {
      todoIdArray = Array.from(JSON.parse(localStorage.getItem("todoIdArray")));
    }
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
    if (localStorage.getItem("todoIdArray") == null) {
      throw "No Todos saved in Local Storage index";
    } else {
      todoIdArray = Array.from(JSON.parse(localStorage.getItem("todoIdArray")));
    }
    let todos = [];
    todoIdArray.forEach((storageId) => {
      todos.push(new Todo(JSON.parse(localStorage.getItem(storageId))));
    });
    return todos;
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

  set project(newProject) {
    this.#project = newProject;
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
