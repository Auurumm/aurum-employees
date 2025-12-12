// components/layout/DynamicSidebar.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useMenu } from '@/contexts/MenuContext';
import { MenuItem } from '@/types/menu';

interface DynamicSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function DynamicSidebar({ isCollapsed, onToggle }: DynamicSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { menuTree, loading } = useMenu();
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const [iconHover, setIconHover] = useState(false);

  // 현재 경로에 맞는 메뉴 자동 펼치기
  useEffect(() => {
    const findParentIds = (items: MenuItem[], targetPath: string, parents: string[] = []): string[] | null => {
      for (const item of items) {
        if (item.to === targetPath) {
          return parents;
        }
        if (item.children && item.children.length > 0) {
          const result = findParentIds(item.children, targetPath, [...parents, item.id]);
          if (result) return result;
        }
      }
      return null;
    };

    const parentIds = findParentIds(menuTree, pathname);
    if (parentIds) {
      setOpenMenus(new Set(parentIds));
    }
  }, [pathname, menuTree]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.to) {
      router.push(menu.to);
    } else if (menu.children && menu.children.length > 0) {
      toggleMenu(menu.id);
    }
  };

  const isMenuActive = (menu: MenuItem): boolean => {
    if (menu.to === pathname) return true;
    if (menu.children) {
      return menu.children.some(child => isMenuActive(child));
    }
    return false;
  };

  // 재귀적으로 메뉴 렌더링
  const renderMenuItems = (items: MenuItem[], depth: number = 0) => {
    return items.map((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isOpen = openMenus.has(menu.id);
      const isActive = isMenuActive(menu);

      return (
        <li key={menu.id} className={isActive ? 'mm-active' : ''}>
          <a
            href="#"
            className={`menu-link ${hasChildren ? 'has-arrow' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick(menu);
            }}
            style={{ paddingLeft: `${1.25 + depth * 1}rem` }}
          >
            {depth === 0 && (
              <span className="menu-icon">{menu.icon}</span>
            )}
            <span className="nav-text">{menu.title}</span>
            {hasChildren && (
              <span className={`arrow ${isOpen ? 'rotate' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19.92 8.95L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.08 8.95" 
                    stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" 
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </a>
          
          {hasChildren && (
            <ul className={`mm-collapse ${isOpen ? 'mm-show' : ''}`}>
              {renderMenuItems(menu.children!, depth + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  if (loading) {
    return (
      <aside className={`deznav ${isCollapsed ? 'deznav-collapsed' : ''}`}>
        <div className="nav-header">
          <div className="brand-logo">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="logo-abbr" />
            {!isCollapsed && <span className="brand-title">AURUM</span>}
          </div>
        </div>
        <div className="deznav-scroll">
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--body-color)' }}>
            메뉴 로딩 중...
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`deznav ${isCollapsed ? 'deznav-collapsed' : ''} ${iconHover ? 'icon-hover' : ''}`}
      onMouseEnter={() => setIconHover(true)}
      onMouseLeave={() => setIconHover(false)}
    >
      {/* 로고 영역 */}
      <div className="nav-header">
        <div 
          className="brand-logo"
          onClick={() => router.push('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <Image 
            src="/logo.png" 
            alt="Aurum Logo" 
            width={40} 
            height={40}
            className="logo-abbr"
          />
          {!isCollapsed && (
            <span className="brand-title">AURUM</span>
          )}
        </div>
        <button 
          className="nav-control"
          onClick={onToggle}
          aria-label="Toggle Sidebar"
        >
          <div className={`hamburger ${isCollapsed ? 'is-active' : ''}`}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </button>
      </div>

      {/* 메뉴 영역 */}
      <div className="deznav-scroll">
        <ul className="metismenu">
          {renderMenuItems(menuTree)}
        </ul>

        {/* 하단 정보 박스 */}
        {!isCollapsed && (
          <div className="plus-box">
            <div className="plus-box-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
              </svg>
            </div>
            <div className="plus-box-content">
              <h4>Aurum Portal</h4>
              <p>직원 관리 시스템</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}