import type { Request, Response, NextFunction } from 'express';
import { BrandProfile } from '../models/BrandProfile';
import { PhotographerProfile } from '../models/PhotographerProfile';
import { StylistProfile } from '../models/StylistProfile';
import { User } from '../models/User';
import { sendError, sendSuccess } from '../utils/apiResponse';

const buildUserSummary = (user: any) => ({
  id: user._id?.toString?.() ?? user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  avatar: user.avatar,
  location: user.location,
  role: user.role
});

export const getPhotographers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, category, minRating, experience } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof location === 'string' && location.trim()) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (typeof category === 'string' && category.trim()) {
      filter.$or = [
        { specializations: { $regex: category, $options: 'i' } },
        { photographyStyles: { $regex: category, $options: 'i' } }
      ];
    }

    if (typeof minRating === 'string') {
      filter.averageRating = { $gte: Number(minRating) };
    }

    if (typeof experience === 'string') {
      filter.experience = { $gte: Number(experience) };
    }

    const profiles = await PhotographerProfile.find(filter)
      .populate('user', 'firstName lastName email avatar location role')
      .sort({ averageRating: -1, experience: -1 })
      .lean();

    const payload = profiles.map((profile) => ({
      ...profile,
      user: profile.user ? buildUserSummary(profile.user as any) : null
    }));

    res.status(200).json(sendSuccess('Photographers retrieved', payload));
  } catch (error) {
    next(error);
  }
};

export const getPhotographerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await PhotographerProfile.findById(req.params.id).populate('user', 'firstName lastName email avatar location role').lean();
    if (!profile) {
      res.status(404).json(sendError('Photographer profile not found'));
      return;
    }

    res.status(200).json(sendSuccess('Photographer profile retrieved', {
      ...profile,
      user: profile.user ? buildUserSummary(profile.user as any) : null
    }));
  } catch (error) {
    next(error);
  }
};

export const upsertPhotographerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const data = req.body;

    const existing = await PhotographerProfile.findOne({ user: userId });
    if (existing) {
      existing.bio = data.bio ?? existing.bio;
      existing.location = data.location ?? existing.location;
      existing.experience = data.experience ?? existing.experience;
      existing.specializations = data.specializations ?? existing.specializations;
      existing.equipment = data.equipment ?? existing.equipment;
      existing.photographyStyles = data.photographyStyles ?? existing.photographyStyles;
      existing.pricing = data.pricing ?? existing.pricing;
      existing.availability = data.availability ?? existing.availability;
      existing.isVerified = data.isVerified ?? existing.isVerified;
      await existing.save();

      res.status(200).json(sendSuccess('Photographer profile updated', existing));
      return;
    }

    const profile = await PhotographerProfile.create({
      user: userId,
      ...data
    });

    res.status(201).json(sendSuccess('Photographer profile created', profile));
  } catch (error) {
    next(error);
  }
};

export const upsertBrandProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const existing = await BrandProfile.findOne({ user: userId });

    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      res.status(200).json(sendSuccess('Brand profile updated', existing));
      return;
    }

    const profile = await BrandProfile.create({
      user: userId,
      ...req.body
    });

    res.status(201).json(sendSuccess('Brand profile created', profile));
  } catch (error) {
    next(error);
  }
};

export const upsertStylistProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const existing = await StylistProfile.findOne({ user: userId });

    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      res.status(200).json(sendSuccess('Stylist profile updated', existing));
      return;
    }

    const profile = await StylistProfile.create({
      user: userId,
      ...req.body
    });

    res.status(201).json(sendSuccess('Stylist profile created', profile));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      res.status(404).json(sendError('User not found'));
      return;
    }

    let profile = null;
    if (user.role === 'PHOTOGRAPHER') {
      profile = await PhotographerProfile.findOne({ user: userId }).lean();
    }
    if (user.role === 'BRAND') {
      profile = await BrandProfile.findOne({ user: userId }).lean();
    }
    if (user.role === 'STYLIST') {
      profile = await StylistProfile.findOne({ user: userId }).lean();
    }

    res.status(200).json(sendSuccess('User profile retrieved', { user, profile }));
  } catch (error) {
    next(error);
  }
};
