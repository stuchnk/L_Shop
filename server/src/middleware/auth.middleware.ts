import { Request, Response, NextFunction } from 'express';
import { COOKIE_NAME } from '../constants/index';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
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

    // Проверка истечения токена (10 минут)
    const TEN_MINUTES: number = 10 * 60 * 1000;
    if (Date.now() - timestamp > TEN_MINUTES) {
      res.clearCookie(COOKIE_NAME);
      res.status(401).json({ message: 'Сессия истекла' });
      return;
    }

    req.userId = userId;
    req.userEmail = userEmail;
    next();
  } catch {
    res.status(401).json({ message: 'Ошибка авторизации' });
  }
};