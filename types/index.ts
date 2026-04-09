export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  grade?: number;
  classNum?: number;
  studentNum?: number;
  admissionYear?: number;
}

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export interface Floor {
  id: string;
  number: number;
  label: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  floorId: string;
  buildingId: string;
  buildingName: string;
  floorLabel: string;
}

export type CheckStatus = 'checked' | 'unchecked';

export interface CheckRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  classNum: number;
  date: string;
  roomId: string;
  roomName: string;
  buildingName: string;
  floorLabel: string;
  checkedAt: string;
  status: CheckStatus;
}

export interface DailyStats {
  date: string;
  total: number;
  checked: number;
  unchecked: number;
}

export interface RoomStat {
  roomName: string;
  buildingName: string;
  floorLabel: string;
  count: number;
  students: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CheckState {
  todayRecord: CheckRecord | null;
  history: CheckRecord[];
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  stats: DailyStats | null;
  roomStats: RoomStat[];
  uncheckedStudents: CheckRecord[];
  allRecords: CheckRecord[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
}
