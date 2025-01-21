'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
        return;
      }
  
      if (data.success) {
        document.cookie = `authToken=${data.message}; path=/;`;
        localStorage.setItem('authToken',data.success)
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width:'100%',
      backgroundColor: '#f7f7f7',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        background: '#ffffff',
        padding: '3rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
        transition: 'all 0.3s ease-in-out',
        boxSizing: 'border-box',
      }}>
        <img src="/images/logo.jpg" alt="Logo" style={{ width: '120px', marginBottom: '1.5rem' }} />
        <h1 style={{
          fontSize: '2rem',
          color: '#333',
          marginBottom: '1.5rem',
          fontWeight: '600',
        }}>تسجيل الدخول</h1>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label htmlFor="username" style={{
              fontSize: '1rem',
              fontWeight: '500',
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333'
            }}>اسم المستخدم</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="أدخل اسم المستخدم"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border 0.3s ease',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #007BFF'}
              onBlur={(e) => e.target.style.border = '1px solid #ddd'}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{
              fontSize: '1rem',
              fontWeight: '500',
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333'
            }}>كلمة المرور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="أدخل كلمة المرور"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border 0.3s ease',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #007BFF'}
              onBlur={(e) => e.target.style.border = '1px solid #ddd'}
            />
          </div>

          {error && <p style={{
            color: 'red',
            fontSize: '1rem',
            marginBottom: '1rem',
          }}>{error}</p>}

          <button type="submit" style={{
            backgroundColor: '#007BFF',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontSize: '1.2rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            width: '100%',
          }} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}>
            دخول
          </button>
        </form>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <p style={{ color: '#777' }}>لا تملك حساب؟ <a href="/signup" style={{ color: '#007BFF' }}>إنشاء حساب</a></p>
        </div>
      </div>
    </div>
  );
}