"use client";

import { CheckCircle2, Award, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { upsertStudyRecord } from "@/lib/actions";

// We'll define a quick type based on what we passed down
type SessionWithRecords = {
  id: string;
  name: string;
  hasDiscussion: boolean;
  hasTask: boolean;
  startDate: Date;
  studyRecords: any[];
};

export default function TrackerFormClient({ courseId, sessions }: { courseId: string; sessions: SessionWithRecords[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleSave(sessionId: string, formData: FormData) {
    setLoadingId(sessionId);
    try {
      await upsertStudyRecord(sessionId, formData, courseId);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {sessions.map((session, index) => {
        const record = session.studyRecords[0] || {};
        
        return (
          <div key={session.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
            <form action={(fData) => handleSave(session.id, fData)} className="flex flex-col md:flex-row gap-6 md:items-center">
              {/* Session Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.name}</h3>
                </div>
                <p className="text-xs font-semibold text-slate-500 ml-11">
                  {new Date(session.startDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Checklist Toggles */}
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name="attendance" defaultChecked={record.attendance !== false} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                    Hadir
                  </span>
                </label>

                {session.hasDiscussion && (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name="discussion" defaultChecked={!!record.discussion} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                      Diskusi
                    </span>
                  </label>
                )}

                {session.hasTask && (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name="task" defaultChecked={!!record.task} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                      Tugas / Kuis
                    </span>
                  </label>
                )}
              </div>

              {/* Score Input */}
              <div className="w-32">
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    step="0.01"
                    name="score"
                    placeholder="Nilai..."
                    defaultValue={record.score || ""}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div>
                <button 
                  type="submit"
                  disabled={loadingId === session.id}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {loadingId === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        );
      })}
    </div>
  );
}
