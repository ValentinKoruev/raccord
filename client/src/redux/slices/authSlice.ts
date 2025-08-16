import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthOutput, TokenData } from '@shared/types/api';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  isLoggedIn: boolean;
  user: AuthOutput | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<TokenData>) {
      // TODO: add proper parse validation
      const jwtData = jwtDecode<{ sub: string; username: string }>(action.payload.accessToken);
      state.user = {
        userId: jwtData.sub,
        username: jwtData.username,
      };
      state.isLoggedIn = true;
    },
    invalidateAuth(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { setAuth, invalidateAuth } = authSlice.actions;

export default authSlice.reducer;
