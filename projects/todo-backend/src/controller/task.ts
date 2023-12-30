// controllers/taskController.js
import { Request, Response } from 'express';
import * as taskService from '../service/task';

export const getTasks = (req: Request, res: Response) => {
  const result = taskService.getTasks();

  if (result.success) {
    return res.json({
      success: true,
      data: result.data,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: result.error || 'Problem fetching tasks.',
    });
  }
};

export const createTask = (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Check if required data is present
    if (!data || !data.title) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Task title is required.',
      });
    }

    const result = taskService.createTask(data);

    if (result.success) {
      return res.json({
        success: true,
        message: 'Task created.',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.error || 'Cannot create task',
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const editTask = (req: Request, res: Response) => {
  try {
    const updatedTaskData = req.body;
    const taskId = req.params.id;

    if (!taskId || !updatedTaskData) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid request. Task ID and updated task data are required.',
      });
    }

    const result = taskService.editTask({
      id: taskId,
      ...updatedTaskData,
    });

    if (result.success) {
      return res.json({
        success: true,
        message: 'Task updated.',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.error || 'Cannot update task',
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating task',
    });
  }
};

export const deleteTask = (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    console.log('Controller, ', taskId);

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Task ID is required.',
      });
    }

    const result = taskService.deleteTask(taskId);

    if (result.success) {
      return res.json({
        success: true,
        message: 'Task deleted.',
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.error || 'Task not found.',
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      message: 'Cannot delete task',
    });
  }
};
