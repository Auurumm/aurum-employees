// src/app/[...slug]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getActiveMenus } from '@/lib/menuService';
import { MenuItem } from '@/types/menu';

// 브레드크럼 아이템 타입
interface BreadcrumbItem {
  title: string;
  type: string;
}

export default function DynamicPage() {
  const pathname = usePathname();
  const [menuInfo, setMenuInfo] = useState<MenuItem | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchMenuInfo = async () => {
      try {
        setLoading(true);
        const menus = await getActiveMenus();
        
        // 현재 경로와 일치하는 메뉴 찾기
        const currentMenu = menus.find(menu => menu.to === pathname);
        
        if (currentMenu) {
          setMenuInfo(currentMenu);
          setNotFound(false);
          
          // 부모 경로 만들기 (각 메뉴에 레벨 타입 포함)
          const types = ['파트', '라인', '태스크', '서브태스크', '디테일'];
          const menuChain: MenuItem[] = [currentMenu];
          
          // 부모 메뉴들 수집
          let current = currentMenu;
          while (current.parentId) {
            const parent = menus.find(m => m.id === current.parentId);
            if (parent) {
              menuChain.unshift(parent);
              current = parent;
            } else {
              break;
            }
          }
          
          // 각 메뉴에 레벨 타입 붙이기
          const items = menuChain.map((m) => ({
            title: m.title,
            type: types[m.level - 1] || '',
          }));
          
          setBreadcrumbItems(items);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('메뉴 정보 로딩 실패:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuInfo();
  }, [pathname]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dynamic-page">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>페이지를 불러오는 중...</p>
          </div>
        </div>
        <style jsx>{styles}</style>
      </DashboardLayout>
    );
  }

  if (notFound) {
    return (
      <DashboardLayout>
        <div className="dynamic-page">
          <div className="not-found-state">
            <div className="not-found-icon">🔍</div>
            <h1>페이지를 찾을 수 없습니다</h1>
            <p>요청하신 페이지가 존재하지 않거나, 메뉴에 등록되지 않았습니다.</p>
            <p className="path-info">요청 경로: <code>{pathname}</code></p>
          </div>
        </div>
        <style jsx>{styles}</style>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dynamic-page">
        <div className="page-placeholder">
          {/* 아이콘 */}
          <div className="placeholder-icon">
            {menuInfo?.icon || '📄'}
          </div>
          
          {/* 제목 - 브레드크럼 스타일 */}
          <h1>
            여기는{' '}
            <span className="highlight">
              {breadcrumbItems.map((item, index) => (
                <span key={index}>
                  {index > 0 && <span className="separator"> &gt; </span>}
                  {item.title} <strong className="level-type">{item.type}</strong>
                </span>
              ))}
            </span>{' '}
            페이지입니다
          </h1>
          
          {/* 설명 */}
          <p className="description">
            이 페이지는 아직 개발 중입니다.<br />
            곧 새로운 기능이 추가될 예정입니다.
          </p>
          
          {/* 메뉴 정보 카드 
          <div className="info-card">
            <h3>📋 페이지 정보</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">메뉴명</span>
                <span className="value">{menuInfo?.title}</span>
              </div>
              <div className="info-item">
                <span className="label">경로</span>
                <span className="value"><code>{menuInfo?.to}</code></span>
              </div>
              <div className="info-item">
                <span className="label">메뉴 레벨</span>
                <span className="value">H{menuInfo?.level}</span>
              </div>
              <div className="info-item">
                <span className="label">상태</span>
                <span className="value">
                  <span className="badge badge-success">활성</span>
                </span>
              </div>
            </div>
          </div> */}

          {/* 개발 안내 
          <div className="dev-notice">
            <span className="notice-icon">💡</span>
            <p>
              이 페이지에 기능을 추가하려면 <code>src/app{menuInfo?.to}/page.tsx</code> 파일을 생성하세요.
            </p> 
          </div> */}
        </div>
      </div>
      <style jsx>{styles}</style>
    </DashboardLayout>
  );
}

const styles = `
  .dynamic-page {
    padding: 2rem;
    min-height: calc(100vh - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-placeholder {
    text-align: center;
    max-width: 700px;
    width: 100%;
  }

  .placeholder-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .page-placeholder h1 {
    font-size: 1.5rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .page-placeholder h1 .highlight {
    color: #6b7280;
  }

  .page-placeholder h1 .separator {
    color: #9ca3af;
    margin: 0 0.25rem;
  }

  .page-placeholder h1 .level-type {
    font-weight: 700;
    color: #374151;
  }

  .description {
    color: #6b7280;
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .info-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .info-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-item .label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-item .value {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #1f2937;
  }

  .info-item code {
    background: rgba(212, 175, 55, 0.1);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.8125rem;
    color: #D4AF37;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 600;
  }

  .badge-success {
    background-color: rgba(43, 193, 85, 0.15);
    color: #2bc155;
  }

  .dev-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: rgba(212, 175, 55, 0.08);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 0.5rem;
    padding: 1rem;
    text-align: left;
  }

  .notice-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .dev-notice p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }

  .dev-notice code {
    background: rgba(212, 175, 55, 0.15);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.8125rem;
    color: #D4AF37;
  }

  /* 로딩 상태 */
  .loading-state {
    text-align: center;
  }

  .loading-state .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid #e5e7eb;
    border-top-color: #D4AF37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-state p {
    color: #6b7280;
  }

  /* 404 상태 */
  .not-found-state {
    text-align: center;
  }

  .not-found-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .not-found-state h1 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .not-found-state p {
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .path-info code {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  /* 반응형 */
  @media (max-width: 640px) {
    .dynamic-page {
      padding: 1rem;
    }

    .placeholder-icon {
      font-size: 3rem;
    }

    .page-placeholder h1 {
      font-size: 1.125rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    .dev-notice {
      flex-direction: column;
      text-align: center;
    }
  }
`;