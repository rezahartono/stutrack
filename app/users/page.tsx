import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserCog, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";
import { updateUserRole, deleteUser } from "@/lib/auth-actions";

export default async function UserManagementPage() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("auth_user_role")?.value;
  const currentUserId = cookieStore.get("auth_user_id")?.value;

  if (userRole !== "SUPERADMIN") {
    // Hide this page entirely if not superadmin
    redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <UserCog className="w-8 h-8 text-indigo-500" /> Management User
        </h1>
        <p className="text-slate-500 mt-1">Area terbatas khusus Super Administrator.</p>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <th className="pb-3 px-4">Nama Lengkap</th>
                <th className="pb-3 px-4">Email Account</th>
                <th className="pb-3 px-4">Hak Akses</th>
                <th className="pb-3 px-4">Tgl Daftar</th>
                <th className="pb-3 px-4 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {user.name}
                    {user.id === currentUserId && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase font-bold">You</span>}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="py-4 px-4">
                    <form action={async (fd) => {
                      "use server";
                      if (user.id !== currentUserId) await updateUserRole(user.id, fd);
                    }} className="flex items-center gap-2">
                      <select 
                        name="role" 
                        defaultValue={user.role}
                        disabled={user.id === currentUserId}
                        onChange={async (e) => {
                          "use server";
                          // Workaround: We'll just submit the form via button to keep it pure server component.
                        }}
                        className={`bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold text-xs ${user.role === 'SUPERADMIN' ? 'text-indigo-600' : 'text-slate-600'}`}
                      >
                         <option value="USER">USER</option>
                         <option value="SUPERADMIN">SUPERADMIN</option>
                      </select>
                      {user.id !== currentUserId && (
                         <button type="submit" className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Update</button>
                      )}
                    </form>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-500">{user.createdAt.toLocaleDateString('id-ID')}</td>
                  <td className="py-4 px-4 text-right">
                    {user.id !== currentUserId ? (
                      <form action={async () => {
                         "use server";
                         await deleteUser(user.id);
                      }}>
                         <button type="submit" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors" title="Hapus User">
                           <Trash2 className="w-5 h-5 mx-auto" />
                         </button>
                      </form>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold mr-4">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
