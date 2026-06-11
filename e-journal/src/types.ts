export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: Role;
  classId?: string; // для ученика
  subjectIds?: string[]; // для преподавателя
  avatarColor?: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  teacherIds: string[];
}

export interface SchoolClass {
  id: string;
  name: string; // например "10А"
  year: number;
  homeroomTeacherId?: string;
  studentIds: string[];
}

export type GradeValue = 2 | 3 | 4 | 5 | "Н" | "";

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  value: GradeValue;
  comment?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
}

export interface ScheduleEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6; // 1 = пн
  lessonNumber: number; // 1..8
  room?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: Role;
}

export interface ApiError {
  message: string;
  code?: string;
}
