import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { createProject, getProjects } from '../controllers/projectController';

const router = Router();

router.get('/', protect, getProjects);
router.post('/', protect, authorize('BRAND'), createProject);

export default router;
