import { db } from "@/lib/db";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
  const sessions = await db.session.findMany({
    include: {
      course: true,
    },
    orderBy: { startDate: "asc" }
  });

  const colorPalette = [
    "bg-indigo-500", "bg-emerald-500", "bg-rose-500", 
    "bg-amber-500", "bg-fuchsia-500", "bg-blue-500", "bg-cyan-500"
  ];
  
  // Use a map to assign a consistent color to each unique courseId
  const courseColorMap = new Map<string, string>();
  let colorIndex = 0;

  const events = sessions.map(session => {
    if (!courseColorMap.has(session.courseId)) {
      courseColorMap.set(session.courseId, colorPalette[colorIndex % colorPalette.length]);
      colorIndex++;
    }
    
    return {
      id: session.id,
      title: session.name,
      start: session.startDate,
      end: session.endDate,
      extendedProps: {
        courseName: session.course.name,
        hasDiscussion: session.hasDiscussion,
        hasTask: session.hasTask,
        colorClass: courseColorMap.get(session.courseId)
      }
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Kalender Jadwal</h1>
          <p className="text-slate-500 mt-1">Pantau seluruh jadwal sesi pertemuan kuliah Anda menggunakan FullCalendar.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option>Semester Aktif</option>
            <option>Semua Semester</option>
          </select>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
        <CalendarClient events={events} />
      </div>
    </div>
  );
}
