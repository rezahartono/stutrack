"use client";

import { useRouter } from "next/navigation";

type Semester = { id: string; name: string };
type Course = { id: string; name: string };

export default function TrackerFilterClient({
  semesters,
  courses,
  activeSemesterId,
  activeCourseId
}: {
  semesters: Semester[];
  courses: Course[];
  activeSemesterId: string | null;
  activeCourseId: string | null;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
      <div className="flex-1">
        <select 
          value={activeSemesterId || ""}
          onChange={(e) => {
            const val = e.target.value;
            router.push(`/study-tracker?semesterId=${val}`);
          }}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
        >
          <option value="" disabled>Pilih Semester</option>
          {semesters.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <select 
          value={activeCourseId || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (activeSemesterId) {
               router.push(`/study-tracker?semesterId=${activeSemesterId}&courseId=${val}`);
            }
          }}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium disabled:opacity-50 cursor-pointer"
          disabled={!activeSemesterId || courses.length === 0}
        >
          <option value="" disabled>{courses.length === 0 ? "Tidak ada Mata Kuliah" : "Pilih Mata Kuliah"}</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
