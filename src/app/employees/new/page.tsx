// src/app/employees/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { POSITIONS, DEPARTMENTS } from '@/types/user';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import './new-employee.css';

function NewEmployeePageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    gender: '남' as '남' | '여',
    birthYear: '',
    address: '',
    joinDate: '',
    position: '주임',
    department: '없음',
    note: '',
  });

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
      alert('이메일, 비밀번호, 이름은 필수입니다.');
      return;
    }

    if (formData.birthYear && formData.birthYear.length !== 6) {
      alert('생년월일은 6자리(YYMMDD)로 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`직원 등록 완료!\n\n이메일: ${formData.email}\n비밀번호: ${formData.password}\n\n※ 비밀번호를 안전하게 전달해주세요.`);
        router.push('/employees');
      } else {
        alert(`등록 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('등록 실패:', error);
      alert('등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="new-employee-page">
        <h1 className="page-title">신규 직원 등록</h1>

        <form onSubmit={handleSubmit} className="new-form">
          {/* 계정 정보 */}
          <div className="form-card account-card">
            <h2 className="section-title">계정 정보</h2>

            <div className="form-group">
              <label className="form-label">
                이메일 (로그인 ID) <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@company.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                초기 비밀번호 <span className="required">*</span>
              </label>
              <div className="password-field">
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="최소 6자 이상"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="generate-btn"
                >
                  자동생성
                </button>
              </div>
              <span className="form-hint">※ 이 비밀번호를 직원에게 안전하게 전달하세요</span>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="form-card">
            <h2 className="section-title">기본 정보</h2>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  이름 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">성별</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">생년월일 (6자리)</label>
                <input
                  type="text"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  placeholder="YYMMDD"
                  maxLength={6}
                  className="form-input"
                />
                <span className="form-hint">예: 900101</span>
              </div>

              <div className="form-group">
                <label className="form-label">연락처</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">입사일</label>
                <input
                  type="month"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">직급</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="form-select"
                >
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">직계</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-select"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="form-card">
            <h2 className="section-title">추가 정보</h2>

            <div className="form-group">
              <label className="form-label">주소(ㅇㅇ시 ㅇㅇ구)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                슬로건
                <span className="char-count">({formData.note.length}/70자)</span>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                maxLength={70}
                rows={3}
                className="form-textarea"
                placeholder="최대 70자"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? '등록중...' : '등록'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/employees')}
              className="btn btn-secondary"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default function NewEmployeePage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <NewEmployeePageContent />
    </ProtectedRoute>
  );
}