import express from 'express';
import { login, register, getCurrentUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getCurrentUser);

export default router;
