"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { FormEvent } from "react";
import Swal from "sweetalert2";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-200 dark:shadow-none disabled:opacity-50"
    >
      {pending ? <AlertTriangle className="w-5 h-5 animate-pulse" /> : <Trash2 className="w-5 h-5" />}
      {pending ? "Menghapus..." : "Nuke Database"}
    </button>
  );
}

export default function CleansingButtonClient({ nukeAction }: { nukeAction: (formData: FormData) => void }) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    // Create FormData immediately
    const formData = new FormData(e.currentTarget);

    Swal.fire({
      title: "Peringatan Kritis",
      html: "Apakah Anda yakin ingin <b>MENUKLIR</b> seluruh identitas akademik, semester, mata kuliah, sesi, dan triliunan usaha belajar Anda?<br><br>Data <b>TIDAK BISA KEMBALI!</b>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#475569", // slate-600
      confirmButtonText: "Ya, Nuke Database!",
      cancelButtonText: "Batal",
      background: document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      borderRadius: "1rem"
    }).then((result) => {
      if (result.isConfirmed) {
        nukeAction(formData);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton />
    </form>
  );
}
