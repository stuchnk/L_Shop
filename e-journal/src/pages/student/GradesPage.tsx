import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import * as gradesApi from "@/api/grades";
import * as subjectsApi from "@/api/subjects";
import type { Grade, Subject } from "@/types";

export default function StudentGradesPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([gradesApi.listGrades({ studentId: user.id }), subjectsApi.listSubjects()]).then(
      ([g, s]) => {
        setGrades(g);
        setSubjects(s);
        setLoading(false);
      }
    );
  }, [user]);

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  const grouped = useMemo(() => {
    const out: Record<string, Grade[]> = {};
    for (const g of grades) {
      if (subjectFilter && g.subjectId !== subjectFilter) continue;
      (out[g.subjectId] ??= []).push(g);
    }
    Object.values(out).forEach((arr) => arr.sort((a, b) => (a.date < b.date ? 1 : -1)));
    return out;
  }, [grades, subjectFilter]);

  if (loading) return <Loader />;

  const overall = avg(grades);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Мои оценки</h1>
          <p>Итоговый средний балл: <strong style={{ color: "var(--primary-700)" }}>{overall.toFixed(2)}</strong></p>
        </div>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <Select
            label="Предмет"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            options={[{ value: "", label: "Все предметы" }, ...subjects.map((s) => ({ value: s.id, label: s.name }))]}
          />
        </div>
      </div>

      {Object.keys(grouped).length === 0 && <div className="empty">Пока нет оценок.</div>}

      <div className="grid-2">
        {Object.entries(grouped).map(([sid, list]) => {
          const subject = subjectMap.get(sid);
          const a = avg(list);
          return (
            <Card
              key={sid}
              title={
                <span>
                  {subject?.name ?? "—"}
                </span>
              }
              action={
                <span className={`grade-pill ${a >= 4.5 ? "g-5" : a >= 3.5 ? "g-4" : a >= 2.5 ? "g-3" : "g-2"}`}>
                  {a.toFixed(1)}
                </span>
              }
            >
              <div className="grade-list">
                {list.map((g) => (
                  <div className="grade-row" key={g.id}>
                    <div>
                      <div className="grade-row__subject">{formatDate(g.date)}</div>
                      <div className="grade-row__meta">{g.comment ?? "—"}</div>
                    </div>
                    <Pill value={g.value} />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function avg(list: Grade[]): number {
  const nums: number[] = [];
  for (const g of list) if (typeof g.value === "number") nums.push(g.value);
  if (!nums.length) return 0;
  return nums.reduce((s, v) => s + v, 0) / nums.length;
}
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
function Pill({ value }: { value: Grade["value"] }) {
  if (value === "Н" || value === "") return <div className="grade-pill g-2">Н</div>;
  return <div className={`grade-pill g-${value}`}>{value}</div>;
}
