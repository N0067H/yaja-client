import axios from 'axios';
import { MOCK_USERS, MOCK_BUILDINGS, MOCK_RECORDS } from './data';
import { User, CheckRecord, RoomStat, DailyStats } from '@/types';

// 목업이라 실제 API 호출 없이 인터셉터로 처리
const api = axios.create({ baseURL: '/api', timeout: 500 });

// 인터셉터: 실제 요청 대신 목업 데이터 반환
api.interceptors.request.use((config) => config);
api.interceptors.response.use(undefined, (error) => Promise.reject(error));

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 런타임 상태 (목업 레코드를 메모리에서 조작)
let runtimeRecords: CheckRecord[] = [...MOCK_RECORDS];

// Auth
export async function loginAPI(email: string, password: string): Promise<User> {
  await delay(400);
  const map: Record<string, string> = {
    'student@test.com': 'student-1',
    'kim@test.com': 'student-2',
    'lee@test.com': 'student-3',
    'park@test.com': 'student-4',
    'choi@test.com': 'student-5',
    'jung@test.com': 'student-6',
    'admin@test.com': 'admin-1',
  };
  if (password !== '1234') throw new Error('비밀번호가 올바르지 않습니다.');
  const userId = map[email];
  if (!userId) throw new Error('등록되지 않은 이메일입니다.');
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) throw new Error('사용자를 찾을 수 없습니다.');
  return user;
}

// Buildings
export async function getBuildingsAPI() {
  await delay(200);
  return MOCK_BUILDINGS;
}

// 오늘 체크 기록 (학생)
export async function getTodayRecordAPI(studentId: string, date: string): Promise<CheckRecord | null> {
  await delay(200);
  return runtimeRecords.find((r) => r.studentId === studentId && r.date === date) ?? null;
}

// 체크 등록/수정
export async function submitCheckAPI(
  studentId: string,
  date: string,
  roomId: string
): Promise<CheckRecord> {
  await delay(300);
  const student = MOCK_USERS.find((u) => u.id === studentId)!;
  const room = MOCK_BUILDINGS.flatMap((b) => b.floors.flatMap((f) => f.rooms)).find((r) => r.id === roomId);
  if (!room) throw new Error('장소를 찾을 수 없습니다.');

  const now = new Date();
  const checkedAt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const existing = runtimeRecords.find((r) => r.studentId === studentId && r.date === date);
  if (existing) {
    existing.roomId = room.id;
    existing.roomName = room.name;
    existing.buildingName = room.buildingName;
    existing.floorLabel = room.floorLabel;
    existing.checkedAt = checkedAt;
    existing.status = 'checked';
    return { ...existing };
  }

  const newRecord: CheckRecord = {
    id: `rec-${Date.now()}`,
    studentId,
    studentName: student.name,
    grade: student.grade ?? 0,
    classNum: student.classNum ?? 0,
    date,
    roomId: room.id,
    roomName: room.name,
    buildingName: room.buildingName,
    floorLabel: room.floorLabel,
    checkedAt,
    status: 'checked',
  };
  runtimeRecords.push(newRecord);
  return newRecord;
}

// 학생 히스토리
export async function getStudentHistoryAPI(studentId: string): Promise<CheckRecord[]> {
  await delay(200);
  return runtimeRecords.filter((r) => r.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date));
}

// 관리자: 날짜별 통계
export async function getDailyStatsAPI(date: string): Promise<DailyStats> {
  await delay(200);
  const students = MOCK_USERS.filter((u) => u.role === 'student');
  const records = runtimeRecords.filter((r) => r.date === date);
  const checked = records.filter((r) => r.status === 'checked').length;
  return { date, total: students.length, checked, unchecked: students.length - checked };
}

// 관리자: 장소별 현황
export async function getRoomStatsAPI(date: string): Promise<RoomStat[]> {
  await delay(200);
  const records = runtimeRecords.filter((r) => r.date === date && r.status === 'checked');
  const map = new Map<string, RoomStat>();
  records.forEach((r) => {
    if (!r.roomId) return;
    const key = r.roomId;
    if (!map.has(key)) {
      map.set(key, { roomName: r.roomName, buildingName: r.buildingName, floorLabel: r.floorLabel, count: 0, students: [] });
    }
    const s = map.get(key)!;
    s.count++;
    s.students.push(`${r.grade}학년 ${r.classNum}반 ${r.studentName}`);
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

// 관리자: 미체크 학생
export async function getUncheckedStudentsAPI(date: string): Promise<CheckRecord[]> {
  await delay(200);
  const students = MOCK_USERS.filter((u) => u.role === 'student');
  const checkedIds = new Set(runtimeRecords.filter((r) => r.date === date && r.status === 'checked').map((r) => r.studentId));
  return students
    .filter((s) => !checkedIds.has(s.id))
    .map((s) => ({
      id: `unchecked-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      grade: s.grade ?? 0,
      classNum: s.classNum ?? 0,
      date,
      roomId: '',
      roomName: '',
      buildingName: '',
      floorLabel: '',
      checkedAt: '',
      status: 'unchecked' as const,
    }));
}

// 관리자: 전체 기록 (날짜별)
export async function getAllRecordsAPI(date: string): Promise<CheckRecord[]> {
  await delay(200);
  return runtimeRecords.filter((r) => r.date === date);
}

// 관리자: 수동 입력
export async function manualCheckAPI(
  studentId: string,
  date: string,
  roomId: string
): Promise<CheckRecord> {
  return submitCheckAPI(studentId, date, roomId);
}
