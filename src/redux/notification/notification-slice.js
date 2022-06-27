import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getNotificationsService} from "../../api/notification";

const initialState = {
  notifications: [], status: 'idle',
}

export const getNotificationsAction = createAsyncThunk('notification/getNotifications', async (payload) => {
  return await getNotificationsService(payload);
})

export const notificationSlice = createSlice({
  name: 'notification', initialState, reducers: {
    getAllNotification: (state, action) => {
      state.notifications = action.payload;
    }, getMoreNotification: (state, action) => {
      state.notifications = [...state.notifications, ...action.payload];
    }
  }, extraReducers: {
    [getNotificationsAction.pending]: (state) => {
      state.status = 'loading';

    }, [getNotificationsAction.fulfilled]: (state, action) => {
      state.status = 'idle';
      if (Array.isArray(action.payload)) {
        state.notifications = action.payload || [];
      } else {
        state.notifications = [];
      }
    }
  }
})

export const {getAllNotification, getMoreNotification} = notificationSlice.actions;

export default notificationSlice.reducer;

