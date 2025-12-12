'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  to?: string;
  content?: MenuItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// 아이콘 컴포넌트들
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17.99V14.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Wallet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 12.41V7.84004C2.5 6.65004 3.23 5.59 4.34 5.17L12.28 2.17C13.52 1.7 14.85 2.62003 14.85 3.95003V7.75002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Folder: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
    </svg>
  ),
  Scale: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 5L5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 5L17 10H7L5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10C7 10 5 14 7 14C9 14 7 10 7 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 10C17 10 15 14 17 14C19 14 17 10 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Book: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.74V4.67C22 3.47 21.02 2.58 19.83 2.68H19.77C17.67 2.86 14.48 3.93 12.7 5.05L12.53 5.16C12.24 5.34 11.76 5.34 11.47 5.16L11.22 5.01C9.44 3.9 6.26 2.84 4.16 2.67C2.97 2.57 2 3.47 2 4.66V16.74C2 17.7 2.78 18.6 3.74 18.72L4.03 18.76C6.2 19.05 9.55 20.15 11.47 21.2L11.51 21.22C11.78 21.37 12.21 21.37 12.47 21.22C14.39 20.16 17.75 19.05 19.93 18.76L20.26 18.72C21.22 18.6 22 17.7 22 16.74Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5.49V20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 22H23" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.78 22.01V17.55" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.8 10.89C18.58 10.89 17.6 11.87 17.6 13.09V15.36C17.6 16.58 18.58 17.56 19.8 17.56C21.02 17.56 22 16.58 22 15.36V13.09C22 11.87 21.02 10.89 19.8 10.89Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.1 22V6.03C2.1 4.02 3.1 3.01 5.04 3.01H11.27C13.21 3.01 14.21 4.02 14.21 6.03V22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.8 8.25H10.75" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.8 12H10.75" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.25 22V18.25" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.92 8.95L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.08 8.95" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [iconHover, setIconHover] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <Icons.Dashboard />,
      to: '/dashboard'
    },
    {
      id: 'hr',
      title: '인사/관리',
      icon: <Icons.Users />,
      content: [
        { id: 'employees', title: '직원 명부', icon: <Icons.Users />, to: '/employees' },
      ]
    },
    {
      id: 'accounting',
      title: '회계/세무',
      icon: <Icons.Wallet />,
      content: [
        { id: 'accounting-1', title: '준비중', icon: <Icons.Wallet />, to: '/accounting' },
      ]
    },
    {
      id: 'admin',
      title: '행정/지원',
      icon: <Icons.Folder />,
      content: [
        { id: 'admin-1', title: '준비중', icon: <Icons.Folder />, to: '/admin' },
      ]
    },
    {
      id: 'legal',
      title: '법무/보안',
      icon: <Icons.Scale />,
      content: [
        { id: 'legal-1', title: '준비중', icon: <Icons.Scale />, to: '/legal' },
      ]
    },
    {
      id: 'education',
      title: '교육/생산성',
      icon: <Icons.Book />,
      content: [
        { id: 'education-1', title: '준비중', icon: <Icons.Book />, to: '/education' },
      ]
    },
    {
      id: 'management',
      title: '경영/인프라',
      icon: <Icons.Building />,
      content: [
        { id: 'management-1', title: '준비중', icon: <Icons.Building />, to: '/management' },
      ]
    },
  ];

  // 현재 경로에 맞는 메뉴 활성화
  useEffect(() => {
    menuItems.forEach((menu) => {
      if (menu.to === pathname) {
        setActiveMenu(menu.id);
      }
      menu.content?.forEach((subMenu) => {
        if (subMenu.to === pathname) {
          setActiveMenu(menu.id);
        }
      });
    });
  }, [pathname]);

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.to) {
      router.push(menu.to);
    } else if (menu.content) {
      setActiveMenu(activeMenu === menu.id ? '' : menu.id);
    }
  };

  const isMenuActive = (menu: MenuItem): boolean => {
    if (menu.to === pathname) return true;
    return menu.content?.some(sub => sub.to === pathname) || false;
  };

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
          {menuItems.map((menu) => (
            <li 
              key={menu.id}
              className={isMenuActive(menu) ? 'mm-active' : ''}
            >
              <a
                href="#"
                className={`menu-link ${menu.content ? 'has-arrow' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(menu);
                }}
              >
                <div className="menu-icon">{menu.icon}</div>
                <span className="nav-text">{menu.title}</span>
                {menu.content && (
                  <span className={`arrow ${activeMenu === menu.id ? 'rotate' : ''}`}>
                    <Icons.ChevronDown />
                  </span>
                )}
              </a>
              
              {menu.content && (
                <ul 
                  className={`mm-collapse ${activeMenu === menu.id ? 'mm-show' : ''}`}
                >
                  {menu.content.map((subMenu) => (
                    <li 
                      key={subMenu.id}
                      className={pathname === subMenu.to ? 'mm-active' : ''}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (subMenu.to) router.push(subMenu.to);
                        }}
                      >
                        {subMenu.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* 하단 정보 박스 */}
        {!isCollapsed && (
          <div className="plus-box">
            <div className="plus-box-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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