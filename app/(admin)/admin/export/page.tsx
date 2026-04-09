'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Download, FileSpreadsheet, FileText, CalendarDays, Loader2 } from 'lucide-react';
import { getAllRecordsAPI } from '@/lib/mock/api';

export default function ExportPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  async function getAllRecordsForRange() {
    const records = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayRecords = await getAllRecordsAPI(dateStr);
      records.push(...dayRecords);
    }
    return records;
  }

  async function handleExportCSV() {
    if (startDate > endDate) { toast.error('시작일이 종료일보다 늦을 수 없습니다.'); return; }
    setLoading(true);
    try {
      const records = await getAllRecordsForRange();
      const header = '날짜,학년,반,이름,상태,건물,층,장소,체크시각';
      const rows = records.map((r) =>
        [r.date, r.grade, r.classNum, r.studentName, r.status === 'checked' ? '완료' : '미체크',
          r.buildingName || '', r.floorLabel || '', r.roomName || '', r.checkedAt || ''].join(',')
      );
      const csv = '\uFEFF' + [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `야자현황_${startDate}_${endDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`CSV 내보내기 완료 (${records.length}건)`);
    } catch {
      toast.error('내보내기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleExportJSON() {
    if (startDate > endDate) { toast.error('시작일이 종료일보다 늦을 수 없습니다.'); return; }
    setLoading(true);
    try {
      const records = await getAllRecordsForRange();
      const json = JSON.stringify(records, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `야자현황_${startDate}_${endDate}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`JSON 내보내기 완료 (${records.length}건)`);
    } catch {
      toast.error('내보내기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  const dayDiff = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>데이터 내보내기</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>날짜 범위를 선택해 야자 기록을 다운로드하세요</p>
      </div>

      {/* 날짜 범위 선택 */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" style={{ color: 'var(--brand)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>날짜 범위 선택</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>시작일</label>
            <input type="date" value={startDate} max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>종료일</label>
            <input type="date" value={endDate} min={startDate} max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }} />
          </div>
        </div>
        {dayDiff > 0 && (
          <p className="text-xs px-3 py-2 rounded-xl" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
            선택 범위: {dayDiff}일 ({startDate} ~ {endDate})
          </p>
        )}
      </div>

      {/* 내보내기 옵션 */}
      <div className="flex flex-col gap-3">
        <button onClick={handleExportCSV} disabled={loading}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success-light)' }}>
            <FileSpreadsheet className="w-5 h-5" style={{ color: 'var(--success)' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>CSV 내보내기</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>엑셀에서 바로 열 수 있는 CSV 파일</p>
          </div>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text-3)' }} />
            : <Download className="w-4 h-4" style={{ color: 'var(--text-3)' }} />}
        </button>

        <button onClick={handleExportJSON} disabled={loading}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-light)' }}>
            <FileText className="w-5 h-5" style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>JSON 내보내기</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>개발자/시스템 연동용 JSON 파일</p>
          </div>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text-3)' }} />
            : <Download className="w-4 h-4" style={{ color: 'var(--text-3)' }} />}
        </button>
      </div>

      {/* 안내 */}
      <div className="px-4 py-4 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-2)' }}>포함 항목</p>
        <ul className="text-xs space-y-1" style={{ color: 'var(--text-3)' }}>
          {['날짜', '학년 / 반 / 이름', '체크 상태 (완료/미체크)', '건물 · 층 · 장소', '체크 시각'].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--text-3)' }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
