// src/components/DashboardLayout.tsx - AdminHub 템플릿 스타일 (골드 테마)
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
  
  // 상태
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [sidebarHide, setSidebarHide] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Firebase에서 메뉴 불러오기
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setMenuLoading(true);
        const menus = await getActiveMenus();
        const tree = buildMenuTree(menus);
        setMenuTree(tree);
        
        // 현재 경로에 맞는 메뉴 자동 펼치기
        autoExpandMenus(menus, pathname);
      } catch (error) {
        console.error('메뉴 로딩 실패:', error);
        setMenuTree(getDefaultMenus());
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenus();
  }, [pathname]);

  // 현재 경로에 맞는 부모 메뉴들 자동 펼치기
  const autoExpandMenus = (menus: MenuItem[], targetPath: string) => {
    const currentMenu = menus.find(m => m.to === targetPath);
    if (!currentMenu) return;

    const parents: string[] = [];
    let current = currentMenu;
    
    while (current.parentId) {
      parents.push(current.parentId);
      const parent = menus.find(m => m.id === current.parentId);
      if (parent) {
        current = parent;
      } else {
        break;
      }
    }

    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      parents.forEach(p => newSet.add(p));
      return newSet;
    });
  };

  // 기본 메뉴
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
  ];

  // 메뉴 텍스트 클릭 → 페이지 이동
  const handleMenuNavigate = (menuTo?: string | null) => {
    if (menuTo) {
      router.push(menuTo);
    }
  };

  // 화살표 클릭 → 하위 메뉴 펼침/접힘
  const handleMenuToggle = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // 메뉴 검색
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    // 모든 메뉴에서 검색 (flat하게)
    const allMenus: MenuItem[] = [];
    const flattenMenus = (items: MenuItem[]) => {
      items.forEach(item => {
        allMenus.push(item);
        if (item.children) flattenMenus(item.children);
      });
    };
    flattenMenus(menuTree);
    
    const results = allMenus.filter(menu => 
      menu.title.toLowerCase().includes(term.toLowerCase()) && menu.to
    );
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // 검색 결과 클릭
  const handleSearchResultClick = (path: string) => {
    router.push(path);
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // 로그아웃
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

  // 사이드바 토글
  const toggleSidebar = () => {
    setSidebarHide(!sidebarHide);
  };

  // 프로필 메뉴 토글
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  // 바깥 클릭 시 프로필 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // 반응형 사이드바
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setSidebarHide(true);
      } else {
        setSidebarHide(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 메뉴 렌더링
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = expandedMenus.has(menu.id);
      const isActive = isMenuActive(menu);

      return (
        <li key={menu.id} className={`menu-item ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}>
          <div className="menu-link">
            <button
              className="menu-link-content"
              onClick={() => handleMenuNavigate(menu.to)}
            >
              <span className="menu-icon">{menu.icon}</span>
              <span className="menu-text">{menu.title}</span>
            </button>
            {hasChildren && (
              <button
                className="expand-btn"
                onClick={(e) => handleMenuToggle(menu.id, e)}
              >
                <span className="expand-icon">▶</span>
              </button>
            )}
          </div>

          {hasChildren && isExpanded && (
            <ul className="submenu">
              {menu.children!.map((child) => {
                const childHasChildren = child.children && child.children.length > 0;
                const childIsActive = pathname === child.to;
                const childIsExpanded = expandedMenus.has(child.id);

                if (childHasChildren) {
                  return (
                    <li key={child.id} className={`menu-item ${isMenuActive(child) ? 'active' : ''} ${childIsExpanded ? 'expanded' : ''}`}>
                      <div className="menu-link">
                        <button
                          className="menu-link-content"
                          onClick={() => handleMenuNavigate(child.to)}
                        >
                          <span className="menu-icon">{child.icon}</span>
                          <span className="menu-text">{child.title}</span>
                        </button>
                        <button
                          className="expand-btn"
                          onClick={(e) => handleMenuToggle(child.id, e)}
                        >
                          <span className="expand-icon">▶</span>
                        </button>
                      </div>
                      {childIsExpanded && (
                        <ul className="submenu">
                          {child.children!.map((grandChild) => (
                            <li key={grandChild.id} className={`submenu-item ${pathname === grandChild.to ? 'active' : ''}`}>
                              <button
                                className="submenu-link"
                                onClick={() => grandChild.to && router.push(grandChild.to)}
                              >
                                <span className="submenu-icon">{grandChild.icon}</span>
                                <span className="submenu-text">{grandChild.title}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={child.id} className={`submenu-item ${childIsActive ? 'active' : ''}`}>
                    <button
                      className="submenu-link"
                      onClick={() => child.to && router.push(child.to)}
                    >
                      <span className="submenu-icon">{child.icon}</span>
                      <span className="submenu-text">{child.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarHide ? 'hide' : ''}`}>
        {/* 브랜드/로고 */}
        <div className="brand" onClick={() => router.push('/dashboard')}>
          <div className="brand-icon">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={36} 
              height={36}
            />
          </div>
          <span className="brand-text">AURUM.INC_PORTAL</span>
        </div>

        {/* 메인 메뉴 */}
        <ul className="side-menu top">
          {menuLoading ? (
            <div className="menu-loading">메뉴 로딩 중...</div>
          ) : (
            renderMenuItems(menuTree)
          )}
        </ul>

        {/* 하단 메뉴 */}
        <ul className="side-menu bottom">
          {isAdmin && (
            <li className="menu-item">
              <button
                className="menu-link"
                onClick={() => router.push('/admin/menu')}
              >
                <span className="menu-icon">⚙️</span>
                <span className="menu-text">메뉴 설정</span>
              </button>
            </li>
          )}
          <li className="menu-item logout-item">
            <button className="menu-link" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span className="menu-text">로그아웃</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENT */}
      <section className={`content-area ${sidebarHide ? '' : ''}`}>
        {/* TOP NAVBAR */}
        <nav className="top-navbar">
          {/* 햄버거 메뉴 */}
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>

          {/* 검색 폼 */}
          <div className="search-form">
            <div className="form-input">
              <input 
                type="search" 
                placeholder="메뉴 검색..." 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchTerm && setShowSearchResults(true)}
              />
              <button type="button">🔍</button>
            </div>
            
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(menu => (
                  <button
                    key={menu.id}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(menu.to!)}
                  >
                    <span className="result-icon">{menu.icon}</span>
                    <span className="result-title">{menu.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* 오른쪽 섹션 */}
          <div className="right-section">
            {/* 관리자 버튼 */}
            {isAdmin && (
              <button 
                className="admin-btn"
                onClick={() => router.push('/admin/menu')}
              >
                ⚙️ 메뉴 설정
              </button>
            )}

            {/* 유저 정보 */}
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.position}</span>
            </div>

            {/* 프로필 드롭다운 */}
            <div className="profile-dropdown">
              <div className="profile" onClick={toggleProfileMenu}>
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <img src="https://placehold.co/100x100/D4AF37/white?text=U" alt="Profile" />
                )}
              </div>
              
              <div className={`profile-menu ${profileMenuOpen ? 'show' : ''}`}>
              <ul>
                <li>
                  <button onClick={() => router.push(`/employees/edit/${user?.id}`)}>
                    👤 내 정보
                  </button>
                </li>
                <li>
                  <button className="logout" onClick={handleLogout}>
                    🚪 로그아웃
                  </button>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {children}
        </main>
      </section>
    </>
  );
}