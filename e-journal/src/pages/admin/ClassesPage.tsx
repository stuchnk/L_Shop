import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";
import * as classesApi from "@/api/classes";
import * as usersApi from "@/api/users";
import type { SchoolClass, User } from "@/types";

const EMPTY: Omit<SchoolClass, "id"> = {
  name: "",
  year: 10,
  homeroomTeacherId: undefined,
  studentIds: [],
};

export default function ClassesPage() {
  const [items, setItems] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(SchoolClass | (Omit<SchoolClass, "id"> & { id?: string })) | null>(null);

  const reload = () => {
    setLoading(true);
    Promise.all([
      classesApi.listClasses(),
      usersApi.listUsers("teacher"),
      usersApi.listUsers("student"),
    ]).then(([c, t, s]) => {
      setItems(c);
      setTeachers(t);
      setStudents(s);
      setLoading(false);
    });
  };
  useEffect(reload, []);

  async function save() {
    if (!editing) return;
    if ("id" in editing && editing.id) await classesApi.updateClass(editing.id, editing);
    else await classesApi.createClass(editing);
    setEditing(null);
    reload();
  }

  async function remove(id: string) {
    if (!confirm("Удалить класс?")) return;
    await classesApi.deleteClass(id);
    reload();
  }

  if (loading) return <Loader />;

  const teacherMap = new Map(teachers.map((t) => [t.id, t]));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Классы</h1>
          <p>Управление классами, классными руководителями и составами.</p>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY })}>+ Добавить класс</Button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Класс</th>
              <th>Параллель</th>
              <th>Кл. руководитель</th>
              <th>Учеников</th>
              <th style={{ textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="empty">Нет классов</td></tr>
            )}
            {items.map((c) => {
              const t = c.homeroomTeacherId ? teacherMap.get(c.homeroomTeacherId) : null;
              return (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.year}</td>
                  <td>{t ? `${t.lastName} ${t.firstName} ${t.middleName ?? ""}` : <span className="muted">не назначен</span>}</td>
                  <td><Badge variant="primary">{c.studentIds.length}</Badge></td>
                  <td className="table__actions">
                    <Button size="sm" variant="ghost" onClick={() => setEditing({ ...c })}>Изменить</Button>
                    <Button size="sm" variant="danger" onClick={() => remove(c.id)}>Удалить</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={editing !== null}
        title={editing && "id" in editing && editing.id ? "Редактирование класса" : "Новый класс"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Отмена</Button>
            <Button onClick={save}>Сохранить</Button>
          </>
        }
      >
        {editing && (
          <>
            <div className="grid-2">
              <Input
                label="Название (например, 10А)"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
              <Input
                label="Параллель"
                type="number"
                value={editing.year}
                onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })}
              />
            </div>
            <Select
              label="Классный руководитель"
              value={editing.homeroomTeacherId ?? ""}
              onChange={(e) => setEditing({ ...editing, homeroomTeacherId: e.target.value || undefined })}
              options={[
                { value: "", label: "— не назначен —" },
                ...teachers.map((t) => ({ value: t.id, label: `${t.lastName} ${t.firstName}` })),
              ]}
            />
            <div className="field">
              <label className="field__label">Состав класса</label>
              <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {students.map((s) => (
                  <label key={s.id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={editing.studentIds.includes(s.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const next = checked
                          ? [...editing.studentIds, s.id]
                          : editing.studentIds.filter((id) => id !== s.id);
                        setEditing({ ...editing, studentIds: next });
                      }}
                    />
                    {s.lastName} {s.firstName}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
