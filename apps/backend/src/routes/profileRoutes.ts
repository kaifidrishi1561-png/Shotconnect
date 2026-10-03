import { Router } from 'express';
import { authorize, protect } from '../middleware/authMiddleware';
import {
  getCurrentUserProfile,
  getPhotographerProfile,
  getPhotographers,
  upsertBrandProfile,
  upsertPhotographerProfile,
  upsertStylistProfile
} from '../controllers/profileController';

const router = Router();

router.get('/photographers', getPhotographers);
router.get('/photographers/:id', getPhotographerProfile);
router.post('/photographers/profile', protect, authorize('PHOTOGRAPHER'), upsertPhotographerProfile);
router.put('/photographers/profile', protect, authorize('PHOTOGRAPHER'), upsertPhotographerProfile);

router.post('/brands/profile', protect, authorize('BRAND'), upsertBrandProfile);
router.put('/brands/profile', protect, authorize('BRAND'), upsertBrandProfile);

router.post('/stylists/profile', protect, authorize('STYLIST'), upsertStylistProfile);
router.put('/stylists/profile', protect, authorize('STYLIST'), upsertStylistProfile);

router.get('/me', protect, getCurrentUserProfile);

export default router;
