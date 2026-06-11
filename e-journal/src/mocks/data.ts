import type {
  Attendance,
  Grade,
  ScheduleEntry,
  SchoolClass,
  Subject,
  User,
} from "@/types";

/**
 * Mock-стор. Имитирует БД в памяти + localStorage.
 * При подключении бэка просто перестанет использоваться.
 */

const STORE_KEY = "ej_mock_store_v1";

interface Store {
  users: User[];
  subjects: Subject[];
  classes: SchoolClass[];
  grades: Grade[];
  attendance: Attendance[];
  schedule: ScheduleEntry[];
  // плоский map email -> password
  passwords: Record<string, string>;
}

function seed(): Store {
  const users: User[] = [
    {
      id: "u-admin",
      firstName: "Иван",
      lastName: "Петров",
      middleName: "Сергеевич",
      email: "admin@school.ru",
      role: "admin",
    },
    {
      id: "u-t1",
      firstName: "Анна",
      lastName: "Смирнова",
      middleName: "Викторовна",
      email: "smirnova@school.ru",
      role: "teacher",
      subjectIds: ["s-math", "s-geom"],
    },
    {
      id: "u-t2",
      firstName: "Дмитрий",
      lastName: "Кузнецов",
      middleName: "Андреевич",
      email: "kuznetsov@school.ru",
      role: "teacher",
      subjectIds: ["s-phys"],
    },
    {
      id: "u-t3",
      firstName: "Ольга",
      lastName: "Иванова",
      middleName: "Павловна",
      email: "ivanova@school.ru",
      role: "teacher",
      subjectIds: ["s-rus", "s-lit"],
    },
    {
      id: "u-s1",
      firstName: "Алексей",
      lastName: "Морозов",
      email: "morozov@school.ru",
      role: "student",
      classId: "c-10a",
    },
    {
      id: "u-s2",
      firstName: "Мария",
      lastName: "Соколова",
      email: "sokolova@school.ru",
      role: "student",
      classId: "c-10a",
    },
    {
      id: "u-s3",
      firstName: "Никита",
      lastName: "Волков",
      email: "volkov@school.ru",
      role: "student",
      classId: "c-10a",
    },
    {
      id: "u-s4",
      firstName: "Полина",
      lastName: "Лебедева",
      email: "lebedeva@school.ru",
      role: "student",
      classId: "c-10a",
    },
    {
      id: "u-s5",
      firstName: "Артём",
      lastName: "Зайцев",
      email: "zaytsev@school.ru",
      role: "student",
      classId: "c-10b",
    },
    {
      id: "u-s6",
      firstName: "Елизавета",
      lastName: "Орлова",
      email: "orlova@school.ru",
      role: "student",
      classId: "c-10b",
    },
  ];

  const subjects: Subject[] = [
    { id: "s-math", name: "Алгебра", teacherIds: ["u-t1"] },
    { id: "s-geom", name: "Геометрия", teacherIds: ["u-t1"] },
    { id: "s-phys", name: "Физика", teacherIds: ["u-t2"] },
    { id: "s-rus", name: "Русский язык", teacherIds: ["u-t3"] },
    { id: "s-lit", name: "Литература", teacherIds: ["u-t3"] },
    { id: "s-eng", name: "Английский язык", teacherIds: [] },
    { id: "s-inf", name: "Информатика", teacherIds: [] },
  ];

  const classes: SchoolClass[] = [
    {
      id: "c-10a",
      name: "10А",
      year: 10,
      homeroomTeacherId: "u-t1",
      studentIds: ["u-s1", "u-s2", "u-s3", "u-s4"],
    },
    {
      id: "c-10b",
      name: "10Б",
      year: 10,
      homeroomTeacherId: "u-t3",
      studentIds: ["u-s5", "u-s6"],
    },
  ];

  // Сгенерируем оценки на текущий месяц
  const today = new Date();
  const grades: Grade[] = [];
  const gradeVals: (2 | 3 | 4 | 5 | "Н")[] = [5, 4, 4, 5, 3, 4, 5, "Н", 4, 3];
  let gid = 0;
  const studentsByClass: Record<string, string[]> = {
    "c-10a": ["u-s1", "u-s2", "u-s3", "u-s4"],
    "c-10b": ["u-s5", "u-s6"],
  };

  for (const subj of ["s-math", "s-rus", "s-phys"]) {
    for (let d = 1; d <= 18; d += 2) {
      const date = new Date(today.getFullYear(), today.getMonth(), d);
      const iso = date.toISOString().slice(0, 10);
      for (const cls of ["c-10a", "c-10b"]) {
        for (const sid of studentsByClass[cls]) {
          if (Math.random() < 0.55) {
            grades.push({
              id: `g-${++gid}`,
              studentId: sid,
              subjectId: subj,
              classId: cls,
              teacherId:
                subj === "s-math" ? "u-t1" : subj === "s-phys" ? "u-t2" : "u-t3",
              date: iso,
              value: gradeVals[Math.floor(Math.random() * gradeVals.length)],
            });
          }
        }
      }
    }
  }

  // Расписание для класса 10А и 10Б
  const schedule: ScheduleEntry[] = [];
  let sid = 0;
  const grid: Record<string, [number, string, string][]> = {
    "c-10a": [
      [1, "s-math", "u-t1"],
      [1, "s-rus", "u-t3"],
      [1, "s-phys", "u-t2"],
      [1, "s-lit", "u-t3"],
      [2, "s-rus", "u-t3"],
      [2, "s-math", "u-t1"],
      [2, "s-geom", "u-t1"],
      [3, "s-phys", "u-t2"],
      [3, "s-math", "u-t1"],
      [3, "s-lit", "u-t3"],
      [4, "s-math", "u-t1"],
      [4, "s-rus", "u-t3"],
      [4, "s-phys", "u-t2"],
      [5, "s-geom", "u-t1"],
      [5, "s-lit", "u-t3"],
    ],
    "c-10b": [
      [1, "s-rus", "u-t3"],
      [1, "s-math", "u-t1"],
      [2, "s-phys", "u-t2"],
      [2, "s-math", "u-t1"],
      [3, "s-lit", "u-t3"],
      [3, "s-rus", "u-t3"],
      [4, "s-math", "u-t1"],
      [4, "s-phys", "u-t2"],
    ],
  };
  for (const [cls, list] of Object.entries(grid)) {
    list.forEach((item, idx) => {
      const [day, subjectId, teacherId] = item;
      schedule.push({
        id: `sc-${++sid}`,
        classId: cls,
        subjectId,
        teacherId,
        dayOfWeek: day as 1 | 2 | 3 | 4 | 5,
        lessonNumber: (idx % 6) + 1,
        room: String(100 + ((idx * 7) % 20)),
      });
    });
  }

  // Посещаемость — пара пропусков
  const attendance: Attendance[] = [
    {
      id: "a-1",
      studentId: "u-s1",
      subjectId: "s-math",
      classId: "c-10a",
      date: new Date(today.getFullYear(), today.getMonth(), 3)
        .toISOString()
        .slice(0, 10),
      status: "absent",
    },
    {
      id: "a-2",
      studentId: "u-s3",
      subjectId: "s-rus",
      classId: "c-10a",
      date: new Date(today.getFullYear(), today.getMonth(), 5)
        .toISOString()
        .slice(0, 10),
      status: "late",
    },
  ];

  const passwords: Record<string, string> = {};
  users.forEach((u) => (passwords[u.email] = "123456"));

  return { users, subjects, classes, grades, attendance, schedule, passwords };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {
    /* ignore */
  }
  const s = seed();
  save(s);
  return s;
}

function save(s: Store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

export const store = load();

export function persist() {
  save(store);
}

export function resetStore() {
  localStorage.removeItem(STORE_KEY);
  Object.assign(store, seed());
  persist();
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// имитация задержки сети
export function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
