// // services/task.js
// import * as modelTask from '../model/task';
// import type { ITask } from '../interface/task';

// export const getTasks = () => {
//   try {
//     const data = modelTask.getTasks();
//     return { success: true, data };
//   } catch (error) {
//     return { success: false, error: 'Error retrieving tasks.' };
//   }
// };

// export const createTask = (task: ITask) => {
//   try {
//     modelTask.addTask(task);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: 'Error creating task.' };
//   }
// };

// export const editTask = (updatedTask: Task) => {
//   try {
//     modelTask.editTask(updatedTask);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: 'Error updating task.' };
//   }
// };

// export const deleteTask = (taskId: string) => {
//   try {
//     modelTask.deleteTask(taskId);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: 'Error deleting task.' };
//   }
// };
import { ITask } from '../interface/task';
import TaskModel from '../model/task';

export const getAll = async () => {
  const data = await TaskModel.getAll();

  return data;
};

export const getById = async (id: number) => {
  const data = await TaskModel.getById(id);

  return data;
};

export const create = async (task: ITask) => {
  const newTask = await TaskModel.create(task);

  return newTask;
};

export const update = async (id: number, body: any) => {
  const task = await TaskModel.getById(id);

  await TaskModel.update(id, body);

  const updatedTask = await TaskModel.getById(id);

  return updatedTask;
};

export const deleteTask = async (id: number) => {
  const task = await TaskModel.getById(id);

  await TaskModel.delete(id);
};
