import type { Attendance } from "@/types";
import { request, USE_MOCKS } from "./client";
import { delay, persist, store, uid } from "@/mocks/data";

export interface AttendanceFilter {
  studentId?: string;
  classId?: string;
  subjectId?: string;
  from?: string;
  to?: string;
}

export async function listAttendance(filter: AttendanceFilter = {}): Promise<Attendance[]> {
  if (!USE_MOCKS) return request<Attendance[]>("/attendance", { query: filter as Record<string, string> });
  let res = store.attendance.slice();
  if (filter.studentId) res = res.filter((a) => a.studentId === filter.studentId);
  if (filter.classId) res = res.filter((a) => a.classId === filter.classId);
  if (filter.subjectId) res = res.filter((a) => a.subjectId === filter.subjectId);
  if (filter.from) res = res.filter((a) => a.date >= filter.from!);
  if (filter.to) res = res.filter((a) => a.date <= filter.to!);
  return delay(res);
}

export async function upsertAttendance(data: Omit<Attendance, "id"> & { id?: string }): Promise<Attendance> {
  if (!USE_MOCKS)
    return data.id
      ? request<Attendance>(`/attendance/${data.id}`, { method: "PUT", body: data })
      : request<Attendance>("/attendance", { method: "POST", body: data });

  if (data.id) {
    const idx = store.attendance.findIndex((a) => a.id === data.id);
    if (idx !== -1) {
      store.attendance[idx] = { ...store.attendance[idx], ...data } as Attendance;
      persist();
      return delay(store.attendance[idx]);
    }
  }
  const a: Attendance = { ...(data as Omit<Attendance, "id">), id: uid("a") };
  store.attendance.push(a);
  persist();
  return delay(a);
}
