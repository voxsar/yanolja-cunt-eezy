import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
} from '../controllers/guest.controller';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllGuests);
router.get('/:id', getGuestById);
router.post('/', authorize('admin', 'manager', 'front_desk'), createGuest);
router.put('/:id', authorize('admin', 'manager', 'front_desk'), updateGuest);
router.delete('/:id', authorize('admin', 'manager'), deleteGuest);

export default router;
