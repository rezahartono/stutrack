"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import Swal from "sweetalert2";

export default function ReportControlsClient() {
  const handlePrint = () => {
    window.print();
  };

  const handleExcelExport = () => {
    Swal.fire({
      title: "Export Fitur",
      text: "Simulasi: File data.xlsx berhasil digenerate di background (Memerlukan library backend seperti sheetjs/exceljs untuk implementasi riil produksi).",
      icon: "info",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#4f46e5"
    });
  };

  return (
    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 p-1 rounded-xl">
      <button 
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
      >
        <FileText className="w-4 h-4" /> Export PDF
      </button>
      <button 
        onClick={handleExcelExport}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4" /> Export Excel
      </button>
    </div>
  );
}
