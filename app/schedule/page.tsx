import { db } from "@/lib/db";
import { CalendarDays, Clock, MapPin, BookOpen } from "lucide-react";
import Link from "next/link";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const DAY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Senin:  { bg: "bg-indigo-50 dark:bg-indigo-500/10",  text: "text-indigo-700 dark:text-indigo-300",  border: "border-indigo-200 dark:border-indigo-500/30",  dot: "bg-indigo-500" },
  Selasa: { bg: "bg-violet-50 dark:bg-violet-500/10",  text: "text-violet-700 dark:text-violet-300",  border: "border-violet-200 dark:border-violet-500/30",  dot: "bg-violet-500" },
  Rabu:   { bg: "bg-sky-50 dark:bg-sky-500/10",        text: "text-sky-700 dark:text-sky-300",        border: "border-sky-200 dark:border-sky-500/30",        dot: "bg-sky-500" },
  Kamis:  { bg: "bg-emerald-50 dark:bg-emerald-500/10",text: "text-emerald-700 dark:text-emerald-300",border: "border-emerald-200 dark:border-emerald-500/30",dot: "bg-emerald-500" },
  Jumat:  { bg: "bg-amber-50 dark:bg-amber-500/10",    text: "text-amber-700 dark:text-amber-300",    border: "border-amber-200 dark:border-amber-500/30",    dot: "bg-amber-500" },
  Sabtu:  { bg: "bg-orange-50 dark:bg-orange-500/10",  text: "text-orange-700 dark:text-orange-300",  border: "border-orange-200 dark:border-orange-500/30",  dot: "bg-orange-500" },
  Minggu: { bg: "bg-rose-50 dark:bg-rose-500/10",      text: "text-rose-700 dark:text-rose-300",      border: "border-rose-200 dark:border-rose-500/30",      dot: "bg-rose-500" },
};

function getTodayName(): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[new Date().getDay()];
}

export default async function SchedulePage() {
  const courses = await (db.course.findMany as any)({
    include: { semester: true, sessions: true },
    orderBy: { name: "asc" },
  });

  // Group by day
  const byDay: Record<string, typeof courses> = {};
  for (const day of DAYS) byDay[day] = [];
  const unscheduled: typeof courses = [];

  for (const course of courses) {
    if ((course as any).day && byDay[(course as any).day] !== undefined) {
      byDay[(course as any).day].push(course);
    } else if (!(course as any).day) {
      unscheduled.push(course);
    }
  }

  const today = getTodayName();
  const scheduled = courses.filter((c: any) => c.day);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-indigo-500" />
            Jadwal Pelajaran
          </h1>
          <p className="text-slate-500 mt-1">Lihat jadwal kuliah kamu setiap harinya dalam seminggu.</p>
        </div>
        <Link
          href="/courses/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
        >
          <BookOpen className="w-4 h-4" />
          Atur Jadwal via Mata Kuliah
        </Link>
      </div>

      {/* Summary ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total MK</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{courses.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Terjadwal</span>
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{scheduled.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Belum Terjadwal</span>
          <span className="text-3xl font-bold text-amber-500">{unscheduled.length}</span>
        </div>
        <div className={`rounded-2xl p-4 flex flex-col gap-1 border ${DAY_COLORS[today]?.bg ?? "bg-white dark:bg-slate-900"} ${DAY_COLORS[today]?.border ?? "border-slate-200"}`}>
          <span className={`text-xs font-semibold uppercase tracking-wide ${DAY_COLORS[today]?.text ?? "text-slate-500"}`}>MK Hari Ini</span>
          <span className={`text-3xl font-bold ${DAY_COLORS[today]?.text ?? "text-slate-900"}`}>{byDay[today]?.length ?? 0}</span>
          <span className={`text-xs font-medium ${DAY_COLORS[today]?.text ?? "text-slate-500"}`}>{today}</span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white/30 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-5">
            <CalendarDays className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum ada mata kuliah</h3>
          <p className="text-slate-500 text-center max-w-sm mb-6">
            Tambahkan mata kuliah beserta jadwalnya terlebih dahulu.
          </p>
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Tambah Mata Kuliah
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {DAYS.map((day) => {
            const dayCourses = byDay[day];
            const isToday = day === today;
            const color = DAY_COLORS[day];

            return (
              <div
                key={day}
                className={`rounded-2xl border transition-all ${
                  isToday
                    ? `${color.border} shadow-md`
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* Day header */}
                <div
                  className={`flex items-center gap-3 px-6 py-4 rounded-t-2xl ${
                    isToday ? color.bg : "bg-slate-50 dark:bg-slate-900/60"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${isToday ? color.dot : "bg-slate-300 dark:bg-slate-600"}`} />
                  <h2
                    className={`text-base font-bold ${
                      isToday ? color.text : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {day}
                    {isToday && (
                      <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border}`}>
                        Hari Ini
                      </span>
                    )}
                  </h2>
                  <span className="ml-auto text-xs font-semibold text-slate-400">
                    {dayCourses.length} Mata Kuliah
                  </span>
                </div>

                {/* Courses */}
                <div className="bg-white dark:bg-slate-950 rounded-b-2xl divide-y divide-slate-100 dark:divide-slate-800/60">
                  {dayCourses.length === 0 ? (
                    <div className="px-6 py-5 text-sm text-slate-400 italic text-center">
                      Tidak ada kuliah hari ini
                    </div>
                  ) : (
                    dayCourses.map((course: any) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group"
                      >
                        {/* Course info */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-slate-900 dark:text-white group-hover:${color.text} transition-colors truncate`}>
                            {course.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{course.code}</p>
                        </div>

                        {/* Category badge */}
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                            course.category === "Praktik"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          }`}
                        >
                          {course.category}
                        </span>

                        {/* Semester */}
                        <span className="text-xs text-slate-400 hidden lg:block flex-shrink-0">
                          {course.semester?.name}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Unscheduled */}
          {unscheduled.length > 0 && (
            <div className="rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/30">
              <div className="flex items-center gap-3 px-6 py-4 rounded-t-2xl bg-amber-50 dark:bg-amber-500/5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <h2 className="text-base font-bold text-amber-700 dark:text-amber-400">
                  Belum Ada Jadwal
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                    {unscheduled.length} MK
                  </span>
                </h2>
                <Link
                  href="/courses"
                  className="ml-auto text-xs font-semibold text-amber-600 hover:underline"
                >
                  Atur Jadwal →
                </Link>
              </div>
              <div className="bg-white dark:bg-slate-950 rounded-b-2xl divide-y divide-slate-100 dark:divide-slate-800/60">
                {unscheduled.map((course: any) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                        {course.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{course.code}</p>
                    </div>
                    <span className="text-xs text-amber-500 font-medium">Belum dijadwalkan</span>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                        course.category === "Praktik"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      }`}
                    >
                      {course.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
