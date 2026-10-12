import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type TOrderState = {
  orderData: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  orderData: null,
  orderRequest: false,
  orderModalData: null,
};

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredientIds: string[]) => {
    const order = await orderBurgerApi(ingredientIds);
    return order.order;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state: TOrderState) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.orderData = null;
      });
  },
});

export default orderSlice.reducer;
export const getOrderRequestSelector = (state: RootState): boolean =>
  state.order.orderRequest;
export const getOrderModalDataSelector = (state: RootState): TOrder | null =>
  state.order.orderModalData;
export const getOrderDataSelector = (state: RootState): TOrder | null =>
  state.order.orderData;

export const { clearOrder } = orderSlice.actions;