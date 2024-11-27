import Todo from "./Todo.js";
import { format } from "date-fns";
import storageAvailable from "./localStorage.js";
const numberToText = require("number-to-text");
require("number-to-text/converters/en-us");

export default class Project {
  #title;
  #description;
  #todoArr = [];
  #storageId;
  #createdDate;
  static #idArray = JSON.parse(localStorage.getItem("projectIdArray")) || [];

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

  static #saveIdArrayToLocalStorage() {
    localStorage.setItem("projectIdArray", JSON.stringify(Project.#idArray));
  }

  static saveToLocalStorage(pj) {
    if (!storageAvailable) {
      return;
    }

    let pjData = {
      title: pj.title,
      description: pj.description,
      todoArr: pj.todoArr,
      storageId: pj.storageId,
      createdDate: pj.createdDate,
    };
    console.log("tda: " + pjData.todoArr + " " + pj.title);
    // write the project data to storage
    localStorage.setItem(pj.#storageId, JSON.stringify(pjData));

    // check if this project already exists in storage.  If not add it to projectIdArray
    if (!Project.#idArray.includes(pj.#storageId)) {
      Project.#idArray.unshift(pj.#storageId);
      Project.#saveIdArrayToLocalStorage();
    }
  }

  static replaceIdArray(newIdArray) {
    Project.#idArray = newIdArray;
    Project.#saveIdArrayToLocalStorage();
  }

  static retrieveTodos(pjId) {
    if (!pjId) {
      return [];
    }
    const todoIds = JSON.parse(localStorage.getItem(pjId)).todoArr;
    let todoArray = [];
    todoIds.forEach((tdId) => {
      todoArray.push(Todo.retrieveSingleFromLocalStorage(tdId));
    });
    return todoArray;
  }

  static retrieveSingleFromLocalStorage(pjId) {
    if (!storageAvailable) {
      return;
    }
    Project.#makeDefaultProject();

    if (Project.#idArray.includes(pjId)) {
      let pjData = JSON.parse(localStorage.getItem(pjId));
      return new Project(pjData);
    }
  }

  static retrieveAllFromLocalStorage() {
    if (!storageAvailable) {
      return;
    }
    Project.#makeDefaultProject();
    let projectArray = [];
    Project.#idArray.forEach((pjId) => {
      projectArray.push(new Project(JSON.parse(localStorage.getItem(pjId))));
    });
    return projectArray;
  }

  static deleteProjectInLocalStorage(pjId) {
    if (!Project.#idArray.includes(pjId)) {
      return;
    }
    //remove all todos from that project
    const todoIds = JSON.parse(localStorage.getItem(pjId)).todoArr;
    todoIds.forEach((tdId) => Todo.deleteTodoInLocalStorage(tdId, pjId));
    //remove the project
    Project.#idArray.splice(Project.#idArray.indexOf(pjId), 1);
    localStorage.removeItem(pjId);
    Project.#saveIdArrayToLocalStorage();
  }

  static removeTodoFromTodoArray(tdId, pjId) {
    console.log(`removing ${tdId} from ${pjId}`);
    const pj = Project.retrieveSingleFromLocalStorage(pjId);
    if (!pj.todoArr.includes(tdId)) {
      return;
    }
    pj.todoArr.splice(pj.todoArr.indexOf(tdId), 1);
    Project.saveToLocalStorage(pj);
  }

  static #makeDefaultProject() {
    if (Project.#idArray.length == 0) {
      console.log("making default project");
      let defaultProject = new Project();
      defaultProject.title = "Default Project";
      defaultProject.description = "This is the default project";
      Project.saveToLocalStorage(defaultProject);
      let secondPj = new Project();
      secondPj.title = "2nd";
      secondPj.description = "This is the 2nd project";
      Project.saveToLocalStorage(secondPj);
    }
  }

  static linkTodo(projectId, todoID) {
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
