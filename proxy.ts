import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar path yang tidak memerlukan login
const publicPaths = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Periksa apakah path saat ini adalah path publik
  const isPublicPath = publicPaths.includes(pathname);

  // Ambil token sesi dari cookie
  const authUserId = request.cookies.get('auth_user_id')?.value;

  // Jika kita berada di path yang membutuhkan login dan tidak ada token
  if (!isPublicPath && !authUserId) {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika kita sudah punya token dan mencoba mengakses halaman login/register
  if (isPublicPath && authUserId) {
    // Redirect ke dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Lanjutkan request jika tidak ada masalah
  return NextResponse.next();
}

// Tentukan path mana saja yang akan dicegat oleh middleware
export const config = {
  matcher: [
    // Kecualikan file statis, _next/static, _next/image, favicon.ico dan api routes jika ada
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
