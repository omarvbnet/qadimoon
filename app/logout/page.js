"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // إزالة التوكن من LocalStorage
    localStorage.removeItem("authToken");
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    router.push("/login");
   window.location.href = '/login'
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#282c34',
      color: '#fff',
      fontFamily: 'Tajawal, sans-serif'
    }}>
      <h1>جارٍ تسجيل الخروج...</h1>
    </div>
  );
}