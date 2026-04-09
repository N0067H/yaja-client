'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CheckCircle2, AlertCircle, Clock, ChevronRight, CalendarDays } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchTodayRecord } from '@/lib/slices/checkSlice';

export default function StudentHome() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { todayRecord, loading } = useAppSelector((s) => s.check);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const displayDate = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}.`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[today.getDay()];

  useEffect(() => {
    if (user) dispatch(fetchTodayRecord({ studentId: user.id, date: todayStr }));
  }, [user, todayStr, dispatch]);

  const isChecked = todayRecord?.status === 'checked';

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      {/* 인사말 */}
      <div>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>안녕하세요 👋</p>
        <h1 className="text-2xl font-bold mt-0.5" style={{ color: 'var(--text-1)' }}>
          {user?.name}
          <span className="text-base font-normal ml-1" style={{ color: 'var(--text-2)' }}>학생</span>
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
          {user?.grade}학년 {user?.classNum}반 · {user?.admissionYear}년 입학
        </p>
      </div>

      {/* 날짜 카드 */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        <CalendarDays className="w-5 h-5" style={{ color: 'var(--brand)' }} />
        <div>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>오늘</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{displayDate} ({dayName})</p>
        </div>
      </div>

      {/* 체크 상태 카드 */}
      {loading ? (
        <div className="rounded-3xl p-6 flex items-center justify-center" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', minHeight: 160 }}>
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--brand)' }} />
        </div>
      ) : isChecked ? (
        <div className="rounded-3xl p-6 flex flex-col gap-4" style={{ background: 'var(--success-light)', border: '1.5px solid #b8dda0' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>체크 완료</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--success)' }}>오늘 야자 위치가 등록됐어요</p>
            </div>
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(59,109,17,0.12)', color: 'var(--success)' }}>
              <Clock className="w-3 h-3" />
              {todayRecord?.checkedAt}
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>등록 위치</p>
            <p className="text-base font-bold" style={{ color: 'var(--text-1)' }}>{todayRecord?.buildingName} {todayRecord?.floorLabel}</p>
            <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--success)' }}>{todayRecord?.roomName}</p>
          </div>
          <button onClick={() => router.push('/student/check')}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: 'var(--surface-1)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
            <MapPin className="w-4 h-4" />
            위치 변경하기
          </button>
        </div>
      ) : (
        <div className="rounded-3xl p-6 flex flex-col gap-4" style={{ background: 'var(--warn-light)', border: '1.5px solid #f0c97a' }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--warn)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--warn)' }}>미체크</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--warn)' }}>
            아직 오늘 야자 위치를 등록하지 않았어요.<br />
            야자 시작 전에 꼭 체크해주세요!
          </p>
          <button onClick={() => router.push('/student/check')}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: 'var(--brand)' }}>
            <MapPin className="w-4 h-4" />
            지금 위치 체크하기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 빠른 바로가기 */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => router.push('/student/check')}
          className="flex flex-col items-start gap-2 p-4 rounded-2xl text-left"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <MapPin className="w-5 h-5" style={{ color: 'var(--brand)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>위치 체크</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>야자 장소 등록</p>
          </div>
        </button>
        <button onClick={() => router.push('/student/history')}
          className="flex flex-col items-start gap-2 p-4 rounded-2xl text-left"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <Clock className="w-5 h-5" style={{ color: 'var(--brand-mid)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>내 기록</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>날짜별 체크 이력</p>
          </div>
        </button>
      </div>
    </div>
  );
}
