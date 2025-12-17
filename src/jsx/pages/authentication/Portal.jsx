// src/jsx/pages/authentication/Portal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/config';  // ✅ 경로 수정
import { loginConfirmedAction } from '../../../store/actions/AuthActions';  
import '../../../assets/css/portal.css';         // ✅ 경로 수정

export default function Portal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();  
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePortalClick = () => {
    const portalContainer = document.querySelector('.portal-container');
    portalContainer?.classList.add('animate-collapse');
    
    setTimeout(() => {
      setShowLogin(true);
    }, 800);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ 로그인 성공!');
      
      dispatch(loginConfirmedAction({
        email: userCredential.user.email,
        uid: userCredential.user.uid
      }));
      
      // ✅ 페이지 새로고침으로 변경
      window.location.href = '/';
    } catch (error) {
      console.error('❌ 로그인 실패:', error.message);
      if (error.code === 'auth/user-not-found') {
        setError('등록되지 않은 이메일입니다.');
      } else if (error.code === 'auth/wrong-password') {
        setError('비밀번호가 틀렸습니다.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 틀렸습니다.');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 로그인 폼
  if (showLogin) {
    return (
      <div className="entry-screen">
        <div className="background-image"></div>
        <div className="overlay"></div>
        
        <div className="login-form-container">
          <div className="login-form-card">
            <h2>AURUM.INC_PORTAL</h2>
            <p className="subtitle">포털 시스템에 로그인하세요</p>
            
            {error && (
              <div className="error-message">{error}</div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 포털 애니메이션
  return (
    <div className="entry-screen">
      <div className="background-image"></div>
      <div className="overlay"></div>

      <div className="portal-container" onClick={handlePortalClick}>
        <video autoPlay muted loop playsInline>
          <source
            src="https://cdn.pixabay.com/video/2020/01/22/31495-387312407_tiny.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="info-box">
        <h1>AURUM.INC_PORTAL</h1>
        <p>포털을 클릭하여 시스템에 접속하세요</p>
      </div>
    </div>
  );
}