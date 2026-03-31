import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  CalendarDays,
  Users,
  Trash2,
  Download,
  ChevronDown,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";

<<<<<<< HEAD
const STORAGE_KEY = "mid-attendance-app-v3";
const SETTINGS_KEY = "mid-attendance-app-settings-v1";
const DEFAULT_SYNC_URL =
  "https://d5dlcqfpq7hr3ukgr32i.g3ab4gln.apigw.yandexcloud.net/state";
=======
function Logo() {
  return (
    <div className="mb-6 flex items-center">
      <img
        src="./logo.png"
        alt="МИД Студия танцев"
        className="h-auto w-[220px] object-contain md:w-[300px]"
      />
    </div>
  );
}
>>>>>>> 8658bfb0631a300880292f7bd3f6772e2bacd2fb

const SUBSCRIPTION_OPTIONS = [0, 1, 4, 8, 12, 24];
const WEEKDAY_LABELS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const uid = () => Math.random().toString(36).slice(2, 10);

type AttendanceMap = Record<number, number>;

type Student = {
  id: string;
  name: string;
  purchase: number;
  purchaseDate: string;
  attendance: AttendanceMap;
  note: string;
  order: number;
};

type Group = {
  id: string;
  title: string;
  schedule: string;
  students: Student[];
};

type MonthData = {
  id: string;
  name: string;
  year: number;
  days: number;
  firstWeekday: number;
  groups: Group[];
};

function createStudent(index = 1): Student {
  return {
    id: uid(),
    name: "",
    purchase: 0,
    purchaseDate: "",
    attendance: {},
    note: "",
    order: index,
  };
}

function createGroup(index = 1): Group {
  return {
    id: uid(),
    title: `Группа ${index}`,
    schedule: "Например: Пн/Ср 20:00",
    students: [createStudent(1)],
  };
}

function createMonth(name: string, days = 31, year = new Date().getFullYear()): MonthData {
  return {
    id: uid(),
    name,
    year,
    days,
    firstWeekday: new Date(year, MONTH_NAMES.indexOf(name), 1).getDay(),
    groups: [createGroup(1)],
  };
}

function getMonthLabel(month: MonthData) {
  return `${month.name} ${month.year}`;
}

function getDayLabels(month: MonthData) {
  return Array.from({ length: month.days }, (_, i) => {
    const dayNumber = i + 1;
    const weekdayIndex = (month.firstWeekday + i) % 7;
    return {
      dayNumber,
      weekday: WEEKDAY_LABELS[weekdayIndex],
      isWeekend: weekdayIndex === 0 || weekdayIndex === 6,
    };
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("ru-RU");
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function getAttendanceTotal(student: Student): number {
  const values = Object.values(student.attendance || {}) as number[];
  return values.reduce((sum: number, value: number) => sum + Number(value || 0), 0);
}

function findStudentInPreviousMonth(
  months: MonthData[],
  monthIndex: number,
  studentId: string
): { student: Student; monthIndex: number } | null {
  if (monthIndex <= 0) return null;

  for (let i = monthIndex - 1; i >= 0; i -= 1) {
    for (const group of months[i].groups) {
      const student = group.students.find((item) => item.id === studentId);
      if (student) return { student, monthIndex: i };
    }
  }
  return null;
}

function getRemainingForStudent(
  months: MonthData[],
  monthIndex: number,
  studentId: string
): number {
  const month = months[monthIndex];
  if (!month) return 0;

  for (const group of month.groups) {
    const student = group.students.find((item) => item.id === studentId);

    if (student) {
      let carry = 0;
      const previous = findStudentInPreviousMonth(months, monthIndex, studentId);

      if (previous) {
        carry = getRemainingForStudent(months, previous.monthIndex, previous.student.id);
      }

      return carry + Number(student.purchase || 0) - getAttendanceTotal(student);
    }
  }
  return 0;
}

function getExpiryDate(student: Student): Date | null {
  if (!student.purchase || !student.purchaseDate) return null;

  const purchaseDate = new Date(student.purchaseDate);
  if (Number.isNaN(purchaseDate.getTime())) return null;

  switch (Number(student.purchase)) {
    case 1:
      return addDays(purchaseDate, 1);
    case 4:
      return addDays(purchaseDate, 28);
    case 8:
      return addDays(purchaseDate, 28);
    case 12:
      return addMonths(purchaseDate, 1);
    case 24:
      return addMonths(purchaseDate, 3);
    default:
      return null;
  }
}

function getExpiryDateText(student: Student) {
  const expiryDate = getExpiryDate(student);
  if (!expiryDate) return "—";
  return formatDate(expiryDate);
}

function getExpiryStatusClass(student: Student) {
  const expiryDate = getExpiryDate(student);
  if (!expiryDate) return "bg-white text-slate-900";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(expiryDate);
  compareDate.setHours(0, 0, 0, 0);

  const diffMs = compareDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "bg-red-200 text-red-800 font-semibold";
  if (diffDays <= 3) return "bg-red-100 text-red-700 font-semibold";

  return "bg-white text-slate-900";
}

function normalizeMonths(parsed: MonthData[]): MonthData[] {
  return parsed.map((month) => ({
    ...month,
    firstWeekday: new Date(month.year, MONTH_NAMES.indexOf(month.name), 1).getDay(),
    groups: (month.groups || []).map((group, groupIndex) => ({
      id: group.id || uid(),
      title: group.title || `Группа ${groupIndex + 1}`,
      schedule: group.schedule || "",
      students: (group.students || []).map((student, studentIndex) => ({
        id: student.id || uid(),
        name: student.name || "",
        purchase: Number(student.purchase || 0),
        purchaseDate: student.purchaseDate || "",
        attendance: student.attendance || {},
        note: student.note || "",
        order: student.order || studentIndex + 1,
      })),
    })),
  }));
}

function cloneMonthForNext(currentMonth: MonthData): MonthData {
  return {
    id: uid(),
    name: currentMonth.name,
    year: currentMonth.year,
    days: currentMonth.days,
    firstWeekday: currentMonth.firstWeekday,
    groups: currentMonth.groups.map((group, groupIndex) => ({
      ...group,
      id: uid(),
      title: group.title || `Группа ${groupIndex + 1}`,
      schedule: group.schedule || "",
      students: group.students.map((student, studentIndex) => ({
        ...student,
        purchase: 0,
        purchaseDate: "",
        attendance: {},
        order: studentIndex + 1,
      })),
    })),
  };
}

function getCellColor(value: number) {
  if (!value) return "bg-white";
  if (value === 1) return "bg-lime-400 text-black font-semibold";
  if (value === 2) return "bg-yellow-300 text-black font-semibold";
  if (value === 3) return "bg-yellow-400 text-black font-semibold";
  if (value === 4) return "bg-amber-400 text-black font-semibold";
  return "bg-fuchsia-400 text-black font-semibold";
}

function CellValuePicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`h-9 w-full border border-slate-300 text-sm transition ${getCellColor(value)} hover:brightness-95`}
      >
        {value || ""}
      </button>

      {open && (
        <div className="absolute z-30 mt-1 grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
          {[0, 1, 2, 3, 4, 5].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`h-8 min-w-8 rounded-md border border-slate-200 text-sm hover:bg-slate-100 ${
                option === value ? "bg-slate-900 text-white hover:bg-slate-900" : "bg-white text-slate-800"
              }`}
            >
              {option === 0 ? "—" : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MidAttendanceManager() {
  const [months, setMonths] = useState<MonthData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return normalizeMonths(JSON.parse(saved));
      } catch {}
    }
    return [createMonth(MONTH_NAMES[new Date().getMonth()], 31)];
  });

  const [activeMonthId, setActiveMonthId] = useState<string | undefined>(months[0]?.id);
  const [syncUrl] = useState(() => localStorage.getItem(SETTINGS_KEY) || DEFAULT_SYNC_URL);
  const [syncStatus, setSyncStatus] = useState("");

  async function saveToCloud(currentMonths: MonthData[]) {
    if (!syncUrl) return;

    try {
      await fetch(syncUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ months: currentMonths }),
      });

      setSyncStatus(
        `Сохранено: ${new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
    } catch {
      setSyncStatus("Ошибка сохранения в облако.");
    }
  }

  // Загрузка из Yandex API при открытии
  useEffect(() => {
    async function loadFromCloud() {
      try {
        const response = await fetch(syncUrl, { method: "GET" });
        const data = await response.json();

        if (data.months && Array.isArray(data.months)) {
          const normalized = normalizeMonths(data.months);
          if (normalized.length > 0) {
            setMonths(normalized);
            setActiveMonthId(normalized[0]?.id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            setSyncStatus("Данные загружены из облака.");
          }
        }
      } catch {
        setSyncStatus("Используются локально сохранённые данные.");
      }
    }

    if (syncUrl) loadFromCloud();
  }, [syncUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(months));
  }, [months]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, syncUrl);
  }, [syncUrl]);

  // Быстрое автосохранение через 2 секунды после изменений
  useEffect(() => {
    if (!syncUrl || !months.length) return;

    const timeout = window.setTimeout(() => {
      saveToCloud(months);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [months, syncUrl]);

  // Резервное сохранение каждые 15 минут
  useEffect(() => {
    if (!syncUrl) return;

    const interval = window.setInterval(() => {
      saveToCloud(months);
    }, 15 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [months, syncUrl]);

  useEffect(() => {
    if (!months.find((month) => month.id === activeMonthId)) {
      setActiveMonthId(months[0]?.id);
    }
  }, [months, activeMonthId]);

  const activeMonthIndex = useMemo(
    () => months.findIndex((month) => month.id === activeMonthId),
    [months, activeMonthId]
  );

  const activeMonth = activeMonthIndex >= 0 ? months[activeMonthIndex] : months[0];
  const days = activeMonth ? getDayLabels(activeMonth) : [];

  function updateActiveMonth(updater: (month: MonthData) => MonthData) {
    setMonths((prev) => prev.map((month, index) => (index === activeMonthIndex ? updater(month) : month)));
  }

  function addStudent(groupId: string) {
    updateActiveMonth((month) => ({
      ...month,
      groups: month.groups.map((group) =>
        group.id === groupId
          ? { ...group, students: [...group.students, createStudent(group.students.length + 1)] }
          : group
      ),
    }));
  }

  function addGroup() {
    updateActiveMonth((month) => ({
      ...month,
      groups: [...month.groups, createGroup(month.groups.length + 1)],
    }));
  }

  function addMonth() {
    const nextSource = activeMonth || months[months.length - 1] || createMonth(MONTH_NAMES[0], 31);
    const nextDate = new Date(nextSource.year, MONTH_NAMES.indexOf(nextSource.name) + 1, 1);

    const nextMonth = cloneMonthForNext(nextSource);
    nextMonth.name = MONTH_NAMES[nextDate.getMonth()];
    nextMonth.year = nextDate.getFullYear();
    nextMonth.days = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
    nextMonth.firstWeekday = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1).getDay();

    setMonths((prev) => [...prev, nextMonth]);
    setActiveMonthId(nextMonth.id);
  }

  function updateStudent(groupId: string, studentId: string, patch: Partial<Student>) {
    updateActiveMonth((month) => ({
      ...month,
      groups: month.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              students: group.students.map((student) =>
                student.id === studentId ? { ...student, ...patch } : student
              ),
            }
          : group
      ),
    }));
  }

  function updateAttendance(groupId: string, studentId: string, dayNumber: number, value: number) {
    updateActiveMonth((month) => ({
      ...month,
      groups: month.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              students: group.students.map((student) => {
                if (student.id !== studentId) return student;
                const nextAttendance = { ...(student.attendance || {}) };
                if (!value) delete nextAttendance[dayNumber];
                else nextAttendance[dayNumber] = value;
                return { ...student, attendance: nextAttendance };
              }),
            }
          : group
      ),
    }));
  }

  function updateGroup(groupId: string, patch: Partial<Group>) {
    updateActiveMonth((month) => ({
      ...month,
      groups: month.groups.map((group) =>
        group.id === groupId ? { ...group, ...patch } : group
      ),
    }));
  }

  function removeStudent(groupId: string, studentId: string) {
    updateActiveMonth((month) => ({
      ...month,
      groups: month.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              students:
                group.students.length > 1
                  ? group.students.filter((student) => student.id !== studentId)
                  : group.students,
            }
          : group
      ),
    }));
  }

  function removeGroup(groupId: string) {
    updateActiveMonth((month) => ({
      ...month,
      groups:
        month.groups.length > 1
          ? month.groups.filter((group) => group.id !== groupId)
          : month.groups,
    }));
  }

  function exportToExcel() {
    const workbook = XLSX.utils.book_new();

    months.forEach((month, monthIndex) => {
      const dayHeaders = getDayLabels(month);
      const rows: (string | number)[][] = [];

      month.groups.forEach((group) => {
        rows.push([
          group.title || "Группа",
          group.schedule || "",
          "",
          "",
          "",
          "",
          ...Array(month.days).fill(""),
        ]);

        rows.push([
          "№",
          "Ученик",
          "Абонемент",
          "Срок действия до",
          "Осталось занятий",
          "Примечание",
          ...dayHeaders.map((d) => `${d.dayNumber} ${d.weekday}`),
        ]);

        group.students.forEach((student, index) => {
          rows.push([
            index + 1,
            student.name || "",
            student.purchase
              ? student.purchase === 1
                ? "Разовое занятие"
                : `Абонемент на ${student.purchase}`
              : "",
            getExpiryDateText(student),
            getRemainingForStudent(months, monthIndex, student.id),
            student.note || "",
            ...dayHeaders.map((d) => student.attendance?.[d.dayNumber] || ""),
          ]);
        });

        rows.push([]);
      });

      const sheet = XLSX.utils.aoa_to_sheet(rows);
      sheet["!cols"] = [
        { wch: 6 },
        { wch: 28 },
        { wch: 20 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        ...Array(month.days).fill({ wch: 8 }),
      ];

      XLSX.utils.book_append_sheet(workbook, sheet, `${month.name.slice(0, 3)} ${month.year}`);
    });

    XLSX.writeFile(workbook, "uchet_uchenikov_mid.xlsx");
  }

  if (!activeMonth) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-[1800px] space-y-4">
        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  Учёт учеников
                </CardTitle>
                <p className="mt-2 text-slate-500">
                  Данные синхронизируются с облаком и доступны с любого устройства.
                </p>
                {syncStatus && <p className="mt-2 text-sm text-slate-600">{syncStatus}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={addGroup}
                  className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Добавить группу
                </Button>

                <Button
                  onClick={addMonth}
                  className="rounded-2xl bg-fuchsia-600 text-white hover:bg-fuchsia-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить месяц
                </Button>

                <Button
                  onClick={exportToExcel}
                  className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Скачать Excel
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <button
                  key={month.id}
                  onClick={() => setActiveMonthId(month.id)}
                  className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                    month.id === activeMonthId
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {getMonthLabel(month)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-auto rounded-3xl border border-slate-200 bg-white max-h-[80vh]">
              <table className="w-max min-w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="sticky top-0 left-0 z-40 min-w-[180px] border border-slate-300 bg-white p-3 text-left text-lg font-semibold">
                      {activeMonth.name}
                    </th>
                    <th className="sticky top-0 left-[180px] z-40 min-w-[56px] border border-slate-300 bg-white p-3 text-center">
                      №
                    </th>
                    <th className="sticky top-0 left-[236px] z-40 min-w-[260px] border border-slate-300 bg-white p-3 text-left">
                      Ученик
                    </th>
                    <th className="sticky top-0 left-[496px] z-40 min-w-[180px] border border-slate-300 bg-white p-3 text-left">
                      Абонемент
                    </th>
                    <th className="sticky top-0 left-[676px] z-40 min-w-[150px] border border-slate-300 bg-white p-3 text-center">
                      Срок действия до
                    </th>
                    <th className="sticky top-0 left-[826px] z-40 min-w-[130px] border border-slate-300 bg-white p-3 text-center">
                      Осталось занятий
                    </th>
                    <th className="sticky top-0 left-[956px] z-40 min-w-[90px] border border-slate-300 bg-white p-3 text-center">
                      Удалить
                    </th>
                    {days.map((day) => (
                      <th
                        key={day.dayNumber}
                        className={`sticky top-0 z-30 min-w-[54px] border border-slate-300 p-0 text-center ${
                          day.isWeekend ? "bg-slate-200" : "bg-slate-50"
                        }`}
                      >
                        <div className="border-b border-slate-300 py-2 font-semibold">{day.dayNumber}</div>
                        <div className="py-1 text-xs uppercase text-slate-600">{day.weekday}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {activeMonth.groups.map((group, groupIndex) => {
                    const rowCount = group.students.length + 1;
                    return (
                      <React.Fragment key={group.id}>
                        <tr className="bg-slate-100/60">
                          <td rowSpan={rowCount} className="sticky left-0 z-10 border border-slate-300 bg-slate-100 align-top">
                            <div className="space-y-3 p-3">
                              <Input
                                value={group.title}
                                onChange={(e) => updateGroup(group.id, { title: e.target.value })}
                                className="rounded-xl border border-slate-300 bg-white text-sm font-semibold"
                                placeholder={`Группа ${groupIndex + 1}`}
                              />
                              <Input
                                value={group.schedule}
                                onChange={(e) => updateGroup(group.id, { schedule: e.target.value })}
                                className="rounded-xl border border-slate-300 bg-white text-sm"
                                placeholder="Например: Пн/Ср 20:00"
                              />
                              <div className="flex flex-col gap-2">
                                <Button
                                  onClick={() => addStudent(group.id)}
                                  className="justify-start rounded-xl bg-lime-500 text-black hover:bg-lime-400"
                                >
                                  <Plus className="mr-2 h-4 w-4" /> Добавить ученика
                                </Button>
                                <Button
                                  onClick={() => removeGroup(group.id)}
                                  className="justify-start rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Удалить группу
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {group.students.map((student, index) => {
                          const remaining = getRemainingForStudent(months, activeMonthIndex, student.id);

                          return (
                            <tr key={student.id}>
                              <td className="sticky left-[180px] z-10 border border-slate-300 bg-white p-2 text-center">
                                {index + 1}
                              </td>
                              <td className="sticky left-[236px] z-10 border border-slate-300 bg-white p-2">
                                <Input
                                  value={student.name}
                                  onChange={(e) => updateStudent(group.id, student.id, { name: e.target.value })}
                                  className="rounded-lg border border-slate-200"
                                  placeholder="Имя и фамилия"
                                />
                              </td>
                              <td className="sticky left-[496px] z-10 border border-slate-300 bg-white p-2">
                                <div className="relative">
                                  <select
                                    value={0}
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      if (!value) return;
                                      updateStudent(group.id, student.id, {
                                        purchase: Number(student.purchase || 0) + value,
                                        purchaseDate: new Date().toISOString(),
                                      });
                                    }}
                                    className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-800 outline-none"
                                  >
                                    <option value={0}>Добавить покупку</option>
                                    {SUBSCRIPTION_OPTIONS.filter(Boolean).map((value) => (
                                      <option key={value} value={value}>
                                        {value === 1 ? "Купил разовое занятие" : `Купил абонемент на ${value}`}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                </div>
                              </td>
                              <td className={`sticky left-[676px] z-10 border border-slate-300 p-2 text-center ${getExpiryStatusClass(student)}`}>
                                {getExpiryDateText(student)}
                              </td>
                              <td className={`sticky left-[826px] z-10 border border-slate-300 p-2 text-center text-base font-semibold ${
                                remaining < 0 ? "bg-red-50 text-red-600" : "bg-white text-slate-900"
                              }`}>
                                {remaining}
                              </td>
                              <td className="sticky left-[956px] z-10 border border-slate-300 bg-white p-2 text-center">
                                <Button
                                  type="button"
                                  onClick={() => removeStudent(group.id, student.id)}
                                  className="h-10 rounded-lg border border-red-200 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                              {days.map((day) => (
                                <td key={`${student.id}-${day.dayNumber}`} className={`border border-slate-300 p-0 ${day.isWeekend ? "bg-slate-100" : "bg-white"}`}>
                                  <CellValuePicker
                                    value={Number(student.attendance?.[day.dayNumber] || 0)}
                                    onChange={(value) => updateAttendance(group.id, student.id, day.dayNumber, value)}
                                  />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
