// src/app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Firebase Admin 초기화
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    // Firebase Auth에 사용자 생성
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Firestore에 사용자 정보 저장 (role: pending)
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      name,
      phone,
      role: 'pending', // 승인 대기
      profileImage: '',
      gender: '남',
      birthYear: '',
      address: '',
      joinDate: '',
      position: '스탭',
      department: '없음',
      note: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    console.error('회원가입 실패:', error);
    return NextResponse.json(
      { success: false, error: error.message || '회원가입에 실패했습니다.' },
      { status: 500 }
    );
  }
}