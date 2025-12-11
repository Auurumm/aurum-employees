// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
// import Link from 'next/link';
// import './dashboard.css';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="loading-screen">로딩중...</div>;
  }

  return (
    <DashboardLayout>
      <div>
        {/* 빈 화면 */}
      </div>
    </DashboardLayout>
  );
}

/* 주석 처리된 기존 코드
      <div className="dashboard-home">
        <div className="welcome-section">
          <h1 className="welcome-title">
            안녕하세요, <span className="highlight">{user.name}</span>님!
          </h1>
          <p className="welcome-subtitle">
            {user.position} · {user.department}
          </p>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <div className="category-card-icon">💰</div>
            <h3>회계/세무</h3>
            <p>준비중입니다</p>
          </div>

          <Link href="/employees">
            <div className="category-card active">
              <div className="category-card-icon">👥</div>
              <h3>인사/관리</h3>
              <p>직원 명부, 인사 정보 관리</p>
              <div className="card-badge">이용 가능</div>
            </div>
          </Link>

          <div className="category-card">
            <div className="category-card-icon">📁</div>
            <h3>행정/지원</h3>
            <p>준비중입니다</p>
          </div>

          <div className="category-card">
            <div className="category-card-icon">⚖️</div>
            <h3>법무/보안</h3>
            <p>준비중입니다</p>
          </div>

          <div className="category-card">
            <div className="category-card-icon">📚</div>
            <h3>교육/생산성</h3>
            <p>준비중입니다</p>
          </div>

          <div className="category-card">
            <div className="category-card-icon">🏢</div>
            <h3>경영/인프라</h3>
            <p>준비중입니다</p>
          </div>
        </div>

        <div className="quick-actions-section">
          <h2>빠른 작업</h2>
          <div className="quick-actions">
            <Link href={`/employees/edit/${user.id}`}>
              <div className="action-card">
                <span className="action-icon">👤</span>
                <span className="action-label">내 정보 수정</span>
              </div>
            </Link>

            {isAdmin && (
              <Link href="/employees/new">
                <div className="action-card admin">
                  <span className="action-icon">➕</span>
                  <span className="action-label">신규 직원 등록</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
*/