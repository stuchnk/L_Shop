import type { AuthResponse, LoginPayload, User } from "@/types";
import { request, USE_MOCKS, getToken } from "./client";
import { delay, store } from "@/mocks/data";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (!USE_MOCKS) return request<AuthResponse>("/auth/login", { method: "POST", body: payload });

  const user = store.users.find(
    (u) =>
      u.email.toLowerCase() === payload.email.toLowerCase() &&
      (!payload.role || u.role === payload.role)
  );
  if (!user) throw new Error("Пользователь не найден");
  if (store.passwords[user.email] !== payload.password)
    throw new Error("Неверный пароль");
  return delay({ token: `mock-${user.id}`, user });
}

export async function me(): Promise<User> {
  if (!USE_MOCKS) return request<User>("/auth/me");
  const token = getToken();
  if (!token) throw new Error("Не авторизован");
  const id = token.replace("mock-", "");
  const u = store.users.find((u) => u.id === id);
  if (!u) throw new Error("Не авторизован");
  return delay(u, 80);
}

export async function logout(): Promise<void> {
  if (!USE_MOCKS) return request<void>("/auth/logout", { method: "POST" });
  return delay(undefined, 60);
}
