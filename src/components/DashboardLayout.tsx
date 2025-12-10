// src/components/DashboardLayout.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState('employees');

  const menuItems = [
    { id: 'employees', label: '직원 명부', icon: '👥', path: '/employees' },
    { id: 'profile', label: '내 정보', icon: '👤', path: `/employees/edit/${user?.id}` },
    ...(isAdmin ? [{ id: 'new', label: '신규 등록', icon: '➕', path: '/employees/new' }] : []),
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setActiveMenu(item.id);
    router.push(item.path);
  };

  const handleLogout = async () => {
    router.push('/');
    await logout();
  };

  return (
    <div className="dashboard-layout">
      {/* 상단 네비게이션 */}
      <nav className="top-navbar">
        <div className="navbar-content">
        <div className="logo-section" onClick={() => router.push('/employees')} style={{ cursor: 'pointer' }}>
            <Image 
                src="/images/logo.png" 
                alt="AURUM" 
                width={40} 
                height={40} 
                className="logo-image"
                style={{ transform: 'scaleX(-1)' }}
            />
            <span className="logo-text">AURUM 직원 포털</span>
            </div>
          
          <div className="user-section">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.position}</span>
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
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
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