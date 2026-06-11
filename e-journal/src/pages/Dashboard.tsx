import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Stat } from "@/components/ui/Stat";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";
import * as usersApi from "@/api/users";
import * as subjectsApi from "@/api/subjects";
import * as classesApi from "@/api/classes";
import * as gradesApi from "@/api/grades";
import * as scheduleApi from "@/api/schedule";
import type {
  Grade,
  ScheduleEntry,
  SchoolClass,
  Subject,
  User,
} from "@/types";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      usersApi.listUsers(),
      subjectsApi.listSubjects(),
      classesApi.listClasses(),
      gradesApi.listGrades(user.role === "student" ? { studentId: user.id } : {}),
      scheduleApi.listSchedule(
        user.role === "student" && user.classId
          ? { classId: user.classId }
          : user.role === "teacher"
          ? { teacherId: user.id }
          : {}
      ),
    ]).then(([u, s, c, g, sc]) => {
      setUsers(u);
      setSubjects(s);
      setClasses(c);
      setGrades(g);
      setSchedule(sc);
      setLoading(false);
    });
  }, [user]);

  if (loading || !user) return <Loader />;

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const today = new Date();
  const dow = ((today.getDay() + 6) % 7) + 1; // 1..7, пн=1
  const todaySchedule = schedule
    .filter((s) => s.dayOfWeek === dow)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Добрый день, {user.firstName}!</h1>
          <p>Краткая сводка по вашей учебной деятельности.</p>
        </div>
      </div>

      <div className="stat-grid">
        {user.role === "admin" && (
          <>
            <Stat label="Пользователей" value={users.length} hint={`Учеников: ${users.filter((u) => u.role === "student").length}`} icon="👥" />
            <Stat label="Преподавателей" value={users.filter((u) => u.role === "teacher").length} icon="📘" />
            <Stat label="Классов" value={classes.length} icon="🏫" />
            <Stat label="Предметов" value={subjects.length} icon="📚" />
          </>
        )}
        {user.role === "teacher" && (
          <>
            <Stat label="Мои предметы" value={(user.subjectIds ?? []).length} icon="📚" />
            <Stat label="Уроков на неделе" value={schedule.length} icon="🗓" />
            <Stat label="Учеников всего" value={users.filter((u) => u.role === "student").length} icon="🎓" />
            <Stat label="Оценок за период" value={grades.filter((g) => g.teacherId === user.id).length} icon="✏️" />
          </>
        )}
        {user.role === "student" && (
          <>
            <Stat
              label="Средний балл"
              value={avg(grades).toFixed(2)}
              hint="по всем предметам"
              icon="⭐"
            />
            <Stat label="Получено оценок" value={grades.filter((g) => typeof g.value === "number").length} icon="✏️" />
            <Stat label="Пропуски" value={grades.filter((g) => g.value === "Н").length} hint="отметок 'Н'" icon="⚠️" />
            <Stat label="Уроков сегодня" value={todaySchedule.length} icon="🗓" />
          </>
        )}
      </div>

      <div className="grid-2">
        <Card title="Расписание на сегодня" action={<Link to="/schedule" className="badge badge--primary">Перейти</Link>}>
          {todaySchedule.length === 0 ? (
            <div className="empty">Сегодня уроков нет 🎉</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {todaySchedule.map((sc) => (
                <div key={sc.id} className="schedule__cell" style={{ borderLeftWidth: 4 }}>
                  <span className="schedule__subject">
                    {sc.lessonNumber}. {subjectMap.get(sc.subjectId)?.name ?? "—"}
                  </span>
                  <span className="schedule__meta">
                    Кабинет {sc.room ?? "—"} · {DAYS[sc.dayOfWeek - 1]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title={user.role === "student" ? "Последние оценки" : "Последние действия"}>
          {user.role === "student" ? (
            grades.length === 0 ? (
              <div className="empty">Пока нет оценок.</div>
            ) : (
              <div className="grade-list">
                {grades
                  .slice()
                  .sort((a, b) => (a.date < b.date ? 1 : -1))
                  .slice(0, 6)
                  .map((g) => (
                    <div key={g.id} className="grade-row">
                      <div>
                        <div className="grade-row__subject">{subjectMap.get(g.subjectId)?.name ?? "—"}</div>
                        <div className="grade-row__meta">{formatDate(g.date)}</div>
                      </div>
                      <GradePill value={g.value} />
                    </div>
                  ))}
              </div>
            )
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Badge variant="primary">Система работает в штатном режиме</Badge>
              <p style={{ fontSize: 13 }}>
                Используйте боковое меню для перехода к разделам:
                {" "}
                {user.role === "admin"
                  ? "пользователи, предметы, классы."
                  : "мои классы, журнал оценок, посещаемость."}
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function avg(grades: Grade[]): number {
  const nums: number[] = [];
  for (const g of grades) if (typeof g.value === "number") nums.push(g.value);
  if (!nums.length) return 0;
  return nums.reduce((s, v) => s + v, 0) / nums.length;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function GradePill({ value }: { value: Grade["value"] }) {
  if (value === "Н" || value === "") {
    return <div className="grade-pill g-2">Н</div>;
  }
  return <div className={`grade-pill g-${value}`}>{value}</div>;
}
