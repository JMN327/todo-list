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
    title = "Untitled", //numberToText.convertToText(parseInt(JSON.parse(localStorage.getItem("projectTicker") || 0))+1),
    description = "Add description here",
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

    static saveToLocalStorage(pj) {
    if (!storageAvailable) {
      return;
    }

    let data = {
      title: pj.#title,
      description: pj.#description,
      todoArr: pj.#todoArr,
      storageId: pj.#storageId,
      createdDate: pj.#createdDate,
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
    if (!projectIdArray.includes(pj.#storageId)) {
      projectIdArray.push(pj.#storageId);
      localStorage.setItem("projectIdArray", JSON.stringify(projectIdArray));
    }

    // write the project data to storage
    localStorage.setItem(pj.#storageId, JSON.stringify(data));
  }

  static updateIdArray(newIdArray) {
    localStorage.setItem("projectIdArray", JSON.stringify(newIdArray));
  }

  static retrieveTodos(pjId) {
    if (!pjId) {
      return;      
    }
    const pj = JSON.parse(localStorage.getItem(pjId))
    const todoIds = Array.from(pj.todoArr);
    let todos = [];
    todoIds.forEach((id) => {
      todos.push(Todo.retrieveSingleFromLocalStorage(id));
    });
    return todos;
  }

  static retrieveSingleFromLocalStorage(pjId) {
    if (!storageAvailable) {
      return;
    }

    let projectIdArray = [];
    Project.#makeDefaultIfNull();
    projectIdArray = Array.from(
      JSON.parse(localStorage.getItem("projectIdArray"))
    );

    if (projectIdArray.includes(pjId)) {
      let storedInfo = JSON.parse(localStorage.getItem(pjId));
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

  static deleteProjectInLocalStorage(pjId) {
    console.log("deleting " + pjId)
    //get project array
    const projectIdArray = Array.from(
      JSON.parse(localStorage.getItem("projectIdArray"))
    );
    //check the storage ID given is in the array
    if (!projectIdArray.includes(pjId)) {
      return;
    }
    //remove all todos from that project
    const pj = JSON.parse(localStorage.getItem(pjId))
    const todoIds = Array.from(pj.todoArr);
    console.log("pj array for deleting " + todoIds)
    todoIds.forEach((tdId) => Todo.deleteTodoInLocalStorage(tdId, pjId))

    //remove the project
    projectIdArray.splice(projectIdArray.indexOf(pjId), 1);
    localStorage.removeItem(pjId);
    localStorage.setItem("projectIdArray", JSON.stringify(projectIdArray));
  }

  static removeTodoFromProjectsTodoArray(tdId, pjId) {
    console.log(`removing ${tdId} from project ID array`)
    //get project array
    const projectTodoArray = Array.from(
      JSON.parse(localStorage.getItem(pjId)).todoArr
    );

    //check the storage ID given is in the array
    if (!projectTodoArray.includes(tdId)) {
      return;
    }
    //remove  todos from the project Array
    projectTodoArray.splice(projectTodoArray.indexOf(tdId), 1);
    const pj = Project.retrieveSingleFromLocalStorage(pjId)
    pj.todoArr = projectTodoArray
    Project.saveToLocalStorage(pj)
    console.log(`new Id array ${projectTodoArray}`);
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
    const pj = Project.retrieveSingleFromLocalStorage(projectId);
    if (!pj.todoArr.includes(todoID)) {
      pj.todoArr.unshift(todoID);
      Project.saveToLocalStorage(pj);
    }
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
