import { format } from "date-fns";

export default class Todo {
  #title;
  #description;
  #dueDate;
  #priority;
  #completed;
  #project;
  constructor(
    title = "",
    description = "",
    dueDate = null,
    priority = 0,
    completed = false,
    project = null
  ) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#completed = completed;
    this.#project = project;
    this.info = function () {
      return (
        `title: ${this.#title}
description: ${this.#description}
due date: ${format(this.#dueDate, "MMM/dd/yyyy")}
priority: ${this.#priority}
project: ${this.#project}
completed: ` + (this.#completed ? `Yes` : `no`)
      );
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

  set project(newProject) {
    this.#project = newProject;
  }

  get project() {
    return this.#project;
  }
}
