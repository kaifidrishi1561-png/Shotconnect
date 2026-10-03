import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Payment } from '../models/Payment';

const router = Router();

router.get('/overview', protect, authorize('ADMIN'), async (_req, res, next) => {
  try {
    const [totalUsers, totalBrands, totalPhotographers, totalStylists, totalProjects, activeProjects, completedProjects, revenueStats] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'BRAND' }),
      User.countDocuments({ role: 'PHOTOGRAPHER' }),
      User.countDocuments({ role: 'STYLIST' }),
      Project.countDocuments(),
      Project.countDocuments({ status: { $in: ['OPEN', 'PROPOSALS_RECEIVED', 'PHOTOGRAPHER_SELECTED', 'PAYMENT_PENDING', 'CONFIRMED', 'SHOOTING', 'EDITING'] } }),
      Project.countDocuments({ status: 'COMPLETED' }),
      Payment.aggregate([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, revenue: { $sum: '$amount' }, commission: { $sum: '$platformFee' } } }
      ])
    ]);

    const revenue = revenueStats[0]?.revenue ?? 0;
    const platformCommission = revenueStats[0]?.commission ?? 0;

    res.json({
      success: true,
      message: 'Admin overview retrieved',
      data: {
        totalUsers,
        totalBrands,
        totalPhotographers,
        totalStylists,
        totalProjects,
        activeProjects,
        completedProjects,
        revenue,
        platformCommission
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
