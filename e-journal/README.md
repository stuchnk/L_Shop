# Электронный журнал — фронтенд

Готовый фронт на **React 18 + TypeScript + Vite** для электронного школьного журнала с тремя ролями: **админ**, **преподаватель**, **ученик**.

## Запуск

```bash
npm install
npm run dev
```

Откроется `http://localhost:5173`.

### Демо-доступы (пароль для всех — `123456`)

| Роль       | Email                  |
|------------|------------------------|
| Админ      | `admin@school.ru`      |
| Препод     | `smirnova@school.ru`   |
| Ученик     | `morozov@school.ru`    |

По умолчанию работает на **mock-данных** в `localStorage`. Чтобы их сбросить — очистите ключ `ej_mock_store_v1` или вызовите `resetStore()` из `src/mocks/data.ts`.

## Подключение бэка

1. Скопируйте `.env.example` → `.env`
2. Установите:
   ```
   VITE_API_URL=http://your-backend/api
   VITE_USE_MOCKS=false
   ```
3. Реализуйте на бэкенде следующие REST-эндпоинты (типы — см. `src/types.ts`):

### Auth
- `POST /auth/login` — `{ email, password, role? }` → `{ token, user }`
- `GET  /auth/me` — текущий пользователь (по Bearer-токену)
- `POST /auth/logout`

### Users
- `GET    /users?role=admin|teacher|student`
- `GET    /users/:id`
- `POST   /users`
- `PATCH  /users/:id`
- `DELETE /users/:id`

### Subjects
- `GET    /subjects`
- `POST   /subjects`
- `PATCH  /subjects/:id`
- `DELETE /subjects/:id`

### Classes
- `GET    /classes`
- `GET    /classes/:id`
- `POST   /classes`
- `PATCH  /classes/:id`
- `DELETE /classes/:id`

### Grades
- `GET  /grades?studentId&classId&subjectId&from&to`
- `POST /grades`
- `PUT  /grades/:id`
- `DELETE /grades/:id`

### Attendance
- `GET  /attendance?studentId&classId&subjectId&from&to`
- `POST /attendance`
- `PUT  /attendance/:id`

### Schedule
- `GET    /schedule?classId&teacherId`
- `POST   /schedule`
- `PUT    /schedule/:id`
- `DELETE /schedule/:id`

Авторизация — заголовок `Authorization: Bearer <token>`.

## Структура

```
src/
  api/           — HTTP-клиент + endpoint-функции по сущностям
  components/    — UI: Layout, Sidebar, Header, ProtectedRoute, ui/*
  context/       — AuthContext
  mocks/         — mock-данные и in-memory стор (с localStorage)
  pages/
    Login.tsx
    Dashboard.tsx
    SchedulePage.tsx
    admin/       — UsersPage, SubjectsPage, ClassesPage
    teacher/     — MyClassesPage, GradebookPage, AttendancePage
    student/     — GradesPage, AttendancePage
  types.ts       — единые модели данных
  index.css      — глобальные стили (CSS-переменные)
  App.tsx        — роутинг
  main.tsx
```

## Что готово

- Аутентификация с выбором роли и защищённые роуты
- Sidebar с пунктами меню по роли + общий Header
- **Админ**: CRUD пользователей, предметов, классов; назначение преподавателей и состава класса
- **Препод**: список своих классов, журнал оценок (ввод оценок 2–5 и «Н» прямо в ячейке таблицы, средний балл), отметка посещаемости одним кликом
- **Ученик**: оценки с группировкой по предметам и средним баллом, посещаемость, расписание
- Расписание сеткой (с фильтром по классу для админа)
- Адаптивные стили в палитре синий/белый, CSS-переменные для перекраски

## Палитра

Основные переменные — в начале `src/index.css`. Главные цвета:
- `--primary-600: #2563eb` — основной синий
- `--primary-700: #1d4ed8` — тёмный синий (header сайдбара)
- `--bg: #f5f8fd` — фон страницы
- `--surface: #ffffff` — карточки/таблицы
- Статусы: `--success`, `--warning`, `--danger`

Просто переопределите переменные в `:root`, чтобы поменять брендинг.
