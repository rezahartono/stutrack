import { ChevronRight, Filter, Target, CheckCircle2, FileEdit, Award } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import TrackerFormClient from "./TrackerFormClient";
import TrackerFilterClient from "./TrackerFilterClient";

export default async function StudyTrackerPage(props: { searchParams: Promise<{ semesterId?: string; courseId?: string }> }) {
  const searchParams = await props.searchParams;
  const { semesterId, courseId } = searchParams;

  const semesters = await db.semester.findMany({
    orderBy: { createdAt: "desc" }
  });

  const activeSemesterId = semesterId || (semesters.length > 0 ? semesters[0].id : null);

  const courses = activeSemesterId ? await db.course.findMany({
    where: { semesterId: activeSemesterId },
    orderBy: { name: "asc" }
  }) : [];

  const activeCourse = courseId ? await db.course.findUnique({
    where: { id: courseId },
    include: {
      sessions: {
        orderBy: { startDate: "asc" },
        include: {
          studyRecords: true
        }
      }
    }
  }) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Study Tracker</h1>
          <p className="text-slate-500 mt-1">Input aktivitas belajar harian, absensi, dan nilai Anda per mata kuliah.</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
            <Filter className="w-5 h-5 text-indigo-500" /> Filter Data:
          </div>
          
          {/* Workaround for dropdown selection using Links - we use a wrapper Client component in a real app or native forms, but standard anchor links work too. Here we use basic native HTML select that submits via a tiny client script or a form. We'll use a form with GET method. */}
          <TrackerFilterClient 
            semesters={semesters} 
            courses={courses} 
            activeSemesterId={activeSemesterId} 
            activeCourseId={courseId || null} 
          />
        </div>
      </div>

      {!activeCourse ? (
        <div className="bg-white/30 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pilih Mata Kuliah</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Silakan pilih Semester dan Mata Kuliah terlebih dahulu pada filter di atas untuk mulai melakukan perekaman data belajar harian.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{activeCourse.name}</h2>
              <p className="text-sm font-medium text-slate-500 font-mono">Kode: {activeCourse.code}</p>
            </div>
            <div className="flex gap-4">
                <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-4 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Sesi</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{activeCourse.sessions.length}</p>
                </div>
            </div>
          </div>

          <div className="p-0">
            {/* Client Component to handle forms optimally */}
            {activeCourse.sessions.length === 0 ? (
               <div className="p-12 text-center text-slate-500">Belum ada sesi di mata kuliah ini.</div>
            ) : (
               <TrackerFormClient courseId={activeCourse.id} sessions={activeCourse.sessions} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
