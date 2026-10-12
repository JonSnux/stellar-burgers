import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@services/store.ts';
import type { TFeedState, TOrder } from '@utils-types';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  const feeds = await getFeedsApi();
  return feeds;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default feedSlice.reducer;
export const getOrdersSelector = (state: RootState): TOrder[] => state.feed.orders;
export const getTotalOrderSelector = (state: RootState): number => state.feed.total;
export const getTotalTodaySelector = (state: RootState): number => state.feed.totalToday;
export const getOrdersLoadingSelector = (state: RootState): boolean =>
  state.feed.isLoading;
export const getOrdersErrorSelector = (state: RootState): unknown => state.feed.error;