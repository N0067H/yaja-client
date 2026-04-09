import { User, Building, CheckRecord } from '@/types';

export const MOCK_USERS: User[] = [
  { id: 'student-1', name: '홍길동', role: 'student', grade: 1, classNum: 2, studentNum: 15, admissionYear: 2025 },
  { id: 'student-2', name: '김민준', role: 'student', grade: 1, classNum: 1, studentNum: 3, admissionYear: 2025 },
  { id: 'student-3', name: '이서연', role: 'student', grade: 2, classNum: 3, studentNum: 8, admissionYear: 2024 },
  { id: 'student-4', name: '박지호', role: 'student', grade: 3, classNum: 2, studentNum: 21, admissionYear: 2023 },
  { id: 'student-5', name: '최유나', role: 'student', grade: 2, classNum: 1, studentNum: 11, admissionYear: 2024 },
  { id: 'student-6', name: '정도윤', role: 'student', grade: 1, classNum: 3, studentNum: 7, admissionYear: 2025 },
  { id: 'student-7', name: '강서준', role: 'student', grade: 3, classNum: 1, studentNum: 4, admissionYear: 2023 },
  { id: 'student-8', name: '윤하은', role: 'student', grade: 2, classNum: 2, studentNum: 19, admissionYear: 2024 },
  { id: 'admin-1', name: '이담임', role: 'admin' },
];

export const MOCK_BUILDINGS: Building[] = [
  {
    id: 'building-1',
    name: '호연관',
    floors: [
      {
        id: 'floor-1-1', number: 1, label: '1층',
        rooms: [
          { id: 'room-101', name: '늘봄도서관', floorId: 'floor-1-1', buildingId: 'building-1', buildingName: '호연관', floorLabel: '1층' },
          { id: 'room-102', name: '세미나실', floorId: 'floor-1-1', buildingId: 'building-1', buildingName: '호연관', floorLabel: '1층' },
          { id: 'room-103', name: '콘퍼런스홀', floorId: 'floor-1-1', buildingId: 'building-1', buildingName: '호연관', floorLabel: '1층' },
        ],
      },
      {
        id: 'floor-1-2', number: 2, label: '2층',
        rooms: [
          { id: 'room-201', name: 'SW개발부', floorId: 'floor-1-2', buildingId: 'building-1', buildingName: '호연관', floorLabel: '2층' },
          { id: 'room-202', name: 'LAB I', floorId: 'floor-1-2', buildingId: 'building-1', buildingName: '호연관', floorLabel: '2층' },
          { id: 'room-203', name: '동아리실', floorId: 'floor-1-2', buildingId: 'building-1', buildingName: '호연관', floorLabel: '2층' },
        ],
      },
      {
        id: 'floor-1-3', number: 3, label: '3층',
        rooms: [
          { id: 'room-301', name: 'LAB IV', floorId: 'floor-1-3', buildingId: 'building-1', buildingName: '호연관', floorLabel: '3층' },
          { id: 'room-302', name: 'LAB V', floorId: 'floor-1-3', buildingId: 'building-1', buildingName: '호연관', floorLabel: '3층' },
          { id: 'room-303', name: 'NCS모바일프로그래밍실습실', floorId: 'floor-1-3', buildingId: 'building-1', buildingName: '호연관', floorLabel: '3층' },
        ],
      },
    ],
  },
  {
    id: 'building-2',
    name: '정심관',
    floors: [
      {
        id: 'floor-2-1', number: 1, label: '1층',
        rooms: [
          { id: 'room-401', name: '기숙사 열람실', floorId: 'floor-2-1', buildingId: 'building-2', buildingName: '정심관', floorLabel: '1층' },
          { id: 'room-402', name: '자습실 A', floorId: 'floor-2-1', buildingId: 'building-2', buildingName: '정심관', floorLabel: '1층' },
        ],
      },
      {
        id: 'floor-2-2', number: 2, label: '2층',
        rooms: [
          { id: 'room-403', name: '자습실 B', floorId: 'floor-2-2', buildingId: 'building-2', buildingName: '정심관', floorLabel: '2층' },
          { id: 'room-404', name: '멀티미디어실', floorId: 'floor-2-2', buildingId: 'building-2', buildingName: '정심관', floorLabel: '2층' },
        ],
      },
    ],
  },
  {
    id: 'building-3',
    name: '교외',
    floors: [
      {
        id: 'floor-3-1', number: 1, label: '-',
        rooms: [
          { id: 'room-501', name: '교외 (사유 있음)', floorId: 'floor-3-1', buildingId: 'building-3', buildingName: '교외', floorLabel: '-' },
        ],
      },
    ],
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const MOCK_RECORDS: CheckRecord[] = [
  // 오늘 - student-2, 3, 4, 5, 7, 8 체크완료 / student-1, 6 미체크
  { id: 'rec-1', studentId: 'student-2', studentName: '김민준', grade: 1, classNum: 1, date: today, roomId: 'room-201', roomName: 'SW개발부', buildingName: '호연관', floorLabel: '2층', checkedAt: '19:05', status: 'checked' },
  { id: 'rec-2', studentId: 'student-3', studentName: '이서연', grade: 2, classNum: 3, date: today, roomId: 'room-301', roomName: 'LAB IV', buildingName: '호연관', floorLabel: '3층', checkedAt: '19:12', status: 'checked' },
  { id: 'rec-3', studentId: 'student-4', studentName: '박지호', grade: 3, classNum: 2, date: today, roomId: 'room-101', roomName: '늘봄도서관', buildingName: '호연관', floorLabel: '1층', checkedAt: '19:03', status: 'checked' },
  { id: 'rec-4', studentId: 'student-5', studentName: '최유나', grade: 2, classNum: 1, date: today, roomId: 'room-401', roomName: '기숙사 열람실', buildingName: '정심관', floorLabel: '1층', checkedAt: '19:20', status: 'checked' },
  { id: 'rec-5', studentId: 'student-7', studentName: '강서준', grade: 3, classNum: 1, date: today, roomId: 'room-302', roomName: 'LAB V', buildingName: '호연관', floorLabel: '3층', checkedAt: '18:58', status: 'checked' },
  { id: 'rec-6', studentId: 'student-8', studentName: '윤하은', grade: 2, classNum: 2, date: today, roomId: 'room-201', roomName: 'SW개발부', buildingName: '호연관', floorLabel: '2층', checkedAt: '19:08', status: 'checked' },
  { id: 'rec-u1', studentId: 'student-1', studentName: '홍길동', grade: 1, classNum: 2, date: today, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },
  { id: 'rec-u2', studentId: 'student-6', studentName: '정도윤', grade: 1, classNum: 3, date: today, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },

  // 어제
  { id: 'rec-y1', studentId: 'student-1', studentName: '홍길동', grade: 1, classNum: 2, date: yesterday, roomId: 'room-201', roomName: 'SW개발부', buildingName: '호연관', floorLabel: '2층', checkedAt: '19:10', status: 'checked' },
  { id: 'rec-y2', studentId: 'student-2', studentName: '김민준', grade: 1, classNum: 1, date: yesterday, roomId: 'room-101', roomName: '늘봄도서관', buildingName: '호연관', floorLabel: '1층', checkedAt: '19:02', status: 'checked' },
  { id: 'rec-y3', studentId: 'student-3', studentName: '이서연', grade: 2, classNum: 3, date: yesterday, roomId: 'room-301', roomName: 'LAB IV', buildingName: '호연관', floorLabel: '3층', checkedAt: '19:15', status: 'checked' },
  { id: 'rec-y4', studentId: 'student-4', studentName: '박지호', grade: 3, classNum: 2, date: yesterday, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },
  { id: 'rec-y5', studentId: 'student-5', studentName: '최유나', grade: 2, classNum: 1, date: yesterday, roomId: 'room-403', roomName: '자습실 B', buildingName: '정심관', floorLabel: '2층', checkedAt: '19:30', status: 'checked' },
  { id: 'rec-y6', studentId: 'student-6', studentName: '정도윤', grade: 1, classNum: 3, date: yesterday, roomId: 'room-202', roomName: 'LAB I', buildingName: '호연관', floorLabel: '2층', checkedAt: '18:55', status: 'checked' },
  { id: 'rec-y7', studentId: 'student-7', studentName: '강서준', grade: 3, classNum: 1, date: yesterday, roomId: 'room-201', roomName: 'SW개발부', buildingName: '호연관', floorLabel: '2층', checkedAt: '19:00', status: 'checked' },
  { id: 'rec-y8', studentId: 'student-8', studentName: '윤하은', grade: 2, classNum: 2, date: yesterday, roomId: 'room-201', roomName: 'SW개발부', buildingName: '호연관', floorLabel: '2층', checkedAt: '19:22', status: 'checked' },

  // 2일전
  { id: 'rec-d1', studentId: 'student-1', studentName: '홍길동', grade: 1, classNum: 2, date: twoDaysAgo, roomId: 'room-302', roomName: 'LAB V', buildingName: '호연관', floorLabel: '3층', checkedAt: '19:07', status: 'checked' },
  { id: 'rec-d2', studentId: 'student-2', studentName: '김민준', grade: 1, classNum: 1, date: twoDaysAgo, roomId: 'room-201', roomName: 'SW개발부', buildingName: '호연관', floorLabel: '2층', checkedAt: '19:01', status: 'checked' },
  { id: 'rec-d3', studentId: 'student-3', studentName: '이서연', grade: 2, classNum: 3, date: twoDaysAgo, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },
  { id: 'rec-d4', studentId: 'student-4', studentName: '박지호', grade: 3, classNum: 2, date: twoDaysAgo, roomId: 'room-101', roomName: '늘봄도서관', buildingName: '호연관', floorLabel: '1층', checkedAt: '19:18', status: 'checked' },
  { id: 'rec-d5', studentId: 'student-5', studentName: '최유나', grade: 2, classNum: 1, date: twoDaysAgo, roomId: 'room-501', roomName: '교외 (사유 있음)', buildingName: '교외', floorLabel: '-', checkedAt: '19:40', status: 'checked' },
];
