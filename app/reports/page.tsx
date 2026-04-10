import { CheckCircle2, TrendingUp, UserCheck, AlertCircle } from "lucide-react";
import { db } from "@/lib/db";
import ReportFilterClient from "./ReportFilterClient";
import ReportControlsClient from "./ReportControlsClient";

export default async function ReportsPage(props: { searchParams: Promise<{ semesterId?: string }> }) {
  const searchParams = await props.searchParams;
  const { semesterId } = searchParams;

  const semesters = await db.semester.findMany({ orderBy: { createdAt: "desc" } });
  const activeSemesterId = semesterId || (semesters.length > 0 ? semesters[0].id : null);
  const activeSemesterName = semesters.find(s => s.id === activeSemesterId)?.name || "N/A";

  const allCourses = activeSemesterId ? await db.course.findMany({ 
    where: { semesterId: activeSemesterId }, 
    include: { sessions: { include: { studyRecords: true } } } 
  }) : [];

  let globalAttended = 0;
  let globalSessions = 0;
  let globalTasksComp = 0;
  let globalTasksTot = 0;
  let globalScoreSum = 0;
  let globalScoreCount = 0;

  const courseStats = allCourses.map(course => {
    let cAtt = 0, cSess = course.sessions.length, cTaskC = 0, cTaskT = 0, cScrS = 0, cScrC = 0;
    
    course.sessions.forEach(sess => {
      if (sess.hasDiscussion) cTaskT++;
      if (sess.hasTask) cTaskT++;
      
      sess.studyRecords.forEach(r => {
        if (r.attendance) cAtt++;
        if (r.discussion && sess.hasDiscussion) cTaskC++;
        if (r.task && sess.hasTask) cTaskC++;
        if (r.score != null) { cScrS += r.score; cScrC++; }
      });
    });

    globalAttended += cAtt; globalSessions += cSess;
    globalTasksComp += cTaskC; globalTasksTot += cTaskT;
    globalScoreSum += cScrS; globalScoreCount += cScrC;

    const avg = cScrC > 0 ? cScrS / cScrC : 0;
    const attPct = cSess > 0 ? (cAtt / cSess) * 100 : 0;
    const tskPct = cTaskT > 0 ? (cTaskC / cTaskT) * 100 : 0;

    return {
      ...course,
      attFraction: `${cAtt}/${cSess}`,
      tskFraction: `${cTaskC}/${cTaskT}`,
      avgScore: avg.toFixed(1),
      attPct: attPct.toFixed(0),
      tskPct: tskPct.toFixed(0),
      numericAvg: avg
    };
  });

  const percentAttendance = globalSessions > 0 ? ((globalAttended / globalSessions) * 100).toFixed(0) : "0";
  const percentTasks = globalTasksTot > 0 ? ((globalTasksComp / globalTasksTot) * 100).toFixed(0) : "0";
  const avgOverallScore = globalScoreCount > 0 ? (globalScoreSum / globalScoreCount).toFixed(1) : "0.0";
  const maxScoreChart = 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Laporan Hasil Belajar</h1>
          <p className="text-slate-500 mt-1">Rekap performa akademik: <strong>{activeSemesterName}</strong></p>
        </div>
        <div className="flex items-center gap-3">
          <ReportFilterClient semesters={semesters} activeSemesterId={activeSemesterId} />
          <ReportControlsClient />
        </div>
      </div>

      {allCourses.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          Belum ada data mata kuliah pada semester ini.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <p className="text-indigo-100 font-medium mb-1">Nilai Rata-Rata Sesi</p>
                <h2 className="text-4xl font-black mb-4">{avgOverallScore}<span className="text-lg font-medium text-indigo-200">/100</span></h2>
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                  <TrendingUp className="w-3.5 h-3.5" /> Berdasarkan {globalScoreCount} Entri Nilai
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                 <UserCheck className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 font-medium mb-1">Persentase Kehadiran</p>
                <h2 className="text-4xl font-black mb-4">{percentAttendance}%</h2>
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                  <AlertCircle className="w-3.5 h-3.5" /> Absen/Alpa: {globalSessions - globalAttended} Sesi
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden group">
               <div className="absolute right-0 top-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                 <CheckCircle2 className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <p className="text-emerald-100 font-medium mb-1">Penyelesaian Aktivitas</p>
                <h2 className="text-4xl font-black mb-4">{percentTasks}%</h2>
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {globalTasksComp}/{globalTasksTot} Checklist Clear
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Detail Progress Per Mata Kuliah</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <th className="pb-3 px-4">Mata Kuliah</th>
                      <th className="pb-3 px-4">Kehadiran</th>
                      <th className="pb-3 px-4">Tasks</th>
                      <th className="pb-3 px-4">Nilai</th>
                      <th className="pb-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {courseStats.map((c) => (
                      <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                        <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">{c.attPct}% ({c.attFraction})</td>
                        <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">{c.tskPct}% ({c.tskFraction})</td>
                        <td className="py-4 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                          {c.avgScore}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold text-xs ${c.numericAvg >= 80 ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-amber-700 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                            {c.numericAvg >= 80 ? 'Aman' : 'Perlu Atensi'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Grafik Nilai</h3>
               <div className="flex items-end gap-3 h-64 mt-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                 {courseStats.map((c, i) => {
                   const heightPct = (c.numericAvg / maxScoreChart) * 100;
                   return (
                     <div key={c.id} className="flex-1 flex flex-col items-center justify-end group">
                        <span className="text-xs font-bold text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{c.avgScore}</span>
                        <div 
                          className="w-full bg-indigo-500 hover:bg-indigo-400 rounded-t-md transition-all shadow-sm"
                          style={{ height: `${Math.max(heightPct, 2)}%` }}
                        ></div>
                        <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center" title={c.name}>
                          {c.code || `C${i}`}
                        </span>
                     </div>
                   )
                 })}
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
