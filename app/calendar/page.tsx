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
    { bg: "bg-indigo-500", hex: "#6366f1", border: "#4f46e5", text: "text-indigo-50" },
    { bg: "bg-emerald-500", hex: "#10b981", border: "#059669", text: "text-emerald-50" },
    { bg: "bg-rose-500", hex: "#f43f5e", border: "#e11d48", text: "text-rose-50" },
    { bg: "bg-amber-500", hex: "#f59e0b", border: "#d97706", text: "text-amber-50" },
    { bg: "bg-fuchsia-500", hex: "#d946ef", border: "#c026d3", text: "text-fuchsia-50" },
    { bg: "bg-blue-500", hex: "#3b82f6", border: "#2563eb", text: "text-blue-50" },
    { bg: "bg-cyan-500", hex: "#06b6d4", border: "#0891b2", text: "text-cyan-50" },
    { bg: "bg-violet-500", hex: "#8b5cf6", border: "#7c3aed", text: "text-violet-50" },
    { bg: "bg-orange-500", hex: "#f97316", border: "#ea580c", text: "text-orange-50" },
    { bg: "bg-teal-500", hex: "#14b8a6", border: "#0d9488", text: "text-teal-50" },
  ];
  
  // Use a map to assign a base color index to each unique courseId
  const courseColorIndexMap = new Map<string, number>();
  // Use a map to track the session count/index per course
  const courseSessionCounterMap = new Map<string, number>();
  let nextColorIndex = 0;

  const events = sessions.map((session) => {
    // Assign base color for the course if not already assigned
    if (!courseColorIndexMap.has(session.courseId)) {
      courseColorIndexMap.set(session.courseId, nextColorIndex % colorPalette.length);
      nextColorIndex++;
    }
    
    // Get and increment the session index for this course
    const currentSessionIdx = courseSessionCounterMap.get(session.courseId) || 0;
    courseSessionCounterMap.set(session.courseId, currentSessionIdx + 1);

    const baseIdx = courseColorIndexMap.get(session.courseId)!;
    // Each session of the same course gets an offset color from the palette
    // multiplying by 2 to jump further in the palette for visual distinction
    const sessionColorIdx = (baseIdx + (currentSessionIdx * 2)) % colorPalette.length;
    
    const color = colorPalette[sessionColorIdx];
    
    return {
      id: session.id,
      title: session.name,
      start: session.startDate,
      end: session.endDate,
      backgroundColor: color.hex,
      borderColor: color.border,
      extendedProps: {
        courseName: session.course.name,
        hasDiscussion: session.hasDiscussion,
        hasTask: session.hasTask,
        colorClass: color.bg,
        textColorClass: color.text
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
