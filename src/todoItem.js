import { format} from "date-fns";

export default class TodoItem {
  constructor(
    title = "",
    description = "",
    dueDate = null,
    priority = 0,
    completed = false,
    project = null
  ) {
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._completed = completed;
    this._project = project;
    this.info = function () {
      return (
        `title: ${this._title}
        description: ${this._description}
        due date: ${format(this._dueDate, "MMM/dd/yyyy")}
        priority: ${this._priority}
        project: ${this._project}
        completed: ` + (this._completed ? `Yes` : `no`)
      );
    };
  }
  set title(newTitle) {
    newTitle = newTitle.trim();
    if (newTitle === "") {
      throw "The name cannot be empty";
    }
    this._title = newTitle;
  }

  get title() {
    return this._title;
  }

  set description(newDescription) {
    newDescription = newDescription.trim();
    if (newDescription === "") {
      throw "The name cannot be empty";
    }
    this._description = newDescription;
  }

  get description() {
    return this._description;
  }

  set dueDate(newDueDate) {
    this._dueDate = newDueDate;
  }

  get dueDate() {
    return this._dueDate;
  }

  set priority(newPriority) {
    this._priority = newPriority;
  }

  get priority() {
    return this._priority;
  }

  set completed(newCompleted) {
    this._completed = newCompleted;
  }

  get completed() {
    return this._completed;
  }

  set project(newProject) {
    this._project = newProject;
  }

  get project() {
    return this._project;
  }
}

