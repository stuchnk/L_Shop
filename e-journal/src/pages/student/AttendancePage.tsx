import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import * as attendanceApi from "@/api/attendance";
import * as subjectsApi from "@/api/subjects";
import type { Attendance, Subject } from "@/types";

const LABEL: Record<Attendance["status"], { label: string; variant: "success" | "danger" | "warning" | "primary" }> = {
  present: { label: "Присутствовал", variant: "success" },
  absent: { label: "Отсутствовал", variant: "danger" },
  late: { label: "Опоздал", variant: "warning" },
  excused: { label: "По ув. причине", variant: "primary" },
};

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      attendanceApi.listAttendance({ studentId: user.id }),
      subjectsApi.listSubjects(),
    ]).then(([r, s]) => {
      setRecords(r);
      setSubjects(s);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <Loader />;

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const total = records.length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const excused = records.filter((r) => r.status === "excused").length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Моя посещаемость</h1>
          <p>История ваших отметок на занятиях.</p>
        </div>
      </div>

      <div className="stat-grid">
        <Stat label="Записей" value={total} icon="📒" />
        <Stat label="Пропусков" value={absent} icon="⚠️" />
        <Stat label="Опозданий" value={late} icon="🕒" />
        <Stat label="По ув. причине" value={excused} icon="✅" />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Предмет</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr><td colSpan={3} className="empty">Нет записей.</td></tr>
            )}
            {records
              .slice()
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{subjectMap.get(r.subjectId)?.name ?? "—"}</td>
                  <td><Badge variant={LABEL[r.status].variant}>{LABEL[r.status].label}</Badge></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
