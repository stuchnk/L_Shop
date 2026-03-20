import { Request, Response } from 'express';
import {
  loginUserService,
  registerUserService,
} from '../../services/users/users.service';
import { COOKIE_NAME, COOKIE_MAX_AGE } from '../../constants/index';

const setAuthCookie = (res: Response, token?: string): void => {
  if (!token) return;
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,       // НЕ видна через document.cookie
    maxAge: COOKIE_MAX_AGE, // 10 минут
    sameSite: 'lax',
    path: '/',
  });
};

export const registerUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const result = await registerUserService(name, email, password);
    setAuthCookie(res, result.token);
    res.status(201).json(result);
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Ошибка регистрации',
    });
  }
};

export const loginUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await loginUserService(email, password);
    setAuthCookie(res, result.token);
    res.status(200).json(result);
  } catch (error: unknown) {
    res.status(401).json({
      message: error instanceof Error ? error.message : 'Ошибка авторизации',
    });
  }
};