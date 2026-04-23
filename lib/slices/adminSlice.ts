import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminState } from '@/types';
import { getDailyStatsAPI, getRoomStatsAPI, getUncheckedStudentsAPI, getAllRecordsAPI, manualCheckAPI } from '@/lib/api';

const todayStr = new Date().toISOString().split('T')[0];

const initialState: AdminState = {
  stats: null,
  roomStats: [],
  uncheckedStudents: [],
  allRecords: [],
  selectedDate: todayStr,
  loading: false,
  error: null,
};

export const fetchAdminData = createAsyncThunk(
  'admin/fetchAll',
  async (date: string, { rejectWithValue }) => {
    try {
      const [stats, roomStats, unchecked, all] = await Promise.all([
        getDailyStatsAPI(date),
        getRoomStatsAPI(date),
        getUncheckedStudentsAPI(date),
        getAllRecordsAPI(date),
      ]);
      return { stats, roomStats, unchecked, all };
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : '데이터 로드 실패');
    }
  }
);

export const manualCheck = createAsyncThunk(
  'admin/manualCheck',
  async ({ studentId, date, roomId }: { studentId: string; date: string; roomId: string }, { rejectWithValue, dispatch }) => {
    try {
      await manualCheckAPI(studentId, date, roomId);
      dispatch(fetchAdminData(date));
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : '수동 입력 실패');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.roomStats = action.payload.roomStats;
        state.uncheckedStudents = action.payload.unchecked;
        state.allRecords = action.payload.all;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedDate, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
