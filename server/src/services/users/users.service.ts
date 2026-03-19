import fs from 'fs/promises';
import path from 'path';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface IAuthResponse {
  message: string;
  token?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const usersFilePath = path.resolve(process.cwd(), 'database', 'users.json');

const readUsers = async (): Promise<IUser[]> => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
};

const writeUsers = async (users: IUser[]): Promise<void> => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

const normalizeValue = (value: unknown): string => String(value ?? '').trim();

const normalizeEmail = (email: unknown): string =>
  normalizeValue(email).toLowerCase();

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const generateToken = (user: IUser): string => {
  return Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
};

export const registerUserService = async (
  name: string,
  email: string,
  password: string
): Promise<IAuthResponse> => {
  const trimmedName = normalizeValue(name);
  const normalizedEmail = normalizeEmail(email);
  const trimmedPassword = normalizeValue(password);

  if (!trimmedName || !normalizedEmail || !trimmedPassword) {
    throw new Error('Заполните все поля');
  }

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Некорректный email');
  }

  if (trimmedPassword.length < 6) {
    throw new Error('Пароль должен содержать минимум 6 символов');
  }

  const users = await readUsers();

  const existingUser = users.find(
    (user) => normalizeEmail(user.email) === normalizedEmail
  );

  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const newUser: IUser = {
    id: Date.now(),
    name: trimmedName,
    email: normalizedEmail,
    password: trimmedPassword,
  };

  users.push(newUser);
  await writeUsers(users);

  const token = generateToken(newUser);

  return {
    message: 'Регистрация успешна',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  };
};

export const loginUserService = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {
  const normalizedEmail = normalizeEmail(email);
  const trimmedPassword = normalizeValue(password);

  if (!normalizedEmail || !trimmedPassword) {
    throw new Error('Введите email и пароль');
  }

  const users = await readUsers();

  const user = users.find(
    (item) => normalizeEmail(item.email) === normalizedEmail
  );

  if (!user) {
    throw new Error('Пользователь с таким email не найден');
  }

  if (normalizeValue(user.password) !== trimmedPassword) {
    throw new Error('Неверный пароль');
  }

  const token = generateToken(user);

  return {
    message: 'Авторизация успешна',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
