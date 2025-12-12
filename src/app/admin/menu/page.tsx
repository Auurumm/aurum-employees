// app/admin/menu/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MenuItem, MenuFormData } from '@/types/menu';
import { 
  getAllMenus, 
  addMenu, 
  updateMenu, 
  deleteMenu, 
  buildMenuTree,
  initializeDefaultMenus,
  reorderMenus
} from '@/lib/menuService';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './menu.css';

// 이모지 선택 옵션
const ICON_OPTIONS = [
  '🏠', '👥', '💰', '📁', '⚖️', '📚', '🏢', '📊', '📋', '📝',
  '🔒', '🎓', '📈', '⚙️', '🔧', '📅', '💼', '📧', '🔔', '⭐',
  '✅', '❌', '🚀', '💡', '🎯', '📌', '🗂️', '🗃️', '📦', '🔍',
  '💳', '🧾', '📑', '🏦', '💵', '📤', '📥', '🗓️', '⏰', '🔗',
];

// 드래그 가능한 메뉴 아이템 컴포넌트
interface SortableMenuItemProps {
  menu: MenuItem;
  depth: number;
  onEdit: (menu: MenuItem) => void;
  onDelete: (menu: MenuItem) => void;
  onAddChild: (parentId: string, parentLevel: number) => void;
  children?: React.ReactNode;
}

function SortableMenuItem({ menu, depth, onEdit, onDelete, onAddChild, children }: SortableMenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginLeft: depth * 24,
  };

  return (
    <div ref={setNodeRef} style={style} className="menu-tree-item">
      <div className={`menu-row ${!menu.isActive ? 'inactive' : ''} ${isDragging ? 'dragging' : ''}`}>
        {/* 드래그 핸들 */}
        <div className="menu-drag-handle" {...attributes} {...listeners}>
          <span className="drag-icon">☰</span>
        </div>
        
        <div className="menu-info">
          <span className="menu-level">H{menu.level}</span>
          <span className="menu-icon">{menu.icon}</span>
          <span className="menu-title">{menu.title}</span>
          {menu.to && <span className="menu-url">{menu.to}</span>}
          {!menu.isActive && <span className="badge badge-warning">비활성</span>}
        </div>
        <div className="menu-actions">
          {menu.level < 5 && (
            <button 
              className="btn-icon add"
              onClick={() => onAddChild(menu.id, menu.level)}
              title="하위 메뉴 추가"
            >
              ➕
            </button>
          )}
          <button 
            className="btn-icon"
            onClick={() => onEdit(menu)}
            title="수정"
          >
            ✏️
          </button>
          <button 
            className="btn-icon delete"
            onClick={() => onDelete(menu)}
            title="삭제"
          >
            🗑️
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function MenuManagementPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  
  // 폼 데이터
  const [formData, setFormData] = useState<MenuFormData>({
    title: '',
    icon: '📁',
    to: '',
    parentId: null,
    order: 1,
    isActive: true,
    roles: [],
  });

  // 드래그 앤 드롭 센서
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 권한 체크
  useEffect(() => {
    if (!isAdmin) {
      alert('관리자만 접근할 수 있습니다.');
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  // 메뉴 불러오기
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await getAllMenus();
      setMenus(data);
      setMenuTree(buildMenuTree(data));
    } catch (error) {
      console.error('메뉴 로딩 실패:', error);
      alert('메뉴를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMenus();
    }
  }, [isAdmin]);

  // 통계 계산
  const stats = {
    total: menus.length,
    active: menus.filter(m => m.isActive).length,
    inactive: menus.filter(m => !m.isActive).length,
    maxDepth: menus.length > 0 ? Math.max(...menus.map(m => m.level)) : 0,
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      icon: '📁',
      to: '',
      parentId: null,
      order: menus.length + 1,
      isActive: true,
      roles: [],
    });
    setEditingMenu(null);
  };

  // 모달 열기 (추가)
  const handleAddClick = (parentId: string | null = null, parentLevel: number = 0) => {
    if (parentLevel >= 5) {
      alert('메뉴 깊이는 최대 5단계까지만 가능합니다.');
      return;
    }
    
    const siblingMenus = menus.filter(m => m.parentId === parentId);
    const maxOrder = siblingMenus.length > 0 
      ? Math.max(...siblingMenus.map(m => m.order)) 
      : 0;

    setFormData({
      title: '',
      icon: '📁',
      to: '',
      parentId,
      order: maxOrder + 1,
      isActive: true,
      roles: [],
    });
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  // 모달 열기 (수정)
  const handleEditClick = (menu: MenuItem) => {
    setFormData({
      title: menu.title,
      icon: menu.icon || '📁',
      to: menu.to || '',
      parentId: menu.parentId,
      order: menu.order,
      isActive: menu.isActive,
      roles: menu.roles || [],
    });
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  // 저장
  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('메뉴 이름을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      
      if (editingMenu) {
        await updateMenu(editingMenu.id, formData);
      } else {
        await addMenu(formData);
      }
      
      await fetchMenus();
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('저장 실패:', error);
      alert(error.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 삭제
  const handleDelete = async (menu: MenuItem) => {
    const hasChildren = menus.some(m => m.parentId === menu.id);
    const message = hasChildren 
      ? `"${menu.title}" 메뉴와 모든 하위 메뉴가 삭제됩니다. 계속하시겠습니까?`
      : `"${menu.title}" 메뉴를 삭제하시겠습니까?`;

    if (!confirm(message)) return;

    try {
      await deleteMenu(menu.id);
      await fetchMenus();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 기본 메뉴 초기화
  const handleInitialize = async () => {
    if (!confirm('기본 메뉴로 초기화하시겠습니까?\n(기존 메뉴가 있으면 추가되지 않습니다)')) {
      return;
    }

    try {
      setLoading(true);
      await initializeDefaultMenus();
      await fetchMenus();
    } catch (error) {
      console.error('초기화 실패:', error);
      alert('초기화에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = async (event: DragEndEvent, parentId: string | null = null) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // 같은 레벨의 메뉴들 찾기
      const siblings = menus
        .filter(m => m.parentId === parentId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const oldIndex = siblings.findIndex(m => m.id === active.id);
      const newIndex = siblings.findIndex(m => m.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(siblings, oldIndex, newIndex);
        
        // 새 순서로 업데이트
        const updates = reordered.map((menu, index) => ({
          id: menu.id,
          order: index + 1,
        }));

        try {
          await reorderMenus(updates);
          await fetchMenus();
        } catch (error) {
          console.error('순서 변경 실패:', error);
          alert('순서 변경에 실패했습니다.');
        }
      }
    }
  };

  // 특정 레벨의 메뉴 트리 렌더링 (드래그 가능)
  const renderSortableMenus = (allMenus: MenuItem[], depth: number = 0, parentId: string | null = null) => {
    const levelItems = allMenus
      .filter(item => item.parentId === parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    if (levelItems.length === 0) return null;

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, parentId)}
      >
        <SortableContext
          items={levelItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {levelItems.map((menu) => {
            // 하위 메뉴가 있는지 확인 (children 대신 parentId로 체크)
            const hasChildren = allMenus.some(m => m.parentId === menu.id);
            
            return (
              <SortableMenuItem
                key={menu.id}
                menu={menu}
                depth={depth}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onAddChild={handleAddClick}
              >
                {hasChildren && (
                  <div className="menu-children">
                    {renderSortableMenus(allMenus, depth + 1, menu.id)}
                  </div>
                )}
              </SortableMenuItem>
            );
          })}
        </SortableContext>
      </DndContext>
    );
  };

  // 부모 메뉴 선택 옵션
  const getParentOptions = () => {
    const excludeIds = new Set<string>();
    
    if (editingMenu) {
      const addDescendants = (id: string) => {
        excludeIds.add(id);
        menus.filter(m => m.parentId === id).forEach(m => addDescendants(m.id));
      };
      addDescendants(editingMenu.id);
    }

    return menus
      .filter(m => !excludeIds.has(m.id) && m.level < 5)
      .map(m => ({
        id: m.id,
        title: `${'　'.repeat(m.level - 1)}${m.level > 1 ? '└ ' : ''}${m.title}`,
        level: m.level,
      }));
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-menu-page">
      {/* 상단 네비게이션 */}
      <nav className="admin-top-nav">
        <div className="admin-nav-left">
          <button className="back-btn" onClick={() => router.push('/dashboard')}>
            ← 대시보드로 돌아가기
          </button>
          <div className="admin-nav-title">
            <h1>⚙️ 메뉴 설정</h1>
            <span>사이드바 메뉴 구조를 관리합니다</span>
          </div>
        </div>
        <div className="admin-nav-right">
          <button className="btn-secondary" onClick={handleInitialize}>
            🔄 기본값 초기화
          </button>
          <button className="btn-primary" onClick={() => handleAddClick(null)}>
            + 새 메뉴 추가
          </button>
        </div>
      </nav>

      {/* 컨텐츠 */}
      <div className="admin-content">
        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>메뉴를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 통계 카드 */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h4>{stats.total}</h4>
                  <p>전체 메뉴</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h4>{stats.active}</h4>
                  <p>활성 메뉴</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚫</div>
                <div className="stat-content">
                  <h4>{stats.inactive}</h4>
                  <p>비활성 메뉴</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h4>H{stats.maxDepth || 0}</h4>
                  <p>최대 깊이</p>
                </div>
              </div>
            </div>

            {/* 메뉴 트리 */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>📂 메뉴 구조</h2>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  ☰ 아이콘을 드래그하여 순서 변경 | 최대 5단계(H1~H5)
                </span>
              </div>
              <div className="admin-card-body">
                {menuTree.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>등록된 메뉴가 없습니다.</p>
                    <button className="btn-primary" onClick={() => handleAddClick(null)}>
                      첫 메뉴 추가하기
                    </button>
                  </div>
                ) : (
                  <div className="menu-tree">
                    {renderSortableMenus(menus, 0, null)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMenu ? '✏️ 메뉴 수정' : '➕ 메뉴 추가'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {/* 부모 메뉴 선택 */}
              <div className="form-group">
                <label className="form-label">상위 메뉴</label>
                <select
                  className="form-input"
                  value={formData.parentId || ''}
                  onChange={e => setFormData({ ...formData, parentId: e.target.value || null })}
                >
                  <option value="">없음 (최상위 메뉴)</option>
                  {getParentOptions().map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 메뉴 이름 */}
              <div className="form-group">
                <label className="form-label">
                  메뉴 이름 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 직원 명부"
                  autoFocus
                />
              </div>

              {/* 아이콘 선택 */}
              <div className="form-group">
                <label className="form-label">아이콘</label>
                <div className="icon-picker">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL */}
              <div className="form-group">
                <label className="form-label">URL (링크)</label>
                <div className="url-input-wrapper">
                  {formData.parentId && (
                    <span className="url-prefix">
                      {(() => {
                        const parent = menus.find(m => m.id === formData.parentId);
                        if (!parent) return '';
                        
                        // 부모의 전체 경로 구하기
                        const buildParentPath = (menu: MenuItem): string => {
                          if (!menu.to) return '';
                          let path = menu.to;
                          let current = menu;
                          while (current.parentId) {
                            const grandParent = menus.find(m => m.id === current.parentId);
                            if (grandParent?.to) {
                              path = grandParent.to + path;
                              current = grandParent;
                            } else {
                              break;
                            }
                          }
                          return path;
                        };
                        
                        return parent.to || buildParentPath(parent) || '(상위 메뉴 URL 없음)';
                      })()}
                    </span>
                  )}
                  <input
                    type="text"
                    className="form-input"
                    value={formData.to}
                    onChange={e => setFormData({ ...formData, to: e.target.value })}
                    placeholder={formData.parentId ? "예: /employees" : "예: /hr"}
                  />
                </div>
                <span className="form-hint">
                  {formData.parentId 
                    ? '💡 상위 메뉴 URL이 자동으로 앞에 붙습니다. (예: /employees → /hr/employees)'
                    : '💡 비워두면 클릭 시 하위 메뉴가 펼쳐집니다.'}
                </span>
              </div>

              {/* 순서 */}
              <div className="form-group">
                <label className="form-label">순서</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  min={1}
                  style={{ width: '100px' }}
                />
              </div>

              {/* 활성화 */}
              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>활성화 (체크 해제 시 메뉴에서 숨김)</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-outline-primary" 
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
              >
                취소
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}