import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import * as classesApi from "@/api/classes";
import * as subjectsApi from "@/api/subjects";
import * as usersApi from "@/api/users";
import * as attendanceApi from "@/api/attendance";
import * as scheduleApi from "@/api/schedule";
import type { Attendance, AttendanceStatus, ScheduleEntry, SchoolClass, Subject, User } from "@/types";

const STATUSES: { value: AttendanceStatus; label: string; short: string; cls: string }[] = [
  { value: "present", label: "Присутствовал", short: "+", cls: "present" },
  { value: "absent", label: "Отсутствовал", short: "Н", cls: "absent" },
  { value: "late", label: "Опоздал", short: "О", cls: "late" },
  { value: "excused", label: "По ув. причине", short: "У", cls: "excused" },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      classesApi.listClasses(),
      subjectsApi.listSubjects(),
      usersApi.listUsers("student"),
      scheduleApi.listSchedule({ teacherId: user.id }),
    ]).then(([c, s, st, sch]) => {
      setClasses(c);
      setSubjects(s);
      setStudents(st);
      setSchedule(sch);
      setClassId(sch[0]?.classId ?? c[0]?.id ?? "");
      setSubjectId(sch[0]?.subjectId ?? s[0]?.id ?? "");
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!classId || !subjectId) return;
    attendanceApi.listAttendance({ classId, subjectId, from: date, to: date }).then(setRecords);
  }, [classId, subjectId, date]);

  const classOptions = useMemo(() => {
    const ids = Array.from(new Set(schedule.map((s) => s.classId)));
    const list = classes.filter((c) => ids.includes(c.id));
    return (list.length ? list : classes).map((c) => ({ value: c.id, label: c.name }));
  }, [schedule, classes]);

  const subjectOptions = useMemo(() => {
    const ids = Array.from(new Set(schedule.map((s) => s.subjectId)));
    const list = subjects.filter((s) => ids.includes(s.id));
    return (list.length ? list : subjects).map((s) => ({ value: s.id, label: s.name }));
  }, [schedule, subjects]);

  if (loading) return <Loader />;

  const currentClass = classes.find((c) => c.id === classId);
  const classStudents = students.filter((s) => currentClass?.studentIds.includes(s.id));

  const recordFor = (studentId: string) => records.find((r) => r.studentId === studentId);

  async function setStatus(studentId: string, status: AttendanceStatus) {
    const existing = recordFor(studentId);
    const saved = await attendanceApi.upsertAttendance({
      id: existing?.id,
      studentId,
      classId,
      subjectId,
      date,
      status,
    });
    setRecords((prev) => {
      const others = prev.filter((r) => r.studentId !== studentId);
      return [...others, saved];
    });
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Посещаемость</h1>
          <p>Отметьте присутствие учеников на занятии.</p>
        </div>
      </div>

      <div className="toolbar">
        <Select label="Класс" value={classId} onChange={(e) => setClassId(e.target.value)} options={classOptions} />
        <Select label="Предмет" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} options={subjectOptions} />
        <Input label="Дата" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {classStudents.length === 0 ? (
        <div className="empty">В классе нет учеников.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ученик</th>
                <th style={{ width: 60 }}>+</th>
                <th style={{ width: 60 }}>Н</th>
                <th style={{ width: 60 }}>О</th>
                <th style={{ width: 60 }}>У</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((s) => {
                const cur = recordFor(s.id);
                return (
                  <tr key={s.id}>
                    <td><strong>{s.lastName} {s.firstName}</strong></td>
                    {STATUSES.map((st) => {
                      const active = cur?.status === st.value || (!cur && st.value === "present");
                      return (
                        <td key={st.value} style={{ padding: 0, textAlign: "center" }}>
                          <button
                            className={`attendance-cell ${active ? st.cls : ""}`}
                            style={{ padding: "10px 0", width: "100%" }}
                            onClick={() => setStatus(s.id, st.value)}
                            title={st.label}
                          >
                            {st.short}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
