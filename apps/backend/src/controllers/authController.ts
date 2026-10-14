import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { createUser, comparePassword, issueTokens } from '../services/authService';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { env } from '../config/env';

import jwt from 'jsonwebtoken';


const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production' || env.nodeEnv === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction, // Production me HTTPS ke liye true
    sameSite: isProduction ? 'none' : 'lax', // Cross-domain (Vercel <-> Render) ke liye 'none' zaroori hai
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // Cross-domain ke liye 'none' zaroori hai
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {

    console.log("Register API called");

    const parsed = registerSchema.safeParse(req.body);

    console.log("Validation:", parsed.success);
  console.log("Register API called");

  console.log("Email:", req.body.email);
  console.log("Password:", req.body.password);

  
    if (!parsed.success) {

      console.log("Validation failed:", parsed.error.issues);

      res.status(400).json(sendError('Validation failed', parsed.error.issues.map((issue) => issue.message)));

      return;
    }

    console.log("Validation passed");
    console.log("Creating user...");

    const user = await createUser(parsed.data);

    console.log("User created:", user._id);

    const { accessToken, refreshToken } = issueTokens(user);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json(
      sendSuccess('Registration successful. Please verify your email.', {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      })
    );
  } catch (error) {
    console.log("Register Error:", error);
    next(error);
  }
};




export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(sendError('Validation failed', parsed.error.issues.map((issue) => issue.message)));
      return;
    }

    const email = parsed.data.email.toLowerCase().trim();
    console.log("👉 Login attempt for email:", email);

    // Explicitly select password field to avoid undefined
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log("❌ User not found with email:", email);
      res.status(404).json(sendError('Invalid credentials'));
      return;
    }

    console.log("👉 User found:", user.email);
    console.log("👉 Password from DB exists?:", Boolean(user.password));
    console.log("👉 Incoming plain password exists?:", Boolean(parsed.data.password));

    const validPassword = await comparePassword(parsed.data.password, user.password);
    console.log("👉 Password match result:", validPassword);

    if (!validPassword) {
      console.log("❌ Password comparison failed!");
      res.status(401).json(sendError('Invalid credentials'));
      return;
    }

    const { accessToken, refreshToken } = issueTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json(
      sendSuccess('Login successful', {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      })
    );
  } catch (error) {
    console.error("❌ Login Server Error:", error);
    next(error);
  }
};


export const logout = async (_req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production' || env.nodeEnv === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/'
  };

  // बिलकुल उन्हीं ऑप्शन्स के साथ डिलीट करें ताकि क्रॉस-डोमेन कुकी क्लियर हो सके
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  res.status(200).json(sendSuccess('Logged out successfully'));
};

export const refreshToken = async (req: Request, res: Response) => {
  const refresh = req.cookies?.refreshToken;

  if (!refresh) {
    res.status(401).json(sendError('Refresh token required'));
    return;
  }

  try {
    const payload = jwt.verify(refresh, env.jwtRefreshSecret) as {
      id: string;
      email: string;
      role: any;
    };

    const user = await User.findById(payload.id);

    if (!user || user.status === 'BLOCKED') {
      res.status(401).json(sendError('Invalid session or user inactive'));
      return;
    }

    const tokens = issueTokens(user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json(
      sendSuccess('Token refreshed', { accessToken: tokens.accessToken })
    );
  } catch (error) {
    res.status(401).json(sendError('Invalid or expired refresh token'));
  }
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json(sendError('Authentication required'));
    return;
  }

  const currentUser = await User.findById(user.id).select('-password');
  res.status(200).json(sendSuccess('Current user retrieved', currentUser));
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(sendError('Validation failed', parsed.error.issues.map((issue) => issue.message)));
      return;
    }

    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (!user) {
      res.status(404).json(sendError('No account found for that email'));
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    res.status(200).json(sendSuccess('Password reset link generated', { token }));
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(sendError('Validation failed', parsed.error.issues.map((issue) => issue.message)));
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: parsed.data.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400).json(sendError('Invalid or expired token'));
      return;
    }

    user.password = await bcrypt.hash(parsed.data.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json(sendSuccess('Password reset successful'));
  } catch (error) {
    next(error);
  }
};
