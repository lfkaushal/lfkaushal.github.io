import { ITask } from './Task';

interface ITaskList {
  list: ITask[];
  getTaskById: (id: string) => ITask | null;
  getTaskByIndex: (index: number) => ITask | null;
  addTask: (task: ITask) => ITask[];
  getTasks: () => ITask[];
}

class TaskList implements ITaskList {
  list: ITask[];

  /**
   * initialize list of tasks
   *
   * @param list list of tasks
   */
  constructor(list: ITask[]) {
    this.list = list;
  }

  getTaskById = (id: string) => {
    return this.list.find((item) => item.id === id) || null;
  };

  getTaskByIndex = (index: number) => {
    return this.list[index] || null;
  };

  /**
   * add a task to the list
   * @param task
   */
  addTask = (task: ITask) => {
    this.list.push(task);
    return this.list;
  };

  /**
   * get taks list
   *
   * @returns task list
   */
  getTasks = () => {
    return this.list;
  };
}

export default TaskList;
