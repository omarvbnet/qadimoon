import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('authToken');

  if (!token) {
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن مصادقًا
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // السماح بالوصول إذا كان المستخدم مصادقًا
}

export const config = {
  matcher: '/homepage', // حماية صفحة homepage فقط
};