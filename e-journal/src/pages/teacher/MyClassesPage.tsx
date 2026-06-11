import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "react-router-dom";
import * as classesApi from "@/api/classes";
import * as usersApi from "@/api/users";
import * as scheduleApi from "@/api/schedule";
import * as subjectsApi from "@/api/subjects";
import type { ScheduleEntry, SchoolClass, Subject, User } from "@/types";

export default function MyClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      classesApi.listClasses(),
      usersApi.listUsers("student"),
      scheduleApi.listSchedule({ teacherId: user.id }),
      subjectsApi.listSubjects(),
    ]).then(([c, s, sc, su]) => {
      setClasses(c);
      setStudents(s);
      setSchedule(sc);
      setSubjects(su);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <Loader />;

  // классы, в которых преподаватель ведёт занятия
  const myClassIds = Array.from(new Set(schedule.map((s) => s.classId)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Мои классы</h1>
          <p>Классы, в которых вы ведёте занятия.</p>
        </div>
      </div>

      {myClasses.length === 0 && <div className="empty">Пока нет назначенных классов</div>}

      <div className="grid-3">
        {myClasses.map((c) => {
          const list = students.filter((s) => c.studentIds.includes(s.id));
          const mySubjects = Array.from(
            new Set(schedule.filter((sc) => sc.classId === c.id).map((sc) => sc.subjectId))
          );
          return (
            <Card
              key={c.id}
              title={
                <span>
                  Класс <strong>{c.name}</strong>
                </span>
              }
              action={<Badge variant="primary">{list.length} учеников</Badge>}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="muted" style={{ fontSize: 12 }}>
                  Ваши предметы в классе:
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {mySubjects.map((sid) => (
                    <Badge key={sid} variant="neutral">
                      {subjectMap.get(sid)?.name ?? "—"}
                    </Badge>
                  ))}
                </div>
                <div className="muted mt-12" style={{ fontSize: 12 }}>
                  Ученики:
                </div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: "var(--text)" }}>
                  {list.map((s) => (
                    <li key={s.id}>{s.lastName} {s.firstName}</li>
                  ))}
                </ul>
                <div className="mt-12">
                  <Link to="/teacher/gradebook" className="btn btn--secondary btn--sm" style={{ textDecoration: "none" }}>
                    Открыть журнал
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
