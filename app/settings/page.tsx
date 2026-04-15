import { Save, Settings2, Sliders, Calendar, Database, AlertOctagon, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { createSemesterConfig, nukeDatabase } from "@/lib/actions";
import CleansingButtonClient from "./CleansingButtonClient";
import DateRangePicker from "@/components/DateRangePicker";

export default async function SettingsPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "general";

  const semesters = await db.semester.findMany({
    orderBy: { startDate: "desc" }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Aplikasi</h1>
        <p className="text-slate-500 mt-1">Konfigurasi preferensi global dan manajemen data sistem.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav Settings */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            <Link href="/settings?tab=general" className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${tab === 'general' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              <Settings2 className="w-5 h-5" /> Config Default
            </Link>
            <Link href="/settings?tab=semesters" className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${tab === 'semesters' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              <Calendar className="w-5 h-5" /> Manage Semester
            </Link>
            <Link href="/settings?tab=database" className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${tab === 'database' ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              <Database className="w-5 h-5" /> Cleansing Data
            </Link>
          </nav>
        </aside>

        {/* Main Settings Panel */}
        <div className="flex-1 space-y-6">
          
          {tab === "general" && (
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                Konfigurasi Default Kuliah
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5">
                    Default Jumlah Sesi per Mata Kuliah
                  </label>
                  <p className="text-sm text-slate-500 mb-3">Jumlah ini akan digunakan sebagai patokan dasar jika Anda membuat profil Mata Kuliah baru secara otomatis.</p>
                  <input
                    type="number"
                    defaultValue={14}
                    className="w-full max-w-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5">
                    Skala Penilaian Global
                  </label>
                  <div className="space-y-3 mt-3">
                    <label className="flex items-center gap-3 p-4 bg-white dark:bg-slate-950 border border-indigo-500 rounded-xl cursor-pointer ring-2 ring-indigo-500/20">
                      <input type="radio" name="gradingScale" defaultChecked className="w-5 h-5 accent-indigo-600" />
                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">Numerik 0 - 100</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Format standar penilaian universal (Misal: 85.5)</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                      <input type="radio" name="gradingScale" className="w-5 h-5 accent-indigo-600" />
                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">Huruf (A, B, C, D, E)</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Format penilaian berbasis huruf mutu</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button type="button" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-200 dark:shadow-none">
                    <Save className="w-5 h-5" /> Simpan Konfigurasi
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === "semesters" && (
             <div className="space-y-6">
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    Manage Semester
                  </h2>
                  <div className="space-y-3">
                    {semesters.length === 0 ? <p className="text-slate-500 text-sm">Belum ada data semester tersimpan.</p> : null}
                    {semesters.map((s, index) => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <div>
                           <div className="flex items-center gap-2">
                             <h4 className="font-bold text-slate-800 dark:text-slate-200">{s.name}</h4>
                             {index === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold uppercase tracking-wider">Aktif Terakhir</span>}
                           </div>
                           <p className="text-xs font-mono text-slate-500 mt-1">{s.startDate.toLocaleDateString("id-ID")} - {s.endDate.toLocaleDateString("id-ID")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-500" /> Tambah Semester Baru
                  </h3>
                  <form action={createSemesterConfig} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Semester</label>
                      <input type="text" name="name" required placeholder="Contoh: Ganjil 2026/2027" className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Rentang Waktu Semester</label>
                      <DateRangePicker />
                    </div>
                    <button type="submit" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all">
                      Simpan Semester
                    </button>
                  </form>
                </div>
             </div>
          )}

          {tab === "database" && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl">
                  <AlertOctagon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-rose-900 dark:text-rose-400 mb-2 border-b border-rose-200 dark:border-rose-900/50 pb-4">
                    Danger Zone: Cleansing Data
                  </h2>
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-500 mt-4 mb-6">
                    Tindakan ini akan menghapus <strong>SELURUH IDENTITAS AKADEMIK</strong> mencakup Semua Semester, Mata Kuliah, Daftar Sesi, dan Histori Tracker yang ada di dalam server SQLite ini tanpa bisa dikembalikan.
                  </p>
                  <CleansingButtonClient nukeAction={nukeDatabase} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
