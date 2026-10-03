import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { AuthTokenPayload } from '../types';

export const signAccessToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions['expiresIn'] });

export const signRefreshToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.jwtSecret) as AuthTokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.jwtRefreshSecret) as AuthTokenPayload;
