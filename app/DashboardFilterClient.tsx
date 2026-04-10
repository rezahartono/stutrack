"use client";

import { useRouter } from "next/navigation";

export default function DashboardFilterClient({
  view,
  activeSemesterId,
  courseId,
  semesters,
  allCoursesInSemester
}: {
  view: string;
  activeSemesterId: string | null;
  courseId: string | null;
  semesters: { id: string; name: string }[];
  allCoursesInSemester: { id: string; name: string }[];
}) {
  const router = useRouter();

  const handleSemesterChange = (newSemesterId: string) => {
    // If we change semester, we probably want to reset courseId context from URL 
    router.push(`/?view=${view}&semesterId=${newSemesterId}`);
  };

  const handleCourseChange = (newCourseId: string) => {
    if (activeSemesterId) {
      router.push(`/?view=${view}&semesterId=${activeSemesterId}&courseId=${newCourseId}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={activeSemesterId || ""}
        onChange={(e) => handleSemesterChange(e.target.value)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      
      {(view === "course" || view === "session") && (
        <select 
          value={courseId || (allCoursesInSemester[0]?.id) || ""}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none max-w-xs"
        >
          {allCoursesInSemester.length === 0 ? <option disabled value="">Kosong</option> : null}
          {allCoursesInSemester.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}
    </div>
  );
}
