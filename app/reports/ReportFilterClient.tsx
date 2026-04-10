"use client";

import { useRouter } from "next/navigation";

export default function ReportFilterClient({
  semesters,
  activeSemesterId
}: {
  semesters: { id: string; name: string }[];
  activeSemesterId: string | null;
}) {
  const router = useRouter();

  return (
    <select 
      value={activeSemesterId || ""}
      onChange={(e) => router.push(`/reports?semesterId=${e.target.value}`)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    >
      <option value="" disabled>Pilih Semester</option>
      {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
  );
}
