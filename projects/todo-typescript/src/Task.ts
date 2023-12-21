import { ID_LENGTH } from './constants';
import { getRandomString } from './utils';

export interface ITask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  toggleCompleted: () => void;
  setCompleted: (complete: boolean) => void;
  getCompleted: () => boolean;
}

class Task implements ITask {
  id: string;
  title: string;
  description: string;
  completed: boolean;

  /**
   * initialize Task object
   *
   * @param title title of the task
   * @param description description of the task
   * @param completed status of the task
   */
  constructor(title: string, description: string, completed: boolean) {
    this.id = getRandomString(ID_LENGTH);
    this.title = title;
    this.description = description;
    this.completed = completed;
  }

  toggleCompleted = () => {
    this.completed = !this.completed;
  };

  setCompleted = (completed: boolean = true) => {
    this.completed = completed;
  };

  getCompleted = () => {
    return this.completed;
  };
}

export default Task;
