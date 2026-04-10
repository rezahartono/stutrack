import { db } from "@/lib/db";
import { loginUser } from "@/lib/auth-actions";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default async function LoginPage() {
  // Auto-seed a SUPERADMIN if completely empty
  const adminExists = await db.user.findFirst({ where: { role: "SUPERADMIN" } });
  if (!adminExists) {
    await db.user.create({
      data: {
        name: "Super Administrator",
        email: process.env.SUPERADMIN_EMAIL || "admin@stutrack.id",
        password: process.env.SUPERADMIN_PASSWORD || "admin", // in production use bcrypt!
        role: "SUPERADMIN"
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <LogIn className="w-8 h-8" />
           </div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Sign In to StuTrack</h1>
           <p className="text-slate-500 text-sm mt-2">Manage your academic journey effortlessly.</p>
        </div>

        <form action={loginUser} className="space-y-5">
           <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input 
                 type="email" 
                 name="email" 
                 required 
                 defaultValue="admin@stutrack.id"
                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input 
                 type="password" 
                 name="password" 
                 required 
                 defaultValue="admin"
                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              />
           </div>
           
           <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2">
             Login Sekarang
           </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Belum punya akun? <Link href="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
