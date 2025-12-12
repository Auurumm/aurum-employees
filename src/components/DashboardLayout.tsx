// src/components/DashboardLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import './DashboardLayout.css';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { getActiveMenus, buildMenuTree } from '@/lib/menuService';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // 메뉴 상태
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  // Firebase에서 메뉴 불러오기
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setMenuLoading(true);
        const menus = await getActiveMenus();
        const tree = buildMenuTree(menus);
        setMenuTree(tree);
        
        // 현재 경로에 맞는 메뉴 자동 펼치기
        autoExpandMenus(tree, pathname);
      } catch (error) {
        console.error('메뉴 로딩 실패:', error);
        // 실패 시 기본 메뉴 사용
        setMenuTree(getDefaultMenus());
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenus();
  }, [pathname]);

  // 현재 경로에 맞는 부모 메뉴들 자동 펼치기 (기존 상태 유지)
  const autoExpandMenus = (items: MenuItem[], targetPath: string, parents: string[] = []) => {
    for (const item of items) {
      if (item.to === targetPath) {
        // 기존 expandedMenus에 추가 (덮어쓰기 X)
        setExpandedMenus(prev => {
          const newSet = new Set(prev);
          parents.forEach(p => newSet.add(p));
          return newSet;
        });
        return true;
      }
      if (item.children && item.children.length > 0) {
        if (autoExpandMenus(item.children, targetPath, [...parents, item.id])) {
          return true;
        }
      }
    }
    return false;
  };

  // Firebase 연결 실패 시 사용할 기본 메뉴
  const getDefaultMenus = (): MenuItem[] => [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '🏠',
      to: '/dashboard',
      order: 0,
      parentId: null,
      level: 1,
      isActive: true,
    },
    {
      id: 'hr',
      title: '인사/관리',
      icon: '👥',
      order: 1,
      parentId: null,
      level: 1,
      isActive: true,
      children: [
        { id: 'employees', title: '직원 명부', icon: '📋', to: '/employees', order: 1, parentId: 'hr', level: 2, isActive: true },
      ]
    },
    {
      id: 'accounting',
      title: '회계/세무',
      icon: '💰',
      order: 2,
      parentId: null,
      level: 1,
      isActive: true,
      children: [
        { id: 'accounting-1', title: '준비중', icon: '📊', to: '/accounting', order: 1, parentId: 'accounting', level: 2, isActive: true },
      ]
    },
    {
      id: 'admin-menu',
      title: '행정/지원',
      icon: '📁',
      order: 3,
      parentId: null,
      level: 1,
      isActive: true,
      children: [
        { id: 'admin-1', title: '준비중', icon: '📝', to: '/admin', order: 1, parentId: 'admin-menu', level: 2, isActive: true },
      ]
    },
    {
      id: 'legal',
      title: '법무/보안',
      icon: '⚖️',
      order: 4,
      parentId: null,
      level: 1,
      isActive: true,
      children: [
        { id: 'legal-1', title: '준비중', icon: '🔒', to: '/legal', order: 1, parentId: 'legal', level: 2, isActive: true },
      ]
    },
    {
      id: 'education',
      title: '교육/생산성',
      icon: '📚',
      order: 5,
      parentId: null,
      level: 1,
      isActive: true,
      children: [
        { id: 'education-1', title: '준비중', icon: '🎓', to: '/education', order: 1, parentId: 'education', level: 2, isActive: true },
      ]
    },
    {
      id: 'management',
      title: '경영/인프라',
      icon: '🏢',
      order: 6,
      parentId: null,
      level: 1,
      isActive: true,
      children: [
        { id: 'management-1', title: '준비중', icon: '📈', to: '/management', order: 1, parentId: 'management', level: 2, isActive: true },
      ]
    },
  ];

  const handleCategoryClick = (menuId: string, menuTo?: string | null, hasChildren?: boolean) => {
    // 하위 메뉴가 있으면 펼치기/접기
    if (hasChildren) {
      setExpandedMenus(prev => {
        const newSet = new Set(prev);
        if (newSet.has(menuId)) {
          newSet.delete(menuId);
        } else {
          newSet.add(menuId);
        }
        return newSet;
      });
    }
    
    // URL이 있으면 페이지 이동
    if (menuTo) {
      router.push(menuTo);
    }
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

  // 메뉴 활성 상태 확인
  const isMenuActive = (menu: MenuItem): boolean => {
    if (menu.to === pathname) return true;
    if (menu.children) {
      return menu.children.some(child => isMenuActive(child));
    }
    return false;
  };

  // 재귀적 메뉴 렌더링 (H1~H5 지원)
  const renderMenuItems = (items: MenuItem[], depth: number = 0) => {
    return items.map((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = expandedMenus.has(menu.id);
      const isActive = isMenuActive(menu);

      return (
        <div key={menu.id} className="menu-category">
          <button
            className={`category-header ${isExpanded ? 'expanded' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => handleCategoryClick(menu.id, menu.to, hasChildren)}
            style={{ paddingLeft: `${16 + depth * 16}px` }}
          >
            <span className="category-icon">{menu.icon}</span>
            <span className="category-label">{menu.title}</span>
            {hasChildren && (
              <span className="expand-icon">
                {isExpanded ? '▼' : '▶'}
              </span>
            )}
          </button>

          {hasChildren && isExpanded && (
            <div className="submenu">
              {menu.children!.map((child) => {
                const childHasChildren = child.children && child.children.length > 0;
                
                if (childHasChildren) {
                  // 하위 메뉴가 또 있으면 재귀 호출
                  return renderMenuItems([child], depth + 1);
                }
                
                return (
                  <button
                    key={child.id}
                    className={`submenu-item ${pathname === child.to ? 'active' : ''}`}
                    onClick={() => handleMenuClick(child.to)}
                    style={{ paddingLeft: `${32 + depth * 16}px` }}
                  >
                    <span className="submenu-icon">{child.icon}</span>
                    <span className="submenu-label">{child.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    });
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

            {/* 관리자 메뉴 설정 버튼 (관리자만 표시) */}
            {isAdmin && (
              <button 
                className="admin-btn"
                onClick={() => router.push('/admin/menu')}
              >
                ⚙️ 메뉴 설정
              </button>
            )}

            {/* 로그아웃 버튼 */}
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
            {menuLoading ? (
              <div className="menu-loading">
                <span>메뉴 로딩 중...</span>
              </div>
            ) : (
              renderMenuItems(menuTree)
            )}
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