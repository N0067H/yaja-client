import axios from './axios';
import { User, Building, CheckRecord, DailyStats, RoomStat } from '@/types';

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginAPI(
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> {
  const res = await axios.post('/auth/login', { email, password });
  return res.data.data;
}

export async function logoutAPI(): Promise<void> {
  await axios.post('/auth/logout');
}

// ─── Buildings ───────────────────────────────────────────────────────────────

export async function getBuildingsAPI(): Promise<Building[]> {
  const res = await axios.get('/buildings');
  return res.data.data;
}

// ─── Student ─────────────────────────────────────────────────────────────────

export async function getTodayRecordAPI(
  studentId: string,
  date: string
): Promise<CheckRecord | null> {
  const res = await axios.get(`/students/${studentId}/check`, { params: { date } });
  const raw = res.data.data;
  return raw ? mapRecord(raw) : null;
}

export async function submitCheckAPI(
  studentId: string,
  date: string,
  roomId: string
): Promise<CheckRecord> {
  const res = await axios.post(`/students/${studentId}/check`, { date, roomId });
  return mapRecord(res.data.data);
}

export async function getStudentHistoryAPI(studentId: string): Promise<CheckRecord[]> {
  const res = await axios.get(`/students/${studentId}/history`);
  return (res.data.data as RawRecord[]).map(mapRecord);
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function getDailyStatsAPI(date: string): Promise<DailyStats> {
  const res = await axios.get('/admin/stats', { params: { date } });
  return res.data.data;
}

export async function getRoomStatsAPI(date: string): Promise<RoomStat[]> {
  const res = await axios.get('/admin/room-stats', { params: { date } });
  return res.data.data;
}

export async function getUncheckedStudentsAPI(date: string): Promise<CheckRecord[]> {
  const res = await axios.get('/admin/unchecked', { params: { date } });
  return (res.data.data as RawRecord[]).map(mapRecord);
}

export async function getAllRecordsAPI(date: string): Promise<CheckRecord[]> {
  const res = await axios.get('/admin/records', { params: { date } });
  return (res.data.data as RawRecord[]).map(mapRecord);
}

export async function getAllRecordsRangeAPI(
  startDate: string,
  endDate: string
): Promise<CheckRecord[]> {
  const res = await axios.get('/admin/records', { params: { startDate, endDate } });
  return (res.data.data as RawRecord[]).map(mapRecord);
}

export async function manualCheckAPI(
  studentId: string,
  date: string,
  roomId: string
): Promise<CheckRecord> {
  const res = await axios.post('/admin/check', { studentId, date, roomId });
  return mapRecord(res.data.data);
}

// ─── Internal mapper ─────────────────────────────────────────────────────────
// API 명세의 'class' 필드를 내부 타입 'classNum'으로 정규화

interface RawRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  class?: number;
  classNum?: number;
  date: string;
  roomId: string | null;
  roomName: string | null;
  buildingName: string | null;
  floorLabel: string | null;
  checkedAt: string | null;
  status: 'checked' | 'unchecked';
}

function mapRecord(r: RawRecord): CheckRecord {
  return {
    id: r.id,
    studentId: r.studentId,
    studentName: r.studentName,
    grade: r.grade,
    classNum: r.classNum ?? r.class ?? 0,
    date: r.date,
    roomId: r.roomId ?? '',
    roomName: r.roomName ?? '',
    buildingName: r.buildingName ?? '',
    floorLabel: r.floorLabel ?? '',
    checkedAt: r.checkedAt ?? '',
    status: r.status,
  };
}
