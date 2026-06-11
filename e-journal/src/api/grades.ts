import type { Grade } from "@/types";
import { request, USE_MOCKS } from "./client";
import { delay, persist, store, uid } from "@/mocks/data";

export interface GradesFilter {
  studentId?: string;
  classId?: string;
  subjectId?: string;
  from?: string;
  to?: string;
}

export async function listGrades(filter: GradesFilter = {}): Promise<Grade[]> {
  if (!USE_MOCKS) return request<Grade[]>("/grades", { query: filter as Record<string, string> });
  let res = store.grades.slice();
  if (filter.studentId) res = res.filter((g) => g.studentId === filter.studentId);
  if (filter.classId) res = res.filter((g) => g.classId === filter.classId);
  if (filter.subjectId) res = res.filter((g) => g.subjectId === filter.subjectId);
  if (filter.from) res = res.filter((g) => g.date >= filter.from!);
  if (filter.to) res = res.filter((g) => g.date <= filter.to!);
  return delay(res);
}

export async function upsertGrade(data: Omit<Grade, "id"> & { id?: string }): Promise<Grade> {
  if (!USE_MOCKS)
    return data.id
      ? request<Grade>(`/grades/${data.id}`, { method: "PUT", body: data })
      : request<Grade>("/grades", { method: "POST", body: data });

  if (data.id) {
    const idx = store.grades.findIndex((g) => g.id === data.id);
    if (idx !== -1) {
      store.grades[idx] = { ...store.grades[idx], ...data } as Grade;
      persist();
      return delay(store.grades[idx]);
    }
  }
  const g: Grade = { ...(data as Omit<Grade, "id">), id: uid("g") };
  store.grades.push(g);
  persist();
  return delay(g);
}

export async function deleteGrade(id: string): Promise<void> {
  if (!USE_MOCKS) return request<void>(`/grades/${id}`, { method: "DELETE" });
  const idx = store.grades.findIndex((g) => g.id === id);
  if (idx !== -1) store.grades.splice(idx, 1);
  persist();
  return delay(undefined);
}
