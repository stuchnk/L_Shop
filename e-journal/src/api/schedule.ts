import type { ScheduleEntry } from "@/types";
import { request, USE_MOCKS } from "./client";
import { delay, persist, store, uid } from "@/mocks/data";

export async function listSchedule(filter: { classId?: string; teacherId?: string } = {}): Promise<ScheduleEntry[]> {
  if (!USE_MOCKS) return request<ScheduleEntry[]>("/schedule", { query: filter });
  let res = store.schedule.slice();
  if (filter.classId) res = res.filter((s) => s.classId === filter.classId);
  if (filter.teacherId) res = res.filter((s) => s.teacherId === filter.teacherId);
  return delay(res);
}

export async function upsertScheduleEntry(data: Omit<ScheduleEntry, "id"> & { id?: string }): Promise<ScheduleEntry> {
  if (!USE_MOCKS)
    return data.id
      ? request<ScheduleEntry>(`/schedule/${data.id}`, { method: "PUT", body: data })
      : request<ScheduleEntry>("/schedule", { method: "POST", body: data });

  if (data.id) {
    const idx = store.schedule.findIndex((s) => s.id === data.id);
    if (idx !== -1) {
      store.schedule[idx] = { ...store.schedule[idx], ...data } as ScheduleEntry;
      persist();
      return delay(store.schedule[idx]);
    }
  }
  const s: ScheduleEntry = { ...(data as Omit<ScheduleEntry, "id">), id: uid("sc") };
  store.schedule.push(s);
  persist();
  return delay(s);
}

export async function deleteScheduleEntry(id: string): Promise<void> {
  if (!USE_MOCKS) return request<void>(`/schedule/${id}`, { method: "DELETE" });
  const idx = store.schedule.findIndex((s) => s.id === id);
  if (idx !== -1) store.schedule.splice(idx, 1);
  persist();
  return delay(undefined);
}
