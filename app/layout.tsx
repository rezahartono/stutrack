import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StuTrack - Elevate Your Learning",
  description: "Track your semesters, courses, sessions, and academic progress globally.",
};

import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("auth_user_id")?.value;

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30">
        {isAuthenticated ? (
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
              {children}
            </main>
          </div>
        ) : (
          <main className="min-h-screen">
             {children}
          </main>
        )}
      </body>
    </html>
  );
}
