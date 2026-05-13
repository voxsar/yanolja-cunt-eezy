import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  checkIn,
  checkOut,
  cancelReservation
} from '../controllers/reservation.controller';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllReservations);
router.get('/:id', getReservationById);
router.post('/', authorize('admin', 'manager', 'front_desk'), createReservation);
router.put('/:id', authorize('admin', 'manager', 'front_desk'), updateReservation);
router.post('/:id/checkin', authorize('admin', 'manager', 'front_desk'), checkIn);
router.post('/:id/checkout', authorize('admin', 'manager', 'front_desk'), checkOut);
router.post('/:id/cancel', authorize('admin', 'manager', 'front_desk'), cancelReservation);

export default router;
