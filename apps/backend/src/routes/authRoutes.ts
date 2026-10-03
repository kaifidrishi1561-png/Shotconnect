/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User created
 */
import { Router } from 'express';
import { register, login, logout, refreshToken, me, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
