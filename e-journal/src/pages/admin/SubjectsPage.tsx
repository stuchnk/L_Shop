import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";
import * as subjectsApi from "@/api/subjects";
import * as usersApi from "@/api/users";
import type { Subject, User } from "@/types";

const EMPTY: Omit<Subject, "id"> = { name: "", description: "", teacherIds: [] };

export default function SubjectsPage() {
  const [items, setItems] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Subject | (Omit<Subject, "id"> & { id?: string })) | null>(null);

  const reload = () => {
    setLoading(true);
    Promise.all([subjectsApi.listSubjects(), usersApi.listUsers("teacher")]).then(([s, t]) => {
      setItems(s);
      setTeachers(t);
      setLoading(false);
    });
  };
  useEffect(reload, []);

  async function save() {
    if (!editing) return;
    if ("id" in editing && editing.id) await subjectsApi.updateSubject(editing.id, editing);
    else await subjectsApi.createSubject(editing);
    setEditing(null);
    reload();
  }

  async function remove(id: string) {
    if (!confirm("Удалить предмет?")) return;
    await subjectsApi.deleteSubject(id);
    reload();
  }

  if (loading) return <Loader />;

  const teacherMap = new Map(teachers.map((t) => [t.id, t]));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Предметы</h1>
          <p>Учебные дисциплины и закреплённые преподаватели.</p>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY })}>+ Добавить предмет</Button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Преподаватели</th>
              <th style={{ textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">Нет предметов</td>
              </tr>
            )}
            {items.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td className="muted">{s.description || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {s.teacherIds.length === 0 && <span className="muted">не назначены</span>}
                    {s.teacherIds.map((tid) => {
                      const t = teacherMap.get(tid);
                      return (
                        <Badge key={tid} variant="primary">
                          {t ? `${t.lastName} ${t.firstName[0]}.` : tid}
                        </Badge>
                      );
                    })}
                  </div>
                </td>
                <td className="table__actions">
                  <Button size="sm" variant="ghost" onClick={() => setEditing({ ...s })}>Изменить</Button>
                  <Button size="sm" variant="danger" onClick={() => remove(s.id)}>Удалить</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={editing !== null}
        title={editing && "id" in editing && editing.id ? "Редактирование предмета" : "Новый предмет"}
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
            <Input
              label="Название"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <div className="field">
              <label className="field__label">Описание</label>
              <textarea
                className="textarea"
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">Преподаватели</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8, padding: 8 }}>
                {teachers.map((t) => (
                  <label key={t.id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={editing.teacherIds.includes(t.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const next = checked
                          ? [...editing.teacherIds, t.id]
                          : editing.teacherIds.filter((id) => id !== t.id);
                        setEditing({ ...editing, teacherIds: next });
                      }}
                    />
                    {t.lastName} {t.firstName} {t.middleName ?? ""}
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
