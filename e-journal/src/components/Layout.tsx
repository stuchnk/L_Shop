import { ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  roles: Role[];
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Общее",
    items: [
      { to: "/dashboard", label: "Главная", icon: <Icon name="home" />, roles: ["admin", "teacher", "student"] },
      { to: "/schedule", label: "Расписание", icon: <Icon name="calendar" />, roles: ["admin", "teacher", "student"] },
    ],
  },
  {
    section: "Администрирование",
    items: [
      { to: "/admin/users", label: "Пользователи", icon: <Icon name="users" />, roles: ["admin"] },
      { to: "/admin/subjects", label: "Предметы", icon: <Icon name="book" />, roles: ["admin"] },
      { to: "/admin/classes", label: "Классы", icon: <Icon name="layers" />, roles: ["admin"] },
    ],
  },
  {
    section: "Учебная работа",
    items: [
      { to: "/teacher/classes", label: "Мои классы", icon: <Icon name="layers" />, roles: ["teacher"] },
      { to: "/teacher/gradebook", label: "Журнал оценок", icon: <Icon name="grid" />, roles: ["teacher"] },
      { to: "/teacher/attendance", label: "Посещаемость", icon: <Icon name="check" />, roles: ["teacher"] },
    ],
  },
  {
    section: "Учёба",
    items: [
      { to: "/student/grades", label: "Мои оценки", icon: <Icon name="award" />, roles: ["student"] },
      { to: "/student/attendance", label: "Посещаемость", icon: <Icon name="check" />, roles: ["student"] },
    ],
  },
];

function Icon({ name }: { name: string }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2z" />
          <path d="M8 7h8M8 11h8" />
        </svg>
      );
    case "layers":
      return (
        <svg {...props}>
          <path d="M12 2 2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case "grid":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4 12 14.01l-3-3" />
        </svg>
      );
    case "award":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.5 13.5 18 22l-6-3-6 3 2.5-8.5" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
      );
    default:
      return null;
  }
}

function roleLabel(r: Role) {
  return r === "admin" ? "Администратор" : r === "teacher" ? "Преподаватель" : "Ученик";
}

function pageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/dashboard": "Главная",
    "/schedule": "Расписание",
    "/admin/users": "Пользователи",
    "/admin/subjects": "Предметы",
    "/admin/classes": "Классы",
    "/teacher/classes": "Мои классы",
    "/teacher/gradebook": "Журнал оценок",
    "/teacher/attendance": "Посещаемость",
    "/student/grades": "Мои оценки",
    "/student/attendance": "Посещаемость",
  };
  return map[pathname] ?? "Электронный журнал";
}

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const initials = (user.firstName[0] ?? "") + (user.lastName[0] ?? "");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">EJ</div>
          <div>Электронный журнал</div>
        </div>

        {NAV.map((group) => {
          const items = group.items.filter((i) => i.roles.includes(user.role));
          if (!items.length) return null;
          return (
            <div key={group.section}>
              <div className="sidebar__section">{group.section}</div>
              {items.map((it) => (
                <NavLink key={it.to} to={it.to} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                  <span className="nav-link__icon">{it.icon}</span>
                  {it.label}
                </NavLink>
              ))}
            </div>
          );
        })}

        <div className="sidebar__footer">© {new Date().getFullYear()} School Journal</div>
      </aside>

      <header className="header">
        <div className="header__title">{pageTitle(location.pathname)}</div>
        <div className="header__user">
          <div className="avatar">{initials.toUpperCase()}</div>
          <div className="user-meta">
            <span className="user-meta__name">
              {user.lastName} {user.firstName}
            </span>
            <span className="user-meta__role">{roleLabel(user.role)}</span>
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            <Icon name="logout" />
            Выход
          </button>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
