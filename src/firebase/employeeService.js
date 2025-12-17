// src/firebase/employeeService.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './config';
  
  const COLLECTION_NAME = 'users';
  
  // 모든 직원 가져오기
  export async function getAllEmployees() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error('직원 목록 로딩 실패:', error);
      throw error;
    }
  }
  
  // 단일 직원 정보 가져오기
  export async function getEmployee(userId) {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        throw new Error('직원을 찾을 수 없습니다.');
      }
  
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      };
    } catch (error) {
      console.error('직원 정보 로딩 실패:', error);
      throw error;
    }
  }
  
  // 직원 정보 수정
  export async function updateEmployee(userId, employeeData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await updateDoc(docRef, {
        ...employeeData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('직원 정보 수정 실패:', error);
      throw error;
    }
  }
  
  // 직원 삭제
  export async function deleteEmployee(userId) {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('직원 삭제 실패:', error);
      throw error;
    }
  }
  
  // 프로필 이미지 업로드
  export async function uploadProfileImage(userId, imageFile) {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, `profile-images/${userId}/${fileName}`);
  
      await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(storageRef);
  
      return downloadUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    }
  }