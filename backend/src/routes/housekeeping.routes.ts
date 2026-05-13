import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getHouseStatus
} from '../controllers/housekeeping.controller';

const router = express.Router();

router.use(authenticate);

router.get('/tasks', getAllTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', authorize('admin', 'manager', 'housekeeping'), createTask);
router.put('/tasks/:id', authorize('admin', 'manager', 'housekeeping'), updateTask);
router.delete('/tasks/:id', authorize('admin', 'manager'), deleteTask);
router.get('/house-status', getHouseStatus);

export default router;
