import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getNotificationsService} from "../../api/notification";

const initialState = {
  notifications: [], status: 'idle',
}

export const getNotificationsAction = createAsyncThunk('notification/getNotifications', async () => {
  return await getNotificationsService();
})

export const notificationSlice = createSlice({
  name: 'notification', initialState, reducers: {
    getAllNotification: (state, payload) => {
      state.notifications = payload;
    }
  }, extraReducers: {
    [getNotificationsAction.pending]: (state) => {
      state.status = 'loading';

    }, [getNotificationsAction.fulfilled]: (state, action) => {
      state.status = 'idle';
      state.notifications = action.payload;
    }
  }
})

export const {getAllNotification} = notificationSlice.actions;

export default notificationSlice.reducer;

