import { getOrdersApi, getUserApi, loginUserApi, logoutApi, registerUserApi, type TLoginData, type TRegisterData, updateUserApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '@utils/cookie';
import type { RootState } from '@services/store.ts';
import type { TOrder, TUser } from '@utils-types';

type TUserState = {
  orders: TOrder[];
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: TUserState = {
  orders: [],
  user: null,
  isAuthChecked: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) => {
    const data = await registerUserApi({ email, name, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ email, name, password }: TRegisterData) => {
    const data = await updateUserApi({ email, name, password });
    return data.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const getOrders = createAsyncThunk('user/getOrders', async () => {
  const data = await getOrdersApi();
  return data;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не удалось войти';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { authChecked } = userSlice.actions;
export default userSlice.reducer;

export const getUserSelector = (state: RootState): TUser | null => state.user.user;
export const getIsAuthCheckedSelector = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const getUserErrorSelector = (state: RootState): string | null =>
  state.user.error;
export const getUserOrdersSelector = (state: RootState): TOrder[] => state.user.orders;