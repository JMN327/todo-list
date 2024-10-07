import { format } from "date-fns";

export default class Project {
  #title;
  #description;
  #dueDate;
  #priority;
  #completed;
  #todoArr;

  constructor(
    title = "",
    description = "",
    dueDate = null,
    priority = 0,
    completed = false,
    todoArr = []
  ) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#completed = completed;
    this.#todoArr = todoArr;
    this.jsonData = function () {
      /*       return `{"title":"${this.#title}","description":"${
        this.#description
      }","dueDate":"${format(this.#dueDate, "MMM/dd/yyyy")}","priority":"${
        this.#priority
      }","todoArr": "${this.#todoArr}","completed":"${this.#completed}"}`; */
      return {
        title: this.#title,
        description: this.#description,
        dueDate: this.#dueDate,
        priority: this.#priority,
        completed: this.#completed,
        todoArr: this.#todoArr,
      };
    };
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
}
