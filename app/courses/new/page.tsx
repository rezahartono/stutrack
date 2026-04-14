import { ArrowLeft, BookOpen, Bookmark, Save, CalendarDays, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { createCourse } from "@/lib/actions";
import { db } from "@/lib/db";

export default async function NewCoursePage() {
  const semesters = await db.semester.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/courses" 
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Buat Mata Kuliah</h1>
          <p className="text-slate-500 mt-1">Tambahkan mata kuliah baru untuk semester ini.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm p-6 md:p-8">
        <form action={createCourse} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Nama Mata Kuliah
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Contoh: Pemrograman Web Lanjut"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="code" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-500" /> Kode Mata Kuliah
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  placeholder="Contoh: TIK205"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white appearance-none"
                >
                  <option value="Praktik">Praktik (Praktikum & Tugas Berjenjang)</option>
                  <option value="Non-Praktik">Non-Praktik (Konseptual)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="semesterId" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5">
                Semester
              </label>
              <select
                id="semesterId"
                name="semesterId"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white appearance-none"
              >
                {semesters.length === 0 ? (
                  <option value="">(Buat Semester Default Otomatis)</option>
                ) : (
                  semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))
                )}
              </select>
              <p className="text-xs text-slate-500 mt-2">Mata kuliah akan dikaitkan ke semester yang dipilih.</p>
            </div>

            {/* Jadwal Kuliah */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-500" />
                Jadwal Kuliah <span className="text-slate-400 font-normal">(opsional)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="day" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5">
                    Hari
                  </label>
                  <select
                    id="day"
                    name="day"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white appearance-none"
                  >
                    <option value="">-- Pilih Hari --</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="room" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" /> Ruang Kelas
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    placeholder="Contoh: Lab Komputer A"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" /> Jam Mulai
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" /> Jam Selesai
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <Link 
              href="/courses"
              className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-200 dark:shadow-none"
            >
              <Save className="w-5 h-5" />
              Simpan Mata Kuliah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
