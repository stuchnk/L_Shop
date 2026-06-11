import type { Subject } from "@/types";
import { request, USE_MOCKS } from "./client";
import { delay, persist, store, uid } from "@/mocks/data";

export async function listSubjects(): Promise<Subject[]> {
  if (!USE_MOCKS) return request<Subject[]>("/subjects");
  return delay(store.subjects);
}

export async function createSubject(data: Omit<Subject, "id">): Promise<Subject> {
  if (!USE_MOCKS) return request<Subject>("/subjects", { method: "POST", body: data });
  const s: Subject = { ...data, id: uid("s") };
  store.subjects.push(s);
  persist();
  return delay(s);
}

export async function updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
  if (!USE_MOCKS) return request<Subject>(`/subjects/${id}`, { method: "PATCH", body: data });
  const idx = store.subjects.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Не найдено");
  store.subjects[idx] = { ...store.subjects[idx], ...data };
  persist();
  return delay(store.subjects[idx]);
}

export async function deleteSubject(id: string): Promise<void> {
  if (!USE_MOCKS) return request<void>(`/subjects/${id}`, { method: "DELETE" });
  const idx = store.subjects.findIndex((s) => s.id === id);
  if (idx !== -1) store.subjects.splice(idx, 1);
  persist();
  return delay(undefined);
}
