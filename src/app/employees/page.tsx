// src/app/employees/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import type { User, Position, Department } from '@/types/user';
import { POSITIONS, DEPARTMENTS, getPositionType } from '@/types/user';
import './employees.css';

export default function EmployeesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<Department | '전체'>('전체');
  const [filterPosition, setFilterPosition] = useState<Position | '전체'>('전체');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setEmployees(data);
      } catch (error) {
        console.error('직원 데이터 로드 실패:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.includes(searchTerm) || emp.phone.includes(searchTerm);
    const matchesDepartment = filterDepartment === '전체' || emp.department === filterDepartment;
    const matchesPosition = filterPosition === '전체' || emp.position === filterPosition;
    return matchesSearch && matchesDepartment && matchesPosition;
  });

  const stats = {
    total: employees.length,
    직원: employees.filter(e => getPositionType(e.position) === '직원').length,
    임원: employees.filter(e => getPositionType(e.position) === '임원').length,
  };

  if (loading || !user) {
    return (
      <div className="loading-screen">
        <div className="loading-text">로딩중...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="employees-page">
        {/* 통계 카드 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">전체 직원</div>
            <div className="stat-value">{stats.total}명</div>
          </div>
          <div className="stat-card gold">
            <div className="stat-label">직원</div>
            <div className="stat-value">{stats.직원}명</div>
          </div>
          <div className="stat-card gold-dark">
            <div className="stat-label">임원</div>
            <div className="stat-value">{stats.임원}명</div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="search-container">
          <input
            type="text"
            placeholder="이름 또는 연락처 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value as Department | '전체')}
            className="filter-select"
          >
            <option value="전체">전체 직계</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value as Position | '전체')}
            className="filter-select"
          >
            <option value="전체">전체 직급</option>
            {POSITIONS.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        {/* 직원 목록 */}
        {loadingData ? (
          <div className="loading-text">데이터를 불러오는 중...</div>
        ) : (
          <div className="employees-grid">
            {filteredEmployees.map(employee => (
              <Link key={employee.id} href={`/employees/edit/${employee.id}`}>
                <div className="employee-card">
                  <div className="employee-avatar">
                    {employee.profileImage ? (
                      <Image
                        src={employee.profileImage}
                        alt={employee.name}
                        fill
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {employee.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="employee-info">
                    <div className="employee-header">
                      <h3 className="employee-name">{employee.name}</h3>
                      <span className={`employee-badge ${getPositionType(employee.position)}`}>
                        {getPositionType(employee.position)}
                      </span>
                    </div>
                    <p className="employee-position">
                      {employee.position} · {employee.department}
                    </p>
                    <p className="employee-phone">{employee.phone}</p>
                    {employee.note && (
                      <p className="employee-note">
                        {employee.note ? `"${employee.note}"` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredEmployees.length === 0 && !loadingData && (
          <div className="no-results">검색 결과가 없습니다.</div>
        )}
      </div>
    </DashboardLayout>
  );
}