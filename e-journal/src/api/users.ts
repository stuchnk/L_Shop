import type { Role, User } from "@/types";
import { request, USE_MOCKS } from "./client";
import { delay, persist, store, uid } from "@/mocks/data";

export async function listUsers(role?: Role): Promise<User[]> {
  if (!USE_MOCKS) return request<User[]>("/users", { query: { role } });
  return delay(role ? store.users.filter((u) => u.role === role) : store.users);
}

export async function getUser(id: string): Promise<User> {
  if (!USE_MOCKS) return request<User>(`/users/${id}`);
  const u = store.users.find((u) => u.id === id);
  if (!u) throw new Error("Пользователь не найден");
  return delay(u);
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  if (!USE_MOCKS) return request<User>("/users", { method: "POST", body: data });
  const user: User = { ...data, id: uid("u") };
  store.users.push(user);
  store.passwords[user.email] = "123456";
  persist();
  return delay(user);
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  if (!USE_MOCKS) return request<User>(`/users/${id}`, { method: "PATCH", body: data });
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("Пользователь не найден");
  store.users[idx] = { ...store.users[idx], ...data };
  persist();
  return delay(store.users[idx]);
}

export async function deleteUser(id: string): Promise<void> {
  if (!USE_MOCKS) return request<void>(`/users/${id}`, { method: "DELETE" });
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx !== -1) store.users.splice(idx, 1);
  persist();
  return delay(undefined);
}
