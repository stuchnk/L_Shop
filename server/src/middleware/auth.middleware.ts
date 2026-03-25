import { Request, Response, NextFunction } from 'express';
import { COOKIE_NAME, COOKIE_MAX_AGE } from '../constants/index';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

const createToken = (userId: number, userEmail: string): string => {
  return Buffer.from(`${userId}:${userEmail}:${Date.now()}`).toString('base64');
};

const refreshAuthCookie = (
  res: Response,
  userId: number,
  userEmail: string
): void => {
  res.cookie(COOKIE_NAME, createToken(userId, userEmail), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  });
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token: string | undefined = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: 'Необходима авторизация' });
    return;
  }

  try {
    const decoded: string = Buffer.from(token, 'base64').toString('utf-8');
    const parts: string[] = decoded.split(':');

    if (parts.length < 3) {
      res.status(401).json({ message: 'Невалидный токен' });
      return;
    }

    const userId: number = parseInt(parts[0], 10);
    const userEmail: string = parts[1];
    const timestamp: number = parseInt(parts[2], 10);

    if (!userId || !userEmail || !timestamp) {
      res.status(401).json({ message: 'Невалидный токен' });
      return;
    }

    if (Date.now() - timestamp > COOKIE_MAX_AGE) {
      res.clearCookie(COOKIE_NAME, { path: '/' });
      res.status(401).json({ message: 'Сессия истекла' });
      return;
    }

    req.userId = userId;
    req.userEmail = userEmail;

    // Продлеваем сессию при активности пользователя.
    refreshAuthCookie(res, userId, userEmail);
    next();
  } catch {
    res.status(401).json({ message: 'Ошибка авторизации' });
  }
};
