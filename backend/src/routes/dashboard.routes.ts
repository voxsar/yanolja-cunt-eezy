import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getDashboardStats, getOccupancyReport } from '../controllers/dashboard.controller';

const router = express.Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/occupancy-report', getOccupancyReport);

export default router;
