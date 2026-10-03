import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { createUser, comparePassword, issueTokens } from '../services/authService';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { env } from '../config/env';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
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

    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (!user) {
      res.status(404).json(sendError('Invalid credentials'));
      return;
    }

    const validPassword = await comparePassword(parsed.data.password, user.password);
    if (!validPassword) {
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
    next(error);
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json(sendSuccess('Logged out successfully'));
};

export const refreshToken = async (req: Request, res: Response) => {
  const refresh = req.cookies.refreshToken;
  if (!refresh) {
    res.status(401).json(sendError('Refresh token required'));
    return;
  }

  try {
    const jwt = await import('jsonwebtoken');
    const payload = jwt.default.verify(refresh, env.jwtRefreshSecret) as { id: string; email: string; role: string };
    const user = await User.findById(payload.id);

    if (!user) {
      res.status(401).json(sendError('Invalid refresh token'));
      return;
    }

    const tokens = issueTokens(user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json(sendSuccess('Token refreshed', { accessToken: tokens.accessToken }));
  } catch (error) {
    res.status(401).json(sendError('Invalid refresh token'));
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
