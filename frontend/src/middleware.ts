import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Daftar rute admin
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // Ambil token dari cookie (akan diset saat login nanti)
  const token = request.cookies.get('admin_token')?.value;
  const clientToken = request.cookies.get('admin_client_token')?.value;

  // Jika mengakses rute admin (kecuali login) dan tidak ada token
  if (isAdminRoute && !isLoginPage && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    // Opsional: simpan URL asal untuk redirect kembali setelah login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah punya token dan mencoba mengakses halaman login
  if (isLoginPage && token) {
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (!clientToken) {
      response.cookies.set('admin_client_token', token, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return response;
  }

  const response = NextResponse.next();
  if (isAdminRoute && token && !clientToken) {
    response.cookies.set('admin_client_token', token, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}

export const config = {
  // Hanya jalankan middleware ini pada rute-rute admin
  matcher: ['/admin/:path*'],
};
