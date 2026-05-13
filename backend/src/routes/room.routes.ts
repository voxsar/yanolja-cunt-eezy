import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomAvailability
} from '../controllers/room.controller';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllRooms);
router.get('/availability', getRoomAvailability);
router.get('/:id', getRoomById);
router.post('/', authorize('admin', 'manager'), createRoom);
router.put('/:id', authorize('admin', 'manager', 'front_desk'), updateRoom);
router.delete('/:id', authorize('admin'), deleteRoom);

export default router;
