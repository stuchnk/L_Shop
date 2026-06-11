import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";
import * as usersApi from "@/api/users";
import * as classesApi from "@/api/classes";
import type { Role, SchoolClass, User } from "@/types";

const ROLES: { value: Role; label: string }[] = [
  { value: "admin", label: "Администратор" },
  { value: "teacher", label: "Преподаватель" },
  { value: "student", label: "Ученик" },
];

const EMPTY: Omit<User, "id"> = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  role: "student",
  classId: undefined,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [editing, setEditing] = useState<(User | (Omit<User, "id"> & { id?: string })) | null>(null);

  const reload = () => {
    setLoading(true);
    Promise.all([usersApi.listUsers(), classesApi.listClasses()]).then(([u, c]) => {
      setUsers(u);
      setClasses(c);
      setLoading(false);
    });
  };

  useEffect(reload, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [users, search, roleFilter]);

  const classMap = new Map(classes.map((c) => [c.id, c]));

  async function save() {
    if (!editing) return;
    if ("id" in editing && editing.id) {
      await usersApi.updateUser(editing.id, editing);
    } else {
      await usersApi.createUser(editing);
    }
    setEditing(null);
    reload();
  }

  async function remove(id: string) {
    if (!confirm("Удалить пользователя?")) return;
    await usersApi.deleteUser(id);
    reload();
  }

  if (loading) return <Loader />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Пользователи</h1>
          <p>Управление администраторами, преподавателями и учениками.</p>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY })}>+ Добавить пользователя</Button>
      </div>

      <div className="toolbar">
        <Input
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[{ value: "", label: "Все роли" }, ...ROLES]}
        />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Класс</th>
              <th style={{ textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">Ничего не найдено</td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>
                    {u.lastName} {u.firstName} {u.middleName ?? ""}
                  </strong>
                </td>
                <td className="muted">{u.email}</td>
                <td>
                  <Badge variant={u.role === "admin" ? "danger" : u.role === "teacher" ? "primary" : "neutral"}>
                    {ROLES.find((r) => r.value === u.role)?.label}
                  </Badge>
                </td>
                <td>{u.classId ? classMap.get(u.classId)?.name ?? "—" : "—"}</td>
                <td className="table__actions">
                  <Button size="sm" variant="ghost" onClick={() => setEditing({ ...u })}>
                    Изменить
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(u.id)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={editing !== null}
        title={editing && "id" in editing && editing.id ? "Редактирование" : "Новый пользователь"}
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
                label="Фамилия"
                value={editing.lastName}
                onChange={(e) => setEditing({ ...editing, lastName: e.target.value })}
              />
              <Input
                label="Имя"
                value={editing.firstName}
                onChange={(e) => setEditing({ ...editing, firstName: e.target.value })}
              />
            </div>
            <Input
              label="Отчество"
              value={editing.middleName ?? ""}
              onChange={(e) => setEditing({ ...editing, middleName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={editing.email}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
            />
            <div className="grid-2">
              <Select
                label="Роль"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value as Role })}
                options={ROLES}
              />
              {editing.role === "student" && (
                <Select
                  label="Класс"
                  value={editing.classId ?? ""}
                  onChange={(e) => setEditing({ ...editing, classId: e.target.value || undefined })}
                  options={[{ value: "", label: "—" }, ...classes.map((c) => ({ value: c.id, label: c.name }))]}
                />
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
