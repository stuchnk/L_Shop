import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { Select } from "@/components/ui/Select";
import * as scheduleApi from "@/api/schedule";
import * as subjectsApi from "@/api/subjects";
import * as classesApi from "@/api/classes";
import * as usersApi from "@/api/users";
import type { ScheduleEntry, Subject, SchoolClass, User } from "@/types";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const TIMES = [
  "08:30",
  "09:25",
  "10:30",
  "11:25",
  "12:20",
  "13:25",
  "14:20",
  "15:15",
];

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      scheduleApi.listSchedule(),
      subjectsApi.listSubjects(),
      classesApi.listClasses(),
      usersApi.listUsers("teacher"),
    ]).then(([sc, su, cl, te]) => {
      setSchedule(sc);
      setSubjects(su);
      setClasses(cl);
      setTeachers(te);
      if (user.role === "student" && user.classId) setClassFilter(user.classId);
      else if (cl.length) setClassFilter(cl[0].id);
      setLoading(false);
    });
  }, [user]);

  const visible = useMemo(() => {
    let res = schedule;
    if (user?.role === "student" && user.classId) res = res.filter((s) => s.classId === user.classId);
    else if (user?.role === "teacher") res = res.filter((s) => s.teacherId === user.id);
    else if (classFilter) res = res.filter((s) => s.classId === classFilter);
    return res;
  }, [schedule, user, classFilter]);

  if (loading) return <Loader />;

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const classMap = new Map(classes.map((c) => [c.id, c]));

  const maxLesson = Math.max(6, ...visible.map((s) => s.lessonNumber));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Расписание</h1>
          <p>
            {user?.role === "student" && user.classId
              ? `Класс ${classMap.get(user.classId)?.name ?? ""}`
              : user?.role === "teacher"
              ? "Ваши занятия"
              : "Школьное расписание занятий"}
          </p>
        </div>

        {user?.role === "admin" && (
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <Select
              label="Класс"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              options={classes.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
        )}
      </div>

      <div
        className="schedule"
        style={{ gridTemplateColumns: `90px repeat(${DAYS.length}, 1fr)` }}
      >
        <div className="schedule__head">№ / время</div>
        {DAYS.map((d) => (
          <div className="schedule__head" key={d}>
            {d}
          </div>
        ))}

        {Array.from({ length: maxLesson }).map((_, i) => {
          const lesson = i + 1;
          return (
            <Row
              key={lesson}
              lesson={lesson}
              time={TIMES[i] ?? ""}
              days={DAYS.length}
              schedule={visible}
              subjectMap={subjectMap}
              teacherMap={teacherMap}
              role={user?.role}
            />
          );
        })}
      </div>
    </>
  );
}

function Row({
  lesson,
  time,
  days,
  schedule,
  subjectMap,
  teacherMap,
  role,
}: {
  lesson: number;
  time: string;
  days: number;
  schedule: ScheduleEntry[];
  subjectMap: Map<string, Subject>;
  teacherMap: Map<string, User>;
  role?: string;
}) {
  return (
    <>
      <div className="schedule__time">
        <strong>{lesson}</strong>
        <br />
        {time}
      </div>
      {Array.from({ length: days }).map((_, i) => {
        const day = (i + 1) as 1 | 2 | 3 | 4 | 5 | 6;
        const item = schedule.find((s) => s.dayOfWeek === day && s.lessonNumber === lesson);
        if (!item) return <div key={day} className="schedule__cell schedule__cell--empty" />;
        const subject = subjectMap.get(item.subjectId);
        const teacher = teacherMap.get(item.teacherId);
        return (
          <div key={day} className="schedule__cell">
            <span className="schedule__subject">{subject?.name ?? "—"}</span>
            <span className="schedule__meta">
              {role !== "student" && teacher && <>{teacher.lastName} {teacher.firstName[0]}. · </>}
              каб. {item.room ?? "—"}
            </span>
          </div>
        );
      })}
    </>
  );
}
