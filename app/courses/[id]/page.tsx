import { BookOpen, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Clock, Plus, Presentation, Save, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createSession } from "@/lib/actions";

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      semester: true,
      sessions: {
        orderBy: { startDate: "asc" }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const createSessionForCourse = createSession.bind(null, course.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
        <Link href="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400">Mata Kuliah</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-slate-200">{course.name}</span>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row shadow-sm gap-6 justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.category === 'Praktik' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
              {course.category}
            </span>
            <span className="font-mono text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              {course.code}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            {course.name}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" /> {course.semester?.name || "Global Semester"}</span>
            <span className="flex items-center gap-1.5 text-indigo-500"><Presentation className="w-4 h-4" /> {course.sessions.length} Sesi Terdaftar</span>
          </div>
        </div>
        
        <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Sessions List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Sesi Pertemuan
          </h2>

          {course.sessions.length === 0 ? (
           <div className="bg-white/30 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center">
             <Presentation className="w-12 h-12 text-slate-400 mb-3" />
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Belum ada Sesi</h3>
             <p className="text-sm text-slate-500 max-w-sm">Tambahkan sesi pertemuan melalui form di sebelah kanan untuk mulai mendata progress.</p>
           </div>
          ) : (
            <div className="space-y-3">
              {course.sessions.map((session, index) => (
                <div key={session.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors group flex gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {session.name}
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                       <span className="flex items-center gap-1">
                         <Clock className="w-3.5 h-3.5" /> 
                         {session.startDate.toLocaleDateString("id-ID")} - {session.endDate.toLocaleDateString("id-ID")}
                       </span>
                    </div>
                  </div>
                <div className="flex flex-col items-end gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${session.hasDiscussion || session.hasTask ? 'text-emerald-500' : 'text-slate-400'}`} />
                    Aktivitas: {session.hasDiscussion && session.hasTask ? 'Diskusi & Tugas' : session.hasDiscussion ? 'Diskusi' : session.hasTask ? 'Tugas' : 'Tidak Ada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Col: Add Session Form */}
      <div>
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sticky top-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-500" /> Tambah Sesi
          </h3>
          
          <form action={createSessionForCourse} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Sesi
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Sesi 1: Pengantar"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startDate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div className="pt-2">
              <label htmlFor="taskType" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Jenis Penugasan
              </label>
              <select
                id="taskType"
                name="taskType"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
              >
                <option value="none">Tidak Ada Tambahan</option>
                <option value="discussion">Diskusi Saja</option>
                <option value="task">Tugas Saja</option>
                <option value="both">Keduanya (Diskusi & Tugas)</option>
              </select>
              <p className="text-xs text-slate-500 mt-2 italic">* Absensi otomatis selalu tersedia di setiap sesi.</p>
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
            >
              <Save className="w-4 h-4" /> Simpan Sesi
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
