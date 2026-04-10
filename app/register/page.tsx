import { registerUser } from "@/lib/auth-actions";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <UserPlus className="w-8 h-8" />
           </div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create Account</h1>
           <p className="text-slate-500 text-sm mt-2">Daftar sekarang untuk melacak performa Anda.</p>
        </div>

        <form action={registerUser} className="space-y-5">
           <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
              <input 
                 type="text" 
                 name="name" 
                 required 
                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
              />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input 
                 type="email" 
                 name="email" 
                 required 
                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
              />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input 
                 type="password" 
                 name="password" 
                 required 
                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
              />
           </div>
           
           <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2">
             Buat Akun Anda
           </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Sudah punya akun? <Link href="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Sign In di sini</Link>
        </p>
      </div>
    </div>
  );
}
