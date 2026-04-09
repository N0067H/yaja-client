'use client';
import { useEffect } from 'react';
import { CheckCircle2, XCircle, MapPin, Clock, CalendarDays } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchHistory } from '@/lib/slices/checkSlice';

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { history, loading } = useAppSelector((s) => s.check);

  useEffect(() => {
    if (user) dispatch(fetchHistory(user.id));
  }, [user, dispatch]);

  const checkedCount = history.filter((r) => r.status === 'checked').length;
  const total = history.length;

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>내 기록</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>날짜별 야자 체크 이력</p>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '전체', value: total, color: 'var(--text-1)', bg: 'var(--surface-1)' },
          { label: '체크 완료', value: checkedCount, color: 'var(--success)', bg: 'var(--success-light)' },
          { label: '미체크', value: total - checkedCount, color: 'var(--danger)', bg: 'var(--danger-light)' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: s.bg, border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* 기록 목록 */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--brand)' }} />
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <CalendarDays className="w-10 h-10" style={{ color: 'var(--text-3)' }} />
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>아직 기록이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((record) => {
            const isChecked = record.status === 'checked';
            return (
              <div key={record.id} className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: 'var(--surface-1)', border: `1px solid ${isChecked ? 'var(--border)' : '#f0c97a'}` }}>
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked
                    ? <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
                    : <XCircle className="w-5 h-5" style={{ color: 'var(--warn)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{formatDate(record.date)}</p>
                    <span className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={isChecked
                        ? { background: 'var(--success-light)', color: 'var(--success)' }
                        : { background: 'var(--warn-light)', color: 'var(--warn)' }}>
                      {isChecked ? '완료' : '미체크'}
                    </span>
                  </div>
                  {isChecked ? (
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-2)' }}>
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{record.buildingName} {record.floorLabel} · {record.roomName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>체크 시각 {record.checkedAt}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>위치 미등록</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
