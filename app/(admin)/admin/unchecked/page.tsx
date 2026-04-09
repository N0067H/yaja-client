'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, Pencil, X, CheckCircle2, Building2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAdminData, manualCheck, setSelectedDate } from '@/lib/slices/adminSlice';
import { getBuildingsAPI } from '@/lib/mock/api';
import { Building, CheckRecord } from '@/types';

export default function UncheckedPage() {
  const dispatch = useAppDispatch();
  const { uncheckedStudents, selectedDate, loading } = useAppSelector((s) => s.admin);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [modal, setModal] = useState<CheckRecord | null>(null);
  const [activeBuildingId, setActiveBuildingId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    dispatch(fetchAdminData(selectedDate));
    getBuildingsAPI().then((b) => { setBuildings(b); setActiveBuildingId(b[0]?.id ?? ''); });
  }, [selectedDate, dispatch]);

  function openModal(record: CheckRecord) {
    setModal(record);
    setSelectedRoomId('');
    setActiveBuildingId(buildings[0]?.id ?? '');
  }

  async function handleSubmit() {
    if (!modal || !selectedRoomId) { toast.warn('장소를 선택해주세요.'); return; }
    setSubmitting(true);
    const result = await dispatch(manualCheck({ studentId: modal.studentId, date: selectedDate, roomId: selectedRoomId }));
    setSubmitting(false);
    if (manualCheck.fulfilled.match(result)) {
      toast.success(`${modal.studentName} 학생 수동 입력 완료`);
      setModal(null);
    } else {
      toast.error('수동 입력에 실패했습니다.');
    }
  }

  const currentBuilding = buildings.find((b) => b.id === activeBuildingId);

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>미체크 학생 관리</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>위치를 등록하지 않은 학생 목록</p>
        </div>
        <input type="date" value={selectedDate} max={todayStr}
          onChange={(e) => dispatch(setSelectedDate(e.target.value))}
          className="px-3 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-1)' }} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--brand)' }} />
        </div>
      ) : uncheckedStudents.length === 0 ? (
        <div className="rounded-3xl p-10 flex flex-col items-center gap-3" style={{ background: 'var(--success-light)', border: '1.5px solid #b8dda0' }}>
          <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--success)' }} />
          <p className="text-base font-semibold" style={{ color: 'var(--success)' }}>모든 학생이 체크 완료했어요!</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: 'var(--warn-light)', border: '1px solid #f0c97a' }}>
            <AlertCircle className="w-4 h-4" style={{ color: 'var(--warn)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--warn)' }}>미체크 학생 {uncheckedStudents.length}명</p>
          </div>

          <div className="flex flex-col gap-2">
            {uncheckedStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{s.studentName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{s.grade}학년 {s.classNum}반</p>
                </div>
                <button onClick={() => openModal(s)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: 'var(--brand-light)', color: 'var(--brand)', border: '1px solid var(--brand-mid)' }}>
                  <Pencil className="w-3 h-3" />
                  수동 입력
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 수동 입력 모달 */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="w-full max-w-sm rounded-3xl flex flex-col gap-4 p-5"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', maxHeight: '80vh' }}>
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold" style={{ color: 'var(--text-1)' }}>수동 입력</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {modal.studentName} · {modal.grade}학년 {modal.classNum}반
                </p>
              </div>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                <X className="w-4 h-4" style={{ color: 'var(--text-2)' }} />
              </button>
            </div>

            {/* 건물 탭 */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {buildings.map((b) => (
                <button key={b.id} onClick={() => { setActiveBuildingId(b.id); setSelectedRoomId(''); }}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={activeBuildingId === b.id
                    ? { background: 'var(--brand)', color: '#fff' }
                    : { background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                  <Building2 className="w-3 h-3" />{b.name}
                </button>
              ))}
            </div>

            {/* 호실 목록 */}
            <div className="flex flex-col gap-2 overflow-y-auto flex-1" style={{ maxHeight: 280 }}>
              {currentBuilding?.floors.map((floor) => (
                <div key={floor.id}>
                  <p className="text-xs font-semibold mb-1.5 px-1" style={{ color: 'var(--text-3)' }}>{floor.label}</p>
                  <div className="flex flex-col gap-1.5">
                    {floor.rooms.map((room) => {
                      const sel = selectedRoomId === room.id;
                      return (
                        <button key={room.id} onClick={() => setSelectedRoomId(room.id)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left"
                          style={sel
                            ? { background: 'var(--brand-light)', border: '1.5px solid var(--brand-mid)', color: 'var(--brand)' }
                            : { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
                          <span>{room.name}</span>
                          {sel && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--brand)' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={!selectedRoomId || submitting}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: selectedRoomId ? 'var(--brand)' : 'var(--text-3)', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {submitting ? '처리 중...' : '입력 완료'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
