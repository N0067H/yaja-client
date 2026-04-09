'use client';
import { useEffect } from 'react';
import { CheckCircle2, XCircle, MapPin, Clock, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAdminData, setSelectedDate } from '@/lib/slices/adminSlice';

export default function AdminHistoryPage() {
  const dispatch = useAppDispatch();
  const { allRecords, stats, selectedDate, loading } = useAppSelector((s) => s.admin);
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    dispatch(fetchAdminData(selectedDate));
  }, [selectedDate, dispatch]);

  function formatDisplayDate(d: string) {
    const date = new Date(d);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
  }

  const checkedRecords = allRecords.filter((r) => r.status === 'checked');
  const uncheckedRecords = allRecords.filter((r) => r.status === 'unchecked');

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>날짜별 히스토리</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>날짜를 선택해 과거 기록을 조회하세요</p>
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

      {/* 선택 날짜 표시 */}
      <div className="px-4 py-3 rounded-2xl flex items-center gap-3"
        style={{ background: 'var(--brand-light)', border: '1px solid var(--brand-mid)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand)' }}>
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{formatDisplayDate(selectedDate)}</p>
          {stats && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--brand-mid)' }}>
              전체 {stats.total}명 · 완료 {stats.checked}명 · 미체크 {stats.unchecked}명
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--brand)' }} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* 체크 완료 */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--success-light)' }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>체크 완료 {checkedRecords.length}명</span>
            </div>
            {checkedRecords.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-3)' }}>없음</div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {checkedRecords.map((r) => (
                  <div key={r.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>
                        {r.studentName}
                        <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-3)' }}>{r.grade}학년 {r.classNum}반</span>
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--text-2)' }}>
                        <MapPin className="w-3 h-3" />
                        {r.buildingName} {r.floorLabel} · {r.roomName}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                      <Clock className="w-3 h-3" />
                      {r.checkedAt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 미체크 */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--warn-light)' }}>
              <XCircle className="w-4 h-4" style={{ color: 'var(--warn)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--warn)' }}>미체크 {uncheckedRecords.length}명</span>
            </div>
            {uncheckedRecords.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-3)' }}>없음</div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {uncheckedRecords.map((r) => (
                  <div key={r.id} className="px-4 py-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>
                      {r.studentName}
                      <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-3)' }}>{r.grade}학년 {r.classNum}반</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>위치 미등록</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
