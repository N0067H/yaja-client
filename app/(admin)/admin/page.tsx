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

  const checkRate = stats && stats.total > 0 ? Math.round((stats.checked / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
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
            <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', height: 110 }} />
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '전체 학생', value: stats.total, sub: '명 등록', icon: Users, color: 'var(--text-1)', bg: 'var(--surface-1)', iconBg: 'var(--surface-2)' },
            { label: '체크 완료', value: stats.checked, sub: `명 · ${checkRate}%`, icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-light)', iconBg: '#bbf7d0' },
            { label: '미체크', value: stats.unchecked, sub: `명 · ${100 - checkRate}%`, icon: AlertCircle, color: 'var(--warn)', bg: 'var(--warn-light)', iconBg: '#fde68a' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: s.bg, border: '1px solid var(--border)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.iconBg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-3xl font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs mt-1.5" style={{ color: 'var(--text-2)' }}>{s.label} {s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 진행률 바 */}
      {stats && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>체크 완료율</span>
            <span className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{checkRate}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${checkRate}%`, background: 'var(--brand)' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-3)' }}>{stats.checked}명 완료 · {stats.unchecked}명 미완료</p>
        </div>
      )}

      {/* 장소별 현황 */}
      {roomStats.length > 0 && stats && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <MapPin className="w-4 h-4" style={{ color: 'var(--brand)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>장소별 현황</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {roomStats.map((rs, i) => {
              const pct = stats.checked > 0 ? Math.round((rs.count / stats.checked) * 100) : 0;
              return (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{rs.roomName}</p>
                      <span className="text-sm font-bold ml-3 flex-shrink-0" style={{ color: 'var(--brand)' }}>{rs.count}명</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--brand)' }} />
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-3)' }}>{rs.buildingName} {rs.floorLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 검색 + 전체 목록 */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--text-1)' }}>전체 학생</h3>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-3)' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="이름, 학년/반, 장소 검색"
              className="flex-1 text-xs outline-none bg-transparent" style={{ color: 'var(--text-1)' }} />
          </div>
        </div>
        <div className="overflow-x-auto">
          {/* 테이블 헤더 */}
          <div className="grid px-4 py-2.5 text-xs font-semibold" style={{ background: 'var(--surface-2)', color: 'var(--text-3)', minWidth: 520, gridTemplateColumns: '1fr 100px 1fr 80px 80px' }}>
            <span>이름</span>
            <span>학년/반</span>
            <span>장소</span>
            <span>체크시각</span>
            <span>상태</span>
          </div>
          {filteredRecords.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-3)' }}>검색 결과가 없습니다</div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[...checkedRecords, ...uncheckedRecords].map((r) => (
                <div key={r.id} className="grid px-4 py-3 text-sm items-center gap-2"
                  style={{ minWidth: 520, gridTemplateColumns: '1fr 100px 1fr 80px 80px' }}>
                  <span className="font-medium truncate" style={{ color: 'var(--text-1)' }}>{r.studentName}</span>
                  <span style={{ color: 'var(--text-2)' }}>{r.grade}학년 {r.classNum}반</span>
                  <span className="truncate text-xs" style={{ color: 'var(--text-2)' }}>
                    {r.status === 'checked' ? `${r.buildingName} ${r.roomName}` : '-'}
                  </span>
                  <span className="text-xs" style={{ color: r.status === 'checked' ? 'var(--text-2)' : 'var(--text-3)' }}>
                    {r.status === 'checked' ? r.checkedAt : '-'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg w-fit font-medium"
                    style={r.status === 'checked'
                      ? { background: 'var(--success-light)', color: 'var(--success)' }
                      : { background: 'var(--warn-light)', color: 'var(--warn)' }}>
                    {r.status === 'checked' ? '완료' : '미체크'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
