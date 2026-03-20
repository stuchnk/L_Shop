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

export const saveSession = (session: IUserSession): void => {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  window.dispatchEvent(new CustomEvent('auth:changed'));
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent('auth:changed'));
};

export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || '';
};

export const getUser = (): IUser | null => {
  const rawUser: string | null = localStorage.getItem(USER_KEY);

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
  const raw: string | null = localStorage.getItem(DELIVERY_KEY);

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