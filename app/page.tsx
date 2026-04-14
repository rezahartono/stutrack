import { Calendar, CheckCircle2, TrendingUp, Presentation, BookOpen, Clock, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import DashboardFilterClient from "./DashboardFilterClient";

// Helper function to calculate stats
function calculateStats(records: any[], totalSessions: number, totalDiscussionTasks: number) {
  let attended = 0;
  let discussionTaskCompleted = 0;
  let scoreSum = 0;
  let scoreCount = 0;

  records.forEach(r => {
    if (r.attendance) attended++;
    if (r.discussion) discussionTaskCompleted++;
    if (r.task) discussionTaskCompleted++;
    if (r.score != null) {
      scoreSum += r.score;
      scoreCount++;
    }
  });

  const attendancePercent = totalSessions > 0 ? (attended / totalSessions) * 100 : 0;
  const taskPercent = totalDiscussionTasks > 0 ? (discussionTaskCompleted / totalDiscussionTasks) * 100 : 0;
  const avgScore = scoreCount > 0 ? (scoreSum / scoreCount) : 0;

  return {
    attendancePercent: attendancePercent.toFixed(1),
    taskPercent: taskPercent.toFixed(1),
    avgScore: avgScore.toFixed(1)
  };
}

export default async function Dashboard(props: { searchParams: Promise<{ view?: string; semesterId?: string; courseId?: string }> }) {
  const searchParams = await props.searchParams;
  const view = searchParams.view || "semester";
  const { semesterId, courseId } = searchParams;

  const semesters = await db.semester.findMany({ orderBy: { createdAt: "desc" } });
  const activeSemesterId = semesterId || (semesters.length > 0 ? semesters[0].id : null);
  
  // Base Query based on View
  let stats = { attendancePercent: "0.0", taskPercent: "0.0", avgScore: "0.0" };
  let title = "Dashboard Global";
  let totalSessionsContext = 0;
  
  // Specific Data Lookups
  const allCoursesInSemester = activeSemesterId ? await db.course.findMany({ 
    where: { semesterId: activeSemesterId }, 
    include: { sessions: { include: { studyRecords: true } } } 
  }) : [];

  if (view === "semester") {
    title = semesters.find(s => s.id === activeSemesterId)?.name || "Semester Aktif";
    let allRecords: any[] = [];
    let totSess = 0;
    let totTasks = 0;
    
    allCoursesInSemester.forEach(course => {
      totSess += course.sessions.length;
      course.sessions.forEach(sess => {
        if (sess.hasDiscussion) totTasks++;
        if (sess.hasTask) totTasks++;
        allRecords.push(...sess.studyRecords);
      });
    });
    
    totalSessionsContext = totSess;
    stats = calculateStats(allRecords, totSess, totTasks);
  } else if (view === "course") {
    // Need a specific course
    const activeCourseIdContext = courseId || (allCoursesInSemester.length > 0 ? allCoursesInSemester[0].id : null);
    const activeCourse = allCoursesInSemester.find(c => c.id === activeCourseIdContext);
    if (activeCourse) {
       title = `Progres: ${activeCourse.name}`;
       let allRecords: any[] = [];
       let totSess = activeCourse.sessions.length;
       let totTasks = 0;
       activeCourse.sessions.forEach(sess => {
          if (sess.hasDiscussion) totTasks++;
          if (sess.hasTask) totTasks++;
          allRecords.push(...sess.studyRecords);
       });
       totalSessionsContext = totSess;
       stats = calculateStats(allRecords, totSess, totTasks);
    }
  } else if (view === "session") {
    // Sesi implies seeing the breakdown of a course's individual sessions
     const activeCourseIdContext = courseId || (allCoursesInSemester.length > 0 ? allCoursesInSemester[0].id : null);
     const activeCourse = allCoursesInSemester.find(c => c.id === activeCourseIdContext);
     if (activeCourse) title = `Sesi Pertemuan: ${activeCourse.name}`;
  }

  const statCards = [
    { name: "Kehadiran", value: stats.attendancePercent, unit: "%", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Tugas & Diskusi", value: stats.taskPercent, unit: "%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Averase Nilai", value: stats.avgScore, unit: "", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Beban Pertemuan", value: totalSessionsContext, unit: "Sesi", icon: Presentation, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Pantau ringkasan performa dan jejak belajar terkini.</p>
        </div>
        
        {/* Unified Top Filters */}
        <div className="flex items-center gap-3">
          <DashboardFilterClient 
            view={view}
            activeSemesterId={activeSemesterId}
            courseId={courseId || null}
            semesters={semesters}
            allCoursesInSemester={allCoursesInSemester}
          />
        </div>
      </div>

      {/* Tabs Type Selector */}
      <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl w-full sm:w-auto overflow-x-auto ring-1 ring-slate-200 dark:ring-slate-800">
         <Link href={`/?view=semester&semesterId=${activeSemesterId || ""}`} className={`flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'semester' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
            Per Semester
         </Link>
         <Link href={`/?view=course&semesterId=${activeSemesterId || ""}&courseId=${courseId || ""}`} className={`flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'course' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
            Per Mata Kuliah
         </Link>
         <Link href={`/?view=session&semesterId=${activeSemesterId || ""}&courseId=${courseId || ""}`} className={`flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'session' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
            Per Sesi Khusus
         </Link>
      </div>

      {/* Today's Classes Section */}
      {(() => {
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const todayName = days[new Date().getDay()];
        const todayClasses = allCoursesInSemester.filter(c => c.day === todayName);
        
        if (todayClasses.length === 0) return null;

        return (
          <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <CalendarDays className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Kuliah Hari Ini ({todayName})</h3>
                </div>
                <Link href="/schedule" className="text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg transition-colors">
                  Lihat Semua →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayClasses.map(c => (
                  <div key={c.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold leading-tight">{c.name}</h4>
                        <span className="text-[10px] uppercase font-black bg-indigo-500/50 px-2 py-0.5 rounded flex-shrink-0">{c.category}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/70 text-xs font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{c.startTime || "--:--"}</span>
                        </div>
                        {c.room && (
                          <div className="flex items-center gap-1 border-l border-white/20 pl-3">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{c.room}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-200">{title}</h2>
      </div>

      {view !== 'session' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.name} className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon className="w-24 h-24" />
              </div>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                    {stat.unit && <span className="text-sm font-medium text-slate-500">{stat.unit}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Breakdowns Component Base on View */}
      <div className="mt-8">
         {(view === "semester") && (
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500"/> Komposisi Mata Kuliah Semester Ini</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {allCoursesInSemester.length === 0 ? <p className="text-slate-500 text-sm">Belum ada mata kuliah.</p> : null}
                 {allCoursesInSemester.map(c => {
                   let cTotSess = c.sessions.length;
                   let cTotTasks = 0;
                   let cRec: any[] = [];
                   c.sessions.forEach(sess => {
                     if (sess.hasDiscussion) cTotTasks++;
                     if (sess.hasTask) cTotTasks++;
                     cRec.push(...sess.studyRecords);
                   });
                   const stat = calculateStats(cRec, cTotSess, cTotTasks);
                   return (
                     <Link href={`/?view=course&semesterId=${activeSemesterId}&courseId=${c.id}`} key={c.id} className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-colors">
                       <h4 className="font-bold text-slate-900 dark:text-white">{c.name}</h4>
                       <p className="text-xs text-slate-500 mb-3">{cTotSess} Sesi Terjadwal</p>
                       <div className="flex justify-between text-sm font-medium mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Kehadiran</span>
                          <span className={`${parseFloat(stat.attendancePercent) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{stat.attendancePercent}%</span>
                       </div>
                       <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Nilai</span>
                          <span className="text-indigo-500">{stat.avgScore}</span>
                       </div>
                     </Link>
                   )
                 })}
               </div>
            </div>
         )}
         
         {(view === "session") && (
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500"/> Rincian Kinerja per Sesi</h3>
               {(() => {
                 const activeCourseIdContext = courseId || (allCoursesInSemester.length > 0 ? allCoursesInSemester[0].id : null);
                 const activeCourse = allCoursesInSemester.find(c => c.id === activeCourseIdContext);
                 
                 if (!activeCourse || activeCourse.sessions.length === 0) return <p className="text-slate-500">Sesi kosong pada mata kuliah ini.</p>;
                 
                 return (
                   <div className="space-y-3">
                     {activeCourse.sessions.map((sess, i) => {
                       const rec = sess.studyRecords[0];
                       const isAttended = rec && rec.attendance;
                       return (
                         <div key={sess.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full font-black flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{i + 1}</div>
                               <div>
                                 <h4 className="font-bold text-slate-800 dark:text-slate-200">{sess.name}</h4>
                                 <p className="text-xs text-slate-500">{sess.startDate.toLocaleDateString('id-ID')}</p>
                               </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                               <span className={`px-2.5 py-1 rounded text-xs font-bold ${isAttended ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                  {isAttended ? 'Hadir' : 'Absen'}
                               </span>
                               {sess.hasDiscussion && (
                                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${rec?.discussion ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                    Disk {rec?.discussion ? '✓' : '✗'}
                                  </span>
                               )}
                               {sess.hasTask && (
                                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${rec?.task ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                    Task {rec?.task ? '✓' : '✗'}
                                  </span>
                               )}
                               <span className="w-16 text-center font-bold text-indigo-500 border border-indigo-100 dark:border-indigo-500/30 px-2 py-1.5 rounded-md text-sm">{rec?.score || "-"}</span>
                            </div>
                         </div>
                       )
                     })}
                   </div>
                 )
               })()}
            </div>
         )}
      </div>
    </div>
  );
}
