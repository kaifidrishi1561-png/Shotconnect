import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getPhotographers, getPhotographerProfile } from '../controllers/profileController';

const router = Router();

router.get('/', protect, getPhotographers);
router.get('/:id', protect, getPhotographerProfile);

export default router;
