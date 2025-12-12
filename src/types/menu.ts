// types/menu.ts

export interface MenuItem {
    id: string;
    title: string;
    icon?: string;           // 이모지 또는 아이콘 이름
    to?: string;             // 링크 URL (없으면 폴더)
    order: number;           // 정렬 순서
    parentId: string | null; // 부모 메뉴 ID (null이면 최상위)
    level: number;           // 깊이 (1=H1, 2=H2, ... 5=H5)
    isActive: boolean;       // 활성화 여부
    roles?: string[];        // 접근 가능한 역할 (비어있으면 모두 접근)
    children?: MenuItem[];   // 하위 메뉴 (클라이언트에서 구성)
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface MenuFormData {
    title: string;
    icon: string;
    to: string;
    parentId: string | null;
    order: number;
    isActive: boolean;
    roles: string[];
  }
  
  // 기본 메뉴 데이터 (초기 세팅용)
  export const DEFAULT_MENU_DATA: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: 'Dashboard',
      icon: '🏠',
      to: '/dashboard',
      order: 1,
      parentId: null,
      level: 1,
      isActive: true,
      roles: [],
    },
    {
      title: '인사/관리',
      icon: '👥',
      to: undefined,
      order: 2,
      parentId: null,
      level: 1,
      isActive: true,
      roles: [],
    },
    {
      title: '회계/세무',
      icon: '💰',
      to: undefined,
      order: 3,
      parentId: null,
      level: 1,
      isActive: true,
      roles: [],
    },
    {
      title: '행정/지원',
      icon: '📁',
      to: undefined,
      order: 4,
      parentId: null,
      level: 1,
      isActive: true,
      roles: [],
    },
    {
      title: '법무/보안',
      icon: '⚖️',
      to: undefined,
      order: 5,
      parentId: null,
      level: 1,
      isActive: true,
      roles: [],
    },
    {
      title: '교육/생산성',
      icon: '📚',
      to: undefined,
      order: 6,
      parentId: null,
      level: 1,
      isActive: true,
      roles: [],
    },
    {
      title: '경영/인프라',
      icon: '🏢',
      to: undefined,
      order: 7,
      parentId: null,
      level: 1,
      isActive: true,
      roles: [],
    },
  ];