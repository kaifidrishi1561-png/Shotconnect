import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import type { UserRole } from '../types';

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);

export const comparePassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

export const createUser = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}) => {
  const existing = await User.findOne({ email: payload.email.toLowerCase() });

  if (existing) {
    const error = new Error('User already exists') as Error & { statusCode?: number };
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(payload.password);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
    password: passwordHash,
    verificationToken,
    status: payload.role === 'ADMIN' ? 'ACTIVE' : 'PENDING'
  });

  return user;
};

export const issueTokens = (user: { _id: { toString(): string } | string; email: string; role: UserRole }) => {
  const id = typeof user._id === 'string' ? user._id : user._id.toString();
  const accessToken = signAccessToken({ id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id, email: user.email, role: user.role });

  return { accessToken, refreshToken };
};
