import { Request, Response } from 'express';
import {
  loginUserService,
  registerUserService,
} from '../../services/users/users.service';

const setAuthCookie = (res: Response, token?: string) => {
  if (!token) return;

  res.setHeader(
    'Set-Cookie',
    `lshop_token=${token}; Path=/; Max-Age=604800; SameSite=Lax`
  );
};

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUserService(name, email, password);
    setAuthCookie(res, result.token);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Ошибка регистрации',
    });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUserService(email, password);
    setAuthCookie(res, result.token);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error.message : 'Ошибка авторизации',
    });
  }
};
