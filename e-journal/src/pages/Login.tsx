import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Role } from "@/types";

const ROLES: { value: Role; label: string; icon: string }[] = [
  { value: "admin", label: "Админ", icon: "🛡" },
  { value: "teacher", label: "Препод", icon: "📘" },
  { value: "student", label: "Ученик", icon: "🎓" },
];

const DEMO_EMAIL: Record<Role, string> = {
  admin: "admin@school.ru",
  teacher: "smirnova@school.ru",
  student: "morozov@school.ru",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState(DEMO_EMAIL.student);
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRole = (r: Role) => {
    setRole(r);
    setEmail(DEMO_EMAIL[r]);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const u = await login({ email, password, role });
      navigate(
        u.role === "admin"
          ? "/dashboard"
          : u.role === "teacher"
          ? "/dashboard"
          : "/dashboard"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__art">
        <div className="login-page__brand">
          <div className="sidebar__logo-mark" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            EJ
          </div>
          Электронный журнал
        </div>

        <div className="login-page__hero">
          <h2>Современная школа в одном окне</h2>
          <p>
            Управляйте оценками, расписанием и посещаемостью. Единая платформа
            для администраторов, преподавателей и учеников.
          </p>

          <div className="login-page__features">
            <div className="login-feature">
              <span className="login-feature__dot">📊</span>
              <span>Журнал оценок с автоподсчётом средних значений</span>
            </div>
            <div className="login-feature">
              <span className="login-feature__dot">🗓</span>
              <span>Гибкое расписание занятий и кабинетов</span>
            </div>
            <div className="login-feature">
              <span className="login-feature__dot">✅</span>
              <span>Отметка посещаемости в один клик</span>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
          © {new Date().getFullYear()} — учебный проект
        </div>
      </div>

      <div className="login-page__form-wrap">
        <div className="login-card">
          <h1>Вход в систему</h1>
          <p>Выберите роль и войдите для продолжения</p>

          <form onSubmit={submit}>
            <div className="field">
              <label className="field__label">Роль</label>
              <div className="role-picker">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    className={"role-option" + (role === r.value ? " active" : "")}
                    onClick={() => handleRole(r.value)}
                  >
                    <span className="role-option__icon">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />

            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div
                style={{
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  padding: 10,
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            <Button type="submit" block disabled={loading}>
              {loading ? "Входим..." : "Войти"}
            </Button>
          </form>

          <div className="login-hint">
            <strong>Демо-доступы (пароль <code>123456</code>):</strong>
            <br />
            Админ — <code>admin@school.ru</code>
            <br />
            Препод — <code>smirnova@school.ru</code>
            <br />
            Ученик — <code>morozov@school.ru</code>
          </div>
        </div>
      </div>
    </div>
  );
}
