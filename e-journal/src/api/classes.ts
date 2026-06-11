import type { SchoolClass } from "@/types";
import { request, USE_MOCKS } from "./client";
import { delay, persist, store, uid } from "@/mocks/data";

export async function listClasses(): Promise<SchoolClass[]> {
  if (!USE_MOCKS) return request<SchoolClass[]>("/classes");
  return delay(store.classes);
}

export async function getClass(id: string): Promise<SchoolClass> {
  if (!USE_MOCKS) return request<SchoolClass>(`/classes/${id}`);
  const c = store.classes.find((c) => c.id === id);
  if (!c) throw new Error("Класс не найден");
  return delay(c);
}

export async function createClass(data: Omit<SchoolClass, "id">): Promise<SchoolClass> {
  if (!USE_MOCKS) return request<SchoolClass>("/classes", { method: "POST", body: data });
  const c: SchoolClass = { ...data, id: uid("c") };
  store.classes.push(c);
  persist();
  return delay(c);
}

export async function updateClass(id: string, data: Partial<SchoolClass>): Promise<SchoolClass> {
  if (!USE_MOCKS) return request<SchoolClass>(`/classes/${id}`, { method: "PATCH", body: data });
  const idx = store.classes.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Не найдено");
  store.classes[idx] = { ...store.classes[idx], ...data };
  persist();
  return delay(store.classes[idx]);
}

export async function deleteClass(id: string): Promise<void> {
  if (!USE_MOCKS) return request<void>(`/classes/${id}`, { method: "DELETE" });
  const idx = store.classes.findIndex((c) => c.id === id);
  if (idx !== -1) store.classes.splice(idx, 1);
  persist();
  return delay(undefined);
}
