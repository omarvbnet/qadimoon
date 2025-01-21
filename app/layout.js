'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Nav'; // مكون التنقل
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // إدارة حالة تسجيل الدخول
  const router = useRouter();

  // التحقق من حالة تسجيل الدخول عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoggedIn(false);
      router.push('/login'); // إعادة التوجيه إذا لم يكن المستخدم مسجلاً
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  // تحديث حالة تسجيل الدخول عند تسجيل الدخول أو الخروج
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken'); // حذف التوكن
    router.push('/login'); // إعادة التوجيه إلى صفحة تسجيل الدخول
  };

  return (
    <html lang="ar" dir="rtl">
      <body>
        {isLoggedIn && <Navbar onLogout={handleLogout} />} {/* عرض Navbar فقط إذا كان المستخدم مسجلاً */}
        {React.cloneElement(children, { onLogin: handleLogin })} {/* تمرير دالة تسجيل الدخول إلى الأطفال */}
      </body>
    </html>
  );
}