// src/components/DashboardLayout.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import './DashboardLayout.css';
import Image from 'next/image';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: 'accounting',
      label: '회계/세무',
      icon: '💰',
      children: [
        { id: 'accounting-1', label: '준비중', icon: '📊', path: '/accounting' },
      ]
    },
    {
      id: 'hr',
      label: '인사/관리',
      icon: '👥',
      children: [
        { id: 'employees', label: '직원 명부', icon: '📋', path: '/employees' },
      ]
    },
    {
      id: 'admin',
      label: '행정/지원',
      icon: '📁',
      children: [
        { id: 'admin-1', label: '준비중', icon: '📝', path: '/admin' },
      ]
    },
    {
      id: 'legal',
      label: '법무/보안',
      icon: '⚖️',
      children: [
        { id: 'legal-1', label: '준비중', icon: '🔒', path: '/legal' },
      ]
    },
    {
      id: 'education',
      label: '교육/생산성',
      icon: '📚',
      children: [
        { id: 'education-1', label: '준비중', icon: '🎓', path: '/education' },
      ]
    },
    {
      id: 'management',
      label: '경영/인프라',
      icon: '🏢',
      children: [
        { id: 'management-1', label: '준비중', icon: '📈', path: '/management' },
      ]
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setExpandedMenu(expandedMenu === categoryId ? null : categoryId);
  };

  const handleMenuClick = (path?: string) => {
    if (path) {
      router.push(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="dashboard-layout">
      {/* 상단 네비게이션 */}
      <nav className="top-navbar">
        <div className="navbar-content">
          <div 
              className="logo-section"
              onClick={() => router.push('/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <Image 
                src="/logo.png" 
                alt="Aurum Logo" 
                width={50} 
                height={50}
                className="logo-image"
              />
              <span className="logo-text">AURUM.INC_PORTAL</span>
            </div>
          
          <div className="user-section">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.position}</span>
            
            {/* MY PAGE 버튼 */}
            <div className="mypage-dropdown">
              <button 
                className="mypage-btn"
                onClick={() => router.push(`/employees/edit/${user?.id}`)}
              >
                MY PAGE
              </button>
            </div>

            {/* 로그아웃 버튼 (별도) */}
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      <div className="main-container">
        {/* 사이드바 */}
        <aside className="sidebar">
          <div className="menu-items">
            {menuItems.map((category) => (
              <div key={category.id} className="menu-category">
                <button
                  className={`category-header ${expandedMenu === category.id ? 'expanded' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-label">{category.label}</span>
                  <span className="expand-icon">
                    {expandedMenu === category.id ? '▼' : '▶'}
                  </span>
                </button>

                {expandedMenu === category.id && category.children && (
                  <div className="submenu">
                    {category.children.map((item) => (
                      <button
                        key={item.id}
                        className="submenu-item"
                        onClick={() => handleMenuClick(item.path)}
                      >
                        <span className="submenu-icon">{item.icon}</span>
                        <span className="submenu-label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}