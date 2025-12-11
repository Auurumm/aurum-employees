// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인에 실패했습니다.');
      }
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const result = await response.json();

      if (result.success) {
        alert('회원가입 요청이 완료되었습니다.\n관리자 승인 후 로그인하실 수 있습니다.');
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
      } else {
        setError(result.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError('회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* 배경 애니메이션 */}
      <div className="background-animation"></div>

      {/* 로그인/회원가입 폼 */}
      <div className="login-container">
        <div className="login-header">
          <h1 style={{ fontSize: '1.5rem' }}>AURUM.INC_PORTAL</h1>
          <p>Management Information System</p>
        </div>

        {isSignup ? (
          // 회원가입 폼
          <form onSubmit={handleSignup} className="login-form">
            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="홍길동"
              />
            </div>

            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your-email@company.com"
              />
            </div>

            <div className="form-group">
              <label>연락처</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="010-0000-0000"
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="login-button">
              {loading ? '처리 중...' : '가입 요청'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setError('');
              }}
              className="switch-button"
            >
              로그인으로 돌아가기
            </button>
          </form>
        ) : (
          // 로그인 폼
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your-email@company.com"
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="login-button">
              {loading ? '로그인 중...' : '로그인'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignup(true);
                setError('');
              }}
              className="switch-button"
            >
              회원가입
            </button>
          </form>
        )}

        <button 
          type="button" 
          onClick={() => router.push('/')} 
          className="home-button"
        >
          → 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}