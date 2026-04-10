"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef } from "react";

type SessionEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    courseName: string;
    hasDiscussion: boolean;
    hasTask: boolean;
  };
};

export default function CalendarClient({ events }: { events: SessionEvent[] }) {
  const calendarRef = useRef<FullCalendar>(null);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm text-slate-800 dark:text-slate-200 premium-calendar">
      <style dangerouslySetInnerHTML={{__html: `
        .premium-calendar .fc-theme-standard td, 
        .premium-calendar .fc-theme-standard th, 
        .premium-calendar .fc-theme-standard .fc-scrollgrid {
          border-color: rgba(203, 213, 225, 0.3) !important;
        }
        .dark .premium-calendar .fc-theme-standard td, 
        .dark .premium-calendar .fc-theme-standard th, 
        .dark .premium-calendar .fc-theme-standard .fc-scrollgrid {
          border-color: rgba(51, 65, 85, 0.4) !important;
        }
        .premium-calendar .fc-col-header-cell {
          padding: 12px 0;
          font-weight: 600;
          font-size: 0.875rem;
          color: #64748b;
        }
        .dark .premium-calendar .fc-col-header-cell {
          color: #94a3b8;
        }
        .premium-calendar .fc-button-primary {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
          text-transform: capitalize;
          border-radius: 0.5rem;
          padding: 0.4rem 1rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .premium-calendar .fc-button-primary:hover {
          background-color: #4338ca !important;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }
        .premium-calendar .fc-button-primary:not(:disabled):active,
        .premium-calendar .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #3730a3 !important;
        }
        .premium-calendar .fc-today-button {
          background-color: white !important;
          border: 1px solid #e2e8f0 !important;
          color: #475569 !important;
        }
        .dark .premium-calendar .fc-today-button {
          background-color: #1e293b !important;
          border-color: #334155 !important;
          color: #cbd5e1 !important;
        }
        .premium-calendar .fc-day-today {
          background-color: rgba(79, 70, 229, 0.05) !important;
        }
        .dark .premium-calendar .fc-day-today {
          background-color: rgba(99, 102, 241, 0.1) !important;
        }
        .premium-calendar .fc-event {
          border-radius: 6px;
          border: none;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}} />

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        height="auto"
        dayMaxEvents={true}
        eventContent={(eventInfo) => {
          const { hasDiscussion, hasTask, courseName } = eventInfo.event.extendedProps;
          return (
            <div className="flex flex-col p-1 w-full overflow-hidden">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="font-bold truncate text-white drop-shadow-sm">{eventInfo.event.title}</span>
                {(hasDiscussion || hasTask) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 shadow-sm" title="Ada Diskusi/Tugas"></span>
                )}
              </div>
              <span className="text-[10px] opacity-90 truncate text-indigo-50 font-medium">{courseName}</span>
            </div>
          );
        }}
        eventClassNames={(eventInfo) => {
          const colorClass = eventInfo.event.extendedProps.colorClass || "bg-indigo-500";
          return [colorClass, "shadow-sm", "cursor-pointer", "transition-colors", "border-none", "hover:brightness-110"];
        }}
      />
    </div>
  );
}
