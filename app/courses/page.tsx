import { Plus, Search, BookOpen, Clock, MoreVertical, LayoutGrid, List, CalendarDays } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function CoursesPage() {
  // Fetch courses from DB (mock for now if no data, but we'll try to query realistically)
  const courses = await db.course.findMany({
    include: { semester: true, sessions: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Mata Kuliah</h1>
          <p className="text-slate-500 mt-1">Kelola data mata kuliah dan sesi pertemuan.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Plus className="w-5 h-5" />
            Tambah Mata Kuliah
          </Link>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari mata kuliah..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="flex-1 sm:w-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <option value="">Semua Kategori</option>
            <option value="Praktik">Praktik</option>
            <option value="Non-Praktik">Non-Praktik</option>
          </select>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <button className="p-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm text-indigo-600 dark:text-indigo-400">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 mt-8 bg-white/30 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum ada Mata Kuliah</h3>
          <p className="text-slate-500 text-center max-w-sm mb-6">Mulai tambahkan mata kuliah pertama Anda beserta sesi-sesi pembelajarannya.</p>
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/20 px-6 py-3 rounded-xl font-bold transition-all"
          >
            <Plus className="w-5 h-5" />
            Buat Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="group">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.category === 'Praktik' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                    {course.category}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                  {course.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 font-mono">
                  {course.code}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 flex-1">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>{course.sessions.length} Sesi</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 border-l border-slate-200 dark:border-slate-700 pl-4">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span className="truncate">{course.semester?.name || "Semester Aktif"}</span>
                  </div>
                </div>

                {course.day && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg w-fit">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{course.day}</span>
                    {course.startTime && (
                      <span className="flex items-center gap-1 border-l border-indigo-200 dark:border-indigo-500/30 pl-2 ml-1">
                        <Clock className="w-3 h-3" />
                        {course.startTime} {course.endTime ? ` - ${course.endTime}` : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
