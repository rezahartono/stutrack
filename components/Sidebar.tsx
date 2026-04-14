import Link from "next/link";
import { LayoutDashboard, BookText, CalendarDays, Calendar, FileBarChart, Settings, Users, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { logoutUser } from "@/lib/auth-actions";

export async function Sidebar() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("auth_user_name")?.value || "Guest";
  const userRole = cookieStore.get("auth_user_role")?.value || "USER";

  const menus = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Study Tracker", href: "/study-tracker", icon: BookText },
    { name: "Mata Kuliah", href: "/courses", icon: BookText },
    { name: "Jadwal", href: "/schedule", icon: CalendarDays },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Reports", href: "/reports", icon: FileBarChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (userRole === "SUPERADMIN") {
    menus.push({ name: "User Management", href: "/users", icon: Users });
  }

  return (
    <aside className="w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
          <BookText className="w-6 h-6" />
          <span>StuTrack</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            href={menu.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <menu.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {menu.name}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{userName}</span>
            <span className="text-[10px] text-slate-500 font-mono">{userRole}</span>
          </div>
        </div>
        
        {userName !== "Guest" && (
          <form action={logoutUser}>
             <button type="submit" className="w-full flex justify-center items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-2 rounded-lg transition-colors">
               <LogOut className="w-4 h-4" /> Keluar Sesi
             </button>
          </form>
        )}
      </div>
    </aside>
  );
}
