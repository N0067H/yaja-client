'use client';
import { useEffect, useState } from 'react';
import { Users, CheckCircle2, AlertCircle, MapPin, Search, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAdminData, setSelectedDate } from '@/lib/slices/adminSlice';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { stats, roomStats, allRecords, selectedDate, loading } = useAppSelector((s) => s.admin);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAdminData(selectedDate));
  }, [selectedDate, dispatch]);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredRecords = search.trim()
    ? allRecords.filter((r) =>
        r.studentName.includes(search) ||
        String(r.grade).includes(search) ||
        String(r.classNum).includes(search) ||
        r.roomName.includes(search)
      )
    : allRecords;

  const checkedRecords = filteredRecords.filter((r) => r.status === 'checked');
  const uncheckedRecords = filteredRecords.filter((r) => r.status === 'unchecked');

  function displayDate(d: string) {
    return d === todayStr ? '오늘' : new Date(d).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>야자 현황 대시보드</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>{displayDate(selectedDate)} 야간자율학습 현황</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={selectedDate} max={todayStr}
            onChange={(e) => dispatch(setSelectedDate(e.target.value))}
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-1)' }} />
          <button onClick={() => dispatch(fetchAdminData(selectedDate))}
            className="p-2 rounded-xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
            <RefreshCw className="w-4 h-4" style={{ color: 'var(--text-2)' }} />
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', height: 90 }} />
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '전체 학생', value: stats.total, icon: Users, color: 'var(--text-1)', bg: 'var(--surface-1)' },
            { label: '체크 완료', value: stats.checked, icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-light)' },
            { label: '미체크', value: stats.unchecked, icon: AlertCircle, color: 'var(--warn)', bg: 'var(--warn-light)' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: s.bg, border: '1px solid var(--border)' }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* 진행률 바 */}
      {stats && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>체크 완료율</span>
            <span className="text-sm font-bold" style={{ color: 'var(--brand)' }}>
              {stats.total > 0 ? Math.round((stats.checked / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.checked / stats.total) * 100 : 0}%`, background: 'var(--brand)' }} />
          </div>
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-3)' }}>{stats.checked}명 완료 / {stats.unchecked}명 미완료</p>
        </div>
      )}

      {/* 장소별 현황 */}
      {roomStats.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <MapPin className="w-4 h-4" style={{ color: 'var(--brand)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>장소별 현황</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {roomStats.map((rs, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{rs.roomName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{rs.buildingName} {rs.floorLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{rs.count}명</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 + 전체 목록 */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>전체 학생</h3>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-3)' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="이름, 학년/반, 장소 검색"
              className="flex-1 text-xs outline-none bg-transparent" style={{ color: 'var(--text-1)' }} />
          </div>
        </div>
        <div className="divide-y overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-4 gap-2 px-4 py-2 text-xs font-semibold" style={{ background: 'var(--surface-2)', color: 'var(--text-3)', minWidth: 380 }}>
            <span>이름</span><span>학년/반</span><span>장소</span><span>상태</span>
          </div>
          {filteredRecords.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-3)' }}>검색 결과가 없습니다</div>
          ) : (
            [...checkedRecords, ...uncheckedRecords].map((r) => (
              <div key={r.id} className="grid grid-cols-4 gap-2 px-4 py-3 text-sm items-center" style={{ minWidth: 380 }}>
                <span className="font-medium" style={{ color: 'var(--text-1)' }}>{r.studentName}</span>
                <span style={{ color: 'var(--text-2)' }}>{r.grade}학년 {r.classNum}반</span>
                <span className="truncate text-xs" style={{ color: 'var(--text-2)' }}>
                  {r.status === 'checked' ? `${r.buildingName} ${r.roomName}` : '-'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-lg w-fit"
                  style={r.status === 'checked'
                    ? { background: 'var(--success-light)', color: 'var(--success)' }
                    : { background: 'var(--warn-light)', color: 'var(--warn)' }}>
                  {r.status === 'checked' ? `완료 ${r.checkedAt}` : '미체크'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
