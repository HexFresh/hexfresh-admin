import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {countNotification} from "../api/notification";

const initialState = {
  counter: {
    seen: null, unseen: null, total: null,
  }, status: 'idle',
}

export const getCountNotificationAction = createAsyncThunk('notification/getCountNotification', async () => {
  return await countNotification();
})

export const countNotificationSlice = createSlice({
  name: 'countNotification', initialState, reducers: {
    getCounter: (state, payload) => {
      state.counter = payload;
    }
  }, extraReducers: {
    [getCountNotificationAction.fulfilled]: (state, action) => {
      state.status = 'loading';
      state.counter = action.payload || {};
    }
  }
});

export const {getCounter} = countNotificationSlice.actions;

export default countNotificationSlice.reducer;