import type { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { Proposal } from '../models/Proposal';
import { Payment } from '../models/Payment';
import { Review } from '../models/Review';
import { sendSuccess } from '../utils/apiResponse';

export const getBrandAccountSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brandId = (req as any).user?.id;
    const [projects, proposals, payments, reviews] = await Promise.all([
      Project.countDocuments({ brand: brandId }),
      Proposal.countDocuments({ project: { $in: await Project.find({ brand: brandId }).distinct('_id') } }),
      Payment.aggregate([{ $match: { brand: brandId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Review.countDocuments({ reviewer: brandId })
    ]);

    res.status(200).json(
      sendSuccess('Brand summary retrieved', {
        projects,
        proposals,
        totalSpend: payments[0]?.total || 0,
        reviews
      })
    );
  } catch (error) {
    next(error);
  }
};
