import { useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/content/chatSlice';
import contentReducer from './slices/content';
import sessionReducer from './slices/sessionSlice';
import modalReducer from './slices/modalSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  content: contentReducer,
  chat: chatReducer,
  modal: modalReducer,
  session: sessionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
