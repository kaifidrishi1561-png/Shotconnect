import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import type { AuthTokenPayload, UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const tokenFromCookie = req.cookies?.accessToken || null;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required', errors: ['No token provided'] });
      return;
    }

    const payload = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found', errors: ['Invalid session'] });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token', errors: ['Unauthorized'] });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required', errors: ['Not authenticated'] });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden', errors: ['Insufficient permissions'] });
      return;
    }

    next();
  };
};
