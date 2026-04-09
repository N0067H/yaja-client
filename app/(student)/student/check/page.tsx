'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CheckCircle2, Loader2, Building2, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { submitCheck, fetchTodayRecord } from '@/lib/slices/checkSlice';
import { getBuildingsAPI } from '@/lib/mock/api';
import { Building, Room } from '@/types';

export default function CheckPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { todayRecord, loading } = useAppSelector((s) => s.check);

  const todayStr = new Date().toISOString().split('T')[0];

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [activeBuilding, setActiveBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    getBuildingsAPI().then((b) => {
      setBuildings(b);
      setActiveBuilding(b[0]?.id ?? '');
    });
    if (user) dispatch(fetchTodayRecord({ studentId: user.id, date: todayStr }));
  }, [user, todayStr, dispatch]);

  // 기존 체크 장소 초기 선택
  useEffect(() => {
    if (todayRecord?.status === 'checked' && todayRecord.roomId && buildings.length) {
      const room = buildings.flatMap((b) => b.floors.flatMap((f) => f.rooms)).find((r) => r.id === todayRecord.roomId);
      if (room) {
        setSelectedRoom(room);
        setActiveBuilding(room.buildingId);
      }
    }
  }, [todayRecord, buildings]);

  const currentBuilding = buildings.find((b) => b.id === activeBuilding);

  async function handleSubmit() {
    if (!selectedRoom || !user) { toast.warn('장소를 선택해주세요.'); return; }
    const result = await dispatch(submitCheck({ studentId: user.id, date: todayStr, roomId: selectedRoom.id }));
    if (submitCheck.fulfilled.match(result)) {
      toast.success(`✅ ${selectedRoom.buildingName} ${selectedRoom.floorLabel} ${selectedRoom.name} 체크 완료!`);
      router.push('/student');
    } else {
      toast.error('체크에 실패했습니다.');
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex flex-col gap-4 flex-1">
        {/* 헤더 */}
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>위치 선택</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>오늘 야자할 장소를 선택하세요</p>
        </div>

        {/* 현재 선택 표시 */}
        {selectedRoom && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'var(--brand-light)', border: '1.5px solid var(--brand-mid)' }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: 'var(--brand-mid)' }}>선택된 장소</p>
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand)' }}>
                {selectedRoom.buildingName} {selectedRoom.floorLabel} · {selectedRoom.name}
              </p>
            </div>
          </div>
        )}

        {/* 건물 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {buildings.map((b) => (
            <button key={b.id} onClick={() => setActiveBuilding(b.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={activeBuilding === b.id
                ? { background: 'var(--brand)', color: '#fff' }
                : { background: 'var(--surface-1)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
              <Building2 className="w-3.5 h-3.5" />
              {b.name}
            </button>
          ))}
        </div>

        {/* 호실 목록 */}
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {currentBuilding?.floors.map((floor) => (
            <div key={floor.id}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: 'var(--surface-3)', color: 'var(--text-2)' }}>
                  {floor.label}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
              <div className="flex flex-col gap-2">
                {floor.rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <button key={room.id} onClick={() => setSelectedRoom(room)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium text-left transition-all"
                      style={isSelected
                        ? { background: 'var(--brand-light)', border: '1.5px solid var(--brand-mid)', color: 'var(--brand)' }
                        : { background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
                      <span>{room.name}</span>
                      {isSelected
                        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand)' }} />
                        : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-3)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 확인 버튼 */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-1)' }}>
        <button onClick={handleSubmit} disabled={!selectedRoom || loading}
          className="w-full py-4 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
          style={{ background: selectedRoom ? 'var(--brand)' : 'var(--text-3)', opacity: loading ? 0.7 : 1 }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          {loading ? '등록 중...' : selectedRoom ? `${selectedRoom.name} 으로 체크` : '장소를 선택하세요'}
        </button>
      </div>
    </div>
  );
}
