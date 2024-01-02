import { Router } from 'express';

import {
  createTask,
  getTasks,
  editTask,
  deleteTask,
} from '../controller/task';

import { validateReqQuery } from '../middleware/validator';
import { taskSchema } from '../schema/task';

const router = Router();

router.get('/', getTasks);

router.post('/', validateReqQuery(taskSchema), createTask);

router.put('/:id', validateReqQuery(taskSchema), editTask);

router.delete('/:id', deleteTask);

export default router;
