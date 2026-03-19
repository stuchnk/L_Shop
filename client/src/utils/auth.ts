export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IUserSession {
  token: string;
  user: IUser;
}

export interface IProfileDelivery {
  city: string;
  address: string;
  phone: string;
  comment: string;
}

const TOKEN_KEY = 'lshop_token';
const USER_KEY = 'lshop_user';
const DELIVERY_KEY = 'lshop_delivery';
const COOKIE_TOKEN_KEY = 'lshop_token';

const setCookie = (name: string, value: string, days = 7): void => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string => {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split('=')[1]) : '';
};

export const saveSession = (session: IUserSession): void => {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  setCookie(COOKIE_TOKEN_KEY, session.token);
  window.dispatchEvent(new CustomEvent('auth:changed'));
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  removeCookie(COOKIE_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent('auth:changed'));
};

export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || getCookie(COOKIE_TOKEN_KEY);
};

export const getUser = (): IUser | null => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as IUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return Boolean(getToken() && getUser());
};

export const saveDeliveryProfile = (data: IProfileDelivery): void => {
  localStorage.setItem(DELIVERY_KEY, JSON.stringify(data));
};

export const getDeliveryProfile = (): IProfileDelivery => {
  const raw = localStorage.getItem(DELIVERY_KEY);

  if (!raw) {
    return {
      city: '',
      address: '',
      phone: '',
      comment: '',
    };
  }

  try {
    return JSON.parse(raw) as IProfileDelivery;
  } catch {
    return {
      city: '',
      address: '',
      phone: '',
      comment: '',
    };
  }
};
