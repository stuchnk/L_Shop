import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import * as classesApi from "@/api/classes";
import * as subjectsApi from "@/api/subjects";
import * as usersApi from "@/api/users";
import * as gradesApi from "@/api/grades";
import * as scheduleApi from "@/api/schedule";
import type { Grade, GradeValue, ScheduleEntry, SchoolClass, Subject, User } from "@/types";

const VALID: Record<string, GradeValue> = { "5": 5, "4": 4, "3": 3, "2": 2, "Н": "Н", "н": "Н", "": "" };

export default function GradebookPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");

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
      const firstClass = sch[0]?.classId ?? c[0]?.id ?? "";
      const firstSubject = sch[0]?.subjectId ?? user.subjectIds?.[0] ?? s[0]?.id ?? "";
      setClassId(firstClass);
      setSubjectId(firstSubject);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!classId || !subjectId) return;
    gradesApi.listGrades({ classId, subjectId }).then(setGrades);
  }, [classId, subjectId]);

  const myClassOptions = useMemo(() => {
    const ids = Array.from(new Set(schedule.map((s) => s.classId)));
    const list = classes.filter((c) => ids.includes(c.id));
    return (list.length ? list : classes).map((c) => ({ value: c.id, label: c.name }));
  }, [schedule, classes]);

  const mySubjectOptions = useMemo(() => {
    const ids = Array.from(new Set(schedule.map((s) => s.subjectId)));
    const list = subjects.filter((s) => ids.includes(s.id));
    return (list.length ? list : subjects).map((s) => ({ value: s.id, label: s.name }));
  }, [schedule, subjects]);

  // даты — последние 10 рабочих дней
  const dates = useMemo(() => {
    const arr: string[] = [];
    const d = new Date();
    while (arr.length < 10) {
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) {
        arr.unshift(d.toISOString().slice(0, 10));
      }
      d.setDate(d.getDate() - 1);
    }
    return arr;
  }, []);

  const currentClass = classes.find((c) => c.id === classId);
  const classStudents = students.filter((s) => currentClass?.studentIds.includes(s.id));

  const gradeFor = (studentId: string, date: string) =>
    grades.find((g) => g.studentId === studentId && g.date === date);

  async function setGrade(studentId: string, date: string, raw: string) {
    const norm = raw.trim();
    if (!(norm in VALID)) return;
    const value = VALID[norm];
    const existing = gradeFor(studentId, date);
    setSaving(true);
    try {
      if (value === "" && existing) {
        await gradesApi.deleteGrade(existing.id);
      } else if (value !== "") {
        const saved = await gradesApi.upsertGrade({
          id: existing?.id,
          studentId,
          subjectId,
          classId,
          teacherId: user!.id,
          date,
          value,
        });
        setGrades((prev) => {
          const others = prev.filter((g) => g.id !== saved.id && !(g.studentId === studentId && g.date === date));
          return [...others, saved];
        });
        return;
      }
      const fresh = await gradesApi.listGrades({ classId, subjectId });
      setGrades(fresh);
    } finally {
      setSaving(false);
    }
  }

  function average(studentId: string): string {
    const list = grades
      .filter((g) => g.studentId === studentId && typeof g.value === "number")
      .map((g) => g.value as number);
    if (!list.length) return "—";
    return (list.reduce((s, v) => s + v, 0) / list.length).toFixed(2);
  }

  if (loading) return <Loader />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Журнал оценок</h1>
          <p>Кликните по ячейке и введите оценку. Допустимы: 2, 3, 4, 5 или Н.</p>
        </div>
        {saving && <span className="muted">Сохранение…</span>}
      </div>

      <div className="toolbar">
        <Select label="Класс" value={classId} onChange={(e) => setClassId(e.target.value)} options={myClassOptions} />
        <Select label="Предмет" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} options={mySubjectOptions} />
        <div className="flex-1" />
        <Button variant="ghost" onClick={() => window.print()}>Печать</Button>
      </div>

      {classStudents.length === 0 ? (
        <div className="empty">В этом классе нет учеников.</div>
      ) : (
        <div className="gradebook">
          <table>
            <thead>
              <tr>
                <th className="student-cell" style={{ borderBottom: "1px solid var(--border)" }}>Ученик</th>
                {dates.map((d) => (
                  <th key={d}>{d.slice(8, 10)}.{d.slice(5, 7)}</th>
                ))}
                <th>Средн.</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((s) => (
                <tr key={s.id}>
                  <td className="student-cell">{s.lastName} {s.firstName}</td>
                  {dates.map((d) => {
                    const g = gradeFor(s.id, d);
                    const cls =
                      g?.value === 5 ? "g-5" :
                      g?.value === 4 ? "g-4" :
                      g?.value === 3 ? "g-3" :
                      g?.value === 2 ? "g-2" :
                      g?.value === "Н" ? "g-n" : "";
                    return (
                      <td key={d} className="grade-cell">
                        <input
                          className={`grade-input ${cls}`}
                          defaultValue={g?.value === "" || g?.value === undefined ? "" : String(g?.value)}
                          maxLength={1}
                          onBlur={(e) => {
                            const v = e.target.value;
                            if (v !== (g?.value ?? "").toString()) setGrade(s.id, d, v);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          }}
                        />
                      </td>
                    );
                  })}
                  <td style={{ fontWeight: 700, color: "var(--primary-700)" }}>{average(s.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
