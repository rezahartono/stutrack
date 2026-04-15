"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, isToday, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DateRangePickerProps {
  initialStartDate?: string;
  initialEndDate?: string;
  onRangeChange?: (start: string, end: string) => void;
}

export default function DateRangePicker({ initialStartDate, initialEndDate, onRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate ? parseISO(initialStartDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate ? parseISO(initialEndDate) : null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setStartDate(day);
        setEndDate(startDate);
      } else {
        setEndDate(day);
      }
    }
  };

  useEffect(() => {
    if (startDate && endDate && onRangeChange) {
      onRangeChange(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"));
    }
  }, [startDate, endDate, onRangeChange]);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
        <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </span>
        <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-[10px] font-bold text-center text-slate-400 uppercase py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateView = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateView = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    const daysInInterval = eachDayOfInterval({ start: startDateView, end: endDateView });

    return (
      <div className="grid grid-cols-7">
        {daysInInterval.map((day, idx) => {
          const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
          const isInRange = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`
                h-8 w-8 flex items-center justify-center text-xs rounded-lg transition-all relative
                ${!isCurrentMonth ? "text-slate-300 dark:text-slate-700" : "text-slate-700 dark:text-slate-300"}
                ${isSelected ? "bg-indigo-600 text-white font-bold z-10" : "hover:bg-indigo-50 dark:hover:bg-indigo-500/10"}
                ${isInRange && !isSelected ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}
                ${isToday(day) && !isSelected ? "border border-indigo-200 dark:border-indigo-800" : ""}
              `}
            >
              {format(day, "d")}
              {isInRange && !isSelected && (
                <div className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-500/5 -z-10" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500/50"
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className={startDate ? "text-slate-900 dark:text-slate-200" : "text-slate-400"}>
            {startDate ? (
              endDate ? `${format(startDate, "dd/MM/yy")} - ${format(endDate, "dd/MM/yy")}` : format(startDate, "dd/MM/yy")
            ) : "Pilih rentang tanggal"}
          </span>
        </div>
        {(startDate || endDate) && (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setStartDate(null);
              setEndDate(null);
            }}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>

      <input type="hidden" name="startDate" value={startDate ? format(startDate, "yyyy-MM-dd") : ""} />
      <input type="hidden" name="endDate" value={endDate ? format(endDate, "yyyy-MM-dd") : ""} />

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 w-[280px]">
          {renderHeader()}
          <div className="p-2">
            {renderDays()}
            {renderCells()}
          </div>
          <div className="flex items-center justify-between p-2 border-t border-slate-100 dark:border-slate-800 mt-2">
             <button 
               type="button" 
               onClick={() => {
                 setStartDate(null);
                 setEndDate(null);
               }}
               className="text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-2 py-1 rounded-md"
             >
               Reset
             </button>
             <button 
               type="button" 
               onClick={() => setIsOpen(false)}
               className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors"
             >
               Selesai
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
