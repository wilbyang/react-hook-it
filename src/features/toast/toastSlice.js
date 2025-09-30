import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, message, type, createdAt }
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(message, type = 'error') {
        return { payload: { id: nanoid(), message, type, createdAt: Date.now() } };
      }
    },
    removeToast(state, action) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    clearToasts(state) {
      state.items = [];
    }
  }
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
