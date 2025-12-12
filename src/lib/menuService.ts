// lib/menuService.ts

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MenuItem, MenuFormData, DEFAULT_MENU_DATA } from '@/types/menu';

const COLLECTION_NAME = 'menus';

// undefined 값 제거 헬퍼 함수
const removeUndefined = (obj: any) => {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

// 모든 메뉴 가져오기
export async function getAllMenus(): Promise<MenuItem[]> {
  try {
    const menusRef = collection(db, COLLECTION_NAME);
    const q = query(menusRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as MenuItem[];
  } catch (error) {
    console.error('getAllMenus 에러:', error);
    // 인덱스 에러 시 정렬 없이 조회 후 클라이언트에서 정렬
    const menusRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(menusRef);
    
    const menus = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as MenuItem[];
    
    return menus.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}

// 활성화된 메뉴만 가져오기
export async function getActiveMenus(): Promise<MenuItem[]> {
  try {
    const menusRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(menusRef);
    
    const menus = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as MenuItem[];
    
    // 클라이언트에서 필터링 및 정렬 (인덱스 필요 없음)
    return menus
      .filter(menu => menu.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('getActiveMenus 에러:', error);
    return [];
  }
}

// 단일 메뉴 가져오기
export async function getMenuById(id: string): Promise<MenuItem | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as MenuItem;
}

// 메뉴 추가
export async function addMenu(data: MenuFormData): Promise<string> {
  // 부모 메뉴의 level 및 URL 확인
  let level = 1;
  let parentUrl = '';
  
  if (data.parentId) {
    const parent = await getMenuById(data.parentId);
    if (parent) {
      level = parent.level + 1;
      if (level > 5) {
        throw new Error('메뉴 깊이는 최대 5단계까지만 가능합니다.');
      }
      // 부모 URL 가져오기
      if (parent.to) {
        parentUrl = parent.to;
      }
    }
  }

  // URL 조합: 상위 URL + 입력한 URL
  let finalUrl: string | null = null;
  if (data.to && data.to.trim() !== '') {
    const inputUrl = data.to.trim();
    // 입력값이 /로 시작하면 그대로, 아니면 / 추가
    const normalizedInput = inputUrl.startsWith('/') ? inputUrl : `/${inputUrl}`;
    
    if (parentUrl) {
      // 상위 URL이 있으면 조합
      finalUrl = parentUrl + normalizedInput;
    } else {
      finalUrl = normalizedInput;
    }
  }

  // Firebase에 저장할 데이터 (undefined 제거, 빈 문자열은 null로)
  const menuData: any = {
    title: data.title,
    icon: data.icon || '📁',
    order: data.order || 1,
    isActive: data.isActive ?? true,
    roles: data.roles || [],
    level,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // to와 parentId는 값이 있을 때만 추가 (빈 문자열은 null로)
  menuData.to = finalUrl;
  menuData.parentId = data.parentId || null;

  const menusRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(menusRef, menuData);
  
  return docRef.id;
}

// 메뉴 수정
export async function updateMenu(id: string, data: Partial<MenuFormData>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  
  const updateData: any = {
    updatedAt: serverTimestamp(),
  };

  // 각 필드 처리
  if (data.title !== undefined) updateData.title = data.title;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.to !== undefined) updateData.to = data.to && data.to.trim() !== '' ? data.to : null;
  if (data.order !== undefined) updateData.order = data.order;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.roles !== undefined) updateData.roles = data.roles;

  // parentId가 변경되면 level도 재계산
  if (data.parentId !== undefined) {
    updateData.parentId = data.parentId || null;
    
    let level = 1;
    if (data.parentId) {
      const parent = await getMenuById(data.parentId);
      if (parent) {
        level = parent.level + 1;
        if (level > 5) {
          throw new Error('메뉴 깊이는 최대 5단계까지만 가능합니다.');
        }
      }
    }
    updateData.level = level;
  }

  await updateDoc(docRef, updateData);
}

// 메뉴 삭제 (하위 메뉴도 함께 삭제)
export async function deleteMenu(id: string): Promise<void> {
  // 하위 메뉴 찾기
  const menusRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(menusRef);
  const childMenus = snapshot.docs.filter(doc => doc.data().parentId === id);
  
  // 하위 메뉴들 재귀적으로 삭제
  for (const childDoc of childMenus) {
    await deleteMenu(childDoc.id);
  }
  
  // 현재 메뉴 삭제
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

// 메뉴 순서 변경
export async function reorderMenus(menuOrders: { id: string; order: number }[]): Promise<void> {
  const batch = writeBatch(db);
  
  menuOrders.forEach(({ id, order }) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    batch.update(docRef, { 
      order, 
      updatedAt: serverTimestamp() 
    });
  });
  
  await batch.commit();
}

// 메뉴를 트리 구조로 변환
export function buildMenuTree(menus: MenuItem[]): MenuItem[] {
  const menuMap = new Map<string, MenuItem>();
  const roots: MenuItem[] = [];

  // 먼저 모든 메뉴를 맵에 저장
  menus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 트리 구조 구성
  menus.forEach(menu => {
    const menuItem = menuMap.get(menu.id)!;
    
    if (menu.parentId && menuMap.has(menu.parentId)) {
      const parent = menuMap.get(menu.parentId)!;
      parent.children = parent.children || [];
      parent.children.push(menuItem);
    } else {
      roots.push(menuItem);
    }
  });

  // 각 레벨에서 order로 정렬
  const sortChildren = (items: MenuItem[]) => {
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortChildren(item.children);
      }
    });
  };

  sortChildren(roots);
  return roots;
}

// 초기 메뉴 데이터 세팅 (최초 1회)
export async function initializeDefaultMenus(): Promise<void> {
  const existing = await getAllMenus();
  
  if (existing.length > 0) {
    console.log('메뉴가 이미 존재합니다. 기존 메뉴:', existing.length, '개');
    alert(`이미 ${existing.length}개의 메뉴가 존재합니다.`);
    return;
  }

  console.log('기본 메뉴 초기화 시작...');

  for (const menu of DEFAULT_MENU_DATA) {
    const menuData: any = {
      title: menu.title,
      icon: menu.icon || '📁',
      order: menu.order,
      level: menu.level,
      isActive: menu.isActive ?? true,
      roles: menu.roles || [],
      to: menu.to || null,  // undefined 대신 null
      parentId: menu.parentId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const menusRef = collection(db, COLLECTION_NAME);
    await addDoc(menusRef, menuData);
    console.log('메뉴 추가됨:', menu.title);
  }

  console.log('기본 메뉴가 초기화되었습니다.');
  alert('기본 메뉴가 초기화되었습니다!');
}