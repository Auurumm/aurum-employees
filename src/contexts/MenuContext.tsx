// contexts/MenuContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem } from '@/types/menu';
import { getActiveMenus, buildMenuTree } from '@/lib/menuService';

interface MenuContextType {
  menus: MenuItem[];
  menuTree: MenuItem[];
  loading: boolean;
  error: string | null;
  refreshMenus: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveMenus();
      setMenus(data);
      setMenuTree(buildMenuTree(data));
    } catch (err) {
      console.error('메뉴 로딩 실패:', err);
      setError('메뉴를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const refreshMenus = async () => {
    await fetchMenus();
  };

  return (
    <MenuContext.Provider value={{ menus, menuTree, loading, error, refreshMenus }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}