'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Users, Building2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_USERS, MOCK_BUILDINGS } from '@/lib/mock/data';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'buildings'>('students');
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>('building-1');

  const students = MOCK_USERS.filter((u) => u.role === 'student');

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>설정</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>학생 명단 및 장소 관리</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        {([['students', '학생 명단', Users], ['buildings', '장소 관리', Building2]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={activeTab === key
              ? { background: 'var(--brand)', color: '#fff' }
              : { color: 'var(--text-2)' }}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 학생 명단 탭 */}
      {activeTab === 'students' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>전체 학생 {students.length}명</p>
            <button onClick={() => toast.info('실제 구현 시 학생 추가 기능이 연결됩니다.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'var(--brand-light)', color: 'var(--brand)', border: '1px solid var(--brand-mid)' }}>
              <Plus className="w-3.5 h-3.5" />
              학생 추가
            </button>
          </div>

          {/* 학년별 그룹 */}
          {[1, 2, 3].map((grade) => {
            const gradeStudents = students.filter((s) => s.grade === grade);
            if (gradeStudents.length === 0) return null;
            return (
              <div key={grade} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{grade}학년</p>
                  <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>{gradeStudents.length}명</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {gradeStudents.map((s) => (
                    <div key={s.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{s.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                          {s.grade}학년 {s.classNum}반 {s.studentNum}번 · {s.admissionYear}년 입학
                        </p>
                      </div>
                      <button onClick={() => toast.info('실제 구현 시 삭제 기능이 연결됩니다.')}
                        className="p-2 rounded-xl" style={{ color: 'var(--danger)', background: 'var(--danger-light)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 장소 관리 탭 */}
      {activeTab === 'buildings' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>건물 {MOCK_BUILDINGS.length}개</p>
            <button onClick={() => toast.info('실제 구현 시 건물 추가 기능이 연결됩니다.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'var(--brand-light)', color: 'var(--brand)', border: '1px solid var(--brand-mid)' }}>
              <Plus className="w-3.5 h-3.5" />
              건물 추가
            </button>
          </div>

          {MOCK_BUILDINGS.map((b) => {
            const expanded = expandedBuilding === b.id;
            const totalRooms = b.floors.reduce((acc, f) => acc + f.rooms.length, 0);
            return (
              <div key={b.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <button className="w-full px-4 py-3.5 flex items-center justify-between"
                  onClick={() => setExpandedBuilding(expanded ? null : b.id)}
                  style={{ borderBottom: expanded ? '1px solid var(--border)' : 'none' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand-light)' }}>
                      <Building2 className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{b.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-3)' }}>{b.floors.length}개 층 · {totalRooms}개 장소</p>
                    </div>
                  </div>
                  {expanded ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-3)' }} />}
                </button>
                {expanded && (
                  <div className="flex flex-col gap-3 p-3">
                    {b.floors.map((floor) => (
                      <div key={floor.id}>
                        <p className="text-xs font-semibold px-2 mb-1.5" style={{ color: 'var(--text-3)' }}>{floor.label}</p>
                        <div className="flex flex-col gap-1.5">
                          {floor.rooms.map((room) => (
                            <div key={room.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                              <p className="text-sm" style={{ color: 'var(--text-1)' }}>{room.name}</p>
                              <button onClick={() => toast.info('실제 구현 시 삭제 기능이 연결됩니다.')}
                                className="p-1.5 rounded-lg" style={{ color: 'var(--danger)', background: 'var(--danger-light)' }}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => toast.info('실제 구현 시 장소 추가 기능이 연결됩니다.')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs"
                            style={{ color: 'var(--text-3)', border: '1px dashed var(--border)' }}>
                            <Plus className="w-3 h-3" />
                            장소 추가
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
