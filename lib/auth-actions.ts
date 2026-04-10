"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findUnique({ where: { email } });
  
  // Note: in real app, compare bcrypt hashed password!
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  // Very simple simulation of a JWT session token via cookies
  const cookieStore = await cookies();
  cookieStore.set("auth_user_id", user.id, { httpOnly: true, secure: true, path: "/" });
  cookieStore.set("auth_user_role", user.role, { httpOnly: true, secure: true, path: "/" });
  cookieStore.set("auth_user_name", user.name, { httpOnly: false, secure: true, path: "/" }); // Non-HTTP only so UI can read it optionally

  revalidatePath("/");
  redirect("/");
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) throw new Error("Missing fields");

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const user = await db.user.create({
    data: { name, email, password, role: "USER" }
  });

  const cookieStore = await cookies();
  cookieStore.set("auth_user_id", user.id, { httpOnly: true, secure: true, path: "/" });
  cookieStore.set("auth_user_role", user.role, { httpOnly: true, secure: true, path: "/" });
  cookieStore.set("auth_user_name", user.name, { httpOnly: false, secure: true, path: "/" });

  revalidatePath("/");
  redirect("/");
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_user_id");
  cookieStore.delete("auth_user_role");
  cookieStore.delete("auth_user_name");

  revalidatePath("/");
  redirect("/login");
}

export async function updateUserRole(userId: string, formData: FormData) {
  const cookieStore = await cookies();
  const currentUserRole = cookieStore.get("auth_user_role")?.value;
  
  if (currentUserRole !== "SUPERADMIN") throw new Error("Unauthorized");

  const newRole = formData.get("role") as string;
  
  await db.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/users");
}

export async function deleteUser(userId: string) {
  const cookieStore = await cookies();
  const currentUserRole = cookieStore.get("auth_user_role")?.value;
  const currentUserId = cookieStore.get("auth_user_id")?.value;

  if (currentUserRole !== "SUPERADMIN") throw new Error("Unauthorized");
  if (currentUserId === userId) throw new Error("Cannot delete yourself");

  await db.user.delete({ where: { id: userId } });
  revalidatePath("/users");
}
