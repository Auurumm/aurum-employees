// src/firebase/menuService.js
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
  import { db } from './config';  // ← import 경로만 수정
  
  const COLLECTION_NAME = 'menus';
  
  // 모든 메뉴 가져오기
  export async function getAllMenus() {
    try {
      const menusRef = collection(db, COLLECTION_NAME);
      const q = query(menusRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error('getAllMenus 에러:', error);
      const menusRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(menusRef);
      
      const menus = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
      
      return menus.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  }
  
  // ... 나머지 함수들 그대로 복사
  // (TypeScript 타입만 제거하면 됨)