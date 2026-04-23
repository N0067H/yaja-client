import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CheckState } from '@/types';
import { getTodayRecordAPI, submitCheckAPI, getStudentHistoryAPI } from '@/lib/api';

const initialState: CheckState = {
  todayRecord: null,
  history: [],
  loading: false,
  error: null,
};

export const fetchTodayRecord = createAsyncThunk(
  'check/fetchToday',
  async ({ studentId, date }: { studentId: string; date: string }, { rejectWithValue }) => {
    try {
      return await getTodayRecordAPI(studentId, date);
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : '오류 발생');
    }
  }
);

export const submitCheck = createAsyncThunk(
  'check/submit',
  async ({ studentId, date, roomId }: { studentId: string; date: string; roomId: string }, { rejectWithValue }) => {
    try {
      return await submitCheckAPI(studentId, date, roomId);
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : '체크 실패');
    }
  }
);

export const fetchHistory = createAsyncThunk(
  'check/fetchHistory',
  async (studentId: string, { rejectWithValue }) => {
    try {
      return await getStudentHistoryAPI(studentId);
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : '오류 발생');
    }
  }
);

const checkSlice = createSlice({
  name: 'check',
  initialState,
  reducers: {
    clearCheckError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayRecord.pending, (state) => { state.loading = true; })
      .addCase(fetchTodayRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.todayRecord = action.payload;
      })
      .addCase(fetchTodayRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitCheck.pending, (state) => { state.loading = true; })
      .addCase(submitCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.todayRecord = action.payload;
      })
      .addCase(submitCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCheckError } = checkSlice.actions;
export default checkSlice.reducer;
